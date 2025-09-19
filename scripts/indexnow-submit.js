#!/usr/bin/env node

/**
 * CLI script to submit URLs to IndexNow
 * Usage: npm run indexnow:submit -- https://toolslab.dev/tools/json-formatter
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolslab.dev';
const ADMIN_KEY = process.env.ADMIN_SECRET_KEY;
// Use local API during development if server is running
const API_BASE =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : SITE_URL;
const API_URL = `${API_BASE}/api/indexnow/submit`;

async function submitUrl(url, immediate = true) {
  if (!ADMIN_KEY) {
    console.error('❌ ADMIN_SECRET_KEY not configured in .env.local');
    process.exit(1);
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ADMIN_KEY}`,
      },
      body: JSON.stringify({
        url,
        immediate,
        priority: 'high',
      }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Success:', result.message);
      if (result.submittedUrls) {
        console.log('📋 Submitted URLs:', result.submittedUrls);
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

// Main execution
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: npm run indexnow:submit -- <url>');
    console.log(
      'Example: npm run indexnow:submit -- https://toolslab.dev/tools/json-formatter'
    );
    process.exit(1);
  }

  const url = args[0];
  const immediate = !args.includes('--queue');

  // Validate URL
  try {
    const urlObj = new URL(url);
    const siteObj = new URL(SITE_URL);

    if (urlObj.hostname !== siteObj.hostname) {
      console.error(`❌ URL must be from ${siteObj.hostname}`);
      process.exit(1);
    }
  } catch {
    console.error('❌ Invalid URL format');
    process.exit(1);
  }

  console.log(`📤 Submitting URL to IndexNow: ${url}`);
  console.log(`⚡ Mode: ${immediate ? 'Immediate' : 'Queue'}`);

  await submitUrl(url, immediate);
}

main().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
