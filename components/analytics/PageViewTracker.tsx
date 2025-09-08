'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useUmami } from '@/components/analytics/UmamiProvider';

export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { track } = useUmami();

  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : '');

    // Small delay to ensure page is fully loaded
    const timer = setTimeout(() => {
      track('pageview', {
        url,
        title: document.title,
        referrer: document.referrer,
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname, searchParams, track]);

  return null;
}
