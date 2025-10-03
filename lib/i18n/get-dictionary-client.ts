'use client';

import type { Locale } from './config';
import type { Dictionary } from './types';

// Client-side dictionary cache (full dictionaries)
const dictionaries = new Map<Locale, Dictionary>();

// Section cache (per-locale per-sections combination)
const sectionCache = new Map<string, Dictionary>();

/**
 * Client-side dictionary loader for client components
 * Uses API route to fetch dictionaries (full or specific sections)
 *
 * @param locale - The locale to load
 * @param sections - Optional array of sections to load (e.g., ['common', 'home'])
 */
export const getClientDictionary = async (
  locale: Locale,
  sections?: string[]
): Promise<Dictionary> => {
  // Generate cache key
  const cacheKey = sections ? `${locale}:${sections.sort().join(',')}` : locale;

  // Check section-specific cache first
  if (sections && sectionCache.has(cacheKey)) {
    return sectionCache.get(cacheKey)!;
  }

  // Check full dictionary cache
  if (!sections && dictionaries.has(locale)) {
    return dictionaries.get(locale)!;
  }

  try {
    // Build fetch URL with sections parameter
    const url = sections
      ? `/api/dictionary/${locale}?sections=${sections.join(',')}`
      : `/api/dictionary/${locale}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch dictionary for locale: ${locale}, sections: ${sections?.join(',') || 'all'}`
      );
    }

    const dictionary = await response.json();

    // Cache appropriately
    if (sections) {
      sectionCache.set(cacheKey, dictionary);
    } else {
      dictionaries.set(locale, dictionary);
    }

    return dictionary;
  } catch (error) {
    console.error(
      `Failed to load client dictionary for locale: ${locale}, sections: ${sections?.join(',') || 'all'}`,
      error
    );

    // Fallback to English
    if (locale !== 'en') {
      return getClientDictionary('en', sections);
    }

    throw error;
  }
};
