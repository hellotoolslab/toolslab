// lib/seo/monitor.ts
import { ToolDiscovery } from './discovery';
import { SEOAutoSubmitter } from './auto-submit';

interface SEOHealthReport {
  timestamp: string;
  overall: {
    status: 'healthy' | 'warning' | 'error';
    score: number;
  };
  tools: {
    total: number;
    enabled: number;
    disabled: number;
    newSinceLastCheck: string[];
    missingPages: string[];
  };
  infrastructure: {
    sitemap: { accessible: boolean; status: number; lastModified?: string };
    robots: { accessible: boolean; status: number };
    indexNowKey: { valid: boolean; accessible: boolean };
  };
  search_engines: {
    google: { sitemapPinged: boolean; lastPing?: string };
    bing: { sitemapPinged: boolean; lastPing?: string };
    indexNow: { submitted: number; errors: string[] };
  };
  performance: {
    discoveryTime: number;
    submissionTime: number;
    totalTime: number;
  };
  recommendations: string[];
}

export class SEOMonitor {
  private discovery: ToolDiscovery;
  private submitter: SEOAutoSubmitter;
  private baseUrl: string;

  constructor() {
    this.discovery = new ToolDiscovery();
    this.submitter = new SEOAutoSubmitter();
    this.baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolslab.dev';
  }

  // Run complete SEO health check
  async runHealthCheck(autoSubmit: boolean = false): Promise<SEOHealthReport> {
    console.log('🔍 Running SEO Health Check...');
    const startTime = Date.now();

    const report: SEOHealthReport = {
      timestamp: new Date().toISOString(),
      overall: {
        status: 'healthy',
        score: 100,
      },
      tools: {
        total: 0,
        enabled: 0,
        disabled: 0,
        newSinceLastCheck: [],
        missingPages: [],
      },
      infrastructure: {
        sitemap: { accessible: false, status: 0 },
        robots: { accessible: false, status: 0 },
        indexNowKey: { valid: false, accessible: false },
      },
      search_engines: {
        google: { sitemapPinged: false },
        bing: { sitemapPinged: false },
        indexNow: { submitted: 0, errors: [] },
      },
      performance: {
        discoveryTime: 0,
        submissionTime: 0,
        totalTime: 0,
      },
      recommendations: [],
    };

    try {
      // 1. Check tools
      const discoveryStart = Date.now();
      await this.checkTools(report);
      report.performance.discoveryTime = Date.now() - discoveryStart;

      // 2. Check infrastructure
      await Promise.all([
        this.checkSitemap(report),
        this.checkRobots(report),
        this.checkIndexNowKey(report),
      ]);

      // 3. Auto-submit if requested and there are new tools
      if (
        autoSubmit &&
        (report.tools.newSinceLastCheck.length > 0 ||
          report.tools.missingPages.length === 0)
      ) {
        console.log(`📤 Auto-submitting due to changes...`);
        const submissionStart = Date.now();
        const submissionResult = await this.submitter.submitAll();
        report.performance.submissionTime = Date.now() - submissionStart;

        report.search_engines.indexNow = {
          submitted: submissionResult.submitted,
          errors: submissionResult.results.indexNow.errors,
        };
        report.search_engines.google.sitemapPinged =
          submissionResult.results.google;
        report.search_engines.bing.sitemapPinged =
          submissionResult.results.bing;

        if (submissionResult.results.google) {
          report.search_engines.google.lastPing = new Date().toISOString();
        }
        if (submissionResult.results.bing) {
          report.search_engines.bing.lastPing = new Date().toISOString();
        }
      }

      // 4. Calculate overall health
      this.calculateHealthScore(report);

      // 5. Generate recommendations
      this.generateRecommendations(report);

      report.performance.totalTime = Date.now() - startTime;

      console.log(
        `✅ Health check complete - Status: ${report.overall.status} (Score: ${report.overall.score}/100)`
      );

      return report;
    } catch (error) {
      console.error('❌ Health check failed:', error);
      report.overall.status = 'error';
      report.overall.score = 0;
      report.recommendations.push(
        'Health check failed - please check system logs'
      );
      report.performance.totalTime = Date.now() - startTime;
      return report;
    }
  }

  private async checkTools(report: SEOHealthReport): Promise<void> {
    try {
      const tools = await this.discovery.discoverAllTools();

      report.tools.total = tools.length;
      report.tools.enabled = tools.filter((t) => t.exists).length;
      report.tools.disabled = tools.filter((t) => !t.exists).length;

      // Check for missing pages (tools that should exist but don't)
      const staticTools = tools.filter((t) => t.source === 'static-data');
      const missingPages = staticTools.filter((t) => !t.exists);
      report.tools.missingPages = missingPages.map((t) => t.slug);

      console.log(
        `📊 Tools: ${report.tools.enabled}/${report.tools.total} enabled`
      );
      if (report.tools.missingPages.length > 0) {
        console.warn(
          `⚠️ Missing pages: ${report.tools.missingPages.join(', ')}`
        );
      }
    } catch (error) {
      console.error('Tool check failed:', error);
      report.recommendations.push(
        'Failed to check tools - discovery system may be broken'
      );
    }
  }

  private async checkSitemap(report: SEOHealthReport): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/sitemap.xml`, {
        method: 'HEAD',
        headers: { 'User-Agent': 'ToolsLab-SEO-Monitor/1.0' },
      });

      report.infrastructure.sitemap.accessible = response.ok;
      report.infrastructure.sitemap.status = response.status;

      if (response.ok) {
        report.infrastructure.sitemap.lastModified =
          response.headers.get('last-modified') || undefined;
        console.log('✅ Sitemap accessible');
      } else {
        console.error(`❌ Sitemap not accessible: ${response.status}`);
      }
    } catch (error) {
      console.error('Sitemap check failed:', error);
      report.infrastructure.sitemap.accessible = false;
    }
  }

  private async checkRobots(report: SEOHealthReport): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/robots.txt`, {
        method: 'HEAD',
        headers: { 'User-Agent': 'ToolsLab-SEO-Monitor/1.0' },
      });

      report.infrastructure.robots.accessible = response.ok;
      report.infrastructure.robots.status = response.status;

      if (response.ok) {
        console.log('✅ Robots.txt accessible');
      } else {
        console.error(`❌ Robots.txt not accessible: ${response.status}`);
      }
    } catch (error) {
      console.error('Robots.txt check failed:', error);
      report.infrastructure.robots.accessible = false;
    }
  }

  private async checkIndexNowKey(report: SEOHealthReport): Promise<void> {
    try {
      const isValid = await this.submitter.validateIndexNowKey();
      report.infrastructure.indexNowKey.valid = isValid;
      report.infrastructure.indexNowKey.accessible = isValid;

      if (isValid) {
        console.log('✅ IndexNow key valid and accessible');
      } else {
        console.error('❌ IndexNow key validation failed');
      }
    } catch (error) {
      console.error('IndexNow key check failed:', error);
      report.infrastructure.indexNowKey.valid = false;
      report.infrastructure.indexNowKey.accessible = false;
    }
  }

  private calculateHealthScore(report: SEOHealthReport): void {
    let score = 100;
    let status: 'healthy' | 'warning' | 'error' = 'healthy';

    // Infrastructure penalties
    if (!report.infrastructure.sitemap.accessible) {
      score -= 20;
      status = 'error';
    }
    if (!report.infrastructure.robots.accessible) {
      score -= 10;
      status = status === 'error' ? 'error' : 'warning';
    }
    if (!report.infrastructure.indexNowKey.valid) {
      score -= 15;
      status = status === 'error' ? 'error' : 'warning';
    }

    // Tools penalties
    if (report.tools.missingPages.length > 0) {
      score -= Math.min(report.tools.missingPages.length * 5, 25);
      status = status === 'error' ? 'error' : 'warning';
    }

    // Search engine submission penalties
    if (report.search_engines.indexNow.errors.length > 0) {
      score -= 10;
      status = status === 'error' ? 'error' : 'warning';
    }

    report.overall.score = Math.max(score, 0);
    report.overall.status =
      score >= 90 ? 'healthy' : score >= 70 ? 'warning' : 'error';
  }

  private generateRecommendations(report: SEOHealthReport): void {
    const recs: string[] = [];

    if (!report.infrastructure.sitemap.accessible) {
      recs.push('Fix sitemap.xml - it is not accessible to search engines');
    }

    if (!report.infrastructure.robots.accessible) {
      recs.push('Fix robots.txt - it should be accessible at /robots.txt');
    }

    if (!report.infrastructure.indexNowKey.valid) {
      recs.push('Generate and deploy IndexNow API key for faster indexing');
    }

    if (report.tools.missingPages.length > 0) {
      recs.push(
        `Create missing tool pages: ${report.tools.missingPages.slice(0, 3).join(', ')}${report.tools.missingPages.length > 3 ? ` and ${report.tools.missingPages.length - 3} more` : ''}`
      );
    }

    if (report.tools.disabled > 0) {
      recs.push(
        `Consider enabling ${report.tools.disabled} disabled tools or remove them from configuration`
      );
    }

    if (report.search_engines.indexNow.errors.length > 0) {
      recs.push(
        'Review IndexNow submission errors and retry failed submissions'
      );
    }

    if (report.performance.totalTime > 10000) {
      recs.push(
        'Health check is taking too long - consider optimizing discovery process'
      );
    }

    if (recs.length === 0 && report.overall.score >= 95) {
      recs.push(
        'SEO setup is excellent! Consider monitoring search performance in Google Search Console'
      );
    }

    report.recommendations = recs;
  }

  // Quick status check (faster, less detailed)
  async quickHealthCheck(): Promise<{
    status: 'healthy' | 'warning' | 'error';
    toolsEnabled: number;
    sitemapOk: boolean;
    timestamp: string;
  }> {
    try {
      const [tools, sitemapResponse] = await Promise.all([
        this.discovery.getTools(),
        fetch(`${this.baseUrl}/sitemap.xml`, { method: 'HEAD' }).catch(() => ({
          ok: false,
        })),
      ]);

      const enabledTools = tools.filter((t) => t.exists).length;
      const sitemapOk = sitemapResponse.ok;

      const status = sitemapOk && enabledTools > 0 ? 'healthy' : 'warning';

      return {
        status,
        toolsEnabled: enabledTools,
        sitemapOk,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        toolsEnabled: 0,
        sitemapOk: false,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Get monitoring statistics
  getMonitoringStats() {
    return {
      lastCheck: new Date().toISOString(),
      version: '1.0.0',
      features: [
        'Auto-discovery',
        'Dynamic sitemap',
        'IndexNow submission',
        'Search engine pinging',
        'Health monitoring',
      ],
    };
  }
}
