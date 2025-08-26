// app/[key].txt/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Disable static generation for this route
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const resolvedParams = await params;
  const { key } = resolvedParams;

  // Return IndexNow key if it matches
  if (key === process.env.INDEXNOW_API_KEY && process.env.INDEXNOW_API_KEY) {
    return new Response(process.env.INDEXNOW_API_KEY, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400', // Cache for 1 day
      },
    });
  }

  // Return 404 for invalid keys
  return new Response('Not Found', {
    status: 404,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
