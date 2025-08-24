/**
 * TypeScript interfaces for Vercel Edge Config
 * Defines the complete schema for tool configuration management
 */

export interface ToolFlags {
  /** Show "NEW" badge on tool card */
  isNew?: boolean;
  /** Show "BETA" badge - tool in beta testing */
  isBeta?: boolean;
  /** Requires Pro subscription to use */
  isPro?: boolean;
  /** Show "POPULAR" badge based on usage */
  isPopular?: boolean;
  /** Show "TRENDING" badge based on recent analytics spike */
  isTrending?: boolean;
  /** Tool is temporarily under maintenance */
  isMaintenance?: boolean;
}

export interface ToolMetadata {
  /** ISO timestamp of last configuration update */
  lastUpdated: string;
  /** Estimated monthly active users */
  monthlyUsers?: number;
  /** Average user rating (1-5) */
  averageRating?: number;
  /** Daily processing limit for free tier users */
  processingLimit?: number;
  /** SEO keywords for this specific tool */
  keywords?: string[];
  /** Tool-specific feature flags */
  features?: Record<string, boolean>;
}

export interface ToolConfig {
  /** Unique tool identifier */
  id: string;
  /** URL slug for routing (/tools/{slug}) */
  slug: string;
  /** Display name of the tool */
  name: string;
  /** Short description for tool cards and meta tags */
  description: string;
  /** Long description for tool pages */
  longDescription?: string;
  /** Tool is visible and accessible */
  enabled: boolean;
  /** Show on homepage featured section */
  featured: boolean;
  /** Display order (lower = higher priority) */
  order: number;
  /** Tool category for grouping */
  category: string;
  /** Monthly search volume for SEO prioritization */
  searchVolume: number;
  /** Icon identifier (matches Lucide icon names) */
  icon?: string;
  /** Tool behavior flags */
  flags: ToolFlags;
  /** Additional metadata */
  metadata: ToolMetadata;
}

export interface CategoryConfig {
  /** Category identifier */
  id: string;
  /** Display name */
  name: string;
  /** Category description */
  description: string;
  /** Display order */
  order: number;
  /** Category is visible */
  enabled: boolean;
  /** Category color (hex code) */
  color: string;
  /** Category icon */
  icon: string;
}

export interface EdgeConfigSchema {
  /** Complete tool configurations */
  tools: Record<string, ToolConfig>;
  /** Category configurations */
  categories: Record<string, CategoryConfig>;
  /** Global feature flags */
  features: {
    /** Enable/disable ads globally */
    adsEnabled: boolean;
    /** Maintenance mode */
    maintenanceMode: boolean;
    /** Coming soon mode */
    comingSoon: boolean;
    /** Pro features enabled */
    proEnabled: boolean;
    /** A/B test flags */
    experiments: Record<string, boolean>;
  };
  /** Site-wide settings */
  settings: {
    /** Maximum tools to show on homepage */
    maxFeaturedTools: number;
    /** Cache TTL in seconds */
    cacheTtl: number;
    /** Analytics configuration */
    analytics: {
      enabled: boolean;
      trackingId?: string;
    };
  };
  /** Configuration metadata */
  meta: {
    /** Last update timestamp */
    lastUpdated: string;
    /** Configuration version */
    version: string;
    /** Environment (development/production) */
    environment: 'development' | 'staging' | 'production';
  };
}

export interface ToolConfigOptions {
  /** Filter by enabled status */
  enabled?: boolean;
  /** Filter by featured status */
  featured?: boolean;
  /** Filter by category */
  category?: string;
  /** Limit number of results */
  limit?: number;
  /** Sort by field */
  sortBy?: 'order' | 'name' | 'searchVolume' | 'monthlyUsers';
  /** Sort direction */
  sortDirection?: 'asc' | 'desc';
  /** Include disabled tools */
  includeDisabled?: boolean;
}

export interface UserPlan {
  /** User plan type */
  type: 'free' | 'pro';
  /** Plan features */
  features: string[];
  /** Processing limits */
  limits: {
    dailyRequests: number;
    concurrentRequests: number;
  };
}

export interface ToolAccessResult {
  /** User can access the tool */
  canAccess: boolean;
  /** Reason if access is denied */
  reason?:
    | 'tool_disabled'
    | 'pro_required'
    | 'maintenance'
    | 'limit_exceeded'
    | 'not_found';
  /** Additional context */
  message?: string;
}

export interface EdgeConfigError {
  /** Error type */
  type: 'network' | 'parse' | 'auth' | 'not_found' | 'quota_exceeded';
  /** Error message */
  message: string;
  /** Original error */
  original?: Error;
  /** Timestamp of error */
  timestamp: string;
}

export interface CacheEntry<T> {
  /** Cached data */
  data: T;
  /** Cache timestamp */
  timestamp: number;
  /** TTL in milliseconds */
  ttl: number;
}

export type EdgeConfigResult<T> =
  | {
      /** Request was successful */
      success: true;
      /** Retrieved data */
      data: T;
      /** Data source */
      source: 'edge-config' | 'cache' | 'fallback';
      /** Response time in milliseconds */
      responseTime: number;
    }
  | {
      /** Request failed */
      success: false;
      /** Error details */
      error: EdgeConfigError;
      /** Fallback data if available */
      fallback?: T;
      /** Response time in milliseconds */
      responseTime: number;
    };
