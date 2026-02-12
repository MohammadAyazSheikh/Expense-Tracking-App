import { BaseSyncService, SyncConfig } from './baseSyncService';
import { ExchangeRates } from '@/database/models/currency';

const exchangeRatesSyncConfig: SyncConfig<ExchangeRates, 'exchange_rates'> = {
    localTable: "exchange_rates",
    supabaseTable: "exchange_rates",

    mapServerToLocal: async (serverData, model, service) => {
        // Convert server foreign keys to local IDs
        const baseCurrencyLocalId = await service.getLocalIdFromServerId(
            'currencies',
            serverData.base_currency_id!
        );
        const quoteCurrencyLocalId = await service.getLocalIdFromServerId(
            'currencies',
            serverData.quote_currency_id!
        );
        if (!baseCurrencyLocalId || !quoteCurrencyLocalId) {
            throw new Error('Base Currency or Quote Currency not synced');
        }

        model.baseCurrencyId = baseCurrencyLocalId!;
        model.quoteCurrencyId = quoteCurrencyLocalId!;
        model.rate = serverData.rate!;
        model.rateDate = serverData.rate_date!;
        model.source = serverData.source!;
    },

    mapLocalToServer: async (localModel) => {

    },
};

export const exchangeRatesSyncService = new BaseSyncService<ExchangeRates, 'exchange_rates'>(
    exchangeRatesSyncConfig
);