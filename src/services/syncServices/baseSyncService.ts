import { database } from '@/libs/database';
import { supabase } from '@/libs/supabase';
import { Q, Model } from '@nozbe/watermelondb';
import { mmkvStorage } from '@/utils/storage';
import NetInfo from '@react-native-community/netinfo';
import { PendingDeletions } from '@/database/models/local';
import { SupabaseTableNames, SupabaseTables } from '@/types/supabase/tableTypes';

export interface SyncableModel extends Model {
    serverId: string | null;
    isSynced: boolean;
    userId?: string;
}

export interface SyncConfig<localData extends SyncableModel, serverTableName extends SupabaseTableNames> {
    localTable: string;
    supabaseTable: serverTableName;

    mapServerToLocal: (
        serverData: SupabaseTables[serverTableName]['Update'] | SupabaseTables[serverTableName]['Insert'],
        localData: localData
    ) => void;

    mapLocalToServer: (
        localData: localData
    ) => SupabaseTables[serverTableName]['Update'] | SupabaseTables[serverTableName]['Insert'];

    resolveConflict?: (
        localData: localData,
        serverData: SupabaseTables[serverTableName]['Row']
    ) => 'local' | 'server' | 'merge';

    mergeConflict?: (
        localData: localData,
        serverData: SupabaseTables[serverTableName]['Row'],
        modelToUpdate: localData
    ) => void;
}


export class BaseSyncService<localData extends SyncableModel, serverTableName extends SupabaseTableNames> {
    protected config: SyncConfig<localData, serverTableName>;
    private syncFlags = {
        pullDeletions: false,
        pushDeletions: false,
        pullChanges: false,
        pushChanges: false,
    };

    constructor(config: SyncConfig<localData, serverTableName>) {
        this.config = config;
    }

    private get lastSyncKey() {
        return `last_sync_${this.config.localTable}`;
    }

    async getLastSyncTimestamp(): Promise<number> {
        const timestamp = await mmkvStorage.getItem(this.lastSyncKey);
        return timestamp ? parseInt(timestamp) : 0;
    }

    async setLastSyncTimestamp(timestamp: number) {
        await mmkvStorage.setItem(this.lastSyncKey, timestamp.toString());
    }


    protected async getLocalIdFromServerId(
        tableName: string,
        serverId: string
    ): Promise<string | null> {
        const collection = database.collections.get(tableName);
        const records = await collection
            .query(Q.where('server_id', serverId))
            .fetch();

        return records.length > 0 ? records[0].id : null;
    }

    private async checkNetwork(): Promise<boolean> {
        const netState = await NetInfo.fetch();
        if (!netState.isConnected) {
            console.log(`[${this.config.localTable}] Offline - skipping sync`);
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

            console.log(`[${this.config.localTable}] 🔥 Found ${trashData?.length || 0} deletions to apply`);

            const collection = database.collections.get<T>(this.config.localTable);

            await database.write(async () => {
                for (const trash of trashData || []) {
                    const existing = await collection
                        .query(Q.where('server_id', trash.record_id))
                        .fetch();

                    if (existing.length > 0) {
                        console.log(`[${this.config.localTable}] Deleting local: ${trash.record_id}`);
                        await existing[0].destroyPermanently();
                    }
                }
            });

            return trashData?.length || 0;
        } catch (error) {
            console.error(`[${this.config.localTable}] Failed to pull deletions:`, error);
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
                .query(Q.where('table_name', this.config.localTable))
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
                    console.error(`[${this.config.localTable}] Failed to push deletion:`, error);
                }
            }

            console.log(`[${this.config.localTable}] 🔥 Pushed ${successCount} deletions to server`);
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
                // .eq('user_id', userId)
                .gt('updated_at', new Date(lastSync).toISOString())
                .order('updated_at', { ascending: true });

            if (error) throw error;

            console.log(`[${this.config.localTable}] 🔥 Found ${serverData?.length || 0} updates to apply`);

            const collection = database.collections.get<localData>(this.config.localTable);

            await database.write(async () => {
                for (const serverRecord of serverData || []) {
                    const existing = await collection
                        .query(Q.where('server_id', serverRecord.id))
                        .fetch();

                    if (existing.length > 0) {
                        const localRecord = existing[0];

                        // CONFLICT DETECTION: Check if local record is unsynced
                        if (!localRecord.isSynced) {
                            console.log(`[${this.config.localTable}] ⚠️ Conflict detected for ${serverRecord.id}`);

                            // Use custom conflict resolution or default to local wins
                            const resolution = this.config.resolveConflict
                                ? this.config.resolveConflict(localRecord, serverRecord)
                                : 'local'; // Default: local changes win

                            if (resolution === 'server') {
                                // Server wins - overwrite local
                                await localRecord.update((model) => {
                                    this.config.mapServerToLocal(serverRecord, model);
                                    (model).isSynced = true;
                                });
                                console.log(`[${this.config.localTable}] Resolved conflict: server wins`);
                            } else if (resolution === 'local') {
                                // Local wins - skip server update
                                console.log(`[${this.config.localTable}] Resolved conflict: local wins (will push on next sync)`);
                                // Don't update - local changes will be pushed on next sync
                            } else {
                                // Merge - apply custom merge logic
                                console.log(`[${this.config.localTable}] Resolved conflict: merge`);
                                await localRecord.update((model) => {
                                    // Call the merge function if provided
                                    if (this.config.mergeConflict) {
                                        this.config.mergeConflict(localRecord, serverRecord, model);
                                    } else {
                                        // Default merge: just apply server data
                                        this.config.mapServerToLocal(serverRecord, model);
                                    }
                                    // Mark as unsynced so merged changes get pushed back
                                    (model as any).isSynced = false;
                                });
                            }
                        } else {
                            // No conflict - local is synced, safe to update
                            await localRecord.update((model) => {
                                this.config.mapServerToLocal(serverRecord, model);
                                (model).isSynced = true;
                            });
                        }
                    } else {
                        // Create new - no conflict possible
                        await collection.create((model) => {
                            (model).serverId = serverRecord.id;
                            this.config.mapServerToLocal(serverRecord, model);
                            (model).isSynced = true;
                        });
                    }
                }
            });

            return serverData?.length || 0;
        } catch (error) {
            console.error(`[${this.config.localTable}] Failed to pull changes:`, error);
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
            const collection = database.collections.get<localData>(this.config.localTable);
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
                            } as any)
                            .eq('id', record.serverId);

                        if (error) throw error;

                        await database.write(async () => {
                            await record.update((r) => {
                                (r).isSynced = true;
                            });
                        });
                        successCount++;
                    } else {
                        // Insert new
                        const insertData = this.config.mapLocalToServer(record);

                        const { data, error } = await supabase
                            .from(this.config.supabaseTable)
                            .insert({
                                ...insertData
                            } as any)
                            .select()
                            .single();

                        if (error) throw error;

                        await database.write(async () => {
                            await record.update((r) => {
                                (r).serverId = data.id;
                                (r).isSynced = true;
                            });
                        });
                        successCount++;
                    }
                } catch (error) {
                    console.error(`[${this.config.localTable}] Failed to sync record:`, record.id, error);
                }
            }

            console.log(`[${this.config.localTable}] 🔥 Pushed ${successCount} local changes to server`);
            return successCount;
        } finally {
            this.syncFlags.pushChanges = false;
        }
    }



    async sync(userId: string) {
        const lastSync = await this.getLastSyncTimestamp();
        const currentTimestamp = Date.now();

        console.log(`[${this.config.localTable}] Starting sync (last: ${new Date(lastSync).toISOString()})`);

        // 1. Pull deletions first (remove obsolete data)
        const deletionPullCount = await this.pullDeletions(userId, lastSync);

        // 2. Push deletions
        const deletionPushCount = await this.pushDeletions();

        // 3. Pull updates/inserts (with conflict detection)
        const updateCount = await this.pullChanges(userId, lastSync);

        // 4. PUSH LOCAL CHANGES FIRST (before pulling)
        const pushCount = await this.pushChanges(userId);


        // 5. Update sync timestamp
        await this.setLastSyncTimestamp(currentTimestamp);

        console.log(
            `[${this.config.localTable}] Sync complete: ${deletionPullCount} deleted, ${deletionPushCount} pushed deletions, ${pushCount} pushed, ${updateCount} updated`
        );

        return { deletionPullCount, deletionPushCount, pushCount, updateCount };
    }
}