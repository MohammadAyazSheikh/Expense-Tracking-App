import { BaseSyncService, SyncConfig } from './baseSyncService';
import { Category } from '@/database/models/category';

const categorySyncConfig: SyncConfig<Category, 'categories'> = {
    localTable: "categories",
    supabaseTable: "categories",
    mapServerToLocal: (serverData, model) => {
        model.name = serverData.name!;
        model.color = serverData.color!;
        model.icon = serverData.icon!;
        model.iconFamily = serverData.icon_family!;
        model.transactionTypeKey = serverData.transaction_type_key!;
        model.systemCategoryId = serverData.system_category_id!;
        model.userId = serverData.user_id!;
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
    resolveConflict: (localModel, serverData) => {
        // // Strategy 1: Always prefer local (default)
        // return 'local';

        // Strategy 2: Always prefer server
        // return 'server';

        // Strategy 3: Compare timestamps (most recent wins)
        const localTime = localModel.updatedAt.getTime();
        const serverTime = new Date(serverData.updated_at).getTime();
        return serverTime > localTime ? 'server' : 'local';

        // Strategy 4: Custom merge logic
        // return 'merge';
    },

    //   mergeConflict: (localModel, serverData, modelToUpdate) => {
    //   // User-editable fields: always prefer local
    //   modelToUpdate.name = localModel.name;
    //   modelToUpdate.color = localModel.color;
    //   modelToUpdate.icon = localModel.icon;
    //   modelToUpdate.iconFamily = localModel.iconFamily;

    //   // System-managed fields: prefer server
    //   modelToUpdate.systemCategoryId = serverData.system_category_id;
    //   modelToUpdate.transactionTypeKey = serverData.transaction_type_key;
    //   modelToUpdate.userId = serverData.user_id;
    // },
};

export const categorySyncService = new BaseSyncService<Category, 'categories'>(categorySyncConfig);

