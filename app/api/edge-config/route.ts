/**
 * API endpoint for fetching Edge Config
 * Provides configuration to client components
 */

import { NextResponse } from 'next/server';
import { getCompleteConfig, clearCache } from '@/lib/edge-config/client';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // No cache

export async function GET(request: Request) {
  try {
    // Clear cache if requested
    const url = new URL(request.url);
    const forceRefresh = url.searchParams.get('refresh') === 'true';

    if (forceRefresh) {
      clearCache();
    }

    const result = await getCompleteConfig();

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (error) {
    console.error('Edge Config API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          type: 'server_error',
          message: 'Failed to fetch configuration',
        },
      },
      { status: 500 }
    );
  }
}
