import { BaseSyncService, SyncConfig } from './baseSyncService';
import { Wallet } from '@/database/models/wallet';

const walletSyncConfig: SyncConfig<Wallet, 'wallets'> = {
    localTable: "wallets",
    supabaseTable: "wallets",

    mapServerToLocal: async (serverData, model, service) => {
        // Convert server foreign keys to local IDs
        const currencyLocalId = await service.getLocalIdFromServerId(
            'currencies',
            serverData.currency_id!
        );
        const walletTypeLocalId = await service.getLocalIdFromServerId(
            'wallet_types',
            serverData.wallet_type_id!
        );
        if (!currencyLocalId || !walletTypeLocalId) {
            throw new Error('Currency or Wallet Type not synced');
        }

        model.currencyId = currencyLocalId!;
        model.walletTypeId = walletTypeLocalId!;
        model.userId = serverData.user_id!;
        model.name = serverData.name!;
        model.balance = serverData.balance!;
        model.isDefault = serverData.is_default!;
        model.includeInTotal = serverData.include_in_total!;
        model.lastDigits = serverData.last_digits!;
        model.accountNumber = serverData.account_number!;
    },

    mapLocalToServer: async (localModel) => {

        const currency = await localModel.currency.fetch();
        const walletType = await localModel.walletType.fetch();
        if (!currency.serverId || !walletType.serverId) {
            throw new Error('Currency or Wallet Type not synced');
        }
        return {
            currency_id: currency.serverId!,
            wallet_type_id: walletType.serverId!,
            name: localModel.name,
            balance: localModel.balance,
            is_default: localModel.isDefault,
            include_in_total: localModel.includeInTotal,
            last_digits: localModel.lastDigits,
            account_number: localModel.accountNumber,
        };
    },
};

export const walletSyncService = new BaseSyncService<Wallet, 'wallets'>(walletSyncConfig);