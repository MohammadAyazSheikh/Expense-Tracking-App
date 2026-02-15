import { database } from '@/libs/database';
import { Wallet } from '@/database/models/wallet';
import { PendingDeletions } from '@/database/models/local';
import { walletSyncService } from '@/services/syncServices/walletSyncService';
import Toast from 'react-native-toast-message';

export type CreateWalletData = {
    name: string;
    balance: number;
    userId: string;
    isDefault: boolean;
    includeInTotal: boolean;
    lastDigits?: string | null;
    accountNumber?: string | null;
    currencyId: string;
    walletTypeId: string;
};

export type UpdateWalletData = Partial<CreateWalletData>;

export const walletService = {
    async create(data: CreateWalletData): Promise<Wallet> {
        try {
            const walletsCollection = database.collections.get<Wallet>('wallets');
            let newWallet: Wallet;

            await database.write(async () => {
                newWallet = await walletsCollection.create((wallet) => {
                    wallet.isSynced = false;
                    wallet.name = data.name;
                    wallet.balance = data.balance;
                    wallet.userId = data.userId;
                    wallet.isDefault = data.isDefault;
                    wallet.includeInTotal = data.includeInTotal;
                    wallet.lastDigits = data.lastDigits ?? null;
                    wallet.accountNumber = data.accountNumber ?? null;
                    wallet.currencyId = data.currencyId;
                    wallet.walletTypeId = data.walletTypeId;
                });
            });

            Toast.show({
                type: 'success',
                text1: 'Wallet added successfully',
            });

            // Background sync
            walletSyncService.pushChanges(data.userId);

            return newWallet!;
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error?.message || 'Error adding wallet',
            });
            throw error;
        }
    },

    async update(walletId: string, data: UpdateWalletData, userId: string): Promise<void> {
        try {
            const walletsCollection = database.collections.get<Wallet>('wallets');
            const wallet = await walletsCollection.find(walletId);

            await database.write(async () => {
                await wallet.update((w) => {
                    if (data.name !== undefined) w.name = data.name;
                    if (data.balance !== undefined) w.balance = data.balance;
                    if (data.isDefault !== undefined) w.isDefault = data.isDefault;
                    if (data.includeInTotal !== undefined) w.includeInTotal = data.includeInTotal;
                    if (data.lastDigits !== undefined) w.lastDigits = data.lastDigits;
                    if (data.accountNumber !== undefined) w.accountNumber = data.accountNumber;
                    if (data.currencyId !== undefined) w.currencyId = data.currencyId;
                    if (data.walletTypeId !== undefined) w.walletTypeId = data.walletTypeId;
                    w.isSynced = false;
                });
            });

            Toast.show({
                type: 'success',
                text1: 'Wallet updated successfully',
            });

            // Background sync
            walletSyncService.pushChanges(userId);
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error?.message || 'Error updating wallet',
            });
            throw error;
        }
    },

    async delete(walletId: string): Promise<void> {
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

            await walletSyncService.pushDeletions();
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error?.message || 'Error deleting wallet',
            });
            throw error;
        }
    },

    async syncNow(userId: string): Promise<void> {
        try {
            await walletSyncService.sync(userId);
        } catch (error) {
            console.error('Error syncing wallets:', error);
            throw error;
        }
    }
};
