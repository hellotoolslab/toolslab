// UmamiSDKAdapter - Adapter per Umami SDK v3
// Responsabilità:
// - Interfaccia con window.umami.track()
// - Conversione eventi interni → formato Umami
// - Invio sequenziale per preservare ordine
// - Gestione errori SDK

import type { AnalyticsEvent } from '../types/events';
import type { AnalyticsConfig } from '../config';
import { CRITICAL_EVENTS } from '../config';
import { UmamiEventQueue } from './UmamiEventQueue';

// Delay between sequential events (ms)
const SEQUENTIAL_DELAY_MS = 10;

/**
 * Adapter per comunicare con Umami SDK
 * Gestisce l'interfaccia con window.umami.track() in modo type-safe
 */
export class UmamiSDKAdapter {
  private config: AnalyticsConfig;
  private queue: UmamiEventQueue;
  private retryQueue: Map<string, { event: AnalyticsEvent; attempts: number }> =
    new Map();

  constructor(config: AnalyticsConfig) {
    this.config = config;
    this.queue = new UmamiEventQueue(config);

    // Set flush callback
    this.queue.setFlushCallback((events) =>
      this.sendEventsSequentially(events)
    );

    // Listen for page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => this.handleBeforeUnload());
    }

    this.log('UmamiSDKAdapter initialized', this.config);
  }

  /**
   * Traccia un evento analytics
   */
  track(event: AnalyticsEvent): void {
    if (!this.config.enabled) {
      this.log('Tracking disabled, ignoring event', event.event);
      return;
    }

    // Check Do Not Track
    if (
      this.config.privacy.respectDNT &&
      typeof navigator !== 'undefined' &&
      (navigator.doNotTrack === '1' || (navigator as any).doNotTrack === 'yes')
    ) {
      this.log('DNT enabled, ignoring event', event.event);
      return;
    }

    // Sanitize PII if enabled
    if (this.config.privacy.sanitizePII) {
      event = this.sanitizePII(event);
    }

    this.log('✅ Tracking event', event.event);

    // Check if should flush immediately (critical events)
    const shouldFlushImmediately = this.isCriticalEvent(event);

    // Enqueue event
    this.queue.enqueue(event, shouldFlushImmediately);
  }

  /**
   * Flush manuale della queue
   */
  async flush(): Promise<void> {
    this.queue.flush();
  }

  /**
   * Invia eventi all'SDK Umami in sequenza
   * Gli eventi sono già ordinati cronologicamente dalla queue
   */
  private sendEventsSequentially(events: AnalyticsEvent[]): void {
    if (!this.isSDKReady()) {
      this.log('❌ SDK not ready, requeueing events');
      // Add to retry queue
      events.forEach((event) => {
        this.retryQueue.set(this.generateEventId(event), {
          event,
          attempts: 0,
        });
      });
      setTimeout(() => this.retryFailedEvents(), 1000);
      return;
    }

    // Send each event with micro-delay to preserve order
    events.forEach((event, index) => {
      setTimeout(() => {
        try {
          this.trackSingleEvent(event);
          this.log(`📤 Event ${index + 1}/${events.length}: ${event.event}`);
        } catch (err) {
          this.log(`❌ Failed to send event: ${event.event}`, err);
          // Add to retry queue
          this.retryQueue.set(this.generateEventId(event), {
            event,
            attempts: 0,
          });
        }
      }, index * SEQUENTIAL_DELAY_MS);
    });

    this.log(
      `✅ Queued ${events.length} events for Umami SDK`,
      events.map((e) => e.event)
    );

    // Schedule retry if needed
    if (this.retryQueue.size > 0) {
      setTimeout(() => this.retryFailedEvents(), 1000);
    }
  }

  /**
   * Traccia singolo evento via Umami SDK
   */
  private trackSingleEvent(event: AnalyticsEvent): void {
    if (!this.isSDKReady()) {
      throw new Error('Umami SDK not loaded');
    }

    const { event: eventName, timestamp, ...metadata } = event;

    // Prepare event data with original timestamp
    const eventData = {
      ...metadata,
      created_at: timestamp, // Original event timestamp for post-analysis
    };

    // Special handling for pageview events
    if (eventName === 'pageview' && 'page' in metadata) {
      // Use normalized page identifier instead of raw URL
      // Example: 'tool:json-formatter' instead of '/it/tools/json-formatter'
      (window as any).umami.track(metadata.page, eventData);
    } else {
      // Standard event tracking - Umami SDK handles everything
      (window as any).umami.track(eventName, eventData);
    }
  }

  /**
   * Handle page unload - flush ALL pending events SYNCHRONOUSLY
   */
  private handleBeforeUnload(): void {
    this.log('Page unloading, flushing ALL pending events');

    if (!this.isSDKReady()) {
      this.log('❌ SDK not ready on unload');
      return;
    }

    // Get all pending events (sorted)
    const sortedEvents = this.queue.flushSync();

    if (sortedEvents.length === 0) {
      return;
    }

    this.log(
      `📤 Sending ${sortedEvents.length} events synchronously on unload`,
      sortedEvents.map((e) => e.event)
    );

    // ⚡ CRITICAL: Send synchronously (no setTimeout) during page unload
    // The browser may kill async operations during beforeunload
    sortedEvents.forEach((event) => {
      try {
        this.trackSingleEvent(event);
        this.log(`✅ Sent on unload: ${event.event}`);
      } catch (err) {
        this.log(`❌ Failed to send on unload: ${event.event}`, err);
      }
    });
  }

  /**
   * Retry failed events with exponential backoff
   */
  private async retryFailedEvents(): Promise<void> {
    if (this.retryQueue.size === 0 || !this.isSDKReady()) {
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

      try {
        this.trackSingleEvent(item.event);
        this.log(`✅ Retry successful: ${item.event.event}`);
      } catch (error) {
        // Re-add to retry queue with incremented attempts
        this.retryQueue.set(this.generateEventId(item.event), {
          event: item.event,
          attempts: item.attempts + 1,
        });
        this.log(`❌ Retry failed: ${item.event.event}`);
      }
    }

    // Schedule next retry if needed
    if (this.retryQueue.size > 0) {
      setTimeout(() => this.retryFailedEvents(), 5000);
    }
  }

  /**
   * Check if Umami SDK is ready
   */
  private isSDKReady(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof (window as any).umami?.track === 'function'
    );
  }

  /**
   * Check if event is critical (requires immediate flush)
   */
  private isCriticalEvent(event: AnalyticsEvent): boolean {
    return CRITICAL_EVENTS.includes(event.event as any);
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
   * Generate unique event ID
   */
  private generateEventId(event: AnalyticsEvent): string {
    return `${event.event}_${event.timestamp}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Update configuration
   */
  setConfig(config: Partial<AnalyticsConfig>): void {
    this.config = { ...this.config, ...config };
    this.log('Config updated', this.config);
  }

  /**
   * Get current configuration
   */
  getConfig(): AnalyticsConfig {
    return { ...this.config };
  }

  /**
   * Get queue status (for debug panel)
   */
  getStatus() {
    return {
      enabled: this.config.enabled,
      retryQueueSize: this.retryQueue.size,
      sdkReady: this.isSDKReady(),
      ...this.queue.getStatus(),
    };
  }

  /**
   * Debug logging
   */
  private log(message: string, data?: any): void {
    if (!this.config.debug) return;

    if (data) {
      console.log(`[UmamiSDKAdapter] ${message}`, data);
    } else {
      console.log(`[UmamiSDKAdapter] ${message}`);
    }
  }
}

// Singleton instance
let instance: UmamiSDKAdapter | null = null;

export function getUmamiAdapter(): UmamiSDKAdapter {
  if (!instance) {
    const { getAnalyticsConfig } = require('../config');
    instance = new UmamiSDKAdapter(getAnalyticsConfig());
  }
  return instance;
}
