import { useCallback } from 'react';
import { labToasts } from '@/lib/utils/toasts';

/**
 * Hook per utilizzare facilmente le toast notifications in ToolsLab
 */
export function useLabToasts() {
  const showAddToLab = useCallback((name?: string) => {
    labToasts.addToLab(name);
  }, []);

  const showRemoveFromLab = useCallback((name?: string) => {
    labToasts.removeFromLab(name);
  }, []);

  const showWelcome = useCallback(() => {
    labToasts.welcomeToLab();
  }, []);

  const showLimitReached = useCallback(
    (type: 'tools' | 'categories', limit: number) => {
      labToasts.labLimitReached(type, limit);
    },
    []
  );

  const showError = useCallback((message: string) => {
    labToasts.error(message);
  }, []);

  const showInfo = useCallback((message: string, subtitle?: string) => {
    labToasts.info(message, subtitle);
  }, []);

  return {
    showAddToLab,
    showRemoveFromLab,
    showWelcome,
    showLimitReached,
    showError,
    showInfo,
    // Per accesso diretto se necessario
    labToasts,
  };
}
