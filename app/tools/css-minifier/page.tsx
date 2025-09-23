import { Metadata } from 'next';
import { Suspense } from 'react';
import ToolPageClient from '@/components/tools/ToolPageClient';
import { getToolById } from '@/lib/tools';
import { toolSEO } from '@/lib/tool-seo';

const TOOL_ID = 'css-minifier';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById(TOOL_ID);
  const seo = toolSEO[TOOL_ID];

  if (!tool || !seo) {
    return {
      title: 'CSS Minifier Not Found - ToolsLab',
      description: 'The CSS minifier tool was not found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `CSS Minifier/Beautifier - Optimize & Format CSS Online | ToolsLab`,
    description: seo.seoDescription,
    keywords: [
      ...tool.keywords,
      'css minifier',
      'css beautifier',
      'css formatter',
      'css compressor',
      'css optimizer',
      'minimize css',
      'reduce css size',
      'css prettify',
      'production css',
      'css optimization',
      'online tool',
      'free tool',
      'developer tool',
      'web tool',
      'toolslab',
    ].join(', '),

    openGraph: {
      title: 'CSS Minifier/Beautifier - Optimize & Format CSS | ToolsLab',
      description:
        'Professional CSS minifier and beautifier with advanced optimization options. Reduce file size by 60%+ while preserving functionality. Features color optimization, rule merging, and vendor prefix handling.',
      type: 'website',
      url: 'https://toolslab.dev/tools/css-minifier',
      images: [
        {
          url: '/tools/css-minifier/opengraph-image.png',
          width: 1200,
          height: 630,
          alt: 'CSS Minifier/Beautifier - ToolsLab',
        },
      ],
      siteName: 'ToolsLab',
    },

    twitter: {
      card: 'summary_large_image',
      title: 'CSS Minifier/Beautifier - Optimize CSS | ToolsLab',
      description:
        'Professional CSS minifier and beautifier with advanced optimization. Reduce CSS file size for faster websites. Process CSS instantly in your browser.',
      images: ['/tools/css-minifier/opengraph-image.png'],
      creator: '@toolslab',
    },

    alternates: {
      canonical: 'https://toolslab.dev/tools/css-minifier',
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

export default function CssMinifierPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ToolPageClient toolId={TOOL_ID} />
    </Suspense>
  );
}
