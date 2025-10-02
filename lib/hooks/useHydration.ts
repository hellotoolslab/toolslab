'use client';

import { useEffect, useState } from 'react';
import { useToolStore } from '@/lib/store/toolStore';
import { useCrontabStore } from '@/lib/stores/crontab-store';

/**
 * Hook to prevent hydration mismatch with Zustand persist store
 * Manually rehydrates stores AFTER React hydration is complete
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Rehydrate stores only after mount (client-side only)
    const rehydrate = async () => {
      if (typeof window !== 'undefined') {
        // Rehydrate toolStore
        await (useToolStore.persist as any)?.rehydrate();

        // Rehydrate crontabStore
        await (useCrontabStore.persist as any)?.rehydrate();

        // Mark as hydrated
        setIsHydrated(true);
      }
    };

    rehydrate();
  }, []);

  return isHydrated;
}
