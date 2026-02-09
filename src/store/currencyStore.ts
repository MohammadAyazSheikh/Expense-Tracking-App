import { create } from 'zustand';
import { database } from '@/libs/database';
import { supabase } from '@/libs/supabase';
import Toast from 'react-native-toast-message';
import { Currencies } from '@/database/models/currency';
import { currenciesSyncService } from '@/services/syncServices/currenciesSyncService';

interface CurrencyStore {
    currencies: Currencies[];
    loadCurrencies: () => Promise<void>;
    syncNow: () => Promise<void>;
    reset: () => void;
    isLoading: boolean;
    isSyncing: boolean;
}

export const useCurrencyStore = create<CurrencyStore>((set, get) => ({
    currencies: [],
    isLoading: false,
    isSyncing: false,

    loadCurrencies: async () => {
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

    reset: () => {
        set({
            currencies: [],
            isLoading: false,
            isSyncing: false,
        });
    },
    syncNow: async () => {
        try {
            set({ isSyncing: true });
            const user = await supabase.auth.getUser();
            if (user.data.user) {
                await currenciesSyncService.sync(user.data.user.id);
                await get().loadCurrencies();
            }
        } catch (error) {
            console.error('Error syncing currencies:', error);
        } finally {
            set({ isSyncing: false });
        }
    },
}));