import { BaseSyncService, SyncConfig } from './baseSyncService';
import { Tag } from '@/database/models/tags';

const tagSyncConfig: SyncConfig<Tag, 'tags'> = {
    localTable: "tags",
    supabaseTable: "tags",
    mapServerToLocal: (serverData, model) => {
        model.name = serverData.name!;
        model.color = serverData.color!;
        model.userId = serverData.user_id!;
    },
    mapLocalToServer: (localModel) => {
        return {
            name: localModel.name,
            color: localModel.color,
        };
    },
    resolveConflict: (localModel, serverData) => {
        const localTime = localModel.updatedAt.getTime();
        const serverTime = new Date(serverData.updated_at).getTime();
        return serverTime > localTime ? 'server' : 'local';
    },
};

export const tagSyncService = new BaseSyncService<Tag, 'tags'>(tagSyncConfig);

