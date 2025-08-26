#!/usr/bin/env tsx
// scripts/seo-submit.ts
import { SEOAutoSubmitter } from '../lib/seo/auto-submit';

async function submit() {
  console.log('📤 ToolsLab SEO Auto-Submitter');
  console.log('===============================\n');

  try {
    const submitter = new SEOAutoSubmitter();
    const startTime = Date.now();

    // Validate IndexNow key first
    console.log('🔑 Validating IndexNow key...');
    const keyValid = await submitter.validateIndexNowKey();

    if (!keyValid) {
      console.warn(
        '⚠️ IndexNow key validation failed - submissions may not work'
      );
      console.log(`Key: ${submitter.getIndexNowKey().substring(0, 8)}...`);
    } else {
      console.log('✅ IndexNow key is valid');
    }

    // Submit all URLs
    console.log('\n🚀 Starting submission process...');
    const result = await submitter.submitAll();
    const submissionTime = Date.now() - startTime;

    console.log('\n📊 Submission Report:');
    console.log('=====================');
    console.log(`Submission Time: ${submissionTime}ms`);
    console.log(`Timestamp: ${result.timestamp}`);

    console.log('\n📈 Content Breakdown:');
    console.log('=====================');
    console.log(`Tools: ${result.breakdown.tools}`);
    console.log(`Categories: ${result.breakdown.categories}`);
    console.log(`Static Pages: ${result.breakdown.staticPages}`);
    console.log(`Total URLs: ${result.breakdown.total}`);

    console.log('\n🎯 Submission Results:');
    console.log('======================');

    // IndexNow results
    const indexNow = result.results.indexNow;
    if (indexNow.success) {
      console.log(
        `✅ IndexNow: ${indexNow.submitted}/${result.breakdown.total} URLs submitted`
      );
    } else {
      console.log(`❌ IndexNow: Failed to submit URLs`);
      if (indexNow.errors.length > 0) {
        console.log('   Errors:');
        indexNow.errors.forEach((error) => console.log(`     - ${error}`));
      }
    }

    // Google results
    if (result.results.google) {
      console.log('✅ Google: Sitemap ping successful');
    } else {
      console.log('❌ Google: Sitemap ping failed');
    }

    // Bing results
    if (result.results.bing) {
      console.log('✅ Bing: Sitemap ping successful');
    } else {
      console.log('❌ Bing: Sitemap ping failed');
    }

    // Summary
    const totalSuccess =
      (indexNow.success ? 1 : 0) +
      (result.results.google ? 1 : 0) +
      (result.results.bing ? 1 : 0);
    console.log(`\n📋 Summary: ${totalSuccess}/3 services successful`);

    if (totalSuccess === 3) {
      console.log('🎉 All submissions successful!');
      console.log('Your site has been submitted to all major search engines.');
      console.log('\nNext steps:');
      console.log('1. Monitor Google Search Console for indexing progress');
      console.log('2. Check Bing Webmaster Tools for indexing status');
      console.log('3. Run health check: npm run seo:monitor');
    } else {
      console.log('⚠️ Some submissions failed - check logs above');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Submission failed:', error);
    process.exit(1);
  }
}

// Allow specific tool submission
async function submitTool(toolSlug: string) {
  console.log(`📤 Submitting specific tool: ${toolSlug}`);
  console.log('=====================================\n');

  try {
    const submitter = new SEOAutoSubmitter();
    const success = await submitter.submitNewTool(toolSlug);

    if (success) {
      console.log('✅ Tool submission successful!');
    } else {
      console.log('❌ Tool submission failed');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Tool submission failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args[0] === 'tool' && args[1]) {
    submitTool(args[1]);
  } else if (args[0] === 'tool' && !args[1]) {
    console.error('❌ Tool slug required: npm run seo:submit tool <slug>');
    process.exit(1);
  } else {
    submit();
  }
}

export { submit, submitTool };
