/**
 * Unit tests for IndexNow Queue
 */

import { IndexNowQueue, QueueItem } from '@/lib/indexnow/queue';
import { indexNowClient } from '@/lib/indexnow/client';

// Mock the client
jest.mock('@/lib/indexnow/client', () => ({
  indexNowClient: {
    submitUrls: jest.fn(),
  },
}));

describe('IndexNowQueue', () => {
  let queue: IndexNowQueue;

  beforeEach(() => {
    jest.clearAllMocks();
    queue = new IndexNowQueue(false); // Don't auto-start
  });

  afterEach(() => {
    queue.stopProcessing();
    queue.clear();
  });

  describe('addUrl', () => {
    it('should add URL to queue with correct priority', () => {
      queue.addUrl('https://toolslab.dev/tools/test', 'high');

      expect(queue.size).toBe(1);
      expect(queue.hasUrl('https://toolslab.dev/tools/test')).toBe(true);

      const stats = queue.getStats();
      expect(stats.high).toBe(1);
      expect(stats.normal).toBe(0);
      expect(stats.low).toBe(0);
    });

    it('should not duplicate URLs', () => {
      queue.addUrl('https://toolslab.dev/tools/test', 'normal');
      queue.addUrl('https://toolslab.dev/tools/test', 'normal');

      expect(queue.size).toBe(1);
    });

    it('should upgrade priority if higher', () => {
      queue.addUrl('https://toolslab.dev/tools/test', 'low');
      queue.addUrl('https://toolslab.dev/tools/test', 'high');

      const stats = queue.getStats();
      expect(stats.high).toBe(1);
      expect(stats.low).toBe(0);
    });
  });

  describe('addUrls', () => {
    it('should add multiple URLs at once', () => {
      const urls = [
        'https://toolslab.dev/tools/test1',
        'https://toolslab.dev/tools/test2',
        'https://toolslab.dev/tools/test3',
      ];

      queue.addUrls(urls, 'normal');

      expect(queue.size).toBe(3);
      expect(queue.getStats().normal).toBe(3);
    });
  });

  describe('removeUrl', () => {
    it('should remove URL from queue', () => {
      queue.addUrl('https://toolslab.dev/tools/test', 'normal');

      const removed = queue.removeUrl('https://toolslab.dev/tools/test');

      expect(removed).toBe(true);
      expect(queue.size).toBe(0);
    });

    it('should return false for non-existent URL', () => {
      const removed = queue.removeUrl('https://toolslab.dev/tools/nonexistent');

      expect(removed).toBe(false);
    });
  });

  describe('processQueue', () => {
    it('should process URLs in priority order', async () => {
      (indexNowClient.submitUrls as jest.Mock).mockResolvedValue({
        success: true,
        submittedUrls: [],
        timestamp: Date.now(),
      });

      queue.addUrl('https://toolslab.dev/tools/low', 'low');
      queue.addUrl('https://toolslab.dev/tools/high', 'high');
      queue.addUrl('https://toolslab.dev/tools/normal', 'normal');

      await queue.processQueue();

      const calls = (indexNowClient.submitUrls as jest.Mock).mock.calls;
      expect(calls[0][0][0]).toContain('high');
      expect(calls[0][0][1]).toContain('normal');
      expect(calls[0][0][2]).toContain('low');
    });

    it('should remove successful URLs from queue', async () => {
      const urls = [
        'https://toolslab.dev/tools/test1',
        'https://toolslab.dev/tools/test2',
      ];

      (indexNowClient.submitUrls as jest.Mock).mockResolvedValue({
        success: true,
        submittedUrls: urls,
        timestamp: Date.now(),
      });

      queue.addUrls(urls, 'normal');
      await queue.processQueue();

      expect(queue.size).toBe(0);
      expect(queue.getStats().successCount).toBe(2);
    });

    it('should retry failed URLs', async () => {
      const url = 'https://toolslab.dev/tools/test';

      (indexNowClient.submitUrls as jest.Mock).mockResolvedValue({
        success: false,
        failedUrls: [url],
        timestamp: Date.now(),
      });

      queue.addUrl(url, 'normal');
      await queue.processQueue();

      expect(queue.size).toBe(1);
      const items = queue.getQueueItems();
      expect(items[0].retries).toBe(1);
    });

    it('should not process if already processing', async () => {
      (indexNowClient.submitUrls as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      queue.addUrl('https://toolslab.dev/tools/test', 'normal');

      const process1 = queue.processQueue();
      const process2 = queue.processQueue();

      await Promise.all([process1, process2]);

      expect(indexNowClient.submitUrls).toHaveBeenCalledTimes(1);
    });
  });

  describe('getStats', () => {
    it('should return accurate statistics', () => {
      queue.addUrl('https://toolslab.dev/tools/high1', 'high');
      queue.addUrl('https://toolslab.dev/tools/high2', 'high');
      queue.addUrl('https://toolslab.dev/tools/normal', 'normal');
      queue.addUrl('https://toolslab.dev/tools/low', 'low');

      const stats = queue.getStats();

      expect(stats.total).toBe(4);
      expect(stats.high).toBe(2);
      expect(stats.normal).toBe(1);
      expect(stats.low).toBe(1);
      expect(stats.processing).toBe(false);
    });
  });

  describe('cleanup', () => {
    it('should remove old failed items', () => {
      const item: QueueItem = {
        url: 'https://toolslab.dev/tools/test',
        priority: 'normal',
        timestamp: Date.now() - 25 * 60 * 60 * 1000, // 25 hours ago
        retries: 3,
      };

      // Directly add to internal queue for testing
      (queue as any).queue.set(item.url, item);

      const removed = queue.cleanup();

      expect(removed).toBe(1);
      expect(queue.size).toBe(0);
    });

    it('should keep recent failed items', () => {
      const item: QueueItem = {
        url: 'https://toolslab.dev/tools/test',
        priority: 'normal',
        timestamp: Date.now() - 1000, // 1 second ago
        retries: 3,
      };

      (queue as any).queue.set(item.url, item);

      const removed = queue.cleanup();

      expect(removed).toBe(0);
      expect(queue.size).toBe(1);
    });
  });

  describe('automatic processing', () => {
    it('should start and stop automatic processing', () => {
      queue.startProcessing();
      expect((queue as any).processInterval).not.toBeNull();

      queue.stopProcessing();
      expect((queue as any).processInterval).toBeNull();
    });

    it('should not create multiple intervals', () => {
      queue.startProcessing();
      const interval1 = (queue as any).processInterval;

      queue.startProcessing();
      const interval2 = (queue as any).processInterval;

      expect(interval1).toBe(interval2);
    });
  });
});
