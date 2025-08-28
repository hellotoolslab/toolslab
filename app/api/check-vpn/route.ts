import { NextRequest, NextResponse } from 'next/server';

interface VPNCheckResponse {
  isVPN: boolean;
  confidence: 'low' | 'medium' | 'high';
  indicators: string[];
  debug?: {
    forwardedFor: string | null;
    realIP: string | null;
    vpnMode: string | null;
    userAgent: string | null;
    cfConnectingIP: string | null;
    xOriginalForwardedFor: string | null;
  };
}

/**
 * API endpoint to check if the request is coming from a VPN/corporate proxy
 * This complements the middleware detection with additional client-side checks
 */
export async function GET(request: NextRequest) {
  try {
    // Skip VPN detection if not enabled
    if (process.env.NEXT_PUBLIC_VPN_MODE_ENABLED !== 'true') {
      return NextResponse.json({
        isVPN: false,
        confidence: 'low' as const,
        indicators: ['VPN detection disabled'],
      });
    }

    // Get headers from the request
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const vpnMode = request.headers.get('x-vpn-mode'); // Set by middleware
    const userAgent = request.headers.get('user-agent');
    const cfConnectingIP = request.headers.get('cf-connecting-ip');
    const xOriginalForwardedFor = request.headers.get(
      'x-original-forwarded-for'
    );

    // VPN detection indicators
    const indicators: string[] = [];
    let confidence: 'low' | 'medium' | 'high' = 'low';

    // Primary indicator: middleware already detected VPN
    if (vpnMode === 'true') {
      indicators.push('Middleware VPN detection');
      confidence = 'high';
    }

    // Secondary indicators: IP analysis
    const allIPs = [forwardedFor, realIP, cfConnectingIP, xOriginalForwardedFor]
      .filter(Boolean)
      .join(',');

    // Check for private IP ranges
    const privateIPRanges = [
      { pattern: /^10\./, name: 'Class A private (10.x.x.x)' },
      {
        pattern: /^172\.(1[6-9]|2\d|3[01])\./,
        name: 'Class B private (172.16-31.x.x)',
      },
      { pattern: /^192\.168\./, name: 'Class C private (192.168.x.x)' },
      { pattern: /^169\.254\./, name: 'Link-local (169.254.x.x)' },
      { pattern: /^127\./, name: 'Localhost (127.x.x.x)' },
    ];

    for (const range of privateIPRanges) {
      if (range.pattern.test(allIPs)) {
        indicators.push(`Private IP detected: ${range.name}`);
        if (confidence === 'low') confidence = 'medium';
      }
    }

    // Check for corporate proxy indicators in User-Agent
    const corporateIndicators = [
      { pattern: /forticlient/i, name: 'FortiClient VPN' },
      { pattern: /cisco/i, name: 'Cisco VPN' },
      { pattern: /checkpoint/i, name: 'CheckPoint VPN' },
      { pattern: /palo alto/i, name: 'Palo Alto Networks' },
      { pattern: /corporate[_\s]proxy/i, name: 'Corporate Proxy' },
      { pattern: /enterprise[_\s]gateway/i, name: 'Enterprise Gateway' },
      { pattern: /websense/i, name: 'Websense Web Filter' },
      { pattern: /bluecoat/i, name: 'Blue Coat Proxy' },
      { pattern: /mcafee[_\s]web[_\s]gateway/i, name: 'McAfee Web Gateway' },
      { pattern: /zscaler/i, name: 'Zscaler Internet Access' },
      { pattern: /netskope/i, name: 'Netskope Security Cloud' },
    ];

    if (userAgent) {
      for (const indicator of corporateIndicators) {
        if (indicator.pattern.test(userAgent)) {
          indicators.push(`Corporate software detected: ${indicator.name}`);
          confidence = 'high';
        }
      }
    }

    // Additional network topology indicators
    const forwardedIPs = forwardedFor?.split(',').map((ip) => ip.trim()) || [];
    if (forwardedIPs.length > 1) {
      indicators.push(`Multiple proxy hops (${forwardedIPs.length})`);
      if (confidence === 'low') confidence = 'medium';
    }

    if (xOriginalForwardedFor) {
      indicators.push('X-Original-Forwarded-For header present');
      if (confidence === 'low') confidence = 'medium';
    }

    // Determine if this is a VPN connection
    const isVPN =
      indicators.length > 0 &&
      (vpnMode === 'true' ||
        confidence === 'high' ||
        (confidence === 'medium' && indicators.length >= 2));

    // Prepare response
    const response: VPNCheckResponse = {
      isVPN,
      confidence,
      indicators:
        indicators.length > 0 ? indicators : ['No VPN indicators detected'],
    };

    // Add debug information in development
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.NEXT_PUBLIC_VPN_DEBUG_MODE === 'true'
    ) {
      response.debug = {
        forwardedFor,
        realIP,
        vpnMode,
        userAgent: userAgent?.substring(0, 100) || null, // Truncate for security
        cfConnectingIP,
        xOriginalForwardedFor,
      };
    }

    // Set appropriate cache headers
    const nextResponse = NextResponse.json(response);

    // Don't cache VPN detection results as network conditions can change
    nextResponse.headers.set(
      'Cache-Control',
      'no-cache, no-store, must-revalidate'
    );
    nextResponse.headers.set('Pragma', 'no-cache');
    nextResponse.headers.set('Expires', '0');

    // Add CORS headers for cross-origin requests (if needed)
    nextResponse.headers.set('Access-Control-Allow-Origin', '*');
    nextResponse.headers.set('Access-Control-Allow-Methods', 'GET');
    nextResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return nextResponse;
  } catch (error) {
    console.error('VPN detection API error:', error);

    // Return safe fallback response
    return NextResponse.json(
      {
        isVPN: false,
        confidence: 'low' as const,
        indicators: ['Detection error occurred'],
        error:
          process.env.NODE_ENV === 'development'
            ? String(error)
            : 'Internal error',
      },
      { status: 500 }
    );
  }
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400', // 24 hours
    },
  });
}
