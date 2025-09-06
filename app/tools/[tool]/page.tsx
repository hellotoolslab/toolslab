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
      description: 'The requested tool was not found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  // Get primary category name
  const primaryCategory = categories.find(
    (cat) => cat.id === tool.categories[0]
  );
  const categoryName = primaryCategory?.name || 'Tools';

  // Generate comprehensive keywords
  const keywords = [
    tool.name.toLowerCase(),
    ...tool.keywords,
    'online tool',
    'free tool',
    'developer tool',
    'web tool',
    categoryName.toLowerCase(),
    'toolslab',
  ];

  // Create SEO-optimized description
  const seoDescription = `${tool.description}. Use our free online ${tool.name.toLowerCase()} tool. No installation required, works in your browser. Fast, secure, and free.`;

  // Optimize title length to stay under 70 characters
  const baseTitle = `${tool.name} - ToolsLab`;
  const longTitle = `${tool.name} - Free Online ${categoryName} Tool | ToolsLab`;
  const shortTitle = `${tool.name} - Free ${categoryName} Tool | ToolsLab`;

  // Choose title based on length
  let finalTitle: string;
  if (longTitle.length <= 70) {
    finalTitle = longTitle;
  } else if (shortTitle.length <= 70) {
    finalTitle = shortTitle;
  } else {
    finalTitle = baseTitle;
  }

  return {
    title: finalTitle,
    description: seoDescription,
    keywords: keywords.join(', '),

    openGraph: {
      title: `${tool.name} - Free Online Tool | ToolsLab`,
      description: tool.description,
      type: 'website',
      url: `https://toolslab.dev/tools/${params.tool}`,
      images: [
        {
          url: `/tools/${params.tool}/opengraph-image.png`,
          width: 1200,
          height: 630,
          alt: `${tool.name} - ToolsLab`,
        },
      ],
      siteName: 'ToolsLab',
    },

    twitter: {
      card: 'summary_large_image',
      title: `${tool.name} - ToolsLab`,
      description: tool.description,
      images: [`/tools/${params.tool}/opengraph-image.png`],
      creator: '@toolslab',
    },

    alternates: {
      canonical: `https://toolslab.dev/tools/${params.tool}`,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    authors: [{ name: 'ToolsLab' }],
    creator: 'ToolsLab',
    publisher: 'ToolsLab',
    category: 'technology',
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

  return <ToolPageClient toolId={params.tool} />;
}
