export type SupportedLocale = 'en' | 'ar' | 'ur';

export interface LocaleConfig {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  isRTL: boolean;
}

export const SUPPORTED_LOCALES: Record<SupportedLocale, LocaleConfig> = {
  en: { code: 'en', name: 'English', nativeName: 'English', isRTL: false },
  ar: { code: 'ar', name: 'Arabic', nativeName: 'العربية', isRTL: true },
  ur: { code: 'ur', name: 'Urdu', nativeName: 'اردو', isRTL: true },
};

export const RTL_LOCALES: SupportedLocale[] = ['ar', 'ur']; // RTL languages


export const isRTL = (locale: SupportedLocale): boolean => {
  return RTL_LOCALES.includes(locale);
};
