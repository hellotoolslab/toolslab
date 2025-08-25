import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { categories } from '@/lib/tools';
import CategoryPageContent from '@/components/layout/CategoryPageContent';

interface Props {
  params: { category: string };
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    category: category.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = categories.find((cat) => cat.id === params.category);

  if (!category) {
    return {};
  }

  return {
    title: `${category.name} Tools - Free Online Developer Tools | ToolsLab`,
    description: `${category.description} Access ${category.tools.length} free ${category.name.toLowerCase()} tools with no signup required.`,
    keywords: [
      category.name.toLowerCase(),
      'developer tools',
      'free tools',
      'online tools',
      ...category.tools.flatMap((tool) => tool.keywords).slice(0, 15),
    ],
    openGraph: {
      title: `${category.name} Tools - ToolsLab`,
      description: category.description,
      type: 'website',
      url: `https://octotools.org/category/${params.category}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} Tools - ToolsLab`,
      description: category.description,
    },
    alternates: {
      canonical: `https://octotools.org/category/${params.category}`,
    },
  };
}

export default function CategoryPage({ params }: Props) {
  const category = categories.find((cat) => cat.id === params.category);

  if (!category) {
    notFound();
  }

  return <CategoryPageContent categoryId={params.category} />;
}
