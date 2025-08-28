'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface VPNDetectionResult {
  isVPN: boolean;
  confidence: 'low' | 'medium' | 'high';
  indicators: string[];
  connectionType: 'direct' | 'corporate-vpn' | 'home-vpn' | 'proxy';
  hstsCompatible: boolean;
  certificateIssues: boolean;
}

interface VPNHealthStatus {
  status: 'healthy' | 'warning' | 'error' | 'checking';
  lastChecked: Date | null;
  recommendations: string[];
  debugInfo?: {
    headers: Record<string, string | null>;
    ip: string | null;
    userAgent: string | null;
  };
}

interface UseVPNDetectionOptions {
  enableAutoCheck?: boolean;
  checkInterval?: number; // in milliseconds
  enableHealthCheck?: boolean;
  onVPNDetected?: (result: VPNDetectionResult) => void;
  onHealthChanged?: (status: VPNHealthStatus) => void;
}

interface UseVPNDetectionReturn {
  // Detection state
  isVPN: boolean;
  confidence: 'low' | 'medium' | 'high';
  indicators: string[];
  connectionType: 'direct' | 'corporate-vpn' | 'home-vpn' | 'proxy';

  // Health state
  healthStatus: VPNHealthStatus;

  // Loading states
  isLoading: boolean;
  isHealthChecking: boolean;

  // Actions
  checkVPN: () => Promise<VPNDetectionResult | null>;
  checkHealth: () => Promise<VPNHealthStatus>;
  clearCache: () => void;

  // Utilities
  isHSTSDisabled: boolean;
  isCorporateNetwork: boolean;
  shouldShowNotification: boolean;
}

const DEFAULT_OPTIONS: UseVPNDetectionOptions = {
  enableAutoCheck:
    process.env.NODE_ENV === 'development' ||
    process.env.NEXT_PUBLIC_VPN_AUTO_CHECK_PRODUCTION === 'true',
  checkInterval: process.env.NODE_ENV === 'development' ? 300000 : 3600000, // 5 min dev, 1 hour prod
  enableHealthCheck:
    process.env.NODE_ENV === 'development' ||
    process.env.NEXT_PUBLIC_VPN_AUTO_CHECK_PRODUCTION === 'true',
};

const CACHE_KEY = 'vpn-detection-cache';
const CACHE_DURATION =
  process.env.NODE_ENV === 'development'
    ? 5 * 60 * 1000 // 5 minutes in development
    : 30 * 60 * 1000; // 30 minutes in production

interface CachedResult {
  result: VPNDetectionResult;
  timestamp: number;
}

/**
 * Advanced VPN Detection Hook
 *
 * This hook provides comprehensive VPN detection capabilities for the HSTS-free
 * toolslab.dev environment. It handles automatic detection, health monitoring,
 * and provides utilities for managing corporate VPN scenarios.
 */
export function useVPNDetection(
  options: UseVPNDetectionOptions = {}
): UseVPNDetectionReturn {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // State management
  const [isVPN, setIsVPN] = useState(false);
  const [confidence, setConfidence] = useState<'low' | 'medium' | 'high'>(
    'low'
  );
  const [indicators, setIndicators] = useState<string[]>([]);
  const [connectionType, setConnectionType] = useState<
    'direct' | 'corporate-vpn' | 'home-vpn' | 'proxy'
  >('direct');
  const [isLoading, setIsLoading] = useState(false);
  const [isHealthChecking, setIsHealthChecking] = useState(false);
  const [healthStatus, setHealthStatus] = useState<VPNHealthStatus>({
    status: 'checking',
    lastChecked: null,
    recommendations: [],
  });

  // Refs for cleanup
  const intervalRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController>();

  // Check if VPN detection is enabled
  const isVPNModeEnabled = process.env.NEXT_PUBLIC_VPN_MODE_ENABLED === 'true';
  const isHSTSDisabled = process.env.NEXT_PUBLIC_HSTS_DISABLED === 'true';
  const isCorporateVPNSupported =
    process.env.NEXT_PUBLIC_CORPORATE_VPN_SUPPORT === 'true';

  // Get cached result
  const getCachedResult = useCallback((): VPNDetectionResult | null => {
    if (typeof window === 'undefined') return null;

    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const { result, timestamp }: CachedResult = JSON.parse(cached);
      if (Date.now() - timestamp > CACHE_DURATION) {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }

      return result;
    } catch (error) {
      console.warn('Failed to read VPN detection cache:', error);
      return null;
    }
  }, []);

  // Cache result
  const setCachedResult = useCallback((result: VPNDetectionResult) => {
    if (typeof window === 'undefined') return;

    try {
      const cached: CachedResult = {
        result,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
    } catch (error) {
      console.warn('Failed to cache VPN detection result:', error);
    }
  }, []);

  // Clear cache
  const clearCache = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(CACHE_KEY);
    } catch (error) {
      console.warn('Failed to clear VPN detection cache:', error);
    }
  }, []);

  // Perform VPN detection
  const checkVPN = useCallback(async (): Promise<VPNDetectionResult | null> => {
    if (!isVPNModeEnabled) {
      return {
        isVPN: false,
        confidence: 'low',
        indicators: ['VPN detection disabled'],
        connectionType: 'direct',
        hstsCompatible: true,
        certificateIssues: false,
      };
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);

    try {
      const response = await fetch('/api/check-vpn', {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
        },
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`VPN check failed: ${response.status}`);
      }

      const data = await response.json();

      const result: VPNDetectionResult = {
        isVPN: data.isVPN,
        confidence: data.confidence,
        indicators: data.indicators || [],
        connectionType: data.isVPN
          ? data.confidence === 'high'
            ? 'corporate-vpn'
            : 'home-vpn'
          : 'direct',
        hstsCompatible: isHSTSDisabled, // Always true now
        certificateIssues: false, // Should be resolved with HSTS removal
      };

      // Update state
      setIsVPN(result.isVPN);
      setConfidence(result.confidence);
      setIndicators(result.indicators);
      setConnectionType(result.connectionType);

      // Cache result
      setCachedResult(result);

      // Callback
      if (opts.onVPNDetected) {
        opts.onVPNDetected(result);
      }

      return result;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return null; // Request was aborted
      }

      console.error('VPN detection failed:', error);

      // Fallback: check for VPN mode header or cached result
      const fallbackResult = getCachedResult() || {
        isVPN: false,
        confidence: 'low' as const,
        indicators: ['Detection failed'],
        connectionType: 'direct' as const,
        hstsCompatible: isHSTSDisabled,
        certificateIssues: true,
      };

      setIsVPN(fallbackResult.isVPN);
      setConfidence(fallbackResult.confidence);
      setIndicators(fallbackResult.indicators);
      setConnectionType(fallbackResult.connectionType);

      return fallbackResult;
    } finally {
      setIsLoading(false);
    }
  }, [
    isVPNModeEnabled,
    isHSTSDisabled,
    opts.onVPNDetected,
    getCachedResult,
    setCachedResult,
  ]);

  // Perform health check
  const checkHealth = useCallback(async (): Promise<VPNHealthStatus> => {
    if (!opts.enableHealthCheck) {
      return {
        status: 'healthy',
        lastChecked: new Date(),
        recommendations: ['Health checking disabled'],
      };
    }

    setIsHealthChecking(true);

    try {
      const response = await fetch('/api/vpn-health', {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }

      const data = await response.json();

      const status: VPNHealthStatus = {
        status: data.status,
        lastChecked: new Date(),
        recommendations: data.recommendations || [],
        debugInfo: data.debug,
      };

      setHealthStatus(status);

      if (opts.onHealthChanged) {
        opts.onHealthChanged(status);
      }

      return status;
    } catch (error) {
      console.error('VPN health check failed:', error);

      const errorStatus: VPNHealthStatus = {
        status: 'error',
        lastChecked: new Date(),
        recommendations: ['Health check failed - please try again'],
      };

      setHealthStatus(errorStatus);
      return errorStatus;
    } finally {
      setIsHealthChecking(false);
    }
  }, [opts.enableHealthCheck, opts.onHealthChanged]);

  // Initialize
  useEffect(() => {
    if (!isVPNModeEnabled) return;

    // Try to load from cache first
    const cached = getCachedResult();
    if (cached) {
      setIsVPN(cached.isVPN);
      setConfidence(cached.confidence);
      setIndicators(cached.indicators);
      setConnectionType(cached.connectionType);
    }

    // Perform initial checks
    if (opts.enableAutoCheck) {
      checkVPN();
    }

    if (opts.enableHealthCheck) {
      checkHealth();
    }

    // Setup interval for periodic checks
    if (opts.enableAutoCheck && opts.checkInterval) {
      intervalRef.current = setInterval(() => {
        checkVPN();
        if (opts.enableHealthCheck) {
          checkHealth();
        }
      }, opts.checkInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [
    opts.enableAutoCheck,
    opts.enableHealthCheck,
    opts.checkInterval,
    isVPNModeEnabled,
    getCachedResult,
    checkVPN,
    checkHealth,
  ]);

  // Derived values
  const isCorporateNetwork =
    isVPN && confidence === 'high' && connectionType === 'corporate-vpn';
  const shouldShowNotification =
    isVPN && !localStorage.getItem('vpn-notification-dismissed');

  return {
    // Detection state
    isVPN,
    confidence,
    indicators,
    connectionType,

    // Health state
    healthStatus,

    // Loading states
    isLoading,
    isHealthChecking,

    // Actions
    checkVPN,
    checkHealth,
    clearCache,

    // Utilities
    isHSTSDisabled,
    isCorporateNetwork,
    shouldShowNotification,
  };
}

export default useVPNDetection;
