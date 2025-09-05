#!/usr/bin/env node

/**
 * CLI script for bulk IndexNow submissions
 * Usage:
 *   npm run indexnow:bulk -- --type=tools
 *   npm run indexnow:bulk -- --sitemap
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolslab.dev';
const ADMIN_KEY = process.env.ADMIN_SECRET_KEY;
const WEBHOOK_URL = `${SITE_URL}/api/indexnow/webhook`;

async function submitBulk(command) {
  if (!ADMIN_KEY) {
    console.error('❌ ADMIN_SECRET_KEY not configured in .env.local');
    process.exit(1);
  }

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-signature': process.env.INDEXNOW_WEBHOOK_SECRET || '',
      },
      body: JSON.stringify({ command }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Success:', result.message);
      if (result.count) {
        console.log(`📊 Total URLs: ${result.count}`);
      }
      if (result.queueStats) {
        console.log('\n📈 Queue Statistics:');
        console.log(`   Total: ${result.queueStats.total}`);
        console.log(`   High Priority: ${result.queueStats.high}`);
        console.log(`   Normal Priority: ${result.queueStats.normal}`);
        console.log(`   Low Priority: ${result.queueStats.low}`);
      }
    } else {
      console.error('❌ Error:', result.error || result.message);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
    process.exit(1);
  }
}

async function getAllTools() {
  try {
    // Dynamic import to use ES modules
    const { getAllTools } = await import('../lib/tools.js');
    return getAllTools();
  } catch {
    // Fallback if module not available
    console.log('⚠️  Using API to fetch tools');
    return null;
  }
}

async function submitTools() {
  console.log('🔧 Submitting all tools to IndexNow...');

  const tools = await getAllTools();

  if (tools) {
    const urls = tools.map((tool) => `${SITE_URL}${tool.route}`);
    console.log(`📋 Found ${urls.length} tools`);

    const response = await fetch(`${SITE_URL}/api/indexnow/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ADMIN_KEY}`,
      },
      body: JSON.stringify({
        urls,
        immediate: false,
        priority: 'normal',
      }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅', result.message);
    } else {
      console.error('❌', result.error || result.message);
      process.exit(1);
    }
  } else {
    // Use webhook command
    await submitBulk('submit-all-tools');
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage:');
    console.log('  npm run indexnow:bulk -- --type=tools    Submit all tools');
    console.log(
      '  npm run indexnow:bulk -- --sitemap       Submit from sitemap'
    );
    console.log('  npm run indexnow:bulk -- --process       Process queue now');
    process.exit(1);
  }

  if (args.includes('--type=tools')) {
    await submitTools();
  } else if (args.includes('--sitemap')) {
    console.log('🗺️  Submitting URLs from sitemap...');
    await submitBulk('submit-sitemap');
  } else if (args.includes('--process')) {
    console.log('⚙️  Processing queue...');
    await submitBulk('process-queue');
  } else {
    console.error(
      '❌ Invalid option. Use --type=tools, --sitemap, or --process'
    );
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
