/**
 * React Hook for Edge Config Tool Management
 * Provides client-side access to tool configurations with caching and error handling
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ToolConfig,
  CategoryConfig,
  ToolConfigOptions,
} from '@/lib/edge-config/types';

interface UseToolConfigOptions extends ToolConfigOptions {
  /** Enable automatic refetching */
  autoRefresh?: boolean;
  /** Refresh interval in milliseconds */
  refreshInterval?: number;
  /** Enable optimistic updates */
  optimistic?: boolean;
}

interface UseToolConfigResult {
  /** Tool configurations */
  tools: ToolConfig[];
  /** Category configurations */
  categories: CategoryConfig[];
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: string | null;
  /** Refetch data manually */
  refetch: () => Promise<void>;
  /** Clear error state */
  clearError: () => void;
  /** Last update timestamp */
  lastUpdated: Date | null;
  /** Data source */
  source: 'api' | 'cache' | 'fallback';
}

interface CachedData {
  tools: ToolConfig[];
  categories: CategoryConfig[];
  timestamp: number;
  source: 'api' | 'cache' | 'fallback';
}

// Client-side cache
const cache = new Map<string, CachedData>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Generates cache key from options
 */
function getCacheKey(options: UseToolConfigOptions): string {
  const key = {
    enabled: options.enabled,
    featured: options.featured,
    category: options.category,
    limit: options.limit,
    sortBy: options.sortBy,
    sortDirection: options.sortDirection,
    includeDisabled: options.includeDisabled,
  };

  return JSON.stringify(key);
}

/**
 * Checks if cached data is still valid
 */
function isCacheValid(data: CachedData): boolean {
  return Date.now() - data.timestamp < CACHE_TTL;
}

/**
 * React Hook for accessing tool configurations
 */
export function useToolConfig(
  options: UseToolConfigOptions = {}
): UseToolConfigResult {
  const [tools, setTools] = useState<ToolConfig[]>([]);
  const [categories, setCategories] = useState<CategoryConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [source, setSource] = useState<'api' | 'cache' | 'fallback'>('api');

  const cacheKey = useMemo(() => getCacheKey(options), [options]);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check cache first
      const cachedData = cache.get(cacheKey);
      if (cachedData && isCacheValid(cachedData)) {
        setTools(cachedData.tools);
        setCategories(cachedData.categories);
        setLastUpdated(new Date(cachedData.timestamp));
        setSource(cachedData.source);
        setIsLoading(false);
        return;
      }

      // Fetch from API
      const searchParams = new URLSearchParams();

      if (options.enabled !== undefined)
        searchParams.set('enabled', String(options.enabled));
      if (options.featured !== undefined)
        searchParams.set('featured', String(options.featured));
      if (options.category) searchParams.set('category', options.category);
      if (options.limit) searchParams.set('limit', String(options.limit));
      if (options.sortBy) searchParams.set('sortBy', options.sortBy);
      if (options.sortDirection)
        searchParams.set('sortDirection', options.sortDirection);
      if (options.includeDisabled)
        searchParams.set('includeDisabled', String(options.includeDisabled));

      const response = await fetch(
        `/api/tools/config?${searchParams.toString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch tool configuration');
      }

      // Update state
      setTools(data.tools);
      setCategories(data.categories);
      setLastUpdated(new Date());
      setSource(data.source || 'api');

      // Update cache
      cache.set(cacheKey, {
        tools: data.tools,
        categories: data.categories,
        timestamp: Date.now(),
        source: data.source || 'api',
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('useToolConfig error:', err);

      // Try to use stale cache data as fallback
      const staleData = cache.get(cacheKey);
      if (staleData) {
        setTools(staleData.tools);
        setCategories(staleData.categories);
        setLastUpdated(new Date(staleData.timestamp));
        setSource('cache');
      }
    } finally {
      setIsLoading(false);
    }
  }, [cacheKey, options]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!options.autoRefresh || !options.refreshInterval) {
      return;
    }

    const interval = setInterval(() => {
      // Only refresh if not currently loading and no error
      if (!isLoading && !error) {
        fetchData();
      }
    }, options.refreshInterval);

    return () => clearInterval(interval);
  }, [
    options.autoRefresh,
    options.refreshInterval,
    isLoading,
    error,
    fetchData,
  ]);

  return {
    tools,
    categories,
    isLoading,
    error,
    refetch: fetchData,
    clearError,
    lastUpdated,
    source,
  };
}

/**
 * Hook for getting a single tool by slug
 */
export function useTool(slug: string): {
  tool: ToolConfig | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const [tool, setTool] = useState<ToolConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTool = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/tools/${slug}`);

      if (!response.ok) {
        if (response.status === 404) {
          setTool(null);
          setIsLoading(false);
          return;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch tool');
      }

      setTool(data.tool);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('useTool error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchTool();
    }
  }, [slug, fetchTool]);

  return {
    tool,
    isLoading,
    error,
    refetch: fetchTool,
  };
}

/**
 * Hook for searching tools
 */
export function useToolSearch(
  query: string,
  limit: number = 10
): {
  results: ToolConfig[];
  isLoading: boolean;
  error: string | null;
  search: (newQuery: string) => void;
} {
  const [results, setResults] = useState<ToolConfig[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState(query);

  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const searchParams = new URLSearchParams({
          q: searchQuery,
          limit: String(limit),
        });

        const response = await fetch(
          `/api/tools/search?${searchParams.toString()}`
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Search failed');
        }

        setResults(data.results);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Search error occurred';
        setError(errorMessage);
        console.error('useToolSearch error:', err);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [limit]
  );

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(currentQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [currentQuery, performSearch]);

  const search = useCallback((newQuery: string) => {
    setCurrentQuery(newQuery);
  }, []);

  return {
    results,
    isLoading,
    error,
    search,
  };
}

/**
 * Hook for getting tool access permissions
 */
export function useToolAccess(
  toolSlug: string,
  userPlan: { type: 'free' | 'pro' } = { type: 'free' }
): {
  canAccess: boolean;
  reason?: string;
  message?: string;
  isLoading: boolean;
  error: string | null;
} {
  const [accessResult, setAccessResult] = useState<{
    canAccess: boolean;
    reason?: string;
    message?: string;
  }>({ canAccess: true });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/tools/${toolSlug}/access`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userPlan }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Access check failed');
        }

        setAccessResult(data.access);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Access check error';
        setError(errorMessage);
        // Default to no access on error
        setAccessResult({
          canAccess: false,
          reason: 'error',
          message: 'Unable to verify access permissions',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (toolSlug) {
      checkAccess();
    }
  }, [toolSlug, userPlan]);

  return {
    ...accessResult,
    isLoading,
    error,
  };
}
