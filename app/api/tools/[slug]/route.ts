/**
 * API Route for Individual Tool Access
 * Provides tool-specific configuration and access control
 */

import { NextRequest, NextResponse } from 'next/server';
import { getToolBySlug, getRelatedTools } from '@/lib/edge-config/tools';

interface RouteContext {
  params: {
    slug: string;
  };
}

export async function GET(request: NextRequest, context: RouteContext) {
  const startTime = Date.now();

  try {
    const { slug } = context.params;

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tool slug is required',
        },
        { status: 400 }
      );
    }

    // Get the tool configuration
    const tool = await getToolBySlug(slug);

    if (!tool) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tool not found',
        },
        { status: 404 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const includeRelated = searchParams.get('related') === 'true';
    const relatedLimit = parseInt(searchParams.get('relatedLimit') || '4');

    let relatedTools: any[] = [];

    if (includeRelated) {
      relatedTools = await getRelatedTools(slug, relatedLimit);
    }

    const responseTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      tool,
      relatedTools: includeRelated ? relatedTools : undefined,
      responseTime,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`API /tools/${context.params.slug} error:`, error);

    const responseTime = Date.now() - startTime;

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
        responseTime,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  // This endpoint could be used for tool-specific operations
  // Like updating usage statistics or user preferences

  try {
    const { slug } = context.params;
    const body = await request.json();

    console.log(`Tool operation for ${slug}:`, body);

    // In a real implementation, this might:
    // - Track usage analytics
    // - Update user preferences
    // - Log tool performance metrics

    return NextResponse.json({
      success: true,
      message: 'Tool operation logged',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`API /tools/${context.params.slug} POST error:`, error);

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
