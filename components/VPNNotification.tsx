'use client';

import { useState, useEffect } from 'react';
import {
  X,
  AlertCircle,
  Shield,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface VPNCheckResponse {
  isVPN: boolean;
  debug?: {
    forwardedFor: string | null;
    realIP: string | null;
    vpnMode: string | null;
  };
}

export function VPNNotification() {
  const [isVPN, setIsVPN] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<VPNCheckResponse['debug']>();

  useEffect(() => {
    // Check localStorage for dismissal state
    const isDismissedStored = localStorage.getItem(
      'vpn-notification-dismissed'
    );
    if (isDismissedStored === 'true') {
      setDismissed(true);
    }

    // Only check VPN if not dismissed and VPN mode is enabled
    // In production, rely more on middleware detection to reduce API calls
    if (
      process.env.NEXT_PUBLIC_VPN_MODE_ENABLED === 'true' &&
      !isDismissedStored &&
      (process.env.NODE_ENV === 'development' ||
        !sessionStorage.getItem('vpn-checked'))
    ) {
      checkVPNStatus();
      if (process.env.NODE_ENV !== 'development') {
        sessionStorage.setItem('vpn-checked', 'true');
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const checkVPNStatus = async () => {
    try {
      const response = await fetch('/api/check-vpn', {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (response.ok) {
        const data: VPNCheckResponse = await response.json();
        setIsVPN(data.isVPN);

        if (process.env.NEXT_PUBLIC_VPN_DEBUG_MODE === 'true') {
          setDebugInfo(data.debug);
        }
      }
    } catch (error) {
      console.error('Failed to check VPN status:', error);

      // Fallback: check for VPN mode header set by middleware
      setIsVPN(document.cookie.includes('vpn-mode=true'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('vpn-notification-dismissed', 'true');
  };

  const handleReset = () => {
    localStorage.removeItem('vpn-notification-dismissed');
    setDismissed(false);
    checkVPNStatus();
  };

  // Don't show anything if loading, dismissed, not VPN, or VPN mode disabled
  if (
    isLoading ||
    dismissed ||
    !isVPN ||
    process.env.NEXT_PUBLIC_VPN_MODE_ENABLED !== 'true'
  ) {
    return null;
  }

  return (
    <div className="relative">
      {/* Main notification banner */}
      <div className="border-l-4 border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Shield className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Corporate Network Detected
                  </h3>
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                    VPN Compatible
                  </span>
                </div>
                <div className="mt-1">
                  <p className="text-sm text-yellow-700">
                    We&apos;ve detected you&apos;re using a corporate VPN or
                    proxy. Security settings have been optimized for
                    compatibility.
                  </p>
                  {process.env.NODE_ENV === 'development' && (
                    <p className="mt-1 font-mono text-xs text-yellow-600">
                      Development Mode: VPN detection is active
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="ml-4 flex flex-shrink-0 items-center space-x-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center text-sm font-medium text-yellow-800 hover:text-yellow-900"
              >
                More info
                {isExpanded ? (
                  <ChevronUp className="ml-1 h-4 w-4" />
                ) : (
                  <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </button>
              <button
                onClick={handleDismiss}
                className="inline-flex items-center justify-center text-yellow-400 hover:text-yellow-500"
                aria-label="Dismiss notification"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Expanded content */}
        {isExpanded && (
          <div className="border-t border-yellow-200 bg-yellow-50/50 px-4 py-3">
            <div className="space-y-3">
              {/* Solutions section */}
              <div>
                <h4 className="mb-2 text-sm font-medium text-yellow-800">
                  Experiencing certificate errors? Try these solutions:
                </h4>
                <ul className="space-y-1 text-sm text-yellow-700">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      Ask your IT team to whitelist{' '}
                      <code className="rounded bg-yellow-100 px-1 text-xs">
                        toolslab.dev
                      </code>{' '}
                      in your proxy settings
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      Temporarily disable your VPN to access the site directly
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      Use your mobile device as a hotspot if policy allows
                    </span>
                  </li>
                </ul>
              </div>

              {/* Technical details for IT */}
              <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-yellow-800 hover:text-yellow-900">
                  <span className="inline-flex items-center">
                    <ExternalLink className="mr-1 h-4 w-4" />
                    Technical details for IT teams
                  </span>
                </summary>
                <div className="mt-2 space-y-1 pl-5 text-sm text-yellow-600">
                  <p>
                    <strong>Domain:</strong> toolslab.dev (includes all
                    subdomains)
                  </p>
                  <p>
                    <strong>SSL/TLS:</strong> Uses Let&apos;s Encrypt
                    certificates
                  </p>
                  <p>
                    <strong>CDN:</strong> Vercel Edge Network
                  </p>
                  <p>
                    <strong>Ports:</strong> 443 (HTTPS), 80 (HTTP redirect)
                  </p>
                  <p>
                    <strong>Headers:</strong> HSTS disabled for VPN
                    compatibility
                  </p>
                  {debugInfo &&
                    process.env.NEXT_PUBLIC_VPN_DEBUG_MODE === 'true' && (
                      <div className="mt-2 rounded bg-yellow-100 p-2 font-mono text-xs">
                        <p>
                          <strong>Debug Info:</strong>
                        </p>
                        <p>Forwarded: {debugInfo.forwardedFor || 'none'}</p>
                        <p>Real IP: {debugInfo.realIP || 'none'}</p>
                        <p>VPN Mode: {debugInfo.vpnMode || 'false'}</p>
                      </div>
                    )}
                </div>
              </details>

              {/* Contact support */}
              <div className="border-t border-yellow-200 pt-2">
                <p className="text-xs text-yellow-600">
                  Still having issues? The site works fully offline - all tools
                  function without internet once loaded.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Development reset button */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute left-2 top-2">
          <button
            onClick={handleReset}
            className="rounded bg-yellow-200 px-2 py-1 text-xs text-yellow-800 hover:bg-yellow-300"
          >
            Reset VPN Detection
          </button>
        </div>
      )}
    </div>
  );
}
