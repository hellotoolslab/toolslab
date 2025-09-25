import { Metadata } from 'next';
import { Suspense } from 'react';
import ToolPageClient from '@/components/tools/ToolPageClient';
import { generateToolSchema } from '@/lib/tool-schema';

const TOOL_ID = 'list-compare';

export const metadata: Metadata = {
  title: 'List Compare Tool - Advanced Diff & Set Operations | ToolsLab',
  description:
    'Compare multiple lists with advanced diff, set operations, fuzzy matching, and developer-friendly features. Perfect for comparing dependencies, files, endpoints, and data analysis with Venn diagrams and export options.',
  keywords: [
    'list compare',
    'list diff',
    'compare lists',
    'set operations',
    'venn diagram',
    'fuzzy matching',
    'list intersection',
    'list union',
    'compare files',
    'diff tool',
    'data comparison',
    'package dependencies',
    'api endpoints',
    'array compare',
    'list analysis',
    'duplicate finder',
    'data deduplication',
    'git files diff',
    'file comparison',
    'merge lists',
    'list validator',
    'data processing',
    'developer tools',
    'devops tools',
    'csv compare',
  ],
  openGraph: {
    title: 'List Compare & Diff Tool - Advanced Comparison | ToolsLab',
    description:
      'Professional list comparison with set operations, fuzzy matching, Venn diagrams, and developer-specific features. Compare up to 10 lists with export to multiple formats.',
    type: 'website',
    url: 'https://toolslab.dev/tools/list-compare',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'List Compare Tool - ToolsLab',
    description:
      'Advanced list comparison with set operations, fuzzy matching, and developer features. Perfect for dependencies, files, and data analysis.',
  },
  alternates: {
    canonical: 'https://toolslab.dev/tools/list-compare',
  },
};

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
