/**
 * URL Normalizer for Canonical URLs
 *
 * Ensures all URLs follow canonical format:
 * - No trailing slash (except homepage)
 * - HTTPS only
 * - Lowercase paths
 * - No www prefix
 * - No query parameters or hash
 */

export class URLNormalizer {
  private static readonly SITE_URL = 'https://toolslab.dev';

  /**
   * Normalize URL to canonical format
   */
  static normalize(url: string): string {
    let normalized = url;

    // 1. Ensure absolute URL
    if (!normalized.startsWith('http')) {
      normalized = `${this.SITE_URL}${normalized.startsWith('/') ? normalized : `/${normalized}`}`;
    }

    // 2. Force HTTPS
    normalized = normalized.replace(/^http:/, 'https:');

    // 3. Remove www subdomain
    normalized = normalized.replace('://www.', '://');

    // 4. Parse URL
    const urlObj = new URL(normalized);

    // 5. Lowercase hostname
    urlObj.hostname = urlObj.hostname.toLowerCase();

    // 6. Remove trailing slash (except for root)
    if (urlObj.pathname !== '/' && urlObj.pathname.endsWith('/')) {
      urlObj.pathname = urlObj.pathname.slice(0, -1);
    }

    // 7. Remove query parameters and hash
    urlObj.search = '';
    urlObj.hash = '';

    // 8. Remove /index.html if present
    urlObj.pathname = urlObj.pathname.replace(/\/index\.html?$/, '');

    return urlObj.toString();
  }

  /**
   * Check if URL is already in canonical format
   */
  static isCanonical(url: string): boolean {
    try {
      const normalized = this.normalize(url);
      return url === normalized;
    } catch {
      return false;
    }
  }

  /**
   * Extract pathname from URL (no query/hash)
   */
  static getPathname(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname;
    } catch {
      return url;
    }
  }

  /**
   * Check if URL should be excluded from sitemap
   */
  static shouldExcludeFromSitemap(url: string): boolean {
    const pathname = this.getPathname(url);

    const excludePatterns = [
      /^\/api\//, // API routes
      /^\/admin\//, // Admin pages
      /^\/_next\//, // Next.js internals
      /^\/.*\.(xml|txt|ico|json|map)$/, // Static files
      /\?/, // Query parameters
      /#/, // Hash fragments
    ];

    return excludePatterns.some((pattern) => pattern.test(pathname));
  }

  /**
   * Check if URL has trailing slash issue
   */
  static hasTrailingSlashIssue(url: string): boolean {
    const pathname = this.getPathname(url);
    return pathname !== '/' && pathname.endsWith('/');
  }

  /**
   * Validate URL format
   */
  static validate(url: string): {
    valid: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    try {
      const urlObj = new URL(url);

      // Check protocol
      if (urlObj.protocol !== 'https:') {
        issues.push('Must use HTTPS protocol');
      }

      // Check hostname
      if (urlObj.hostname.includes('www.')) {
        issues.push('Should not include www subdomain');
      }

      // Check trailing slash
      if (this.hasTrailingSlashIssue(url)) {
        issues.push('Should not have trailing slash (except root)');
      }

      // Check query parameters
      if (urlObj.search) {
        issues.push('Should not include query parameters');
      }

      // Check hash
      if (urlObj.hash) {
        issues.push('Should not include hash fragment');
      }

      // Check uppercase in path
      if (urlObj.pathname !== urlObj.pathname.toLowerCase()) {
        issues.push('Path should be lowercase');
      }

      return {
        valid: issues.length === 0,
        issues,
      };
    } catch (error) {
      return {
        valid: false,
        issues: ['Invalid URL format'],
      };
    }
  }

  /**
   * Get canonical URL for a tool
   */
  static getToolCanonical(toolSlug: string, locale?: string): string {
    const isDefaultLocale = !locale || locale === 'en';
    const localePrefix = isDefaultLocale ? '' : `/${locale}`;
    return `${this.SITE_URL}${localePrefix}/tools/${toolSlug}`;
  }

  /**
   * Get canonical URL for a category
   */
  static getCategoryCanonical(categorySlug: string, locale?: string): string {
    const isDefaultLocale = !locale || locale === 'en';
    const localePrefix = isDefaultLocale ? '' : `/${locale}`;
    return `${this.SITE_URL}${localePrefix}/category/${categorySlug}`;
  }

  /**
   * Get canonical URL for a static page
   */
  static getPageCanonical(path: string, locale?: string): string {
    const isDefaultLocale = !locale || locale === 'en';
    const localePrefix = isDefaultLocale ? '' : `/${locale}`;

    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    // Homepage special case
    if (cleanPath === '/' || cleanPath === '') {
      return `${this.SITE_URL}${localePrefix}${cleanPath === '/' && !isDefaultLocale ? '' : cleanPath}`;
    }

    return `${this.SITE_URL}${localePrefix}${cleanPath}`;
  }
}
