#!/usr/bin/env tsx
/**
 * Internal Links Validation Script
 *
 * Validates that:
 * 1. No tool has 0 internal links (orphan pages)
 * 2. All tools have at least 3 internal links
 * 3. No tool has more than 15 links (over-optimization)
 * 4. Distribution is relatively even (low standard deviation)
 *
 * Usage: npm run validate:links
 */

import { tools } from '../lib/tools';
import { internalLinkingConfig } from '../lib/seo/internal-linking-config';
import {
  getSmartRelatedTools,
  getRelatedToolsEngine,
} from '../lib/seo/related-tools-engine';

interface ValidationResult {
  tool: string;
  linkCount: number;
  status: 'pass' | 'fail' | 'warn';
  issues: string[];
}

const results: ValidationResult[] = [];

/**
 * Simulate link counting (in production, would analyze actual links)
 */
function countToolLinks(toolId: string): number {
  const engine = getRelatedToolsEngine();
  return engine.getLinkCount(toolId);
}

/**
 * Validate all tools
 */
function validateAllTools(): boolean {
  console.log('🔍 Validating internal links for all tools...\n');

  let hasOrphans = false;
  let hasOverLinked = false;
  let hasUnderLinked = false;

  tools.forEach((tool) => {
    const linkCount = countToolLinks(tool.id);
    const issues: string[] = [];
    let status: 'pass' | 'fail' | 'warn' = 'pass';

    // Check for orphan pages
    if (linkCount < internalLinkingConfig.thresholds.orphan) {
      issues.push(
        `Orphan page: only ${linkCount} links (min: ${internalLinkingConfig.thresholds.orphan})`
      );
      status = 'fail';
      hasOrphans = true;
    }

    // Check for under-linked pages
    else if (linkCount < internalLinkingConfig.thresholds.underlinked) {
      issues.push(
        `Under-linked: ${linkCount} links (target: ${internalLinkingConfig.thresholds.underlinked}+)`
      );
      status = 'warn';
      hasUnderLinked = true;
    }

    // Check for over-linked pages
    if (linkCount > internalLinkingConfig.maxLinksPerTool) {
      issues.push(
        `Over-linked: ${linkCount} links (max: ${internalLinkingConfig.maxLinksPerTool})`
      );
      status =
        linkCount > internalLinkingConfig.maxLinksPerTool + 5 ? 'fail' : 'warn';
      hasOverLinked = true;
    }

    results.push({
      tool: tool.name,
      linkCount,
      status,
      issues,
    });
  });

  return !hasOrphans;
}

/**
 * Display validation report
 */
function displayReport(): void {
  const failures = results.filter((r) => r.status === 'fail');
  const warnings = results.filter((r) => r.status === 'warn');
  const passes = results.filter((r) => r.status === 'pass');

  console.log('='.repeat(80));
  console.log('📊 INTERNAL LINKS VALIDATION REPORT');
  console.log('='.repeat(80) + '\n');

  console.log('📈 SUMMARY:');
  console.log(`   Total Tools: ${results.length}`);
  console.log(
    `   ${failures.length === 0 ? '✅' : '❌'} Failures: ${failures.length}`
  );
  console.log(
    `   ${warnings.length === 0 ? '✅' : '⚠️ '} Warnings: ${warnings.length}`
  );
  console.log(`   ✅ Passed: ${passes.length}\n`);

  // Calculate statistics
  const linkCounts = results.map((r) => r.linkCount);
  const avgLinks =
    linkCounts.reduce((sum, count) => sum + count, 0) / linkCounts.length;
  const variance =
    linkCounts.reduce((sum, count) => sum + Math.pow(count - avgLinks, 2), 0) /
    linkCounts.length;
  const stdDev = Math.sqrt(variance);

  console.log('📊 DISTRIBUTION:');
  console.log(`   Average Links: ${avgLinks.toFixed(1)}`);
  console.log(`   Standard Deviation: ${stdDev.toFixed(1)}`);
  console.log(
    `   ${stdDev < 3 ? '✅' : '⚠️ '} Variance: ${stdDev < 3 ? 'Low (good)' : 'High (needs improvement)'}\n`
  );

  // Show failures
  if (failures.length > 0) {
    console.log('❌ FAILURES:\n');
    failures.forEach((result) => {
      console.log(`   ${result.tool}`);
      result.issues.forEach((issue) => {
        console.log(`      • ${issue}`);
      });
      console.log('');
    });
  }

  // Show warnings
  if (warnings.length > 0) {
    console.log('⚠️  WARNINGS:\n');
    warnings.forEach((result) => {
      console.log(`   ${result.tool}`);
      result.issues.forEach((issue) => {
        console.log(`      • ${issue}`);
      });
      console.log('');
    });
  }

  console.log('='.repeat(80) + '\n');

  // Recommendations
  if (failures.length > 0 || warnings.length > 0) {
    console.log('💡 RECOMMENDATIONS:\n');

    if (failures.length > 0) {
      console.log('   1. Run: npm run fix:orphan-pages');
      console.log('   2. Update tool-instructions.ts with smart related tools');
      console.log('   3. Add orphan tools to blog article related tools\n');
    }

    if (warnings.length > 0) {
      console.log('   4. Review under-linked tools and add to related tools');
      console.log('   5. Reduce related tools for over-linked pages\n');
    }

    if (stdDev > 3) {
      console.log('   6. Use RelatedToolsEngine for better distribution');
      console.log('   7. Balance popular vs orphan tools in suggestions\n');
    }
  } else {
    console.log('✅ ALL VALIDATIONS PASSED!\n');
    console.log('   No orphan pages found');
    console.log('   All tools have adequate internal links');
    console.log('   Link distribution is balanced\n');
  }
}

/**
 * Show suggestions for fixing issues
 */
function showSuggestions(): void {
  const orphans = results.filter(
    (r) => r.linkCount < internalLinkingConfig.thresholds.orphan
  );

  if (orphans.length > 0) {
    console.log('🔧 SUGGESTED FIXES FOR ORPHAN PAGES:\n');

    orphans.forEach((result) => {
      const toolId = tools.find((t) => t.name === result.tool)?.id;
      if (!toolId) return;

      const relatedTools = getSmartRelatedTools(toolId, 4);

      console.log(`   ${result.tool}:`);
      console.log(`     Add to relatedTools of: ${relatedTools.join(', ')}\n`);
    });
  }
}

// Run validation
const isValid = validateAllTools();
displayReport();
showSuggestions();

// Exit with appropriate code
process.exit(isValid ? 0 : 1);
