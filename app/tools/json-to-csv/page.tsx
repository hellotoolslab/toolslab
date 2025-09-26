import { Metadata } from 'next';
import { Suspense } from 'react';
import ToolPageClient from '@/components/tools/ToolPageClient';
import { generateToolSchema } from '@/lib/tool-schema';
import { getToolById } from '@/lib/tools';
import { toolSEO } from '@/lib/tool-seo';

const TOOL_ID = 'json-to-csv';

export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById(TOOL_ID);
  const seo = toolSEO[TOOL_ID];

  if (!tool) {
    return {
      title: 'Tool Not Found',
      description: 'The requested tool could not be found.',
    };
  }

  return {
    title: 'JSON to CSV Converter - Convert JSON to Excel CSV Format',
    description: seo?.metaDescription || tool.description,
    keywords: [
      ...new Set([...tool.keywords, 'converter', 'online tool', 'free']),
    ],
    openGraph: {
      title: 'JSON to CSV Converter - Free Online Tool',
      description:
        'Transform JSON data into CSV format with advanced options. Perfect for Excel imports, data analysis, and API response conversion.',
      type: 'website',
      url: 'https://toolslab.dev/tools/json-to-csv',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'JSON to CSV Converter',
      description:
        'Convert JSON to CSV with column mapping, nested object flattening, and custom formatting. Export to Excel-compatible format.',
    },
    alternates: {
      canonical: 'https://toolslab.dev/tools/json-to-csv',
    },
  };
}

export default function JsonToCsvPage() {
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
