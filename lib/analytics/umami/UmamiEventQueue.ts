// UmamiEventQueue - Gestione code eventi per Umami SDK
// Responsabilità:
// - Batching locale (performance)
// - Ordinamento cronologico
// - Flush automatico
// - Offline queue persistente

import type { AnalyticsEvent } from '../types/events';
import type { AnalyticsConfig } from '../config';

export interface QueueStatus {
  queueSize: number;
  offlineQueueSize: number;
  hasActiveTimer: boolean;
  isOnline: boolean;
}

/**
 * Gestisce la coda degli eventi analytics con batching intelligente
 */
export class UmamiEventQueue {
  private queue: AnalyticsEvent[] = [];
  private offlineQueue: AnalyticsEvent[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private isOnline: boolean = true;
  private onFlushCallback: ((events: AnalyticsEvent[]) => void) | null = null;

  constructor(private config: AnalyticsConfig) {
    if (typeof window !== 'undefined') {
      // Listen for online/offline events
      window.addEventListener('online', () => this.handleOnline());
      window.addEventListener('offline', () => this.handleOffline());

      // Restore offline queue from localStorage
      this.restoreOfflineQueue();
    }
  }

  /**
   * Imposta la callback chiamata quando la queue deve essere svuotata
   */
  setFlushCallback(callback: (events: AnalyticsEvent[]) => void): void {
    this.onFlushCallback = callback;
  }

  /**
   * Aggiunge un evento alla queue
   */
  enqueue(
    event: AnalyticsEvent,
    shouldFlushImmediately: boolean = false
  ): void {
    // If offline, add to offline queue
    if (!this.isOnline) {
      this.offlineQueue.push(event);
      this.persistOfflineQueue();
      this.log('📴 Offline - queued event', event.event);
      return;
    }

    // Add to main queue
    this.queue.push(event);
    this.log(
      `📦 Enqueued (${this.queue.length}/${this.config.batching.maxSize})`,
      event.event
    );

    // Check if we should flush
    if (shouldFlushImmediately) {
      this.flush();
    } else if (this.queue.length >= this.config.batching.maxSize) {
      this.flush();
    } else if (!this.flushTimer) {
      this.startFlushTimer();
    }
  }

  /**
   * Svuota la queue inviando gli eventi
   */
  flush(): void {
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

    // Sort events by timestamp (chronological order)
    const sortedEvents = this.sortByTimestamp(eventsToSend);

    this.log(
      `🚀 Flushing ${sortedEvents.length} events`,
      sortedEvents.map((e) => e.event)
    );

    // Call flush callback
    if (this.onFlushCallback) {
      this.onFlushCallback(sortedEvents);
    }
  }

  /**
   * Svuota la queue in modo sincrono (per page unload)
   */
  flushSync(): AnalyticsEvent[] {
    if (this.queue.length === 0) {
      return [];
    }

    // Clear timer
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }

    // Take and sort events
    const sortedEvents = this.sortByTimestamp([...this.queue]);
    this.queue = [];

    this.log(
      `📤 Sync flush ${sortedEvents.length} events`,
      sortedEvents.map((e) => e.event)
    );

    return sortedEvents;
  }

  /**
   * Ordina eventi per timestamp (INVERSO - dal più recente al più vecchio)
   * NOTA: Invertito per testare se Umami riceve eventi in ordine inverso
   */
  private sortByTimestamp(events: AnalyticsEvent[]): AnalyticsEvent[] {
    return events.sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Avvia timer per flush automatico
   */
  private startFlushTimer(): void {
    this.flushTimer = setTimeout(() => {
      this.flush();
    }, this.config.batching.maxWait);
  }

  /**
   * Handle online event
   */
  private handleOnline(): void {
    this.log('🌐 Back online, processing offline queue');
    this.isOnline = true;

    // Process offline queue
    if (this.offlineQueue.length > 0) {
      const events = [...this.offlineQueue];
      this.offlineQueue = [];
      this.clearOfflineQueue();

      // Re-enqueue all offline events
      events.forEach((event) => this.enqueue(event));
    }
  }

  /**
   * Handle offline event
   */
  private handleOffline(): void {
    this.log('📴 Gone offline');
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
        this.log('Restored offline queue', this.offlineQueue.length);
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
   * Get queue status
   */
  getStatus(): QueueStatus {
    return {
      queueSize: this.queue.length,
      offlineQueueSize: this.offlineQueue.length,
      hasActiveTimer: this.flushTimer !== null,
      isOnline: this.isOnline,
    };
  }

  /**
   * Debug logging
   */
  private log(message: string, data?: any): void {
    if (!this.config.debug) return;

    if (data) {
      console.log(`[UmamiEventQueue] ${message}`, data);
    } else {
      console.log(`[UmamiEventQueue] ${message}`);
    }
  }
}
