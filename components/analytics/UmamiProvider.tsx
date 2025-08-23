// components/analytics/UmamiProvider.tsx
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Umami tracking functions
declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: any) => void;
      identify: (data: any) => void;
    };
  }
}

// Custom event tracking functions
export const trackEvent = (
  eventName: string,
  eventData?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.umami) {
    window.umami.track(eventName, eventData);
  }
};

// Tool-specific tracking
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

// Conversion tracking
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

// Error tracking
export const trackError = (tool: string, error: string) => {
  trackEvent('error', {
    tool,
    error: error.substring(0, 100), // Limit error message length
    timestamp: Date.now(),
  });
};

// Performance tracking
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

interface UmamiProviderProps {
  children: React.ReactNode;
}

export function UmamiProvider({ children }: UmamiProviderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Load Umami script
    if (
      typeof window !== 'undefined' &&
      !document.getElementById('umami-script')
    ) {
      const script = document.createElement('script');
      script.id = 'umami-script';
      script.async = true;
      script.defer = true;
      script.src =
        process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL ||
        'https://cloud.umami.is/script.js';
      script.setAttribute(
        'data-website-id',
        process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || ''
      );

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
    // Track page view
    if (window.umami) {
      // Umami automatically tracks pageviews, but we can add custom data
      if (pathname.startsWith('/tools/')) {
        const toolName = pathname.split('/')[2];
        trackEvent('tool-view', {
          tool: toolName,
          referrer: document.referrer,
          query: searchParams.toString(),
        });
      }
    }
  }, [pathname, searchParams]);

  return <>{children}</>;
}

// Custom hook for using Umami in components
import { useCallback } from 'react';

export function useUmami() {
  const logEvent = useCallback(
    (
      eventName: string,
      eventData?: Record<string, string | number | boolean>
    ) => {
      trackEvent(eventName, eventData);
    },
    []
  );

  const logToolAction = useCallback(
    (
      tool: string,
      action: string,
      success: boolean,
      metadata?: Record<string, any>
    ) => {
      trackToolUsage(tool, action, {
        success,
        ...metadata,
      });
    },
    []
  );

  const logTiming = useCallback(
    (category: string, variable: string, time: number) => {
      trackEvent('timing', {
        category,
        variable,
        time,
      });
    },
    []
  );

  const logUserLevel = useCallback((level: string) => {
    if (window.umami) {
      window.umami.identify({ userLevel: level });
    }
  }, []);

  return {
    logEvent,
    logToolAction,
    logTiming,
    logUserLevel,
    trackConversion,
    trackError,
    trackPerformance,
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
