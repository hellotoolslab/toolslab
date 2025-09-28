// Basic locale types - these should match locale-config.ts
export type Locale = 'en' | 'it'; // Future: add new locales here when activating them

export const locales: Locale[] = ['en', 'it'];
export const defaultLocale: Locale = 'en';

// Locales that should have URL prefix (exclude default)
export const localesWithPrefix = locales.filter((l) => l !== defaultLocale);

// Legacy exports for backward compatibility
// These will be dynamically populated from locale-config.ts
export const localeNames: Record<Locale, string> = {
  en: 'English',
  it: 'Italiano',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  it: '🇮🇹',
};

// Future locales (ready to add)
// When adding a new locale:
// 1. Add to Locale type
// 2. Add to locales array
// 3. Add to localeNames
// 4. Add to localeFlags
// 5. Create dictionary file in dictionaries/
export const futureLocales = {
  fr: { name: 'Français', flag: '🇫🇷' },
  es: { name: 'Español', flag: '🇪🇸' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  pt: { name: 'Português', flag: '🇵🇹' },
  nl: { name: 'Nederlands', flag: '🇳🇱' },
  pl: { name: 'Polski', flag: '🇵🇱' },
  tr: { name: 'Türkçe', flag: '🇹🇷' },
};
