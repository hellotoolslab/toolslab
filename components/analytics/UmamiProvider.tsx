'use client';

import { createContext, useContext, useEffect, useRef, ReactNode } from 'react';

interface UmamiContextType {
  track: (event: string, data?: any) => void;
  trackToolUse: (tool: string, action: string, metadata?: any) => void;
  trackFavorite: (id: string, type: string, isFavorited: boolean) => void;
  trackSocial: (platform: string, from?: string) => void;
  trackEngagement: (action: string, metadata?: any) => void;
  trackConversion: (type: string, value?: number | string) => void;
  isEnabled: boolean;
}

const UmamiContext = createContext<UmamiContextType | null>(null);

interface UmamiProviderProps {
  children: ReactNode;
}

export function UmamiProvider({ children }: UmamiProviderProps) {
  const scriptLoaded = useRef(false);
  const initAttempted = useRef(false);

  // Get config from environment
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const scriptUrl =
    process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL ||
    (process.env.NEXT_PUBLIC_UMAMI_HOST_URL
      ? `${process.env.NEXT_PUBLIC_UMAMI_HOST_URL}/script.js`
      : null);

  // Enable in production OR when debug is enabled
  const isEnabled =
    process.env.NODE_ENV === 'production' ||
    process.env.NEXT_PUBLIC_UMAMI_DEBUG === 'true';

  useEffect(() => {
    console.log('🔍 Umami Init:', {
      enabled: isEnabled,
      websiteId: websiteId ? 'SET' : 'MISSING',
      scriptUrl: scriptUrl || 'MISSING',
      nodeEnv: process.env.NODE_ENV,
      debug: process.env.NEXT_PUBLIC_UMAMI_DEBUG,
    });

    if (initAttempted.current) return;
    initAttempted.current = true;

    if (!isEnabled || !websiteId || !scriptUrl) {
      console.warn('⚠️ Umami not loaded - missing config');
      return;
    }

    // Load script
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.defer = true;
    script.setAttribute('data-website-id', websiteId);
    // Disable auto-tracking - we handle all tracking manually
    // This prevents duplicate pageviews and gives us full control over event data
    script.setAttribute('data-auto-track', 'false');

    script.onload = () => {
      scriptLoaded.current = true;
      console.log('✅ Umami loaded successfully');

      // Test if umami is available
      if (typeof (window as any).umami !== 'undefined') {
        console.log('✅ Umami object available');
      } else {
        console.error('❌ Umami object not found after script load');
      }
    };

    script.onerror = (error) => {
      console.error('❌ Umami script failed to load:', error);
    };

    document.head.appendChild(script);
  }, [isEnabled, websiteId, scriptUrl]);

  const shouldTrack = (): boolean => {
    return (
      isEnabled &&
      scriptLoaded.current &&
      typeof window !== 'undefined' &&
      typeof (window as any).umami !== 'undefined'
    );
  };

  const track = (event: string, data?: any) => {
    if (!shouldTrack()) {
      console.debug('🔇 Umami tracking skipped:', event, data);
      return;
    }

    try {
      (window as any).umami.track(event, data);
      console.log('📊 Umami tracked:', event, data);
    } catch (error) {
      console.error('❌ Umami tracking error:', error);
    }
  };

  const trackToolUse = (tool: string, action: string, metadata?: any) => {
    track('tool-use', {
      tool,
      action,
      success: true,
      timestamp: Date.now(),
      ...metadata,
    });
  };

  const trackFavorite = (id: string, type: string, isFavorited: boolean) => {
    track(isFavorited ? `${type}-favorited` : `${type}-unfavorited`, {
      [`${type}_id`]: id,
      timestamp: Date.now(),
    });
  };

  const trackSocial = (platform: string, from?: string) => {
    track(`social-${platform}-clicked`, {
      from: from || 'unknown',
      timestamp: Date.now(),
    });
  };

  const trackEngagement = (action: string, metadata?: any) => {
    track('engagement', {
      action,
      timestamp: Date.now(),
      ...metadata,
    });
  };

  const trackConversion = (type: string, value?: number | string) => {
    track('conversion', {
      type,
      value,
      timestamp: Date.now(),
    });
  };

  const contextValue: UmamiContextType = {
    track,
    trackToolUse,
    trackFavorite,
    trackSocial,
    trackEngagement,
    trackConversion,
    isEnabled: shouldTrack(),
  };

  return (
    <UmamiContext.Provider value={contextValue}>
      {children}
    </UmamiContext.Provider>
  );
}

export function useUmami(): UmamiContextType {
  const context = useContext(UmamiContext);

  if (!context) {
    // Return no-op functions if context not available
    return {
      track: () => {},
      trackToolUse: () => {},
      trackFavorite: () => {},
      trackSocial: () => {},
      trackEngagement: () => {},
      trackConversion: () => {},
      isEnabled: false,
    };
  }

  return context;
}
