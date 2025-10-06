'use client';

import { usePathname } from 'next/navigation';
import { defaultLocale, type Locale } from '@/lib/i18n/config';
import { getLocaleFromPathname, getLocalizedPath } from '@/lib/i18n/helpers';

export function useLocale() {
  const pathname = usePathname();
  const currentLocale = getLocaleFromPathname(pathname);

  const createLocalizedHref = (path: string): string => {
    // If path already has locale prefix, return as is
    if (
      path.startsWith(`/${currentLocale}/`) &&
      currentLocale !== defaultLocale
    ) {
      return path;
    }

    // Otherwise create localized path
    return getLocalizedPath(path, currentLocale);
  };

  return {
    locale: currentLocale,
    createHref: createLocalizedHref,
  };
}
