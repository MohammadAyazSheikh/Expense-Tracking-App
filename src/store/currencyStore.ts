import { create } from 'zustand';
import { database } from '@/libs/database';
import { supabase } from '@/libs/supabase';
import Toast from 'react-native-toast-message';
import { Currencies, ExchangeRates } from '@/database/models/currency';
import { currenciesSyncService } from '@/services/syncServices/currenciesSyncService';
import { exchangeRatesSyncService } from '@/services/syncServices/exchangeRatesSyncService';
import { useAppSettingsStore } from './appSettingsStore';
import {
    calculateCrossRate, convertCurrency, CrossRateResult,
    FormattedExchangeRate, FormattedRatesForSpecificCurrencyList,
    generateAllCrossRates, generateSpecificCrossRates
} from '@/utils/exchangeRateCalculator';



interface CurrencyStore {
    currencies: Currencies[];

    loadCurrencies: () => Promise<void>;
    syncNow: () => Promise<void>;
    reset: () => void;
    isLoading: boolean;
    isSyncing: boolean;
    /** Array of formatted exchange rates (USD-based from DB) */
    exchangeRates: FormattedExchangeRate[];

    loadExchangeRates: () => Promise<void>;
    /** Get cross rate between two currencies */
    getCrossRate: (fromCurrency: string, toCurrency: string) => CrossRateResult | null;
    /** Generate all possible cross rates */
    getAllCrossRates: () => CrossRateResult[];
    /** Convert amount from one currency to another */
    convert: (amount: number, from: string, to: string) => number | null;
    /** Get rates for a specific currency */
    getRatesForCurrency: (currencyCode?: string) => FormattedRatesForSpecificCurrencyList;
}

export const useCurrencyStore = create<CurrencyStore>((set, get) => ({
    currencies: [],
    exchangeRates: [],
    isLoading: false,
    isSyncing: false,

    async loadCurrencies() {
        try {
            set({ isLoading: true });
            const currencyCollection = database.collections.get<Currencies>("currencies");
            const currencies = await currencyCollection.query().fetch();
            set({ currencies });

        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error?.message || 'Error loading currencies',
            });
        } finally {
            set({ isLoading: false });
        }
    },

    async loadExchangeRates(): Promise<void> {
        try {
            set({ isLoading: true });

            const exchangeRateCollection = database.collections.get<ExchangeRates>("exchange_rates");
            const exchangeRates = await exchangeRateCollection.query().fetch();

            const formattedRates = await Promise.all(
                exchangeRates.map(async (rate) => {
                    const [baseCurrency, quoteCurrency] = await Promise.all([
                        rate.baseCurrency.fetch(),
                        rate.quoteCurrency.fetch(),
                    ]);

                    return {
                        id: rate.id,
                        serverId: rate.serverId,
                        rate: rate.rate,
                        rateDate: rate.rateDate,
                        source: rate.source,
                        sourceCurrency: {
                            id: baseCurrency.id,
                            code: baseCurrency.code,
                            symbol: baseCurrency.symbol,
                            name: baseCurrency.name,
                            serverId: baseCurrency.serverId,
                            isActive: baseCurrency.isActive,
                            decimalPlaces: baseCurrency.decimalPlaces,
                            type: baseCurrency.type,
                        },
                        targetCurrency: {
                            id: quoteCurrency.id,
                            code: quoteCurrency.code,
                            symbol: quoteCurrency.symbol,
                            name: quoteCurrency.name,
                            serverId: quoteCurrency.serverId,
                            isActive: quoteCurrency.isActive,
                            decimalPlaces: quoteCurrency.decimalPlaces,
                            type: quoteCurrency.type,
                        }
                    };
                })
            );

            set({ exchangeRates: formattedRates });

        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error?.message || 'Error loading exchange rates',
            });
        } finally {
            set({ isLoading: false });
        }
    },

    getCrossRate(fromCurrency: string, toCurrency: string): CrossRateResult | null {
        const { exchangeRates } = get();
        return calculateCrossRate(fromCurrency, toCurrency, exchangeRates);
    },

    getAllCrossRates(): CrossRateResult[] {
        const { exchangeRates } = get();
        return generateAllCrossRates(exchangeRates);
    },

    getRatesForCurrency(code) {
        const { exchangeRates } = get();
        const { currency } = useAppSettingsStore.getState();
        return generateSpecificCrossRates(code || currency?.code!, exchangeRates);
    },

    convert(amount: number, from: string, to: string): number | null {
        const { exchangeRates } = get();
        const result = convertCurrency(amount, from, to, exchangeRates);
        return result?.convertedAmount ?? null;
    },

    reset() {
        set({
            currencies: [],
            exchangeRates: [],
            isLoading: false,
            isSyncing: false,
        });
    },
    async syncNow() {
        try {
            set({ isSyncing: true });
            const user = await supabase.auth.getUser();
            if (user.data.user) {
                await currenciesSyncService.sync(user.data.user.id);
                await exchangeRatesSyncService.sync(user.data.user.id);
                await get().loadCurrencies();
                await get().loadExchangeRates();
            }
        } catch (error) {
            console.error('Error syncing currencies:', error);
        } finally {
            set({ isSyncing: false });
        }
    },
}));