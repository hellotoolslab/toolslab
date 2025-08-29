#!/usr/bin/env node

/**
 * HSTS Verification Script for ToolsLab
 * Verifies that HSTS has been completely removed for corporate VPN compatibility
 *
 * Usage:
 * node scripts/verify-hsts.js [options]
 *
 * Options:
 * --host <hostname>    Test against specific host (default: localhost:3000)
 * --ssl               Use HTTPS instead of HTTP
 * --verbose           Enable verbose output
 * --production        Test production environment
 * --all-paths         Test multiple paths (default: test only homepage)
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');

// Test paths to verify
const TEST_PATHS = [
  '/',
  '/tools/json-formatter',
  '/tools/base64',
  '/api/check-vpn',
  '/api/tools/json-format',
];

// HSTS-related headers that should NOT be present
const FORBIDDEN_HSTS_HEADERS = ['strict-transport-security', 'hsts'];

// Required anti-HSTS headers that SHOULD be present
const REQUIRED_ANTI_HSTS_HEADERS = ['cache-control', 'pragma', 'expires'];

// VPN compatibility headers that should be present
const VPN_COMPATIBILITY_HEADERS = [
  'x-corporate-vpn-compatible',
  'x-vpn-compatible',
  'x-hsts-policy',
  'x-hsts-free-mode',
];

// Parse command line arguments
const args = process.argv.slice(2);
const config = {
  host: 'localhost:3000',
  ssl: false,
  verbose: false,
  production: false,
  allPaths: false,
};

for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case '--host':
      config.host = args[++i];
      break;
    case '--ssl':
      config.ssl = true;
      break;
    case '--verbose':
      config.verbose = true;
      break;
    case '--production':
      config.production = true;
      config.host = 'toolslab.dev';
      config.ssl = true;
      break;
    case '--all-paths':
      config.allPaths = true;
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
HSTS Verification Script for ToolsLab

Usage: node scripts/verify-hsts.js [options]

Options:
  --host <hostname>    Test against specific host (default: localhost:3000)
  --ssl                Use HTTPS instead of HTTP
  --verbose            Enable verbose output
  --production         Test production environment (toolslab.dev)
  --all-paths          Test multiple paths (default: test only homepage)
  --help               Show this help

Examples:
  node scripts/verify-hsts.js --verbose
  node scripts/verify-hsts.js --production --all-paths
  node scripts/verify-hsts.js --host staging.toolslab.dev --ssl
`);
}

/**
 * Make HTTP/HTTPS request and analyze headers
 */
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const httpModule = isHttps ? https : http;

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'HEAD', // Use HEAD to avoid downloading body content
      headers: {
        'User-Agent': 'HSTS-Verification-Script/1.0',
        Accept: '*/*',
        'Cache-Control': 'no-cache',
      },
      timeout: 10000,
    };

    // Handle self-signed certificates in development
    if (
      isHttps &&
      (urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1')
    ) {
      options.rejectUnauthorized = false;
    }

    const req = httpModule.request(options, (res) => {
      resolve({
        status: res.statusCode,
        headers: res.headers,
        url: url,
        path: urlObj.pathname,
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Request failed for ${url}: ${error.message}`));
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Request timeout for ${url}`));
    });

    req.end();
  });
}

/**
 * Analyze response headers for HSTS compliance
 */
function analyzeHeaders(response) {
  const { headers, url, path, status } = response;
  const issues = [];
  const warnings = [];
  const successes = [];

  // Check for forbidden HSTS headers
  for (const forbiddenHeader of FORBIDDEN_HSTS_HEADERS) {
    if (headers[forbiddenHeader]) {
      issues.push({
        type: 'CRITICAL',
        header: forbiddenHeader,
        value: headers[forbiddenHeader],
        message: `HSTS header detected: ${forbiddenHeader}=${headers[forbiddenHeader]}`,
        resolution:
          'This header must be completely removed for VPN compatibility',
      });
    } else {
      successes.push(`✅ No ${forbiddenHeader} header (good)`);
    }
  }

  // Check for required anti-HSTS headers
  for (const requiredHeader of REQUIRED_ANTI_HSTS_HEADERS) {
    if (!headers[requiredHeader]) {
      warnings.push({
        type: 'WARNING',
        header: requiredHeader,
        message: `Missing anti-HSTS header: ${requiredHeader}`,
        resolution: 'Consider adding this header to clear browser HSTS cache',
      });
    } else {
      // Validate anti-HSTS header values
      const value = headers[requiredHeader];
      if (requiredHeader === 'cache-control' && !value.includes('no-cache')) {
        warnings.push({
          type: 'WARNING',
          header: requiredHeader,
          value: value,
          message: `cache-control should include 'no-cache' for HSTS clearing`,
          resolution:
            'Update cache-control to include no-cache, no-store, must-revalidate',
        });
      } else if (requiredHeader === 'pragma' && value !== 'no-cache') {
        warnings.push({
          type: 'WARNING',
          header: requiredHeader,
          value: value,
          message: `pragma should be 'no-cache' for HSTS clearing`,
          resolution: 'Set pragma: no-cache',
        });
      } else if (requiredHeader === 'expires' && value !== '0') {
        warnings.push({
          type: 'WARNING',
          header: requiredHeader,
          value: value,
          message: `expires should be '0' for immediate expiration`,
          resolution: 'Set expires: 0',
        });
      } else {
        successes.push(`✅ ${requiredHeader}: ${value}`);
      }
    }
  }

  // Check for VPN compatibility indicators
  let vpnCompatibilityScore = 0;
  for (const vpnHeader of VPN_COMPATIBILITY_HEADERS) {
    if (headers[vpnHeader]) {
      successes.push(`✅ VPN header: ${vpnHeader}=${headers[vpnHeader]}`);
      vpnCompatibilityScore++;
    }
  }

  if (vpnCompatibilityScore === 0) {
    warnings.push({
      type: 'INFO',
      message: 'No VPN compatibility headers detected',
      resolution: 'Consider adding VPN compatibility indicators',
    });
  }

  // Check Content Security Policy
  const csp = headers['content-security-policy'];
  if (csp) {
    if (csp.includes('unsafe-inline') && csp.includes('unsafe-eval')) {
      successes.push(
        '✅ CSP allows unsafe-inline and unsafe-eval (VPN-friendly)'
      );
    } else {
      warnings.push({
        type: 'WARNING',
        header: 'content-security-policy',
        value: csp.substring(0, 100) + '...',
        message: 'CSP might be too restrictive for corporate proxies',
        resolution:
          'Consider allowing unsafe-inline and unsafe-eval for VPN compatibility',
      });
    }
  }

  // Check X-Frame-Options
  const frameOptions = headers['x-frame-options'];
  if (frameOptions === 'DENY') {
    warnings.push({
      type: 'INFO',
      header: 'x-frame-options',
      value: frameOptions,
      message:
        'X-Frame-Options: DENY might be too restrictive for corporate intranets',
      resolution: 'Consider using SAMEORIGIN for better VPN compatibility',
    });
  } else if (frameOptions === 'SAMEORIGIN') {
    successes.push('✅ X-Frame-Options: SAMEORIGIN (VPN-friendly)');
  }

  return {
    url,
    path,
    status,
    issues,
    warnings,
    successes,
    vpnCompatibilityScore,
    isHSTSFree: issues.length === 0,
  };
}

/**
 * Test a single path
 */
async function testPath(basePath, path) {
  const protocol = config.ssl ? 'https' : 'http';
  const url = `${protocol}://${config.host}${path}`;

  console.log(`\n🔍 Testing: ${path}`);
  console.log('─'.repeat(60));

  try {
    const response = await makeRequest(url);

    if (config.verbose) {
      console.log(`   Status: ${response.status}`);
    }

    const analysis = analyzeHeaders(response);

    // Print issues (critical problems)
    if (analysis.issues.length > 0) {
      console.log(`\n   ❌ CRITICAL ISSUES (${analysis.issues.length}):`);
      analysis.issues.forEach((issue, i) => {
        console.log(`   ${i + 1}. ${issue.message}`);
        console.log(`      Resolution: ${issue.resolution}`);
        if (config.verbose && issue.value) {
          console.log(`      Current value: ${issue.value}`);
        }
      });
    }

    // Print warnings
    if (analysis.warnings.length > 0) {
      console.log(`\n   ⚠️  WARNINGS (${analysis.warnings.length}):`);
      analysis.warnings.forEach((warning, i) => {
        console.log(`   ${i + 1}. ${warning.message}`);
        if (warning.resolution) {
          console.log(`      Suggestion: ${warning.resolution}`);
        }
        if (config.verbose && warning.value) {
          console.log(`      Current value: ${warning.value}`);
        }
      });
    }

    // Print successes
    if (config.verbose && analysis.successes.length > 0) {
      console.log(`\n   ✅ GOOD PRACTICES (${analysis.successes.length}):`);
      analysis.successes.forEach((success) => {
        console.log(`   ${success}`);
      });
    }

    // Overall assessment
    const overallStatus =
      analysis.issues.length === 0 ? '✅ HSTS-FREE' : '❌ HAS HSTS';
    const vpnFriendly =
      analysis.vpnCompatibilityScore > 0
        ? '✅ VPN-FRIENDLY'
        : '⚠️  VPN-NEUTRAL';

    console.log(`\n   Overall: ${overallStatus} | ${vpnFriendly}`);
    console.log(
      `   VPN Compatibility Score: ${analysis.vpnCompatibilityScore}/${VPN_COMPATIBILITY_HEADERS.length}`
    );

    return analysis;
  } catch (error) {
    console.log(`   ❌ Test Error: ${error.message}`);
    return {
      url,
      path,
      error: error.message,
      isHSTSFree: false,
      issues: [{ type: 'ERROR', message: error.message }],
      warnings: [],
      successes: [],
      vpnCompatibilityScore: 0,
    };
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('🚀 HSTS Verification Suite for ToolsLab');
  console.log(`Testing against: ${config.host}`);
  console.log(`Protocol: ${config.ssl ? 'HTTPS' : 'HTTP'}`);
  console.log(
    `Environment: ${config.production ? 'Production' : 'Development'}`
  );

  const testPaths = config.allPaths ? TEST_PATHS : ['/'];
  const results = [];

  for (const path of testPaths) {
    const result = await testPath(config.host, path);
    results.push(result);
  }

  // Print summary
  console.log('\n📊 Verification Summary');
  console.log('═'.repeat(60));

  const totalTests = results.length;
  const hstsFreePaths = results.filter((r) => r.isHSTSFree).length;
  const pathsWithIssues = results.filter(
    (r) => r.issues && r.issues.length > 0
  ).length;
  const totalIssues = results.reduce(
    (sum, r) => sum + (r.issues ? r.issues.length : 0),
    0
  );
  const totalWarnings = results.reduce(
    (sum, r) => sum + (r.warnings ? r.warnings.length : 0),
    0
  );
  const avgVPNScore =
    results.reduce((sum, r) => sum + (r.vpnCompatibilityScore || 0), 0) /
    totalTests;

  console.log(
    `HSTS-Free Paths: ${hstsFreePaths}/${totalTests} (${Math.round((hstsFreePaths / totalTests) * 100)}%)`
  );
  console.log(`Paths with Issues: ${pathsWithIssues}/${totalTests}`);
  console.log(`Total Critical Issues: ${totalIssues}`);
  console.log(`Total Warnings: ${totalWarnings}`);
  console.log(
    `Average VPN Compatibility Score: ${avgVPNScore.toFixed(1)}/${VPN_COMPATIBILITY_HEADERS.length}`
  );

  // Overall verdict
  let verdict;
  let exitCode;

  if (totalIssues === 0) {
    if (avgVPNScore >= 2) {
      verdict = '🎉 EXCELLENT: Fully HSTS-free with good VPN compatibility';
      exitCode = 0;
    } else {
      verdict =
        '✅ GOOD: HSTS-free but could improve VPN compatibility headers';
      exitCode = 0;
    }
  } else {
    verdict = `❌ CRITICAL: ${totalIssues} HSTS-related issue(s) found - VPN users will experience problems`;
    exitCode = 1;
  }

  console.log(`\nVerdict: ${verdict}`);

  // Recommendations
  if (totalIssues > 0) {
    console.log('\n🔧 Required Actions:');
    console.log(
      '1. Remove all HSTS headers from middleware and next.config.js'
    );
    console.log('2. Add anti-HSTS cache headers');
    console.log("3. Ensure vercel.json doesn't add HSTS headers");
    console.log('4. Test with corporate VPN scenarios');
  } else if (avgVPNScore < 2) {
    console.log('\n💡 Suggested Improvements:');
    console.log('1. Add more VPN compatibility headers');
    console.log('2. Consider more permissive CSP for corporate environments');
    console.log('3. Test with actual corporate VPN connections');
  }

  // Exit with appropriate code
  process.exit(exitCode);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Verification interrupted by user');
  process.exit(130);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Verification terminated');
  process.exit(143);
});

// Run tests
if (require.main === module) {
  runTests().catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}
