// Analytics Configuration for ToolsLab

export interface AnalyticsConfig {
  enabled: boolean;

  batching: {
    maxSize: number; // Max events before auto-flush
    maxWait: number; // Max milliseconds before auto-flush
  };

  retry: {
    maxAttempts: number;
    backoffMultiplier: number; // Exponential backoff: 1s, 2s, 4s, etc.
  };

  delivery: {
    preferBeacon: boolean; // Use sendBeacon when available
    keepalive: boolean; // Use fetch keepalive fallback
    endpoint?: string; // Custom endpoint (optional)
  };

  privacy: {
    sanitizePII: boolean; // Remove PII from metadata
    respectDNT: boolean; // Honor Do Not Track header
  };

  debug: boolean; // Enable debug logging
}

// Default configuration
export const defaultConfig: AnalyticsConfig = {
  // ✅ SINGLE SOURCE OF TRUTH: solo questo parametro controlla analytics
  enabled: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true',

  batching: {
    maxSize: 10,
    maxWait: 5000, // 5 seconds
  },

  retry: {
    maxAttempts: 3,
    backoffMultiplier: 2, // 1s, 2s, 4s
  },

  delivery: {
    preferBeacon: true,
    keepalive: true,
    endpoint: undefined, // Uses Umami default
  },

  privacy: {
    sanitizePII: true,
    respectDNT: true,
  },

  // Debug logs: abilitato solo se analytics abilitato E debug mode attivo
  debug:
    process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true' &&
    (process.env.NEXT_PUBLIC_UMAMI_DEBUG === 'true' ||
      process.env.NODE_ENV === 'development'),
};

// Get runtime config from environment
export function getAnalyticsConfig(): AnalyticsConfig {
  return {
    ...defaultConfig,

    batching: {
      maxSize: parseInt(
        process.env.NEXT_PUBLIC_ANALYTICS_BATCH_SIZE || '10',
        10
      ),
      maxWait: parseInt(
        process.env.NEXT_PUBLIC_ANALYTICS_FLUSH_INTERVAL || '5000',
        10
      ),
    },
  };
}

// Critical events that use sendBeacon for reliable delivery
// Note: These events still use batching, but get sendBeacon delivery method
// to survive page unload. All events preserve exact timestamps regardless.
export const CRITICAL_EVENTS = [
  'session.end', // MUST survive page unload
  'tool.use', // Important business metric
  'tool.error', // Error tracking
  'chain.complete', // Workflow completion
] as const;

// Events that can use best-effort delivery
export const NON_CRITICAL_EVENTS = [
  'user.copy',
  'user.download',
  'pageview',
] as const;

// PII patterns to sanitize
export const PII_PATTERNS = {
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  ipv4: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
  ipv6: /\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b/g,
  creditCard: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
  apiKey: /\b[a-zA-Z0-9]{32,}\b/g,
};
