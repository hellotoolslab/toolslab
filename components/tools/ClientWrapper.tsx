'use client';

import { useEffect, useState } from 'react';
import { useToolStore } from '@/lib/store/toolStore';
import { useCrontabStore } from '@/lib/stores/crontab-store';

interface ClientWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * ClientWrapper Component
 *
 * Prevents React hydration mismatch errors by ensuring the component
 * only renders on the client-side after hydration is complete.
 *
 * This is critical for components that use Zustand stores with persist
 * middleware, which access localStorage (not available during SSR).
 */
export function ClientWrapper({ children, fallback }: ClientWrapperProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Manually rehydrate Zustand stores after mount
    if (typeof window !== 'undefined') {
      // Rehydrate toolStore
      if (
        'persist' in useToolStore &&
        typeof (useToolStore as any).persist?.rehydrate === 'function'
      ) {
        (useToolStore as any).persist.rehydrate();
      }

      // Rehydrate crontabStore
      if (
        'persist' in useCrontabStore &&
        typeof (useCrontabStore as any).persist?.rehydrate === 'function'
      ) {
        (useCrontabStore as any).persist.rehydrate();
      }
    }

    // Mark as client-side ready
    setIsClient(true);
  }, []);

  // During SSR or before hydration, show fallback
  if (!isClient) {
    return (
      <>
        {fallback || (
          <div className="mx-auto w-full max-w-6xl">
            <div className="animate-pulse space-y-4">
              <div className="h-12 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-64 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-32 rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Client-side: render the actual content
  return <>{children}</>;
}
