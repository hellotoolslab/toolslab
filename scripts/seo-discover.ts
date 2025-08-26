#!/usr/bin/env tsx
// scripts/seo-discover.ts
import { ToolDiscovery } from '../lib/seo/discovery';

async function discover() {
  console.log('🔍 ToolsLab SEO Discovery Tool');
  console.log('================================\n');

  try {
    const discovery = new ToolDiscovery();
    const startTime = Date.now();

    // Discover all content
    const tools = await discovery.discoverAllTools();
    const categories = await discovery.discoverCategories();
    const staticPages = await discovery.discoverStaticPages();
    const hasDynamic = discovery.hasDynamicRoutes();

    const discoveryTime = Date.now() - startTime;

    console.log('📊 Discovery Report:');
    console.log('===================');
    console.log(`Discovery Time: ${discoveryTime}ms`);
    console.log(`Dynamic Routing: ${hasDynamic ? 'Yes' : 'No'}`);
    console.log(`Total Tools: ${tools.length}`);
    console.log(`Enabled Tools: ${tools.filter((t) => t.exists).length}`);
    console.log(`Categories: ${categories.length}`);
    console.log(`Static Pages: ${staticPages.length}`);

    console.log('\n🛠️ Tools Found:');
    console.log('================');

    const grouped = tools.reduce(
      (acc, tool) => {
        const source = tool.source;
        if (!acc[source]) acc[source] = [];
        acc[source].push(tool);
        return acc;
      },
      {} as Record<string, typeof tools>
    );

    Object.entries(grouped).forEach(([source, sourceTools]) => {
      console.log(`\n${source.toUpperCase()} (${sourceTools.length} tools):`);
      sourceTools.forEach((tool) => {
        const status = tool.exists ? '✅' : '❌';
        const flags = [
          tool.featured && '⭐',
          tool.popular && '🔥',
          tool.new && '🆕',
        ]
          .filter(Boolean)
          .join('');

        console.log(`  ${status} ${tool.slug} ${flags}`);
        if (tool.name && tool.name !== tool.slug) {
          console.log(`     → "${tool.name}"`);
        }
        if (tool.category) {
          console.log(`     → Category: ${tool.category}`);
        }
      });
    });

    console.log('\n📂 Categories Found:');
    console.log('====================');
    categories.forEach((cat) => {
      const categoryTools = tools.filter((t) => t.category === cat && t.exists);
      console.log(`  - ${cat} (${categoryTools.length} tools)`);
    });

    console.log('\n📄 Static Pages:');
    console.log('=================');
    staticPages.forEach((page) => {
      console.log(`  - ${page}`);
    });

    console.log('\n🎯 SEO Insights:');
    console.log('=================');
    const featured = tools.filter((t) => t.featured && t.exists);
    const popular = tools.filter((t) => t.popular && t.exists);
    const newest = tools.filter((t) => t.new && t.exists);

    console.log(`Featured Tools: ${featured.length}`);
    console.log(`Popular Tools: ${popular.length}`);
    console.log(`New Tools: ${newest.length}`);

    if (tools.some((t) => !t.exists)) {
      console.log('\n⚠️ Issues Found:');
      console.log('=================');
      const missing = tools.filter((t) => !t.exists);
      console.log(`Missing Pages: ${missing.length}`);
      missing.forEach((tool) => {
        console.log(`  - ${tool.slug} (${tool.source})`);
      });
    }

    console.log('\n✅ Discovery complete!');
    console.log(
      `Total discoverable URLs: ${tools.filter((t) => t.exists).length + categories.length + staticPages.length + 1}`
    ); // +1 for homepage
  } catch (error) {
    console.error('❌ Discovery failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  discover();
}

export { discover };
