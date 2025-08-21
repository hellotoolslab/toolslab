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

    return NextResponse.json({
      success: true,
      tools,
      categories,
      source: responseSource,
      responseTime,
      timestamp: new Date().toISOString(),
      count: tools.length,
    });
  } catch (error) {
    console.error('API /tools/config error:', error);

    const responseTime = Date.now() - startTime;

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
        responseTime,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // This endpoint could be used for updating tool configurations
  // Only available in development or with proper authentication

  if (
    process.env.NODE_ENV === 'production' &&
    !request.headers.get('authorization')
  ) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unauthorized',
      },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    // In a real implementation, this would update the Edge Config
    // For now, we'll just return a success response
    console.log('Tool config update request:', body);

    return NextResponse.json({
      success: true,
      message: 'Configuration update received (not implemented)',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('API /tools/config POST error:', error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

// OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
