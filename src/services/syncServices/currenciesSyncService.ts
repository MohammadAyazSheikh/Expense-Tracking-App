import { BaseSyncService, SyncConfig } from './baseSyncService';
import { Currencies } from '@/database/models/currency';

const currenciesSyncConfig: SyncConfig<Currencies, "currencies"> = {
    localTable: "currencies",
    supabaseTable: "currencies",
    mapServerToLocal: async (serverData, model) => {
        model.code = serverData.code!;
        model.name = serverData.name!;
        model.symbol = serverData.symbol!;
        model.type = serverData.type!;
        model.isActive = serverData.is_active!;
        model.decimalPlaces = serverData.decimal_places!;
    },
    mapLocalToServer: async (localModel) => ({}),
    resolveConflict: () => "server",
};

export const currenciesSyncService = new BaseSyncService<Currencies, 'currencies'>(currenciesSyncConfig);

