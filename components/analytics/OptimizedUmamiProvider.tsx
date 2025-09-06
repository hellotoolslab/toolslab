'use client';

import { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import { BotDetector } from '@/lib/analytics/botDetection';
import { SessionTracker } from '@/lib/analytics/sessionTracker';

interface UmamiContextType {
  trackEvent: (name: string, data?: Record<string, any>) => void;
  trackPageView: (url?: string, referrer?: string) => void;
  logToolAction: (
    tool: string,
    action: string,
    success: boolean,
    metadata?: any
  ) => void;
  trackPerformance: (tool: string, action: string, duration: number) => void;
  trackConversion: (type: string, value?: number | string) => void;
  isTrackingEnabled: boolean;
  // Backward compatibility methods
  trackToolUse: (tool: string, action: string, metadata?: any) => void;
  trackEngagement: (action: string, metadata?: any) => void;
  track: (event: string, data?: any) => void;
  trackFavorite: (id: string, type: string, isFavorited: boolean) => void;
  trackSocial: (platform: string, from?: string) => void;
}

const UmamiContext = createContext<UmamiContextType | null>(null);

interface UmamiProviderProps {
  children: ReactNode;
  websiteId?: string;
  scriptUrl?: string;
  enabled?: boolean;
}

export function OptimizedUmamiProvider({
  children,
  websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
  scriptUrl = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL,
  enabled = process.env.NODE_ENV === 'production',
}: UmamiProviderProps) {
  const botDetector = useRef(new BotDetector());
  const sessionTracker = useRef(new SessionTracker());
  const scriptLoaded = useRef(false);
  const isBot = useRef(false);

  useEffect(() => {
    if (!enabled || !websiteId || !scriptUrl) return;

    // Detect if this is a bot
    const detection = botDetector.current.detectBot(
      navigator.userAgent,
      document.referrer,
      window.location.href
    );

    isBot.current = detection.isBot;

    if (detection.isBot) {
      console.debug('Bot detected, analytics disabled:', detection.reason);
      return;
    }

    // Load Umami script only for real users
    loadUmamiScript();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, websiteId, scriptUrl]);

  const loadUmamiScript = () => {
    if (scriptLoaded.current) return;

    const script = document.createElement('script');
    script.src = scriptUrl!;
    script.defer = true;
    script.setAttribute('data-website-id', websiteId!);
    script.setAttribute('data-auto-track', 'false'); // Manual tracking only

    script.onload = () => {
      scriptLoaded.current = true;
      console.debug('Umami Analytics loaded');
    };

    document.head.appendChild(script);
  };

  const shouldTrack = (): boolean => {
    return (
      enabled &&
      !isBot.current &&
      scriptLoaded.current &&
      sessionTracker.current.shouldTrack() &&
      typeof window !== 'undefined' &&
      typeof (window as any).umami !== 'undefined'
    );
  };

  const trackEvent = (name: string, data?: Record<string, any>) => {
    if (!shouldTrack()) return;

    try {
      sessionTracker.current.incrementEvent();

      const eventData = {
        ...data,
        timestamp: Date.now(),
        sessionId: sessionTracker.current.getSessionData().sessionId,
        userAgent: navigator.userAgent.slice(0, 200), // Truncate for privacy
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };

      (window as any).umami.track(name, eventData);

      if (process.env.NODE_ENV === 'development') {
        console.debug('Event tracked:', name, eventData);
      }
    } catch (error) {
      console.error('Umami tracking error:', error);
    }
  };

  const trackPageView = (url?: string, referrer?: string) => {
    if (!shouldTrack()) return;

    try {
      sessionTracker.current.incrementPageView();

      const pageData = {
        url: url || window.location.pathname,
        referrer: referrer || document.referrer,
        title: document.title,
        timestamp: Date.now(),
        sessionId: sessionTracker.current.getSessionData().sessionId,
      };

      (window as any).umami.track('pageview', pageData);

      if (process.env.NODE_ENV === 'development') {
        console.debug('Page view tracked:', pageData);
      }
    } catch (error) {
      console.error('Umami page tracking error:', error);
    }
  };

  const logToolAction = (
    tool: string,
    action: string,
    success: boolean,
    metadata?: any
  ) => {
    trackEvent('tool-action', {
      tool,
      action,
      success,
      ...metadata,
    });
  };

  const trackPerformance = (tool: string, action: string, duration: number) => {
    // Only track if performance is reasonable (not bot-like)
    if (duration < 50 || duration > 30000) return;

    trackEvent('tool-performance', {
      tool,
      action,
      duration,
      performanceLevel:
        duration < 500 ? 'fast' : duration < 2000 ? 'normal' : 'slow',
    });
  };

  const trackConversion = (type: string, value?: number | string) => {
    trackEvent('conversion', {
      type,
      value: typeof value === 'string' ? value : value,
      sessionDuration:
        Date.now() - sessionTracker.current.getSessionData().startTime,
    });
  };

  // Backward compatibility methods
  const trackToolUse = (tool: string, action: string, metadata?: any) => {
    // Map old trackToolUse to new logToolAction
    logToolAction(tool, action, true, metadata);
  };

  const trackEngagement = (action: string, metadata?: any) => {
    trackEvent('engagement', {
      action,
      ...metadata,
    });
  };

  const track = (event: string, data?: any) => {
    trackEvent(event, data);
  };

  const trackFavorite = (id: string, type: string, isFavorited: boolean) => {
    trackEvent(isFavorited ? `${type}-favorited` : `${type}-unfavorited`, {
      [`${type}_id`]: id,
      timestamp: Date.now(),
    });
  };

  const trackSocial = (platform: string, from?: string) => {
    trackEvent(`social-${platform}-clicked`, {
      from: from || 'unknown',
      timestamp: Date.now(),
    });
  };

  const contextValue: UmamiContextType = {
    trackEvent,
    trackPageView,
    logToolAction,
    trackPerformance,
    trackConversion,
    isTrackingEnabled: shouldTrack(),
    // Backward compatibility
    trackToolUse,
    trackEngagement,
    track,
    trackFavorite,
    trackSocial,
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
    // Return no-op functions if provider not found
    return {
      trackEvent: () => {},
      trackPageView: () => {},
      logToolAction: () => {},
      trackPerformance: () => {},
      trackConversion: () => {},
      isTrackingEnabled: false,
      // Backward compatibility
      trackToolUse: () => {},
      trackEngagement: () => {},
      track: () => {},
      trackFavorite: () => {},
      trackSocial: () => {},
    };
  }
  return context;
}
