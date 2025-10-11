#!/usr/bin/env tsx
/**
 * Canonical URL Audit Script
 *
 * Audits all URLs in the sitemap to ensure:
 * 1. Each URL is in canonical format
 * 2. Each page has a canonical tag
 * 3. Canonical tag matches the sitemap URL
 * 4. No redirects in sitemap
 * 5. No trailing slash issues
 *
 * Usage: npm run audit:canonical
 */

import { URLNormalizer } from '../lib/seo/url-normalizer';

interface CanonicalIssue {
  url: string;
  issue:
    | 'MISSING_CANONICAL'
    | 'CANONICAL_MISMATCH'
    | 'URL_REDIRECTS'
    | 'NOT_NORMALIZED'
    | 'TRAILING_SLASH'
    | 'HAS_PARAMETERS'
    | 'FETCH_FAILED';
  canonical?: string;
  expected?: string;
  finalUrl?: string;
  status?: number;
  message?: string;
}

interface AuditReport {
  totalUrls: number;
  issuesFound: number;
  issues: CanonicalIssue[];
  byType: Record<string, number>;
}

/**
 * Fetch sitemap URLs from the site
 */
async function fetchSitemapUrls(): Promise<string[]> {
  const sitemapUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolslab.dev';

  try {
    console.log(`📥 Fetching sitemap from ${sitemapUrl}/sitemap.xml...`);

    const response = await fetch(`${sitemapUrl}/sitemap.xml`);
    if (!response.ok) {
      throw new Error(`Failed to fetch sitemap: ${response.status}`);
    }

    const xml = await response.text();

    // Extract URLs from sitemap XML
    const urlMatches = xml.matchAll(/<loc>([^<]+)<\/loc>/g);
    const urls = Array.from(urlMatches).map((match) => match[1]);

    console.log(`✅ Found ${urls.length} URLs in sitemap\n`);

    return urls;
  } catch (error) {
    console.error(`❌ Failed to fetch sitemap:`, error);
    return [];
  }
}

/**
 * Extract canonical tag from HTML
 */
function extractCanonical(html: string): string | null {
  const canonicalMatch = html.match(
    /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i
  );
  return canonicalMatch ? canonicalMatch[1] : null;
}

/**
 * Audit a single URL
 */
async function auditUrl(url: string): Promise<CanonicalIssue[]> {
  const issues: CanonicalIssue[] = [];

  // Check if URL is normalized
  if (!URLNormalizer.isCanonical(url)) {
    issues.push({
      url,
      issue: 'NOT_NORMALIZED',
      canonical: URLNormalizer.normalize(url),
    });
  }

  // Check trailing slash
  if (URLNormalizer.hasTrailingSlashIssue(url)) {
    issues.push({
      url,
      issue: 'TRAILING_SLASH',
    });
  }

  // Check parameters
  if (url.includes('?') || url.includes('#')) {
    issues.push({
      url,
      issue: 'HAS_PARAMETERS',
    });
  }

  // Fetch page and check canonical tag
  try {
    const response = await fetch(url, {
      redirect: 'manual',
      headers: {
        'User-Agent': 'ToolsLab-Canonical-Audit/1.0',
      },
    });

    // Check for redirects
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      issues.push({
        url,
        issue: 'URL_REDIRECTS',
        status: response.status,
        finalUrl: location || undefined,
      });
      return issues; // Don't check canonical if it redirects
    }

    if (!response.ok) {
      issues.push({
        url,
        issue: 'FETCH_FAILED',
        status: response.status,
      });
      return issues;
    }

    const html = await response.text();
    const canonical = extractCanonical(html);

    if (!canonical) {
      issues.push({
        url,
        issue: 'MISSING_CANONICAL',
      });
    } else if (canonical !== url) {
      issues.push({
        url,
        issue: 'CANONICAL_MISMATCH',
        canonical,
        expected: url,
      });
    }
  } catch (error) {
    issues.push({
      url,
      issue: 'FETCH_FAILED',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  return issues;
}

/**
 * Generate audit report
 */
function generateReport(
  issues: CanonicalIssue[],
  totalUrls: number
): AuditReport {
  const byType: Record<string, number> = {};

  issues.forEach((issue) => {
    byType[issue.issue] = (byType[issue.issue] || 0) + 1;
  });

  return {
    totalUrls,
    issuesFound: issues.length,
    issues,
    byType,
  };
}

/**
 * Print report to console
 */
function printReport(report: AuditReport) {
  console.log('\n' + '='.repeat(80));
  console.log('📊 CANONICAL URL AUDIT REPORT');
  console.log('='.repeat(80) + '\n');

  console.log(`📈 SUMMARY:`);
  console.log(`   Total URLs: ${report.totalUrls}`);
  console.log(`   Issues Found: ${report.issuesFound}`);
  console.log(`   Clean URLs: ${report.totalUrls - report.issuesFound}\n`);

  if (report.issuesFound === 0) {
    console.log('✅ ALL URLS ARE CANONICAL - NO ISSUES FOUND!\n');
    return;
  }

  console.log('❌ ISSUES BY TYPE:\n');
  Object.entries(report.byType)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`);
    });

  console.log('\n' + '-'.repeat(80) + '\n');

  // Group issues by type
  const grouped = new Map<string, CanonicalIssue[]>();
  report.issues.forEach((issue) => {
    if (!grouped.has(issue.issue)) {
      grouped.set(issue.issue, []);
    }
    grouped.get(issue.issue)!.push(issue);
  });

  // Print each group
  grouped.forEach((issues, type) => {
    console.log(`\n❌ ${type} (${issues.length}):\n`);
    issues.slice(0, 10).forEach((issue) => {
      console.log(`   URL: ${issue.url}`);
      if (issue.canonical) {
        console.log(`   Canonical: ${issue.canonical}`);
      }
      if (issue.expected) {
        console.log(`   Expected: ${issue.expected}`);
      }
      if (issue.finalUrl) {
        console.log(`   Redirects to: ${issue.finalUrl}`);
      }
      if (issue.status) {
        console.log(`   Status: ${issue.status}`);
      }
      if (issue.message) {
        console.log(`   Error: ${issue.message}`);
      }
      console.log('');
    });

    if (issues.length > 10) {
      console.log(`   ... and ${issues.length - 10} more\n`);
    }
  });

  console.log('='.repeat(80));
  console.log('💡 RECOMMENDATIONS:\n');

  if (report.byType['CANONICAL_MISMATCH']) {
    console.log(
      '   1. Fix canonical tags in page metadata to match sitemap URLs'
    );
  }
  if (report.byType['URL_REDIRECTS']) {
    console.log(
      '   2. Remove redirect URLs from sitemap - use final destination'
    );
  }
  if (report.byType['NOT_NORMALIZED']) {
    console.log(
      '   3. Normalize all URLs in sitemap (use URLNormalizer.normalize())'
    );
  }
  if (report.byType['TRAILING_SLASH']) {
    console.log('   4. Remove trailing slashes from URLs (except homepage)');
  }
  if (report.byType['HAS_PARAMETERS']) {
    console.log(
      '   5. Remove query parameters and hash fragments from sitemap'
    );
  }
  if (report.byType['MISSING_CANONICAL']) {
    console.log('   6. Add canonical tags to all pages');
  }

  console.log('\n   Run: npm run fix:canonical');
  console.log('');
}

/**
 * Main audit function
 */
async function auditCanonicals() {
  console.log('🔍 Starting Canonical URL Audit...\n');

  const urls = await fetchSitemapUrls();

  if (urls.length === 0) {
    console.error('❌ No URLs found in sitemap');
    process.exit(1);
  }

  console.log(`🔍 Auditing ${urls.length} URLs...\n`);

  const allIssues: CanonicalIssue[] = [];
  let processed = 0;

  // Process in batches to avoid overwhelming the server
  const batchSize = 5;
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map((url) => auditUrl(url)));

    batchResults.forEach((issues) => allIssues.push(...issues));
    processed += batch.length;

    // Progress indicator
    if (processed % 10 === 0 || processed === urls.length) {
      console.log(`   Processed: ${processed}/${urls.length} URLs`);
    }

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  const report = generateReport(allIssues, urls.length);
  printReport(report);

  // Exit with error code if issues found
  process.exit(report.issuesFound > 0 ? 1 : 0);
}

// Run audit
auditCanonicals().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
