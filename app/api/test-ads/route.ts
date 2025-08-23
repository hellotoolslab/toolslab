/**
 * Test endpoint to verify ads configuration
 */

import { NextResponse } from 'next/server';
import { getCompleteConfig } from '@/lib/edge-config/client';

export async function GET() {
  const config = await getCompleteConfig();

  const adsEnabled = config.success ? config.data.features.adsEnabled : false;

  return NextResponse.json({
    adsEnabled,
    source: config.success ? config.source : 'fallback',
    timestamp: new Date().toISOString(),
  });
}
