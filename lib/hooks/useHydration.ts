'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to prevent hydration mismatch with Zustand persist store
 * Returns true when component is safely hydrated and can read persisted state
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Mark as hydrated after component mounts
    setIsHydrated(true);
  }, []);

  return isHydrated;
}
