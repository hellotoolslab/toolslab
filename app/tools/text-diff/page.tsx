import { Metadata } from 'next';
import { Suspense } from 'react';
import ToolPageClient from '@/components/tools/ToolPageClient';
import { generateToolSchema } from '@/lib/tool-schema';

const TOOL_ID = 'text-diff';

export const metadata: Metadata = {
  title: 'Text Diff Checker - Compare Files & Code Online | ToolsLab',
  description:
    'Professional text comparison tool with syntax highlighting, patch generation, and side-by-side diff views. Compare code files, documents, and text with line-by-line differences.',
  keywords:
    'text diff, file compare, code diff, diff checker, text comparison, file diff, merge tool, patch generator, git diff, code review, document compare, text changes',
  openGraph: {
    title: 'Text Diff Checker - Professional File & Code Comparison',
    description:
      'Compare files and code with advanced diff features, syntax highlighting, and multiple view modes. Generate patches and export differences.',
    type: 'website',
    url: 'https://toolslab.dev/tools/text-diff',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Text Diff Checker - Compare Files & Code',
    description:
      'Professional text comparison with syntax highlighting and patch generation. Perfect for code reviews and document tracking.',
  },
  alternates: {
    canonical: 'https://toolslab.dev/tools/text-diff',
  },
};

export default function TextDiffPage() {
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
