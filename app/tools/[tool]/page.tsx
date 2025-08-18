import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { tools, getToolById } from '@/lib/tools';
import { ToolLayout } from '@/components/tools/ToolLayout';

interface ToolPageProps {
  params: {
    tool: string;
  };
}

export async function generateStaticParams() {
  return tools.map((tool) => ({
    tool: tool.id,
  }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const tool = getToolById(params.tool);
  
  if (!tool) {
    return {
      title: 'Tool Not Found',
    };
  }

  return {
    title: `${tool.name} - OctoTools`,
    description: tool.description,
    keywords: tool.keywords,
    openGraph: {
      title: `${tool.name} - OctoTools`,
      description: tool.description,
      url: `https://octotools.dev${tool.route}`,
      siteName: 'OctoTools',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool.name} - OctoTools`,
      description: tool.description,
    },
  };
}

export default function ToolPage({ params }: ToolPageProps) {
  const tool = getToolById(params.tool);

  if (!tool) {
    notFound();
  }

  return <ToolLayout tool={tool} />;
}