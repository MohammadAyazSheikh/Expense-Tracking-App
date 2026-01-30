import { database } from '@/libs/database';
import { supabase } from '@/libs/supabase';
import { Q, Model } from '@nozbe/watermelondb';
import { mmkvStorage } from '@/utils/storage';
import NetInfo from '@react-native-community/netinfo';
import { PendingDeletions } from '@/database/models/local';
import { Database } from '@/types/supabse/supabaseDbTypes';
import { SupabaseTableNames } from '@/types/supabse/tableTypes';

export interface SyncableModel extends Model {
    serverId: string | null;
    isSynced: boolean;
    userId?: string;
}

export interface SyncConfig<T extends SyncableModel, TableName extends SupabaseTableNames> {
    tableName: string;
    supabaseTable: TableName;
    mapServerToLocal: (
        serverData: Database['public']['Tables'][TableName]['Row'],
        model: T
    ) => void;
    mapLocalToServer: (
        localModel: T
    ) => Database['public']['Tables'][TableName]['Update'] | Database['public']['Tables'][TableName]['Insert'];
}


// Remove the default generic parameter here too
export class BaseSyncService<
    T extends SyncableModel,
    TableName extends SupabaseTableNames
> {
    protected config: SyncConfig<T, TableName>;
    private syncFlags = {
        pullDeletions: false,
        pushDeletions: false,
        pullChanges: false,
        pushChanges: false,
    };

    constructor(config: SyncConfig<T, TableName>) {
        this.config = config;
    }

    private get lastSyncKey() {
        return `last_sync_${this.config.tableName}`;
    }

    async getLastSyncTimestamp(): Promise<number> {
        const timestamp = await mmkvStorage.getItem(this.lastSyncKey);
        return timestamp ? parseInt(timestamp) : 0;
    }

    async setLastSyncTimestamp(timestamp: number) {
        await mmkvStorage.setItem(this.lastSyncKey, timestamp.toString());
    }

    private async checkNetwork(): Promise<boolean> {
        const netState = await NetInfo.fetch();
        if (!netState.isConnected) {
            console.log(`[${this.config.tableName}] Offline - skipping sync`);
            return false;
        }
        return true;
    }

    async pullDeletions(userId: string, lastSync: number) {
        if (this.syncFlags.pullDeletions) return 0;
        if (!(await this.checkNetwork())) return 0;

        this.syncFlags.pullDeletions = true;
        try {
            const { data: trashData, error } = await supabase
                .from('trash')
                .select('*')
                .eq('deleted_by', userId)
                .eq('table_name', this.config.supabaseTable)
                .gt('deleted_at', new Date(lastSync).toISOString())
                .order('deleted_at', { ascending: true });

            if (error) throw error;

            console.log(`[${this.config.tableName}] 🔥 Found ${trashData?.length || 0} deletions to apply`);

            await database.write(async () => {
                const collection = database.collections.get<T>(this.config.tableName);

                for (const trash of trashData || []) {
                    const existing = await collection
                        .query(Q.where('server_id', trash.record_id))
                        .fetch();

                    if (existing.length > 0) {
                        console.log(`[${this.config.tableName}] Deleting local: ${trash.record_id}`);
                        await existing[0].destroyPermanently();
                    }
                }
            });

            return trashData?.length || 0;
        } catch (error) {
            console.error(`[${this.config.tableName}] Failed to pull deletions:`, error);
            throw error;
        } finally {
            this.syncFlags.pullDeletions = false;
        }
    }

    async pushDeletions() {
        if (this.syncFlags.pushDeletions) return 0;
        if (!(await this.checkNetwork())) return 0;

        this.syncFlags.pushDeletions = true;

        try {
            const pendingDeletionsCollection = database.collections.get<PendingDeletions>('pending_deletions');
            const pending = await pendingDeletionsCollection
                .query(Q.where('table_name', this.config.tableName))
                .fetch();

            let successCount = 0;

            for (const deletion of pending) {
                try {
                    const { error } = await supabase
                        .from(this.config.supabaseTable)
                        .delete()
                        .eq('id', deletion.serverId);

                    if (!error) {
                        await database.write(async () => {
                            await deletion.destroyPermanently();
                        });
                        successCount++;
                    } else {
                        throw error;
                    }
                } catch (error) {
                    console.error(`[${this.config.tableName}] Failed to push deletion:`, error);
                }
            }

            console.log(`[${this.config.tableName}] 🔥 Pushed ${successCount} deletions to server`);
            return successCount;
        } finally {
            this.syncFlags.pushDeletions = false;
        }
    }

    async pullChanges(userId: string, lastSync: number) {
        if (this.syncFlags.pullChanges) return 0;
        if (!(await this.checkNetwork())) return 0;

        this.syncFlags.pullChanges = true;

        try {
            const { data: serverData, error } = await supabase
                .from(this.config.supabaseTable)
                .select('*')
                .eq('user_id', userId)
                .gt('updated_at', new Date(lastSync).toISOString())
                .order('updated_at', { ascending: true });

            if (error) throw error;

            console.log(`[${this.config.tableName}] 🔥 Found ${serverData?.length || 0} updates to apply`);

            const collection = database.collections.get<T>(this.config.tableName);

            await database.write(async () => {
                for (const serverRecord of serverData || []) {
                    const existing = await collection
                        .query(Q.where('server_id', serverRecord.id))
                        .fetch();

                    if (existing.length > 0) {
                        // Update existing
                        await existing[0].update((model) => {
                            this.config.mapServerToLocal(serverRecord, model);
                            (model as any).isSynced = true;
                        });
                    } else {
                        // Create new
                        await collection.create((model) => {
                            (model as any).serverId = serverRecord.id;
                            this.config.mapServerToLocal(serverRecord, model);
                            (model as any).isSynced = true;
                        });
                    }
                }
            });

            return serverData?.length || 0;
        } catch (error) {
            console.error(`[${this.config.tableName}] Failed to pull changes:`, error);
            throw error;
        } finally {
            this.syncFlags.pullChanges = false;
        }
    }

    async pushChanges(userId: string) {
        if (this.syncFlags.pushChanges) return 0;
        if (!(await this.checkNetwork())) return 0;

        this.syncFlags.pushChanges = true;

        try {
            const collection = database.collections.get<T>(this.config.tableName);
            const unsyncedRecords = await collection
                .query(Q.where('is_synced', false))
                .fetch();

            let successCount = 0;

            for (const record of unsyncedRecords) {
                try {
                    if (record.serverId) {
                        // Update existing
                        const updateData = this.config.mapLocalToServer(record);

                        const { error } = await supabase
                            .from(this.config.supabaseTable)
                            .update({
                                ...updateData,
                                updated_at: new Date().toISOString(),
                            } as any)
                            .eq('id', record.serverId);

                        if (error) throw error;

                        await database.write(async () => {
                            await record.update((r) => {
                                (r as any).isSynced = true;
                            });
                        });
                        successCount++;
                    } else {
                        // Insert new
                        const insertData = this.config.mapLocalToServer(record);

                        const { data, error } = await supabase
                            .from(this.config.supabaseTable)
                            .insert({
                                ...insertData,
                                user_id: userId,
                            } as any)
                            .select()
                            .single();

                        if (error) throw error;

                        await database.write(async () => {
                            await record.update((r) => {
                                (r as any).serverId = data.id;
                                (r as any).isSynced = true;
                            });
                        });
                        successCount++;
                    }
                } catch (error) {
                    console.error(`[${this.config.tableName}] Failed to sync record:`, record.id, error);
                }
            }

            console.log(`[${this.config.tableName}] 🔥 Pushed ${successCount} local changes to server`);
            return successCount;
        } finally {
            this.syncFlags.pushChanges = false;
        }
    }

    async sync(userId: string) {
        const lastSync = await this.getLastSyncTimestamp();
        const currentTimestamp = Date.now();

        console.log(`[${this.config.tableName}] Starting sync (last: ${new Date(lastSync).toISOString()})`);

        const deletionPullCount = await this.pullDeletions(userId, lastSync);
        const deletionPushCount = await this.pushDeletions();
        const updateCount = await this.pullChanges(userId, lastSync);
        const pushCount = await this.pushChanges(userId);

        await this.setLastSyncTimestamp(currentTimestamp);

        console.log(
            `[${this.config.tableName}] Sync complete: ${deletionPullCount} deleted, ${deletionPushCount} pushed deletions, ${updateCount} updated, ${pushCount} pushed`
        );

        return { deletionPullCount, deletionPushCount, updateCount, pushCount };
    }
}
