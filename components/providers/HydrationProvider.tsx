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
    // Only run on client-side
    if (typeof window === 'undefined') return;

    // Rehydrate all persisted stores
    const rehydrateStores = async () => {
      try {
        // Access the persist API and manually trigger rehydration
        await (useToolStore.persist as any)?.rehydrate?.();
        await (useCrontabStore.persist as any)?.rehydrate?.();

        // Mark stores as hydrated
        setIsHydrated(true);
      } catch (error) {
        console.error('Failed to rehydrate stores:', error);
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
