import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Types for download tracking
interface DownloadEvent {
  filename: string;
  version: string;
  platform: string;
  userAgent: string;
  ip: string;
  referrer: string;
  timestamp: string;
}

// GitHub repository configuration
const GITHUB_OWNER = 'gianlucaricaldone';
const GITHUB_REPO = 'toolslab';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('file');
  const version = searchParams.get('version');
  const platform = searchParams.get('platform') || 'unknown';

  if (!filename) {
    return NextResponse.json(
      { error: 'Missing required parameter: file' },
      { status: 400 }
    );
  }

  // Get request headers for tracking
  const headersList = headers();
  const userAgent = headersList.get('user-agent') || '';
  const referrer = headersList.get('referer') || '';
  const forwardedFor = headersList.get('x-forwarded-for');
  const realIP = headersList.get('x-real-ip');
  const ip = forwardedFor?.split(',')[0]?.trim() || realIP || 'unknown';

  // Track the download event
  const downloadEvent: DownloadEvent = {
    filename,
    version: version || 'unknown',
    platform,
    userAgent,
    ip,
    referrer,
    timestamp: new Date().toISOString(),
  };

  // Log download event (in production, you might want to use a proper analytics service)
  console.log('Download event:', downloadEvent);

  // Track with Umami if available
  if (process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID) {
    try {
      // This is a simplified example - in production you'd want to properly implement this
      const trackingData = {
        website: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
        url: `/download/${filename}`,
        title: `Download: ${filename}`,
        name: 'download',
        data: {
          filename,
          version,
          platform,
        },
      };

      // You could send this to your analytics endpoint
      console.log('Analytics tracking:', trackingData);
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  // Construct GitHub download URL
  const versionTag = version?.startsWith('v') ? version : `v${version}`;
  const downloadUrl = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases/download/${versionTag}/${filename}`;

  // Redirect to GitHub release download
  return NextResponse.redirect(downloadUrl, { status: 302 });
}

// Health check endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // This could be used for more detailed download analytics
    // For example, tracking download completion, installation success, etc.

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Download tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track download' },
      { status: 500 }
    );
  }
}
