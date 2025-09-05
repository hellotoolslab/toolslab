#!/usr/bin/env node

/**
 * CLI script to view IndexNow statistics
 * Usage: npm run indexnow:stats
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolslab.dev';
const ADMIN_KEY = process.env.ADMIN_SECRET_KEY;
const API_URL = `${SITE_URL}/api/indexnow/submit`;

async function getStats(includeUrls = false) {
  if (!ADMIN_KEY) {
    console.error('❌ ADMIN_SECRET_KEY not configured in .env.local');
    process.exit(1);
  }

  try {
    const url = new URL(API_URL);
    if (includeUrls) {
      url.searchParams.set('includeUrls', 'true');
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${ADMIN_KEY}`,
      },
    });

    const result = await response.json();

    if (response.ok) {
      console.log('\n📊 IndexNow Statistics\n');
      console.log('═══════════════════════════════════════\n');

      // Configuration
      console.log('⚙️  Configuration:');
      console.log(`   Enabled: ${result.config.enabled ? '✅' : '❌'}`);
      console.log(
        `   Key Configured: ${result.config.keyConfigured ? '✅' : '❌'}`
      );
      console.log(`   Site URL: ${result.config.siteUrl}`);
      console.log();

      // Queue Statistics
      console.log('📈 Queue Status:');
      console.log(`   Total URLs: ${result.queue.total}`);
      console.log(`   High Priority: ${result.queue.high}`);
      console.log(`   Normal Priority: ${result.queue.normal}`);
      console.log(`   Low Priority: ${result.queue.low}`);
      console.log(
        `   Processing: ${result.queue.processing ? '🔄 Yes' : '⏸️  No'}`
      );
      console.log(`   Success Count: ${result.queue.successCount}`);
      console.log(`   Failure Count: ${result.queue.failureCount}`);

      if (result.queue.lastProcessed) {
        const lastProcessed = new Date(result.queue.lastProcessed);
        console.log(`   Last Processed: ${lastProcessed.toLocaleString()}`);
      }
      console.log();

      // Endpoint Status
      console.log('🌐 Endpoint Status:');
      result.endpoints.forEach((endpoint) => {
        const status = endpoint.available ? '✅ Available' : '❌ Unavailable';
        console.log(`   ${endpoint.endpoint}: ${status}`);
      });

      // Queued URLs (if requested)
      if (includeUrls && result.queue.urls && result.queue.urls.length > 0) {
        console.log('\n📋 Queued URLs:');
        result.queue.urls.forEach((url, index) => {
          console.log(`   ${index + 1}. ${url}`);
        });
      }

      console.log('\n═══════════════════════════════════════\n');
    } else {
      console.error('❌ Error:', result.error || 'Failed to get statistics');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
    process.exit(1);
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const includeUrls = args.includes('--urls');

  if (args.includes('--help')) {
    console.log('Usage: npm run indexnow:stats [options]');
    console.log('Options:');
    console.log('  --urls    Include list of queued URLs');
    console.log('  --help    Show this help message');
    process.exit(0);
  }

  await getStats(includeUrls);
}

main().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
