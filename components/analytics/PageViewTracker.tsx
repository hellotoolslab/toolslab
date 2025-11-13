'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useUmami } from '@/components/analytics/UmamiProvider';
import { tools } from '@/lib/tools';

// ==================== Helper Functions ====================

/**
 * Create a map of tool ID -> primary category for quick lookups
 * Uses the first category from each tool's categories array
 */
const toolCategoryMap = new Map<string, string>(
  tools.map((tool) => [tool.id, tool.categories[0] || 'other'])
);

/**
 * Extract UTM parameters from search params
 */
function extractUTMParameters(searchParams: URLSearchParams | null) {
  if (!searchParams) return {};

  const utmParams: Record<string, string> = {};
  const utmKeys = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
  ];

  utmKeys.forEach((key) => {
    const value = searchParams.get(key);
    if (value) {
      utmParams[key] = value;
    }
  });

  return utmParams;
}

/**
 * Determine device type based on user agent and screen size
 */
function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';

  const userAgent = navigator.userAgent.toLowerCase();
  const width = window.innerWidth;

  // Check for mobile
  if (
    /mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
  ) {
    return 'mobile';
  }

  // Check for tablet
  if (
    /ipad|tablet|kindle|playbook|silk/i.test(userAgent) ||
    (width >= 768 && width <= 1024)
  ) {
    return 'tablet';
  }

  return 'desktop';
}

/**
 * Deduce tool category from pathname
 * Uses the tools registry from /lib/tools.ts for dynamic mapping
 */
function getToolCategory(pathname: string): string | null {
  // Extract tool from pathname (e.g., /tools/json-formatter or /it/tools/json-formatter)
  const toolMatch = pathname.match(/\/tools\/([^/]+)/);
  if (!toolMatch) return null;

  const toolSlug = toolMatch[1];

  // Look up the tool's primary category from the registry
  return toolCategoryMap.get(toolSlug) || 'other';
}

/**
 * Get user theme preference
 */
function getTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'light';

  // Check if dark mode is preferred
  const prefersDark = window.matchMedia?.(
    '(prefers-color-scheme: dark)'
  ).matches;
  return prefersDark ? 'dark' : 'light';
}

/**
 * Determine if user is returning or new
 */
function getUserType(): 'returning' | 'new' {
  if (typeof window === 'undefined') return 'new';

  const returningUser = localStorage.getItem('returning_user');
  return returningUser === 'true' ? 'returning' : 'new';
}

/**
 * Mark user as returning in localStorage
 */
function markUserAsReturning() {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('returning_user', 'true');
  } catch (error) {
    // Silently fail if localStorage is not available
    console.warn('Could not set returning_user in localStorage:', error);
  }
}

/**
 * Get page load time safely
 */
function getPageLoadTime(): number | null {
  if (typeof window === 'undefined' || !window.performance?.timing) return null;

  try {
    const { navigationStart, loadEventEnd } = window.performance.timing;
    if (navigationStart && loadEventEnd) {
      const loadTime = loadEventEnd - navigationStart;
      // Sanity check: load time should be positive and reasonable (< 1 minute)
      return loadTime > 0 && loadTime < 60000 ? loadTime : null;
    }
  } catch (error) {
    // Performance API not available or error
    return null;
  }

  return null;
}

/**
 * Get connection type from Network Information API
 */
function getConnectionType(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    // @ts-ignore - NetworkInformation API is not in TypeScript types
    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;
    return connection?.effectiveType || null;
  } catch (error) {
    return null;
  }
}

/**
 * Collect all enhanced pageview data
 */
function collectPageViewData(
  pathname: string,
  searchParams: URLSearchParams | null
) {
  const data: Record<string, string | number> = {};

  // ===== 1. Contesto Utente =====
  if (typeof window !== 'undefined' && navigator.language) {
    data.language = navigator.language;
  }

  const deviceType = getDeviceType();
  if (deviceType) {
    data.device_type = deviceType;
  }

  if (typeof window !== 'undefined' && window.screen) {
    data.screen_size = `${window.screen.width}x${window.screen.height}`;
    data.viewport = `${window.innerWidth}x${window.innerHeight}`;
  }

  // ===== 2. UTM Parameters =====
  const utmParams = extractUTMParameters(searchParams);
  Object.assign(data, utmParams);

  // ===== 3. ToolsLab Specific =====
  const toolCategory = getToolCategory(pathname);
  if (toolCategory) {
    data.tool_category = toolCategory;
  }

  if (typeof document !== 'undefined' && document.documentElement.lang) {
    data.interface_language = document.documentElement.lang;
  }

  const userType = getUserType();
  data.user_type = userType;

  const theme = getTheme();
  if (theme) {
    data.theme = theme;
  }

  // ===== 4. Performance =====
  const connectionType = getConnectionType();
  if (connectionType) {
    data.connection_type = connectionType;
  }

  const pageLoadTime = getPageLoadTime();
  if (pageLoadTime !== null) {
    data.page_load_time = pageLoadTime;
  }

  return data;
}

// ==================== Main Component ====================

export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { track } = useUmami();

  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : '');

    // Small delay to ensure page is fully loaded
    const timer = setTimeout(() => {
      // Collect enhanced pageview data
      const enhancedData = collectPageViewData(pathname, searchParams);

      // Track pageview with original + enhanced data
      track('pageview', {
        url,
        title: document.title,
        referrer: document.referrer,
        ...enhancedData, // Add all enhanced metrics
      });

      // Mark user as returning after first pageview
      markUserAsReturning();
    }, 150);

    return () => clearTimeout(timer);
  }, [pathname, searchParams, track]);

  return null;
}
