import { database } from '@/libs/database';
import { mmkvStorage } from '@/utils/storage';
import { useAuthStore, useCategoryStore } from '@/store';

class CleanupService {
    /**
     * Reset WatermelonDB - removes all data from all tables
     */
    async resetDatabase() {
        try {
            await database.write(async () => {
                await database.unsafeResetDatabase();
            });
            console.log('✅ Database reset complete');
        } catch (error) {
            console.error('❌ Failed to reset database:', error);
            throw error;
        }
    }

    /**
     * Clear all MMKV storage (sync timestamps, etc.)
     */
    async clearStorage() {
        try {
            await mmkvStorage.clearAll();
            console.log('✅ Storage cleared');
        } catch (error) {
            console.error('❌ Failed to clear storage:', error);
            throw error;
        }
    }

    /**
     * Reset all Zustand stores
     */
    resetStores() {
        try {
            useAuthStore.getState().reset();
            useCategoryStore.getState().reset();
        } catch (error) {
            console.error('❌ Failed to reset stores:', error);
            throw error;
        }
    }

    /**
     * Complete cleanup - call this on logout
     */
    async cleanupOnLogout() {
        try {
            console.log('🧹 Starting cleanup...');

            await this.resetDatabase();
            await this.clearStorage();
            this.resetStores();

            console.log('✅ Cleanup complete');
        } catch (error) {
            console.error('❌ Cleanup failed:', error);
            throw error;
        }
    }
}

export const cleanupService = new CleanupService();