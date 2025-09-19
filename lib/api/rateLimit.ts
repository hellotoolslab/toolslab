/**
 * Rate limiting middleware for API endpoints
 * Implements in-memory storage with automatic cleanup
 * Can be upgraded to Redis/Upstash for production scaling
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyGenerator?: (req: Request) => string;
  skipSuccessfulRequests?: boolean;
  message?: string;
}

class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Cleanup expired entries every minute
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
  }

  /**
   * Check if request should be rate limited
   */
  async isRateLimited(
    key: string,
    config: RateLimitConfig
  ): Promise<{ limited: boolean; retryAfter?: number; remaining?: number }> {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || now > entry.resetTime) {
      // Create new entry or reset expired one
      this.store.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return {
        limited: false,
        remaining: config.maxRequests - 1,
      };
    }

    if (entry.count >= config.maxRequests) {
      // Rate limit exceeded
      return {
        limited: true,
        retryAfter: Math.ceil((entry.resetTime - now) / 1000),
        remaining: 0,
      };
    }

    // Increment count
    entry.count++;
    this.store.set(key, entry);

    return {
      limited: false,
      remaining: config.maxRequests - entry.count,
    };
  }

  /**
   * Clean up expired entries
   */
  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime + 60000) {
        // Remove entries expired for more than 1 minute
        this.store.delete(key);
      }
    }
  }

  /**
   * Reset rate limit for a specific key
   */
  reset(key: string) {
    this.store.delete(key);
  }

  /**
   * Get current stats
   */
  getStats() {
    return {
      activeKeys: this.store.size,
      entries: Array.from(this.store.entries()).map(([key, entry]) => ({
        key: key.substring(0, 20) + '...',
        count: entry.count,
        resetTime: new Date(entry.resetTime).toISOString(),
      })),
    };
  }

  /**
   * Cleanup on destroy
   */
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.store.clear();
  }
}

// Singleton instance
const rateLimiter = new RateLimiter();

/**
 * Default rate limit config for IndexNow API
 */
export const DEFAULT_INDEXNOW_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 10,
  windowMs: 10000, // 10 seconds
  message: 'Too many requests, please try again later',
};

/**
 * Extract client identifier from request
 */
export function getClientKey(request: Request): string {
  // Try to get IP from various headers
  const headers = new Headers(request.headers);
  const forwardedFor = headers.get('x-forwarded-for');
  const realIp = headers.get('x-real-ip');
  const cfConnectingIp = headers.get('cf-connecting-ip');

  // Use the first available IP or fallback to a hash of headers
  const ip =
    cfConnectingIp || realIp || forwardedFor?.split(',')[0] || 'unknown';

  // For API key authenticated requests, use API key as part of the key
  const apiKey = headers.get('x-api-key');
  if (apiKey) {
    return `api:${apiKey}`;
  }

  return `ip:${ip}`;
}

/**
 * Rate limiting middleware for Next.js API routes
 */
export async function rateLimit(
  request: Request,
  config: Partial<RateLimitConfig> = {}
): Promise<{
  success: boolean;
  message?: string;
  retryAfter?: number;
  remaining?: number;
}> {
  const finalConfig: RateLimitConfig = {
    ...DEFAULT_INDEXNOW_RATE_LIMIT,
    ...config,
  };

  const key = finalConfig.keyGenerator?.(request) || getClientKey(request);
  const result = await rateLimiter.isRateLimited(key, finalConfig);

  if (result.limited) {
    return {
      success: false,
      message: finalConfig.message,
      retryAfter: result.retryAfter,
      remaining: 0,
    };
  }

  return {
    success: true,
    remaining: result.remaining,
  };
}

/**
 * Reset rate limit for a specific client
 */
export function resetRateLimit(request: Request) {
  const key = getClientKey(request);
  rateLimiter.reset(key);
}

/**
 * Get rate limiter stats (for monitoring)
 */
export function getRateLimiterStats() {
  return rateLimiter.getStats();
}

// Cleanup on process exit
if (typeof process !== 'undefined') {
  process.on('exit', () => rateLimiter.destroy());
  process.on('SIGTERM', () => rateLimiter.destroy());
  process.on('SIGINT', () => rateLimiter.destroy());
}
