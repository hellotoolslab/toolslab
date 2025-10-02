'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to prevent hydration mismatch with Zustand persist store
 * Returns true only when component is mounted on client
 * This ensures we don't render store-dependent content during SSR
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Mark as hydrated only after client mount
    // This prevents hydration mismatches by ensuring
    // server and initial client render are identical
    setIsHydrated(true);
  }, []);

  return isHydrated;
}
