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
    try {
      // Get normalized page info with UTM parameters
      const pageInfo = EventNormalizer.getCurrentPageInfo();

      // Create pageview event with all parameters
      const event = EventNormalizer.enrichEvent({
        event: 'pageview' as const,
        ...pageInfo, // Includes page, locale, referrer, and UTM params
        sessionId: '', // Will be enriched by EventNormalizer
      });

      // Track via centralized system
      getUmamiAdapter().track(event);

      // Update session tracker
      getUmamiSessionTracker()?.incrementPageView();

      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Pageview tracked:', pageInfo);
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
