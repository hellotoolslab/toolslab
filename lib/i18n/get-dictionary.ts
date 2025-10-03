import 'server-only';
import type { Locale } from './config';
import type { Dictionary } from './types';

// Re-export type for convenience in server components
export type { Dictionary } from './types';

// Dictionary cache (full dictionaries)
const dictionaries = new Map<Locale, Dictionary>();

// Section cache (per-locale per-section)
const sectionCache = new Map<string, any>();

/**
 * Get dictionary sections (new split approach)
 */
export const getDictionary = async (
  locale: Locale,
  sections?: string[]
): Promise<Dictionary> => {
  // If no sections specified, load full dictionary (backward compatibility)
  if (!sections) {
    return loadFullDictionary(locale);
  }

  // Load specific sections
  try {
    const dictionary: Partial<Dictionary> = {};

    await Promise.all(
      sections.map(async (section) => {
        const cacheKey = `${locale}:${section}`;

        // Check cache first
        if (sectionCache.has(cacheKey)) {
          Object.assign(dictionary, sectionCache.get(cacheKey));
          return;
        }

        // Load section from file
        try {
          const sectionData = await import(
            `./dictionaries/${locale}/${section}.json`
          ).then((module) => module.default);

          // Cache the section
          sectionCache.set(cacheKey, sectionData);

          // Merge into dictionary
          Object.assign(dictionary, sectionData);
        } catch (sectionError) {
          console.warn(
            `Section "${section}" not found for locale "${locale}", skipping`
          );
        }
      })
    );

    return dictionary as Dictionary;
  } catch (error) {
    console.error(
      `Failed to load sections ${sections.join(', ')} for locale: ${locale}`,
      error
    );

    // Fallback to English
    if (locale !== 'en') {
      return getDictionary('en', sections);
    }

    throw error;
  }
};

/**
 * Load full dictionary (legacy approach, backward compatible)
 */
async function loadFullDictionary(locale: Locale): Promise<Dictionary> {
  // Return cached dictionary if available
  if (dictionaries.has(locale)) {
    return dictionaries.get(locale)!;
  }

  try {
    // Try loading from monolithic file first (backward compatibility)
    try {
      const dictionary = await import(`./dictionaries/${locale}.json`).then(
        (module) => module.default
      );

      // Cache the dictionary
      dictionaries.set(locale, dictionary);
      return dictionary;
    } catch {
      // Monolithic file doesn't exist, load from sections directory
      const { loadAll } = await import(`./dictionaries/${locale}/index`);
      const dictionary = await loadAll();

      // Cache the dictionary
      dictionaries.set(locale, dictionary as Dictionary);
      return dictionary as Dictionary;
    }
  } catch (error) {
    console.error(`Failed to load dictionary for locale: ${locale}`, error);

    // Fallback to English if locale not found
    if (locale !== 'en') {
      return loadFullDictionary('en');
    }

    throw error;
  }
}
