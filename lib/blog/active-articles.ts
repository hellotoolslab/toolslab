import { mockArticles } from './mock-articles';
import type { Locale } from '@/lib/i18n/config';
import type { BlogArticleContent } from './types';

// List of article slugs that have active pages
export const ACTIVE_ARTICLE_SLUGS: string[] = [
  'json-formatting-complete-guide',
];

// Filter articles to only include those with active pages
export const getActiveArticles = () => {
  return mockArticles.filter((article) =>
    ACTIVE_ARTICLE_SLUGS.includes(article.slug)
  );
};

// Get active articles with locale-aware content
export const getActiveArticlesForLocale = async (
  locale: Locale
): Promise<BlogArticleContent[]> => {
  const activeArticles = getActiveArticles();
  const articlesWithContent: BlogArticleContent[] = [];

  for (const article of activeArticles) {
    try {
      // Try to load article in the requested locale
      const content = await import(
        `@/content/blog/${locale}/${article.slug}.json`
      ).then((mod) => mod.default as BlogArticleContent);
      articlesWithContent.push(content);
    } catch (error) {
      // Fallback to English if translation doesn't exist
      if (locale !== 'en') {
        try {
          const content = await import(
            `@/content/blog/en/${article.slug}.json`
          ).then((mod) => mod.default as BlogArticleContent);
          articlesWithContent.push(content);
        } catch {
          // Skip this article if even English version doesn't exist
          console.warn(
            `Article ${article.slug} not found in ${locale} or en locale`
          );
        }
      }
    }
  }

  return articlesWithContent;
};

// Check if an article is active
export const isArticleActive = (slug: string): boolean => {
  return ACTIVE_ARTICLE_SLUGS.includes(slug);
};

// Add this comment for future development:
// When adding new blog articles, follow these steps:
// 1. Create the article page: app/blog/[article-slug]/page.tsx
// 2. Add the slug to ACTIVE_ARTICLE_SLUGS array above
// 3. The article will automatically appear on the blog homepage
