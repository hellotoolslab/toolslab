/**
 * API Route for Tool Access Control
 * Validates user permissions to access specific tools
 */

import { NextRequest, NextResponse } from 'next/server';
import { canUserAccessTool } from '@/lib/edge-config/tools';
import { UserPlan } from '@/lib/edge-config/types';

interface RouteContext {
  params: {
    slug: string;
  };
}

export async function POST(request: NextRequest, context: RouteContext) {
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

    // Parse request body
    const body = await request.json();
    const userPlan: UserPlan = body.userPlan || {
      type: 'free',
      features: [],
      limits: {
        dailyRequests: 1000,
        concurrentRequests: 5,
      },
    };

    // Additional context from headers or session
    const userAgent = request.headers.get('user-agent') || '';
    const origin = request.headers.get('origin') || '';

    // Check tool access
    const accessResult = await canUserAccessTool(slug, userPlan);

    // Log access attempt for analytics
    console.log('Tool access check:', {
      slug,
      userPlan: userPlan.type,
      canAccess: accessResult.canAccess,
      reason: accessResult.reason,
      userAgent: userAgent.slice(0, 100), // Truncate for privacy
      origin,
      timestamp: new Date().toISOString(),
    });

    const responseTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      access: accessResult,
      responseTime,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`API /tools/${context.params.slug}/access error:`, error);

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

export async function GET(request: NextRequest, context: RouteContext) {
  // GET endpoint for checking access without body payload
  // Uses query parameters instead

  const startTime = Date.now();

  try {
    const { slug } = context.params;
    const { searchParams } = new URL(request.url);

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tool slug is required',
        },
        { status: 400 }
      );
    }

    const userPlan: UserPlan = {
      type: (searchParams.get('plan') as 'free' | 'pro') || 'free',
      features: searchParams.get('features')?.split(',') || [],
      limits: {
        dailyRequests: parseInt(searchParams.get('dailyLimit') || '1000'),
        concurrentRequests: parseInt(
          searchParams.get('concurrentLimit') || '5'
        ),
      },
    };

    const accessResult = await canUserAccessTool(slug, userPlan);

    const responseTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      access: accessResult,
      responseTime,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`API /tools/${context.params.slug}/access GET error:`, error);

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
