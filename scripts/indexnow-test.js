#!/usr/bin/env node

/**
 * CLI script to test IndexNow configuration
 * Usage: npm run indexnow:test
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolslab.dev';
const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY || '3f6e2560c38248588ea3fc34a1a817a5';
const WEBHOOK_URL = `${SITE_URL}/api/indexnow/webhook`;

async function testConfiguration() {
  console.log('\n🧪 Testing IndexNow Configuration\n');
  console.log('═══════════════════════════════════════\n');

  let allTestsPassed = true;

  // Test 1: Environment Variables
  console.log('1️⃣  Checking Environment Variables...');

  const envVars = {
    INDEXNOW_KEY: INDEXNOW_KEY,
    INDEXNOW_ENABLED: process.env.INDEXNOW_ENABLED,
    ADMIN_SECRET_KEY: process.env.ADMIN_SECRET_KEY ? '✅ Set' : '❌ Not set',
    NEXT_PUBLIC_SITE_URL: SITE_URL,
  };

  Object.entries(envVars).forEach(([key, value]) => {
    console.log(`   ${key}: ${value || '❌ Not set'}`);
    if (key !== 'ADMIN_SECRET_KEY' && !value) {
      allTestsPassed = false;
    }
  });
  console.log();

  // Test 2: Key File Accessibility
  console.log('2️⃣  Checking Key File Accessibility...');
  const keyFileUrl = `${SITE_URL}/${INDEXNOW_KEY}.txt`;

  try {
    const response = await fetch(keyFileUrl);
    if (response.ok) {
      const content = await response.text();
      if (content.trim() === INDEXNOW_KEY) {
        console.log(`   ✅ Key file accessible at: ${keyFileUrl}`);
      } else {
        console.log(`   ⚠️  Key file content mismatch`);
        allTestsPassed = false;
      }
    } else {
      console.log(`   ❌ Key file not accessible (Status: ${response.status})`);
      allTestsPassed = false;
    }
  } catch (error) {
    console.log(`   ❌ Failed to fetch key file: ${error.message}`);
    allTestsPassed = false;
  }
  console.log();

  // Test 3: API Endpoints
  console.log('3️⃣  Checking API Endpoints...');

  try {
    // Test webhook health endpoint
    const healthResponse = await fetch(`${WEBHOOK_URL}`, {
      method: 'GET',
    });

    if (healthResponse.ok) {
      const health = await healthResponse.json();
      console.log(`   ✅ Webhook endpoint: Healthy`);
      console.log(`      Enabled: ${health.enabled ? '✅' : '❌'}`);
      console.log(`      Queue Size: ${health.queueSize}`);
    } else {
      console.log(`   ❌ Webhook endpoint not accessible`);
      allTestsPassed = false;
    }
  } catch (error) {
    console.log(`   ❌ Failed to check webhook: ${error.message}`);
    allTestsPassed = false;
  }
  console.log();

  // Test 4: IndexNow Service Test
  console.log('4️⃣  Testing IndexNow Service Configuration...');

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-signature': process.env.INDEXNOW_WEBHOOK_SECRET || '',
      },
      body: JSON.stringify({ command: 'test-config' }),
    });

    if (response.ok) {
      const result = await response.json();

      console.log(`   Key File Check: ${result.keyFileExists ? '✅' : '❌'}`);
      console.log(`   Endpoints:`);

      result.endpoints.forEach((endpoint) => {
        const status = endpoint.available ? '✅' : '❌';
        console.log(`      ${status} ${endpoint.endpoint}`);
      });

      if (result.testSubmission !== undefined) {
        console.log(
          `   Test Submission: ${result.testSubmission ? '✅ Success' : '❌ Failed'}`
        );
      }

      if (!result.success) {
        allTestsPassed = false;
      }
    } else {
      console.log('   ❌ Failed to test configuration');
      allTestsPassed = false;
    }
  } catch (error) {
    console.log(`   ❌ Service test failed: ${error.message}`);
    allTestsPassed = false;
  }
  console.log();

  // Test 5: File System Check
  console.log('5️⃣  Checking File System...');
  const fs = require('fs');

  const keyFilePath = path.join(
    __dirname,
    '..',
    'public',
    `${INDEXNOW_KEY}.txt`
  );
  if (fs.existsSync(keyFilePath)) {
    const content = fs.readFileSync(keyFilePath, 'utf8');
    if (content.trim() === INDEXNOW_KEY) {
      console.log(`   ✅ Key file exists locally with correct content`);
    } else {
      console.log(`   ⚠️  Key file exists but content mismatch`);
      allTestsPassed = false;
    }
  } else {
    console.log(`   ❌ Key file not found at: ${keyFilePath}`);
    allTestsPassed = false;
  }

  console.log('\n═══════════════════════════════════════\n');

  // Final Result
  if (allTestsPassed) {
    console.log('✅ All tests passed! IndexNow is properly configured.');
    console.log('\n📝 Next steps:');
    console.log(
      '   1. Submit a test URL: npm run indexnow:submit -- ' + SITE_URL
    );
    console.log(
      '   2. Submit all tools: npm run indexnow:bulk -- --type=tools'
    );
    console.log('   3. Check statistics: npm run indexnow:stats');
  } else {
    console.log('⚠️  Some tests failed. Please check the configuration above.');
    console.log('\n📝 Required actions:');
    if (!process.env.INDEXNOW_ENABLED) {
      console.log('   - Set INDEXNOW_ENABLED=true in .env.local');
    }
    if (!process.env.ADMIN_SECRET_KEY) {
      console.log('   - Set ADMIN_SECRET_KEY in .env.local for CLI access');
    }
    process.exit(1);
  }
}

// Main execution
async function main() {
  await testConfiguration();
}

main().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
