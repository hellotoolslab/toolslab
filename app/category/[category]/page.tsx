import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { categories } from '@/lib/tools';
import CategoryPageContent from '@/components/layout/CategoryPageContent';
import { getCategorySEO } from '@/lib/category-seo';

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
  const seoContent = getCategorySEO(params.category);

  if (!category || !seoContent) {
    return {};
  }

  return {
    title: `${seoContent.h1Title} - Free Online Tools | ToolsLab`,
    description: seoContent.metaDescription,
    keywords: seoContent.keywords,
    openGraph: {
      title: `${seoContent.h1Title} - ToolsLab`,
      description: seoContent.metaDescription,
      type: 'website',
      url: `https://toolslab.dev/category/${params.category}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${seoContent.h1Title} - ToolsLab`,
      description: seoContent.metaDescription,
    },
    alternates: {
      canonical: `https://toolslab.dev/category/${params.category}`,
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
