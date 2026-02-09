import { BaseSyncService, SyncConfig } from './baseSyncService';
import { SystemCategory } from '@/database/models/category';

const systemCategorySyncConfig: SyncConfig<SystemCategory, 'system_categories'> = {
    localTable: "system_categories",
    supabaseTable: "system_categories",
    mapServerToLocal: async (serverData, model) => {
        model.name = serverData.name!;
        model.color = serverData.color!;
        model.icon = serverData.icon!;
        model.isActive = serverData.is_active!;
        model.iconFamily = serverData.icon_family!;
        model.transactionTypeId = serverData.transaction_type_id!;
    },
    //we don't need to map local to server because we are not creating system categories from local
    mapLocalToServer: async (localModel) => ({}),
    resolveConflict: (localModel, serverData) => "server",

};

export const systemCategorySyncService = new BaseSyncService<SystemCategory, 'system_categories'>(systemCategorySyncConfig);

