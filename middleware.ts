/**
 * Next.js Middleware - OPTIMIZED FOR CPU EFFICIENCY
 *
 * CRITICAL OPTIMIZATION (Jan 2025):
 * - Matcher restricted to ONLY pages that need locale/VPN handling
 * - Sitemap generation REMOVED (now static at build time)
 * - No dynamic imports
 * - Edge Config only when needed
 * - BotDetector as singleton
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  localesWithPrefix,
  defaultLocale,
  type Locale,
} from '@/lib/i18n/config';

// ============================================================================
// PRE-COMPILED PATTERNS (cached at module level for performance)
// ============================================================================

// Pre-compiled private IP patterns for VPN detection
const PRIVATE_IP_PATTERNS = [
  /^10\./, // 10.0.0.0/8
  /^172\.(1[6-9]|2\d|3[01])\./, // 172.16.0.0/12
  /^192\.168\./, // 192.168.0.0/16
  /^169\.254\./, // Link-local
  /^127\./, // Localhost
];

// Pre-compiled VPN indicator patterns
const VPN_INDICATOR_PATTERNS = [
  /forticlient/i,
  /cisco/i,
  /checkpoint/i,
  /palo alto/i,
  /corporate[_\s]proxy/i,
  /zscaler/i,
  /netskope/i,
];

// Pre-compiled bot patterns (simplified for performance)
const SEARCH_ENGINE_BOTS =
  /googlebot|bingbot|yandex|duckduckbot|baiduspider|slurp/i;
const KNOWN_BOTS = /bot|crawler|spider|scraper|curl|wget|python|java|php/i;

// ============================================================================
// LIGHTWEIGHT BOT DETECTION (no class instantiation)
// ============================================================================

function detectBot(userAgent: string): {
  isBot: boolean;
  isSearchEngine: boolean;
} {
  if (!userAgent) return { isBot: false, isSearchEngine: false };

  const isSearchEngine = SEARCH_ENGINE_BOTS.test(userAgent);
  const isBot = isSearchEngine || KNOWN_BOTS.test(userAgent);

  return { isBot, isSearchEngine };
}

// ============================================================================
// VPN DETECTION (optimized)
// ============================================================================

function detectCorporateVPN(
  forwardedFor: string | null,
  realIP: string | null,
  userAgent: string
): boolean {
  // Quick check: VPN indicators in user agent
  for (const pattern of VPN_INDICATOR_PATTERNS) {
    if (pattern.test(userAgent)) return true;
  }

  // Check IPs for private ranges
  const allIPs = [forwardedFor, realIP].filter(Boolean).join(',');
  for (const pattern of PRIVATE_IP_PATTERNS) {
    if (pattern.test(allIPs)) return true;
  }

  // Check for multiple forwarded IPs (proxy chain)
  if (forwardedFor && forwardedFor.split(',').length > 2) return true;

  return false;
}

// ============================================================================
// SECURITY HEADERS (simplified)
// ============================================================================

function applySecurityHeaders(response: NextResponse, isVPN: boolean) {
  // Common headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');

  if (isVPN) {
    // VPN-compatible: No HSTS, permissive CSP
    response.headers.delete('Strict-Transport-Security');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-VPN-Mode', 'true');
    response.headers.set(
      'Cache-Control',
      'no-cache, no-store, must-revalidate'
    );
  } else {
    // Standard security
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  }
}

// ============================================================================
// MAIN MIDDLEWARE (streamlined)
// ============================================================================

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.nextUrl.hostname;

  // -------------------------------------------------------------------------
  // 1. Domain canonicalization (immediate redirect)
  // -------------------------------------------------------------------------
  if (hostname === 'www.toolslab.dev') {
    const redirectUrl = new URL(request.nextUrl);
    redirectUrl.hostname = 'toolslab.dev';
    return NextResponse.redirect(redirectUrl, 301);
  }

  // -------------------------------------------------------------------------
  // 2. Detect locale from pathname
  // -------------------------------------------------------------------------
  let currentLocale: Locale = defaultLocale;
  const pathnameHasLocale = localesWithPrefix.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    const detectedLocale = localesWithPrefix.find(
      (locale) =>
        pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );
    if (detectedLocale) {
      currentLocale = detectedLocale as Locale;
    }
  }

  // -------------------------------------------------------------------------
  // 3. Bot detection (lightweight)
  // -------------------------------------------------------------------------
  const userAgent = request.headers.get('user-agent') || '';
  const botDetection = detectBot(userAgent);

  if (botDetection.isBot) {
    // Minimal response for bots - just set essential headers
    const response = NextResponse.next();
    response.headers.set('X-Locale', currentLocale);
    response.headers.set('X-Bot-Detected', 'true');
    response.headers.set('Cache-Control', 'public, max-age=86400');

    if (botDetection.isSearchEngine) {
      response.headers.set('X-Search-Engine', 'true');
    }

    return response;
  }

  // -------------------------------------------------------------------------
  // 4. VPN detection and security headers
  // -------------------------------------------------------------------------
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const isVPN = detectCorporateVPN(forwardedFor, realIP, userAgent);

  const response = NextResponse.next();

  // Set locale headers
  response.headers.set('X-Locale', currentLocale);
  response.headers.set('X-Pathname', pathname);
  response.headers.set('X-Request-URL', request.url);

  // Set locale cookie
  response.cookies.set('NEXT_LOCALE', currentLocale, {
    path: '/',
    sameSite: 'lax',
    httpOnly: false,
  });

  // Persistent language preference
  if (pathnameHasLocale && currentLocale !== defaultLocale) {
    const preferredLocaleCookie = request.cookies.get('preferred-locale');
    if (
      !preferredLocaleCookie ||
      preferredLocaleCookie.value !== currentLocale
    ) {
      response.cookies.set('preferred-locale', currentLocale, {
        maxAge: 365 * 24 * 60 * 60,
        path: '/',
        sameSite: 'lax',
        httpOnly: false,
      });
    }
  }

  // Apply security headers based on VPN status
  applySecurityHeaders(response, isVPN);

  // Geographic info (if available)
  const country = request.geo?.country || 'US';
  response.headers.set('X-User-Country', country);

  return response;
}

// ============================================================================
// MATCHER CONFIGURATION - CRITICAL FOR CPU OPTIMIZATION
// ============================================================================

export const config = {
  matcher: [
    /*
     * ONLY match paths that NEED middleware processing:
     * - Homepage (locale detection)
     * - Tool pages (locale + analytics)
     * - Localized paths (it/, de/, fr/, es/, pt/)
     * - Core pages (about, lab, categories, blog, etc.)
     *
     * EXPLICITLY EXCLUDED (handled by Next.js directly):
     * - /_next/static/* (static assets)
     * - /_next/image/* (optimized images)
     * - /api/* (API routes - no locale needed)
     * - /sitemap*.xml (static files)
     * - /robots.txt (static file)
     * - /*.ico, /*.png, /*.svg (icons)
     * - /manifest.* (PWA manifests)
     */
    '/',
    '/tools/:path*',
    '/about',
    '/lab',
    '/categories',
    '/category/:path*',
    '/blog',
    '/blog/:path*',
    '/privacy',
    '/terms',
    '/download',
    '/coming-soon',
    '/maintenance',
    // Localized routes (covers all localized pages)
    '/it/:path*',
    '/de/:path*',
    '/fr/:path*',
    '/es/:path*',
    '/pt/:path*',
  ],
};
