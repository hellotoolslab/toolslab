'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track pageview when route changes
    if (typeof window !== 'undefined' && (window as any).umami) {
      const url =
        pathname + (searchParams?.toString() ? `?${searchParams}` : '');

      // Small delay to ensure Umami is ready
      setTimeout(() => {
        (window as any).umami.track('pageview', {
          url,
          title: document.title,
        });
      }, 100);
    }
  }, [pathname, searchParams]);

  return null;
}
