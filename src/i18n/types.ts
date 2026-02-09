export type SupportedLanguage = 'en' | 'ar' | 'ur';

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  isRTL: boolean;
}

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, LanguageConfig> = {
  en: { code: 'en', name: 'English', nativeName: 'English', isRTL: false },
  ar: { code: 'ar', name: 'Arabic', nativeName: 'العربية', isRTL: true },
  ur: { code: 'ur', name: 'Urdu', nativeName: 'اردو', isRTL: true },
};

export const RTL_LANGUAGES: SupportedLanguage[] = ['ar', 'ur']; // RTL languages


export const isRTL = (language: SupportedLanguage): boolean => {
  return RTL_LANGUAGES.includes(language);
};
