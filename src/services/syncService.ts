import { database } from '@/libs/database';
import { supabase } from '@/libs/supabase';
import NetInfo from '@react-native-community/netinfo';
import { Q } from '@nozbe/watermelondb';
import { Category } from '@/models/category';

class SyncService {
    private isSyncing = false;

    // Push local changes to Supabase
    async pushChanges() {
        if (this.isSyncing) return;

        const netState = await NetInfo.fetch();
        if (!netState.isConnected) {
            console.log('Offline - skipping push');
            return;
        }

        this.isSyncing = true;

        try {
            const categoriesCollection = database.collections.get<Category>('categories');

            // Find unsynced records
            const unsyncedCategories = await categoriesCollection
                .query(Q.where('is_synced', false))
                .fetch();

            for (const category of unsyncedCategories) {
                try {
                    if (category.serverId) {
                        // Update existing record
                        const { error } = await supabase
                            .from('categories')
                            .update({
                                name: category.name,
                                color: category.color,
                                icon: category.icon,
                                icon_family: category.iconFamily,
                                transaction_type_key: category.transactionTypeKey,
                                updated_at: new Date().toISOString(),
                            })
                            .eq('id', category.serverId);

                        if (error) throw error;

                        // Mark as synced
                        await database.write(async () => {
                            await category.update(cat => {
                                cat.isSynced = true;
                            });
                        });

                    } else {
                        // Insert new record
                        const { data, error } = await supabase
                            .from('categories')
                            .insert({
                                name: category.name,
                                color: category.color,
                                icon: category.icon,
                                icon_family: category.iconFamily,
                                transaction_type_key: category.transactionTypeKey,
                                user_id: category.userId,
                                system_category_id: category.systemCategoryId,
                            })
                            .select()
                            .single();

                        if (error) throw error;

                        // Update local record with server ID
                        await database.write(async () => {
                            await category.update(cat => {
                                cat.serverId = data.id;
                                cat.isSynced = true;
                            });
                        });
                    }

                } catch (error) {
                    console.error('Failed to sync category:', category.id, error);
                }
            }
        } finally {
            this.isSyncing = false;
        }
    }

    // Pull changes from Supabase
    async pullChanges(userId: string) {
        const netState = await NetInfo.fetch();
        if (!netState.isConnected) {
            console.log('Offline - skipping pull');
            return;
        }

        try {
            // Fetch from Supabase
            const { data: serverCategories, error } = await supabase
                .from('categories')
                .select('*')
                .eq('user_id', userId);

            if (error) throw error;

            const categoriesCollection = database.collections.get<Category>('categories');

            await database.write(async () => {
                for (const serverCat of serverCategories) {
                    // Check if exists locally
                    const existing = await categoriesCollection
                        .query(Q.where('server_id', serverCat.id))
                        .fetch();

                    if (existing.length > 0) {
                        // Update existing
                        const local = existing[0];
                        await local.update(cat => {
                            cat.name = serverCat.name;
                            cat.color = serverCat.color;
                            cat.icon = serverCat.icon;
                            cat.iconFamily = serverCat.icon_family;
                            cat.transactionTypeKey = serverCat.transaction_type_key;
                            cat.systemCategoryId = serverCat.system_category_id;
                            cat.isSynced = true;
                        });
                    } else {
                        // Create new local record
                        await categoriesCollection.create(cat => {
                            cat.serverId = serverCat.id;
                            cat.name = serverCat.name;
                            cat.color = serverCat.color;
                            cat.icon = serverCat.icon;
                            cat.iconFamily = serverCat.icon_family;
                            cat.transactionTypeKey = serverCat.transaction_type_key;
                            cat.userId = serverCat.user_id;
                            cat.systemCategoryId = serverCat.system_category_id;
                            cat.isSynced = true;
                        });
                    }
                }
            });
        } catch (error) {
            console.error('Failed to pull changes:', error);
        }
    }

    // Full sync: pull then push
    async sync(userId: string) {
        await this.pullChanges(userId);
        await this.pushChanges();
    }
}

export const syncService = new SyncService();