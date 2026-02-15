import { currenciesSyncService } from '@/services/syncServices/currenciesSyncService';
import { exchangeRatesSyncService } from '@/services/syncServices/exchangeRatesSyncService';
import { database } from '@/libs/database';
import { Currencies, ExchangeRates } from '@/database/models/currency';
import { FormattedExchangeRate, generateSpecificCrossRates } from '@/utils/exchangeRateCalculator';

export const currencyService = {
    async syncNow(userId: string): Promise<void> {
        try {
            await currenciesSyncService.sync(userId);
            await exchangeRatesSyncService.sync(userId);
        } catch (error) {
            console.error('Error syncing currencies:', error);
            throw error;
        }
    },

    async getRatesForDisplay(userCurrencyCode: string = "USD") {
        try {
            const currencies = await database.get<Currencies>('currencies').query().fetch();

            const usdCurrency = currencies.find(c => c.code === 'USD');

            //For just safety, if we don't even have USD or any currencies, return empty
            if (!currencies.length) return { allCrossRates: [], cryptoRates: [], fiatRates: [] };

            // Fetch rates if available (USD based)
            let formattedRates: FormattedExchangeRate[] = [];

            if (usdCurrency) {
                const rates = await database.get<ExchangeRates>('exchange_rates').query().fetch();

                // Map to FormattedExchangeRate
                for (const rate of rates) {
                    const targetCurrency = await rate.quoteCurrency.fetch();
                    if (targetCurrency) {
                        formattedRates.push({
                            id: rate.id,
                            serverId: rate.serverId,
                            rate: rate.rate,
                            rateDate: rate.rateDate,
                            source: rate.source,
                            sourceCurrency: {
                                id: usdCurrency.id,
                                code: usdCurrency.code,
                                decimalPlaces: usdCurrency.decimalPlaces,
                                isActive: usdCurrency.isActive,
                                name: usdCurrency.name,
                                symbol: usdCurrency.symbol,
                                type: usdCurrency.type
                            },
                            targetCurrency: {
                                id: targetCurrency.id,
                                code: targetCurrency.code,
                                decimalPlaces: targetCurrency.decimalPlaces,
                                isActive: targetCurrency.isActive,
                                name: targetCurrency.name,
                                symbol: targetCurrency.symbol,
                                type: targetCurrency.type
                            }
                        });
                    }
                }
            }

            return generateSpecificCrossRates(userCurrencyCode, formattedRates);

        } catch (error) {
            console.error('Error getting rates for display:', error);
            return { allCrossRates: [], cryptoRates: [], fiatRates: [] };
        }
    }
};
