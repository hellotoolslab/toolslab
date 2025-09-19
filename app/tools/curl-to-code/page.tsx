import { Suspense } from 'react';
import { Metadata } from 'next';
import ToolPageClient from '@/components/tools/ToolPageClient';

const TOOL_ID = 'curl-to-code';

export const metadata: Metadata = {
  title: 'cURL to Code Converter - Generate HTTP Client Code | ToolsLab',
  description:
    'Convert cURL commands to production-ready code in JavaScript, Python, Go, Java, PHP, Ruby, and 15+ languages. Features automatic error handling, type inference, async/await support, and best practices integration.',
  keywords: [
    'curl to code',
    'curl converter',
    'curl to javascript',
    'curl to python',
    'http client generator',
    'api code generator',
    'curl to axios',
    'curl to fetch',
    'curl to golang',
    'curl to java',
    'curl to csharp',
    'curl to php',
    'curl to ruby',
    'rest api converter',
    'http request converter',
    'postman to code',
    'har to code',
    'api client generator',
    'sdk generator',
    'curl parser',
  ],
  openGraph: {
    title: 'cURL to Code Converter - Generate HTTP Client Code',
    description:
      'Free online tool to convert cURL commands to production-ready code in 15+ programming languages with error handling and type safety.',
    type: 'website',
    images: [
      {
        url: '/og-images/curl-to-code.png',
        width: 1200,
        height: 630,
        alt: 'cURL to Code Converter Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'cURL to Code Converter - Generate HTTP Client Code',
    description:
      'Convert cURL commands to production-ready code in JavaScript, Python, Go, Java, PHP, and 15+ languages.',
    images: ['/og-images/curl-to-code.png'],
  },
  alternates: {
    canonical: 'https://toolslab.dev/tools/curl-to-code',
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

export default function CurlToCodePage() {
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
