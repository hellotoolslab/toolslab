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
import { useToolLabel } from '@/lib/services/toolLabelService';
import { getToolById } from '@/lib/tools';
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

  // Detect if Italian
  const isItalian = locale === 'it';

  // Translations with fallbacks
  const t = dictionary?.toolsPage || {
    breadcrumb: {
      home: isItalian ? 'Home' : 'Home',
      allTools: isItalian ? 'Tutti gli Strumenti' : 'All Tools',
    },
    header: {
      title: isItalian
        ? 'Tutti gli Strumenti per Sviluppatori - Tools Online Gratuiti'
        : 'All Developer Tools - Free Online Utilities',
      subtitle: isItalian
        ? 'Collezione completa di strumenti professionali per sviluppatori, data analyst e amministratori di sistema'
        : 'Complete collection of professional tools for developers, data analysts, and system administrators',
      description: isItalian
        ? 'strumenti gratuiti basati su browser per formattazione JSON, codifica Base64, generazione hash e altro. Nessuna trasmissione dati, nessuna registrazione richiesta.'
        : 'free browser-based tools for JSON formatting, Base64 encoding, hash generation, and more. Zero data transmission, no registration required.',
    },
    trust: {
      tools: isItalian ? 'strumenti' : 'tools',
      freeForever: isItalian ? 'Gratis per sempre' : 'Free forever',
      privacyFirst: isItalian ? 'Privacy prima di tutto' : 'Privacy-first',
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
        title: isItalian
          ? 'Perché Scegliere gli Strumenti ToolsLab?'
          : 'Why Choose ToolsLab Tools?',
        benefits: isItalian
          ? [
              "Privacy completa - tutta l'elaborazione avviene nel tuo browser",
              'Nessuna registrazione o account richiesto',
              'Strumenti di livello professionale usati da sviluppatori in tutto il mondo',
              'Elaborazione in tempo reale con risultati istantanei',
              'Design responsivo ottimizzato per mobile',
              'Aggiornamenti regolari con nuovi strumenti e funzionalità',
            ]
          : [
              'Complete privacy - all processing happens in your browser',
              'No registration or account required',
              'Professional-grade tools used by developers worldwide',
              'Real-time processing with instant results',
              'Mobile-friendly responsive design',
              'Regular updates with new tools and features',
            ],
      },
      workflows: {
        title: isItalian
          ? 'Flussi di Lavoro Comuni per Sviluppatori'
          : 'Common Developer Workflows',
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

  // URL-based state management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Initialize from URL params
  useEffect(() => {
    if (searchParams) {
      setSearchQuery(searchParams.get('search') || '');
      setSelectedCategory(searchParams.get('category') || 'all');
      setSortBy((searchParams.get('sort') as SortOption) || 'popular');
    }
  }, [searchParams]);

  // Statistics
  const totalTools = tools.filter(
    (tool) => tool.label !== 'coming-soon' && tool.label !== 'new'
  ).length;
  const newToolsCount = tools.filter((tool) => tool.label === 'new').length;
  const popularToolsCount = tools.filter(
    (tool) => tool.label === 'popular'
  ).length;

  // Get tools with labels
  const toolsWithLabels: Tool[] = useMemo(() => {
    return tools.filter((tool) => tool.label !== 'coming-soon');
  }, []);

  // Filter and sort tools
  const filteredAndSortedTools = useMemo(() => {
    let filtered = toolsWithLabels;

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((tool) =>
        tool.categories.includes(selectedCategory)
      );
    } else {
      // For "all" category, exclude "new" tools - they should only appear in specific categories
      filtered = filtered.filter((tool) => tool.label !== 'new');
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (tool) =>
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.keywords.some((keyword) =>
            keyword.toLowerCase().includes(query)
          ) ||
          tool.categories.some((cat) => {
            const category = categories.find((c) => c.id === cat);
            return category?.name.toLowerCase().includes(query);
          })
      );
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'alphabetical':
          return a.name.localeCompare(b.name);
        case 'popular':
          if (a.label === 'popular' && b.label !== 'popular') return -1;
          if (b.label === 'popular' && a.label !== 'popular') return 1;
          if (a.label === 'new' && b.label !== 'new') return -1;
          if (b.label === 'new' && a.label !== 'new') return 1;
          return a.name.localeCompare(b.name);
        case 'recent':
          if (a.label === 'new' && b.label !== 'new') return -1;
          if (b.label === 'new' && a.label !== 'new') return 1;
          if (a.label === 'popular' && b.label !== 'popular') return -1;
          if (b.label === 'popular' && a.label !== 'popular') return 1;
          return a.name.localeCompare(b.name);
        case 'category':
          const aCat = a.categories[0] || '';
          const bCat = b.categories[0] || '';
          if (aCat !== bCat) return aCat.localeCompare(bCat);
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [toolsWithLabels, selectedCategory, searchQuery, sortBy]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (sortBy !== 'popular') params.set('sort', sortBy);

    const newUrl = `/tools${params.toString() ? `?${params.toString()}` : ''}`;
    replace(newUrl);
  }, [searchQuery, selectedCategory, sortBy, replace]);

  // Get category stats
  const categoryStats = categories.map((category) => ({
    ...category,
    count: toolsWithLabels.filter((tool) =>
      tool.categories.includes(category.id)
    ).length,
  }));

  // Recently added and popular tools - Apply sorting
  const recentTools = useMemo(() => {
    let tools = toolsWithLabels.filter((tool) => tool.label === 'new');

    // Apply the same sorting as main tools
    if (sortBy === 'alphabetical') {
      tools = [...tools].sort((a, b) => a.name.localeCompare(b.name));
      // Show all tools when sorting alphabetically
      return tools;
    }

    // Only show 8 for other sort options
    return tools.slice(0, 8);
  }, [toolsWithLabels, sortBy]);

  const popularTools = useMemo(() => {
    let tools = toolsWithLabels.filter((tool) => tool.label === 'popular');

    // Apply the same sorting as main tools
    if (sortBy === 'alphabetical') {
      tools = [...tools].sort((a, b) => a.name.localeCompare(b.name));
      // Show all tools when sorting alphabetically
      return tools;
    }

    // Only show 8 for other sort options
    return tools.slice(0, 8);
  }, [toolsWithLabels, sortBy]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('popular');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* SEO-Optimized Header */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500 py-8 sm:py-12">
        {/* Pattern overlay for visual texture */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='https://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M0 20h40M20 0v40' stroke='%23ffffff' stroke-width='0.5' stroke-opacity='0.3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center gap-1 text-sm text-white/80">
            <Link
              href={createHref('/')}
              className="transition-colors hover:text-white"
            >
              {t.breadcrumb.home}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-white">
              {t.breadcrumb.allTools}
            </span>
          </nav>

          {/* Hero Content - Compressed */}
          <div className="mb-6 text-center">
            <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              {t.header.title}
            </h1>
            <p className="mb-4 text-lg text-white/90 sm:text-xl">
              {t.header.subtitle}
            </p>
            {/* Compressed description - 2 lines max */}
            <p className="mx-auto max-w-3xl text-sm text-white/80">
              {totalTools}+ {t.header.description}
            </p>
          </div>

          {/* Trust Signals - Compressed */}
          <div className="mb-4 flex flex-wrap items-center justify-center gap-3 text-xs text-white/90 sm:gap-4 sm:text-sm">
            <div className="flex items-center gap-1.5">
              <Grid3X3 className="h-3.5 w-3.5 text-white" />
              <span className="font-medium">
                {totalTools}+ {t.trust.tools}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-white" />
              <span>{t.trust.freeForever}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-white" />
              <span>{t.trust.privacyFirst}</span>
            </div>
            {newToolsCount > 0 && (
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-white" />
                <span>{t.trust.newToolsWeekly}</span>
              </div>
            )}
          </div>

          {/* PRIMARY SEARCH BAR - Moved to top priority position */}
          <div className="mb-4 px-2 sm:px-0">
            <div className="relative mx-auto max-w-2xl">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={t.search.placeholder}
                className="w-full rounded-xl border-2 border-gray-200 bg-white py-4 pl-12 pr-6 text-base text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filters */}
          <div className="mb-4 px-2 sm:px-0">
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => handleCategorySelect('all')}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {t.filters.all} ({totalTools})
              </button>
              {categoryStats.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                  style={
                    selectedCategory === category.id
                      ? { backgroundColor: getCategoryColor(category.id) }
                      : undefined
                  }
                >
                  {category.icon} {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="mb-4 flex flex-col items-center justify-center gap-4 px-2 sm:flex-row sm:px-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t.filters.sortBy}
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="popular">{t.filters.mostPopular}</option>
                <option value="alphabetical">{t.filters.alphabetical}</option>
                <option value="recent">{t.filters.recentlyAdded}</option>
                <option value="category">{t.filters.category}</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(searchQuery ||
              selectedCategory !== 'all' ||
              sortBy !== 'popular') && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                {t.filters.clearFilters}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Recently Added Tools */}
      {recentTools.length > 0 && (
        <section className="py-4">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-bold sm:text-2xl">
                <Sparkles className="h-6 w-6 text-green-500" />
                {t.sections.recentlyAdded}
              </h2>
              <span className="text-sm text-gray-500">
                {recentTools.length} {t.sections.newTools}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {recentTools.map((tool) => (
                <ToolCardWrapper key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Most Popular Tools */}
      {popularTools.length > 0 && (
        <section className="py-4">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-bold sm:text-2xl">
                <TrendingUp className="h-6 w-6 text-yellow-500" />
                {t.sections.mostPopular}
              </h2>
              <span className="text-sm text-gray-500">
                {popularTools.length} {t.sections.trendingTools}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {popularTools.map((tool) => (
                <ToolCardWrapper key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Tools Section */}
      <section className="py-4">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="mb-4 text-xl font-bold sm:text-2xl">
            {t.sections.allTools} ({filteredAndSortedTools.length})
          </h2>

          {/* Tools Grid */}
          {filteredAndSortedTools.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredAndSortedTools.map((tool) => (
                <ToolCardWrapper key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Search className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                {t.empty.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t.empty.description}
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                {t.empty.clearAll}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="bg-gray-50 py-12 dark:bg-gray-900/50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Why Choose ToolsLab */}
            <div>
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                {t.seo.whyChoose.title}
              </h2>
              <ul className="space-y-3">
                {t.seo.whyChoose.benefits.map(
                  (benefit: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                      <span className="text-gray-600 dark:text-gray-400">
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
  };
  return colors[categoryId] || '#3B82F6';
}
