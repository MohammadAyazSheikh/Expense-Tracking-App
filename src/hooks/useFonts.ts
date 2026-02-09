import { getFontFamily, getFontsForLanguage, FontWeight, FontConfig } from '../fonts/config';
import { SupportedLanguage } from '../i18n/types';
import { useAppSettingsStore } from '../store';


interface FontsHook {
  getFont: (weight?: FontWeight) => string;
  fonts: FontConfig;
  isRTL: Boolean;
  language: SupportedLanguage;
}

/**
 * Hook to get font families based on current language
 * Use this in components to get language-specific fonts
 */
export const useFonts = (): FontsHook => {
  const { language, isRTL } = useAppSettingsStore();

  const fonts = getFontsForLanguage(language);

  const getFont = (weight: FontWeight = 'regular'): string => {
    return getFontFamily(language, weight);
  };

  return {
    getFont,
    fonts,
    language,
    isRTL,
  };
};
