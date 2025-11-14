'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { getUmamiAdapter } from '@/lib/analytics/umami/UmamiSDKAdapter';
import { getUmamiSessionTracker } from '@/lib/analytics/umami/UmamiSessionTracker';
import { EventNormalizer } from '@/lib/analytics/core/EventNormalizer';

/**
 * Tracks pageview events using the centralized analytics system
 *
 * IMPORTANT: Uses UmamiSDKAdapter for consistent tracking
 * - No polling (SDK ready check handled by adapter)
 * - Minimal data (page, locale, referrer only)
 * - Automatic batching (1s max wait)
 * - Chronological order preserved
 */
export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    try {
      // Get normalized page info
      const { page, locale, referrer } = EventNormalizer.getCurrentPageInfo();

      // Create pageview event
      const event = EventNormalizer.enrichEvent({
        event: 'pageview' as const,
        page,
        locale,
        referrer,
        sessionId: '', // Will be enriched by EventNormalizer
      });

      // Track via centralized system
      getUmamiAdapter().track(event);

      // Update session tracker
      getUmamiSessionTracker()?.incrementPageView();

      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Pageview tracked:', { page, locale, referrer });
      }
    } catch (error) {
      // Silent fail - don't break app if tracking fails
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Pageview tracking error:', error);
      }
    }
  }, [pathname, searchParams]);

  return null;
}
