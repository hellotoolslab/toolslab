import { locales, defaultLocale, type Locale } from './config';

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

  // Add locale prefix for non-default locales
  return `/${locale}${cleanPath}`;
}

/**
 * Remove locale prefix from path
 */
export function stripLocaleFromPath(path: string): string {
  // Check if path starts with any locale
  for (const locale of locales) {
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
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

/**
 * Get alternate language links for SEO
 */
export function getAlternateLinks(
  path: string
): Array<{ locale: Locale; url: string; hreflang: string }> {
  const cleanPath = stripLocaleFromPath(path);
  const baseUrl = 'https://toolslab.dev';

  return [
    {
      locale: 'en',
      url: `${baseUrl}${cleanPath}`,
      hreflang: 'en',
    },
    {
      locale: 'it',
      url: `${baseUrl}/it${cleanPath}`,
      hreflang: 'it',
    },
    // x-default should point to the default locale
    {
      locale: 'en',
      url: `${baseUrl}${cleanPath}`,
      hreflang: 'x-default',
    },
  ];
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
 */
export function generateSitemapUrls(
  paths: string[]
): Array<{ url: string; lastModified: string }> {
  const baseUrl = 'https://toolslab.dev';
  const urls: Array<{ url: string; lastModified: string }> = [];
  const lastModified = new Date().toISOString();

  for (const path of paths) {
    // Add URL for default locale (no prefix)
    urls.push({
      url: `${baseUrl}${path}`,
      lastModified,
    });

    // Add URLs for other locales
    for (const locale of locales.filter((l) => l !== defaultLocale)) {
      urls.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified,
      });
    }
  }

  return urls;
}

/**
 * Get browser language preference
 */
export function getBrowserLanguage(): Locale | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const browserLang = navigator.language.toLowerCase();

  // Check for exact match
  if (browserLang.startsWith('it')) {
    return 'it';
  }

  if (browserLang.startsWith('en')) {
    return 'en';
  }

  return null;
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
 */
export function formatDate(date: Date, locale: Locale): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Intl.DateTimeFormat(
    locale === 'it' ? 'it-IT' : 'en-US',
    options
  ).format(date);
}

/**
 * Format number according to locale
 */
export function formatNumber(number: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === 'it' ? 'it-IT' : 'en-US').format(
    number
  );
}

/**
 * Get reading time estimate based on locale
 */
export function getReadingTime(text: string, locale: Locale): string {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);

  if (locale === 'it') {
    return minutes === 1
      ? '1 minuto di lettura'
      : `${minutes} minuti di lettura`;
  }

  return minutes === 1 ? '1 min read' : `${minutes} min read`;
}
