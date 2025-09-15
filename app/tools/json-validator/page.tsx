import { Suspense } from 'react';
import { Metadata } from 'next';
import ToolPageClient from '@/components/tools/ToolPageClient';

export const metadata: Metadata = {
  title: 'JSON Validator - Advanced JSON Validation Tool | ToolsLab',
  description:
    'Professional JSON validator with schema support, real-time error reporting, and security auditing. Validate API responses, configuration files, and data structures with comprehensive validation levels.',
  keywords: [
    'json validator',
    'json schema',
    'json validation',
    'api testing',
    'json parser',
    'schema validation',
    'json formatter',
    'json security',
    'data validation',
    'json audit',
  ],
  openGraph: {
    title: 'JSON Validator - Advanced JSON Validation Tool',
    description:
      'Professional JSON validator with schema support, real-time error reporting, and security auditing.',
    type: 'website',
    url: 'https://toolslab.dev/tools/json-validator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON Validator - Advanced JSON Validation Tool',
    description:
      'Professional JSON validator with schema support, real-time error reporting, and security auditing.',
  },
  alternates: {
    canonical: 'https://toolslab.dev/tools/json-validator',
  },
};

export default function JSONValidatorPage() {
  return (
    <Suspense fallback={<div>Loading JSON Validator...</div>}>
      <ToolPageClient toolId="json-validator" />
    </Suspense>
  );
}
