#!/usr/bin/env tsx
/**
 * Hreflang Validation Script
 *
 * Validates that all pages have complete and reciprocal hreflang tags
 * Usage: npm run validate:hreflang
 */

import { tools } from '../lib/tools';
import { locales } from '../lib/i18n/config';
import { generateHreflangAlternates } from '../lib/seo/hreflang-utils';

interface ValidationResult {
  url: string;
  errors: string[];
  warnings: string[];
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolslab.dev';
const results: ValidationResult[] = [];

// Define all pages that should have hreflang tags
const staticPages = ['', 'about', 'lab'];
const toolPages = tools.map((tool) => tool.id);

/**
 * Validate hreflang configuration for a given page
 */
function validatePageHreflang(
  pageType: 'tool' | 'static' | 'blog',
  path: string
): ValidationResult[] {
  const pageResults: ValidationResult[] = [];

  // Generate expected hreflang alternates
  const expectedAlternates = generateHreflangAlternates({
    pageType,
    path,
  });

  // For each locale, verify the page would have all hreflang tags
  locales.forEach((locale) => {
    const isDefault = locale === 'en';
    const localePrefix = isDefault ? '' : `/${locale}`;
    const fullPath = path ? `/${path}` : '';
    const url = `${BASE_URL}${localePrefix}${fullPath}`;

    const errors: string[] = [];
    const warnings: string[] = [];

    // Check that all locales are present
    locales.forEach((targetLocale) => {
      if (!expectedAlternates[targetLocale]) {
        errors.push(`Missing hreflang tag for locale: ${targetLocale}`);
      }
    });

    // Check x-default is present
    if (!expectedAlternates['x-default']) {
      errors.push('Missing x-default hreflang tag');
    }

    // Check x-default points to English
    if (
      expectedAlternates['x-default'] &&
      expectedAlternates['x-default'] !== expectedAlternates['en']
    ) {
      errors.push('x-default should point to English version');
    }

    // Check all URLs are absolute with https
    Object.entries(expectedAlternates).forEach(([lang, hrefUrl]) => {
      if (!hrefUrl.startsWith('https://')) {
        errors.push(`URL for ${lang} is not absolute HTTPS: ${hrefUrl}`);
      }
    });

    // Verify reciprocity: if page A links to page B, page B should link back to A
    Object.entries(expectedAlternates).forEach(([targetLang, targetUrl]) => {
      if (targetLang === 'x-default') return;

      // Generate alternates from target page's perspective
      const targetAlternates = generateHreflangAlternates({
        pageType,
        path,
      });

      const backLink = targetAlternates[locale];
      if (!backLink || backLink !== url) {
        warnings.push(
          `Reciprocity issue: ${url} links to ${targetUrl}, but ${targetUrl} doesn't link back correctly`
        );
      }
    });

    if (errors.length > 0 || warnings.length > 0) {
      pageResults.push({ url, errors, warnings });
    }
  });

  return pageResults;
}

/**
 * Main validation function
 */
function validateAllPages() {
  console.log('🔍 Validating hreflang tags across all pages...\n');

  // Validate static pages
  console.log('📄 Validating static pages...');
  staticPages.forEach((page) => {
    const pageResults = validatePageHreflang('static', page);
    results.push(...pageResults);
  });

  // Validate tool pages
  console.log(`🛠️  Validating ${toolPages.length} tool pages...`);
  toolPages.forEach((toolId) => {
    const pageResults = validatePageHreflang('tool', toolId);
    results.push(...pageResults);
  });

  // Print results
  console.log('\n' + '='.repeat(80));
  console.log('VALIDATION RESULTS');
  console.log('='.repeat(80) + '\n');

  if (results.length === 0) {
    console.log('✅ All pages have complete and reciprocal hreflang tags!');
    console.log('✅ All hreflang links use absolute HTTPS URLs');
    console.log('✅ x-default points to English version');
    console.log(
      `\n📊 Validated ${staticPages.length} static pages and ${toolPages.length} tool pages across ${locales.length} locales`
    );
    return true;
  }

  // Group results by error type
  const pagesWithErrors = results.filter((r) => r.errors.length > 0);
  const pagesWithWarnings = results.filter(
    (r) => r.warnings.length > 0 && r.errors.length === 0
  );

  if (pagesWithErrors.length > 0) {
    console.log(`❌ Found ${pagesWithErrors.length} pages with ERRORS:\n`);
    pagesWithErrors.forEach((result) => {
      console.log(`\n🔴 ${result.url}`);
      result.errors.forEach((error) => {
        console.log(`   • ${error}`);
      });
    });
  }

  if (pagesWithWarnings.length > 0) {
    console.log(
      `\n⚠️  Found ${pagesWithWarnings.length} pages with WARNINGS:\n`
    );
    pagesWithWarnings.forEach((result) => {
      console.log(`\n🟡 ${result.url}`);
      result.warnings.forEach((warning) => {
        console.log(`   • ${warning}`);
      });
    });
  }

  console.log('\n' + '='.repeat(80));
  console.log(
    `\n📊 Total issues: ${pagesWithErrors.length} errors, ${pagesWithWarnings.length} warnings`
  );
  console.log(
    `📊 Validated ${staticPages.length} static pages and ${toolPages.length} tool pages across ${locales.length} locales\n`
  );

  return pagesWithErrors.length === 0;
}

/**
 * Test sample URLs to show what hreflang tags they should have
 */
function showSampleHreflang() {
  console.log('\n' + '='.repeat(80));
  console.log('SAMPLE HREFLANG TAGS');
  console.log('='.repeat(80) + '\n');

  const samples = [
    { type: 'static' as const, path: '', label: 'Homepage' },
    { type: 'static' as const, path: 'about', label: 'About Page' },
    { type: 'tool' as const, path: 'json-formatter', label: 'JSON Formatter' },
  ];

  samples.forEach(({ type, path, label }) => {
    console.log(`\n📝 ${label}:`);
    const alternates = generateHreflangAlternates({ pageType: type, path });

    Object.entries(alternates).forEach(([lang, url]) => {
      console.log(`   ${lang.padEnd(10)} → ${url}`);
    });
  });

  console.log('\n' + '='.repeat(80) + '\n');
}

// Run validation
const success = validateAllPages();

// Show sample hreflang tags
if (process.argv.includes('--show-samples')) {
  showSampleHreflang();
}

// Exit with appropriate code
process.exit(success ? 0 : 1);
