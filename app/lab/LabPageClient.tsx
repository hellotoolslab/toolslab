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
import { useUmami } from '@/components/analytics/UmamiProvider';
import { useToolLabel } from '@/lib/services/toolLabelService';
import { useToolLabels } from '@/lib/hooks/useToolLabels';

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
  const toolLabel = useToolLabel(tool.id);
  const { getToolLabelInfo, getLabelComponent } = useToolLabels();
  const labelInfo = getToolLabelInfo(toolLabel);

  const isComingSoon = toolLabel === 'coming-soon';

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleToolFavorite(tool.id || tool.slug);
  };

  const CardContent = ({ children }: { children: React.ReactNode }) => {
    if (isComingSoon) {
      return (
        <div
          className={cn(
            'group relative cursor-not-allowed rounded-lg p-4 opacity-75 transition-all',
            'bg-gray-50 dark:bg-gray-800'
          )}
        >
          {children}
        </div>
      );
    }

    return (
      <div className="group relative rounded-lg bg-gray-50 p-4 transition-all hover:shadow-md dark:bg-gray-800">
        <Link href={tool.route || `/tools/${tool.id}`} className="block">
          {children}
        </Link>
      </div>
    );
  };

  return (
    <CardContent>
      <div className="mb-3 flex items-start gap-3">
        <div className="text-2xl">{tool.icon}</div>
        <div className="min-w-0 flex-1">
          <h4
            className={cn(
              'truncate font-medium transition-colors',
              isComingSoon
                ? 'text-gray-500 dark:text-gray-500'
                : 'group-hover:text-violet-600 dark:group-hover:text-violet-400'
            )}
          >
            {tool.name}
          </h4>
          <p
            className={cn(
              'line-clamp-2 text-sm',
              isComingSoon
                ? 'text-gray-500 dark:text-gray-500'
                : 'text-gray-600 dark:text-gray-400'
            )}
          >
            {isComingSoon
              ? 'This tool is coming soon. Stay tuned for updates!'
              : tool.description}
          </p>
        </div>
      </div>

      {lastUsed && !isComingSoon && (
        <div className="mb-3 flex items-center gap-1 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          Last used: {formatTimeAgo(lastUsed)}
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2">
          <ExternalLink
            className={cn(
              'h-4 w-4',
              isComingSoon ? 'text-gray-400' : 'text-gray-400'
            )}
          />
          <span
            className={cn(
              'text-sm',
              isComingSoon
                ? 'text-gray-500 dark:text-gray-500'
                : 'text-gray-600 dark:text-gray-400'
            )}
          >
            {isComingSoon ? 'Coming Soon' : 'Open Tool'}
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

      {/* Label - Show Coming Soon label or In Lab badge */}
      {isComingSoon ? (
        <div className="absolute right-2 top-2">
          {getLabelComponent(toolLabel, 'xs')}
        </div>
      ) : (
        <div className="absolute right-2 top-2 rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
          In Lab
        </div>
      )}
    </CardContent>
  );
}

export function LabPageClient() {
  const { trackEngagement } = useUmami();
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

    // Track Lab visit
    const { favoriteTools, favoriteCategories } = useToolStore.getState();
    const favoriteCount = favoriteTools.length + favoriteCategories.length;

    if (favoriteCount === 0) {
      trackEngagement('lab-empty-state-visited');
    } else {
      trackEngagement('lab-visited', {
        favorites_count: favoriteCount,
        tools_count: favoriteTools.length,
        categories_count: favoriteCategories.length,
      });
    }

    // Show welcome toast if user has favorites and hasn't been welcomed
    const { labVisited } = useToolStore.getState();
    if (
      !labVisited &&
      (favoriteTools.length > 0 || favoriteCategories.length > 0)
    ) {
      setTimeout(() => {
        labToasts.welcomeToLab();
        trackEngagement('lab-welcome-toast-shown');
      }, 1000);
    }
  }, [setLabVisited, trackEngagement]);

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
            TOOLS_CONFIG.find((t) => t.id === toolSlug)?.categories[0]
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
    return tool && !favoriteCategories.includes(tool.categories[0]);
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
