/**
 * Vercel Edge Config Client
 * Handles connection to Edge Config with robust error handling and caching
 */

import { createClient } from '@vercel/edge-config';
import {
  EdgeConfigSchema,
  EdgeConfigResult,
  EdgeConfigError,
  CacheEntry,
} from './types';
import {
  DEFAULT_EDGE_CONFIG,
  DEFAULT_CACHE_TTL,
  MAX_CACHE_SIZE,
} from './defaults';

// Edge Config client instance
const edgeConfig = createClient(process.env.EDGE_CONFIG);

// In-memory cache for development and fallback scenarios
const cache = new Map<string, CacheEntry<any>>();

/**
 * Creates a standardized error object
 */
function createError(
  type: EdgeConfigError['type'],
  message: string,
  original?: Error
): EdgeConfigError {
  return {
    type,
    message,
    original,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Checks if cached data is still valid
 */
function isCacheValid<T>(entry: CacheEntry<T>): boolean {
  return Date.now() - entry.timestamp < entry.ttl;
}

/**
 * Stores data in cache with TTL
 */
function setCache<T>(
  key: string,
  data: T,
  ttl: number = DEFAULT_CACHE_TTL
): void {
  // Prevent cache from growing too large
  if (cache.size >= MAX_CACHE_SIZE) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey) {
      cache.delete(oldestKey);
    }
  }

  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });
}

/**
 * Retrieves data from cache if valid
 */
function getCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && isCacheValid(entry)) {
    return entry.data as T;
  }

  // Clean up expired entry
  if (entry) {
    cache.delete(key);
  }

  return null;
}

/**
 * Apply local development overrides to features
 */
function applyLocalOverrides(features: any): any {
  // Only apply overrides in development
  if (process.env.NODE_ENV !== 'development') {
    return features;
  }

  const overrides: Record<string, any> = {};

  // Check for local override environment variables
  if (process.env.LOCAL_OVERRIDE_ADS !== undefined) {
    overrides.adsEnabled = process.env.LOCAL_OVERRIDE_ADS === 'true';
  }

  if (process.env.LOCAL_OVERRIDE_MAINTENANCE !== undefined) {
    overrides.maintenanceMode =
      process.env.LOCAL_OVERRIDE_MAINTENANCE === 'true';
  }

  if (process.env.LOCAL_OVERRIDE_PRO !== undefined) {
    overrides.proEnabled = process.env.LOCAL_OVERRIDE_PRO === 'true';
  }

  if (process.env.LOCAL_OVERRIDE_BETA !== undefined) {
    overrides.betaFeatures = process.env.LOCAL_OVERRIDE_BETA === 'true';
  }

  // Merge overrides with original features
  if (Object.keys(overrides).length > 0) {
    console.log('🔧 Applying local development overrides:', overrides);
    return { ...features, ...overrides };
  }

  return features;
}

/**
 * Main function to get data from Edge Config with fallback
 */
export async function getEdgeConfig<T = EdgeConfigSchema>(
  key?: string,
  fallback?: T
): Promise<EdgeConfigResult<T>> {
  const startTime = Date.now();
  const cacheKey = key || 'root';

  try {
    // Check cache first
    const cached = getCache<T>(cacheKey);
    if (cached) {
      return {
        success: true,
        data: cached,
        source: 'cache',
        responseTime: Date.now() - startTime,
      };
    }

    // Development mode - use defaults
    if (process.env.NODE_ENV === 'development' && !process.env.EDGE_CONFIG) {
      console.log('🔧 Development mode: Using default Edge Config');
      const data = (fallback || DEFAULT_EDGE_CONFIG) as T;
      setCache(cacheKey, data);
      return {
        success: true,
        data,
        source: 'fallback',
        responseTime: Date.now() - startTime,
      };
    }

    // Check if Edge Config is configured
    if (!process.env.EDGE_CONFIG) {
      const error = createError(
        'auth',
        'EDGE_CONFIG environment variable is not configured'
      );

      return {
        success: false,
        error,
        fallback: (fallback || DEFAULT_EDGE_CONFIG) as T,
        responseTime: Date.now() - startTime,
      };
    }

    // Fetch from Edge Config
    let data;
    if (key) {
      data = await edgeConfig.get<T>(key);
    } else {
      const allData = await edgeConfig.getAll();
      // Edge Config returns data wrapped in 'items' when fetched via URL
      data = (allData as any)?.items || allData;
    }

    if (!data) {
      const error = createError(
        'not_found',
        key
          ? `Key "${key}" not found in Edge Config`
          : 'No data found in Edge Config'
      );

      return {
        success: false,
        error,
        fallback: (fallback || DEFAULT_EDGE_CONFIG) as T,
        responseTime: Date.now() - startTime,
      };
    }

    // Apply local overrides in development
    if (!key || key === 'features') {
      if ((data as any).features) {
        (data as any).features = applyLocalOverrides((data as any).features);
      } else if (key === 'features') {
        data = applyLocalOverrides(data) as T;
      }
    }

    // Cache successful response
    setCache(cacheKey, data, DEFAULT_CACHE_TTL);

    return {
      success: true,
      data,
      source: 'edge-config',
      responseTime: Date.now() - startTime,
    };
  } catch (error) {
    console.error('Edge Config error:', error);

    const edgeError = createError(
      'network',
      'Failed to fetch from Edge Config',
      error as Error
    );

    return {
      success: false,
      error: edgeError,
      fallback: (fallback || DEFAULT_EDGE_CONFIG) as T,
      responseTime: Date.now() - startTime,
    };
  }
}

/**
 * Gets the complete Edge Config schema
 */
export async function getCompleteConfig(): Promise<
  EdgeConfigResult<EdgeConfigSchema>
> {
  return getEdgeConfig<EdgeConfigSchema>(undefined, DEFAULT_EDGE_CONFIG);
}

/**
 * Gets a specific configuration section
 */
export async function getConfigSection<T>(
  section: keyof EdgeConfigSchema,
  fallback?: T
): Promise<EdgeConfigResult<T>> {
  const result = await getCompleteConfig();

  if (!result.success) {
    return {
      success: false,
      error: result.error,
      fallback,
      responseTime: result.responseTime,
    };
  }

  const sectionData = result.data[section] as T;

  return {
    success: true,
    data: sectionData,
    source: result.source,
    responseTime: result.responseTime,
  };
}

/**
 * Clears the in-memory cache
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Gets cache statistics
 */
export function getCacheStats() {
  const entries = Array.from(cache.entries());
  const validEntries = entries.filter(([_, entry]) => isCacheValid(entry));

  return {
    size: cache.size,
    validEntries: validEntries.length,
    expiredEntries: entries.length - validEntries.length,
    oldestEntry:
      entries.length > 0
        ? Math.min(...entries.map(([_, entry]) => entry.timestamp))
        : null,
    newestEntry:
      entries.length > 0
        ? Math.max(...entries.map(([_, entry]) => entry.timestamp))
        : null,
  };
}

/**
 * Health check for Edge Config connection
 */
export async function healthCheck(): Promise<{
  healthy: boolean;
  latency: number;
  source: 'edge-config' | 'cache' | 'fallback';
  error?: string;
}> {
  const startTime = Date.now();

  try {
    const result = await getCompleteConfig();

    return {
      healthy: result.success,
      latency: result.responseTime,
      source: result.success ? result.source : ('fallback' as const),
      error: result.success ? undefined : result.error.message,
    };
  } catch (error) {
    return {
      healthy: false,
      latency: Date.now() - startTime,
      source: 'fallback',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Performance monitoring wrapper
 * Logs Edge Config performance metrics
 */
export function withPerformanceMonitoring<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  operationName: string
) {
  return async (...args: T): Promise<R> => {
    const startTime = Date.now();
    console.time(`EdgeConfig:${operationName}`);

    try {
      const result = await fn(...args);
      const duration = Date.now() - startTime;

      console.timeEnd(`EdgeConfig:${operationName}`);

      if (duration > 100) {
        console.warn(
          `⚠️ Slow Edge Config operation: ${operationName} took ${duration}ms`
        );
      }

      return result;
    } catch (error) {
      console.timeEnd(`EdgeConfig:${operationName}`);
      console.error(`❌ Edge Config operation failed: ${operationName}`, error);
      throw error;
    }
  };
}
