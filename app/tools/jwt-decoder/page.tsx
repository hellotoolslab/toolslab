import { Metadata } from 'next';
import { Suspense } from 'react';
import ToolPageClient from '@/components/tools/ToolPageClient';
import { getToolById } from '@/lib/tools';
import { toolSEO } from '@/lib/tool-seo';
import { generateToolSchema } from '@/lib/tool-schema';
const TOOL_ID = 'jwt-decoder';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById(TOOL_ID);
  const seo = toolSEO[TOOL_ID];

  if (!tool || !seo) {
    return {
      title: 'JWT Decoder Not Found - ToolsLab',
      description: 'The JWT decoder tool was not found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `JWT Decoder - Decode & Analyze JSON Web Tokens Online | ToolsLab`,
    description: seo.seoDescription,
    keywords: [
      ...tool.keywords,
      'jwt decoder',
      'json web token',
      'jwt parser',
      'token decoder',
      'jwt analyzer',
      'jwt validator',
      'token inspector',
      'claims decoder',
      'jwt security',
      'authentication token',
      'bearer token',
      'oauth token',
      'jwt signature',
      'token expiration',
      'jwt claims',
      'base64url decoder',
      'online tool',
      'free tool',
      'developer tool',
      'web tool',
      'toolslab',
    ].join(', '),

    openGraph: {
      title: 'JWT Decoder - Decode & Analyze JSON Web Tokens | ToolsLab',
      description:
        'Professional JWT decoder with claims analysis, security validation, and expiration checking. Decode JSON Web Tokens safely with detailed token information and security recommendations.',
      type: 'website',
      url: 'https://toolslab.dev/tools/jwt-decoder',
      images: [
        {
          url: '/tools/jwt-decoder/opengraph-image.png',
          width: 1200,
          height: 630,
          alt: 'JWT Decoder - ToolsLab',
        },
      ],
      siteName: 'ToolsLab',
    },

    twitter: {
      card: 'summary_large_image',
      title: 'JWT Decoder - Decode JSON Web Tokens | ToolsLab',
      description:
        'Professional JWT decoder with claims analysis, security validation, and expiration checking. Perfect for developers working with authentication tokens.',
      images: ['/tools/jwt-decoder/opengraph-image.png'],
      creator: '@toolslab',
    },

    alternates: {
      canonical: 'https://toolslab.dev/tools/jwt-decoder',
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

export default function JwtDecoderPage() {
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
