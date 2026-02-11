import { BaseSyncService, SyncConfig } from './baseSyncService';
import { WalletTypes } from '@/database/models/wallet';

const walletTypeSyncConfig: SyncConfig<WalletTypes, "wallet_types"> = {
    localTable: "wallet_types",
    supabaseTable: "wallet_types",
    mapServerToLocal: async (serverData, model) => {
        model.key = serverData.key!;
        model.label = serverData.label!;
        model.color = serverData.color!;
        model.icon = serverData.icon!;
        model.iconFamily = serverData.icon_family!;
    },
    mapLocalToServer: async (localModel) => ({}),
    resolveConflict: () => "server",
};

export const walletTypeSyncService = new BaseSyncService<WalletTypes, 'wallet_types'>(walletTypeSyncConfig);

