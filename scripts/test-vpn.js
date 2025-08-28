#!/usr/bin/env node

/**
 * VPN Testing Script for ToolsLab
 * Tests VPN detection functionality and header management
 *
 * Usage:
 * node scripts/test-vpn.js [options]
 *
 * Options:
 * --scenario <name>  Run specific test scenario
 * --host <hostname>  Test against specific host (default: localhost:3000)
 * --verbose         Enable verbose output
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');

// Test scenarios with different VPN/proxy configurations
const TEST_SCENARIOS = {
  'corporate-vpn': {
    name: 'Corporate VPN',
    headers: {
      'x-forwarded-for': '10.0.0.1, 203.0.113.1',
      'x-real-ip': '10.0.0.1',
      'user-agent': 'Mozilla/5.0 (compatible; FortiClient/7.0)',
      'x-original-forwarded-for': '192.168.1.100',
    },
    expectedVPN: true,
  },

  'enterprise-proxy': {
    name: 'Enterprise Proxy (Zscaler)',
    headers: {
      'x-forwarded-for': '172.16.1.50, 198.51.100.1',
      'x-real-ip': '172.16.1.50',
      'user-agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Zscaler/1.0',
      'x-forwarded-proto': 'https',
      'x-forwarded-port': '443',
    },
    expectedVPN: true,
  },

  'home-office': {
    name: 'Home Office (Private IP)',
    headers: {
      'x-forwarded-for': '192.168.1.10',
      'x-real-ip': '192.168.1.10',
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
    expectedVPN: true,
  },

  'regular-user': {
    name: 'Regular Public Internet User',
    headers: {
      'x-forwarded-for': '203.0.113.1',
      'x-real-ip': '203.0.113.1',
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    },
    expectedVPN: false,
  },

  'mobile-user': {
    name: 'Mobile User',
    headers: {
      'x-forwarded-for': '198.51.100.50',
      'user-agent':
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15',
    },
    expectedVPN: false,
  },

  'cloudflare-proxy': {
    name: 'Behind Cloudflare',
    headers: {
      'cf-connecting-ip': '203.0.113.2',
      'cf-ray': '66a018e1eae6c1b2-LAX',
      'cf-visitor': '{"scheme":"https"}',
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    },
    expectedVPN: false,
  },
};

// Parse command line arguments
const args = process.argv.slice(2);
const config = {
  scenario: null,
  host: 'localhost:3000',
  verbose: false,
  ssl: false,
};

for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case '--scenario':
      config.scenario = args[++i];
      break;
    case '--host':
      config.host = args[++i];
      break;
    case '--verbose':
      config.verbose = true;
      break;
    case '--ssl':
      config.ssl = true;
      break;
    case '--help':
      printHelp();
      process.exit(0);
  }
}

/**
 * Print help information
 */
function printHelp() {
  console.log(`
VPN Testing Script for ToolsLab

Usage: node scripts/test-vpn.js [options]

Options:
  --scenario <name>    Run specific test scenario
  --host <hostname>    Test against specific host (default: localhost:3000)
  --verbose           Enable verbose output
  --ssl               Use HTTPS instead of HTTP
  --help              Show this help

Available scenarios:
${Object.keys(TEST_SCENARIOS)
  .map((key) => `  - ${key}: ${TEST_SCENARIOS[key].name}`)
  .join('\n')}

Examples:
  node scripts/test-vpn.js --scenario corporate-vpn
  node scripts/test-vpn.js --host toolslab.dev --ssl
  node scripts/test-vpn.js --verbose
`);
}

/**
 * Make HTTP/HTTPS request with custom headers
 */
function makeRequest(url, headers) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const httpModule = isHttps ? https : http;

    // Handle self-signed certificates in development
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'User-Agent': 'VPN-Test-Client/1.0',
        ...headers,
      },
    };

    if (isHttps && urlObj.hostname === 'localhost') {
      options.rejectUnauthorized = false;
    }

    const req = httpModule.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });

    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

/**
 * Test a specific scenario
 */
async function testScenario(scenarioName, scenario) {
  console.log(`\n🧪 Testing: ${scenario.name}`);
  console.log('─'.repeat(50));

  try {
    const protocol = config.ssl ? 'https' : 'http';
    const baseUrl = `${protocol}://${config.host}`;

    // Test homepage
    console.log('📍 Testing homepage...');
    const homeResponse = await makeRequest(baseUrl, scenario.headers);

    if (config.verbose) {
      console.log(`   Status: ${homeResponse.status}`);
      console.log(
        `   VPN Mode Header: ${homeResponse.headers['x-vpn-mode'] || 'not set'}`
      );
      console.log(
        `   Frame Options: ${homeResponse.headers['x-frame-options'] || 'not set'}`
      );
      console.log(
        `   HSTS: ${homeResponse.headers['strict-transport-security'] || 'not set'}`
      );
    }

    // Test VPN detection API
    console.log('🔍 Testing VPN detection API...');
    const apiResponse = await makeRequest(
      `${baseUrl}/api/check-vpn`,
      scenario.headers
    );

    if (apiResponse.status === 200) {
      const vpnData = JSON.parse(apiResponse.body);

      console.log(`   Detected VPN: ${vpnData.isVPN ? '✅ Yes' : '❌ No'}`);
      console.log(
        `   Expected VPN: ${scenario.expectedVPN ? '✅ Yes' : '❌ No'}`
      );
      console.log(`   Confidence: ${vpnData.confidence}`);
      console.log(`   Indicators: ${vpnData.indicators.join(', ')}`);

      if (config.verbose && vpnData.debug) {
        console.log('   Debug Info:');
        console.log(
          `     Forwarded For: ${vpnData.debug.forwardedFor || 'none'}`
        );
        console.log(`     Real IP: ${vpnData.debug.realIP || 'none'}`);
        console.log(`     VPN Mode: ${vpnData.debug.vpnMode || 'false'}`);
      }

      // Check if detection matches expectations
      const isCorrect = vpnData.isVPN === scenario.expectedVPN;
      console.log(`   Result: ${isCorrect ? '✅ CORRECT' : '❌ INCORRECT'}`);

      return {
        scenario: scenarioName,
        passed: isCorrect,
        detected: vpnData.isVPN,
        expected: scenario.expectedVPN,
        confidence: vpnData.confidence,
        indicators: vpnData.indicators,
      };
    } else {
      console.log(`   ❌ API Error: ${apiResponse.status}`);
      return {
        scenario: scenarioName,
        passed: false,
        error: `API returned ${apiResponse.status}`,
      };
    }
  } catch (error) {
    console.log(`   ❌ Test Error: ${error.message}`);
    return {
      scenario: scenarioName,
      passed: false,
      error: error.message,
    };
  }
}

/**
 * Run all tests or specific scenario
 */
async function runTests() {
  console.log('🚀 VPN Detection Testing Suite');
  console.log(`Testing against: ${config.host}`);
  console.log(`Protocol: ${config.ssl ? 'HTTPS' : 'HTTP'}`);

  const results = [];
  const scenarios = config.scenario
    ? { [config.scenario]: TEST_SCENARIOS[config.scenario] }
    : TEST_SCENARIOS;

  if (config.scenario && !TEST_SCENARIOS[config.scenario]) {
    console.log(`❌ Unknown scenario: ${config.scenario}`);
    console.log(
      `Available scenarios: ${Object.keys(TEST_SCENARIOS).join(', ')}`
    );
    process.exit(1);
  }

  for (const [name, scenario] of Object.entries(scenarios)) {
    const result = await testScenario(name, scenario);
    results.push(result);
  }

  // Print summary
  console.log('\n📊 Test Summary');
  console.log('═'.repeat(50));

  const passed = results.filter((r) => r.passed).length;
  const total = results.length;

  console.log(
    `Overall: ${passed}/${total} tests passed (${Math.round((passed / total) * 100)}%)`
  );

  results.forEach((result) => {
    const status = result.passed ? '✅' : '❌';
    const error = result.error ? ` (${result.error})` : '';
    console.log(`${status} ${result.scenario}${error}`);
  });

  // Exit with appropriate code
  process.exit(passed === total ? 0 : 1);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Test interrupted by user');
  process.exit(130);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Test terminated');
  process.exit(143);
});

// Run tests
if (require.main === module) {
  runTests().catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}
