import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const hostname = request.headers.get('host') || 'unknown';
  const forwarded = request.headers.get('x-forwarded-host');
  const proto = request.headers.get('x-forwarded-proto') || 'http';
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  const userAgent = request.headers.get('user-agent');
  const referer = request.headers.get('referer');
  const origin = request.headers.get('origin');

  // Determine the actual hostname being used
  const actualHostname = forwarded || hostname;

  // Check if using correct domain
  const isCorrectDomain = actualHostname.includes('toolslab.dev');

  // Build response with detailed connection info
  const certInfo = {
    hostname: actualHostname,
    protocol: proto,
    isSecure: proto === 'https',
    isCorrectDomain,
    headers: {
      host: hostname,
      'x-forwarded-host': forwarded || 'none',
      'x-forwarded-proto': proto,
      'x-forwarded-for': forwardedFor || 'none',
      'x-real-ip': realIP || 'none',
      'cf-connecting-ip': cfConnectingIP || 'none',
      'user-agent': userAgent ? userAgent.substring(0, 150) : 'none',
      referer: referer || 'none',
      origin: origin || 'none',
    },
    timestamp: new Date().toISOString(),
    debug: {
      isVercelHost: hostname.includes('vercel'),
      isSNIFallback: hostname.includes('no-sni'),
      hasForwardedHost: !!forwarded,
      hasMultipleProxies: (forwardedFor?.split(',').length || 0) > 1,
    },
  };

  // Add warning headers if wrong certificate detected
  const response = NextResponse.json(certInfo);

  if (!isCorrectDomain) {
    response.headers.set('X-Certificate-Warning', 'wrong-domain');
    response.headers.set('X-Expected-Domain', 'toolslab.dev');
    response.headers.set('X-Actual-Domain', actualHostname);
  }

  // Add diagnostic headers
  response.headers.set('X-Test-Timestamp', new Date().toISOString());
  response.headers.set(
    'X-Server-Region',
    process.env.VERCEL_REGION || 'unknown'
  );

  return response;
}
