import { Metadata } from 'next';
import { Suspense } from 'react';
import ToolPageClient from '@/components/tools/ToolPageClient';
import { getToolById } from '@/lib/tools';
import { toolSEO } from '@/lib/tool-seo';
import { generateToolSchema } from '@/lib/tool-schema';
const TOOL_ID = 'url-encode';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById(TOOL_ID);
  const seo = toolSEO[TOOL_ID];

  if (!tool || !seo) {
    return {
      title: 'URL Encoder Not Found - ToolsLab',
      description: 'The URL encoder tool was not found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `URL Encoder/Decoder - Encode & Decode URLs Safely`,
    description: seo.metaDescription,
    keywords: [
      ...tool.keywords,
      'url encoder',
      'url decoder',
      'percent encoding',
      'uri encoding',
      'query parameters',
      'url components',
      'special characters',
      'international characters',
      'web development',
      'http encoding',
      'form encoding',
      'api parameters',
      'url validation',
      'web forms',
      'online tool',
      'free tool',
      'developer tool',
      'web tool',
      'toolslab',
    ].join(', '),

    openGraph: {
      title: 'URL Encoder/Decoder - Encode & Decode URLs Safely',
      description:
        'Professional URL encoder and decoder for web development. Handle special characters, query parameters, and international text in URLs safely. Perfect for API development and web forms.',
      type: 'website',
      url: 'https://toolslab.dev/tools/url-encode',
      images: [
        {
          url: '/tools/url-encode/opengraph-image.png',
          width: 1200,
          height: 630,
          alt: 'URL Encoder/Decoder - ToolsLab',
        },
      ],
      siteName: 'ToolsLab',
    },

    twitter: {
      card: 'summary_large_image',
      title: 'URL Encoder/Decoder - Encode & Decode URLs',
      description:
        'Professional URL encoder and decoder with support for special characters, query parameters, and international text. Perfect for web developers and API integration.',
      images: ['/tools/url-encode/opengraph-image.png'],
      creator: '@toolslab',
    },

    alternates: {
      canonical: 'https://toolslab.dev/tools/url-encode',
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

export default function UrlEncodePage() {
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
