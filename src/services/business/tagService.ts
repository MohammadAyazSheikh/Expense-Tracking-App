import { database } from '@/libs/database';
import { Tag } from '@/database/models/tags';
import { PendingDeletions } from '@/database/models/local';
import Toast from 'react-native-toast-message';
import { tagSyncService } from '@/services/syncServices/tagSyncService';

interface CreateTagData {
    name: string;
    color: string;
    userId: string;
}

interface UpdateTagData {
    name?: string;
    color?: string;
}

export const tagService = {
    /**
     * Create a new tag
     */
    async create(data: CreateTagData): Promise<Tag> {
        try {
            const tagsCollection = database.collections.get<Tag>('tags');

            const newTag = await database.write(async () => {
                return await tagsCollection.create((tag) => {
                    tag.name = data.name;
                    tag.color = data.color;
                    tag.userId = data.userId;
                    tag.isSynced = false;
                });
            });

            Toast.show({
                type: 'success',
                text1: 'Tag added successfully',
            });

            // Background sync
            tagSyncService.pushChanges(data.userId);

            return newTag;
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error?.message || 'Error adding tag',
            });
            throw error;
        }
    },

    /**
     * Update an existing tag
     */
    async update(tagId: string, data: UpdateTagData, userId: string): Promise<void> {
        try {
            const tagsCollection = database.collections.get<Tag>('tags');
            const tag = await tagsCollection.find(tagId);

            await database.write(async () => {
                await tag.update((t) => {
                    if (data.name) t.name = data.name;
                    if (data.color) t.color = data.color;
                    t.isSynced = false;
                });
            });

            Toast.show({
                type: 'success',
                text1: 'Tag updated successfully',
            });

            // Background sync
            tagSyncService.pushChanges(userId);
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error?.message || 'Error updating tag',
            });
            console.error('Error updating tag:', error);
            throw error;
        }
    },

    /**
     * Delete a tag
     */
    async delete(tagId: string): Promise<void> {
        try {
            const tagsCollection = database.collections.get<Tag>('tags');
            const pendingDeletionsCollection = database.collections.get<PendingDeletions>('pending_deletions');
            const tag = await tagsCollection.find(tagId);

            const serverId = tag?.serverId;

            await database.write(async () => {
                await tag.destroyPermanently();

                // Track deletion for sync if it has a server ID
                if (serverId) {
                    await pendingDeletionsCollection.create((deletion) => {
                        deletion.tableName = 'tags';
                        deletion.serverId = serverId;
                        deletion.deletedAt = Date.now();
                    });
                }
            });

            Toast.show({
                type: 'success',
                text1: 'Tag deleted successfully',
            });

            await tagSyncService.pushDeletions();
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error?.message || 'Error deleting tag',
            });
            throw error;
        }
    },

    /**
     * Get all tags (query)
     */
    async getAll(): Promise<Tag[]> {
        try {
            const tagsCollection = database.collections.get<Tag>('tags');
            return await tagsCollection.query().fetch();
        } catch (error) {
            console.error('Error fetching tags:', error);
            throw error;
        }
    },

    /**
     * Get a single tag by ID
     */
    async getById(tagId: string): Promise<Tag> {
        try {
            const tagsCollection = database.collections.get<Tag>('tags');
            return await tagsCollection.find(tagId);
        } catch (error) {
            console.error('Error fetching tag:', error);
            throw error;
        }
    },

    /**
     * Sync tags now
     */
    async syncNow(userId: string): Promise<void> {
        try {
            await tagSyncService.sync(userId);
            Toast.show({
                type: 'success',
                text1: 'Tags synced successfully',
            });
        } catch (error) {
            console.error('Error syncing tags:', error);
            Toast.show({
                type: 'error',
                text1: 'Error syncing tags',
            });
            throw error;
        }
    },
};
