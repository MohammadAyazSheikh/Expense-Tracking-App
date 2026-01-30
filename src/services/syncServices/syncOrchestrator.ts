
import { categorySyncService } from './categorySyncService';

export class SyncOrchestrator {
    private services = [
        categorySyncService,
    ];

    //for full sync
    async syncAll(userId: string) {
        console.log('🚀 Starting full sync for all tables...');

        const results = [];

        for (const service of this.services) {
            try {
                const result = await service.sync(userId);
                results.push(result);
            } catch (error) {
                console.error('Sync failed for service:', error);
            }
        }

        console.log('✅ Full sync complete');
        return results;
    }

    //for single table sync
    async syncTable(tableName: string, userId: string) {
        const service = this.services.find(
            (s) => (s as any).config.tableName === tableName
        );

        if (!service) {
            throw new Error(`No sync service found for table: ${tableName}`);
        }

        return await service.sync(userId);
    }
}

export const syncOrchestrator = new SyncOrchestrator();