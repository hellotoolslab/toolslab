import { mockArticles } from './mock-articles';

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

// Check if an article is active
export const isArticleActive = (slug: string): boolean => {
  return ACTIVE_ARTICLE_SLUGS.includes(slug);
};

// Add this comment for future development:
// When adding new blog articles, follow these steps:
// 1. Create the article page: app/blog/[article-slug]/page.tsx
// 2. Add the slug to ACTIVE_ARTICLE_SLUGS array above
// 3. The article will automatically appear on the blog homepage
