import 'server-only';
import type { Locale } from './config';

// Type for our dictionary structure
export interface Dictionary {
  common: {
    nav: {
      tools: string;
      blog: string;
      about: string;
      categories: string;
      allTools: string;
    };
    actions: {
      copy: string;
      download: string;
      clear: string;
      process: string;
      upload: string;
      paste: string;
      reset: string;
      share: string;
      save: string;
      load: string;
      export: string;
      import: string;
      format: string;
      validate: string;
      minify: string;
      beautify: string;
      encode: string;
      decode: string;
      encrypt: string;
      decrypt: string;
      generate: string;
      convert: string;
      analyze: string;
      compare: string;
    };
    messages: {
      success: string;
      error: string;
      copied: string;
      processing: string;
      noData: string;
      invalid: string;
      valid: string;
      loading: string;
      saved: string;
      deleted: string;
      updated: string;
      created: string;
      failed: string;
      warning: string;
      info: string;
    };
    labels: {
      input: string;
      output: string;
      options: string;
      settings: string;
      result: string;
      preview: string;
      source: string;
      target: string;
      from: string;
      to: string;
      file: string;
      text: string;
      code: string;
      data: string;
      format: string;
      type: string;
      mode: string;
      language: string;
      charset: string;
      encoding: string;
    };
    units: {
      bytes: string;
      kb: string;
      mb: string;
      gb: string;
      ms: string;
      seconds: string;
      minutes: string;
      hours: string;
      days: string;
      characters: string;
      words: string;
      lines: string;
    };
  };
  home: {
    hero: {
      title: string;
      subtitle: string;
      description: string;
    };
    features: {
      title: string;
      fast: {
        title: string;
        description: string;
      };
      secure: {
        title: string;
        description: string;
      };
      free: {
        title: string;
        description: string;
      };
    };
    categories: {
      title: string;
      viewAll: string;
    };
    popular: {
      title: string;
      subtitle: string;
    };
    whyToolsLab: {
      title: string;
      subtitle: string;
      footer: string;
      benefits: {
        instantProcessing: {
          title: string;
          description: string;
        };
        zeroDataStorage: {
          title: string;
          description: string;
        };
        chainTools: {
          title: string;
          description: string;
        };
        darkMode: {
          title: string;
          description: string;
        };
        worksEverywhere: {
          title: string;
          description: string;
        };
        noSignup: {
          title: string;
          description: string;
        };
      };
    };
  };
  tools: Record<
    string,
    {
      title: string;
      description: string;
      placeholder?: string;
      instructions?: string;
      features?: string[];
      meta: {
        title: string;
        description: string;
      };
      labels?: Record<string, string>;
      messages?: Record<string, string>;
      options?: Record<string, string>;
    }
  >;
  categories: Record<
    string,
    {
      name: string;
      description: string;
    }
  >;
  footer: {
    about: string;
    privacy: string;
    terms: string;
    contact: string;
    copyright: string;
    madeWith: string;
  };
  seo: {
    suffix: string;
    defaultDescription: string;
  };
}

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

// Client-side dictionary loader (for client components)
export const getClientDictionary = async (
  locale: Locale
): Promise<Dictionary> => {
  try {
    const response = await fetch(`/api/dictionary/${locale}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch dictionary for locale: ${locale}`);
    }
    return response.json();
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
