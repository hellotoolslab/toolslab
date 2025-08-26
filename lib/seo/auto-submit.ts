// lib/seo/auto-submit.ts
import { ToolDiscovery } from './discovery';

export class SEOAutoSubmitter {
  private indexNowKey: string;
  private baseUrl: string;
  private discovery: ToolDiscovery;

  constructor() {
    this.indexNowKey = process.env.INDEXNOW_API_KEY || this.generateKey();
    this.baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolslab.dev';
    this.discovery = new ToolDiscovery();
  }

  // Generate IndexNow key if not exists
  private generateKey(): string {
    return Array.from({ length: 32 }, () =>
      Math.random().toString(36).charAt(2)
    ).join('');
  }

  // Submit URLs to IndexNow (Bing, Yandex, Seznam, Naver)
  async submitToIndexNow(urls: string[]): Promise<{
    success: boolean;
    submitted: number;
    errors: string[];
  }> {
    if (!this.indexNowKey || urls.length === 0) {
      return { success: false, submitted: 0, errors: ['No API key or URLs'] };
    }

    const errors: string[] = [];
    let totalSubmitted = 0;

    try {
      // IndexNow has a limit of 10,000 URLs per request, but we'll batch at 100 for safety
      const batchSize = 100;
      const batches = [];

      for (let i = 0; i < urls.length; i += batchSize) {
        batches.push(urls.slice(i, i + batchSize));
      }

      for (const batch of batches) {
        try {
          const response = await fetch('https://api.indexnow.org/indexnow', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
              'User-Agent': 'ToolsLab-SEO-Bot/1.0',
            },
            body: JSON.stringify({
              host: new URL(this.baseUrl).hostname,
              key: this.indexNowKey,
              keyLocation: `${this.baseUrl}/${this.indexNowKey}.txt`,
              urlList: batch,
            }),
          });

          if (response.ok || response.status === 202) {
            console.log(
              `✅ IndexNow: Submitted ${batch.length} URLs (Status: ${response.status})`
            );
            totalSubmitted += batch.length;
          } else {
            const errorText = await response.text();
            console.error(
              `❌ IndexNow batch failed: ${response.status} - ${errorText}`
            );
            errors.push(`Batch failed: ${response.status}`);
          }

          // Rate limiting - wait between batches
          if (batches.length > 1) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        } catch (batchError) {
          console.error('IndexNow batch error:', batchError);
          errors.push(`Batch error: ${batchError}`);
        }
      }

      return {
        success: totalSubmitted > 0,
        submitted: totalSubmitted,
        errors,
      };
    } catch (error) {
      console.error('IndexNow submission error:', error);
      return {
        success: false,
        submitted: 0,
        errors: [`General error: ${error}`],
      };
    }
  }

  // Ping Google about sitemap update
  async pingGoogle(): Promise<boolean> {
    const sitemapUrl = encodeURIComponent(`${this.baseUrl}/sitemap.xml`);
    const pingUrl = `https://www.google.com/ping?sitemap=${sitemapUrl}`;

    try {
      const response = await fetch(pingUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'ToolsLab-SEO-Bot/1.0',
        },
      });

      if (response.ok) {
        console.log('✅ Google: Sitemap pinged successfully');
        return true;
      } else {
        console.error(`❌ Google ping failed: ${response.status}`);
        return false;
      }
    } catch (error) {
      console.error('❌ Google ping failed:', error);
      return false;
    }
  }

  // Ping Bing about sitemap update
  async pingBing(): Promise<boolean> {
    const sitemapUrl = encodeURIComponent(`${this.baseUrl}/sitemap.xml`);
    const pingUrl = `https://www.bing.com/ping?sitemap=${sitemapUrl}`;

    try {
      const response = await fetch(pingUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'ToolsLab-SEO-Bot/1.0',
        },
      });

      if (response.ok) {
        console.log('✅ Bing: Sitemap pinged successfully');
        return true;
      } else {
        console.error(`❌ Bing ping failed: ${response.status}`);
        return false;
      }
    } catch (error) {
      console.error('❌ Bing ping failed:', error);
      return false;
    }
  }

  // Auto-submit all discovered content
  async submitAll(): Promise<{
    submitted: number;
    timestamp: string;
    breakdown: {
      tools: number;
      categories: number;
      staticPages: number;
      total: number;
    };
    results: {
      indexNow: { success: boolean; submitted: number; errors: string[] };
      google: boolean;
      bing: boolean;
    };
  }> {
    console.log('🚀 Starting comprehensive SEO submission...');

    // Discover all content
    const tools = await this.discovery.discoverAllTools();
    const categories = await this.discovery.discoverCategories();
    const staticPages = await this.discovery.discoverStaticPages();

    // Filter to only existing/enabled tools
    const existingTools = tools.filter((tool) => tool.exists);

    // Build URL list
    const urls = [
      this.baseUrl,
      `${this.baseUrl}/tools`,
      `${this.baseUrl}/categories`,
      ...existingTools.map((tool) => `${this.baseUrl}${tool.path}`),
      ...categories.map((cat) => `${this.baseUrl}/category/${cat}`),
      ...staticPages.map((page) => `${this.baseUrl}${page}`),
    ];

    // Remove duplicates
    const uniqueUrls = [...new Set(urls)];

    console.log(`📊 Submitting ${uniqueUrls.length} URLs:`);
    console.log(`   - ${existingTools.length} tool pages`);
    console.log(`   - ${categories.length} category pages`);
    console.log(`   - ${staticPages.length} static pages`);
    console.log(`   - 3 main pages (home, tools, categories)`);

    // Submit to IndexNow
    const indexNowResult = await this.submitToIndexNow(uniqueUrls);

    // Ping search engines
    const googleResult = await this.pingGoogle();
    const bingResult = await this.pingBing();

    const result = {
      submitted: indexNowResult.submitted,
      timestamp: new Date().toISOString(),
      breakdown: {
        tools: existingTools.length,
        categories: categories.length,
        staticPages: staticPages.length,
        total: uniqueUrls.length,
      },
      results: {
        indexNow: indexNowResult,
        google: googleResult,
        bing: bingResult,
      },
    };

    console.log(`✅ Submission complete:`);
    console.log(
      `   - IndexNow: ${indexNowResult.submitted}/${uniqueUrls.length} URLs`
    );
    console.log(`   - Google ping: ${googleResult ? 'Success' : 'Failed'}`);
    console.log(`   - Bing ping: ${bingResult ? 'Success' : 'Failed'}`);

    return result;
  }

  // Submit single new tool
  async submitNewTool(toolSlug: string): Promise<boolean> {
    console.log(`📤 Submitting new tool: ${toolSlug}`);

    const url = `${this.baseUrl}/tools/${toolSlug}`;

    // Submit to IndexNow
    const indexNowResult = await this.submitToIndexNow([url]);

    // Ping search engines about sitemap changes
    const googleResult = await this.pingGoogle();
    const bingResult = await this.pingBing();

    const success = indexNowResult.success && googleResult && bingResult;
    console.log(
      `${success ? '✅' : '⚠️'} Tool submission result: IndexNow=${indexNowResult.success}, Google=${googleResult}, Bing=${bingResult}`
    );

    return success;
  }

  // Submit multiple specific URLs
  async submitUrls(urls: string[]): Promise<{
    success: boolean;
    submitted: number;
    failed: number;
  }> {
    const indexNowResult = await this.submitToIndexNow(urls);

    return {
      success: indexNowResult.success,
      submitted: indexNowResult.submitted,
      failed: urls.length - indexNowResult.submitted,
    };
  }

  // Get IndexNow key for verification
  getIndexNowKey(): string {
    return this.indexNowKey;
  }

  // Validate that IndexNow key file is accessible
  async validateIndexNowKey(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.indexNowKey}.txt`);
      const text = await response.text();
      return response.ok && text.trim() === this.indexNowKey;
    } catch (error) {
      console.error('IndexNow key validation failed:', error);
      return false;
    }
  }
}

// Utility function for Next.js API routes
export async function handleSEOSubmission(request: Request): Promise<Response> {
  try {
    const submitter = new SEOAutoSubmitter();
    const result = await submitter.submitAll();

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Submission failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
