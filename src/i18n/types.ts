export type SupportedLocale = 'en' | 'ar';

export interface LocaleConfig {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  isRTL: boolean;
}

export const SUPPORTED_LOCALES: Record<SupportedLocale, LocaleConfig> = {
  en: { code: 'en', name: 'English', nativeName: 'English', isRTL: false },
  ar: { code: 'ar', name: 'Arabic', nativeName: 'العربية', isRTL: true },
};

export const RTL_LOCALES: SupportedLocale[] = ['ar']; // Add more RTL languages

export const isRTL = (locale: SupportedLocale): boolean => {
  return RTL_LOCALES.includes(locale);
};
