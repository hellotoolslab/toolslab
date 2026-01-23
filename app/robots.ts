// app/robots.ts
// OPTIMIZED: Removed Edge Runtime - now generates statically at build time
import { MetadataRoute } from 'next';

// Force static generation at build time
export const dynamic = 'force-static';
export const revalidate = false;

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolslab.dev';

  return {
    rules: [
      // Default rules - all crawlers
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/admin/',
          '/api/private/',
          '/_next/',
          '/temp/',
          '/*.json$',
          '/*?*utm_',
          '/*?*ref=',
        ],
        crawlDelay: 1,
      },
      // Search engine crawlers (explicitly allowed)
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/admin/'],
        crawlDelay: 0,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/admin/'],
        crawlDelay: 1,
      },
      {
        userAgent: 'DuckDuckBot',
        allow: '/',
        disallow: ['/api/admin/'],
        crawlDelay: 1,
      },
      {
        userAgent: 'Yandex',
        allow: '/',
        disallow: ['/api/admin/'],
        crawlDelay: 2,
      },
      // AI training bots (blocked)
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        disallow: '/',
      },
      {
        userAgent: 'Claude-Web',
        disallow: '/',
      },
      {
        userAgent: 'ClaudeBot',
        disallow: '/',
      },
      {
        userAgent: 'Google-Extended',
        disallow: '/',
      },
      {
        userAgent: 'GoogleOther',
        disallow: '/',
      },
      {
        userAgent: 'Amazonbot',
        disallow: '/',
      },
      {
        userAgent: 'FacebookBot',
        disallow: '/',
      },
      {
        userAgent: 'Applebot-Extended',
        disallow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        disallow: '/',
      },
      {
        userAgent: 'Bytespider',
        disallow: '/',
      },
      {
        userAgent: 'meta-externalagent',
        disallow: '/',
      },
      {
        userAgent: 'cohere-ai',
        disallow: '/',
      },
      {
        userAgent: 'omgili',
        disallow: '/',
      },
      {
        userAgent: 'omgilibot',
        disallow: '/',
      },
      // SEO/Analysis bots (blocked)
      {
        userAgent: 'AhrefsBot',
        disallow: '/',
      },
      {
        userAgent: 'SemrushBot',
        disallow: '/',
      },
      {
        userAgent: 'DotBot',
        disallow: '/',
      },
      {
        userAgent: 'MJ12bot',
        disallow: '/',
      },
      {
        userAgent: 'Megaindex.ru',
        disallow: '/',
      },
      {
        userAgent: 'MauiBot',
        disallow: '/',
      },
      {
        userAgent: 'AlphaBot',
        disallow: '/',
      },
      {
        userAgent: 'SeznamBot',
        disallow: '/',
      },
      {
        userAgent: 'PetalBot',
        disallow: '/',
      },
      {
        userAgent: 'serpstatbot',
        disallow: '/',
      },
      {
        userAgent: 'SEOkicks',
        disallow: '/',
      },
      {
        userAgent: 'SeekportBot',
        disallow: '/',
      },
      // Specific paths for tools
      {
        userAgent: '*',
        allow: ['/tools/', '/blog/'],
        disallow: ['/api/*'],
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`, // Uses Next.js built-in sitemap (static generation)
    ],
  };
}
