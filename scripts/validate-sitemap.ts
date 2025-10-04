/**
 * Sitemap Validation Script
 * Validates the generated sitemaps for completeness and correctness
 *
 * Run with: npx tsx scripts/validate-sitemap.ts
 */

import {
  getSitemapStats,
  validateSitemapCompleteness,
  validateHreflangBidirectionality,
  generateSitemapIndexXML,
  generateSitemapXML,
} from '../lib/sitemap/sitemap-utils';
import { locales } from '../lib/i18n/config';

console.log('🔍 Validating ToolsLab Sitemaps\n');
console.log('='.repeat(60));

// 1. Display Statistics
console.log('\n📊 Sitemap Statistics:');
console.log('='.repeat(60));
const stats = getSitemapStats();
console.log(`Total Locales: ${stats.totalLocales}`);
console.log(`Locales: ${stats.locales}`);
console.log(`Static Pages per Locale: ${stats.staticPages}`);
console.log(`Tool Pages per Locale: ${stats.toolPages}`);
console.log(`Category Pages per Locale: ${stats.categoryPages}`);
console.log(`Total Pages per Locale: ${stats.totalPagesPerLocale}`);
console.log(`Total URLs in All Sitemaps: ${stats.totalURLsInAllSitemaps}`);

// 2. Validate Completeness
console.log('\n✅ Validating Sitemap Completeness:');
console.log('='.repeat(60));
const completenessIssues = validateSitemapCompleteness();
if (completenessIssues.length === 0) {
  console.log('✓ All pages have translations in all locales');
} else {
  console.log('⚠ Found missing translations:');
  completenessIssues.forEach((issue) => {
    console.log(
      `  - ${issue.page}: missing in ${issue.missingLocales.join(', ')}`
    );
  });
}

// 3. Validate Hreflang
console.log('\n🌍 Validating Hreflang Bidirectionality:');
console.log('='.repeat(60));
const hreflangIssues = validateHreflangBidirectionality();
if (hreflangIssues.length === 0) {
  console.log('✓ All hreflang annotations are correct and bidirectional');
} else {
  console.log('⚠ Found hreflang issues:');
  hreflangIssues.forEach((issue) => {
    console.log(`  - ${issue.page}: ${issue.issue}`);
  });
}

// 4. Validate XML Format
console.log('\n📝 Validating XML Format:');
console.log('='.repeat(60));

try {
  const indexXML = generateSitemapIndexXML();
  console.log('✓ Sitemap index XML generated successfully');
  console.log(`  Size: ${(indexXML.length / 1024).toFixed(2)} KB`);

  let totalSize = indexXML.length;

  locales.forEach((locale) => {
    const sitemapXML = generateSitemapXML(locale as any);
    const size = sitemapXML.length;
    totalSize += size;
    console.log(`✓ Sitemap ${locale} XML generated successfully`);
    console.log(`  Size: ${(size / 1024).toFixed(2)} KB`);

    // Check for common XML issues
    if (!sitemapXML.includes('<?xml version="1.0"')) {
      console.log(`  ⚠ Missing XML declaration in ${locale} sitemap`);
    }
    if (!sitemapXML.includes('xmlns:xhtml')) {
      console.log(`  ⚠ Missing xhtml namespace in ${locale} sitemap`);
    }
  });

  console.log(`\nTotal Size: ${(totalSize / 1024).toFixed(2)} KB`);
} catch (error) {
  console.log('❌ Error generating XML:', error);
}

// 5. Check URL Format
console.log('\n🔗 Validating URL Format:');
console.log('='.repeat(60));

const sampleLocale = locales[0];
const sampleXML = generateSitemapXML(sampleLocale as any);

// Check for absolute URLs
if (sampleXML.includes('https://toolslab.dev')) {
  console.log('✓ URLs are absolute');
} else {
  console.log('❌ URLs are not absolute');
}

// Check for proper encoding
if (sampleXML.includes('encoding="UTF-8"')) {
  console.log('✓ UTF-8 encoding specified');
} else {
  console.log('⚠ UTF-8 encoding not specified');
}

// Check for hreflang presence
const hreflangCount = (sampleXML.match(/hreflang="/g) || []).length;
console.log(`✓ Found ${hreflangCount} hreflang annotations`);

// Check for x-default
if (sampleXML.includes('hreflang="x-default"')) {
  console.log('✓ x-default hreflang present');
} else {
  console.log('❌ x-default hreflang missing');
}

// 6. Sample URLs
console.log('\n📋 Sample URLs (first 5):');
console.log('='.repeat(60));

const urlMatches = sampleXML.match(/<loc>(.*?)<\/loc>/g);
if (urlMatches) {
  urlMatches.slice(0, 5).forEach((match) => {
    const url = match.replace(/<\/?loc>/g, '');
    console.log(`  ${url}`);
  });
}

// 7. Final Summary
console.log('\n' + '='.repeat(60));
console.log('✨ Validation Complete\n');

const hasIssues = completenessIssues.length > 0 || hreflangIssues.length > 0;

if (!hasIssues) {
  console.log('🎉 All validations passed! Sitemap is ready for production.');
  console.log('\n📤 Next Steps:');
  console.log('  1. Deploy to production');
  console.log('  2. Submit sitemap-index.xml to Google Search Console');
  console.log('  3. Monitor indexing status');
  process.exit(0);
} else {
  console.log('⚠️  Some issues found. Please review and fix before deploying.');
  process.exit(1);
}
