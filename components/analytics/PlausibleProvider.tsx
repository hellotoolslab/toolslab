// components/analytics/PlausibleProvider.tsx
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Plausible from 'plausible-tracker';

// Initialize Plausible
const plausible = Plausible({
  domain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || 'toolslab.dev',
  apiHost: process.env.NEXT_PUBLIC_PLAUSIBLE_API_HOST || 'https://plausible.io',
  trackLocalhost: process.env.NODE_ENV === 'development',
});

// Export for use in other components
export const trackEvent = plausible.trackEvent;

// Custom events for OctoTools
export const trackToolUsage = (
  toolName: string,
  action: string,
  props?: Record<string, any>
) => {
  trackEvent('Tool Usage', {
    props: {
      tool: toolName,
      action: action,
      ...props,
    },
  });
};

export const trackConversion = (
  type: 'donation' | 'pro_signup' | 'tool_chain',
  value?: number
) => {
  trackEvent('Conversion', {
    props: {
      type,
      value: value?.toString() || '0',
    },
  });
};

export const trackError = (tool: string, error: string) => {
  trackEvent('Error', {
    props: {
      tool,
      error: error.substring(0, 100), // Limit error message length
    },
  });
};

interface PlausibleProviderProps {
  children: React.ReactNode;
}

export function PlausibleProvider({ children }: PlausibleProviderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track pageviews on route change
  useEffect(() => {
    // Enable automatic pageview tracking
    plausible.enableAutoPageviews();

    // Track initial pageview
    plausible.trackPageview();
  }, []);

  // Track route changes
  useEffect(() => {
    plausible.trackPageview();

    // Track specific tool views
    if (pathname.startsWith('/tools/')) {
      const toolName = pathname.split('/')[2];
      trackEvent('Tool View', {
        props: {
          tool: toolName,
          referrer: document.referrer,
        },
      });
    }
  }, [pathname, searchParams]);

  return <>{children}</>;
}

// Hook for tracking in components
import { useCallback } from 'react';

export function usePlausible() {
  const logEvent = useCallback(
    (eventName: string, props?: Record<string, string | number | boolean>) => {
      trackEvent(eventName, { props });
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
        success: success.toString(),
        ...metadata,
      });
    },
    []
  );

  const logTiming = useCallback(
    (category: string, variable: string, time: number) => {
      trackEvent('Timing', {
        props: {
          category,
          variable,
          time: time.toString(),
        },
      });
    },
    []
  );

  return {
    logEvent,
    logToolAction,
    logTiming,
    trackConversion,
    trackError,
  };
}

// Metrics Dashboard Component (Admin only)
export function MetricsDashboard() {
  // This would typically fetch from Plausible API
  // For now, it's a placeholder showing how to structure it

  return (
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard title="Page Views" value="--" change="+0%" period="Today" />
      <MetricCard
        title="Unique Visitors"
        value="--"
        change="+0%"
        period="Today"
      />
      <MetricCard title="Tool Usage" value="--" change="+0%" period="Today" />
      <MetricCard title="Conversions" value="--" change="+0%" period="Today" />
    </div>
  );
}

function MetricCard({
  title,
  value,
  change,
  period,
}: {
  title: string;
  value: string;
  change: string;
  period: string;
}) {
  const isPositive = change.startsWith('+');

  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </h3>
        <span className="text-xs text-gray-400">{period}</span>
      </div>
      <div className="flex items-end justify-between">
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
