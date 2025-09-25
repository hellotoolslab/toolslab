import { Metadata } from 'next';
import { Suspense } from 'react';
import ToolPageClient from '@/components/tools/ToolPageClient';
import { getToolById } from '@/lib/tools';
import { toolSEO } from '@/lib/tool-seo';
import { generateToolSchema } from '@/lib/tool-schema';

const TOOL_ID = 'xml-formatter';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById(TOOL_ID);
  const seo = toolSEO[TOOL_ID];

  if (!tool || !seo) {
    return {
      title: 'XML Formatter Not Found - ToolsLab',
      description: 'The XML formatter tool was not found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `XML Formatter - Format, Validate & Minify XML Online | ToolsLab`,
    description: seo.metaDescription,
    keywords: [
      ...tool.keywords,
      'xml formatter',
      'xml validator',
      'xml beautifier',
      'xml minifier',
      'xml parser',
      'xpath search',
      'namespace analysis',
      'soap xml',
      'rss xml',
      'svg formatter',
      'online tool',
      'free tool',
      'developer tool',
      'web tool',
      'toolslab',
    ].join(', '),

    openGraph: {
      title: 'XML Formatter - Format, Validate & Minify XML | ToolsLab',
      description:
        'Professional XML formatter with syntax validation, beautification, minification, XPath search, and namespace support. Perfect for SOAP, RSS, SVG files.',
      type: 'website',
      url: 'https://toolslab.dev/tools/xml-formatter',
      images: [
        {
          url: '/tools/xml-formatter/opengraph-image.png',
          width: 1200,
          height: 630,
          alt: 'XML Formatter - ToolsLab',
        },
      ],
      siteName: 'ToolsLab',
    },

    twitter: {
      card: 'summary_large_image',
      title: 'XML Formatter - Format & Validate XML | ToolsLab',
      description:
        'Professional XML formatter with validation, beautification, minification, and XPath search. Perfect for developers working with XML data.',
      images: ['/tools/xml-formatter/opengraph-image.png'],
      creator: '@toolslab',
    },

    alternates: {
      canonical: 'https://toolslab.dev/tools/xml-formatter',
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    authors: [{ name: 'ToolsLab' }],
    creator: 'ToolsLab',
    publisher: 'ToolsLab',
    category: 'technology',

    // Additional metadata for better SEO
    other: {
      'article:author': 'ToolsLab',
      'article:publisher': 'ToolsLab',
      'og:locale': 'en_US',
      'og:type': 'website',
    },
  };
}

export default function XmlFormatterPage() {
  const structuredData = generateToolSchema(TOOL_ID);

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <Suspense fallback={<div>Loading...</div>}>
        <ToolPageClient toolId={TOOL_ID} />
      </Suspense>
    </>
  );
}
