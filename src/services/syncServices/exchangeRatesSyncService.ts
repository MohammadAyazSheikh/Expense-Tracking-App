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

        model.baseCurrencyId = baseCurrencyLocalId!;
        model.quoteCurrencyId = quoteCurrencyLocalId!;
        model.rate = serverData.rate!;
        model.rateDate = serverData.rate_date!;
        model.source = serverData.source!;
    },

    mapLocalToServer: async (localModel) => {

        /* 
            Notes:
            we don't need to map local to server for exchange rates
            because we are not creating/updating exchange rates from local
            Below commented code only for understanding how to map local to server when there is a relation between tables
        */

        // Get server IDs from local currency records
        // const baseCurrency = await localModel.baseCurrency.fetch();
        // const quoteCurrency = await localModel.quoteCurrency.fetch();

        // return {
        //     base_currency_id: baseCurrency.serverId!,
        //     quote_currency_id: quoteCurrency.serverId!,
        //     rate: localModel.rate,
        //     rate_date: localModel.rateDate,
        //     source: localModel.source,
        // };
    },
};

export const exchangeRatesSyncService = new BaseSyncService<ExchangeRates, 'exchange_rates'>(
    exchangeRatesSyncConfig
);