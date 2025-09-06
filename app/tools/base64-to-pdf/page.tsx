import { Metadata } from 'next';
import { Suspense } from 'react';
import ToolPageClient from '@/components/tools/ToolPageClient';

export const metadata: Metadata = {
  title: 'Base64 to PDF Converter - Free Online Tool | ToolsLab',
  description:
    'Convert Base64 encoded data to PDF files with instant download. Perfect for developers working with document APIs, email attachments, and data processing workflows. Secure browser-based conversion with no server uploads.',
  keywords:
    'base64 to pdf, convert base64, pdf converter, decode base64, pdf download, document conversion, api tools',
  openGraph: {
    title: 'Base64 to PDF Converter - Free Online Tool',
    description:
      'Convert Base64 encoded data to PDF files with instant download. Secure browser-based conversion.',
    type: 'website',
    url: 'https://toolslab.dev/tools/base64-to-pdf',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Base64 to PDF Converter - ToolsLab',
    description:
      'Convert Base64 encoded data to PDF files with instant download',
  },
};

function LoadingFallback() {
  return (
    <div className="flex h-96 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
    </div>
  );
}

export default function Base64ToPdfPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ToolPageClient toolId="base64-to-pdf" />
    </Suspense>
  );
}
