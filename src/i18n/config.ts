// i18n/config.ts — Locale configuration & types

export const locales = ['en', 'vi', 'ko', 'zh', 'fr', 'de', 'es', 'ru'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  vi: 'Tiếng Việt',
  ko: '한국어',
  zh: '中文',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  ru: 'Русский',
};

/** BCP 47 language tags for <html lang> and hreflang */
export const localeTags: Record<Locale, string> = {
  en: 'en',
  vi: 'vi',
  ko: 'ko',
  zh: 'zh-Hans',
  fr: 'fr',
  de: 'de',
  es: 'es',
  ru: 'ru',
};
