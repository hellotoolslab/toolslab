import { Metadata } from 'next';
import { Suspense } from 'react';
import ToolPageClient from '@/components/tools/ToolPageClient';
import { getToolById } from '@/lib/tools';
import { toolSEO } from '@/lib/tool-seo';

const TOOL_ID = 'js-minifier';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById(TOOL_ID);
  const seo = toolSEO[TOOL_ID];

  if (!tool || !seo) {
    return {
      title: 'JavaScript Minifier Not Found - ToolsLab',
      description: 'The JavaScript minifier tool was not found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `JavaScript Minifier/Beautifier - Optimize & Format JS Online | ToolsLab`,
    description: seo.seoDescription,
    keywords: [
      ...tool.keywords,
      'javascript minifier',
      'js minifier',
      'javascript beautifier',
      'js formatter',
      'compress javascript',
      'minify js',
      'javascript optimizer',
      'es6 minifier',
      'webpack optimizer',
      'production js',
      'bundle size',
      'source maps',
      'obfuscation',
      'tree shaking',
      'online tool',
      'free tool',
      'developer tool',
      'web tool',
      'toolslab',
    ].join(', '),

    openGraph: {
      title: 'JavaScript Minifier/Beautifier - Optimize & Format JS | ToolsLab',
      description:
        'Professional JavaScript minifier and beautifier with ES2024+ support, reducing bundle size by up to 70% while maintaining functionality. Features advanced optimizations, source maps, and modern JavaScript compatibility.',
      type: 'website',
      url: 'https://toolslab.dev/tools/js-minifier',
      images: [
        {
          url: '/tools/js-minifier/opengraph-image.png',
          width: 1200,
          height: 630,
          alt: 'JavaScript Minifier/Beautifier - ToolsLab',
        },
      ],
      siteName: 'ToolsLab',
    },

    twitter: {
      card: 'summary_large_image',
      title: 'JavaScript Minifier/Beautifier - Optimize JS | ToolsLab',
      description:
        'Professional JavaScript minifier and beautifier with ES2024+ support and advanced optimizations. Reduce bundle size for faster websites. Process JS instantly in your browser.',
      images: ['/tools/js-minifier/opengraph-image.png'],
      creator: '@toolslab',
    },

    alternates: {
      canonical: 'https://toolslab.dev/tools/js-minifier',
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

export default function JsMinifierPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ToolPageClient toolId={TOOL_ID} />
    </Suspense>
  );
}
