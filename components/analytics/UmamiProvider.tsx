'use client';

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  Suspense,
} from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

interface UmamiWindow extends Window {
  umami?: {
    track: (event: string, data?: Record<string, any>) => void;
    identify: (data: any) => void;
  };
}

interface UmamiContextType {
  track: (event: string, data?: Record<string, any>) => void;
  trackToolUse: (
    tool: string,
    action: string,
    metadata?: Record<string, any>
  ) => void;
  trackFavorite: (
    type: 'tool' | 'category',
    id: string,
    isFavorited: boolean
  ) => void;
  trackSocial: (platform: 'twitter' | 'github', from?: string) => void;
  trackConversion: (type: 'donation' | 'pro-signup', from?: string) => void;
  trackError: (
    tool: string,
    error: string,
    severity?: 'low' | 'medium' | 'high'
  ) => void;
  trackPerformance: (tool: string, action: string, duration: number) => void;
  trackEngagement: (action: string, metadata?: Record<string, any>) => void;
}

const UmamiContext = createContext<UmamiContextType | null>(null);

// Legacy functions for backward compatibility
export const trackEvent = (
  eventName: string,
  eventData?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && (window as UmamiWindow).umami) {
    (window as UmamiWindow).umami!.track(eventName, eventData);
  }

  // Always log in development OR if UMAMI_DEBUG is enabled
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NEXT_PUBLIC_UMAMI_DEBUG === 'true'
  ) {
    console.group(`📊 Umami Event: ${eventName}`);
    console.log('📅 Time:', new Date().toISOString());
    console.log('📍 Event:', eventName);
    console.log('📋 Data:', eventData || 'No data');
    console.log(
      '🌍 URL:',
      typeof window !== 'undefined' ? window.location.href : 'SSR'
    );
    console.log(
      '👤 User Agent:',
      typeof navigator !== 'undefined'
        ? navigator.userAgent.substring(0, 50) + '...'
        : 'SSR'
    );
    console.groupEnd();
  }
};

export const trackToolUsage = (
  toolName: string,
  action: string,
  props?: Record<string, any>
) => {
  trackEvent(`tool-${action}`, {
    tool: toolName,
    ...props,
  });
};

export const trackConversion = (
  type: 'donation' | 'pro_signup' | 'tool_chain',
  value?: number
) => {
  trackEvent('conversion', {
    type,
    value,
    timestamp: Date.now(),
  });
};

export const trackError = (tool: string, error: string) => {
  trackEvent('error', {
    tool,
    error: error.substring(0, 100),
    timestamp: Date.now(),
  });
};

export const trackPerformance = (
  tool: string,
  action: string,
  duration: number
) => {
  trackEvent('performance', {
    tool,
    action,
    duration,
    timestamp: Date.now(),
  });
};

function UmamiProviderInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Load Umami script
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      !document.getElementById('umami-script')
    ) {
      const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
      const scriptUrl =
        process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL ||
        'https://cloud.umami.is/script.js';

      if (!websiteId) {
        return;
      }

      const script = document.createElement('script');
      script.id = 'umami-script';
      script.async = true;
      script.defer = true;
      script.src = scriptUrl;
      script.setAttribute('data-website-id', websiteId);

      // Optional: Self-hosted Umami settings
      if (process.env.NEXT_PUBLIC_UMAMI_DOMAINS) {
        script.setAttribute(
          'data-domains',
          process.env.NEXT_PUBLIC_UMAMI_DOMAINS
        );
      }

      // Optional: Disable auto-track for more control
      if (process.env.NEXT_PUBLIC_UMAMI_AUTO_TRACK === 'false') {
        script.setAttribute('data-auto-track', 'false');
      }

      // Optional: Custom data attributes
      script.setAttribute('data-cache', 'true');
      script.setAttribute(
        'data-host-url',
        process.env.NEXT_PUBLIC_UMAMI_HOST_URL || 'https://cloud.umami.is'
      );

      document.head.appendChild(script);
    }
  }, []);

  // Track route changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && (window as UmamiWindow).umami) {
        // Track tool page views
        if (pathname.startsWith('/tools/')) {
          const toolName = pathname.split('/')[2];
          trackEvent('tool-view', {
            tool: toolName,
            referrer: document.referrer,
            query: searchParams.toString(),
          });
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  // Context provider methods
  const track = useCallback((event: string, data?: Record<string, any>) => {
    trackEvent(event, data);
  }, []);

  const trackToolUse = useCallback(
    (tool: string, action: string, metadata?: Record<string, any>) => {
      trackEvent('tool-used', {
        tool,
        action,
        timestamp: Date.now(),
        ...metadata,
      });
    },
    []
  );

  const trackFavorite = useCallback(
    (type: 'tool' | 'category', id: string, isFavorited: boolean) => {
      trackEvent(isFavorited ? `${type}-favorited` : `${type}-unfavorited`, {
        [`${type}_id`]: id,
        timestamp: Date.now(),
      });
    },
    []
  );

  const trackSocial = useCallback(
    (platform: 'twitter' | 'github', from?: string) => {
      trackEvent(`social-${platform}-clicked`, {
        from: from || 'unknown',
        timestamp: Date.now(),
      });
    },
    []
  );

  const trackConversionNew = useCallback(
    (type: 'donation' | 'pro-signup', from?: string) => {
      trackEvent(`conversion-${type}`, {
        from: from || 'unknown',
        timestamp: Date.now(),
      });
    },
    []
  );

  const trackErrorNew = useCallback(
    (
      tool: string,
      error: string,
      severity: 'low' | 'medium' | 'high' = 'low'
    ) => {
      trackEvent('tool-error', {
        tool,
        error,
        severity,
        timestamp: Date.now(),
      });
    },
    []
  );

  const trackPerformanceNew = useCallback(
    (tool: string, action: string, duration: number) => {
      trackEvent('tool-performance', {
        tool,
        action,
        duration_ms: duration,
        timestamp: Date.now(),
      });
    },
    []
  );

  const trackEngagement = useCallback(
    (action: string, metadata?: Record<string, any>) => {
      trackEvent(`engagement-${action}`, {
        timestamp: Date.now(),
        ...metadata,
      });
    },
    []
  );

  return (
    <UmamiContext.Provider
      value={{
        track,
        trackToolUse,
        trackFavorite,
        trackSocial,
        trackConversion: trackConversionNew,
        trackError: trackErrorNew,
        trackPerformance: trackPerformanceNew,
        trackEngagement,
      }}
    >
      {children}
    </UmamiContext.Provider>
  );
}

// Wrapper with Suspense boundary for SSG compatibility
export function UmamiProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>{children}</div>}>
      <UmamiProviderInner>{children}</UmamiProviderInner>
    </Suspense>
  );
}

// Custom hook for using Umami in components
export function useUmami() {
  const context = useContext(UmamiContext);

  // Legacy methods for backward compatibility - always define hooks
  const logEvent = useCallback(
    (
      eventName: string,
      eventData?: Record<string, string | number | boolean>
    ) => {
      if (context) {
        context.track(eventName, eventData);
      }
    },
    [context]
  );

  const logToolAction = useCallback(
    (
      tool: string,
      action: string,
      success: boolean,
      metadata?: Record<string, any>
    ) => {
      if (context) {
        context.trackToolUse(tool, action, {
          success,
          ...metadata,
        });
      }
    },
    [context]
  );

  const logTiming = useCallback(
    (category: string, variable: string, time: number) => {
      if (context) {
        context.track('timing', {
          category,
          variable,
          time,
        });
      }
    },
    [context]
  );

  const logUserLevel = useCallback((level: string) => {
    if (typeof window !== 'undefined' && (window as UmamiWindow).umami) {
      (window as UmamiWindow).umami!.identify({ userLevel: level });
    }
  }, []);

  if (!context) {
    // Return no-op functions if context not available
    return {
      track: () => {},
      trackToolUse: () => {},
      trackFavorite: () => {},
      trackSocial: () => {},
      trackConversion: () => {},
      trackError: () => {},
      trackPerformance: () => {},
      trackEngagement: () => {},
      // Legacy methods for backward compatibility
      logEvent,
      logToolAction,
      logTiming,
      logUserLevel,
    };
  }

  return {
    ...context,
    // Legacy methods for backward compatibility
    logEvent,
    logToolAction,
    logTiming,
    logUserLevel,
  };
}

// Admin Dashboard Component (reads from Umami API)
export function UmamiDashboard() {
  // This component would fetch data from Umami API
  // For self-hosted: your-umami-instance.com/api
  // For cloud: analytics.umami.is/api

  return (
    <div className="rounded-lg bg-white p-6 dark:bg-gray-800">
      <h2 className="mb-6 text-2xl font-bold">Analytics Dashboard</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Page Views"
          value="--"
          change="+0%"
          period="Today"
          icon="👁"
        />
        <MetricCard
          title="Unique Visitors"
          value="--"
          change="+0%"
          period="Today"
          icon="👤"
        />
        <MetricCard
          title="Tool Usage"
          value="--"
          change="+0%"
          period="Today"
          icon="🔧"
        />
        <MetricCard
          title="Avg. Duration"
          value="--"
          change="+0%"
          period="Today"
          icon="⏱"
        />
      </div>

      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold">Top Tools Today</h3>
        <div className="space-y-2">
          <ToolStat name="JSON Formatter" usage={0} percentage={0} />
          <ToolStat name="Base64 Decoder" usage={0} percentage={0} />
          <ToolStat name="JWT Decoder" usage={0} percentage={0} />
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-500">
        <p>
          View full analytics at:
          <a
            href={process.env.NEXT_PUBLIC_UMAMI_DASHBOARD_URL || '#'}
            className="ml-1 text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Umami Dashboard →
          </a>
        </p>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  change,
  period,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  period: string;
  icon: string;
}) {
  const isPositive = change.startsWith('+');

  return (
    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {period}
        </span>
      </div>
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
        {title}
      </h3>
      <div className="mt-2 flex items-end justify-between">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </span>
        <span
          className={`text-sm font-medium ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {change}
        </span>
      </div>
    </div>
  );
}

function ToolStat({
  name,
  usage,
  percentage,
}: {
  name: string;
  usage: number;
  percentage: number;
}) {
  return (
    <div className="flex items-center justify-between rounded bg-gray-50 p-3 dark:bg-gray-700">
      <span className="text-sm font-medium">{name}</span>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {usage} uses
        </span>
        <div className="h-2 w-20 rounded-full bg-gray-200 dark:bg-gray-600">
          <div
            className="h-2 rounded-full bg-blue-500 transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="w-10 text-right text-xs text-gray-500">
          {percentage}%
        </span>
      </div>
    </div>
  );
}
