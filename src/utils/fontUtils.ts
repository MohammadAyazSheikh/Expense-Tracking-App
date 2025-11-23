import { useAppSettingsStore } from "../store/index";
import { getFontFamily, FontWeight } from "../fonts/config";
import { SupportedLocale } from "../i18n/types";

/**
 * Get current font family outside of React components
 * Useful for:
 * - Toast messages
 * - Alert dialogs
 * - Third-party components
 * - API callbacks
 */
export const getCurrentFont = (weight: FontWeight = "regular"): string => {
  const { locale } = useAppSettingsStore();
  return getFontFamily(locale, weight);
};

/**
 * Get all fonts for current locale
 */
export const getCurrentFonts = () => {
  const { locale } = useAppSettingsStore();
  return {
    regular: getFontFamily(locale, "regular"),
    medium: getFontFamily(locale, "medium"),
    semiBold: getFontFamily(locale, "semiBold"),
    bold: getFontFamily(locale, "bold"),
    extraBold: getFontFamily(locale, "extraBold"),
    italic: getFontFamily(locale, "italic"),
    black: getFontFamily(locale, "black"),
  };
};

/**
 * Get current locale
 */
export const getCurrentLocale = (): SupportedLocale => {
  const { locale } = useAppSettingsStore();
  return locale;
};
