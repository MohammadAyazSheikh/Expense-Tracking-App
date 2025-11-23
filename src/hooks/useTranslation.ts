import { useTranslation as useI18nTranslation } from 'react-i18next';
import { TranslationKeys } from '../i18n';

/**
 * Custom useTranslation hook with type-safe translation keys
 * 
 * @example
 * ```tsx
 * const { t } = useTranslation();
 * return <Text>{t('common.save')}</Text>
 * ```
 */
export const useTranslation = () => {
    const { t: i18nT, i18n } = useI18nTranslation();

    /**
     * Type-safe translation function
     * @param key - Translation key (e.g., 'common.save', 'dashboard.title')
     * @param options - Optional interpolation values
     */
    const t = (key: TranslationKeys, options?: any): string => {
        return String(i18nT(key, options));
    };

    return {
        t,
        i18n,
        language: i18n.language,
        changeLanguage: i18n.changeLanguage,
    };
};
