import { Metadata } from 'next';
import { Suspense } from 'react';
import ToolPageClient from '@/components/tools/ToolPageClient';

const TOOL_ID = 'yaml-json-converter';

export const metadata: Metadata = {
  title: 'YAML to JSON Converter - Free Online YAML Parser | ToolsLab',
  description:
    'Convert YAML to JSON and JSON to YAML instantly. Free online converter with validation, multi-document support, and advanced formatting. Handles anchors, comments, and complex data types.',
  keywords: [
    'yaml to json',
    'json to yaml',
    'yaml converter',
    'yaml parser',
    'kubernetes config',
    'docker compose',
    'yaml validator',
    'online yaml tool',
    'config converter',
    'yaml formatter',
    'json formatter',
    'devops tools',
    'yaml json converter',
    'yaml to json online',
    'json to yaml online',
  ].join(', '),
  openGraph: {
    title: 'YAML to JSON Converter - Free Online Tool',
    description:
      'Convert between YAML and JSON formats with advanced validation, multi-document support, and formatting options. Perfect for Kubernetes, Docker, and CI/CD configs.',
    type: 'website',
    url: 'https://toolslab.dev/tools/yaml-json-converter',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YAML to JSON Converter - Free Online Tool',
    description:
      'Convert between YAML and JSON formats with validation and advanced features.',
  },
  alternates: {
    canonical: 'https://toolslab.dev/tools/yaml-json-converter',
  },
};

export default function YamlJsonConverterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ToolPageClient toolId={TOOL_ID} />
    </Suspense>
  );
}
