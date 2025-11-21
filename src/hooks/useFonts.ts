import { getFontFamily, getFontsForLocale, FontWeight, FontConfig } from '../fonts/config';
import { SupportedLocale } from '../i18n/types';
import { useAppSettingsStore } from '../store';


interface FontsHook {
  getFont: (weight?: FontWeight) => string;
  fonts: FontConfig;
  isRTL: Boolean;
  locale: SupportedLocale;
}

/**
 * Hook to get font families based on current locale
 * Use this in components to get locale-specific fonts
 */
export const useFonts = (): FontsHook => {
  const { locale, isRTL } = useAppSettingsStore();

  const fonts = getFontsForLocale(locale);

  const getFont = (weight: FontWeight = 'regular'): string => {
    return getFontFamily(locale, weight);
  };

  return {
    getFont,
    fonts,
    locale,
    isRTL,
  };
};
