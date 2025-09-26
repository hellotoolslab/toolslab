import { Metadata } from 'next';
import { Suspense } from 'react';
import ToolPageClient from '@/components/tools/ToolPageClient';
import { generateToolSchema } from '@/lib/tool-schema';
import { getToolById } from '@/lib/tools';
import { toolSEO } from '@/lib/tool-seo';

const TOOL_ID = 'list-compare';

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
    title: 'List Compare Tool - Advanced Diff & Set Operations',
    description: seo?.metaDescription || tool.description,
    keywords: [
      ...new Set([...tool.keywords, 'converter', 'online tool', 'free']),
    ],
    openGraph: {
      title: 'List Compare & Diff Tool - Advanced Comparison',
      description:
        'Professional list comparison with set operations, fuzzy matching, Venn diagrams, and developer-specific features. Compare up to 10 lists with export to multiple formats.',
      type: 'website',
      url: 'https://toolslab.dev/tools/list-compare',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'List Compare Tool',
      description:
        'Advanced list comparison with set operations, fuzzy matching, and developer features. Perfect for dependencies, files, and data analysis.',
    },
    alternates: {
      canonical: 'https://toolslab.dev/tools/list-compare',
    },
  };
}

export default function ListComparePage() {
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
