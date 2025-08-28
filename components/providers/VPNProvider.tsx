'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useVPNDetection } from '@/lib/hooks/useVPNDetection';

interface VPNContextValue {
  // Detection state
  isVPN: boolean;
  confidence: 'low' | 'medium' | 'high';
  indicators: string[];
  connectionType: 'direct' | 'corporate-vpn' | 'home-vpn' | 'proxy';

  // Health state
  healthStatus: {
    status: 'healthy' | 'warning' | 'error' | 'checking';
    lastChecked: Date | null;
    recommendations: string[];
  };

  // Loading states
  isLoading: boolean;
  isHealthChecking: boolean;

  // Actions
  checkVPN: () => Promise<void>;
  checkHealth: () => Promise<void>;
  clearCache: () => void;

  // Utilities
  isHSTSDisabled: boolean;
  isCorporateNetwork: boolean;
  shouldShowNotification: boolean;

  // UI State
  notificationDismissed: boolean;
  dismissNotification: () => void;
  resetNotification: () => void;

  // Global VPN management
  enableVPNMode: () => void;
  disableVPNMode: () => void;
  isVPNModeEnabled: boolean;
}

const VPNContext = createContext<VPNContextValue | null>(null);

interface VPNProviderProps {
  children: React.ReactNode;
  enableAutoCheck?: boolean;
  checkInterval?: number;
  enableHealthCheck?: boolean;
  showDebugInfo?: boolean;
}

/**
 * VPN Provider - Global VPN state management
 *
 * This provider wraps the entire application to provide global VPN detection
 * and management capabilities. It handles automatic detection, health monitoring,
 * and provides utilities for managing corporate VPN scenarios across the app.
 */
export function VPNProvider({
  children,
  enableAutoCheck = true,
  checkInterval = 300000, // 5 minutes
  enableHealthCheck = true,
  showDebugInfo = process.env.NODE_ENV === 'development',
}: VPNProviderProps) {
  // Local state for UI management
  const [notificationDismissed, setNotificationDismissed] = useState(false);
  const [isVPNModeEnabled, setIsVPNModeEnabled] = useState(
    process.env.NEXT_PUBLIC_VPN_MODE_ENABLED === 'true'
  );

  // Use the VPN detection hook
  const vpnDetection = useVPNDetection({
    enableAutoCheck: enableAutoCheck && isVPNModeEnabled,
    checkInterval,
    enableHealthCheck: enableHealthCheck && isVPNModeEnabled,
    onVPNDetected: (result) => {
      if (showDebugInfo && result.isVPN) {
        console.log('🔒 VPN detected:', {
          confidence: result.confidence,
          connectionType: result.connectionType,
          indicators: result.indicators,
          hstsCompatible: result.hstsCompatible,
        });
      }
    },
    onHealthChanged: (status) => {
      if (showDebugInfo) {
        console.log('🏥 VPN health status:', status.status, {
          recommendations: status.recommendations.length,
          lastChecked: status.lastChecked?.toISOString(),
        });
      }

      // Auto-dismiss notification if health is good and this is corporate VPN
      if (
        status.status === 'healthy' &&
        vpnDetection.isCorporateNetwork &&
        !notificationDismissed
      ) {
        // Keep notification for first 30 seconds for corporate users to see
        setTimeout(() => {
          if (!localStorage.getItem('vpn-notification-seen')) {
            localStorage.setItem('vpn-notification-seen', 'true');
          }
        }, 30000);
      }
    },
  });

  // Initialize notification state from localStorage
  useEffect(() => {
    const dismissed = localStorage.getItem('vpn-notification-dismissed');
    if (dismissed === 'true') {
      setNotificationDismissed(true);
    }
  }, []);

  // Handle notification dismissal
  const dismissNotification = () => {
    setNotificationDismissed(true);
    localStorage.setItem('vpn-notification-dismissed', 'true');

    if (showDebugInfo) {
      console.log('🔕 VPN notification dismissed');
    }
  };

  // Reset notification (for development/testing)
  const resetNotification = () => {
    setNotificationDismissed(false);
    localStorage.removeItem('vpn-notification-dismissed');
    localStorage.removeItem('vpn-notification-seen');

    if (showDebugInfo) {
      console.log('🔔 VPN notification reset');
    }
  };

  // Enable VPN mode globally
  const enableVPNMode = () => {
    setIsVPNModeEnabled(true);

    if (showDebugInfo) {
      console.log('🔒 VPN mode enabled globally');
    }

    // Trigger immediate check
    vpnDetection.checkVPN();
    if (enableHealthCheck) {
      vpnDetection.checkHealth();
    }
  };

  // Disable VPN mode globally
  const disableVPNMode = () => {
    setIsVPNModeEnabled(false);
    vpnDetection.clearCache();

    if (showDebugInfo) {
      console.log('🔓 VPN mode disabled globally');
    }
  };

  // Wrapped actions that handle loading states
  const checkVPN = async () => {
    if (!isVPNModeEnabled) return;
    await vpnDetection.checkVPN();
  };

  const checkHealth = async () => {
    if (!isVPNModeEnabled) return;
    await vpnDetection.checkHealth();
  };

  // Log initial state in development
  useEffect(() => {
    if (showDebugInfo && isVPNModeEnabled) {
      console.log('🚀 VPN Provider initialized:', {
        vpnModeEnabled: isVPNModeEnabled,
        autoCheck: enableAutoCheck,
        healthCheck: enableHealthCheck,
        checkInterval: checkInterval / 1000 + 's',
        hstsDisabled: vpnDetection.isHSTSDisabled,
        corporateVPNSupport:
          process.env.NEXT_PUBLIC_CORPORATE_VPN_SUPPORT === 'true',
      });
    }
  }, [
    isVPNModeEnabled,
    enableAutoCheck,
    enableHealthCheck,
    checkInterval,
    showDebugInfo,
    vpnDetection.isHSTSDisabled,
  ]);

  // Create context value
  const contextValue: VPNContextValue = {
    // Detection state
    isVPN: vpnDetection.isVPN,
    confidence: vpnDetection.confidence,
    indicators: vpnDetection.indicators,
    connectionType: vpnDetection.connectionType,

    // Health state
    healthStatus: vpnDetection.healthStatus,

    // Loading states
    isLoading: vpnDetection.isLoading,
    isHealthChecking: vpnDetection.isHealthChecking,

    // Actions
    checkVPN,
    checkHealth,
    clearCache: vpnDetection.clearCache,

    // Utilities
    isHSTSDisabled: vpnDetection.isHSTSDisabled,
    isCorporateNetwork: vpnDetection.isCorporateNetwork,
    shouldShowNotification:
      vpnDetection.shouldShowNotification && !notificationDismissed,

    // UI State
    notificationDismissed,
    dismissNotification,
    resetNotification,

    // Global VPN management
    enableVPNMode,
    disableVPNMode,
    isVPNModeEnabled,
  };

  return (
    <VPNContext.Provider value={contextValue}>{children}</VPNContext.Provider>
  );
}

/**
 * Hook to use VPN context
 */
export function useVPN(): VPNContextValue {
  const context = useContext(VPNContext);

  if (!context) {
    throw new Error(
      'useVPN must be used within a VPNProvider. ' +
        'Make sure to wrap your app or component tree with <VPNProvider>.'
    );
  }

  return context;
}

/**
 * Higher-order component for VPN-aware components
 */
export function withVPN<P extends object>(
  Component: React.ComponentType<P & { vpn: VPNContextValue }>
) {
  return function VPNAwareComponent(props: P) {
    const vpn = useVPN();
    return <Component {...props} vpn={vpn} />;
  };
}

/**
 * Development helper component - shows VPN status
 */
export function VPNDebugInfo() {
  const vpn = useVPN();

  if (process.env.NODE_ENV !== 'development' || !vpn.isVPNModeEnabled) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-xs rounded-lg bg-gray-900 p-3 text-xs text-white shadow-lg">
      <div className="mb-2 font-bold">🔒 VPN Debug Info</div>
      <div>Mode: {vpn.isVPN ? '✅ VPN' : '❌ Direct'}</div>
      <div>Type: {vpn.connectionType}</div>
      <div>Confidence: {vpn.confidence}</div>
      <div>Health: {vpn.healthStatus.status}</div>
      <div>HSTS: {vpn.isHSTSDisabled ? '❌ Disabled' : '✅ Enabled'}</div>
      <div>Corporate: {vpn.isCorporateNetwork ? '✅ Yes' : '❌ No'}</div>
      {vpn.indicators.length > 0 && (
        <div className="mt-2">
          <div className="font-semibold">Indicators:</div>
          {vpn.indicators.slice(0, 3).map((indicator, i) => (
            <div key={i} className="text-xs opacity-80">
              • {indicator}
            </div>
          ))}
        </div>
      )}
      <button
        onClick={vpn.resetNotification}
        className="mt-2 rounded bg-blue-600 px-2 py-1 text-xs hover:bg-blue-700"
      >
        Reset Notification
      </button>
    </div>
  );
}

export default VPNProvider;
