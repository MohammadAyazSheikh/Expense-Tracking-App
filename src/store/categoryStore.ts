
import { create } from 'zustand';
import { database } from '@/libs/database';
import { syncService } from '@/services/syncService';
import { Category } from '@/models/category';
import { supabase } from '@/libs/supabase';



interface CategoryStore {
    categories: Category[];
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
        } catch (error) {
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

            // Try to sync immediately
            syncService.pushChanges();
        }
        catch (error) {
            console.error('Error adding category:', error);
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
                await syncService.sync(user.data.user.id);
                await get().loadCategories();
            }
        } catch (error) {
            console.error('Error syncing categories:', error);
        } finally {
            set({ isSyncing: false });
        }
    },
}));