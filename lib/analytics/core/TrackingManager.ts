// TrackingManager - Central analytics tracking system for ToolsLab

import type {
  AnalyticsEvent,
  EventBatch,
  DeliveryResult,
  DeliveryMethod,
} from '../types/events';
import {
  type AnalyticsConfig,
  getAnalyticsConfig,
  CRITICAL_EVENTS,
} from '../config';

class TrackingManager {
  private config: AnalyticsConfig;
  private queue: AnalyticsEvent[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private retryQueue: Map<string, { event: AnalyticsEvent; attempts: number }> =
    new Map();
  private isOnline: boolean = true;
  private offlineQueue: AnalyticsEvent[] = [];

  constructor(config?: Partial<AnalyticsConfig>) {
    this.config = { ...getAnalyticsConfig(), ...config };

    if (typeof window !== 'undefined') {
      // Listen for online/offline events
      window.addEventListener('online', () => this.handleOnline());
      window.addEventListener('offline', () => this.handleOffline());

      // Listen for page unload
      window.addEventListener('beforeunload', () => this.handleBeforeUnload());
      window.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.handleBeforeUnload();
        }
      });

      // Restore offline queue from localStorage
      this.restoreOfflineQueue();
    }

    this.log('TrackingManager initialized', this.config);
  }

  /**
   * Track an analytics event
   */
  public track(event: AnalyticsEvent): void {
    if (!this.config.enabled) {
      this.log('Tracking disabled, ignoring event', event);
      return;
    }

    // Check Do Not Track
    if (
      this.config.privacy.respectDNT &&
      typeof navigator !== 'undefined' &&
      (navigator.doNotTrack === '1' || (navigator as any).doNotTrack === 'yes')
    ) {
      this.log('DNT enabled, ignoring event', event);
      return;
    }

    // Sanitize PII if enabled
    if (this.config.privacy.sanitizePII) {
      event = this.sanitizePII(event);
    }

    this.log('✅ Tracking event', event);

    // If offline, add to offline queue
    if (!this.isOnline) {
      this.offlineQueue.push(event);
      this.persistOfflineQueue();
      this.log('📴 Offline - queued event', event);
      return;
    }

    // Add to queue
    this.queue.push(event);
    this.log(
      `📦 Added to queue (${this.queue.length}/${this.config.batching.maxSize})`,
      event.event
    );

    // Check if we should flush immediately
    if (this.shouldFlushImmediately(event)) {
      this.flush();
    }
    // Or flush when batch is full
    else if (this.queue.length >= this.config.batching.maxSize) {
      this.flush();
    }
    // Or start timer for auto-flush
    else if (!this.flushTimer) {
      this.startFlushTimer();
    }
  }

  /**
   * Flush queue immediately
   */
  public async flush(): Promise<void> {
    if (this.queue.length === 0) {
      return;
    }

    // Clear timer
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }

    // Take current queue and reset
    const eventsToSend = [...this.queue];
    this.queue = [];

    // Create batch
    const batch: EventBatch = {
      events: eventsToSend,
      batchId: this.generateBatchId(),
      timestamp: Date.now(),
    };

    this.log(
      `🚀 Flushing ${batch.events.length} events`,
      batch.events.map((e) => e.event)
    );

    // Send batch
    const result = await this.sendBatch(batch);

    if (!result.success && result.method !== 'none') {
      this.log('Batch send failed, adding to retry queue', result);
      // Add failed events to retry queue
      eventsToSend.forEach((event) => {
        this.retryQueue.set(this.generateEventId(event), {
          event,
          attempts: 0,
        });
      });
      // Retry after delay
      setTimeout(() => this.retryFailedEvents(), 1000);
    }
  }

  /**
   * Send batch using best delivery method
   */
  private async sendBatch(batch: EventBatch): Promise<DeliveryResult> {
    const hasCriticalEvents = batch.events.some((e) =>
      CRITICAL_EVENTS.includes(e.event as any)
    );

    // Always use window.umami as primary method (most reliable with Umami Cloud)
    const umamiResult = this.sendViaUmami(batch);
    if (umamiResult.success) {
      return umamiResult;
    }

    this.log('window.umami not available, trying sendBeacon', umamiResult);

    // Fallback: Try sendBeacon for critical events
    if (hasCriticalEvents && this.config.delivery.preferBeacon) {
      const beaconResult = this.sendViaBeacon(batch);
      if (beaconResult.success) {
        return beaconResult;
      }
      this.log('sendBeacon failed', beaconResult);
    }

    this.log('All delivery methods failed');
    return {
      success: false,
      method: 'none',
      error: 'window.umami not available',
    };
  }

  /**
   * Send via navigator.sendBeacon (survives page unload)
   */
  private sendViaBeacon(batch: EventBatch): DeliveryResult {
    if (typeof navigator === 'undefined' || !navigator.sendBeacon) {
      return { success: false, method: 'beacon', error: 'Not available' };
    }

    try {
      const scriptUrl =
        this.config.delivery.endpoint ||
        process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;

      if (!scriptUrl) {
        return {
          success: false,
          method: 'beacon',
          error: 'No endpoint configured',
        };
      }

      // sendBeacon accepts Blob, ArrayBuffer, FormData, or string
      const data = JSON.stringify(batch);
      const blob = new Blob([data], { type: 'application/json' });

      // Get endpoint from Umami script URL
      const endpoint = scriptUrl.replace('/script.js', '/api/send');

      const success = navigator.sendBeacon(endpoint, blob);

      if (success) {
        this.log(
          `✅ Sent ${batch.events.length} events via sendBeacon`,
          endpoint
        );
        return { success: true, method: 'beacon' };
      }

      return {
        success: false,
        method: 'beacon',
        error: 'sendBeacon returned false',
      };
    } catch (error) {
      return {
        success: false,
        method: 'beacon',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Send via fetch with keepalive
   */
  private async sendViaFetch(batch: EventBatch): Promise<DeliveryResult> {
    if (typeof fetch === 'undefined') {
      return { success: false, method: 'fetch', error: 'Not available' };
    }

    try {
      const scriptUrl =
        this.config.delivery.endpoint ||
        process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;

      if (!scriptUrl) {
        return {
          success: false,
          method: 'fetch',
          error: 'No endpoint configured',
        };
      }

      const endpoint = scriptUrl.replace('/script.js', '/api/send');

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(batch),
        keepalive: true, // Survives page navigation
        credentials: 'omit', // Don't send credentials to avoid CORS issues
      });

      if (response.ok) {
        this.log('Sent via fetch', batch);
        return { success: true, method: 'fetch' };
      }

      return {
        success: false,
        method: 'fetch',
        error: `HTTP ${response.status}`,
      };
    } catch (error) {
      return {
        success: false,
        method: 'fetch',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Send via window.umami (fallback)
   */
  private sendViaUmami(batch: EventBatch): DeliveryResult {
    if (typeof window === 'undefined' || !(window as any).umami) {
      return { success: false, method: 'umami', error: 'Not available' };
    }

    try {
      // Send each event individually via umami
      batch.events.forEach((event) => {
        const { event: eventName, ...metadata } = event;

        // Special handling for pageview events
        if (eventName === 'pageview' && 'page' in metadata) {
          // For pageviews, use the normalized page as the URL
          // This ensures Umami tracks 'tool:password-generator' instead of '/it/tools/password-generator'
          (window as any).umami.track(metadata.page, metadata);
        } else {
          // For other events, use standard tracking
          (window as any).umami.track(eventName, metadata);
        }
      });

      this.log('Sent via window.umami', batch);
      return { success: true, method: 'umami' };
    } catch (error) {
      return {
        success: false,
        method: 'umami',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Retry failed events with exponential backoff
   */
  private async retryFailedEvents(): Promise<void> {
    if (this.retryQueue.size === 0) {
      return;
    }

    const toRetry: Array<{ event: AnalyticsEvent; attempts: number }> = [];

    this.retryQueue.forEach((item, key) => {
      if (item.attempts < this.config.retry.maxAttempts) {
        toRetry.push(item);
        this.retryQueue.delete(key);
      }
    });

    for (const item of toRetry) {
      const delay =
        1000 * Math.pow(this.config.retry.backoffMultiplier, item.attempts);

      await new Promise((resolve) => setTimeout(resolve, delay));

      const batch: EventBatch = {
        events: [item.event],
        batchId: this.generateBatchId(),
        timestamp: Date.now(),
      };

      const result = await this.sendBatch(batch);

      if (!result.success) {
        // Re-add to retry queue with incremented attempts
        this.retryQueue.set(this.generateEventId(item.event), {
          event: item.event,
          attempts: item.attempts + 1,
        });
      }
    }

    // Schedule next retry if needed
    if (this.retryQueue.size > 0) {
      setTimeout(() => this.retryFailedEvents(), 5000);
    }
  }

  /**
   * Handle page unload - flush ALL pending events immediately
   */
  private handleBeforeUnload(): void {
    this.log('Page unloading, flushing ALL pending events');

    // Flush ALL pending events (not just critical ones)
    // This ensures maximum data reliability when user closes the page
    if (this.queue.length > 0) {
      const batch: EventBatch = {
        events: [...this.queue], // ✅ Send ALL events in queue
        batchId: this.generateBatchId(),
        timestamp: Date.now(),
      };

      // Clear queue immediately to prevent duplicates
      this.queue = [];

      // Use sendBeacon (synchronous, survives unload)
      this.sendViaBeacon(batch);

      this.log(
        `✅ Sent ${batch.events.length} events via sendBeacon on unload`,
        batch.events.map((e) => e.event)
      );
    }
  }

  /**
   * Handle online event
   */
  private handleOnline(): void {
    this.log('Back online, processing offline queue');
    this.isOnline = true;

    // Process offline queue
    if (this.offlineQueue.length > 0) {
      const events = [...this.offlineQueue];
      this.offlineQueue = [];
      this.clearOfflineQueue();

      events.forEach((event) => this.track(event));
    }
  }

  /**
   * Handle offline event
   */
  private handleOffline(): void {
    this.log('Gone offline');
    this.isOnline = false;
  }

  /**
   * Persist offline queue to localStorage
   */
  private persistOfflineQueue(): void {
    if (typeof localStorage === 'undefined') return;

    try {
      localStorage.setItem(
        'toolslab-analytics-offline',
        JSON.stringify(this.offlineQueue)
      );
    } catch (error) {
      this.log('Failed to persist offline queue', error);
    }
  }

  /**
   * Restore offline queue from localStorage
   */
  private restoreOfflineQueue(): void {
    if (typeof localStorage === 'undefined') return;

    try {
      const stored = localStorage.getItem('toolslab-analytics-offline');
      if (stored) {
        this.offlineQueue = JSON.parse(stored);
        this.log('Restored offline queue', this.offlineQueue);
      }
    } catch (error) {
      this.log('Failed to restore offline queue', error);
    }
  }

  /**
   * Clear offline queue from localStorage
   */
  private clearOfflineQueue(): void {
    if (typeof localStorage === 'undefined') return;

    try {
      localStorage.removeItem('toolslab-analytics-offline');
    } catch (error) {
      this.log('Failed to clear offline queue', error);
    }
  }

  /**
   * Check if event should trigger immediate flush
   */
  private shouldFlushImmediately(event: AnalyticsEvent): boolean {
    // Critical events should be sent immediately
    return CRITICAL_EVENTS.includes(event.event as any);
  }

  /**
   * Start auto-flush timer
   */
  private startFlushTimer(): void {
    this.flushTimer = setTimeout(() => {
      this.flush();
    }, this.config.batching.maxWait);
  }

  /**
   * Sanitize PII from event metadata
   */
  private sanitizePII(event: AnalyticsEvent): AnalyticsEvent {
    const sanitized = { ...event };

    // Recursively sanitize all string values
    const sanitizeObject = (obj: any): any => {
      if (typeof obj === 'string') {
        // Remove emails, IPs, etc.
        return obj
          .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL]')
          .replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, '[IP]')
          .replace(/\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b/g, '[IP]')
          .replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, '[CARD]');
      }

      if (typeof obj === 'object' && obj !== null) {
        const result: any = Array.isArray(obj) ? [] : {};
        for (const key in obj) {
          result[key] = sanitizeObject(obj[key]);
        }
        return result;
      }

      return obj;
    };

    return sanitizeObject(sanitized);
  }

  /**
   * Generate unique batch ID
   */
  private generateBatchId(): string {
    return `batch_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Generate unique event ID
   */
  private generateEventId(event: AnalyticsEvent): string {
    return `${event.event}_${event.timestamp}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Debug logging
   */
  private log(message: string, data?: any): void {
    if (!this.config.debug) return;

    if (data) {
      console.log(`[TrackingManager] ${message}`, data);
    } else {
      console.log(`[TrackingManager] ${message}`);
    }
  }

  /**
   * Update configuration
   */
  public setConfig(config: Partial<AnalyticsConfig>): void {
    this.config = { ...this.config, ...config };
    this.log('Config updated', this.config);
  }

  /**
   * Get current configuration
   */
  public getConfig(): AnalyticsConfig {
    return { ...this.config };
  }

  /**
   * Get queue status (for debug panel)
   */
  public getStatus() {
    return {
      enabled: this.config.enabled,
      queueSize: this.queue.length,
      retryQueueSize: this.retryQueue.size,
      offlineQueueSize: this.offlineQueue.length,
      isOnline: this.isOnline,
      hasTimer: this.flushTimer !== null,
    };
  }
}

// Singleton instance
let instance: TrackingManager | null = null;

export function getTrackingManager(): TrackingManager {
  if (!instance) {
    instance = new TrackingManager();
  }
  return instance;
}

export { TrackingManager };
