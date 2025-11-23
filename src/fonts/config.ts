import { SupportedLocale } from '../i18n/types';

export interface FontConfig {
  regular: string;
  medium: string;
  semiBold: string;
  bold: string;
  extraBold: string;
  italic: string;
  black: string;
}

// Defining fonts for each locale
const FONTS: Record<SupportedLocale, FontConfig> = {
  en: {
    regular: 'Nunito-Regular',
    medium: 'Nunito-Medium',
    semiBold: 'Nunito-SemiBold',
    bold: 'Nunito-Bold',
    extraBold: 'Nunito-ExtraBold',
    italic: 'Nunito-Italic',
    black: 'Nunito-Black',
  },
  ar: {
    regular: 'NotoNaskhArabic-Regular',
    medium: 'NotoNaskhArabic-Medium',
    semiBold: 'NotoNaskhArabic-SemiBold',
    bold: 'NotoNaskhArabic-Bold',
    extraBold: 'NotoNaskhArabic-Bold', // Fallback to Bold as ExtraBold isn't available
    italic: 'NotoNaskhArabic-Regular', // Arabic usually doesn't have italic, fallback to regular
    black: 'NotoNaskhArabic-Bold',
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
  | 'black';

// Get font family based on locale and weight
export const getFontFamily = (locale: SupportedLocale, weight: FontWeight = 'regular'): string => {
  return FONTS[locale][weight];
};

// Get all fonts for a locale
export const getFontsForLocale = (locale: SupportedLocale): FontConfig => {
  return FONTS[locale];
};

export default FONTS;
