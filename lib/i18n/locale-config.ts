import { type Locale } from './config';

/**
 * Enhanced locale configuration with all necessary metadata
 * for auto-scaling multilingual system
 */
export interface LocaleConfig {
  code: Locale;
  name: string;
  flag: string;
  intlCode: string; // For Intl API (it-IT, en-US, fr-FR, etc.)
  direction: 'ltr' | 'rtl';
  browserCodes: string[]; // Language codes for browser detection
  domain?: string; // Optional: for subdomain localization
  dateFormat: string; // Default date format pattern
  numberFormat: {
    decimal: string;
    thousands: string;
  };
}

/**
 * Centralized locale configurations
 * Adding a new language requires only updating this object
 */
export const LOCALE_CONFIGS: Record<Locale, LocaleConfig> = {
  en: {
    code: 'en',
    name: 'English',
    flag: '🇬🇧',
    intlCode: 'en-US',
    direction: 'ltr',
    browserCodes: ['en', 'en-US', 'en-GB', 'en-CA', 'en-AU'],
    dateFormat: 'MMM d, yyyy',
    numberFormat: {
      decimal: '.',
      thousands: ',',
    },
  },
  it: {
    code: 'it',
    name: 'Italiano',
    flag: '🇮🇹',
    intlCode: 'it-IT',
    direction: 'ltr',
    browserCodes: ['it', 'it-IT', 'it-CH'],
    dateFormat: 'd MMM yyyy',
    numberFormat: {
      decimal: ',',
      thousands: '.',
    },
  },
  es: {
    code: 'es',
    name: 'Español',
    flag: '🇪🇸',
    intlCode: 'es-ES',
    direction: 'ltr',
    browserCodes: ['es', 'es-ES', 'es-MX', 'es-AR', 'es-CO'],
    dateFormat: 'd MMM yyyy',
    numberFormat: {
      decimal: ',',
      thousands: '.',
    },
  },
  fr: {
    code: 'fr',
    name: 'Français',
    flag: '🇫🇷',
    intlCode: 'fr-FR',
    direction: 'ltr',
    browserCodes: ['fr', 'fr-FR', 'fr-CA', 'fr-BE', 'fr-CH'],
    dateFormat: 'd MMM yyyy',
    numberFormat: {
      decimal: ',',
      thousands: ' ',
    },
  },
  // Future locales ready to be activated
  // Simply uncomment and add dictionary files to enable
  de: {
    code: 'de',
    name: 'Deutsch',
    flag: '🇩🇪',
    intlCode: 'de-DE',
    direction: 'ltr',
    browserCodes: ['de', 'de-DE', 'de-AT', 'de-CH'],
    dateFormat: 'd. MMM yyyy',
    numberFormat: {
      decimal: ',',
      thousands: '.',
    },
  },
  /*
  pt: {
    code: 'pt',
    name: 'Português',
    flag: '🇵🇹',
    intlCode: 'pt-PT',
    direction: 'ltr',
    browserCodes: ['pt', 'pt-PT', 'pt-BR'],
    dateFormat: 'd MMM yyyy',
    numberFormat: {
      decimal: ',',
      thousands: ' ',
    },
  },
  nl: {
    code: 'nl',
    name: 'Nederlands',
    flag: '🇳🇱',
    intlCode: 'nl-NL',
    direction: 'ltr',
    browserCodes: ['nl', 'nl-NL', 'nl-BE'],
    dateFormat: 'd MMM yyyy',
    numberFormat: {
      decimal: ',',
      thousands: '.',
    },
  },
  pl: {
    code: 'pl',
    name: 'Polski',
    flag: '🇵🇱',
    intlCode: 'pl-PL',
    direction: 'ltr',
    browserCodes: ['pl', 'pl-PL'],
    dateFormat: 'd MMM yyyy',
    numberFormat: {
      decimal: ',',
      thousands: ' ',
    },
  },
  tr: {
    code: 'tr',
    name: 'Türkçe',
    flag: '🇹🇷',
    intlCode: 'tr-TR',
    direction: 'ltr',
    browserCodes: ['tr', 'tr-TR'],
    dateFormat: 'd MMM yyyy',
    numberFormat: {
      decimal: ',',
      thousands: '.',
    },
  },
  */
} as const;

/**
 * Get locale configuration by locale code
 */
export function getLocaleConfig(locale: Locale): LocaleConfig {
  const config = LOCALE_CONFIGS[locale];
  if (!config) {
    console.warn(
      `Locale config not found for: ${locale}, falling back to English`
    );
    return LOCALE_CONFIGS.en;
  }
  return config;
}

/**
 * Get all available locale configurations
 */
export function getAllLocaleConfigs(): LocaleConfig[] {
  return Object.values(LOCALE_CONFIGS);
}

/**
 * Detect locale from browser language codes
 */
export function detectLocaleFromBrowser(
  browserLanguages: readonly string[]
): Locale | null {
  for (const browserLang of browserLanguages) {
    const normalizedBrowserLang = browserLang.toLowerCase();

    // Find matching locale config
    for (const config of getAllLocaleConfigs()) {
      if (
        config.browserCodes.some((code) =>
          normalizedBrowserLang.startsWith(code.toLowerCase())
        )
      ) {
        return config.code;
      }
    }
  }

  return null;
}

/**
 * Check if locale requires RTL layout
 */
export function isRTLLocale(locale: Locale): boolean {
  return getLocaleConfig(locale).direction === 'rtl';
}

/**
 * Get formatted Intl locale string for locale
 */
export function getIntlLocale(locale: Locale): string {
  return getLocaleConfig(locale).intlCode;
}

/**
 * Get all active locales (only those present in LOCALE_CONFIGS)
 */
export function getActiveLocales(): Locale[] {
  return Object.keys(LOCALE_CONFIGS) as Locale[];
}

/**
 * Check if locale is currently active/supported
 */
export function isActiveLocale(locale: string): locale is Locale {
  return locale in LOCALE_CONFIGS;
}
