/**
 * API Route for Tool Configuration
 * Provides client-side access to Edge Config tool data
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getEnabledTools,
  getEnabledCategories,
  getFeaturedTools,
  getToolsByCategory,
  getPopularTools,
  getTrendingTools,
  getNewTools,
} from '@/lib/edge-config/tools';
import { ToolConfigOptions } from '@/lib/edge-config/types';

/**
 * Allowed origins for CORS
 * Only these domains can make cross-origin requests to this API
 */
const ALLOWED_ORIGINS = [
  'https://toolslab.dev',
  'https://www.toolslab.dev',
  'https://octotools.org',
  'https://www.octotools.org',
  // Development origins
  ...(process.env.NODE_ENV === 'development'
    ? ['http://localhost:3000', 'http://127.0.0.1:3000']
    : []),
];

/**
 * Check if an origin is allowed for CORS
 */
function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  return ALLOWED_ORIGINS.includes(origin);
}

/**
 * Get CORS headers for a request
 */
function getCorsHeaders(request: NextRequest): Record<string, string> {
  const origin = request.headers.get('origin');

  // If origin is allowed, reflect it back; otherwise, don't set CORS headers
  if (isAllowedOrigin(origin)) {
    return {
      'Access-Control-Allow-Origin': origin!,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400', // 24 hours
      Vary: 'Origin', // Important for caching
    };
  }

  // Return empty headers if origin is not allowed
  return {};
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const options: ToolConfigOptions = {
      enabled:
        searchParams.get('enabled') !== null
          ? searchParams.get('enabled') === 'true'
          : undefined,
      featured:
        searchParams.get('featured') !== null
          ? searchParams.get('featured') === 'true'
          : undefined,
      category: searchParams.get('category') || undefined,
      limit: searchParams.get('limit')
        ? parseInt(searchParams.get('limit')!)
        : undefined,
      sortBy: (searchParams.get('sortBy') as any) || undefined,
      sortDirection:
        (searchParams.get('sortDirection') as 'asc' | 'desc') || undefined,
      includeDisabled: searchParams.get('includeDisabled') === 'true',
    };

    // Special endpoints
    const endpoint = searchParams.get('endpoint');

    let tools;
    let responseSource = 'edge-config';

    switch (endpoint) {
      case 'featured':
        tools = await getFeaturedTools(options.limit);
        break;
      case 'popular':
        tools = await getPopularTools(options.limit || 10);
        break;
      case 'trending':
        tools = await getTrendingTools(options.limit || 5);
        break;
      case 'new':
        tools = await getNewTools(options.limit || 3);
        break;
      case 'category':
        if (!options.category) {
          return NextResponse.json(
            {
              success: false,
              error: 'Category parameter required for category endpoint',
            },
            { status: 400 }
          );
        }
        tools = await getToolsByCategory(options.category, options);
        break;
      default:
        tools = await getEnabledTools(options);
        break;
    }

    // Get categories
    const categories = await getEnabledCategories();

    // Calculate response time
    const responseTime = Date.now() - startTime;

    // Log slow responses
    if (responseTime > 100) {
      console.warn(
        `🐌 Slow API response: /api/tools/config took ${responseTime}ms`
      );
    }

    const corsHeaders = getCorsHeaders(request);

    return NextResponse.json(
      {
        success: true,
        tools,
        categories,
        source: responseSource,
        responseTime,
        timestamp: new Date().toISOString(),
        count: tools.length,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('API /tools/config error:', error);

    const responseTime = Date.now() - startTime;
    const corsHeaders = getCorsHeaders(request);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
        responseTime,
        timestamp: new Date().toISOString(),
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(request: NextRequest) {
  // This endpoint could be used for updating tool configurations
  // Only available in development or with proper authentication
  const corsHeaders = getCorsHeaders(request);

  if (
    process.env.NODE_ENV === 'production' &&
    !request.headers.get('authorization')
  ) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unauthorized',
      },
      { status: 401, headers: corsHeaders }
    );
  }

  try {
    const body = await request.json();

    // In a real implementation, this would update the Edge Config
    // For now, we'll just return a success response
    console.log('Tool config update request:', body);

    return NextResponse.json(
      {
        success: true,
        message: 'Configuration update received (not implemented)',
        timestamp: new Date().toISOString(),
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('API /tools/config POST error:', error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

// OPTIONS for CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request);

  // If origin is not allowed, return 403 Forbidden
  if (Object.keys(corsHeaders).length === 0) {
    return new NextResponse(null, {
      status: 403,
      statusText: 'Forbidden - Origin not allowed',
    });
  }

  return new NextResponse(null, {
    status: 204, // No Content is more appropriate for OPTIONS
    headers: corsHeaders,
  });
}
