import { SupportedLocale } from '../i18n/types';

export interface FontConfig {
  regular: string;
  medium: string;
  semiBold: string;
  bold: string;
  extraBold: string;
  italic: string;
  fancy: string;
}

// Defining fonts for each locale
const FONTS: Record<SupportedLocale, FontConfig> = {
  en: {
    regular: 'Lato-Regular',
    medium: 'Lato-Thin',
    semiBold: 'Lato-Bold',
    bold: 'Lato-Bold',
    extraBold: 'Lato-Black',
    italic: 'Lato-Italic',
    fancy: 'Prohibition',
  },
  ar: {
    regular: 'NotoNaskhArabic-Regular',
    medium: 'NotoNaskhArabic-Medium',
    semiBold: 'NotoNaskhArabic-SemiBold',
    bold: 'NotoNaskhArabic-Bold',
    extraBold: 'NotoNaskhArabic-Bold',
    italic: 'NotoNaskhArabic-Regular',
    fancy: 'NotoNaskhArabic-Bold',
  },
};

// Font weights mapping
export type FontWeight =
  | 'regular'
  | 'medium'
  | 'semiBold'
  | 'bold'
  | 'extraBold'
  | 'italic'
  | 'fancy';

// Get font family based on locale and weight
export const getFontFamily = (locale: SupportedLocale, weight: FontWeight = 'regular'): string => {
  return FONTS[locale][weight];
};

// Get all fonts for a locale
export const getFontsForLocale = (locale: SupportedLocale): FontConfig => {
  return FONTS[locale];
};

export default FONTS;
