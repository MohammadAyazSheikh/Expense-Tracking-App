import { SupportedLanguage } from '../i18n/types';

export interface FontConfig {
  regular: string;
  medium: string;
  semiBold: string;
  bold: string;
  extraBold: string;
  italic: string;
  black: string;
}

// Defining fonts for each language
const FONTS: Record<SupportedLanguage, FontConfig> = {
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
  ur: {
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

// Get font family based on language and weight
export const getFontFamily = (language: SupportedLanguage, weight: FontWeight = 'regular'): string => {
  return FONTS[language][weight];
};

// Get all fonts for a language
export const getFontsForLanguage = (language: SupportedLanguage): FontConfig => {
  return FONTS[language];
};

export default FONTS;
