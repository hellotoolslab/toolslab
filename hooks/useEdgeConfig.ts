/**
 * Hook for accessing Edge Config in React components
 */

import { useEffect, useState } from 'react';
import { EdgeConfigSchema } from '@/lib/edge-config/types';
import { DEFAULT_EDGE_CONFIG } from '@/lib/edge-config/defaults';

interface UseEdgeConfigReturn {
  config: EdgeConfigSchema;
  loading: boolean;
  error: Error | null;
}

export function useEdgeConfig(): UseEdgeConfigReturn {
  const [config, setConfig] = useState<EdgeConfigSchema>(DEFAULT_EDGE_CONFIG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchConfig() {
      try {
        setLoading(true);

        // Fetch from API endpoint with no cache
        const response = await fetch('/api/edge-config', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch config: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.success && data.data) {
          setConfig(data.data);
        } else {
          // Use fallback if API returns an error
          setConfig(data.fallback || DEFAULT_EDGE_CONFIG);
        }
      } catch (err) {
        console.error('Failed to fetch Edge Config:', err);
        setError(err as Error);
        // Use default config on error
        setConfig(DEFAULT_EDGE_CONFIG);
      } finally {
        setLoading(false);
      }
    }

    fetchConfig();
  }, []);

  return { config, loading, error };
}

/**
 * Hook for accessing specific feature flags
 */
export function useFeatureFlag(
  flag: keyof EdgeConfigSchema['features']
): boolean {
  const { config } = useEdgeConfig();

  const value = config.features[flag];

  // Handle experiments object differently
  if (flag === 'experiments') {
    return false; // Return false for experiments object itself
  }

  return (value as boolean) ?? false;
}
