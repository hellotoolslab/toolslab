'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { defaultLocale, type Locale } from '@/lib/i18n/config';
import { useLocalizedRouter } from '@/hooks/useLocalizedRouter';
import {
  getActiveLocales,
  getAllLocaleConfigs,
  getLocaleConfig,
} from '@/lib/i18n/locale-config';

export default function LanguageSwitcher({
  currentLocale,
}: {
  currentLocale?: Locale;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { locale, switchLanguage } = useLocalizedRouter();

  // Use provided locale or detected locale
  const activeLocale = currentLocale || locale;
  const activeConfig = getLocaleConfig(activeLocale);
  const availableLocales = getActiveLocales();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (newLocale: Locale) => {
    // Use centralized language switching with query preservation
    switchLanguage(newLocale, true);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-2xl transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span role="img" aria-label={activeConfig.name}>
          {activeConfig.flag}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border bg-popover shadow-lg">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {availableLocales.map((locale) => {
              const config = getLocaleConfig(locale);
              return (
                <button
                  key={locale}
                  onClick={() => handleLanguageChange(locale)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-muted/50 ${
                    locale === activeLocale
                      ? 'bg-muted/30 font-medium text-foreground'
                      : 'text-muted-foreground'
                  }`}
                  role="menuitem"
                  aria-current={locale === activeLocale ? 'true' : 'false'}
                >
                  <span className="text-lg" role="img" aria-label={config.name}>
                    {config.flag}
                  </span>
                  <span>{config.name}</span>
                  {locale === activeLocale && (
                    <svg
                      className="ml-auto h-4 w-4 text-primary"
                      fill="none"
                      strokeWidth="2"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
