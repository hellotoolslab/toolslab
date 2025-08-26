// app/api/seo/monitor/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { SEOMonitor } from '@/lib/seo/monitor';
import { SEOAutoSubmitter } from '@/lib/seo/auto-submit';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const type = searchParams.get('type') || 'full';
    const autoSubmit = searchParams.get('autoSubmit') === 'true';

    const monitor = new SEOMonitor();

    if (type === 'quick') {
      // Quick health check
      const result = await monitor.quickHealthCheck();
      return NextResponse.json(result);
    }

    if (type === 'stats') {
      // Monitoring stats
      const stats = monitor.getMonitoringStats();
      return NextResponse.json(stats);
    }

    // Full health check
    const report = await monitor.runHealthCheck(autoSubmit);

    return NextResponse.json(report, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (error) {
    console.error('SEO Monitor API error:', error);

    return NextResponse.json(
      {
        error: 'Monitoring failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action;

    if (action === 'submit') {
      // Manual submission trigger
      const submitter = new SEOAutoSubmitter();
      const result = await submitter.submitAll();

      return NextResponse.json({
        action: 'submit',
        result,
        timestamp: new Date().toISOString(),
      });
    }

    if (action === 'submit-tool') {
      // Submit specific tool
      const toolSlug = body.toolSlug;
      if (!toolSlug) {
        return NextResponse.json(
          {
            error: 'toolSlug is required for submit-tool action',
          },
          { status: 400 }
        );
      }

      const submitter = new SEOAutoSubmitter();
      const success = await submitter.submitNewTool(toolSlug);

      return NextResponse.json({
        action: 'submit-tool',
        toolSlug,
        success,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      {
        error: 'Unknown action',
        availableActions: ['submit', 'submit-tool'],
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('SEO Monitor POST API error:', error);

    return NextResponse.json(
      {
        error: 'Action failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
