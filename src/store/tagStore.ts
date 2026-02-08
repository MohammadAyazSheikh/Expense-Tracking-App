import { create } from 'zustand';
import { database } from '@/libs/database';
import { supabase } from '@/libs/supabase';
import { PendingDeletions } from '@/database/models/local';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '@/store';
import { Tag } from '@/database/models/tags';
import { tagSyncService } from '@/services/syncServices/tagSyncService';

interface TagStore {
    tags: Tag[];
    deleteTag: (tagId: string) => Promise<void>;
    loadTags: () => Promise<void>;
    addTag: (data: Partial<Tag>) => Promise<void>;
    updateTag: (tagId: string, data: Partial<Tag>) => Promise<void>;
    syncNow: () => Promise<void>;
    reset: () => void;
    isLoading: boolean;
    isSyncing: boolean;
}

export const useTagStore = create<TagStore>((set, get) => ({
    tags: [],
    isLoading: false,
    isSyncing: false,

    loadTags: async () => {
        try {
            set({ isLoading: true });

            const tagsCollection = database.collections.get<Tag>('tags');
            const tags = await tagsCollection.query().fetch();
            set({ tags });

        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error?.message || 'Error loading tags',
            });
        } finally {
            set({ isLoading: false });
        }
    },

    addTag: async (data) => {
        set({ isLoading: true });
        try {
            const userId = useAuthStore.getState().user?.id;

            if (!userId) throw new Error('User not authenticated');

            const tagsCollection = database.collections.get<Tag>('tags');

            await database.write(async () => {
                await tagsCollection.create((tag) => {
                    tag.isSynced = false;
                    tag.name = data.name!;
                    tag.color = data.color!;
                });
            });

            await get().loadTags();

            Toast.show({
                type: 'success',
                text1: 'Tag added successfully',
            });

            // Background sync
            tagSyncService.pushChanges(userId);
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error?.message || 'Error adding category',
            });
        } finally {
            set({ isLoading: false });
        }
    },
    updateTag: async (tagId, data) => {
        set({ isLoading: true });
        try {
            const userId = useAuthStore.getState().user?.id;

            if (!userId) throw new Error('User not authenticated');

            const tagsCollection = database.collections.get<Tag>('tags');
            const tag = await tagsCollection.find(tagId);

            await database.write(async () => {
                await tag.update((t) => {
                    if (data.name) t.name = data.name;
                    if (data.color) t.color = data.color;
                    t.isSynced = false;
                });
            });
            await get().loadTags();
            Toast.show({
                type: 'success',
                text1: 'Tag updated successfully',
            });

            // Background sync
            tagSyncService.pushChanges(userId);
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error?.message || 'Error updating category',
            });
            console.error('Error updating category:', error);
        } finally {
            set({ isLoading: false });
        }
    },
    deleteTag: async (tagId: string) => {
        set({ isLoading: true });
        try {
            const tagsCollection = database.collections.get<Tag>('tags');
            const pendingDeletionsCollection = database.collections.get<PendingDeletions>('pending_deletions');
            const tag = await tagsCollection.find(tagId);

            const serverId = tag?.serverId;

            await database.write(async () => {
                await tag.destroyPermanently();

                if (serverId) {
                    await pendingDeletionsCollection.create((deletion) => {
                        deletion.tableName = 'tags';
                        deletion.serverId = serverId;
                        deletion.deletedAt = Date.now();
                    });
                }
            });

            await get().loadTags();

            Toast.show({
                type: 'success',
                text1: 'Tag deleted successfully',
            });

            await tagSyncService.pushDeletions();
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error?.message || 'Error deleting category',
            });
        } finally {
            set({ isLoading: false });
        }
    },
    reset: () => {
        set({
            tags: [],
            isLoading: false,
            isSyncing: false,
        });
    },
    syncNow: async () => {
        try {
            set({ isSyncing: true });
            const user = await supabase.auth.getUser();
            if (user.data.user) {
                await tagSyncService.sync(user.data.user.id);
                await get().loadTags();
            }
        } catch (error) {
            console.error('Error syncing tags:', error);
        } finally {
            set({ isSyncing: false });
        }
    },
}));