import { create } from 'zustand';
import { database } from '@/libs/database';
import { supabase } from '@/libs/supabase';
import Toast from 'react-native-toast-message';
import { WalletTypes } from '@/database/models/wallet';
import { walletTypeSyncService } from '@/services/syncServices/walletTypeSyncService';

interface WalletTypeStore {
    walletTypes: WalletTypes[];
    loadWalletTypes: () => Promise<void>;
    syncNow: () => Promise<void>;
    reset: () => void;
    isLoading: boolean;
    isSyncing: boolean;
}

export const useWalletTypeStore = create<WalletTypeStore>((set, get) => ({
    walletTypes: [],
    isLoading: false,
    isSyncing: false,

    loadWalletTypes: async () => {
        try {
            set({ isLoading: true });
            const walletTypesCollection = database.collections.get<WalletTypes>('wallet_types');
            const walletTypes = await walletTypesCollection.query().fetch();
            set({ walletTypes });

        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error?.message || 'Error loading wallet types',
            });
        } finally {
            set({ isLoading: false });
        }
    },

    reset: () => {
        set({
            walletTypes: [],
            isLoading: false,
            isSyncing: false,
        });
    },
    syncNow: async () => {
        try {
            set({ isSyncing: true });
            const user = await supabase.auth.getUser();
            if (user.data.user) {
                await walletTypeSyncService.sync(user.data.user.id);
                await get().loadWalletTypes();
            }
        } catch (error) {
            console.error('Error syncing wallet types:', error);
        } finally {
            set({ isSyncing: false });
        }
    },
}));