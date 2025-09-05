/**
 * API Route for IndexNow webhook
 * POST /api/indexnow/webhook
 * Handles automatic URL submission on deploy/update events
 */

import { NextRequest, NextResponse } from 'next/server';
import { indexNowWebhook, WebhookEvent } from '@/lib/indexnow/webhook';
import { indexNowQueue } from '@/lib/indexnow/queue';

// Verify webhook secret
function verifyWebhook(request: NextRequest): boolean {
  const webhookSecret = process.env.INDEXNOW_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return true; // No secret configured, allow all (for development)
  }

  const signature = request.headers.get('x-webhook-signature');
  return signature === webhookSecret;
}

/**
 * POST /api/indexnow/webhook
 * Handle IndexNow webhook events
 */
export async function POST(request: NextRequest) {
  try {
    // Check if IndexNow is enabled
    if (process.env.INDEXNOW_ENABLED !== 'true') {
      return NextResponse.json(
        { message: 'IndexNow is disabled' },
        { status: 200 }
      );
    }

    // Verify webhook signature
    if (!verifyWebhook(request)) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate event
    if (!body.type) {
      return NextResponse.json(
        { error: 'Missing event type' },
        { status: 400 }
      );
    }

    // Create webhook event
    const event: WebhookEvent = {
      type: body.type,
      toolSlug: body.toolSlug,
      urls: body.urls,
      priority: body.priority || 'normal',
      timestamp: Date.now(),
    };

    // Handle special commands
    if (body.command) {
      switch (body.command) {
        case 'submit-all-tools':
          const toolsResult = await indexNowWebhook.submitAllTools();
          return NextResponse.json(toolsResult);

        case 'submit-sitemap':
          const sitemapResult = await indexNowWebhook.submitFromSitemap();
          return NextResponse.json(sitemapResult);

        case 'process-queue':
          await indexNowQueue.processQueue();
          return NextResponse.json({
            success: true,
            message: 'Queue processing triggered',
            stats: indexNowQueue.getStats(),
          });

        case 'test-config':
          const testResult = await indexNowWebhook.testConfiguration();
          return NextResponse.json(testResult);

        default:
          return NextResponse.json(
            { error: `Unknown command: ${body.command}` },
            { status: 400 }
          );
      }
    }

    // Handle regular webhook event
    const result = await indexNowWebhook.handleEvent(event);

    return NextResponse.json({
      ...result,
      event,
      queueStats: indexNowQueue.getStats(),
    });
  } catch (error) {
    console.error('IndexNow webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/indexnow/webhook
 * Health check endpoint
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'healthy',
    enabled: process.env.INDEXNOW_ENABLED === 'true',
    queueSize: indexNowQueue.size,
    timestamp: Date.now(),
  });
}
