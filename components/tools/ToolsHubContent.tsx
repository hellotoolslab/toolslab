'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocalizedRouter } from '@/hooks/useLocalizedRouter';
import { useDictionary } from '@/hooks/useDictionary';
import Link from 'next/link';
import {
  tools,
  categories,
  getToolsByCategory,
  getCategoryColorClass,
  type Tool,
} from '@/lib/tools';
import { ToolCardWrapper } from '@/components/tools/ToolCardWrapper';
import { SearchBar } from '@/components/SearchBar';
import {
  Search,
  Filter,
  Grid3X3,
  List,
  TrendingUp,
  Sparkles,
  Zap,
  Shield,
  ChevronRight,
  Star,
  Users,
  Clock,
  ArrowRight,
  CheckCircle2,
  X,
} from 'lucide-react';

type SortOption = 'alphabetical' | 'popular' | 'recent' | 'category';

interface ToolsHubContentProps {
  locale?: string;
  dictionary?: any;
}

export default function ToolsHubContent({
  locale,
  dictionary: propDictionary,
}: ToolsHubContentProps = {}) {
  const searchParams = useSearchParams();
  const { replace, createHref } = useLocalizedRouter();
  const { dictionary: hookDictionary, loading } = useDictionary();

  // Use provided dictionary or fall back to hook
  const dictionary = propDictionary || hookDictionary;

  // Translations with fallbacks to English
  const t = dictionary?.toolsPage || {
    breadcrumb: {
      home: 'Home',
      allTools: 'All Tools',
    },
    header: {
      title: 'All Developer Tools - Free Online Utilities',
      subtitle:
        'Complete collection of professional tools for developers, data analysts, and system administrators',
      description:
        'free browser-based tools for JSON formatting, Base64 encoding, hash generation, and more. Zero data transmission, no registration required.',
    },
    trust: {
      tools: 'tools',
      freeForever: 'Free forever',
      privacyFirst: 'Privacy-first',
    },
    search: { placeholder: "Search tools... (e.g. 'json', 'encode', 'hash')" },
    filters: {
      all: 'All',
      sortBy: 'Sort by:',
      mostPopular: 'Most Popular',
      alphabetical: 'A-Z',
      recentlyAdded: 'Recently Added',
      category: 'Category',
      clearFilters: 'Clear filters',
    },
    sections: {
      recentlyAdded: 'Recently Added Tools',
      newTools: 'new tools',
      mostPopular: 'Most Popular Tools',
      trendingTools: 'trending tools',
      allTools: 'All Tools',
    },
    empty: {
      title: 'No tools found',
      description: 'Try adjusting your search or filter criteria.',
      clearAll: 'Clear all filters',
    },
    seo: {
      whyChoose: {
        title: 'Why Choose ToolsLab Tools?',
        benefits: [
          'Complete privacy - all processing happens in your browser',
          'No registration or account required',
          'Professional-grade tools used by developers worldwide',
          'Real-time processing with instant results',
          'Mobile-friendly responsive design',
          'Regular updates with new tools and features',
        ],
      },
      workflows: {
        title: 'Common Developer Workflows',
        api: {
          title: 'API Development & Testing',
          tools: [
            'JSON Formatter',
            'JWT Decoder',
            'URL Encoder',
            'Hash Generator',
          ],
        },
        data: {
          title: 'Data Migration & ETL',
          tools: [
            'CSV to JSON',
            'Base64 Encoder',
            'SQL Formatter',
            'UUID Generator',
          ],
        },
        security: {
          title: 'Security & Authentication',
          tools: [
            'JWT Decoder',
            'Hash Generator',
            'Password Generator',
            'Base64 Tools',
          ],
        },
      },
    },
  };

  // Count total tools
  const totalTools = tools.length;

  // Get search and filter params
  const search = searchParams?.get('search') || '';
  const categoryFilter = searchParams?.get('category') || '';
  const sort = (searchParams?.get('sort') as SortOption) || 'popular';
  const popular = searchParams?.get('popular') === 'true';

  // State
  const [mounted, setMounted] = useState(false);

  // Set mounted on client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Filtered and sorted tools
  const filteredTools = useMemo(() => {
    let result = [...tools];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (tool) =>
          tool.name.toLowerCase().includes(searchLower) ||
          tool.description.toLowerCase().includes(searchLower) ||
          tool.keywords.some((keyword) =>
            keyword.toLowerCase().includes(searchLower)
          )
      );
    }

    // Apply category filter
    if (categoryFilter && categoryFilter !== 'all') {
      result = result.filter((tool) =>
        tool.categories.includes(categoryFilter)
      );
    }

    // Apply popular filter
    if (popular) {
      result = result.filter((tool) => tool.isPopular);
    }

    // Apply sorting
    switch (sort) {
      case 'alphabetical':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'popular':
        result.sort((a, b) => {
          if (a.isPopular && !b.isPopular) return -1;
          if (!a.isPopular && b.isPopular) return 1;
          return (b.searchVolume || 0) - (a.searchVolume || 0);
        });
        break;
      case 'recent':
        result.sort((a, b) => {
          const aIsNew = a.label === 'new';
          const bIsNew = b.label === 'new';
          if (aIsNew && !bIsNew) return -1;
          if (!aIsNew && bIsNew) return 1;
          return 0;
        });
        break;
      default:
        break;
    }

    return result;
  }, [search, categoryFilter, sort, popular]);

  // Get recently added and popular tools for sections
  const recentTools = useMemo(() => {
    return tools.filter((tool) => tool.label === 'new').slice(0, 6);
  }, []);

  const popularTools = useMemo(() => {
    return [...tools]
      .filter((tool) => tool.isPopular)
      .sort((a, b) => (b.searchVolume || 0) - (a.searchVolume || 0))
      .slice(0, 6);
  }, []);

  // Update URL with filters
  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    replace(`/tools?${params.toString()}`);
  };

  const clearAllFilters = () => {
    replace('/tools');
  };

  // Show loading skeleton on first mount
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div className="container mx-auto px-4 py-20">
              <div className="mx-auto max-w-4xl text-center">
                <div className="mx-auto mb-4 h-12 w-96 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="w-128 mx-auto mb-8 h-6 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          </div>

          {/* Content skeleton */}
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-40 rounded-xl bg-gray-200 dark:bg-gray-700"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Header Section */}
      <section className="relative border-b border-gray-200 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500 dark:border-gray-700">
        <div className="container mx-auto px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl text-center">
            {/* Breadcrumbs */}
            <nav className="mb-5 flex justify-center" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm text-white/80">
                <li>
                  <Link
                    href={createHref('/')}
                    className="transition-colors hover:text-white"
                  >
                    {t.breadcrumb.home}
                  </Link>
                </li>
                <li>
                  <ChevronRight className="h-3 w-3" />
                </li>
                <li className="font-medium text-white">
                  {t.breadcrumb.allTools}
                </li>
              </ol>
            </nav>

            {/* Main heading */}
            <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              {t.header.title}
            </h1>

            {/* Subtitle */}
            <p className="mb-3 text-lg text-white/90">{t.header.subtitle}</p>

            {/* Count + Description */}
            <p className="mb-8 text-base text-white/80">
              <span className="font-semibold text-white">{totalTools}+</span>{' '}
              {t.header.description}
            </p>

            {/* Trust badges */}
            <div className="mb-8 flex flex-wrap items-center justify-center gap-4 text-sm text-white/90">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-white" />
                <span>{t.trust.freeForever}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-white" />
                <span>{t.trust.privacyFirst}</span>
              </div>
            </div>

            {/* Search bar */}
            <div className="mx-auto max-w-2xl">
              <SearchBar placeholder={t.search.placeholder} />
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="sticky top-16 z-10 border-b border-gray-200 bg-white/95 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/95">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* Category filter */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => updateFilters('category', '')}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  !categoryFilter || categoryFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {t.filters.all}
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => updateFilters('category', category.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    categoryFilter === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {dictionary?.categories?.[category.id]?.name || category.name}
                </button>
              ))}
            </div>

            {/* Sort and view options */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t.filters.sortBy}
                </span>
                <select
                  value={sort}
                  onChange={(e) =>
                    updateFilters('sort', e.target.value as SortOption)
                  }
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
                >
                  <option value="popular">{t.filters.mostPopular}</option>
                  <option value="alphabetical">{t.filters.alphabetical}</option>
                  <option value="recent">{t.filters.recentlyAdded}</option>
                </select>
              </div>

              {(search || categoryFilter || popular) && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  <X className="h-4 w-4" />
                  {t.filters.clearFilters}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Recently Added Section */}
        {!search && !categoryFilter && !popular && recentTools.length > 0 && (
          <section className="mb-12">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t.sections.recentlyAdded}
                </h2>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  {recentTools.length} {t.sections.newTools}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentTools.map((tool) => (
                <ToolCardWrapper key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        )}

        {/* Most Popular Section */}
        {!search && !categoryFilter && !popular && popularTools.length > 0 && (
          <section className="mb-12">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t.sections.mostPopular}
                </h2>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                  {popularTools.length} {t.sections.trendingTools}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {popularTools.map((tool) => (
                <ToolCardWrapper key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        )}

        {/* All Tools Section */}
        <section>
          <div className="mb-6 flex items-center gap-3">
            <Grid3X3 className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {search || categoryFilter || popular
                ? `${filteredTools.length} ${t.trust.tools}`
                : t.sections.allTools}
            </h2>
          </div>

          {filteredTools.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-20 text-center dark:border-gray-700 dark:bg-gray-800/50">
              <Search className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                {t.empty.title}
              </h3>
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                {t.empty.description}
              </p>
              <button
                onClick={clearAllFilters}
                className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
              >
                {t.empty.clearAll}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTools.map((tool) => (
                <ToolCardWrapper key={tool.id} tool={tool} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* SEO Content Section */}
      <section className="border-t border-gray-200 bg-white py-16 dark:border-gray-700 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            {/* Why Choose Section */}
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                {t.seo.whyChoose.title}
              </h2>
              <ul className="grid gap-4 sm:grid-cols-2">
                {t.seo.whyChoose.benefits.map(
                  (benefit: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {benefit}
                      </span>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Common Workflows */}
            <div>
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                {t.seo.workflows.title}
              </h2>
              <div className="space-y-4">
                {[
                  {
                    title: t.seo.workflows.api.title,
                    tools: t.seo.workflows.api.tools,
                  },
                  {
                    title: t.seo.workflows.data.title,
                    tools: t.seo.workflows.data.tools,
                  },
                  {
                    title: t.seo.workflows.security.title,
                    tools: t.seo.workflows.security.tools,
                  },
                ].map((workflow, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <h3 className="mb-2 font-medium text-gray-900 dark:text-white">
                      {workflow.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {workflow.tools.map((toolName: string) => (
                        <span
                          key={toolName}
                          className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        >
                          {toolName}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Helper function to get category colors
function getCategoryColor(categoryId: string): string {
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
}
