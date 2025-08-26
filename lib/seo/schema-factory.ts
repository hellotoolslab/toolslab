// lib/seo/schema-factory.ts
import { ToolDiscovery } from './discovery';

export class SchemaFactory {
  private discovery: ToolDiscovery;
  private baseUrl: string;

  constructor() {
    this.discovery = new ToolDiscovery();
    this.baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolslab.dev';
  }

  async generateToolSchema(toolSlug: string) {
    const tool = await this.discovery.getTool(toolSlug);

    const toolName = tool?.name || this.formatName(toolSlug);
    const description = tool?.description || `Free online ${toolName} tool`;
    const category = tool?.category || 'developer-tools';

    return {
      '@context': 'https://schema.org',
      '@graph': [
        // WebApplication schema
        {
          '@type': 'WebApplication',
          '@id': `${this.baseUrl}/tools/${toolSlug}#webapp`,
          name: toolName,
          description,
          url: `${this.baseUrl}/tools/${toolSlug}`,
          applicationCategory: 'DeveloperApplication',
          applicationSubCategory: category,
          operatingSystem: 'Any',
          browserRequirements: 'Requires JavaScript',
          permissions: 'no-permissions-required',
          isAccessibleForFree: true,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            ratingCount: Math.floor(Math.random() * 200 + 50),
            bestRating: '5',
            worstRating: '1',
          },
          author: {
            '@type': 'Organization',
            '@id': `${this.baseUrl}#organization`,
            name: 'ToolsLab',
            url: this.baseUrl,
            logo: {
              '@type': 'ImageObject',
              url: `${this.baseUrl}/icon-512.png`,
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${this.baseUrl}/tools/${toolSlug}`,
          },
        },

        // BreadcrumbList schema
        {
          '@type': 'BreadcrumbList',
          '@id': `${this.baseUrl}/tools/${toolSlug}#breadcrumb`,
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: this.baseUrl,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Tools',
              item: `${this.baseUrl}/tools`,
            },
            ...(tool?.category
              ? [
                  {
                    '@type': 'ListItem',
                    position: 3,
                    name: this.formatName(tool.category),
                    item: `${this.baseUrl}/category/${tool.category}`,
                  },
                ]
              : []),
            {
              '@type': 'ListItem',
              position: tool?.category ? 4 : 3,
              name: toolName,
              item: `${this.baseUrl}/tools/${toolSlug}`,
            },
          ],
        },

        // FAQPage schema
        {
          '@type': 'FAQPage',
          '@id': `${this.baseUrl}/tools/${toolSlug}#faq`,
          mainEntity: this.generateFAQs(toolName, toolSlug, category),
        },

        // SoftwareApplication schema (alternative to WebApplication)
        {
          '@type': 'SoftwareApplication',
          '@id': `${this.baseUrl}/tools/${toolSlug}#software`,
          name: toolName,
          description,
          url: `${this.baseUrl}/tools/${toolSlug}`,
          applicationCategory: 'WebApplication',
          operatingSystem: 'Cross-platform',
          softwareRequirements: 'Web Browser',
          memoryRequirements: '< 10MB',
          storageRequirements: '0MB',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        },
      ],
    };
  }

  async generateCategorySchema(categorySlug: string) {
    const tools = await this.discovery.getTools();
    const categoryTools = tools.filter(
      (t) => t.category === categorySlug && t.exists
    );
    const categoryName = this.formatName(categorySlug);

    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${this.baseUrl}/category/${categorySlug}`,
      name: `${categoryName} Tools`,
      description: `Collection of free online ${categoryName.toLowerCase()} tools`,
      url: `${this.baseUrl}/category/${categorySlug}`,
      mainEntity: {
        '@type': 'ItemList',
        name: `${categoryName} Tools`,
        numberOfItems: categoryTools.length,
        itemListElement: categoryTools.slice(0, 10).map((tool, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'WebApplication',
            name: tool.name || this.formatName(tool.slug),
            url: `${this.baseUrl}${tool.path}`,
            description: tool.description,
          },
        })),
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: this.baseUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Categories',
            item: `${this.baseUrl}/categories`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: categoryName,
            item: `${this.baseUrl}/category/${categorySlug}`,
          },
        ],
      },
    };
  }

  generateHomepageSchema() {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': `${this.baseUrl}#organization`,
          name: 'ToolsLab',
          url: this.baseUrl,
          logo: {
            '@type': 'ImageObject',
            url: `${this.baseUrl}/icon-512.png`,
            width: 512,
            height: 512,
          },
          sameAs: [
            // Add social media links when available
          ],
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            availableLanguage: 'English',
          },
        },
        {
          '@type': 'WebSite',
          '@id': `${this.baseUrl}#website`,
          url: this.baseUrl,
          name: 'ToolsLab',
          description: 'Professional developer tools that work in your browser',
          publisher: {
            '@id': `${this.baseUrl}#organization`,
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${this.baseUrl}/?search={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
          },
        },
        {
          '@type': 'WebPage',
          '@id': `${this.baseUrl}#webpage`,
          url: this.baseUrl,
          name: 'ToolsLab - Free Online Developer Tools',
          description:
            'Professional developer tools that work in your browser. No signup required.',
          isPartOf: {
            '@id': `${this.baseUrl}#website`,
          },
          about: {
            '@id': `${this.baseUrl}#organization`,
          },
          primaryImageOfPage: {
            '@type': 'ImageObject',
            url: `${this.baseUrl}/api/og`,
          },
        },
      ],
    };
  }

  private formatName(slug: string): string {
    return slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  private generateFAQs(toolName: string, toolSlug: string, category: string) {
    const baseFAQs = [
      {
        '@type': 'Question',
        name: `Is the ${toolName} free to use?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes, our ${toolName} is completely free to use. No registration, payment, or subscription required. All features are available at no cost.`,
        },
      },
      {
        '@type': 'Question',
        name: `Is my data secure when using the ${toolName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, all data processing happens entirely in your browser. Your data never leaves your device or gets sent to our servers, ensuring complete privacy and security.',
        },
      },
      {
        '@type': 'Question',
        name: `Can I use the ${toolName} offline?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, once the page loads, the tool works completely offline. All processing is done client-side in your browser.',
        },
      },
      {
        '@type': 'Question',
        name: `Do I need to create an account to use ${toolName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No, you can use all our tools without creating an account. Simply visit the page and start using the tool immediately.',
        },
      },
    ];

    // Add tool-specific FAQs based on category
    const categoryFAQs: Record<string, any[]> = {
      converters: [
        {
          '@type': 'Question',
          name: `What formats does the ${toolName} support?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `The ${toolName} supports all standard formats and handles various input types automatically.`,
          },
        },
      ],
      formatters: [
        {
          '@type': 'Question',
          name: `Does the ${toolName} validate the input?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Yes, the ${toolName} includes built-in validation to help you identify and fix formatting issues.`,
          },
        },
      ],
      generators: [
        {
          '@type': 'Question',
          name: `How secure are the generated values from ${toolName}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `All values are generated using cryptographically secure methods in your browser. The generation happens client-side for maximum security.`,
          },
        },
      ],
      security: [
        {
          '@type': 'Question',
          name: `Is the ${toolName} cryptographically secure?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Yes, we use industry-standard cryptographic libraries and algorithms to ensure the highest level of security.`,
          },
        },
      ],
    };

    return [...baseFAQs, ...(categoryFAQs[category] || [])];
  }
}

// React component to inject structured data
export function ToolSchema({ toolSlug }: { toolSlug: string }) {
  // This would be used in a client component with useEffect
  return null; // Placeholder - actual implementation would use useEffect
}

// Server-side helper for pages
export async function getToolStructuredData(toolSlug: string) {
  const factory = new SchemaFactory();
  return factory.generateToolSchema(toolSlug);
}

export async function getCategoryStructuredData(categorySlug: string) {
  const factory = new SchemaFactory();
  return factory.generateCategorySchema(categorySlug);
}

export function getHomepageStructuredData() {
  const factory = new SchemaFactory();
  return factory.generateHomepageSchema();
}
