/**
 * API Route for Tool Search
 * Provides search functionality across tool configurations
 */

import { NextRequest, NextResponse } from 'next/server';
import { searchTools } from '@/lib/edge-config/tools';

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          error: 'Search query (q) parameter is required',
        },
        { status: 400 }
      );
    }

    if (query.length < 2) {
      return NextResponse.json({
        success: true,
        results: [],
        query,
        count: 0,
        message: 'Query too short (minimum 2 characters)',
        responseTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      });
    }

    const results = await searchTools(query, limit);

    const responseTime = Date.now() - startTime;

    // Log search for analytics
    console.log('Tool search:', {
      query: query.slice(0, 100), // Truncate long queries
      resultCount: results.length,
      responseTime,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        results,
        query,
        count: results.length,
        responseTime,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          // Cache search results for 5 minutes (reduces CPU for repeated queries)
          'Cache-Control':
            'public, max-age=300, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('API /tools/search error:', error);

    const responseTime = Date.now() - startTime;

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Search failed',
        responseTime,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // POST endpoint for complex search with filters

  const startTime = Date.now();

  try {
    const body = await request.json();

    const {
      query,
      limit = 10,
      filters = {},
      sort = { by: 'relevance', direction: 'desc' },
    } = body;

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          error: 'Search query is required',
        },
        { status: 400 }
      );
    }

    if (query.length < 2) {
      return NextResponse.json({
        success: true,
        results: [],
        query,
        count: 0,
        message: 'Query too short (minimum 2 characters)',
        responseTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      });
    }

    // For now, use the basic search function
    // In the future, this could support advanced filtering
    let results = await searchTools(query, limit * 2); // Get more results for filtering

    // Apply filters
    if (filters.category) {
      results = results.filter((tool) => tool.category === filters.category);
    }

    if (filters.featured !== undefined) {
      results = results.filter((tool) => tool.featured === filters.featured);
    }

    if (filters.flags) {
      Object.entries(filters.flags).forEach(([flag, value]) => {
        if (value) {
          results = results.filter(
            (tool) => tool.flags[flag as keyof typeof tool.flags]
          );
        }
      });
    }

    // Apply sorting (basic implementation)
    if (sort.by === 'name') {
      results.sort((a, b) => {
        const comparison = a.name.localeCompare(b.name);
        return sort.direction === 'asc' ? comparison : -comparison;
      });
    } else if (sort.by === 'popularity') {
      results.sort((a, b) => {
        const aUsers = a.metadata.monthlyUsers || 0;
        const bUsers = b.metadata.monthlyUsers || 0;
        const comparison = aUsers - bUsers;
        return sort.direction === 'asc' ? comparison : -comparison;
      });
    }

    // Apply final limit
    results = results.slice(0, limit);

    const responseTime = Date.now() - startTime;

    // Log complex search for analytics
    console.log('Complex tool search:', {
      query: query.slice(0, 100),
      filters,
      sort,
      resultCount: results.length,
      responseTime,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      results,
      query,
      filters,
      sort,
      count: results.length,
      responseTime,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('API /tools/search POST error:', error);

    const responseTime = Date.now() - startTime;

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Search failed',
        responseTime,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
