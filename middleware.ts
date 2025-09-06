/**
 * Next.js Middleware for Edge Config Integration and VPN Compatibility
 * Handles A/B testing, feature flags, request routing, and VPN detection
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCompleteConfig } from '@/lib/edge-config/client';
import { BotDetector } from '@/lib/analytics/botDetection';

// Paths that should be processed by middleware
const PROCESSED_PATHS = ['/tools/:path*', '/api/tools/:path*', '/'];

// Paths that should be excluded from middleware processing
const EXCLUDED_PATHS = [
  '/_next',
  '/api/_',
  '/favicon.ico',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/robots.txt',
  '/sitemap.xml',
];

function shouldProcessPath(pathname: string): boolean {
  // Exclude specific paths
  if (EXCLUDED_PATHS.some((path) => pathname.startsWith(path))) {
    return false;
  }

  // Include processed paths
  return PROCESSED_PATHS.some((path) => {
    const regex = new RegExp(path.replace(':path*', '.*'));
    return regex.test(pathname);
  });
}

/**
 * Enhanced VPN detection using multiple indicators
 */
function detectCorporateVPN(headers: {
  forwardedFor: string | null;
  realIP: string | null;
  userAgent: string;
  cfConnectingIP: string | null;
  xOriginalForwardedFor: string | null;
}): boolean {
  const {
    forwardedFor,
    realIP,
    userAgent,
    cfConnectingIP,
    xOriginalForwardedFor,
  } = headers;

  // Check for private IP ranges (RFC 1918)
  const privateIPRanges = [
    /^10\./, // 10.0.0.0/8
    /^172\.(1[6-9]|2\d|3[01])\./, // 172.16.0.0/12
    /^192\.168\./, // 192.168.0.0/16
    /^169\.254\./, // Link-local
    /^127\./, // Localhost
  ];

  // Common corporate VPN indicators in User-Agent
  const vpnIndicators = [
    /forticlient/i,
    /cisco/i,
    /checkpoint/i,
    /palo alto/i,
    /corporate[_\s]proxy/i,
    /company[_\s]firewall/i,
    /enterprise[_\s]gateway/i,
    /websense/i,
    /bluecoat/i,
    /mcafee[_\s]web[_\s]gateway/i,
    /zscaler/i,
    /netskope/i,
  ];

  // Check all IP sources for private ranges
  const allIPs = [forwardedFor, realIP, cfConnectingIP, xOriginalForwardedFor]
    .filter(Boolean)
    .join(',');

  const hasPrivateIP = privateIPRanges.some((pattern) => pattern.test(allIPs));

  // Check for VPN software indicators
  const hasVPNIndicator = vpnIndicators.some((pattern) =>
    pattern.test(userAgent)
  );

  // Additional indicators
  const hasMultipleForwardedIPs = (forwardedFor?.split(',').length || 0) > 1;
  const hasXOriginalForwarded = Boolean(xOriginalForwardedFor);

  // VPN detection logic (more permissive to catch corporate networks)
  return (
    hasPrivateIP ||
    hasVPNIndicator ||
    (hasMultipleForwardedIPs && hasXOriginalForwarded)
  );
}

/**
 * Apply VPN-compatible headers (completely HSTS-free for corporate networks)
 */
function applyVPNCompatibleHeaders(response: NextResponse) {
  // CRITICAL: Completely remove HSTS headers
  response.headers.delete('Strict-Transport-Security');

  // Anti-HSTS headers to clear browser cache
  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');

  // More permissive frame options for corporate intranets
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');

  // Add VPN mode indicator for client-side detection
  response.headers.set('X-VPN-Mode', 'true');
  response.headers.set('X-VPN-Compatible', 'true');

  // Completely permissive CSP for corporate environments with proxy interference
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: *; script-src 'self' 'unsafe-inline' 'unsafe-eval' *; style-src 'self' 'unsafe-inline' data: *; img-src 'self' data: blob: *; connect-src 'self' *; frame-src *; object-src *; media-src *; font-src *;"
  );

  // Allow corporate proxy modification
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'master-only');

  // Disable other security headers that might conflict with corporate proxies
  response.headers.delete('Cross-Origin-Embedder-Policy');
  response.headers.delete('Cross-Origin-Resource-Policy');

  // Add corporate proxy friendly headers
  response.headers.set('X-Corporate-Proxy-Compatible', 'true');
  response.headers.set('Access-Control-Allow-Credentials', 'true');

  // Debug headers removed - VPN compatibility issues resolved
}

/**
 * Apply security headers for regular users (HSTS-free for corporate compatibility)
 */
function applyStrictSecurityHeaders(response: NextResponse) {
  // Strict frame protection
  response.headers.set('X-Frame-Options', 'DENY');

  // CRITICAL: NO HSTS - Completely removed for corporate VPN compatibility
  response.headers.delete('Strict-Transport-Security');

  // Anti-HSTS headers to ensure browser cache is cleared
  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');

  // CSP for regular users - more permissive in development
  const isDevelopment = process.env.NODE_ENV === 'development';
  const cspPolicy = isDevelopment
    ? "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: *; script-src 'self' 'unsafe-inline' 'unsafe-eval' *; style-src 'self' 'unsafe-inline' data: *; img-src 'self' data: blob: *; connect-src 'self' *; frame-src 'self';"
    : "default-src 'self' 'unsafe-inline' 'unsafe-eval'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.vercel-insights.com *.umami.is va.vercel-scripts.com *.vercel-scripts.com; style-src 'self' 'unsafe-inline' data:; img-src 'self' data: blob: *.vercel.com cdn.carbonads.com; connect-src 'self' *.vercel-insights.com *.umami.is vitals.vercel-insights.com va.vercel-scripts.com *.vercel-scripts.com; frame-src 'none';";

  response.headers.set('Content-Security-Policy', cspPolicy);

  // Additional security headers (but not HSTS)
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  response.headers.set('Cross-Origin-Embedder-Policy', 'unsafe-none');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');

  // Indicate that this is HSTS-free mode
  response.headers.set('X-HSTS-Free-Mode', 'true');
}

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Skip processing for excluded paths
  if (!shouldProcessPath(pathname)) {
    return NextResponse.next();
  }

  // Temporary: skip all SVG files
  if (
    pathname.endsWith('.svg') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.ico')
  ) {
    return NextResponse.next();
  }

  // Bot Detection for Analytics
  const userAgent = request.headers.get('user-agent') || '';
  const referer = request.headers.get('referer') || '';
  const botDetector = new BotDetector();
  const botDetection = botDetector.detectBot(userAgent, referer, request.url);

  if (botDetection.isBot) {
    // Return minimal response for bots to save resources
    const response = NextResponse.next();
    response.headers.set('X-Bot-Detected', 'true');
    response.headers.set('X-Bot-Reason', botDetection.reason || 'unknown');
    response.headers.set('Cache-Control', 'public, max-age=86400');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  try {
    // Get Edge Config with timeout to prevent blocking
    const configPromise = getCompleteConfig();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Config timeout')), 100)
    );

    let config;
    try {
      const result = await Promise.race([configPromise, timeoutPromise]);
      config = (result as any).success ? (result as any).data : null;
    } catch (error) {
      console.warn(
        'Middleware: Edge Config timeout, proceeding without config'
      );
      config = null;
    }

    const response = NextResponse.next();

    // VPN Detection and Security Header Management
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const userAgent = request.headers.get('user-agent') || '';
    const cfConnectingIP = request.headers.get('cf-connecting-ip');
    const xOriginalForwardedFor = request.headers.get(
      'x-original-forwarded-for'
    );

    const isCorpVPN = detectCorporateVPN({
      forwardedFor,
      realIP,
      userAgent,
      cfConnectingIP,
      xOriginalForwardedFor,
    });

    // Apply appropriate security headers based on VPN detection
    if (isCorpVPN) {
      applyVPNCompatibleHeaders(response);

      // Log VPN detection for monitoring (only in development)
      if (process.env.NODE_ENV === 'development') {
        console.log('🔒 Corporate VPN detected:', {
          forwardedFor,
          realIP,
          userAgent: userAgent.substring(0, 100),
          timestamp: new Date().toISOString(),
          url: request.url,
        });
      }
    } else {
      applyStrictSecurityHeaders(response);
    }

    // Add performance headers
    response.headers.set(
      'X-Edge-Config-Status',
      config ? 'loaded' : 'fallback'
    );
    response.headers.set('X-Processed-At', new Date().toISOString());

    // Add common security headers for all users
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
    response.headers.set('X-DNS-Prefetch-Control', 'on');

    // Handle coming soon mode
    if (config?.features?.comingSoon && pathname !== '/coming-soon') {
      // Allow admin access during coming soon
      const isAdmin = request.headers
        .get('authorization')
        ?.includes(process.env.ADMIN_SECRET_KEY || '');

      if (!isAdmin) {
        const comingSoonUrl = new URL('/coming-soon', request.url);
        return NextResponse.redirect(comingSoonUrl);
      }
    }

    // Handle maintenance mode
    if (config?.features?.maintenanceMode && pathname !== '/maintenance') {
      // Allow admin access during maintenance
      const isAdmin = request.headers
        .get('authorization')
        ?.includes(process.env.ADMIN_SECRET_KEY || '');

      if (!isAdmin) {
        const maintenanceUrl = new URL('/maintenance', request.url);
        return NextResponse.redirect(maintenanceUrl);
      }
    }

    // Handle tool-specific logic
    if (pathname.startsWith('/tools/')) {
      const toolSlug = pathname.split('/')[2];

      if (toolSlug && config?.tools) {
        const tool = Object.values(config.tools).find(
          (t: any) => t.slug === toolSlug
        );

        // Redirect if tool is disabled
        if (tool && !(tool as any).enabled) {
          const homeUrl = new URL('/', request.url);
          homeUrl.searchParams.set('message', 'tool-disabled');
          homeUrl.searchParams.set('tool', toolSlug);
          return NextResponse.redirect(homeUrl);
        }

        // Add tool metadata to headers
        if (tool) {
          response.headers.set('X-Tool-Category', (tool as any).category || '');
          response.headers.set(
            'X-Tool-Featured',
            String((tool as any).featured || false)
          );
          response.headers.set(
            'X-Tool-Pro-Required',
            String((tool as any).flags?.isPro || false)
          );
        }
      }
    }

    // Handle feature flags and experiments
    if (config?.features?.experiments) {
      const experiments = config.features.experiments;

      // A/B Testing: Enhanced Search
      if (experiments.enhancedSearch && pathname === '/') {
        const userId =
          request.cookies.get('user-id')?.value || generateUserId();
        const variant = getUserVariant(userId, 'enhanced-search');

        response.cookies.set('user-id', userId, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        response.headers.set('X-Search-Variant', variant);
      }

      // A/B Testing: Tool Chaining
      if (experiments.newToolChaining && pathname.startsWith('/tools/')) {
        const userId =
          request.cookies.get('user-id')?.value || generateUserId();
        const variant = getUserVariant(userId, 'tool-chaining');

        response.cookies.set('user-id', userId, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        response.headers.set('X-Chaining-Variant', variant);
      }
    }

    // Geographic routing (if needed)
    const country = request.geo?.country || 'US';
    response.headers.set('X-User-Country', country);

    // Handle region-specific features
    if (config?.settings?.analytics?.enabled) {
      // Only enable analytics in supported regions
      const supportedRegions = ['US', 'CA', 'GB', 'DE', 'FR', 'IT', 'ES', 'AU'];
      response.headers.set(
        'X-Analytics-Enabled',
        String(supportedRegions.includes(country))
      );
    }

    return response;
  } catch (error) {
    console.error('Middleware error:', error);

    // Return response with error headers but don't block the request
    const response = NextResponse.next();
    response.headers.set('X-Middleware-Error', 'true');
    response.headers.set('X-Error-Time', new Date().toISOString());

    return response;
  }
}

/**
 * Generate a simple user ID for A/B testing
 */
function generateUserId(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

/**
 * Determine A/B test variant for a user
 */
function getUserVariant(userId: string, experiment: string): 'a' | 'b' {
  // Simple hash-based variant assignment
  const hash = hashCode(userId + experiment);
  return hash % 2 === 0 ? 'a' : 'b';
}

/**
 * Simple string hash function
 */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Rate limiting helper
 */
function isRateLimited(request: NextRequest): boolean {
  // Simple rate limiting based on IP
  // In production, use a proper rate limiting solution
  const ip = request.ip || 'unknown';
  const now = Date.now();

  // This is a simplified example
  // Real implementation would use Redis or similar
  return false;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes, but we'll handle /api/tools specifically)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - icon files (all favicon variants)
     */
    '/((?!_next/static|_next/image|.*\\.ico|.*\\.png|.*\\.svg|robots\\.txt|sitemap\\.xml).*)',
  ],
};
