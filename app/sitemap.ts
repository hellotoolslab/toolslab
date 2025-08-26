// app/sitemap.ts
import { MetadataRoute } from 'next';
import { ToolDiscovery } from '@/lib/seo/discovery';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolslab.dev';
  const discovery = new ToolDiscovery();

  console.log('Generating sitemap...');

  try {
    // Auto-discover all tools
    const tools = await discovery.discoverAllTools();
    const staticPages = await discovery.discoverStaticPages();
    const categories = await discovery.discoverCategories();

    // Homepage (highest priority)
    const routes: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
    ];

    // Tool pages (high priority, ordered by search volume/popularity)
    const toolRoutes = tools
      .filter((tool) => tool.exists) // Only include existing tools
      .sort((a, b) => {
        // Sort by priority: featured > popular > searchVolume > name
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        if (a.popular && !b.popular) return -1;
        if (!a.popular && b.popular) return 1;
        if (a.searchVolume && b.searchVolume)
          return b.searchVolume - a.searchVolume;
        return a.name?.localeCompare(b.name || '') || 0;
      })
      .map((tool, index) => ({
        url: `${baseUrl}${tool.path}`,
        lastModified: tool.lastModified || new Date(),
        changeFrequency: 'weekly' as const,
        priority: Math.max(
          tool.featured
            ? 0.9
            : tool.popular
              ? 0.8
              : tool.new
                ? 0.85
                : 0.7 - index * 0.005, // Gradual priority decrease
          0.5
        ),
      }));

    // Category pages
    const categoryRoutes = categories.map((cat) => ({
      url: `${baseUrl}/category/${cat}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // Static pages
    const staticRoutes = staticPages.map((page) => ({
      url: `${baseUrl}${page}`,
      lastModified: new Date(),
      changeFrequency: (page === '/blog'
        ? 'daily'
        : page === '/about'
          ? 'monthly'
          : 'yearly') as 'daily' | 'monthly' | 'yearly',
      priority: page === '/about' ? 0.8 : 0.6,
    }));

    // Additional important pages
    const additionalPages = [
      {
        url: `${baseUrl}/tools`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/categories`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
    ];

    const totalRoutes = [
      ...routes,
      ...toolRoutes,
      ...categoryRoutes,
      ...staticRoutes,
      ...additionalPages,
    ];

    console.log(`✅ Sitemap generated with ${totalRoutes.length} URLs:`);
    console.log(`   - ${tools.filter((t) => t.exists).length} tool pages`);
    console.log(`   - ${categories.length} category pages`);
    console.log(`   - ${staticPages.length} static pages`);
    console.log(`   - ${additionalPages.length} additional pages`);

    return totalRoutes;
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);

    // Fallback sitemap with basic pages
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/tools`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
    ];
  }
}
