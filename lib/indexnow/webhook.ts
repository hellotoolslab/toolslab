/**
 * IndexNow Webhook for automatic URL submission
 * Triggered by deployments, updates, and other events
 */

import { indexNowQueue } from './queue';
import { indexNowClient } from './client';
import { getAllTools } from '@/lib/tools';

export interface WebhookEvent {
  type: 'deploy' | 'update' | 'enable' | 'disable' | 'bulk';
  toolSlug?: string;
  urls?: string[];
  priority?: 'high' | 'normal' | 'low';
  timestamp: number;
}

export class IndexNowWebhook {
  private siteUrl: string;

  constructor() {
    this.siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolslab.dev';
  }

  /**
   * Handle webhook event
   */
  async handleEvent(
    event: WebhookEvent
  ): Promise<{ success: boolean; message: string }> {
    switch (event.type) {
      case 'deploy':
        return this.handleDeploy(event.toolSlug);

      case 'update':
        return this.handleUpdate(event.toolSlug);

      case 'enable':
        return this.handleEnable(event.toolSlug);

      case 'disable':
        return this.handleDisable(event.toolSlug);

      case 'bulk':
        return this.handleBulk(event.urls);

      default:
        return {
          success: false,
          message: `Unknown event type: ${event.type}`,
        };
    }
  }

  /**
   * Handle new tool deployment
   */
  private async handleDeploy(
    toolSlug?: string
  ): Promise<{ success: boolean; message: string }> {
    if (!toolSlug) {
      return {
        success: false,
        message: 'Tool slug required for deploy event',
      };
    }

    const url = `${this.siteUrl}/tools/${toolSlug}`;

    // Submit immediately with high priority
    const result = await indexNowClient.submitSingle(url);

    if (result.success) {
      return {
        success: true,
        message: `Successfully submitted new tool: ${toolSlug}`,
      };
    }

    // If immediate submission fails, add to queue
    indexNowQueue.addUrl(url, 'high');

    return {
      success: true,
      message: `Added new tool to queue: ${toolSlug}`,
    };
  }

  /**
   * Handle tool update
   */
  private async handleUpdate(
    toolSlug?: string
  ): Promise<{ success: boolean; message: string }> {
    if (!toolSlug) {
      return {
        success: false,
        message: 'Tool slug required for update event',
      };
    }

    const url = `${this.siteUrl}/tools/${toolSlug}`;

    // Add to queue with normal priority
    indexNowQueue.addUrl(url, 'normal');

    return {
      success: true,
      message: `Added updated tool to queue: ${toolSlug}`,
    };
  }

  /**
   * Handle tool enable
   */
  private async handleEnable(
    toolSlug?: string
  ): Promise<{ success: boolean; message: string }> {
    if (!toolSlug) {
      return {
        success: false,
        message: 'Tool slug required for enable event',
      };
    }

    const url = `${this.siteUrl}/tools/${toolSlug}`;

    // Re-index enabled tool with high priority
    indexNowQueue.addUrl(url, 'high');

    return {
      success: true,
      message: `Added re-enabled tool to queue: ${toolSlug}`,
    };
  }

  /**
   * Handle tool disable
   */
  private async handleDisable(
    toolSlug?: string
  ): Promise<{ success: boolean; message: string }> {
    // For disabled tools, we might want to remove from queue but not submit
    if (!toolSlug) {
      return {
        success: false,
        message: 'Tool slug required for disable event',
      };
    }

    const url = `${this.siteUrl}/tools/${toolSlug}`;

    // Remove from queue if present
    indexNowQueue.removeUrl(url);

    return {
      success: true,
      message: `Removed disabled tool from queue: ${toolSlug}`,
    };
  }

  /**
   * Handle bulk URL submission
   */
  private async handleBulk(
    urls?: string[]
  ): Promise<{ success: boolean; message: string }> {
    if (!urls || urls.length === 0) {
      return {
        success: false,
        message: 'URLs required for bulk event',
      };
    }

    // Add all URLs to queue
    indexNowQueue.addUrls(urls, 'normal');

    return {
      success: true,
      message: `Added ${urls.length} URLs to queue`,
    };
  }

  /**
   * Submit all tools
   */
  async submitAllTools(): Promise<{
    success: boolean;
    message: string;
    count: number;
  }> {
    const tools = getAllTools();
    const urls = tools.map((tool) => `${this.siteUrl}${tool.route}`);

    // Add homepage and category pages
    urls.push(this.siteUrl);
    urls.push(`${this.siteUrl}/tools`);

    // Add all URLs to queue with normal priority
    indexNowQueue.addUrls(urls, 'normal');

    // Process immediately
    await indexNowQueue.processQueue();

    return {
      success: true,
      message: `Submitted ${urls.length} URLs to IndexNow`,
      count: urls.length,
    };
  }

  /**
   * Submit sitemap URLs
   */
  async submitFromSitemap(): Promise<{
    success: boolean;
    message: string;
    count: number;
  }> {
    try {
      // Fetch sitemap
      const sitemapUrl = `${this.siteUrl}/sitemap.xml`;
      const response = await fetch(sitemapUrl);

      if (!response.ok) {
        return {
          success: false,
          message: 'Failed to fetch sitemap',
          count: 0,
        };
      }

      const sitemapText = await response.text();

      // Extract URLs from sitemap
      const urlRegex = /<loc>(.*?)<\/loc>/g;
      const urls: string[] = [];
      let match;

      while ((match = urlRegex.exec(sitemapText)) !== null) {
        urls.push(match[1]);
      }

      if (urls.length === 0) {
        return {
          success: false,
          message: 'No URLs found in sitemap',
          count: 0,
        };
      }

      // Add to queue with priority based on URL type
      urls.forEach((url) => {
        let priority: 'high' | 'normal' | 'low' = 'normal';

        if (url === this.siteUrl || url.includes('/tools/')) {
          priority = 'high';
        } else if (url.includes('/privacy') || url.includes('/terms')) {
          priority = 'low';
        }

        indexNowQueue.addUrl(url, priority);
      });

      // Process immediately
      await indexNowQueue.processQueue();

      return {
        success: true,
        message: `Submitted ${urls.length} URLs from sitemap`,
        count: urls.length,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to process sitemap',
        count: 0,
      };
    }
  }

  /**
   * Test IndexNow configuration
   */
  async testConfiguration(): Promise<{
    success: boolean;
    keyFileExists: boolean;
    endpoints: { endpoint: string; available: boolean }[];
    testSubmission?: boolean;
  }> {
    // Check if key file is accessible
    const keyFileUrl = `${this.siteUrl}/${process.env.INDEXNOW_KEY || '3f6e2560c38248588ea3fc34a1a817a5'}.txt`;
    let keyFileExists = false;

    try {
      const response = await fetch(keyFileUrl);
      keyFileExists = response.ok;
    } catch {
      keyFileExists = false;
    }

    // Check endpoint availability
    const endpoints = await indexNowClient.getStats();

    // Try test submission
    let testSubmission = false;
    if (keyFileExists && endpoints.some((e) => e.available)) {
      const result = await indexNowClient.submitSingle(`${this.siteUrl}/test`);
      testSubmission = result.success;
    }

    return {
      success: keyFileExists && endpoints.some((e) => e.available),
      keyFileExists,
      endpoints,
      testSubmission,
    };
  }
}

// Singleton instance
export const indexNowWebhook = new IndexNowWebhook();
