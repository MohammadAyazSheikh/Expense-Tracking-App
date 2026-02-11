import { create } from 'zustand';
import { useAuthStore } from '@/store';
import { database } from '@/libs/database';
import { supabase } from '@/libs/supabase';
import Toast from 'react-native-toast-message';
import { Wallet } from '@/database/models/wallet';
import { Currencies } from '@/database/models/currency';
import { WalletTypes } from '@/database/models/wallet';
import { PendingDeletions } from '@/database/models/local';
import { walletSyncService } from '@/services/syncServices/walletSyncService';

export type storeWallet = {
    wallet: Wallet;
    currency: Currencies;
    walletType: WalletTypes;
}

interface WalletStore {
    wallets: storeWallet[];
    deleteWallet: (walletId: string) => Promise<void>;
    loadWallets: () => Promise<void>;
    addWallet: (data: Partial<Wallet>) => Promise<void>;
    updateWallet: (walletId: string, data: Partial<Wallet>) => Promise<void>;
    syncNow: () => Promise<void>;
    reset: () => void;
    isLoading: boolean;
    isSyncing: boolean;
}

export const useWalletStore = create<WalletStore>((set, get) => ({
    wallets: [],
    isLoading: false,
    isSyncing: false,

    loadWallets: async () => {
        try {
            set({ isLoading: true });

            const walletsCollection = database.collections.get<Wallet>('wallets');
            const data = await walletsCollection.query().fetch();

            const wallets = await Promise.all(data.map(async (wallet) => {
                const currency = await wallet.currency.fetch();
                const walletType = await wallet.walletType.fetch();
                return {
                    wallet,
                    currency,
                    walletType,
                };
            }));


            set({ wallets });

        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error?.message || 'Error loading wallets',
            });
        } finally {
            set({ isLoading: false });
        }
    },

    addWallet: async (data) => {
        set({ isLoading: true });
        try {
            const userId = useAuthStore.getState().user?.id;

            if (!userId) throw new Error('User not authenticated');

            const walletsCollection = database.collections.get<Wallet>('wallets');

            await database.write(async () => {
                await walletsCollection.create((wallet) => {
                    wallet.isSynced = false;
                    wallet.name = data.name!;
                    wallet.balance = data.balance!;
                    wallet.userId = userId;
                    wallet.isDefault = data.isDefault!;
                    wallet.includeInTotal = data.includeInTotal!;
                    wallet.lastDigits = data.lastDigits!;
                    wallet.accountNumber = data.accountNumber!;
                    wallet.currencyId = data.currencyId!;
                    wallet.walletTypeId = data.walletTypeId!;
                });
            });

            await get().loadWallets();

            Toast.show({
                type: 'success',
                text1: 'Wallet added successfully',
            });

            // Background sync
            walletSyncService.pushChanges(userId);
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error?.message || 'Error adding category',
            });
        } finally {
            set({ isLoading: false });
        }
    },
    updateWallet: async (walletId, data) => {
        set({ isLoading: true });
        try {
            const userId = useAuthStore.getState().user?.id;

            if (!userId) throw new Error('User not authenticated');

            const walletsCollection = database.collections.get<Wallet>('wallets');
            const wallet = await walletsCollection.find(walletId);

            await database.write(async () => {
                await wallet.update((w) => {
                    if (data.name) w.name = data.name;
                    if (data.balance) w.balance = data.balance;
                    if (data.isDefault) w.isDefault = data.isDefault;
                    if (data.includeInTotal) w.includeInTotal = data.includeInTotal;
                    if (data.lastDigits) w.lastDigits = data.lastDigits;
                    if (data.accountNumber) w.accountNumber = data.accountNumber;
                    if (data.currencyId) w.currencyId = data.currencyId;
                    if (data.walletTypeId) w.walletTypeId = data.walletTypeId;
                    w.isSynced = false;
                });
            });
            await get().loadWallets();
            Toast.show({
                type: 'success',
                text1: 'Wallet updated successfully',
            });

            // Background sync
            walletSyncService.pushChanges(userId);
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
    deleteWallet: async (walletId: string) => {
        set({ isLoading: true });
        try {
            const walletsCollection = database.collections.get<Wallet>('wallets');
            const pendingDeletionsCollection = database.collections.get<PendingDeletions>('pending_deletions');
            const wallet = await walletsCollection.find(walletId);

            const serverId = wallet?.serverId;

            await database.write(async () => {
                await wallet.destroyPermanently();

                if (serverId) {
                    await pendingDeletionsCollection.create((deletion) => {
                        deletion.tableName = "wallets";
                        deletion.serverId = serverId;
                        deletion.deletedAt = Date.now();
                    });
                }
            });

            await get().loadWallets();

            Toast.show({
                type: 'success',
                text1: 'Wallet deleted successfully',
            });

            await walletSyncService.pushDeletions();
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
            wallets: [],
            isLoading: false,
            isSyncing: false,
        });
    },
    syncNow: async () => {
        try {
            set({ isSyncing: true });
            const user = await supabase.auth.getUser();
            if (user.data.user) {
                await walletSyncService.sync(user.data.user.id);
                await get().loadWallets();
            }
        } catch (error) {
            console.error('Error syncing wallets:', error);
        } finally {
            set({ isSyncing: false });
        }
    },
}));