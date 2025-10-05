import { locales, defaultLocale, type Locale } from './config';

/**
 * Extract locale from pathname
 * @param pathname - The URL pathname (e.g., "/it/tools", "/fr", "/tools")
 * @returns The detected locale or default locale
 */
export function getLocaleFromPathname(pathname: string): Locale {
  // Remove leading slash and get first segment
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  // Check if first segment is a supported locale
  if (firstSegment && locales.includes(firstSegment as Locale)) {
    return firstSegment as Locale;
  }

  return defaultLocale;
}

/**
 * Extract locale from URL string
 * @param url - Full URL or pathname
 * @returns The detected locale or default locale
 */
export function getLocaleFromUrl(url: string): Locale {
  try {
    const urlObj = new URL(url);
    return getLocaleFromPathname(urlObj.pathname);
  } catch {
    // If URL parsing fails, treat it as pathname
    return getLocaleFromPathname(url);
  }
}
