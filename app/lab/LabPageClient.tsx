'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  ExternalLink,
  Trash2,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { useToolStore } from '@/lib/store/toolStore';
import { EmptyState } from '@/components/lab/EmptyState';
import { WelcomePopup, HelpButton } from '@/components/lab/WelcomePopup';
import { FavoriteButton } from '@/components/lab/FavoriteButton';
import { cn } from '@/lib/utils';
import { categories as CATEGORIES, tools as TOOLS_CONFIG } from '@/lib/tools';
import { labToasts } from '@/lib/utils/toasts';

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function CategorySection({ categoryId }: { categoryId: string }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { favoriteTools, toggleToolFavorite } = useToolStore();

  const category = CATEGORIES.find((cat) => cat.id === categoryId);
  if (!category) return null;

  // If this category is favorited, show all tools from this category
  const categoryTools = category.tools.map((tool) => tool.id);

  if (categoryTools.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center gap-3 px-6 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        {isExpanded ? (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-500" />
        )}
        <div className="h-3 w-3 rounded-full bg-gradient-to-r from-violet-400 to-purple-600" />
        <h3 className="flex-1 text-left font-semibold">{category.name}</h3>
        <span className="rounded-full bg-gray-100 px-2 py-1 text-sm text-gray-500 dark:bg-gray-800">
          {categoryTools.length} {categoryTools.length === 1 ? 'tool' : 'tools'}
        </span>
        <FavoriteButton type="category" id={categoryId} name={category.name} />
      </button>

      {isExpanded && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          exit={{ height: 0 }}
          className="border-t border-gray-200 dark:border-gray-800"
        >
          <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
            {categoryTools.map((toolSlug) => {
              const tool = TOOLS_CONFIG.find((t) => t.id === toolSlug);
              if (!tool) return null;

              return (
                <LabToolCard key={toolSlug} tool={tool} showRemove={false} />
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function LabToolCard({
  tool,
  showRemove = false,
  lastUsed,
}: {
  tool: any;
  showRemove?: boolean;
  lastUsed?: number;
}) {
  const { toggleToolFavorite } = useToolStore();

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleToolFavorite(tool.id || tool.slug);
  };

  return (
    <div className="group relative rounded-lg bg-gray-50 p-4 transition-all hover:shadow-md dark:bg-gray-800">
      <Link href={tool.route || `/tools/${tool.id}`} className="block">
        <div className="mb-3 flex items-start gap-3">
          <div className="text-2xl">{tool.icon}</div>
          <div className="min-w-0 flex-1">
            <h4 className="truncate font-medium transition-colors group-hover:text-violet-600 dark:group-hover:text-violet-400">
              {tool.name}
            </h4>
            <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
              {tool.description}
            </p>
          </div>
        </div>

        {lastUsed && (
          <div className="mb-3 flex items-center gap-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            Last used: {formatTimeAgo(lastUsed)}
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2">
            <ExternalLink className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Open Tool
            </span>
          </div>

          {showRemove && (
            <button
              onClick={handleRemove}
              className="rounded p-1.5 text-gray-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-950/30"
              title="Remove from Lab"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </Link>

      {/* In Lab badge */}
      <div className="absolute right-2 top-2 rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
        In Lab
      </div>
    </div>
  );
}

export function LabPageClient() {
  const {
    favoriteTools,
    favoriteCategories,
    labVisited,
    getFavoriteCount,
    getRecentTools,
    setLabVisited,
  } = useToolStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Mark Lab as visited to reset navbar counter
    setLabVisited();

    // Show welcome toast if user has favorites and hasn't been welcomed
    const { favoriteTools, favoriteCategories, labVisited } =
      useToolStore.getState();
    if (
      !labVisited &&
      (favoriteTools.length > 0 || favoriteCategories.length > 0)
    ) {
      setTimeout(() => {
        labToasts.welcomeToLab();
      }, 1000);
    }
  }, [setLabVisited]);

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="mb-4 h-8 w-48 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="mb-8 h-4 w-96 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-lg bg-gray-200 dark:bg-gray-800"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const favoriteCount = getFavoriteCount();
  const recentTools = getRecentTools();
  const isEmpty = favoriteCount === 0;

  // Debug logging
  console.log('Debug Lab - Main data:', {
    favoriteTools,
    favoriteCategories,
    favoriteCount,
    isEmpty,
  });

  // Get unique category IDs that have favorite tools
  const categoriesWithFavorites = Array.from(
    new Set(
      favoriteTools
        .map(
          (toolSlug) =>
            TOOLS_CONFIG.find((t) => t.id === toolSlug)?.categoryColor
        )
        .filter(Boolean)
    )
  );

  // Get all favorite tools (standalone and from favorite categories)
  const allFavoriteTools = favoriteTools.filter((toolSlug) => {
    const tool = TOOLS_CONFIG.find((t) => t.id === toolSlug);
    return tool; // Show all favorite tools
  });

  // Get tools that don't belong to favorite categories (for separate section)
  const standaloneFavoriteTools = favoriteTools.filter((toolSlug) => {
    const tool = TOOLS_CONFIG.find((t) => t.id === toolSlug);
    return tool && !favoriteCategories.includes(tool.categoryColor);
  });

  // Get categories that have been explicitly favorited AND have tools
  const validFavoriteCategories = favoriteCategories.filter((categoryId) => {
    const category = CATEGORIES.find((cat) => cat.id === categoryId);
    const isValid = category && category.tools.length > 0;

    // Debug logging
    console.log('Debug Lab - Category check:', {
      categoryId,
      category: category?.name,
      toolsCount: category?.tools?.length,
      isValid,
    });

    return isValid;
  });

  if (isEmpty) {
    return (
      <div className="min-h-screen">
        <WelcomePopup />

        {/* Lab Banner Header */}
        <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center gap-4">
              <span className="animate-pulse text-6xl">🧪</span>
              <div className="text-center">
                <h1 className="mb-2 text-3xl font-bold">Welcome to Your Lab</h1>
                <p className="text-violet-100">
                  Your personalized workspace for favorite tools and experiments
                </p>
              </div>
              <span
                className="animate-pulse text-6xl"
                style={{ animationDelay: '0.5s' }}
              >
                ⚗️
              </span>
            </div>
          </div>
        </div>

        <EmptyState />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <WelcomePopup />
      <HelpButton />

      {/* Lab Banner Header */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center gap-4">
            <span className="animate-pulse text-6xl">🧪</span>
            <div className="text-center">
              <h1 className="mb-2 text-3xl font-bold">Welcome to Your Lab</h1>
              <p className="text-violet-100">
                Your personalized workspace for favorite tools and experiments
              </p>
            </div>
            <span
              className="animate-pulse text-6xl"
              style={{ animationDelay: '0.5s' }}
            >
              ⚗️
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center gap-6 rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-lg dark:border-gray-800 dark:bg-gray-900">
            <div className="text-center">
              <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                {favoriteCount}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Favorites
              </div>
            </div>
            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {recentTools.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Recent Tools
              </div>
            </div>
          </div>
        </motion.div>

        <div className="space-y-8">
          {/* Favorite Categories */}
          {validFavoriteCategories.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
                <span>📁</span>
                Favorite Categories
              </h2>
              <div className="space-y-4">
                {validFavoriteCategories.map((categoryId) => (
                  <CategorySection key={categoryId} categoryId={categoryId} />
                ))}
              </div>
            </motion.section>
          )}

          {/* Standalone Favorite Tools */}
          {standaloneFavoriteTools.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
                <span>⭐</span>
                Favorite Tools
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {standaloneFavoriteTools.map((toolSlug) => {
                  const tool = TOOLS_CONFIG.find((t) => t.id === toolSlug);
                  if (!tool) return null;

                  return (
                    <LabToolCard key={toolSlug} tool={tool} showRemove={true} />
                  );
                })}
              </div>
            </motion.section>
          )}

          {/* Recent Activity */}
          {recentTools.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
                <span>🕒</span>
                Recent Activity
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recentTools.map((operation) => {
                  const tool = TOOLS_CONFIG.find(
                    (t) => t.id === operation.tool
                  );
                  if (!tool) return null;

                  return (
                    <LabToolCard
                      key={operation.id}
                      tool={tool}
                      lastUsed={operation.timestamp}
                    />
                  );
                })}
              </div>
            </motion.section>
          )}
        </div>
      </div>
    </div>
  );
}
