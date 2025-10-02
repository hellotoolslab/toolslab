'use client';

import { useEffect, useState } from 'react';
import { useToolStore } from '@/lib/store/toolStore';
import { useCrontabStore } from '@/lib/stores/crontab-store';

/**
 * HydrationProvider
 *
 * Ensures Zustand stores are rehydrated AFTER React hydration completes.
 * This prevents hydration mismatch errors by ensuring server and client
 * render with the same initial state (default values).
 *
 * The rehydration happens in useEffect, which runs AFTER the first render,
 * so React's hydration validation passes successfully.
 */
export function HydrationProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    console.log('[HydrationProvider] useEffect started');
    console.log('[HydrationProvider] typeof window:', typeof window);

    // Only run on client-side
    if (typeof window === 'undefined') {
      console.log('[HydrationProvider] Running on server, skipping');
      return;
    }

    console.log('[HydrationProvider] Running on client, starting rehydration');

    // Rehydrate all persisted stores
    const rehydrateStores = async () => {
      try {
        console.log(
          '[HydrationProvider] toolStore.persist exists?',
          !!(useToolStore.persist as any)
        );
        console.log(
          '[HydrationProvider] toolStore.persist.rehydrate exists?',
          !!(useToolStore.persist as any)?.rehydrate
        );

        // Access the persist API and manually trigger rehydration
        console.log(
          '[HydrationProvider] Calling toolStore.persist.rehydrate()'
        );
        await (useToolStore.persist as any)?.rehydrate?.();
        console.log('[HydrationProvider] toolStore rehydrated');

        console.log(
          '[HydrationProvider] Calling crontabStore.persist.rehydrate()'
        );
        await (useCrontabStore.persist as any)?.rehydrate?.();
        console.log('[HydrationProvider] crontabStore rehydrated');

        // Check store state after rehydration
        const toolState = useToolStore.getState();
        console.log('[HydrationProvider] toolStore state after rehydration:', {
          favoriteTools: toolState.favoriteTools,
          historyCount: toolState.history.length,
        });

        // Mark stores as hydrated
        setIsHydrated(true);
        console.log(
          '[HydrationProvider] Rehydration complete, isHydrated = true'
        );
      } catch (error) {
        console.error('[HydrationProvider] Failed to rehydrate stores:', error);
        // Still mark as hydrated to prevent infinite loading
        setIsHydrated(true);
      }
    };

    rehydrateStores();
  }, []);

  // Always render children immediately
  // The stores will update after rehydration completes
  return <>{children}</>;
}
