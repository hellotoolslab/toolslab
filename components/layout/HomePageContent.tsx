'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { tools, categories, getPopularTools, searchTools } from '@/lib/tools';
import { ToolCardWrapper } from '@/components/tools/ToolCardWrapper';
import { SimpleHero } from '@/components/layout/SimpleHero';
import { FeaturesSection } from '@/components/layout/FeaturesSection';

export default function HomePageContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get('search');

  const popularTools = getPopularTools().slice(0, 6);
  const sortedTools = [...tools].sort(
    (a, b) => b.searchVolume - a.searchVolume
  );

  const searchResults = searchQuery ? searchTools(searchQuery) : [];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <SimpleHero />

      {/* Search Results */}
      {searchQuery && (
        <section className="container-main py-16">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Search Results for &ldquo;{searchQuery}&rdquo;
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              {searchResults.length === 0
                ? 'No tools found. Try different keywords.'
                : `Found ${searchResults.length} tool${searchResults.length === 1 ? '' : 's'}`}
            </p>
          </div>

          {searchResults.length > 0 && (
            <div className="tools-grid">
              {searchResults.map((tool) => (
                <ToolCardWrapper key={tool.id} tool={tool} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Quick Access Tools */}
      {!searchQuery && (
        <section className="container-main py-16">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Quick Access</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Jump straight into the most popular tools. No setup required.
            </p>
          </div>

          <div className="tools-grid">
            {popularTools.map((tool) => (
              <ToolCardWrapper key={tool.id} tool={tool} showStats />
            ))}
          </div>
        </section>
      )}

      {/* Categories Section */}
      {!searchQuery && (
        <section className="bg-gray-50 py-20 dark:bg-gray-900/50">
          <div className="container-main">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold">Browse by Category</h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
                Explore our collection of tools organized by functionality. Each
                category offers specialized utilities for different development
                needs.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => {
                const categoryColor =
                  {
                    data: '#0EA5E9',
                    encoding: '#10B981',
                    text: '#8B5CF6',
                    generators: '#F97316',
                    web: '#EC4899',
                    dev: '#F59E0B',
                  }[category.id] || '#3B82F6';

                return (
                  <Link key={category.id} href={`/category/${category.id}`}>
                    <div className="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
                      {/* Color accent */}
                      <div
                        className="absolute left-0 right-0 top-0 h-1"
                        style={{ backgroundColor: categoryColor }}
                      />

                      {/* Header */}
                      <div className="mb-6 flex items-center space-x-4">
                        <div
                          className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 text-2xl transition-all duration-300 group-hover:scale-110"
                          style={{
                            backgroundColor: `${categoryColor}20`,
                            borderColor: `${categoryColor}40`,
                            color: categoryColor,
                          }}
                        >
                          {category.icon}
                        </div>
                        <div>
                          <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-gray-100">
                            {category.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span
                              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                              style={{
                                backgroundColor: `${categoryColor}20`,
                                color: categoryColor,
                              }}
                            >
                              {category.tools.length} tool
                              {category.tools.length === 1 ? '' : 's'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="mb-6 leading-relaxed text-gray-600 dark:text-gray-400">
                        {category.description}
                      </p>

                      {/* Preview Tools */}
                      <div className="space-y-3">
                        <div className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Featured Tools:
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {category.tools.slice(0, 4).map((tool) => (
                            <div
                              key={tool.id}
                              className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3 transition-colors dark:bg-gray-800/50"
                            >
                              <span className="flex-shrink-0 text-lg">
                                {tool.icon}
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {tool.name}
                                </div>
                                {tool.isPopular && (
                                  <div className="text-xs text-amber-600 dark:text-amber-400">
                                    Popular
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {category.tools.length > 4 && (
                          <div className="pt-3 text-center">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              +{category.tools.length - 4} more tools
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Hover overlay */}
                      <div
                        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-5"
                        style={{ backgroundColor: categoryColor }}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      {!searchQuery && <FeaturesSection />}

      {/* All Tools Section */}
      {!searchQuery && (
        <section className="container-main py-20">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">All Tools</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Complete collection of developer utilities, sorted by popularity.
            </p>
          </div>

          <div className="tools-grid">
            {sortedTools.map((tool) => (
              <ToolCardWrapper key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* Footer CTA */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 py-16">
        <div className="container-main text-center text-white">
          <h2 className="mb-4 text-3xl font-bold">
            Ready to boost your productivity?
          </h2>
          <p className="mb-8 text-xl opacity-90">
            Join thousands of developers who trust ToolsLab for their daily
            tasks.
          </p>
          <div className="mx-auto flex max-w-lg flex-col justify-center gap-4 sm:flex-row">
            <div className="flex items-center gap-2 text-lg">
              <span className="text-2xl">⚡</span>
              <span>Instant</span>
            </div>
            <div className="flex items-center gap-2 text-lg">
              <span className="text-2xl">🔒</span>
              <span>Private</span>
            </div>
            <div className="flex items-center gap-2 text-lg">
              <span className="text-2xl">💝</span>
              <span>Free Forever</span>
            </div>
          </div>
        </div>
      </section>

      {/* Toast Demo - Commentato per produzione */}
      {/* <ToastDemo /> */}
    </main>
  );
}
