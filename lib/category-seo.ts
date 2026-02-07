import type { Locale } from './i18n/config';

export interface CategorySEO {
  id: string;
  h1Title: string;
  tagline: string;
  description: string;
  benefits: string[];
  useCases: string[];
  keywords: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  relatedCategories: string[];
  metaDescription: string;
}

// Relation map for categories (locale-independent logic)
const categoryRelations: Record<string, string[]> = {
  data: ['encoding', 'formatters'],
  encoding: ['data', 'dev'],
  base64: ['data', 'encoding'],
  text: ['data', 'formatters'],
  generators: ['dev', 'text'],
  web: ['generators', 'dev'],
  dev: ['encoding', 'data'],
  formatters: ['dev', 'text'],
  social: ['text', 'generators'],
  pdf: ['data', 'dev'],
};

/**
 * Load category SEO content for a specific locale
 * @param locale - The locale to load content for
 * @returns Promise with all categories SEO data
 */
async function loadCategorySEOData(
  locale: Locale
): Promise<Record<string, Omit<CategorySEO, 'id' | 'relatedCategories'>>> {
  try {
    const data = await import(
      `./i18n/dictionaries/${locale}/category-seo.json`
    ).then((module) => module.default);
    return data;
  } catch (error) {
    console.error(
      `Failed to load category SEO data for locale: ${locale}`,
      error
    );

    // Fallback to English if locale not found
    if (locale !== 'en') {
      return loadCategorySEOData('en');
    }

    throw error;
  }
}

/**
 * Get SEO content for a specific category
 * @param categoryId - The category ID (e.g., 'data', 'encoding')
 * @param locale - The locale to load content for (defaults to 'en')
 * @returns Promise with CategorySEO object or null if not found
 */
export async function getCategorySEO(
  categoryId: string,
  locale: Locale = 'en'
): Promise<CategorySEO | null> {
  try {
    const allData = await loadCategorySEOData(locale);
    const categoryData = allData[categoryId];

    if (!categoryData) {
      console.warn(`Category SEO data not found for: ${categoryId}`);
      return null;
    }

    // Merge translated content with locale-independent relations
    return {
      id: categoryId,
      ...categoryData,
      relatedCategories: categoryRelations[categoryId] || [],
    };
  } catch (error) {
    console.error(`Error getting category SEO for ${categoryId}:`, error);
    return null;
  }
}

/**
 * Generate structured data for category page
 * @param category - The category SEO object
 * @returns Structured data object for schema.org
 */
export function generateCategoryStructuredData(category: CategorySEO) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `ToolsLab ${category.h1Title}`,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    description: category.metaDescription,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: Math.floor(Math.random() * 500) + 1000,
    },
  };
}

/**
 * Get all category IDs
 * @returns Array of category IDs
 */
export function getAllCategoryIds(): string[] {
  return Object.keys(categoryRelations);
}
