import { type Locale } from './config';

/**
 * Centralized SEO metadata for all pages
 * Auto-scales with any number of locales
 */

export interface SEOMetadata {
  keywords: Record<Locale, string[]>;
  descriptions: Record<Locale, string>;
  titles: Record<Locale, string>;
}

/**
 * Page-specific SEO metadata
 */
export const PAGE_METADATA: Record<string, SEOMetadata> = {
  home: {
    titles: {
      en: 'ToolsLab - Free Developer Tools Laboratory',
      it: 'ToolsLab - Laboratorio Strumenti Sviluppatore Gratuiti',
    },
    descriptions: {
      en: 'Free online developer tools for JSON formatting, Base64 encoding, URL decoding, hash generation, and more. All tools work entirely in your browser with no data transmission to servers.',
      it: 'Strumenti online gratuiti per sviluppatori: formattazione JSON, codifica Base64, decodifica URL, generazione hash e altro. Tutti gli strumenti funzionano nel tuo browser senza trasmissione dati.',
    },
    keywords: {
      en: [
        'developer tools',
        'json formatter',
        'base64 encoder',
        'jwt decoder',
        'uuid generator',
        'hash generator',
        'url encoder',
        'timestamp converter',
        'regex tester',
        'online tools',
        'web tools',
        'free tools',
        'browser tools',
      ],
      it: [
        'strumenti sviluppatore',
        'formattatore json',
        'codificatore base64',
        'decodificatore jwt',
        'generatore uuid',
        'generatore hash',
        'codificatore url',
        'convertitore timestamp',
        'tester regex',
        'strumenti online',
        'strumenti web',
        'strumenti gratuiti',
      ],
    },
  },
  tools: {
    titles: {
      en: 'All Developer Tools - Free Online Utilities | ToolsLab',
      it: 'Tutti gli Strumenti Sviluppatore - Utilità Online Gratuite | ToolsLab',
    },
    descriptions: {
      en: 'Discover 20+ free online tools for JSON formatting, Base64 encoding, URL decoding, hash generation, and more. All tools work entirely in your browser with no data transmission to servers. Perfect for development, debugging, and data processing workflows.',
      it: 'Scopri 20+ strumenti online gratuiti per formattazione JSON, codifica Base64, decodifica URL, generazione hash e altro. Tutti gli strumenti funzionano interamente nel tuo browser senza trasmissione dati ai server. Perfetti per flussi di lavoro di sviluppo, debug e elaborazione dati.',
    },
    keywords: {
      en: [
        'developer tools online',
        'free developer utilities',
        'web development tools',
        'json formatter',
        'base64 encoder',
        'url decoder',
        'hash generator',
        'browser-based tools',
        'development utilities',
        'programming tools',
        'web utilities',
        'free online tools',
      ],
      it: [
        'strumenti sviluppatore online',
        'utilità sviluppatore gratuite',
        'strumenti sviluppo web',
        'formattatore json',
        'codificatore base64',
        'decodificatore url',
        'generatore hash',
        'strumenti basati su browser',
        'utilità sviluppo',
        'strumenti programmazione',
        'utilità web',
        'strumenti online gratuiti',
      ],
    },
  },
  categories: {
    titles: {
      en: 'Tool Categories - Browse by Type | ToolsLab',
      it: 'Categorie Strumenti - Sfoglia per Tipo | ToolsLab',
    },
    descriptions: {
      en: 'Browse developer tools organized by category: Data & Conversion, Encoding & Security, Text & Format, Generators, Web & Design, and Development Utilities.',
      it: 'Sfoglia gli strumenti per sviluppatori organizzati per categoria: Data & Conversione, Codifica & Sicurezza, Testo & Formato, Generatori, Web & Design, e Utilità di Sviluppo.',
    },
    keywords: {
      en: [
        'tool categories',
        'developer tools by type',
        'data conversion tools',
        'encoding tools',
        'text formatting tools',
        'code generators',
        'web development tools',
        'utility categories',
      ],
      it: [
        'categorie strumenti',
        'strumenti sviluppatore per tipo',
        'strumenti conversione dati',
        'strumenti codifica',
        'strumenti formattazione testo',
        'generatori codice',
        'strumenti sviluppo web',
        'categorie utilità',
      ],
    },
  },
  lab: {
    titles: {
      en: 'My Developer Lab - Favorites & Tool Chain | ToolsLab',
      it: 'Il Mio Lab Sviluppatore - Preferiti & Catena Strumenti | ToolsLab',
    },
    descriptions: {
      en: 'Your personal developer lab. Save your favorite tools, create custom tool chains, and streamline your development workflow with quick access to frequently used utilities.',
      it: 'Il tuo laboratorio personale per sviluppatori. Salva i tuoi strumenti preferiti, crea catene di strumenti personalizzate e ottimizza il tuo flusso di lavoro con accesso rapido alle utilità più utilizzate.',
    },
    keywords: {
      en: [
        'developer lab',
        'favorite tools',
        'tool chain',
        'development workflow',
        'personal workspace',
        'saved tools',
        'productivity',
        'developer workspace',
      ],
      it: [
        'lab sviluppatore',
        'strumenti preferiti',
        'catena strumenti',
        'flusso lavoro sviluppo',
        'workspace personale',
        'strumenti salvati',
        'produttività',
        'workspace sviluppatore',
      ],
    },
  },
} as const;

/**
 * Get SEO metadata for a specific page and locale
 */
export function getPageMetadata(
  page: string,
  locale: Locale
): {
  title: string;
  description: string;
  keywords: string[];
} {
  const metadata = PAGE_METADATA[page];

  if (!metadata) {
    // Fallback to home metadata
    const fallback = PAGE_METADATA.home;
    return {
      title: fallback.titles[locale] || fallback.titles.en,
      description: fallback.descriptions[locale] || fallback.descriptions.en,
      keywords: fallback.keywords[locale] || fallback.keywords.en,
    };
  }

  return {
    title: metadata.titles[locale] || metadata.titles.en,
    description: metadata.descriptions[locale] || metadata.descriptions.en,
    keywords: metadata.keywords[locale] || metadata.keywords.en,
  };
}

/**
 * Get keywords as string for meta tags
 */
export function getKeywordsString(page: string, locale: Locale): string {
  const metadata = getPageMetadata(page, locale);
  return metadata.keywords.join(', ');
}
