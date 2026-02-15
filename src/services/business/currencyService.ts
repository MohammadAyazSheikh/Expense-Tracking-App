import { currenciesSyncService } from '@/services/syncServices/currenciesSyncService';
import { exchangeRatesSyncService } from '@/services/syncServices/exchangeRatesSyncService';

export const currencyService = {
    async syncNow(userId: string): Promise<void> {
        try {
            await currenciesSyncService.sync(userId);
            await exchangeRatesSyncService.sync(userId);
        } catch (error) {
            console.error('Error syncing currencies:', error);
            throw error;
        }
    }
};
