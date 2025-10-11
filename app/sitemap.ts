// app/sitemap.ts
import { MetadataRoute } from 'next';
import { ToolDiscovery } from '@/lib/seo/discovery';
import { locales, defaultLocale } from '@/lib/i18n/config';
import { URLNormalizer } from '@/lib/seo/url-normalizer';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolslab.dev';

  console.log('Generating sitemap...');

  try {
    // Use static data only during build to avoid Edge Config dynamic server usage
    const discovery = new ToolDiscovery();

    // Get static data directly without Edge Config calls during build
    const tools = await discovery.getStaticTools();
    const staticPages = await discovery.discoverStaticPages();
    const categories = await discovery.getStaticCategories();

    const routes: MetadataRoute.Sitemap = [];

    // Homepage (highest priority) - for all locales
    locales.forEach((locale) => {
      const localePrefix = locale === defaultLocale ? '' : `/${locale}`;
      const url = URLNormalizer.normalize(`${baseUrl}${localePrefix}`);
      routes.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      });
    });

    // Tool pages (high priority, ordered by search volume/popularity) - for all locales
    const toolRoutes: MetadataRoute.Sitemap = [];
    tools
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
      .forEach((tool, index) => {
        locales.forEach((locale) => {
          const localePrefix = locale === defaultLocale ? '' : `/${locale}`;
          const url = URLNormalizer.normalize(
            `${baseUrl}${localePrefix}${tool.path}`
          );
          toolRoutes.push({
            url,
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
          });
        });
      });

    // Category pages - for all locales
    const categoryRoutes: MetadataRoute.Sitemap = [];
    categories.forEach((cat) => {
      locales.forEach((locale) => {
        const localePrefix = locale === defaultLocale ? '' : `/${locale}`;
        const url = URLNormalizer.normalize(
          `${baseUrl}${localePrefix}/category/${cat}`
        );
        categoryRoutes.push({
          url,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        });
      });
    });

    // Static pages - for all locales
    const staticRoutes: MetadataRoute.Sitemap = [];
    staticPages.forEach((page) => {
      locales.forEach((locale) => {
        const localePrefix = locale === defaultLocale ? '' : `/${locale}`;
        const url = URLNormalizer.normalize(`${baseUrl}${localePrefix}${page}`);
        staticRoutes.push({
          url,
          lastModified: new Date(),
          changeFrequency: (page === '/blog'
            ? 'daily'
            : page === '/about'
              ? 'monthly'
              : 'yearly') as 'daily' | 'monthly' | 'yearly',
          priority: page === '/about' ? 0.8 : 0.6,
        });
      });
    });

    // Additional important pages - for all locales
    const additionalPages: MetadataRoute.Sitemap = [];
    locales.forEach((locale) => {
      const localePrefix = locale === defaultLocale ? '' : `/${locale}`;
      additionalPages.push(
        {
          url: URLNormalizer.normalize(`${baseUrl}${localePrefix}/tools`),
          lastModified: new Date(),
          changeFrequency: 'daily' as const,
          priority: 0.9,
        },
        {
          url: URLNormalizer.normalize(`${baseUrl}${localePrefix}/categories`),
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        }
      );
    });

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
