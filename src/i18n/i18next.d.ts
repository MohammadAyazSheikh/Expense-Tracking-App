import en from './locales/en.json';
import type { InitOptions } from 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: typeof en;
    defaultNS: 'translation';
    nsSeparator: '.';
    keySeparator: '.';
  }
}

declare module 'react-i18next' {
  interface CustomTypeOptions {
    resources: typeof en;
    defaultNS: 'translation';
    nsSeparator: '.';
    keySeparator: '.';
  }
}
