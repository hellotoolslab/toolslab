#!/usr/bin/env ts-node

import { tools } from '../lib/tools';

interface TestResult {
  url: string;
  status: 'success' | 'error';
  statusCode?: number;
  error?: string;
  responseTime?: number;
}

/**
 * Test OG Images generation script
 *
 * This script tests the generation of all Open Graph images to ensure they work correctly.
 * It can be run against localhost during development or against the deployed site.
 *
 * Usage:
 * - Development: npm run test:og-images
 * - Production: npm run test:og-images -- --base-url https://toolslab.dev
 */

const BASE_URL = process.argv.includes('--base-url')
  ? process.argv[process.argv.indexOf('--base-url') + 1]
  : 'http://localhost:3000';

const TIMEOUT_MS = 10000; // 10 seconds timeout

async function testOGImage(url: string): Promise<TestResult> {
  const startTime = Date.now();

  try {
    console.log(`Testing: ${url}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'ToolsLab-OG-Test/1.0',
      },
    });

    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;

    if (!response.ok) {
      return {
        url,
        status: 'error',
        statusCode: response.status,
        error: `HTTP ${response.status}: ${response.statusText}`,
        responseTime,
      };
    }

    // Check if response is actually an image
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      return {
        url,
        status: 'error',
        statusCode: response.status,
        error: `Invalid content-type: ${contentType}. Expected image/*`,
        responseTime,
      };
    }

    // Check image size (should be reasonable)
    const contentLength = response.headers.get('content-length');
    if (contentLength) {
      const size = parseInt(contentLength);
      if (size > 5 * 1024 * 1024) {
        // 5MB limit
        console.warn(
          `Warning: Large image size for ${url}: ${(size / 1024 / 1024).toFixed(2)}MB`
        );
      }
    }

    return {
      url,
      status: 'success',
      statusCode: response.status,
      responseTime,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    return {
      url,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime,
    };
  }
}

async function testAllOGImages(): Promise<void> {
  console.log('🧪 ToolsLab Open Graph Images Test Suite');
  console.log('='.repeat(50));
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Timeout: ${TIMEOUT_MS}ms`);
  console.log('');

  const results: TestResult[] = [];

  // Test URLs to check
  const testUrls = [
    // Homepage OG images
    `${BASE_URL}/opengraph-image`,
    `${BASE_URL}/twitter-image`,

    // Tool OG images (test all available tools)
    ...tools.map((tool) => `${BASE_URL}/tools/${tool.id}/opengraph-image`),
    ...tools.map((tool) => `${BASE_URL}/tools/${tool.id}/twitter-image`),

    // Test some invalid URLs to ensure fallback works
    `${BASE_URL}/tools/non-existent-tool/opengraph-image`,
    `${BASE_URL}/tools/another-invalid/twitter-image`,
  ];

  console.log(`Testing ${testUrls.length} Open Graph images...\n`);

  // Run tests in batches to avoid overwhelming the server
  const BATCH_SIZE = 5;
  const batches = [];

  for (let i = 0; i < testUrls.length; i += BATCH_SIZE) {
    batches.push(testUrls.slice(i, i + BATCH_SIZE));
  }

  let completed = 0;
  for (const batch of batches) {
    const batchPromises = batch.map((url) => testOGImage(url));
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    completed += batch.length;

    console.log(
      `Completed: ${completed}/${testUrls.length} (${Math.round((completed / testUrls.length) * 100)}%)`
    );
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(50));

  const successful = results.filter((r) => r.status === 'success');
  const failed = results.filter((r) => r.status === 'error');

  console.log(`✅ Successful: ${successful.length}`);
  console.log(`❌ Failed: ${failed.length}`);
  console.log(
    `📈 Success Rate: ${Math.round((successful.length / results.length) * 100)}%`
  );

  if (successful.length > 0) {
    const avgResponseTime =
      successful.reduce((sum, r) => sum + (r.responseTime || 0), 0) /
      successful.length;
    console.log(`⚡ Average Response Time: ${Math.round(avgResponseTime)}ms`);
  }

  console.log('');

  // Show failed tests
  if (failed.length > 0) {
    console.log('❌ FAILED TESTS:');
    console.log('-'.repeat(30));
    failed.forEach((result) => {
      console.log(`🔴 ${result.url}`);
      console.log(`   Error: ${result.error}`);
      if (result.statusCode) {
        console.log(`   Status: ${result.statusCode}`);
      }
      console.log(`   Time: ${result.responseTime}ms`);
      console.log('');
    });
  }

  // Show performance warnings
  const slowTests = successful.filter((r) => (r.responseTime || 0) > 5000);
  if (slowTests.length > 0) {
    console.log('⚠️  SLOW TESTS (>5s):');
    console.log('-'.repeat(30));
    slowTests.forEach((result) => {
      console.log(`🐌 ${result.url} - ${result.responseTime}ms`);
    });
    console.log('');
  }

  // Tool-specific results
  console.log('🔧 TOOL-SPECIFIC RESULTS:');
  console.log('-'.repeat(30));

  for (const tool of tools) {
    const ogResult = results.find((r) =>
      r.url.includes(`/tools/${tool.id}/opengraph-image`)
    );
    const twitterResult = results.find((r) =>
      r.url.includes(`/tools/${tool.id}/twitter-image`)
    );

    const ogStatus = ogResult?.status === 'success' ? '✅' : '❌';
    const twitterStatus = twitterResult?.status === 'success' ? '✅' : '❌';

    console.log(
      `${tool.icon} ${tool.name.padEnd(25)} OG:${ogStatus} Twitter:${twitterStatus}`
    );
  }

  console.log('');

  // Exit with error code if any tests failed
  if (failed.length > 0) {
    console.log('❌ Some tests failed. Check the errors above.');
    process.exit(1);
  } else {
    console.log('🎉 All tests passed successfully!');
    process.exit(0);
  }
}

// Validation functions
function validateMetaTags(html: string): string[] {
  const errors: string[] = [];

  // Check for essential meta tags
  const requiredTags = [
    'og:title',
    'og:description',
    'og:image',
    'og:url',
    'twitter:card',
    'twitter:image',
  ];

  requiredTags.forEach((tag) => {
    const metaTag = tag.startsWith('og:')
      ? `property="${tag}"`
      : `name="${tag}"`;

    if (!html.includes(metaTag)) {
      errors.push(`Missing meta tag: ${tag}`);
    }
  });

  return errors;
}

async function testMetaTags(): Promise<void> {
  console.log('\n🏷️  TESTING META TAGS');
  console.log('-'.repeat(30));

  const testPages = [
    '/',
    '/tools/json-formatter',
    '/tools/base64-encode',
    '/tools/uuid-generator',
  ];

  for (const page of testPages) {
    try {
      const response = await fetch(`${BASE_URL}${page}`);
      const html = await response.text();
      const errors = validateMetaTags(html);

      if (errors.length === 0) {
        console.log(`✅ ${page} - All meta tags present`);
      } else {
        console.log(`❌ ${page} - Missing tags:`);
        errors.forEach((error) => console.log(`   - ${error}`));
      }
    } catch (error) {
      console.log(`❌ ${page} - Error fetching page: ${error}`);
    }
  }
}

// Main execution
if (require.main === module) {
  testAllOGImages()
    .then(() => testMetaTags())
    .catch((error) => {
      console.error('❌ Test suite failed:', error);
      process.exit(1);
    });
}

export { testOGImage, testAllOGImages, validateMetaTags };
