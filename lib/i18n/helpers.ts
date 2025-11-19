import { locales, defaultLocale, type Locale } from './config';
import {
  getLocaleConfig,
  getAllLocaleConfigs,
  detectLocaleFromBrowser,
  getActiveLocales,
  isActiveLocale,
  getIntlLocale,
} from './locale-config';

/**
 * Get localized path for a given path and locale
 */
export function getLocalizedPath(path: string, locale: Locale): string {
  // Remove any existing locale prefix
  const cleanPath = stripLocaleFromPath(path);

  // If default locale (English), return path without prefix
  if (locale === defaultLocale) {
    return cleanPath;
  }

  // Special case for root path: return /{locale} without trailing slash
  if (cleanPath === '/') {
    return `/${locale}`;
  }

  // Add locale prefix for non-default locales
  return `/${locale}${cleanPath}`;
}

/**
 * Remove locale prefix from path
 * Auto-scales with all active locales
 */
export function stripLocaleFromPath(path: string): string {
  // Check if path starts with any active locale
  const activeLocales = getActiveLocales();

  for (const locale of activeLocales) {
    if (path.startsWith(`/${locale}/`)) {
      return path.replace(`/${locale}`, '') || '/';
    }
    if (path === `/${locale}`) {
      return '/';
    }
  }

  return path;
}

/**
 * Check if a locale is valid
 * Now uses centralized active locale checking
 */
export function isValidLocale(locale: string): locale is Locale {
  return isActiveLocale(locale);
}

/**
 * Get alternate language links for SEO
 * Auto-generates for ALL active locales
 */
export function getAlternateLinks(
  path: string
): Array<{ locale: Locale; url: string; hreflang: string }> {
  const cleanPath = stripLocaleFromPath(path);
  const baseUrl = 'https://toolslab.dev';
  const activeLocales = getActiveLocales();

  const links: Array<{ locale: Locale; url: string; hreflang: string }> = [];

  // Generate links for all active locales
  for (const locale of activeLocales) {
    const localizedPath = getLocalizedPath(cleanPath, locale);
    links.push({
      locale,
      url: `${baseUrl}${localizedPath}`,
      hreflang: locale,
    });
  }

  // Add x-default pointing to default locale
  links.push({
    locale: defaultLocale,
    url: `${baseUrl}${getLocalizedPath(cleanPath, defaultLocale)}`,
    hreflang: 'x-default',
  });

  return links;
}

/**
 * Get locale from pathname
 */
export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length > 0 && isValidLocale(segments[0])) {
    return segments[0] as Locale;
  }

  return defaultLocale;
}

/**
 * Generate sitemap URLs for all locales
 * Auto-scales with all active locales
 */
export function generateSitemapUrls(
  paths: string[]
): Array<{ url: string; lastModified: string }> {
  const baseUrl = 'https://toolslab.dev';
  const urls: Array<{ url: string; lastModified: string }> = [];
  const lastModified = new Date().toISOString();
  const activeLocales = getActiveLocales();

  for (const path of paths) {
    // Generate URLs for all active locales
    for (const locale of activeLocales) {
      const localizedPath = getLocalizedPath(path, locale);
      urls.push({
        url: `${baseUrl}${localizedPath}`,
        lastModified,
      });
    }
  }

  return urls;
}

/**
 * Get browser language preference
 * Auto-scales with all active locales and their browser codes
 */
export function getBrowserLanguage(): Locale | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const browserLanguages = navigator.languages || [navigator.language];
  return detectLocaleFromBrowser(browserLanguages);
}

/**
 * Save language preference to cookie
 */
export function saveLanguagePreference(locale: Locale): void {
  if (typeof document !== 'undefined') {
    document.cookie = `preferred-locale=${locale};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
  }
}

/**
 * Get language preference from cookie
 */
export function getLanguagePreference(): Locale | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookies = document.cookie.split(';');

  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === 'preferred-locale' && isValidLocale(value)) {
      return value as Locale;
    }
  }

  return null;
}

/**
 * Format date according to locale
 * Auto-scales with all active locales using their Intl codes
 */
export function formatDate(date: Date, locale: Locale): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const intlLocale = getIntlLocale(locale);
  return new Intl.DateTimeFormat(intlLocale, options).format(date);
}

/**
 * Format number according to locale
 * Auto-scales with all active locales using their Intl codes
 */
export function formatNumber(number: number, locale: Locale): string {
  const intlLocale = getIntlLocale(locale);
  return new Intl.NumberFormat(intlLocale).format(number);
}

/**
 * Get reading time estimate based on locale
 * Auto-scales with all active locales - translations from dictionary
 */
export function getReadingTime(text: string, locale: Locale): string {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);

  // Note: This should ideally use dictionary for translations
  // For now, keeping basic implementation but ready for expansion
  if (locale === 'it') {
    return minutes === 1
      ? '1 minuto di lettura'
      : `${minutes} minuti di lettura`;
  }

  // Default to English for all other locales (future: use dictionary)
  return minutes === 1 ? '1 min read' : `${minutes} min read`;
}

/**
 * Generate hreflang alternates for Next.js metadata
 * Auto-generates for ALL active locales
 *
 * @param path - The path without locale prefix (e.g., '/category/social')
 * @returns Object with hreflang mappings for Next.js alternates.languages
 */
export function generateHreflangAlternates(
  path: string
): Record<string, string> {
  const cleanPath = stripLocaleFromPath(path);
  const baseUrl = 'https://toolslab.dev';
  const activeLocales = getActiveLocales();
  const alternates: Record<string, string> = {};

  // Add x-default (points to default locale)
  alternates['x-default'] =
    `${baseUrl}${getLocalizedPath(cleanPath, defaultLocale)}`;

  // Add all active locales
  for (const locale of activeLocales) {
    const localizedPath = getLocalizedPath(cleanPath, locale);
    alternates[locale] = `${baseUrl}${localizedPath}`;
  }

  return alternates;
}
