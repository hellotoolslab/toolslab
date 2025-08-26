// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolslab.dev';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/pro/success',
          '/pro/cancel',
          '/maintenance',
          '/coming-soon',
          '/need-tools',
        ],
      },
      // Specific rules for crawlers that might be aggressive
      {
        userAgent: ['AhrefsBot', 'SemrushBot', 'DotBot', 'MJ12bot'],
        crawlDelay: 2,
        disallow: ['/api/', '/admin/'],
      },
      // SEO tools - allow but with rate limiting
      {
        userAgent: ['ScreamingFrogSEOSpider', 'SiteAuditBot'],
        crawlDelay: 1,
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
