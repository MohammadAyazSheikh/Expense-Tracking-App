import { database } from '@/libs/database';
import { Category, SystemCategory } from '@/database/models/category';
import { PendingDeletions } from '@/database/models/local';
import Toast from 'react-native-toast-message';
import { categorySyncService } from '@/services/syncServices/categorySyncService';

interface CreateCategoryData {
    name: string;
    color: string;
    icon: string;
    iconFamily: string;
    transactionTypeId: string;
    userId: string;
    systemCategoryId?: string | null;
}

interface UpdateCategoryData {
    name?: string;
    color?: string;
    icon?: string;
    iconFamily?: string;
    transactionTypeId?: string;
}

export const categoryService = {
    /**
     * Create a new category
     */
    async create(data: CreateCategoryData): Promise<Category> {
        try {
            const categoriesCollection = database.collections.get<Category>('categories');

            const newCategory = await database.write(async () => {
                return await categoriesCollection.create((category) => {
                    category.name = data.name;
                    category.color = data.color;
                    category.icon = data.icon;
                    category.iconFamily = data.iconFamily;
                    category.transactionTypeId = data.transactionTypeId;
                    // category.userId = data.userId;
                    category.systemCategoryId = data.systemCategoryId || null; // Ensure null if not provided
                    category.isSynced = false;
                });
            });

            Toast.show({
                type: 'success',
                text1: 'Category added successfully',
            });

            // Background sync
            categorySyncService.pushChanges(data.userId);

            return newCategory;
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error?.message || 'Error adding category',
            });
            throw error;
        }
    },

    /**
     * Update an existing category
     */
    async update(categoryId: string, data: UpdateCategoryData, userId: string): Promise<void> {
        try {
            const categoriesCollection = database.collections.get<Category>('categories');
            const category = await categoriesCollection.find(categoryId);

            await database.write(async () => {
                await category.update((cat) => {
                    if (data.name) cat.name = data.name;
                    if (data.color) cat.color = data.color;
                    if (data.icon) cat.icon = data.icon;
                    if (data.iconFamily) cat.iconFamily = data.iconFamily;
                    if (data.transactionTypeId) cat.transactionTypeId = data.transactionTypeId;
                    cat.isSynced = false;
                });
            });

            Toast.show({
                type: 'success',
                text1: 'Category updated successfully',
            });

            // Background sync
            categorySyncService.pushChanges(userId);
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error?.message || 'Error updating category',
            });
            console.error('Error updating category:', error);
            throw error;
        }
    },

    /**
     * Delete a category
     */
    async delete(categoryId: string): Promise<void> {
        try {
            const categoriesCollection = database.collections.get<Category>('categories');
            const pendingDeletionsCollection = database.collections.get<PendingDeletions>('pending_deletions');
            const category = await categoriesCollection.find(categoryId);

            const serverId = category?.serverId;

            await database.write(async () => {
                await category.destroyPermanently();

                // Track deletion for sync if it has a server ID
                if (serverId) {
                    await pendingDeletionsCollection.create((deletion) => {
                        deletion.tableName = 'categories';
                        deletion.serverId = serverId;
                        deletion.deletedAt = Date.now();
                    });
                }
            });

            Toast.show({
                type: 'success',
                text1: 'Category deleted successfully',
            });

            await categorySyncService.pushDeletions();
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error?.message || 'Error deleting category',
            });
            throw error;
        }
    },

    /**
     * Get all categories (helper)
     */
    async getAll(): Promise<Category[]> {
        try {
            const categoriesCollection = database.collections.get<Category>('categories');
            return await categoriesCollection.query().fetch();
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    /**
     * Get a single category by ID
     */
    async getById(categoryId: string): Promise<Category> {
        try {
            const categoriesCollection = database.collections.get<Category>('categories');
            return await categoriesCollection.find(categoryId);
        } catch (error) {
            console.error('Error fetching category:', error);
            throw error;
        }
    },


    /**
     * Sync categories now
     */
    async syncNow(userId: string): Promise<void> {
        try {
            await categorySyncService.sync(userId);
            Toast.show({
                type: 'success',
                text1: 'Categories synced successfully',
            });
        } catch (error) {
            console.error('Error syncing categories:', error);
            Toast.show({
                type: 'error',
                text1: 'Error syncing categories',
            });
            throw error;
        }
    },
};
