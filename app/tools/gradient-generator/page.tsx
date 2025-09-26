import { Metadata } from 'next';
import { Suspense } from 'react';
import ToolPageClient from '@/components/tools/ToolPageClient';
import { generateToolSchema } from '@/lib/tool-schema';
import { getToolById } from '@/lib/tools';
import { toolSEO } from '@/lib/tool-seo';

const TOOL_ID = 'gradient-generator';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById(TOOL_ID);
  const seo = toolSEO[TOOL_ID];

  if (!tool || !seo) {
    return {
      title: 'Gradient Generator Not Found - ToolsLab',
      description: 'The gradient generator tool was not found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `Gradient Generator - Create Beautiful CSS Gradients`,
    description: seo.metaDescription,
    keywords: [
      ...new Set([
        ...(tool?.keywords || []),
        'gradient generator',
        'css gradient',
        'linear gradient',
        'radial gradient',
        'conic gradient',
        'online tool',
        'free tool',
        'developer tool',
        'web tool',
        'toolslab',
      ]),
    ].join(', '),
    openGraph: {
      title: 'Gradient Generator - Create Beautiful CSS Gradients',
      description:
        'Professional CSS gradient generator with visual editor, presets, and real-time preview. Create stunning backgrounds for web design.',
      type: 'website',
      url: 'https://toolslab.dev/tools/gradient-generator',
      images: [
        {
          url: '/tools/gradient-generator/opengraph-image.png',
          width: 1200,
          height: 630,
          alt: 'Gradient Generator - ToolsLab',
        },
      ],
      siteName: 'ToolsLab',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Gradient Generator - ToolsLab',
      description:
        'Create beautiful CSS gradients with visual editor, presets, and real-time preview.',
      images: ['/tools/gradient-generator/opengraph-image.png'],
      creator: '@toolslab',
    },
    alternates: {
      canonical: 'https://toolslab.dev/tools/gradient-generator',
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
    category: 'Web Development',
  };
}

export default function GradientGeneratorPage() {
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
