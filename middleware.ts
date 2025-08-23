/**
 * Next.js Middleware for Edge Config Integration
 * Handles A/B testing, feature flags, and request routing
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCompleteConfig } from '@/lib/edge-config/client';

// Paths that should be processed by middleware
const PROCESSED_PATHS = ['/tools/:path*', '/api/tools/:path*', '/'];

// Paths that should be excluded from middleware processing
const EXCLUDED_PATHS = [
  '/_next',
  '/api/_',
  '/favicon.ico',
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

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Skip processing for excluded paths
  if (!shouldProcessPath(pathname)) {
    return NextResponse.next();
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

    // Add performance headers
    response.headers.set(
      'X-Edge-Config-Status',
      config ? 'loaded' : 'fallback'
    );
    response.headers.set('X-Processed-At', new Date().toISOString());

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
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
