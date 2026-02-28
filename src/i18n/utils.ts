// i18n/utils.ts — Translation helpers

import { locales, defaultLocale, type Locale } from './config';

// Import all translation files
import en from './translations/en.json';
import vi from './translations/vi.json';
import ko from './translations/ko.json';
import zh from './translations/zh.json';
import fr from './translations/fr.json';
import de from './translations/de.json';
import es from './translations/es.json';
import ru from './translations/ru.json';

const translations: Record<Locale, Record<string, string>> = {
  en, vi, ko, zh, fr, de, es, ru,
};

/**
 * Get a translated string by key. Falls back to English if missing.
 */
export function t(locale: Locale, key: string): string {
  return translations[locale]?.[key] ?? translations[defaultLocale]?.[key] ?? key;
}

/**
 * Get all translations for a locale (for passing bulk data to components).
 */
export function getTranslations(locale: Locale): Record<string, string> {
  return translations[locale] ?? translations[defaultLocale];
}

/**
 * Extract locale from a URL pathname.
 * "/" → "en", "/vi/about" → "vi", "/ko/renting" → "ko"
 */
export function getLocaleFromUrl(url: URL): Locale {
  const [, maybeLang] = url.pathname.split('/');
  if (locales.includes(maybeLang as Locale)) {
    return maybeLang as Locale;
  }
  return defaultLocale;
}

/**
 * Generate a localized URL path.
 * localizedUrl('en', '/about') → '/about'
 * localizedUrl('vi', '/about') → '/vi/about'
 * localizedUrl('ko', '/') → '/ko'
 */
export function localizedUrl(locale: Locale, path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (locale === defaultLocale) {
    return cleanPath;
  }
  return `/${locale}${cleanPath === '/' ? '' : cleanPath}`;
}

/**
 * Switch the locale of a current URL to a target locale.
 * switchLocaleUrl('/vi/about', 'ko') → '/ko/about'
 * switchLocaleUrl('/about', 'vi') → '/vi/about'
 * switchLocaleUrl('/vi/', 'en') → '/'
 */
export function switchLocaleUrl(currentPath: string, targetLocale: Locale): string {
  // Strip current locale prefix if present
  const [, maybeLang, ...rest] = currentPath.split('/');
  let basePath: string;
  if (locales.includes(maybeLang as Locale)) {
    basePath = '/' + rest.join('/');
  } else {
    basePath = currentPath;
  }
  // Ensure basePath is at least '/'
  if (!basePath || basePath === '') basePath = '/';
  return localizedUrl(targetLocale, basePath);
}

/**
 * Get all locales as array (useful for getStaticPaths)
 */
export function getNonDefaultLocales(): Locale[] {
  return locales.filter((l) => l !== defaultLocale) as Locale[];
}
