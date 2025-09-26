import { Suspense } from 'react';
import { Metadata } from 'next';
import ToolPageClient from '@/components/tools/ToolPageClient';
import { generateToolSchema } from '@/lib/tool-schema';
import { getToolById } from '@/lib/tools';
import { toolSEO } from '@/lib/tool-seo';

const TOOL_ID = 'json-to-typescript';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById(TOOL_ID);
  const seo = toolSEO[TOOL_ID];

  if (!tool) {
    return {
      title: 'Tool Not Found',
      description: 'The requested tool could not be found.',
    };
  }

  return {
    title: 'JSON to TypeScript Converter - Generate Types from JSON',
    description: seo?.metaDescription || tool.description,
    keywords: [
      ...new Set([...tool.keywords, 'converter', 'online tool', 'free']),
    ],
    openGraph: {
      title: 'JSON to TypeScript Converter - Generate Types from JSON',
      description:
        'Convert JSON to TypeScript interfaces instantly. Generate strongly-typed definitions with smart type inference, optional properties, and nested interface support. Perfect for TypeScript developers.',
      type: 'website',
      images: [
        {
          url: '/og-images/json-to-typescript.png',
          width: 1200,
          height: 630,
          alt: 'JSON to TypeScript Converter Tool',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'JSON to TypeScript Converter - Generate Types from JSON',
      description:
        'Advanced JSON to TypeScript converter with smart type inference, optional properties, and nested interface support.',
      images: ['/og-images/json-to-typescript.png'],
    },
    alternates: {
      canonical: 'https://toolslab.dev/tools/json-to-typescript',
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
  };
}

export default function JsonToTypeScriptPage() {
  const structuredData = generateToolSchema(TOOL_ID);

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <Suspense
        fallback={
          <div className="flex min-h-[200px] items-center justify-center">
            Loading...
          </div>
        }
      >
        <ToolPageClient toolId={TOOL_ID} />
      </Suspense>
    </>
  );
}
