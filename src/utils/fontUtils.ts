import { useAppSettingsStore } from "../store/index";
import { getFontFamily, FontWeight } from "../fonts/config";
import { SUPPORTED_LANGUAGES, SupportedLanguage } from "../i18n/types";

/**
 * Get current font family outside of React components
 * Useful for:
 * - Toast messages
 * - Alert dialogs
 * - Third-party components
 * - API callbacks
 */
export const getCurrentFont = (weight: FontWeight = "regular"): string => {
  const { language } = useAppSettingsStore();
  return getFontFamily(language, weight);
};

/**
 * Get all fonts for current language
 */
export const getCurrentFonts = () => {
  const { language } = useAppSettingsStore();
  return {
    regular: getFontFamily(language, "regular"),
    medium: getFontFamily(language, "medium"),
    semiBold: getFontFamily(language, "semiBold"),
    bold: getFontFamily(language, "bold"),
    extraBold: getFontFamily(language, "extraBold"),
    italic: getFontFamily(language, "italic"),
    black: getFontFamily(language, "black"),
  };
};

/**
 * Get current language
 */
export const getCurrentLanguage = (): SupportedLanguage => {
  const { language } = useAppSettingsStore();
  return language;
};
