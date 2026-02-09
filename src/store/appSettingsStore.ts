import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from '../utils/storage';
import { alertService } from '../utils/alertService';
import { SupportedLanguage, isRTL } from '../i18n/types';
import { changeLanguage, getDeviceLanguage } from '../i18n';
import * as Updates from 'expo-updates';
import { Appearance } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';

export type ThemeMode = 'light' | 'dark' | 'system';

interface AppSettingsState {
  // State
  language: SupportedLanguage;
  isRTL: boolean;
  theme: ThemeMode;
  // currency: {
  //   currencyCode: string;
  //   currencySymbol: string;
  // };

  effectiveTheme: 'light' | 'dark';
  isLoading: boolean;

  // Actions
  initialize: () => Promise<void>;
  changeLanguage: (newLanguage: SupportedLanguage) => Promise<void>;
  changeTheme: (newTheme: ThemeMode) => void;
  updateSystemTheme: () => void;
}

const getSystemTheme = (): 'light' | 'dark' => {
  return Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
};

const getEffectiveTheme = (theme: ThemeMode): 'light' | 'dark' => {
  return theme === 'system' ? getSystemTheme() : theme;
};

export const useAppSettingsStore = create<AppSettingsState>()(
  persist(
    (set, get) => ({
      // Initial state
      language: getDeviceLanguage(),
      isRTL: false,
      theme: 'system',
      effectiveTheme: getSystemTheme(),
      isLoading: true,

      // Initialize app settings
      initialize: async () => {
        try {
          const { language } = get();
          await changeLanguage(language);
          set({ isLoading: false });
        } catch (error) {
          console.error('Error initializing app settings:', error);
          set({ isLoading: false });
        }
      },

      // Change language  
      changeLanguage: async (newLanguage: SupportedLanguage) => {
        try {
          const currentIsRTL = get().isRTL;
          const newIsRTL = isRTL(newLanguage);
          const needsRTLChange = newIsRTL !== currentIsRTL;

          await changeLanguage(newLanguage);

          set({
            language: newLanguage,
            isRTL: newIsRTL,
          });

          // Only prompt to reload if RTL direction changed
          if (needsRTLChange) {
            alertService.show({
              title: 'Language Changed',
              message: 'Please restart the app for the layout changes to take effect.',
              buttons: [
                {
                  text: 'Restart Now',
                  onPress: () => Updates.reloadAsync(),
                },
                {
                  text: 'Later',
                  style: 'cancel',
                },
              ]
            });
          }
        } catch (error) {
          console.error('Error changing language:', error);
          throw error;
        }
      },

      // Change theme
      changeTheme: (newTheme: ThemeMode) => {
        const effectiveTheme = getEffectiveTheme(newTheme)
        set({
          theme: newTheme,
          effectiveTheme
        });
        UnistylesRuntime.setTheme(effectiveTheme == "dark" ? "dark" : "light")
      },

      // Update system theme (call when system theme changes)
      updateSystemTheme: () => {
        const { theme } = get();
        if (theme === 'system') {
          set({ effectiveTheme: getSystemTheme() });
        }
      },
    }),
    {
      name: 'app-settings-storage',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        language: state.language,
        isRTL: state.isRTL,
        theme: state.theme,
        effectiveTheme: state.effectiveTheme,
      }),
    }
  )
);