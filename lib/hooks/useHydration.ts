'use client';

import { useEffect, useState } from 'react';
import { useToolStore } from '@/lib/store/toolStore';
import { useCrontabStore } from '@/lib/stores/crontab-store';

/**
 * Hook to prevent hydration mismatch with Zustand persist store
 * Returns true when component is safely hydrated and can read persisted state
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Manually rehydrate Zustand stores from localStorage
    if (typeof window !== 'undefined') {
      // Rehydrate toolStore
      const toolStoreWithPersist = useToolStore as any;
      if (toolStoreWithPersist.persist?.rehydrate) {
        toolStoreWithPersist.persist.rehydrate();
      }

      // Rehydrate crontabStore
      const crontabStoreWithPersist = useCrontabStore as any;
      if (crontabStoreWithPersist.persist?.rehydrate) {
        crontabStoreWithPersist.persist.rehydrate();
      }
    }

    // Mark as hydrated after rehydration
    setIsHydrated(true);
  }, []);

  return isHydrated;
}
