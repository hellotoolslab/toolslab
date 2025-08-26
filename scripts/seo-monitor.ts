#!/usr/bin/env tsx
// scripts/seo-monitor.ts
import { SEOMonitor } from '../lib/seo/monitor';

async function monitor() {
  console.log('🔍 ToolsLab SEO Health Monitor');
  console.log('==============================\n');

  try {
    const monitor = new SEOMonitor();
    const startTime = Date.now();

    // Determine if we should auto-submit
    const args = process.argv.slice(2);
    const autoSubmit = args.includes('--auto-submit') || args.includes('-a');
    const quick = args.includes('--quick') || args.includes('-q');

    if (quick) {
      console.log('⚡ Running quick health check...');
      const result = await monitor.quickHealthCheck();
      const monitorTime = Date.now() - startTime;

      console.log(`Status: ${result.status}`);
      console.log(`Tools Enabled: ${result.toolsEnabled}`);
      console.log(`Sitemap OK: ${result.sitemapOk}`);
      console.log(`Check Time: ${monitorTime}ms`);
      console.log(`Timestamp: ${result.timestamp}`);

      if (result.status !== 'healthy') {
        console.log(
          '\n⚠️ Issues detected - run full health check: npm run seo:monitor'
        );
        process.exit(1);
      }

      console.log('\n✅ System is healthy!');
      return;
    }

    console.log('🏥 Running comprehensive health check...');
    if (autoSubmit) {
      console.log('📤 Auto-submit enabled for detected changes');
    }

    const report = await monitor.runHealthCheck(autoSubmit);
    const monitorTime = Date.now() - startTime;

    // Display header
    const statusEmoji =
      report.overall.status === 'healthy'
        ? '✅'
        : report.overall.status === 'warning'
          ? '⚠️'
          : '❌';

    console.log(
      `\n${statusEmoji} Overall Health: ${report.overall.status.toUpperCase()}`
    );
    console.log(`📊 Health Score: ${report.overall.score}/100`);
    console.log(`⏱️ Check Duration: ${monitorTime}ms`);
    console.log(`🕒 Timestamp: ${report.timestamp}`);

    // Tools status
    console.log('\n🛠️ Tools Status:');
    console.log('================');
    console.log(`Total Tools: ${report.tools.total}`);
    console.log(`Enabled: ${report.tools.enabled}`);
    console.log(`Disabled: ${report.tools.disabled}`);

    if (report.tools.newSinceLastCheck.length > 0) {
      console.log(`New Tools: ${report.tools.newSinceLastCheck.join(', ')}`);
    }

    if (report.tools.missingPages.length > 0) {
      console.log(`⚠️ Missing Pages: ${report.tools.missingPages.join(', ')}`);
    }

    // Infrastructure status
    console.log('\n🏗️ Infrastructure:');
    console.log('===================');

    const sitemapStatus = report.infrastructure.sitemap.accessible
      ? '✅'
      : '❌';
    console.log(
      `${sitemapStatus} Sitemap: ${report.infrastructure.sitemap.accessible ? 'Accessible' : 'Failed'} (${report.infrastructure.sitemap.status})`
    );

    const robotsStatus = report.infrastructure.robots.accessible ? '✅' : '❌';
    console.log(
      `${robotsStatus} Robots.txt: ${report.infrastructure.robots.accessible ? 'Accessible' : 'Failed'} (${report.infrastructure.robots.status})`
    );

    const indexNowStatus = report.infrastructure.indexNowKey.valid
      ? '✅'
      : '❌';
    console.log(
      `${indexNowStatus} IndexNow Key: ${report.infrastructure.indexNowKey.valid ? 'Valid' : 'Invalid'}`
    );

    // Search engines status
    console.log('\n🔍 Search Engines:');
    console.log('==================');

    if (report.search_engines.indexNow.submitted > 0) {
      console.log(
        `✅ IndexNow: ${report.search_engines.indexNow.submitted} URLs submitted`
      );
      if (report.search_engines.indexNow.errors.length > 0) {
        console.log(
          `   Errors: ${report.search_engines.indexNow.errors.length}`
        );
      }
    }

    if (report.search_engines.google.sitemapPinged) {
      console.log(
        `✅ Google: Sitemap pinged${report.search_engines.google.lastPing ? ` at ${report.search_engines.google.lastPing}` : ''}`
      );
    }

    if (report.search_engines.bing.sitemapPinged) {
      console.log(
        `✅ Bing: Sitemap pinged${report.search_engines.bing.lastPing ? ` at ${report.search_engines.bing.lastPing}` : ''}`
      );
    }

    // Performance metrics
    console.log('\n⚡ Performance:');
    console.log('===============');
    console.log(`Discovery: ${report.performance.discoveryTime}ms`);
    if (report.performance.submissionTime > 0) {
      console.log(`Submission: ${report.performance.submissionTime}ms`);
    }
    console.log(`Total: ${report.performance.totalTime}ms`);

    // Recommendations
    if (report.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      console.log('===================');
      report.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });
    }

    // Final status
    console.log('\n' + '='.repeat(50));
    if (report.overall.status === 'healthy') {
      console.log('🎉 SEO system is healthy and ready!');
      console.log('\nNext steps:');
      console.log('• Monitor Google Search Console for indexing');
      console.log('• Check Bing Webmaster Tools for coverage');
      console.log('• Run periodic health checks');
    } else if (report.overall.status === 'warning') {
      console.log('⚠️ SEO system has warnings - address recommendations above');
      process.exit(1);
    } else {
      console.log('❌ SEO system has errors - fix critical issues above');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Health monitoring failed:', error);
    process.exit(1);
  }
}

// Display help
function showHelp() {
  console.log('ToolsLab SEO Health Monitor');
  console.log('Usage: npm run seo:monitor [options]');
  console.log('');
  console.log('Options:');
  console.log('  --quick, -q         Run quick health check');
  console.log('  --auto-submit, -a   Auto-submit changes to search engines');
  console.log('  --help, -h          Show this help message');
  console.log('');
  console.log('Examples:');
  console.log('  npm run seo:monitor');
  console.log('  npm run seo:monitor -- --quick');
  console.log('  npm run seo:monitor -- --auto-submit');
  console.log('  npm run seo:monitor -- --quick --auto-submit');
}

// Run if called directly
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
  } else {
    monitor();
  }
}

export { monitor };
