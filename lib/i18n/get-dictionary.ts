import 'server-only';
import type { Locale } from './config';
import type { Dictionary } from './types';

// Re-export type for convenience in server components
export type { Dictionary } from './types';

// Dictionary cache
const dictionaries = new Map<Locale, Dictionary>();

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  // Return cached dictionary if available
  if (dictionaries.has(locale)) {
    return dictionaries.get(locale)!;
  }

  try {
    // Dynamically import the dictionary based on locale
    const dictionary = await import(`./dictionaries/${locale}.json`).then(
      (module) => module.default
    );

    // Cache the dictionary
    dictionaries.set(locale, dictionary);

    return dictionary;
  } catch (error) {
    console.error(`Failed to load dictionary for locale: ${locale}`, error);

    // Fallback to English if locale not found
    if (locale !== 'en') {
      return getDictionary('en');
    }

    throw error;
  }
};
