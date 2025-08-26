// lib/seo/metadata-factory.ts
import { Metadata } from 'next';
import { ToolDiscovery } from './discovery';

export class MetadataFactory {
  private discovery: ToolDiscovery;
  private baseUrl: string;

  constructor() {
    this.discovery = new ToolDiscovery();
    this.baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolslab.dev';
  }

  async generateForTool(toolSlug: string): Promise<Metadata> {
    // Try to find tool information from any source
    const tool = await this.discovery.getTool(toolSlug);

    // Format name from slug if not found
    const toolName = tool?.name || this.formatName(toolSlug);

    // Generate optimized title (A/B test ready)
    const title = this.generateTitle(toolName, toolSlug);

    // Generate description
    const description =
      tool?.description ||
      `Free online ${toolName} tool. Fast, secure, and works in your browser. No signup or installation required.`;

    // Generate keywords
    const keywords = this.generateKeywords(toolSlug, toolName, tool?.category);

    return {
      title,
      description,
      keywords: keywords.join(', '),

      openGraph: {
        type: 'website',
        locale: 'en_US',
        url: `${this.baseUrl}/tools/${toolSlug}`,
        siteName: 'ToolsLab',
        title,
        description,
        images: [
          {
            url: `${this.baseUrl}/api/og?tool=${toolSlug}`,
            width: 1200,
            height: 630,
            alt: `${toolName} Tool Preview`,
          },
        ],
      },

      twitter: {
        card: 'summary_large_image',
        site: '@toolslab_dev',
        title,
        description,
        images: [`${this.baseUrl}/api/og?tool=${toolSlug}`],
      },

      alternates: {
        canonical: `${this.baseUrl}/tools/${toolSlug}`,
      },

      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          noimageindex: false,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },

      verification: {
        google: process.env.GOOGLE_SITE_VERIFICATION,
        yandex: process.env.YANDEX_VERIFICATION,
        other: process.env.BING_VERIFICATION
          ? {
              'msvalidate.01': process.env.BING_VERIFICATION,
            }
          : undefined,
      },

      other: {
        'application-name': 'ToolsLab',
        'apple-mobile-web-app-title': 'ToolsLab',
        'msapplication-TileColor': '#000000',
        'theme-color': '#000000',
      },
    };
  }

  async generateForCategory(categorySlug: string): Promise<Metadata> {
    const categories = await this.discovery.discoverCategories();
    const tools = await this.discovery.getTools();

    const categoryExists = categories.includes(categorySlug);
    const categoryName = this.formatName(categorySlug);
    const categoryTools = tools.filter(
      (t) => t.category === categorySlug && t.exists
    );

    const title = `${categoryName} Tools - Free Online Developer Tools | ToolsLab`;
    const description = categoryExists
      ? `Explore our collection of ${categoryTools.length} free ${categoryName.toLowerCase()} tools. No signup required, works offline, completely free.`
      : `Free online ${categoryName.toLowerCase()} tools for developers and professionals. Fast, secure, and browser-based.`;

    return {
      title,
      description,
      keywords: [
        categorySlug,
        `${categorySlug} tools`,
        `free ${categorySlug}`,
        `online ${categorySlug}`,
        'developer tools',
        'web tools',
      ].join(', '),

      openGraph: {
        type: 'website',
        locale: 'en_US',
        url: `${this.baseUrl}/category/${categorySlug}`,
        siteName: 'ToolsLab',
        title,
        description,
        images: [
          {
            url: `${this.baseUrl}/api/og?category=${categorySlug}`,
            width: 1200,
            height: 630,
            alt: `${categoryName} Tools Collection`,
          },
        ],
      },

      twitter: {
        card: 'summary_large_image',
        site: '@toolslab_dev',
        title,
        description,
        images: [`${this.baseUrl}/api/og?category=${categorySlug}`],
      },

      alternates: {
        canonical: `${this.baseUrl}/category/${categorySlug}`,
      },
    };
  }

  generateForHomepage(): Metadata {
    const title = 'ToolsLab - Free Online Developer Tools That Actually Work';
    const description =
      'Professional developer tools that work in your browser. JSON formatter, Base64 encoder, UUID generator, and 30+ more. No signup, completely free.';

    return {
      title,
      description,
      keywords: [
        'developer tools',
        'online tools',
        'web tools',
        'json formatter',
        'base64 encoder',
        'uuid generator',
        'free tools',
        'browser tools',
      ].join(', '),

      openGraph: {
        type: 'website',
        locale: 'en_US',
        url: this.baseUrl,
        siteName: 'ToolsLab',
        title,
        description,
        images: [
          {
            url: `${this.baseUrl}/api/og`,
            width: 1200,
            height: 630,
            alt: 'ToolsLab - Professional Developer Tools',
          },
        ],
      },

      twitter: {
        card: 'summary_large_image',
        site: '@toolslab_dev',
        title,
        description,
        images: [`${this.baseUrl}/api/og`],
      },

      alternates: {
        canonical: this.baseUrl,
      },

      robots: {
        index: true,
        follow: true,
      },
    };
  }

  private formatName(slug: string): string {
    return slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private generateTitle(toolName: string, slug: string): string {
    // A/B test different formats based on slug hash
    const templates = [
      `${toolName} - Free Online Tool | ToolsLab`,
      `${toolName} Online - Instant, Free, No Signup | ToolsLab`,
      `Free ${toolName} Tool - ToolsLab Developer Tools`,
      `${toolName} - Professional Online Tool | ToolsLab`,
    ];

    // Use slug hash to consistently pick same title
    const index = this.hashString(slug) % templates.length;
    return templates[index];
  }

  private generateKeywords(
    slug: string,
    name: string,
    category?: string
  ): string[] {
    const baseKeywords = [
      'online',
      'free',
      'tool',
      'browser',
      'no signup',
      'developer tools',
      'web tools',
    ];

    const toolWords = slug.split('-');
    const nameWords = name.toLowerCase().split(' ');

    const categoryKeywords = category
      ? [category, `${category} tools`, `online ${category}`]
      : [];

    const specificKeywords = [
      slug,
      `${slug} online`,
      `free ${slug}`,
      `${name.toLowerCase()} tool`,
      `${name.toLowerCase()} online`,
    ];

    return [
      ...new Set([
        ...toolWords,
        ...nameWords,
        ...baseKeywords,
        ...categoryKeywords,
        ...specificKeywords,
      ]),
    ].filter((k) => k.length > 1); // Remove single character keywords
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
}

// Helper hook for Next.js pages
export async function generateToolMetadata(
  toolSlug: string
): Promise<Metadata> {
  const factory = new MetadataFactory();
  return factory.generateForTool(toolSlug);
}

export async function generateCategoryMetadata(
  categorySlug: string
): Promise<Metadata> {
  const factory = new MetadataFactory();
  return factory.generateForCategory(categorySlug);
}

export function generateHomepageMetadata(): Metadata {
  const factory = new MetadataFactory();
  return factory.generateForHomepage();
}
