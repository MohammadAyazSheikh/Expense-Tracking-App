
import { create } from 'zustand';
import { database } from '@/libs/database';
import { categorySyncService } from '@/services/categorySyncService';
import { Category } from '@/database/models/category';
import { supabase } from '@/libs/supabase';
import { PendingDeletions } from '@/database/models/local';
import Toast from 'react-native-toast-message';



interface CategoryStore {
    categories: Category[];
    deleteCategory: (categoryId: string) => Promise<void>;
    loadCategories: () => Promise<void>;
    addCategory: (data: Category) => Promise<void>;
    syncNow: () => Promise<void>;
    isLoading: boolean;
    isSyncing: boolean;
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
    categories: [],
    isLoading: false,
    isSyncing: false,

    loadCategories: async () => {
        try {
            set({ isLoading: true });
            const categoriesCollection = database.collections.get<Category>('categories');
            const categories = await categoriesCollection.query().fetch();
            set({ categories });
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error?.message || 'Error loading categories',
            });
            console.error('Error loading categories:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    addCategory: async (data: Category) => {
        set({ isLoading: true })
        try {
            const categoriesCollection = database.collections.get<Category>('categories');

            await database.write(async () => {
                await categoriesCollection.create(category => {
                    category.name = data.name;
                    category.color = data.color;
                    category.icon = data.icon;
                    category.iconFamily = data.iconFamily;
                    category.transactionTypeKey = data.transactionTypeKey;
                    category.userId = data.userId;
                    category.systemCategoryId = data.systemCategoryId;
                    category.isSynced = false; // Mark as unsynced
                });
            });

            // Reload local data
            await get().loadCategories();
            Toast.show({
                type: 'success',
                text1: 'Category added successfully',
            });
            // Try to sync immediately
            categorySyncService.pushChanges(data.userId);
        }
        catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error?.message || 'Error adding category',
            });
            console.error('Error adding category:', error);
        }
        finally {
            set({ isLoading: false });
        }
    },

    deleteCategory: async (categoryId: string) => {

        set({ isLoading: true })
        try {
            const categoriesCollection = database.collections.get<Category>('categories');
            const pendingDeletionsCollection = database.collections.get<PendingDeletions>('pending_deletions');
            const category = await categoriesCollection.find(categoryId);

            const serverId = category?.serverId;

            await database.write(async () => {
                // Delete locally
                await category.destroyPermanently()
                // Track for sync if it has a server ID
                if (serverId) {
                    await pendingDeletionsCollection.create(deletion => {
                        deletion.tableName = 'categories';
                        deletion.serverId = serverId;
                        deletion.deletedAt = Date.now();
                    });
                }
            })
            // Reload local data
            await get()?.loadCategories();
            Toast.show({
                type: 'success',
                text1: 'Category deleted successfully',
            });
            // Try to sync immediately if online
            await categorySyncService.pushDeletions();
            console.log("🔥 Pushed deletions to server")
        }
        catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error?.message || 'Error deleting category',
            });
            console.error('Error deleting category:', error);
        }
        finally {
            set({ isLoading: false });
        }
    },

    syncNow: async () => {
        try {
            set({ isSyncing: true });
            const user = await supabase.auth.getUser();
            if (user.data.user) {
                await categorySyncService.sync(user.data.user.id);
                await get().loadCategories();
            }
        } catch (error) {
            console.error('Error syncing categories:', error);
        } finally {
            set({ isSyncing: false });
        }
    },
}));