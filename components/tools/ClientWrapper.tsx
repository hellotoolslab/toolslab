'use client';

import { useEffect, useState } from 'react';

interface ClientWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * ClientWrapper Component
 *
 * Prevents React hydration mismatch errors by ensuring the component
 * only renders on the client-side after mount is complete.
 *
 * This is critical for components that use Zustand stores with persist
 * middleware, which access localStorage (not available during SSR).
 */
export function ClientWrapper({ children, fallback }: ClientWrapperProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark as client-side ready after mount
    // The stores will automatically hydrate from localStorage
    setIsClient(true);
  }, []);

  // During SSR or before mount, show fallback
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
