'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  locales,
  localeNames,
  localeFlags,
  defaultLocale,
  type Locale,
} from '@/lib/i18n/config';
import { ChevronDown } from 'lucide-react';

export default function LanguageSwitcher({
  currentLocale = defaultLocale,
}: {
  currentLocale?: Locale;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Determine current locale from pathname
  const detectedLocale =
    locales.find(
      (locale) =>
        pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    ) || defaultLocale;

  const activeLocale = currentLocale || detectedLocale;

  const handleLanguageChange = (newLocale: Locale) => {
    // Get the current path without locale prefix
    let pathWithoutLocale = pathname;

    // Remove current locale prefix if present
    for (const locale of locales) {
      if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
        pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
        break;
      }
    }

    // Build new path with new locale
    let newPath = '';
    if (newLocale === defaultLocale) {
      // English doesn't need prefix
      newPath = pathWithoutLocale || '/';
    } else {
      // Other locales need prefix
      newPath = `/${newLocale}${pathWithoutLocale}`;
    }

    // Save language preference in cookie
    document.cookie = `preferred-locale=${newLocale};path=/;max-age=${60 * 60 * 24 * 365}`;

    // Navigate to new path
    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span
          className="text-lg"
          role="img"
          aria-label={localeNames[activeLocale]}
        >
          {localeFlags[activeLocale]}
        </span>
        <span className="hidden sm:inline">{localeNames[activeLocale]}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border bg-popover shadow-lg">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {locales.map((locale) => (
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
                <span
                  className="text-lg"
                  role="img"
                  aria-label={localeNames[locale]}
                >
                  {localeFlags[locale]}
                </span>
                <span>{localeNames[locale]}</span>
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
