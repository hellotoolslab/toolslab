import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ToolPageClient from '@/components/tools/ToolPageClient';
import { tools, getToolById, categories } from '@/lib/tools';

interface ToolPageProps {
  params: {
    tool: string;
  };
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const tool = getToolById(params.tool);

  if (!tool) {
    return {
      title: 'Tool Not Found - ToolsLab',
    };
  }

  // Get primary category name
  const primaryCategory = categories.find(
    (cat) => cat.id === tool.categories[0]
  );
  const categoryName = primaryCategory?.name || 'Tools';

  return {
    title: `${tool.name} - Free Online Tool | ToolsLab`,
    description: tool.description,
    keywords: `${tool.name}, ${categoryName}, online tool, free tool, web utility`,
    openGraph: {
      title: `${tool.name} - ToolsLab`,
      description: tool.description,
      type: 'website',
    },
  };
}

export async function generateStaticParams() {
  return tools.map((tool) => ({
    tool: tool.id,
  }));
}

export default function ToolPage({ params }: ToolPageProps) {
  const tool = getToolById(params.tool);

  if (!tool) {
    notFound();
  }

  return <ToolPageClient toolSlug={params.tool} />;
}
