import { BaseSyncService, SyncConfig } from './baseSyncService';
import { Category } from '@/database/models/category';

const categorySyncConfig: SyncConfig<Category, 'categories'> = {
    tableName: "categories",
    supabaseTable: "categories",
    mapServerToLocal: (serverData, model) => {
        model.name = serverData.name;
        model.color = serverData.color;
        model.icon = serverData.icon;
        model.iconFamily = serverData.icon_family;
        model.transactionTypeKey = serverData.transaction_type_key;
        model.systemCategoryId = serverData.system_category_id;
        model.userId = serverData.user_id;
    },
    mapLocalToServer: (localModel) => {
        return {
            name: localModel.name,
            color: localModel.color,
            icon: localModel.icon,
            icon_family: localModel.iconFamily,
            transaction_type_key: localModel.transactionTypeKey,
        };
    },
};

export const categorySyncService = new BaseSyncService<Category, 'categories'>(categorySyncConfig);

