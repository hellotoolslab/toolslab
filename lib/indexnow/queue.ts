/**
 * IndexNow Queue System for batch URL submissions
 * Manages priority queue, rate limiting, and automatic processing
 */

import { indexNowClient, SubmissionResult } from './client';

export type QueuePriority = 'high' | 'normal' | 'low';

export interface QueueItem {
  url: string;
  priority: QueuePriority;
  timestamp: number;
  retries: number;
  lastAttempt?: number;
}

export interface QueueStats {
  total: number;
  high: number;
  normal: number;
  low: number;
  processing: boolean;
  lastProcessed?: number;
  successCount: number;
  failureCount: number;
}

export class IndexNowQueue {
  private queue: Map<string, QueueItem> = new Map();
  private processing = false;
  private processInterval: NodeJS.Timeout | null = null;
  private stats = {
    successCount: 0,
    failureCount: 0,
    lastProcessed: undefined as number | undefined,
  };

  // Configuration
  private readonly maxRetries = 3;
  private readonly batchSize = 100; // URLs per batch
  private readonly processIntervalMs = 60000; // Process every minute
  private readonly retryDelayMs = 300000; // 5 minutes retry delay

  constructor(autoStart = false) {
    if (autoStart) {
      this.startProcessing();
    }
  }

  /**
   * Add URL to the queue with priority
   */
  addUrl(url: string, priority: QueuePriority = 'normal'): void {
    // Check if URL already exists
    const existing = this.queue.get(url);

    if (existing) {
      // Update priority if higher
      if (
        this.getPriorityValue(priority) >
        this.getPriorityValue(existing.priority)
      ) {
        existing.priority = priority;
      }
      return;
    }

    // Add new item
    this.queue.set(url, {
      url,
      priority,
      timestamp: Date.now(),
      retries: 0,
    });
  }

  /**
   * Add multiple URLs to the queue
   */
  addUrls(urls: string[], priority: QueuePriority = 'normal'): void {
    urls.forEach((url) => this.addUrl(url, priority));
  }

  /**
   * Remove URL from queue
   */
  removeUrl(url: string): boolean {
    return this.queue.delete(url);
  }

  /**
   * Clear entire queue
   */
  clear(): void {
    this.queue.clear();
  }

  /**
   * Get queue statistics
   */
  getStats(): QueueStats {
    let high = 0;
    let normal = 0;
    let low = 0;

    this.queue.forEach((item) => {
      switch (item.priority) {
        case 'high':
          high++;
          break;
        case 'normal':
          normal++;
          break;
        case 'low':
          low++;
          break;
      }
    });

    return {
      total: this.queue.size,
      high,
      normal,
      low,
      processing: this.processing,
      lastProcessed: this.stats.lastProcessed,
      successCount: this.stats.successCount,
      failureCount: this.stats.failureCount,
    };
  }

  /**
   * Start automatic queue processing
   */
  startProcessing(): void {
    if (this.processInterval) {
      return; // Already running
    }

    // Process immediately, then on interval
    this.processQueue();

    this.processInterval = setInterval(() => {
      this.processQueue();
    }, this.processIntervalMs);
  }

  /**
   * Stop automatic queue processing
   */
  stopProcessing(): void {
    if (this.processInterval) {
      clearInterval(this.processInterval);
      this.processInterval = null;
    }
  }

  /**
   * Process the queue
   */
  async processQueue(): Promise<void> {
    if (this.processing || this.queue.size === 0) {
      return;
    }

    this.processing = true;

    try {
      // Get items to process (sorted by priority and timestamp)
      const items = this.getNextBatch();

      if (items.length === 0) {
        return;
      }

      // Extract URLs
      const urls = items.map((item) => item.url);

      // Submit to IndexNow
      const result = await indexNowClient.submitUrls(urls);

      // Handle results
      await this.handleSubmissionResult(items, result);

      this.stats.lastProcessed = Date.now();
    } catch (error) {
      console.error('Queue processing error:', error);
      this.stats.failureCount++;
    } finally {
      this.processing = false;
    }
  }

  /**
   * Process queue once (manual trigger)
   */
  async processOnce(): Promise<SubmissionResult | null> {
    if (this.processing || this.queue.size === 0) {
      return null;
    }

    this.processing = true;

    try {
      const items = this.getNextBatch();

      if (items.length === 0) {
        return null;
      }

      const urls = items.map((item) => item.url);
      const result = await indexNowClient.submitUrls(urls);

      await this.handleSubmissionResult(items, result);

      return result;
    } finally {
      this.processing = false;
    }
  }

  /**
   * Get next batch of items to process
   */
  private getNextBatch(): QueueItem[] {
    const now = Date.now();
    const items: QueueItem[] = [];

    // Convert to array and filter eligible items
    const eligible = Array.from(this.queue.values()).filter((item) => {
      // Skip if recently attempted and failed
      if (item.lastAttempt && item.retries > 0) {
        const timeSinceLastAttempt = now - item.lastAttempt;
        if (timeSinceLastAttempt < this.retryDelayMs) {
          return false;
        }
      }

      // Skip if max retries exceeded
      if (item.retries >= this.maxRetries) {
        return false;
      }

      return true;
    });

    // Sort by priority and timestamp
    eligible.sort((a, b) => {
      const priorityDiff =
        this.getPriorityValue(b.priority) - this.getPriorityValue(a.priority);
      if (priorityDiff !== 0) {
        return priorityDiff;
      }
      return a.timestamp - b.timestamp; // Older first
    });

    // Take batch
    return eligible.slice(0, this.batchSize);
  }

  /**
   * Handle submission result
   */
  private async handleSubmissionResult(
    items: QueueItem[],
    result: SubmissionResult
  ): Promise<void> {
    if (result.success) {
      // Remove successful URLs from queue
      if (result.submittedUrls) {
        result.submittedUrls.forEach((url) => {
          this.queue.delete(url);
        });
        this.stats.successCount += result.submittedUrls.length;
      }
    } else {
      // Update retry count and timestamp for failed URLs
      items.forEach((item) => {
        const queueItem = this.queue.get(item.url);
        if (queueItem) {
          queueItem.retries++;
          queueItem.lastAttempt = Date.now();

          // Remove if max retries exceeded
          if (queueItem.retries >= this.maxRetries) {
            this.queue.delete(item.url);
            this.stats.failureCount++;
          }
        }
      });
    }
  }

  /**
   * Get numeric priority value
   */
  private getPriorityValue(priority: QueuePriority): number {
    switch (priority) {
      case 'high':
        return 3;
      case 'normal':
        return 2;
      case 'low':
        return 1;
      default:
        return 0;
    }
  }

  /**
   * Get all URLs in queue
   */
  getQueuedUrls(): string[] {
    return Array.from(this.queue.keys());
  }

  /**
   * Get detailed queue items
   */
  getQueueItems(): QueueItem[] {
    return Array.from(this.queue.values());
  }

  /**
   * Check if URL is in queue
   */
  hasUrl(url: string): boolean {
    return this.queue.has(url);
  }

  /**
   * Get queue size
   */
  get size(): number {
    return this.queue.size;
  }

  /**
   * Cleanup old failed items
   */
  cleanup(): number {
    let removed = 0;
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    this.queue.forEach((item, url) => {
      if (item.retries >= this.maxRetries) {
        const age = now - item.timestamp;
        if (age > maxAge) {
          this.queue.delete(url);
          removed++;
        }
      }
    });

    return removed;
  }
}

// Singleton instance
export const indexNowQueue = new IndexNowQueue();
