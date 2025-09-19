import { Suspense } from 'react';
import { Metadata } from 'next';
import ToolPageClient from '@/components/tools/ToolPageClient';

const TOOL_ID = 'json-to-typescript';

export const metadata: Metadata = {
  title: 'JSON to TypeScript Converter - Generate Types from JSON | ToolsLab',
  description:
    'Advanced JSON to TypeScript converter with smart type inference, optional properties, and nested interface support. Convert API responses, configuration objects, and complex JSON structures to production-ready TypeScript interfaces. Features union types, enum detection, date parsing, custom naming conventions, and immutable options.',
  keywords: [
    'json to typescript',
    'typescript interface generator',
    'json to interface',
    'type generator',
    'typescript types from json',
    'interface generator',
    'typescript converter',
    'json parser',
    'type inference',
    'typescript definitions',
    'api types',
    'type safety',
    'typescript interfaces',
    'json schema',
    'type generation',
    'developer tools',
    'code generator',
    'typescript typing',
    'json typing',
    'interface extractor',
    'zod schema generator',
    'typescript validation',
    'api response types',
    'typescript utility',
    'json to zod',
    'type checker',
    'interface builder',
    'typescript code generator',
    'json to interface converter',
    'typescript type generator',
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

export default function JsonToTypeScriptPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[200px] items-center justify-center">
          Loading...
        </div>
      }
    >
      <ToolPageClient toolId={TOOL_ID} />
    </Suspense>
  );
}
