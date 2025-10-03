'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, X } from 'lucide-react';
import { categories, getCategoryColorClass } from '@/lib/tools';
import { useLocale } from '@/hooks/useLocale';
import { type Dictionary } from '@/lib/i18n/get-dictionary';
import { type Locale } from '@/lib/i18n/config';

interface CategoriesHubContentSimpleProps {
  locale?: Locale;
  dictionary?: Dictionary;
}

export default function CategoriesHubContentSimple({
  locale: serverLocale,
  dictionary: serverDictionary,
}: CategoriesHubContentSimpleProps) {
  const { locale: clientLocale, createHref } = useLocale();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Use server props if available, otherwise client-side detection
  const locale = serverLocale || clientLocale;
  const dictionary = serverDictionary;

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalTools = categories.reduce(
    (sum, category) => sum + category.tools.length,
    0
  );

  const filteredCategories = categories.filter(
    (category) =>
      searchQuery === '' ||
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.tools.some(
        (tool) =>
          tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.keywords.some((keyword) =>
            keyword.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
  );

  const clearSearch = () => {
    setSearchQuery('');
  };

  // Show loading state during hydration
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="animate-pulse">
          <div className="bg-gray-50 py-20 dark:bg-gray-900">
            <div className="mx-auto max-w-4xl px-4 text-center">
              <div className="mx-auto mb-4 h-12 w-96 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="w-128 mx-auto mb-8 h-6 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
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

  // Localized text
  const text = {
    title: locale === 'it' ? 'Categorie Strumenti' : 'Tool Categories',
    subtitle:
      locale === 'it'
        ? `${totalTools}+ strumenti professionali per sviluppatori organizzati in ${categories.length} categorie specializzate.`
        : `${totalTools}+ professional developer tools organized into ${categories.length} specialized categories.`,
    searchPlaceholder:
      locale === 'it' ? 'Cerca categorie...' : 'Search categories...',
    clearSearch: locale === 'it' ? 'Cancella' : 'Clear',
    toolsText: locale === 'it' ? 'strumenti' : 'tools',
    exploreText: locale === 'it' ? 'Esplora' : 'Explore',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-50 dark:bg-gray-900">
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Breadcrumbs */}
            <nav className="mb-5 flex justify-center" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                <li>
                  <Link
                    href={createHref('/')}
                    className="transition-colors hover:text-gray-900 dark:hover:text-white"
                  >
                    {locale === 'it' ? 'Home' : 'Home'}
                  </Link>
                </li>
                <li>
                  <ArrowRight className="h-3 w-3" />
                </li>
                <li className="font-medium text-gray-900 dark:text-white">
                  {text.title}
                </li>
              </ol>
            </nav>

            {/* Hero Icon */}
            <div className="mb-5 flex justify-center">
              <div className="text-5xl lg:text-6xl">🛠️</div>
            </div>

            {/* Main Heading */}
            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">
              {text.title}
            </h1>

            {/* Simplified Header Description */}
            <div className="mx-auto mb-5 max-w-3xl">
              <p className="text-lg text-gray-700 dark:text-gray-300 lg:text-xl">
                {text.subtitle}
              </p>
            </div>

            {/* Search Bar */}
            <div className="mx-auto mb-5 max-w-2xl">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Search className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={text.searchPlaceholder}
                  className="w-full rounded-full border border-gray-300 bg-white/90 py-3 pl-12 pr-12 text-gray-900 placeholder-gray-500 backdrop-blur-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800/90 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-400"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
              {searchQuery && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {locale === 'it'
                    ? `Trovate ${filteredCategories.length} categorie corrispondenti a "${searchQuery}"`
                    : `Found ${filteredCategories.length} categories matching "${searchQuery}"`}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.map((category, index) => (
              <Link
                key={category.id}
                href={createHref(`/category/${category.id}`)}
                className="group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className={`rounded-xl p-3 text-white ${getCategoryColorClass(category.id)}`}
                    >
                      <span className="text-2xl">{category.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {dictionary?.categories?.[category.id]?.name ||
                          category.name}
                      </h3>
                    </div>
                  </div>

                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    {dictionary?.categories?.[category.id]?.description ||
                      category.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                      {category.tools.length} {text.toolsText}
                    </span>
                    <ArrowRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1" />
                  </div>

                  {/* Tool preview */}
                  <div className="mt-4 flex flex-wrap gap-1">
                    {category.tools.slice(0, 3).map((tool) => (
                      <span
                        key={tool.id}
                        className="rounded-md bg-gray-50 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700/50 dark:text-gray-400"
                      >
                        {tool.name}
                      </span>
                    ))}
                    {category.tools.length > 3 && (
                      <span className="rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-500 dark:bg-gray-700/50 dark:text-gray-400">
                        +{category.tools.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-bold text-white">
            {locale === 'it' ? 'Pronti per iniziare?' : 'Ready to get started?'}
          </h2>
          <p className="mb-8 text-xl text-white/90">
            {locale === 'it'
              ? `Esplora tutti i ${totalTools}+ strumenti o immergiti in categorie specifiche.`
              : `Explore all ${totalTools}+ tools or dive into specific categories.`}
          </p>
          <Link
            href={createHref('/tools')}
            className="inline-flex items-center rounded-full bg-white px-8 py-4 font-semibold text-blue-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            {locale === 'it'
              ? 'Sfoglia Tutti gli Strumenti'
              : 'Browse All Tools'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
