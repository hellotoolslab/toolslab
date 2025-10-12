import { Locale } from '@/lib/i18n/config';
import { BlogArticleContent, ArticleWithLocale } from './types';

/**
 * Get a blog article for a specific locale with automatic fallback to English
 * @param slug - Article slug (e.g., 'json-formatting-complete-guide')
 * @param locale - Target locale (e.g., 'it', 'es', 'fr')
 * @returns Article content with locale information and fallback status
 */
export async function getArticle(
  slug: string,
  locale: Locale
): Promise<ArticleWithLocale> {
  try {
    // Try to load the article in the requested locale
    const article = await import(`@/content/blog/${locale}/${slug}.json`).then(
      (mod) => mod.default as BlogArticleContent
    );

    return {
      article,
      locale,
      isFallback: false,
    };
  } catch (error) {
    // If the requested locale is not English, try falling back to English
    if (locale !== 'en') {
      try {
        const article = await import(`@/content/blog/en/${slug}.json`).then(
          (mod) => mod.default as BlogArticleContent
        );

        return {
          article,
          locale: 'en',
          isFallback: true,
        };
      } catch (fallbackError) {
        // Article doesn't exist in English either
        return {
          article: null,
          locale,
          isFallback: false,
        };
      }
    }

    // Article doesn't exist
    return {
      article: null,
      locale,
      isFallback: false,
    };
  }
}

/**
 * Check if an article exists for a specific locale
 * @param slug - Article slug
 * @param locale - Locale to check
 * @returns True if the article exists for the given locale
 */
export async function articleExistsForLocale(
  slug: string,
  locale: Locale
): Promise<boolean> {
  try {
    await import(`@/content/blog/${locale}/${slug}.json`);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get all available locales for a specific article
 * @param slug - Article slug
 * @returns Array of locales where the article is available
 */
export async function getAvailableLocalesForArticle(
  slug: string
): Promise<Locale[]> {
  const locales: Locale[] = ['en', 'it', 'es', 'fr'];
  const availableLocales: Locale[] = [];

  for (const locale of locales) {
    if (await articleExistsForLocale(slug, locale)) {
      availableLocales.push(locale);
    }
  }

  return availableLocales;
}
