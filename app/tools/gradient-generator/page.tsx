import { Metadata } from 'next';
import { Suspense } from 'react';
import ToolPageClient from '@/components/tools/ToolPageClient';
import { generateToolSchema } from '@/lib/tool-schema';
const TOOL_ID = 'gradient-generator';

export const metadata: Metadata = {
  title: 'Gradient Generator - Create Beautiful CSS Gradients | ToolsLab',
  description:
    'Professional CSS gradient generator with linear, radial, and conic gradients. Create beautiful backgrounds with visual color stop editor, preset collections, and real-time preview. Export to CSS, Tailwind classes, and SVG.',
  keywords: [
    'gradient generator',
    'css gradient',
    'linear gradient',
    'radial gradient',
    'conic gradient',
    'gradient maker',
    'color gradient',
    'background generator',
    'css background',
    'web design',
    'ui design',
    'gradient tool',
    'color stops',
    'gradient presets',
    'tailwind gradient',
    'svg gradient',
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
