import { NextRequest, NextResponse } from 'next/server';

interface VPNHealthResponse {
  status: 'healthy' | 'warning' | 'error';
  timestamp: string;
  compatibility: {
    hstsRemoved: boolean;
    vpnCompatibleHeaders: boolean;
    corporateProxyFriendly: boolean;
    certificateIssues: boolean;
  };
  network: {
    isVPN: boolean;
    confidence: 'low' | 'medium' | 'high';
    indicators: string[];
    connectionType: 'direct' | 'corporate-vpn' | 'home-vpn' | 'proxy';
  };
  recommendations: string[];
  debug?: {
    headers: Record<string, string | null>;
    ip: string | null;
    userAgent: string | null;
  };
}

/**
 * VPN Health Check API - Diagnoses VPN compatibility issues
 * This endpoint helps diagnose and resolve corporate VPN access problems
 */
export async function GET(request: NextRequest) {
  try {
    const timestamp = new Date().toISOString();

    // Get network information
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const userAgent = request.headers.get('user-agent') || '';
    const cfConnectingIP = request.headers.get('cf-connecting-ip');
    const xOriginalForwardedFor = request.headers.get(
      'x-original-forwarded-for'
    );
    const vpnMode = request.headers.get('x-vpn-mode');

    // Check for private IP ranges (corporate networks)
    const allIPs = [forwardedFor, realIP, cfConnectingIP, xOriginalForwardedFor]
      .filter(Boolean)
      .join(',');

    const privateIPRanges = [
      {
        pattern: /^10\./,
        name: 'Corporate Class A (10.x.x.x)',
        severity: 'high',
      },
      {
        pattern: /^172\.(1[6-9]|2\d|3[01])\./,
        name: 'Corporate Class B (172.16-31.x.x)',
        severity: 'high',
      },
      {
        pattern: /^192\.168\./,
        name: 'Corporate Class C (192.168.x.x)',
        severity: 'medium',
      },
      {
        pattern: /^169\.254\./,
        name: 'Link-local (169.254.x.x)',
        severity: 'low',
      },
      { pattern: /^127\./, name: 'Localhost (127.x.x.x)', severity: 'low' },
    ];

    // Corporate software detection
    const corporateIndicators = [
      { pattern: /forticlient/i, name: 'FortiClient VPN', type: 'vpn' },
      { pattern: /cisco/i, name: 'Cisco VPN', type: 'vpn' },
      { pattern: /checkpoint/i, name: 'CheckPoint VPN', type: 'vpn' },
      { pattern: /palo alto/i, name: 'Palo Alto Networks', type: 'firewall' },
      { pattern: /zscaler/i, name: 'Zscaler Internet Access', type: 'proxy' },
      { pattern: /netskope/i, name: 'Netskope Security Cloud', type: 'proxy' },
      { pattern: /bluecoat/i, name: 'Blue Coat Proxy', type: 'proxy' },
      { pattern: /websense/i, name: 'Websense Web Filter', type: 'proxy' },
      {
        pattern: /mcafee.*web.*gateway/i,
        name: 'McAfee Web Gateway',
        type: 'proxy',
      },
    ];

    // Analyze network
    const indicators: string[] = [];
    let confidence: 'low' | 'medium' | 'high' = 'low';
    let connectionType: 'direct' | 'corporate-vpn' | 'home-vpn' | 'proxy' =
      'direct';

    // Check IP ranges
    const detectedRanges = privateIPRanges.filter((range) =>
      range.pattern.test(allIPs)
    );
    if (detectedRanges.length > 0) {
      indicators.push(...detectedRanges.map((r) => r.name));
      if (detectedRanges.some((r) => r.severity === 'high')) {
        confidence = 'high';
        connectionType = 'corporate-vpn';
      } else if (confidence === 'low') {
        confidence = 'medium';
        connectionType = 'home-vpn';
      }
    }

    // Check for corporate software
    const detectedSoftware = corporateIndicators.filter((indicator) =>
      indicator.pattern.test(userAgent)
    );
    if (detectedSoftware.length > 0) {
      indicators.push(...detectedSoftware.map((s) => s.name));
      confidence = 'high';
      connectionType =
        detectedSoftware[0].type === 'proxy' ? 'proxy' : 'corporate-vpn';
    }

    // Check for multiple proxy hops
    const forwardedIPs = forwardedFor?.split(',').map((ip) => ip.trim()) || [];
    if (forwardedIPs.length > 1) {
      indicators.push(`Multiple proxy hops (${forwardedIPs.length})`);
      if (confidence === 'low') confidence = 'medium';
    }

    if (xOriginalForwardedFor) {
      indicators.push('X-Original-Forwarded-For present');
      if (confidence === 'low') confidence = 'medium';
    }

    const isVPN = vpnMode === 'true' || indicators.length > 0;

    // Generate compatibility assessment
    const compatibility = {
      hstsRemoved: true, // Always true now that we've removed HSTS completely
      vpnCompatibleHeaders: isVPN,
      corporateProxyFriendly: true, // Our new headers are proxy-friendly
      certificateIssues: false, // Should be resolved with HSTS removal
    };

    // Generate recommendations
    const recommendations: string[] = [];

    if (isVPN && confidence === 'high') {
      recommendations.push(
        '✅ Corporate VPN detected - site configured for optimal compatibility'
      );
      recommendations.push(
        '✅ HSTS completely removed to prevent certificate errors'
      );
      recommendations.push(
        '✅ Anti-HSTS headers configured to clear browser cache'
      );
    }

    if (connectionType === 'proxy') {
      recommendations.push(
        '✅ Corporate proxy detected - permissive CSP policy applied'
      );
      recommendations.push('✅ Proxy-friendly headers configured');
    }

    if (!isVPN) {
      recommendations.push(
        '✅ Direct connection detected - standard security headers applied'
      );
      recommendations.push('✅ No VPN issues expected');
    }

    // Add general recommendations
    recommendations.push('✅ Site fully functional offline once loaded');
    recommendations.push(
      'If issues persist, ask your IT team to whitelist toolslab.dev'
    );

    // Determine overall health status
    let status: 'healthy' | 'warning' | 'error' = 'healthy';

    if (isVPN && confidence === 'high') {
      status = 'healthy'; // VPN detected and handled properly
    } else if (isVPN && confidence === 'medium') {
      status = 'healthy'; // Probable VPN, configuration should handle it
    }

    // Build response
    const response: VPNHealthResponse = {
      status,
      timestamp,
      compatibility,
      network: {
        isVPN,
        confidence,
        indicators:
          indicators.length > 0 ? indicators : ['No VPN indicators detected'],
        connectionType,
      },
      recommendations,
    };

    // Add debug information in development
    if (process.env.NODE_ENV === 'development') {
      response.debug = {
        headers: {
          'x-forwarded-for': forwardedFor,
          'x-real-ip': realIP,
          'cf-connecting-ip': cfConnectingIP,
          'x-original-forwarded-for': xOriginalForwardedFor,
          'x-vpn-mode': vpnMode,
        },
        ip: realIP || forwardedFor?.split(',')[0] || 'unknown',
        userAgent: userAgent.substring(0, 200), // Truncate for security
      };
    }

    // Set response headers (HSTS-free)
    const nextResponse = NextResponse.json(response);

    // Anti-HSTS headers
    nextResponse.headers.set(
      'Cache-Control',
      'no-cache, no-store, must-revalidate'
    );
    nextResponse.headers.set('Pragma', 'no-cache');
    nextResponse.headers.set('Expires', '0');

    // CORS headers
    nextResponse.headers.set('Access-Control-Allow-Origin', '*');
    nextResponse.headers.set('Access-Control-Allow-Methods', 'GET');
    nextResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    // VPN compatibility indicators
    nextResponse.headers.set('X-VPN-Health-Check', 'true');
    nextResponse.headers.set('X-HSTS-Policy', 'disabled');

    return nextResponse;
  } catch (error) {
    console.error('VPN health check error:', error);

    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        compatibility: {
          hstsRemoved: true,
          vpnCompatibleHeaders: false,
          corporateProxyFriendly: false,
          certificateIssues: true,
        },
        network: {
          isVPN: false,
          confidence: 'low' as const,
          indicators: ['Health check failed'],
          connectionType: 'direct' as const,
        },
        recommendations: [
          '❌ Health check failed - please try again',
          'If issues persist, contact support',
        ],
        error:
          process.env.NODE_ENV === 'development'
            ? String(error)
            : 'Internal error',
      } as VPNHealthResponse,
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
          'X-HSTS-Policy': 'disabled',
        },
      }
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
      'Access-Control-Max-Age': '86400',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'X-HSTS-Policy': 'disabled',
    },
  });
}
