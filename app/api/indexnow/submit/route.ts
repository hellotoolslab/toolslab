/**
 * API Route for manual IndexNow URL submission
 * POST /api/indexnow/submit
 * GET /api/indexnow/submit (stats)
 */

import { NextRequest, NextResponse } from 'next/server';
import { indexNowClient } from '@/lib/indexnow/client';
import { indexNowQueue } from '@/lib/indexnow/queue';

// Verify admin access
function verifyAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const adminKey = process.env.ADMIN_SECRET_KEY;

  if (!adminKey) {
    return false; // Admin key not configured
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.substring(7);
  return token === adminKey;
}

/**
 * POST /api/indexnow/submit
 * Submit URLs to IndexNow
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { urls, url, priority = 'normal', immediate = false } = body;

    // Validate input
    if (!urls && !url) {
      return NextResponse.json(
        { error: 'Missing urls or url parameter' },
        { status: 400 }
      );
    }

    const urlList = urls || [url];

    // Validate URLs belong to our domain
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolslab.dev';
    const validUrls = urlList.filter((u: string) => {
      try {
        const urlObj = new URL(u);
        const siteObj = new URL(siteUrl);
        return urlObj.hostname === siteObj.hostname;
      } catch {
        return false;
      }
    });

    if (validUrls.length === 0) {
      return NextResponse.json(
        { error: 'No valid URLs for submission' },
        { status: 400 }
      );
    }

    // Submit immediately or add to queue
    if (immediate) {
      const result = await indexNowClient.submitUrls(validUrls);

      return NextResponse.json({
        success: result.success,
        message: result.message,
        submittedUrls: result.submittedUrls,
        failedUrls: result.failedUrls,
        statusCode: result.statusCode,
      });
    } else {
      // Add to queue
      indexNowQueue.addUrls(validUrls, priority);

      return NextResponse.json({
        success: true,
        message: `Added ${validUrls.length} URLs to queue`,
        urls: validUrls,
        priority,
      });
    }
  } catch (error) {
    console.error('IndexNow submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/indexnow/submit
 * Get submission statistics
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get queue statistics
    const queueStats = indexNowQueue.getStats();

    // Get queued URLs if requested
    const includeUrls =
      request.nextUrl.searchParams.get('includeUrls') === 'true';
    const queuedUrls = includeUrls ? indexNowQueue.getQueuedUrls() : undefined;

    // Get IndexNow endpoint status
    const endpointStats = await indexNowClient.getStats();

    return NextResponse.json({
      queue: {
        ...queueStats,
        urls: queuedUrls,
      },
      endpoints: endpointStats,
      config: {
        enabled: process.env.INDEXNOW_ENABLED === 'true',
        keyConfigured: !!process.env.INDEXNOW_KEY,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://toolslab.dev',
      },
    });
  } catch (error) {
    console.error('IndexNow stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
