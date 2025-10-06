// EventNormalizer - Normalizes URLs and enriches events with context

import type {
  AnalyticsEvent,
  BaseEventMetadata,
  UserLevel,
} from '../types/events';

export class EventNormalizer {
  /**
   * Normalize URL to unified page identifier
   * Removes locale prefix and converts to standard format
   *
   * Examples:
   *   /tools/json-formatter        → tool:json-formatter
   *   /it/tools/json-formatter     → tool:json-formatter (same!)
   *   /es/tools/json-formatter     → tool:json-formatter (same!)
   *   /category/data               → category:data
   *   /it/category/data            → category:data (same!)
   *   /about                       → page:about
   *   /it/about                    → page:about (same!)
   */
  public static normalizeURL(url: string): { page: string; locale: string } {
    // Remove trailing slash
    url = url.replace(/\/$/, '');

    // Extract locale prefix if present
    const localeMatch = url.match(/^\/(it|es|fr|en)(\/|$)/);
    const locale = localeMatch ? localeMatch[1] : 'en';

    // Remove locale prefix
    const pathWithoutLocale = localeMatch
      ? url.replace(/^\/(it|es|fr|en)/, '')
      : url;

    // Normalize path to page identifier
    let page: string;

    if (pathWithoutLocale.startsWith('/tools/')) {
      // Tool pages: /tools/json-formatter → tool:json-formatter
      const toolId = pathWithoutLocale.replace('/tools/', '');
      page = toolId ? `tool:${toolId}` : 'page:tools';
    } else if (pathWithoutLocale.startsWith('/category/')) {
      // Category pages: /category/data → category:data
      const categoryId = pathWithoutLocale.replace('/category/', '');
      page = categoryId ? `category:${categoryId}` : 'page:categories';
    } else if (pathWithoutLocale === '' || pathWithoutLocale === '/') {
      // Homepage
      page = 'page:home';
    } else if (pathWithoutLocale === '/tools') {
      // Tools listing
      page = 'page:tools';
    } else if (pathWithoutLocale === '/categories') {
      // Categories listing
      page = 'page:categories';
    } else if (pathWithoutLocale === '/lab') {
      // Lab page
      page = 'page:lab';
    } else if (pathWithoutLocale === '/about') {
      page = 'page:about';
    } else if (pathWithoutLocale === '/privacy') {
      page = 'page:privacy';
    } else if (pathWithoutLocale === '/terms') {
      page = 'page:terms';
    } else {
      // Other pages: /some-page → page:some-page
      page = `page:${pathWithoutLocale.replace(/^\//, '')}`;
    }

    return { page, locale };
  }

  /**
   * Enrich event with automatic context metadata
   */
  public static enrichEvent<T extends AnalyticsEvent>(
    event: T,
    additionalContext?: Partial<BaseEventMetadata>
  ): T {
    const enriched = { ...event };

    // Add timestamp if not present
    if (!enriched.timestamp) {
      enriched.timestamp = Date.now();
    }

    // Add viewport if not present
    if (!enriched.viewport && typeof window !== 'undefined') {
      enriched.viewport = `${window.innerWidth}x${window.innerHeight}`;
    }

    // Add isMobile if not present
    if (enriched.isMobile === undefined && typeof window !== 'undefined') {
      enriched.isMobile = window.innerWidth < 768;
    }

    // Add locale from current URL if not present
    if (!enriched.locale && typeof window !== 'undefined') {
      const { locale } = this.normalizeURL(window.location.pathname);
      enriched.locale = locale;
    }

    // Add userLevel from localStorage if available
    if (!enriched.userLevel && typeof localStorage !== 'undefined') {
      try {
        const toolStore = localStorage.getItem('toolslab-store');
        if (toolStore) {
          const parsed = JSON.parse(toolStore);
          const historyCount = parsed.state?.history?.length || 0;

          let userLevel: UserLevel = 'first_time';
          if (historyCount === 0) {
            userLevel = 'first_time';
          } else if (historyCount < 10) {
            userLevel = 'returning';
          } else {
            userLevel = 'power';
          }

          enriched.userLevel = userLevel;
        }
      } catch (error) {
        // Ignore errors
      }
    }

    // Add sessionId from sessionStorage if available
    if (!enriched.sessionId && typeof sessionStorage !== 'undefined') {
      try {
        let sessionId = sessionStorage.getItem('toolslab-session-id');
        if (!sessionId) {
          sessionId = this.generateSessionId();
          sessionStorage.setItem('toolslab-session-id', sessionId);
        }
        enriched.sessionId = sessionId;
      } catch (error) {
        // Fallback to generated ID
        enriched.sessionId = this.generateSessionId();
      }
    }

    // Merge additional context
    if (additionalContext) {
      Object.assign(enriched, additionalContext);
    }

    return enriched;
  }

  /**
   * Extract tool ID from normalized page
   * Example: 'tool:json-formatter' → 'json-formatter'
   */
  public static extractToolId(page: string): string | null {
    const match = page.match(/^tool:(.+)$/);
    return match ? match[1] : null;
  }

  /**
   * Extract category ID from normalized page
   * Example: 'category:data' → 'data'
   */
  public static extractCategoryId(page: string): string | null {
    const match = page.match(/^category:(.+)$/);
    return match ? match[1] : null;
  }

  /**
   * Check if page is a tool page
   */
  public static isToolPage(page: string): boolean {
    return page.startsWith('tool:');
  }

  /**
   * Check if page is a category page
   */
  public static isCategoryPage(page: string): boolean {
    return page.startsWith('category:');
  }

  /**
   * Get referrer domain (without full URL for privacy)
   */
  public static getNormalizedReferrer(): string | undefined {
    if (typeof document === 'undefined') {
      return undefined;
    }

    const referrer = document.referrer;
    if (!referrer) {
      return undefined;
    }

    try {
      const url = new URL(referrer);
      return url.hostname;
    } catch {
      return undefined;
    }
  }

  /**
   * Generate session ID
   */
  private static generateSessionId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    // Fallback for older browsers
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Get current page info
   */
  public static getCurrentPageInfo(): {
    page: string;
    locale: string;
    referrer?: string;
  } {
    if (typeof window === 'undefined') {
      return { page: 'page:unknown', locale: 'en' };
    }

    const { page, locale } = this.normalizeURL(window.location.pathname);
    const referrer = this.getNormalizedReferrer();

    return { page, locale, referrer };
  }

  /**
   * Truncate string to max length (for data size optimization)
   */
  public static truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) {
      return str;
    }
    return str.substring(0, maxLength - 3) + '...';
  }

  /**
   * Calculate data size in bytes
   */
  public static getByteSize(str: string): number {
    // Use TextEncoder for accurate byte count (handles UTF-8)
    if (typeof TextEncoder !== 'undefined') {
      return new TextEncoder().encode(str).length;
    }

    // Fallback: rough estimate (char count × 2 for UTF-16)
    return str.length * 2;
  }
}

export default EventNormalizer;
