import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import { I18nManager } from 'react-native';
import dateTime from '@/utils/dateTime';
import { SupportedLanguage, SUPPORTED_LANGUAGES, isRTL } from './types';

// Import translations
import en from './locales/en.json';
import ar from './locales/ar.json';
import ur from './locales/ur.json';

// ============================================
// Type-safe translation key generation
// ============================================

type PathImpl<T, Key extends keyof T> = Key extends string
  ? T[Key] extends Record<string, any>
  ?
  | `${Key}.${PathImpl<T[Key], Exclude<keyof T[Key], keyof any[]>> & string}`
  | `${Key}.${Exclude<keyof T[Key], keyof any[]> & string}`
  : never
  : never;

type PathImpl2<T> = PathImpl<T, keyof T> | keyof T;

type Path<T> = PathImpl2<T> extends string | keyof T ? PathImpl2<T> : keyof T;

// Generate the union type of all possible translation keys
export type TranslationKeys = Path<typeof en>;


// ============================================
// Resources configuration
// ============================================

const resources = {
  en: { translation: en },
  ar: { translation: ar },
  ur: { translation: ur },
};


export const getDeviceLanguage = (): SupportedLanguage => {
  //if device language is supported by our app then return it, otherwise return 'en'
  const deviceLanguage = getLocales()[0].languageCode;
  return (Object.keys(SUPPORTED_LANGUAGES) as SupportedLanguage[]).includes(
    deviceLanguage as SupportedLanguage
  )
    ? (deviceLanguage as SupportedLanguage)
    : 'en';
};

// Initialize i18n
i18n.use(initReactI18next).init({
  resources,
  lng: getDeviceLanguage(),
  fallbackLng: 'en',
  defaultNS: 'translation',
  nsSeparator: false,
  keySeparator: '.',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});



export const changeLanguage = async (language: SupportedLanguage) => {
  await i18n.changeLanguage(language);

  // Sync DateTime locale
  dateTime.locale(language);

  // Handle RTL
  const shouldBeRTL = isRTL(language);
  I18nManager.allowRTL(shouldBeRTL);
  I18nManager.forceRTL(shouldBeRTL);
};


/**
 * Get current active language
 */
export const getCurrentLanguage = (): SupportedLanguage => {
  return i18n.language as SupportedLanguage;
};

// ============================================
// Type-safe translate function
// ============================================

/**
 * Type-safe translation function with full IntelliSense support
 * @param key - Nested translation key (e.g., 'error.nameError')
 * @param options - Optional interpolation values
 * @returns Translated string
 */
export const translate = (key: TranslationKeys, options?: any) => {
  return String(i18n.t(key, options));
};

export default i18n;