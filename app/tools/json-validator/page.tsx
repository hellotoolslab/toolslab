import { Suspense } from 'react';
import { Metadata } from 'next';
import ToolPageClient from '@/components/tools/ToolPageClient';
import { generateToolSchema } from '@/lib/tool-schema';
import { getToolMetaDescription } from '@/lib/tool-seo';

const TOOL_ID = 'json-validator';

export const metadata: Metadata = {
  title: 'JSON Validator - Advanced JSON Validation Tool | ToolsLab',
  description: getToolMetaDescription(TOOL_ID),
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
    description: getToolMetaDescription(TOOL_ID),
    type: 'website',
    url: 'https://toolslab.dev/tools/json-validator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON Validator - Advanced JSON Validation Tool',
    description: getToolMetaDescription(TOOL_ID),
  },
  alternates: {
    canonical: 'https://toolslab.dev/tools/json-validator',
  },
};

export default function JSONValidatorPage() {
  const structuredData = generateToolSchema(TOOL_ID);

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <Suspense fallback={<div>Loading JSON Validator...</div>}>
        <ToolPageClient toolId={TOOL_ID} />
      </Suspense>
    </>
  );
}
