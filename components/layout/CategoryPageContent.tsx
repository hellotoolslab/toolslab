'use client';

import Link from 'next/link';
import {
  categories,
  getToolsByCategory,
  getCategoryColorClass,
} from '@/lib/tools';
import { ToolCardWrapper } from '@/components/tools/ToolCardWrapper';
import { SearchBar } from '@/components/SearchBar';
import { FavoriteButton } from '@/components/lab/FavoriteButton';
import {
  useToolLabel,
  DEFAULT_TOOL_LABELS,
} from '@/lib/services/toolLabelService';

interface CategoryPageContentProps {
  categoryId: string;
}

export default function CategoryPageContent({
  categoryId,
}: CategoryPageContentProps) {
  const category = categories.find((cat) => cat.id === categoryId);

  if (!category) {
    return <div>Category not found</div>;
  }

  const tools = getToolsByCategory(category.id);

  // Helper function to get tool label
  const getToolLabelForTool = (toolId: string) => {
    return DEFAULT_TOOL_LABELS[toolId];
  };

  // Filter tools by their labels
  const newTools = tools.filter(
    (tool) => getToolLabelForTool(tool.id) === 'new'
  );
  const popularTools = tools.filter(
    (tool) => getToolLabelForTool(tool.id) === 'popular'
  );
  const otherTools = tools.filter((tool) => {
    const label = getToolLabelForTool(tool.id);
    return !label || label === 'coming-soon';
  });

  const categoryColorClass = getCategoryColorClass(category.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="container mx-auto max-w-7xl px-6">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Link
              href="/"
              className="hover:text-gray-900 dark:hover:text-gray-100"
            >
              Home
            </Link>
            <span>/</span>
            <span>Categories</span>
            <span>/</span>
            <span className="text-gray-900 dark:text-gray-100">
              {category.name}
            </span>
          </nav>

          {/* Header */}
          <div className="text-center">
            <div
              className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl text-4xl ${categoryColorClass}`}
            >
              {category.icon}
            </div>
            <h1 className="mb-4 text-4xl font-bold lg:text-5xl">
              {category.name}
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              {category.description}
            </p>
            <div className="mb-8 flex items-center justify-center gap-4 text-sm">
              <span className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
                {tools.length} tool{tools.length === 1 ? '' : 's'} available
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                All free to use
              </span>
            </div>

            {/* Search Bar */}
            <div className="mx-auto max-w-md">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="container mx-auto max-w-7xl px-6 pb-20">
        {/* New Tools */}
        {newTools.length > 0 && (
          <section className="mb-16">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold">New Tools</h2>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  ✨ Recently Added
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {newTools.map((tool) => (
                <ToolCardWrapper key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        )}

        {/* Popular Tools */}
        {popularTools.length > 0 && (
          <section className="mb-16">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Popular Tools</h2>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                  🔥 Most Used
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {popularTools.map((tool) => (
                <ToolCardWrapper key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        )}

        {/* Other Tools */}
        {otherTools.length > 0 && (
          <section className="mb-16">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Other Tools</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {otherTools.map((tool) => (
                <ToolCardWrapper key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        )}

        {/* All Tools Section (fallback if no categorization) */}
        {popularTools.length === 0 && newTools.length === 0 && (
          <section>
            <div className="mb-8">
              <h2 className="text-2xl font-bold">All Tools</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Complete collection of {category.name.toLowerCase()} tools.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {tools.map((tool) => (
                <ToolCardWrapper key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        )}
      </section>
    </div>
  );
}
