'use client';

import type { Locale } from './config';
import type { Dictionary } from './types';
import {
  BaseDictionaryLoader,
  validateSections,
} from './base-dictionary-loader';

/**
 * Client-side dictionary loader implementation
 * Fetches dictionaries from API route
 */
class ClientDictionaryLoader extends BaseDictionaryLoader {
  protected async loadFromSource(
    locale: Locale,
    sections?: string[]
  ): Promise<Dictionary> {
    if (!validateSections(sections)) {
      throw new Error(`Invalid sections: ${sections?.join(',')}`);
    }

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

    return response.json();
  }
}

// Singleton instance
const clientLoader = new ClientDictionaryLoader();

/**
 * Client-side dictionary loader for client components
 * Uses API route to fetch dictionaries with caching
 *
 * @param locale - The locale to load
 * @param sections - Optional array of sections to load (e.g., ['common', 'home'])
 */
export const getClientDictionary = async (
  locale: Locale,
  sections?: string[]
): Promise<Dictionary> => {
  try {
    return await clientLoader.load(locale, sections);
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
