/**
 * Hreflang utilities for generating bidirectional multilingual SEO tags
 *
 * CRITICAL: Every page MUST include ALL hreflang tags for ALL languages
 * to satisfy Google's reciprocal linking requirement.
 */

import { locales, defaultLocale } from '@/lib/i18n/config';

export type PageType =
  | 'tool'
  | 'blog'
  | 'static'
  | 'category'
  | 'tools-index'
  | 'blog-index';

export interface HreflangConfig {
  pageType: PageType;
  path: string; // e.g., 'json-formatter' for tools, 'post-slug' for blog, '' for homepage
  baseUrl?: string; // defaults to https://toolslab.dev
}

/**
 * Generate complete hreflang alternates for Next.js metadata
 * Returns Record<string, string> compatible with metadata.alternates.languages
 *
 * @example
 * // Tool page
 * generateHreflangAlternates({
 *   pageType: 'tool',
 *   path: 'json-formatter'
 * })
 * // Returns:
 * // {
 * //   'en': 'https://toolslab.dev/tools/json-formatter',
 * //   'it': 'https://toolslab.dev/it/tools/json-formatter',
 * //   'es': 'https://toolslab.dev/es/tools/json-formatter',
 * //   'fr': 'https://toolslab.dev/fr/tools/json-formatter',
 * //   'x-default': 'https://toolslab.dev/tools/json-formatter'
 * // }
 */
export function generateHreflangAlternates(
  config: HreflangConfig
): Record<string, string> {
  const { pageType, path, baseUrl = 'https://toolslab.dev' } = config;
  const languages: Record<string, string> = {};

  // Generate URL for each locale
  locales.forEach((locale) => {
    const url = buildUrlForLocale(pageType, path, locale, baseUrl);
    languages[locale] = url;
  });

  // x-default always points to English (default locale)
  const defaultUrl = buildUrlForLocale(pageType, path, defaultLocale, baseUrl);
  languages['x-default'] = defaultUrl;

  return languages;
}

/**
 * Build absolute URL for specific locale and page type
 */
function buildUrlForLocale(
  pageType: PageType,
  path: string,
  locale: string,
  baseUrl: string
): string {
  // English (default) has no locale prefix
  const localePrefix = locale === defaultLocale ? '' : `/${locale}`;

  switch (pageType) {
    case 'tool':
      return `${baseUrl}${localePrefix}/tools/${path}`;

    case 'tools-index':
      return `${baseUrl}${localePrefix}/tools`;

    case 'blog':
      return `${baseUrl}${localePrefix}/blog/${path}`;

    case 'blog-index':
      return `${baseUrl}${localePrefix}/blog`;

    case 'category':
      return `${baseUrl}${localePrefix}/category/${path}`;

    case 'static':
      // Static pages: homepage (''), about, lab, etc.
      if (path === '') {
        return `${baseUrl}${localePrefix}` || baseUrl;
      }
      return `${baseUrl}${localePrefix}/${path}`;

    default:
      throw new Error(`Unknown page type: ${pageType}`);
  }
}

/**
 * Validate that hreflang alternates are complete and reciprocal
 * Used in tests and validation scripts
 */
export function validateHreflangAlternates(
  alternates: Record<string, string>
): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check all locales are present
  locales.forEach((locale) => {
    if (!alternates[locale]) {
      errors.push(`Missing hreflang for locale: ${locale}`);
    }
  });

  // Check x-default is present
  if (!alternates['x-default']) {
    errors.push('Missing x-default hreflang');
  }

  // Check all URLs are absolute with https
  Object.entries(alternates).forEach(([lang, url]) => {
    if (!url.startsWith('https://')) {
      errors.push(`URL for ${lang} is not absolute HTTPS: ${url}`);
    }
  });

  // Check x-default points to English version
  const enUrl = alternates['en'];
  const defaultUrl = alternates['x-default'];
  if (enUrl && defaultUrl && enUrl !== defaultUrl) {
    errors.push('x-default should point to English version');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get all possible hreflang URLs for a given page
 * Useful for sitemap generation and validation
 */
export function getAllHreflangUrls(config: HreflangConfig): string[] {
  const alternates = generateHreflangAlternates(config);
  // Remove x-default as it's a duplicate of 'en'
  const { 'x-default': _, ...languageUrls } = alternates;
  return Object.values(languageUrls);
}
