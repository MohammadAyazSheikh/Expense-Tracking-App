import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from '../utils/storage';
import { SupportedLocale, isRTL } from '../i18n/types';
import { changeLanguage, getDeviceLocale } from '../i18n';
import * as Updates from 'expo-updates';
import { Alert, Appearance } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';

export type ThemeMode = 'light' | 'dark' | 'system';

interface AppSettingsState {
  // State
  locale: SupportedLocale;
  isRTL: boolean;
  theme: ThemeMode;
  effectiveTheme: 'light' | 'dark';
  isLoading: boolean;

  // Actions
  initialize: () => Promise<void>;
  changeLocale: (newLocale: SupportedLocale) => Promise<void>;
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
      locale: getDeviceLocale(),
      isRTL: false,
      theme: 'system',
      effectiveTheme: getSystemTheme(),
      isLoading: true,

      // Initialize app settings
      initialize: async () => {
        try {
          const { locale } = get();
          await changeLanguage(locale);
          set({ isLoading: false });
        } catch (error) {
          console.error('Error initializing app settings:', error);
          set({ isLoading: false });
        }
      },

      // Change locale
      changeLocale: async (newLocale: SupportedLocale) => {
        try {
          const currentIsRTL = get().isRTL;
          const newIsRTL = isRTL(newLocale);
          const needsRTLChange = newIsRTL !== currentIsRTL;

          await changeLanguage(newLocale);

          set({
            locale: newLocale,
            isRTL: newIsRTL,
          });

          // Only prompt to reload if RTL direction changed
          if (needsRTLChange) {
            Alert.alert(
              'Language Changed',
              'Please restart the app for the layout changes to take effect.',
              [
                {
                  text: 'Restart Now',
                  onPress: () => Updates.reloadAsync(),
                },
                {
                  text: 'Later',
                  style: 'cancel',
                },
              ]
            );
          }
        } catch (error) {
          console.error('Error changing locale:', error);
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
        locale: state.locale,
        isRTL: state.isRTL,
        theme: state.theme,
        effectiveTheme: state.effectiveTheme,
      }),
    }
  )
);