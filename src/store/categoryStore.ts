import { create } from 'zustand';
import { database } from '@/libs/database';
import { categorySyncService } from '@/services/syncServices/categorySyncService';
import { Category, SystemCategory } from '@/database/models/category';
import { supabase } from '@/libs/supabase';
import { PendingDeletions } from '@/database/models/local';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '@/store';

interface CategoryStore {
    categories: Category[];
    systemCategories?: SystemCategory[];
    deleteCategory: (categoryId: string) => Promise<void>;
    loadCategories: () => Promise<void>;
    addCategory: (data: Partial<Category>) => Promise<void>;
    updateCategory: (categoryId: string, data: Partial<Category>) => Promise<void>;
    syncNow: () => Promise<void>;
    reset: () => void;
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

            const systemCategoriesCollection = database.collections.get<SystemCategory>('system_categories');
            const systemCat = await systemCategoriesCollection.query().fetch();
            const systemCategories = systemCat.filter((cat) => !categories.find((c) => c.systemCategoryId === cat.serverId));

            set({ categories, systemCategories });

        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error?.message || 'Error loading categories',
            });
        } finally {
            set({ isLoading: false });
        }
    },

    addCategory: async (data) => {
        set({ isLoading: true });
        try {
            const userId = useAuthStore.getState().user?.id;

            if (!userId) throw new Error('User not authenticated');

            const categoriesCollection = database.collections.get<Category>('categories');

            await database.write(async () => {
                await categoriesCollection.create((category) => {
                    category.isSynced = false;
                    category.name = data.name!;
                    category.color = data.color!;
                    category.icon = data.icon!;
                    category.iconFamily = data.iconFamily!;
                    category.transactionTypeId = data.transactionTypeId!;
                    category.systemCategoryId = data?.systemCategoryId || null;
                });
            });

            await get().loadCategories();

            Toast.show({
                type: 'success',
                text1: 'Category added successfully',
            });

            // Background sync
            categorySyncService.pushChanges(userId);
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error?.message || 'Error adding category',
            });
        } finally {
            set({ isLoading: false });
        }
    },
    updateCategory: async (categoryId, data) => {
        set({ isLoading: true });
        try {
            const userId = useAuthStore.getState().user?.id;

            if (!userId) throw new Error('User not authenticated');

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

            await get().loadCategories();
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
        } finally {
            set({ isLoading: false });
        }
    },
    deleteCategory: async (categoryId: string) => {
        set({ isLoading: true });
        try {
            const categoriesCollection = database.collections.get<Category>('categories');
            const pendingDeletionsCollection = database.collections.get<PendingDeletions>('pending_deletions');
            const category = await categoriesCollection.find(categoryId);

            const serverId = category?.serverId;

            await database.write(async () => {
                await category.destroyPermanently();

                if (serverId) {
                    await pendingDeletionsCollection.create((deletion) => {
                        deletion.tableName = 'categories';
                        deletion.serverId = serverId;
                        deletion.deletedAt = Date.now();
                    });
                }
            });

            await get().loadCategories();

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
        } finally {
            set({ isLoading: false });
        }
    },
    reset: () => {
        set({
            categories: [],
            isLoading: false,
            isSyncing: false,
        });
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