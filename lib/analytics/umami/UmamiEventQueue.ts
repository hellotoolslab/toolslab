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
  hasActiveTimer: boolean;
}

/**
 * Gestisce la coda degli eventi analytics con batching intelligente
 */
export class UmamiEventQueue {
  private queue: AnalyticsEvent[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private onFlushCallback: ((events: AnalyticsEvent[]) => void) | null = null;

  constructor(private config: AnalyticsConfig) {
    // No offline queue - analytics can tolerate data loss
    // sendBeacon provides best-effort delivery, which is sufficient
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
    // Add to queue
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
    return events.sort((a, b) => {
      const aTime = a.timestamp ?? Date.now();
      const bTime = b.timestamp ?? Date.now();
      return bTime - aTime;
    });
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
   * Get queue status
   */
  getStatus(): QueueStatus {
    return {
      queueSize: this.queue.length,
      hasActiveTimer: this.flushTimer !== null,
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
