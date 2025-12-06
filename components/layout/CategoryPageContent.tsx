'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  categories,
  getToolsByCategory,
  getCategoryColorClass,
} from '@/lib/tools';
import { ToolCardWrapper } from '@/components/tools/ToolCardWrapper';
import { SearchBar } from '@/components/SearchBar';
import {
  getCategorySEO,
  generateCategoryStructuredData,
} from '@/lib/category-seo';
import { getToolById } from '@/lib/tools';
import { trackEngagement } from '@/lib/analytics';
import {
  ChevronRight,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Zap,
  Shield,
  Clock,
  ArrowRight,
} from 'lucide-react';
import Script from 'next/script';

interface CategoryPageContentProps {
  categoryId: string;
}

export default function CategoryPageContent({
  categoryId,
}: CategoryPageContentProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const category = categories.find((cat) => cat.id === categoryId);
  const seoContent = getCategorySEO(categoryId);

  const tools = category ? getToolsByCategory(category.id) : [];
  const structuredData = seoContent
    ? generateCategoryStructuredData(seoContent)
    : null;

  // Track category page engagement - BEFORE early return
  useEffect(() => {
    if (!category) return;

    trackEngagement('category-page-viewed', {
      category: categoryId,
      toolsCount: tools.length,
    });
  }, [categoryId, category, tools.length]);

  if (!category || !seoContent) {
    return <div>Category not found</div>;
  }

  // Helper function to get tool label
  const getToolLabelForTool = (toolId: string) => {
    const tool = getToolById(toolId);
    return tool?.label || '';
  };

  // Filter tools by their labels
  const newTools = tools.filter(
    (tool) => getToolLabelForTool(tool.id) === 'new'
  );
  const popularTools = tools.filter(
    (tool) => getToolLabelForTool(tool.id) === 'popular'
  );
  const testTools = tools.filter(
    (tool) => getToolLabelForTool(tool.id) === 'test'
  );
  const otherTools = tools.filter((tool) => {
    const label = getToolLabelForTool(tool.id);
    return (
      !label ||
      (label !== 'new' &&
        label !== 'popular' &&
        label !== 'coming-soon' &&
        label !== 'test')
    );
  });

  const categoryColorClass = getCategoryColorClass(category.id);

  // Get category color for inline styles
  const getCategoryColor = () => {
    const colors: Record<string, string> = {
      data: '#0EA5E9',
      encoding: '#10B981',
      text: '#8B5CF6',
      generators: '#F97316',
      web: '#EC4899',
      dev: '#F59E0B',
      formatters: '#6366F1',
      social: '#F43F5E',
    };
    return colors[categoryId] || '#3B82F6';
  };

  const categoryColor = getCategoryColor();

  return (
    <>
      {/* Structured Data */}
      <Script
        id="category-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        {/* Optimized Hero Section - Reduced spacing by 40% */}
        <section className="relative py-8 sm:py-10">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            {/* Breadcrumb - Minimal top margin */}
            <nav className="mb-3 flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
              <Link
                href="/"
                className="hover:text-gray-900 dark:hover:text-gray-100"
              >
                Home
              </Link>
              <ChevronRight className="h-3 w-3" />
              <Link
                href="/tools"
                className="hover:text-gray-900 dark:hover:text-gray-100"
              >
                Tools
              </Link>
              <ChevronRight className="h-3 w-3" />
              <Link
                href="/categories"
                className="hover:text-gray-900 dark:hover:text-gray-100"
              >
                Categories
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {category.name}
              </span>
            </nav>

            {/* Header aligned with tool page design */}
            <div className="mb-2 flex items-center gap-2 sm:gap-3">
              {/* Compact Icon */}
              <div
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl shadow-sm sm:h-14 sm:w-14"
                style={{ backgroundColor: `${categoryColor}20` }}
              >
                <span className="text-2xl" style={{ color: categoryColor }}>
                  {category.icon}
                </span>
              </div>

              {/* Title inline */}
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl lg:text-4xl">
                {seoContent.h1Title}
              </h1>

              {/* Category count badge */}
              <span
                className="ml-auto rounded-full px-2.5 py-1 text-xs font-medium capitalize"
                style={{
                  backgroundColor: `${categoryColor}15`,
                  color: categoryColor,
                }}
              >
                {tools.length} tools
              </span>
            </div>

            {/* Tagline - closely connected to title */}
            <p className="mb-4 text-base text-gray-700 dark:text-gray-300 sm:text-lg">
              {seoContent.tagline}
            </p>

            {/* SEO Description - proper separation */}
            <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400 md:line-clamp-none">
              {seoContent.description}
            </p>

            {/* Benefits Grid - Compact */}
            <div className="mb-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
              {seoContent.benefits.slice(0, 3).map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle
                    className="h-3.5 w-3.5 flex-shrink-0"
                    style={{ color: categoryColor }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>

            {/* Use Cases - Inline */}
            <div className="mb-4 hidden flex-wrap items-center gap-1 md:flex">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                💡 Perfect for:
              </span>
              {seoContent.useCases.map((useCase, index) => (
                <span key={index}>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {useCase}
                  </span>
                  {index < seoContent.useCases.length - 1 && (
                    <span className="mx-1 text-gray-400">•</span>
                  )}
                </span>
              ))}
            </div>

            {/* Search Bar - Simplified */}
            <div className="mb-5 w-full">
              <SearchBar />
            </div>
          </div>
        </section>

        {/* Tools Grid - Minimal spacing */}
        <section className="container mx-auto max-w-7xl px-4 pb-12 sm:px-6">
          {/* New Tools */}
          {newTools.length > 0 && (
            <section className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold sm:text-xl">
                  <Sparkles className="h-5 w-5 text-green-500" />
                  New Tools
                </h2>
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  Recently Added
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {newTools.map((tool) => (
                  <ToolCardWrapper key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          )}

          {/* Popular Tools */}
          {popularTools.length > 0 && (
            <section className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold sm:text-xl">
                  <TrendingUp className="h-5 w-5 text-yellow-500" />
                  Popular Tools
                </h2>
                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                  Most Used
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {popularTools.map((tool) => (
                  <ToolCardWrapper key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          )}

          {/* Test Tools */}
          {testTools.length > 0 && (
            <section className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold sm:text-xl">
                  <svg
                    className="h-5 w-5 text-blue-500"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
                  </svg>
                  In Testing
                </h2>
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  Beta Phase
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {testTools.map((tool) => (
                  <ToolCardWrapper key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          )}

          {/* All Other Tools */}
          {otherTools.length > 0 && (
            <section className="mb-8">
              <div className="mb-4">
                <h2 className="text-lg font-bold sm:text-xl">
                  More {category.name} Tools
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {otherTools.map((tool) => (
                  <ToolCardWrapper key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          )}

          {/* FAQ Section - SEO Rich */}
          <section className="mt-12 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold">
              Frequently Asked Questions about {category.name} Tools
            </h2>
            <div className="space-y-3">
              {seoContent.faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border-b border-gray-100 pb-3 last:border-0 dark:border-gray-700"
                >
                  <button
                    onClick={() =>
                      setExpandedFaq(expandedFaq === index ? null : index)
                    }
                    className="flex w-full items-start justify-between text-left"
                  >
                    <h3 className="pr-4 text-sm font-medium text-gray-900 dark:text-white">
                      {faq.question}
                    </h3>
                    <ChevronRight
                      className={`h-4 w-4 flex-shrink-0 transition-transform ${
                        expandedFaq === index ? 'rotate-90' : ''
                      }`}
                      style={{ color: categoryColor }}
                    />
                  </button>
                  {expandedFaq === index && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Related Categories */}
          {seoContent.relatedCategories.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-3 text-lg font-bold">Related Categories</h2>
              <div className="flex flex-wrap gap-2">
                {seoContent.relatedCategories.map((relatedId) => {
                  const relatedCategory = categories.find(
                    (c) => c.id === relatedId
                  );
                  if (!relatedCategory) return null;

                  return (
                    <Link
                      key={relatedId}
                      href={`/category/${relatedId}`}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                    >
                      <span>{relatedCategory.icon}</span>
                      <span>{relatedCategory.name}</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Browse All Tools CTA - Moved to be last after Related Categories */}
          <section className="mb-8 mt-12 text-center">
            <div className="rounded-xl border border-gray-200 bg-gradient-to-r from-violet-50 to-purple-50 p-8 dark:border-gray-700 dark:from-violet-900/20 dark:to-purple-900/20">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                Need More Tools?
              </h2>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                Explore our complete collection of{' '}
                {categories.reduce((sum, cat) => sum + cat.tools.length, 0)}+
                developer tools across all categories.
              </p>
              <Link
                href="/tools"
                className="inline-flex items-center rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                Browse All Tools
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </section>
        </section>
      </div>
    </>
  );
}
