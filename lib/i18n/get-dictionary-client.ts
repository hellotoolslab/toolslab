'use client';

import type { Locale } from './config';
import type { Dictionary } from './types';

// Client-side dictionary cache
const dictionaries = new Map<Locale, Dictionary>();

/**
 * Client-side dictionary loader for client components
 * Uses API route to fetch dictionaries
 */
export const getClientDictionary = async (
  locale: Locale
): Promise<Dictionary> => {
  // Return cached dictionary if available
  if (dictionaries.has(locale)) {
    return dictionaries.get(locale)!;
  }

  try {
    const response = await fetch(`/api/dictionary/${locale}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch dictionary for locale: ${locale}`);
    }

    const dictionary = await response.json();

    // Cache the dictionary
    dictionaries.set(locale, dictionary);

    return dictionary;
  } catch (error) {
    console.error(
      `Failed to load client dictionary for locale: ${locale}`,
      error
    );

    // Fallback to English
    if (locale !== 'en') {
      return getClientDictionary('en');
    }

    throw error;
  }
};
