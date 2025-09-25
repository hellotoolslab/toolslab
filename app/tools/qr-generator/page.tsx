import { Metadata } from 'next';
import { Suspense } from 'react';
import ToolPageClient from '@/components/tools/ToolPageClient';
import { getToolById } from '@/lib/tools';
import { toolSEO } from '@/lib/tool-seo';
import { generateToolSchema } from '@/lib/tool-schema';
const TOOL_ID = 'qr-generator';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById(TOOL_ID);
  const seo = toolSEO[TOOL_ID];

  if (!tool || !seo) {
    return {
      title: 'QR Code Generator Not Found - ToolsLab',
      description: 'The QR code generator tool was not found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `QR Code Generator - Create QR Codes with Logos & Batch Processing | ToolsLab`,
    description: seo.metaDescription,
    keywords: [
      ...tool.keywords,
      'qr code generator',
      'qr code maker',
      'wifi qr code',
      'vcard qr code',
      'qr code with logo',
      'batch qr codes',
      'svg qr code',
      'api qr code',
      'developer qr tool',
      'online qr generator',
      'free qr code',
      'mobile qr scanner',
      'crypto qr code',
      'email qr code',
      'business card qr',
      'toolslab',
    ].join(', '),

    openGraph: {
      title: 'QR Code Generator - Advanced QR Codes with Logos | ToolsLab',
      description:
        'Professional QR code generator with logo embedding, WiFi/vCard creation, batch processing, and developer tools. Generate QR codes for URLs, contacts, WiFi, and crypto.',
      type: 'website',
      url: 'https://toolslab.dev/tools/qr-generator',
      images: [
        {
          url: '/tools/qr-generator/opengraph-image.png',
          width: 1200,
          height: 630,
          alt: 'QR Code Generator - ToolsLab',
        },
      ],
      siteName: 'ToolsLab',
    },

    twitter: {
      card: 'summary_large_image',
      title: 'QR Code Generator - Create Advanced QR Codes | ToolsLab',
      description:
        'Generate professional QR codes with logos, WiFi credentials, vCards, and more. Features batch processing, API integration, and developer tools.',
      images: ['/tools/qr-generator/opengraph-image.png'],
      creator: '@toolslab',
    },

    alternates: {
      canonical: 'https://toolslab.dev/tools/qr-generator',
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

export default function QRGeneratorPage() {
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
