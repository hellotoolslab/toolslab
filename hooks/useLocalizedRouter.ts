'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useCallback } from 'react';
import { defaultLocale, type Locale } from '@/lib/i18n/config';
import {
  getLocaleFromPathname,
  getLocalizedPath,
  stripLocaleFromPath,
  saveLanguagePreference,
} from '@/lib/i18n/helpers';
import {
  getLocaleConfig,
  isRTLLocale,
  type LocaleConfig,
} from '@/lib/i18n/locale-config';

/**
 * Enhanced hook for localized routing with centralized system
 * Provides auto-scaling functionality for any number of locales
 */
export function useLocalizedRouter() {
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = getLocaleFromPathname(pathname);
  const config = getLocaleConfig(currentLocale);

  /**
   * Create localized href for current locale
   */
  const createHref = useCallback(
    (path: string): string => {
      // If path already has locale prefix for current locale, return as is
      if (
        path.startsWith(`/${currentLocale}/`) &&
        currentLocale !== defaultLocale
      ) {
        return path;
      }

      // Otherwise create localized path for current locale
      return getLocalizedPath(path, currentLocale);
    },
    [currentLocale]
  );

  /**
   * Create localized href for specific locale
   */
  const createLocalizedHref = useCallback(
    (path: string, targetLocale?: Locale): string => {
      const locale = targetLocale || currentLocale;
      return getLocalizedPath(path, locale);
    },
    [currentLocale]
  );

  /**
   * Switch to different language while preserving current path
   */
  const switchLanguage = useCallback(
    (newLocale: Locale, preserveQuery = false): void => {
      const cleanPath = stripLocaleFromPath(pathname);

      // Build new path
      let newPath = getLocalizedPath(cleanPath, newLocale);

      // Preserve query parameters if requested
      if (preserveQuery && typeof window !== 'undefined') {
        const search = window.location.search;
        if (search) {
          newPath += search;
        }
      }

      // Save language preference
      saveLanguagePreference(newLocale);

      // Navigate to new path
      router.push(newPath);
    },
    [pathname, router]
  );

  /**
   * Navigate with current locale
   */
  const push = useCallback(
    (path: string, preserveQuery = false): void => {
      let targetPath = createHref(path);

      // Preserve query parameters if requested
      if (preserveQuery && typeof window !== 'undefined') {
        const search = window.location.search;
        if (search) {
          targetPath += search;
        }
      }

      router.push(targetPath);
    },
    [createHref, router]
  );

  /**
   * Replace with current locale
   */
  const replace = useCallback(
    (path: string, preserveQuery = false): void => {
      let targetPath = createHref(path);

      // Preserve query parameters if requested
      if (preserveQuery && typeof window !== 'undefined') {
        const search = window.location.search;
        if (search) {
          targetPath += search;
        }
      }

      router.replace(targetPath);
    },
    [createHref, router]
  );

  /**
   * Get clean path without locale prefix
   */
  const cleanPath = useMemo(() => {
    return stripLocaleFromPath(pathname);
  }, [pathname]);

  /**
   * Check if current path matches given path (locale-agnostic)
   */
  const isActiveRoute = useCallback(
    (path: string): boolean => {
      const normalizedPath = stripLocaleFromPath(path);
      return cleanPath === normalizedPath;
    },
    [cleanPath]
  );

  /**
   * Get alternate language paths for SEO/navigation
   */
  const getAlternatePaths = useCallback(
    (locales: Locale[]): Record<Locale, string> => {
      const paths: Record<string, string> = {};

      for (const locale of locales) {
        paths[locale] = getLocalizedPath(cleanPath, locale);
      }

      return paths as Record<Locale, string>;
    },
    [cleanPath]
  );

  return {
    // Current state
    locale: currentLocale,
    config,
    cleanPath,
    isRTL: isRTLLocale(currentLocale),

    // Navigation methods
    createHref,
    createLocalizedHref,
    switchLanguage,
    push,
    replace,

    // Utility methods
    isActiveRoute,
    getAlternatePaths,
  };
}

/**
 * Legacy hook for backward compatibility
 * @deprecated Use useLocalizedRouter instead
 */
export function useLocale() {
  const { locale, createHref } = useLocalizedRouter();

  return {
    locale,
    createHref,
  };
}
