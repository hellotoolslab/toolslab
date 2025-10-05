'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getLocaleFromPathname } from '@/lib/i18n/locale-detector';

/**
 * Client component that updates the <html lang> attribute based on current pathname
 * This is needed because the server-side layout doesn't have access to the current pathname
 */
export function HtmlLangUpdater() {
  const pathname = usePathname();

  useEffect(() => {
    const locale = getLocaleFromPathname(pathname);

    // Update the lang attribute on the html element
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
      console.log(
        '🌐 Updated html lang to:',
        locale,
        'from pathname:',
        pathname
      );
    }
  }, [pathname]);

  return null; // This component doesn't render anything
}
