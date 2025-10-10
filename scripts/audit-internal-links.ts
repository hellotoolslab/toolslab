#!/usr/bin/env tsx
/**
 * Internal Links Audit Script
 *
 * Analyzes how many internal links each tool receives from:
 * - Other tools (relatedTools)
 * - Blog articles
 * - Homepage (featured/popular)
 *
 * Identifies orphan pages and over-linked pages
 *
 * Usage: npm run audit:links
 */

import { tools } from '../lib/tools';
import { getActiveArticles } from '../lib/blog/active-articles';
import * as fs from 'fs';
import * as path from 'path';

interface LinkCount {
  toolId: string;
  toolName: string;
  totalLinks: number;
  fromTools: number;
  fromBlog: number;
  fromHomepage: number;
  linkingSources: string[];
}

const linkCounts: Map<string, LinkCount> = new Map();

// Initialize all tools with 0 links
tools.forEach((tool) => {
  linkCounts.set(tool.id, {
    toolId: tool.id,
    toolName: tool.name,
    totalLinks: 0,
    fromTools: 0,
    fromBlog: 0,
    fromHomepage: 0,
    linkingSources: [],
  });
});

/**
 * Count links from other tools via tool-instructions.ts
 */
function countLinksFromTools() {
  console.log('🔍 Scanning tool-instructions.ts for related tools...\n');

  const instructionsPath = path.join(
    process.cwd(),
    'lib',
    'tool-instructions.ts'
  );

  if (!fs.existsSync(instructionsPath)) {
    console.log('⚠️  tool-instructions.ts not found\n');
    return;
  }

  const content = fs.readFileSync(instructionsPath, 'utf-8');

  // Parse relatedTools arrays from the file
  // This is a simple regex-based approach
  const relatedToolsMatches = content.matchAll(
    /relatedTools:\s*\[([\s\S]*?)\]/g
  );

  for (const match of relatedToolsMatches) {
    const toolsList = match[1];
    const toolIds = toolsList.match(/'([^']+)'/g);

    if (toolIds) {
      toolIds.forEach((id) => {
        const cleanId = id.replace(/'/g, '');
        const linkCount = linkCounts.get(cleanId);
        if (linkCount) {
          linkCount.fromTools++;
          linkCount.totalLinks++;
        }
      });
    }
  }
}

/**
 * Count links from blog articles
 */
function countLinksFromBlog() {
  console.log('📰 Scanning blog articles for related tools...\n');

  const articles = getActiveArticles();

  articles.forEach((article) => {
    if (article.relatedTools && article.relatedTools.length > 0) {
      article.relatedTools.forEach((toolId) => {
        const linkCount = linkCounts.get(toolId);
        if (linkCount) {
          linkCount.fromBlog++;
          linkCount.totalLinks++;
          linkCount.linkingSources.push(`Blog: ${article.title}`);
        }
      });
    }
  });
}

/**
 * Count links from homepage (popular/featured tools)
 */
function countLinksFromHomepage() {
  console.log('🏠 Checking homepage featured/popular tools...\n');

  // Popular and featured tools get extra visibility
  const popularTools = tools.filter((t) => t.isPopular);
  const featuredTools = tools.filter((t) => t.label === 'popular');

  popularTools.forEach((tool) => {
    const linkCount = linkCounts.get(tool.id);
    if (linkCount) {
      linkCount.fromHomepage++;
      linkCount.totalLinks++;
      linkCount.linkingSources.push('Homepage: Popular section');
    }
  });

  featuredTools.forEach((tool) => {
    const linkCount = linkCounts.get(tool.id);
    if (linkCount) {
      linkCount.fromHomepage++;
      linkCount.totalLinks++;
      linkCount.linkingSources.push('Homepage: Featured');
    }
  });
}

/**
 * Generate and display report
 */
function generateReport() {
  const sortedTools = Array.from(linkCounts.values()).sort(
    (a, b) => a.totalLinks - b.totalLinks
  );

  const orphanPages = sortedTools.filter((t) => t.totalLinks < 3);
  const underLinked = sortedTools.filter(
    (t) => t.totalLinks >= 3 && t.totalLinks <= 5
  );
  const wellLinked = sortedTools.filter(
    (t) => t.totalLinks >= 6 && t.totalLinks <= 10
  );
  const overLinked = sortedTools.filter((t) => t.totalLinks > 10);

  // Calculate statistics
  const totalLinks = sortedTools.reduce((sum, t) => sum + t.totalLinks, 0);
  const avgLinks = totalLinks / sortedTools.length;
  const variance =
    sortedTools.reduce(
      (sum, t) => sum + Math.pow(t.totalLinks - avgLinks, 2),
      0
    ) / sortedTools.length;
  const stdDev = Math.sqrt(variance);

  console.log('\n' + '='.repeat(80));
  console.log('📊 INTERNAL LINKS AUDIT REPORT');
  console.log('='.repeat(80) + '\n');

  console.log('📈 STATISTICS:');
  console.log(`   Total Tools: ${sortedTools.length}`);
  console.log(`   Average Links per Tool: ${avgLinks.toFixed(1)}`);
  console.log(`   Standard Deviation: ${stdDev.toFixed(1)}`);
  console.log(
    `   ${stdDev < 3 ? '✅' : '⚠️'} Distribution: ${stdDev < 3 ? 'Good (low variance)' : 'Needs improvement (high variance)'}\n`
  );

  console.log('📊 DISTRIBUTION:');
  console.log(
    `   0-2 links:   ${orphanPages.length.toString().padStart(2)} tools (${Math.round((orphanPages.length / sortedTools.length) * 100)}%)   ${orphanPages.length === 0 ? '✅' : '❌'}`
  );
  console.log(
    `   3-5 links:   ${underLinked.length.toString().padStart(2)} tools (${Math.round((underLinked.length / sortedTools.length) * 100)}%)   ${underLinked.length > 0 ? '✅' : '⚠️'}`
  );
  console.log(
    `   6-10 links:  ${wellLinked.length.toString().padStart(2)} tools (${Math.round((wellLinked.length / sortedTools.length) * 100)}%)   ✅`
  );
  console.log(
    `   11+ links:   ${overLinked.length.toString().padStart(2)} tools (${Math.round((overLinked.length / sortedTools.length) * 100)}%)   ${overLinked.length < 5 ? '✅' : '⚠️'}\n`
  );

  if (orphanPages.length > 0) {
    console.log('❌ ORPHAN PAGES (< 3 links):');
    console.log('   These pages need immediate attention!\n');
    orphanPages.forEach((tool) => {
      console.log(
        `   • ${tool.toolName.padEnd(30)} - ${tool.totalLinks} links`
      );
      if (tool.linkingSources.length > 0) {
        console.log(
          `     Sources: ${tool.linkingSources.join(', ') || 'None'}`
        );
      }
    });
    console.log('');
  }

  if (underLinked.length > 0) {
    console.log('⚠️  UNDER-LINKED (3-5 links):');
    console.log('   Could use more internal links\n');
    underLinked.forEach((tool) => {
      console.log(
        `   • ${tool.toolName.padEnd(30)} - ${tool.totalLinks} links`
      );
    });
    console.log('');
  }

  if (wellLinked.length > 0) {
    console.log('✅ WELL-LINKED (6-10 links):');
    console.log(`   ${wellLinked.length} tools with good link distribution\n`);
  }

  if (overLinked.length > 0) {
    console.log('🔥 OVER-LINKED (> 10 links):');
    console.log('   These tools might be over-optimized\n');
    overLinked.forEach((tool) => {
      console.log(
        `   • ${tool.toolName.padEnd(30)} - ${tool.totalLinks} links`
      );
      console.log(`     From tools: ${tool.fromTools}`);
      console.log(`     From blog: ${tool.fromBlog}`);
      console.log(`     From homepage: ${tool.fromHomepage}`);
    });
    console.log('');
  }

  console.log('='.repeat(80));
  console.log('📋 DETAILED BREAKDOWN:\n');

  // Group by link count
  const byLinkCount = new Map<number, LinkCount[]>();
  sortedTools.forEach((tool) => {
    const count = tool.totalLinks;
    if (!byLinkCount.has(count)) {
      byLinkCount.set(count, []);
    }
    byLinkCount.get(count)!.push(tool);
  });

  // Display in reverse order (most linked first)
  const counts = Array.from(byLinkCount.keys()).sort((a, b) => b - a);
  counts.forEach((count) => {
    const toolsWithCount = byLinkCount.get(count)!;
    console.log(`${count} links:`);
    toolsWithCount.forEach((tool) => {
      console.log(
        `   ${tool.toolName.padEnd(30)} (from tools: ${tool.fromTools}, blog: ${tool.fromBlog}, homepage: ${tool.fromHomepage})`
      );
    });
    console.log('');
  });

  console.log('='.repeat(80) + '\n');

  // Summary and recommendations
  console.log('💡 RECOMMENDATIONS:\n');

  if (orphanPages.length > 0) {
    console.log(
      `   1. Add ${orphanPages.length} orphan page(s) to related tools of similar tools`
    );
    console.log('   2. Create blog articles mentioning under-linked tools');
    console.log('   3. Feature orphan tools in homepage rotation\n');
  }

  if (overLinked.length > 5) {
    console.log('   4. Reduce related tools suggestions for over-linked pages');
    console.log('   5. Distribute links more evenly across all tools\n');
  }

  if (stdDev > 3) {
    console.log('   6. Implement RelatedToolsEngine for better distribution');
    console.log('   7. Use semantic relationships instead of popularity\n');
  }

  // Exit code based on orphan pages
  if (orphanPages.length > 0) {
    console.log('❌ AUDIT FAILED: Found orphan pages\n');
    return 1;
  } else {
    console.log('✅ AUDIT PASSED: No orphan pages found\n');
    return 0;
  }
}

// Run audit
console.log('🚀 Starting Internal Links Audit...\n');

countLinksFromTools();
countLinksFromBlog();
countLinksFromHomepage();

const exitCode = generateReport();
process.exit(exitCode);
