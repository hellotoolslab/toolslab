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
 * - Includes: page, locale, referrer, UTM parameters
 * - Automatic batching (1s max wait)
 * - Chronological order preserved
 *
 * UTM Parameters tracked:
 * - utm_source (e.g., 'google', 'facebook', 'newsletter')
 * - utm_medium (e.g., 'cpc', 'email', 'social')
 * - utm_campaign (e.g., 'summer-sale-2024')
 * - utm_content (e.g., 'banner-top')
 * - utm_term (e.g., 'json formatter')
 */
export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // TEMPORARILY DISABLED: Umami auto-tracking handles pageviews
    // TODO: Re-enable with deduplication logic or use only for custom metadata

    // Update session tracker only (no duplicate pageview event)
    try {
      getUmamiSessionTracker()?.incrementPageView();

      if (process.env.NODE_ENV === 'development') {
        const pageInfo = EventNormalizer.getCurrentPageInfo();
        console.log('📊 Pageview (auto-tracked by Umami):', pageInfo);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Session tracker error:', error);
      }
    }
  }, [pathname, searchParams]);

  return null;
}
