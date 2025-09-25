// app/robots.ts
import { MetadataRoute } from 'next';

export const runtime = 'edge';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolslab.dev';

  return {
    rules: [
      // Block AI training bots
      {
        userAgent: [
          'Amazonbot',
          'Bytespider',
          'CCBot',
          'GPTBot',
          'Google-Extended',
          'meta-externalagent',
        ],
        disallow: '/',
      },
      // Block aggressive crawlers
      {
        userAgent: ['AhrefsBot', 'SemrushBot', 'DotBot', 'MJ12bot'],
        crawlDelay: 2,
        disallow: ['/api/', '/admin/'],
      },
      // Allow search engines and AI retrieval for user queries
      {
        userAgent: ['ClaudeBot', 'Applebot-Extended'],
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
        crawlDelay: 1,
      },
      // SEO tools - allow but with rate limiting
      {
        userAgent: ['ScreamingFrogSEOSpider', 'SiteAuditBot'],
        crawlDelay: 1,
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      // Default rule for all other bots
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
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
