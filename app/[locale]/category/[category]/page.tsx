import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { categories } from '@/lib/tools';
import { getCategorySEO } from '@/lib/category-seo';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { locales, type Locale } from '@/lib/i18n/config';
import LocaleCategoryPageContent from '@/components/layout/LocaleCategoryPageContent';

interface LocaleCategoryPageProps {
  params: {
    locale: string;
    category: string;
  };
}

export async function generateStaticParams() {
  // Generate paths for all locale/category combinations
  const paths = [];

  for (const locale of locales) {
    for (const category of categories) {
      paths.push({
        locale,
        category: category.id,
      });
    }
  }

  return paths;
}

export async function generateMetadata({
  params,
}: LocaleCategoryPageProps): Promise<Metadata> {
  const { locale, category: categoryId } = params;

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    return {};
  }

  const category = categories.find((cat) => cat.id === categoryId);
  const seoContent = getCategorySEO(categoryId);

  if (!category || !seoContent) {
    return {
      title: 'Category Not Found - ToolsLab',
      description: 'The requested category was not found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const dict = await getDictionary(locale as Locale);
  const categoryDict = dict.categories[categoryId];

  // Generate localized metadata
  const title =
    locale === 'it'
      ? `${categoryDict?.name || category.name} - Strumenti Gratuiti Online | ToolsLab`
      : `${seoContent.h1Title} - Free Online Tools | ToolsLab`;

  const description =
    locale === 'it'
      ? `Scopri ${category.tools.length} strumenti professionali per ${categoryDict?.name?.toLowerCase() || category.name.toLowerCase()}. Gratuiti, sicuri e senza registrazione. Perfetti per sviluppatori e professionisti.`
      : seoContent.metaDescription;

  const keywords =
    locale === 'it'
      ? `strumenti ${categoryDict?.name?.toLowerCase() || category.name.toLowerCase()}, strumenti online gratuiti, ${categoryDict?.name?.toLowerCase()} italiano, toolslab, sviluppatori`
      : seoContent.keywords;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: `${categoryDict?.name || category.name} - ToolsLab`,
      description,
      type: 'website',
      url: `https://toolslab.dev/${locale}/category/${categoryId}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryDict?.name || category.name} - ToolsLab`,
      description,
    },
    alternates: {
      canonical: `https://toolslab.dev/${locale}/category/${categoryId}`,
      languages: {
        en: `https://toolslab.dev/category/${categoryId}`,
        it: `https://toolslab.dev/it/category/${categoryId}`,
      },
    },
  };
}

export default async function LocaleCategoryPage({
  params,
}: LocaleCategoryPageProps) {
  const { locale, category: categoryId } = params;

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const category = categories.find((cat) => cat.id === categoryId);
  if (!category) {
    notFound();
  }

  const dict = await getDictionary(locale as Locale);

  return (
    <Suspense
      fallback={<div className="animate-pulse">Loading category...</div>}
    >
      <LocaleCategoryPageContent
        categoryId={categoryId}
        locale={locale as Locale}
        dictionary={dict}
      />
    </Suspense>
  );
}
