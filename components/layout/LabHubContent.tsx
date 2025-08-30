'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  ExternalLink,
  Trash2,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Star,
  Search,
  Download,
  Filter,
  Grid3X3,
  Heart,
  Shield,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useToolStore } from '@/lib/store/toolStore';
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

  const categoryTools = category.tools.map((tool) => tool.id);

  if (categoryTools.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center gap-3 px-6 py-5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        {isExpanded ? (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-500" />
        )}
        <div className="h-3 w-3 rounded-full bg-gradient-to-r from-purple-400 to-violet-600" />
        <h3 className="flex-1 text-left text-lg font-semibold text-gray-900 dark:text-white">
          {category.name}
        </h3>
        <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
          {categoryTools.length} {categoryTools.length === 1 ? 'tool' : 'tools'}
        </span>
        <FavoriteButton type="category" id={categoryId} name={category.name} />
      </button>

      {isExpanded && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          exit={{ height: 0 }}
          className="border-t border-gray-200 dark:border-gray-700"
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
            'group relative cursor-not-allowed rounded-xl p-5 opacity-75 transition-all',
            'border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
          )}
        >
          {children}
        </div>
      );
    }

    return (
      <div className="group relative rounded-xl border border-gray-200 bg-white p-5 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <Link href={tool.route || `/tools/${tool.id}`} className="block">
          {children}
        </Link>
      </div>
    );
  };

  return (
    <CardContent>
      <div className="mb-4 flex items-start gap-3">
        <div className="text-2xl">{tool.icon}</div>
        <div className="min-w-0 flex-1">
          <h4
            className={cn(
              'truncate font-semibold transition-colors',
              isComingSoon
                ? 'text-gray-500 dark:text-gray-500'
                : 'group-hover:text-purple-600 dark:group-hover:text-purple-400'
            )}
          >
            {tool.name}
          </h4>
          <p
            className={cn(
              'line-clamp-2 text-sm leading-relaxed',
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
        <div className="mb-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
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
              'text-sm font-medium',
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
            className="rounded-lg p-2 text-gray-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-950/30"
            title="Remove from Lab"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Label - Show Coming Soon label or In Lab badge */}
      {isComingSoon ? (
        <div className="absolute right-3 top-3">
          {getLabelComponent(toolLabel, 'xs')}
        </div>
      ) : (
        <div className="absolute right-3 top-3 rounded-full bg-gradient-to-r from-purple-500 to-violet-600 px-2 py-1 text-xs font-medium text-white shadow-lg">
          In Lab
        </div>
      )}
    </CardContent>
  );
}

function EnhancedEmptyState() {
  return (
    <>
      {/* Detailed Introduction Section */}
      <section className="bg-white py-16 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              Your Personal Lab is a curated workspace where you can star your
              most-used{' '}
              <Link
                href="/tools/json-formatter"
                className="font-semibold text-purple-600 underline decoration-2 underline-offset-2 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
              >
                developer tools
              </Link>{' '}
              for instant access. From{' '}
              <Link
                href="/tools/base64-encode"
                className="font-semibold text-purple-600 underline decoration-2 underline-offset-2 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
              >
                encoding utilities
              </Link>{' '}
              to{' '}
              <Link
                href="/tools/hash-generator"
                className="font-semibold text-purple-600 underline decoration-2 underline-offset-2 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
              >
                security tools
              </Link>
              , build your personalized toolkit that evolves with your workflow.
              Everything stays private in your browser with no account required.
            </p>
          </div>
        </div>
      </section>

      {/* Enhanced Empty State */}
      <section className="py-16">
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-lg"
          >
            {/* Enhanced Empty Lab Animation */}
            <motion.div
              className="relative mb-12"
              animate={{
                rotate: [0, -5, 5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <div className="mb-6 text-9xl">🧪</div>

              {/* Floating particles */}
              <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute h-2 w-2 rounded-full bg-purple-400"
                    animate={{
                      y: [-15, -40, -15],
                      x: [0, Math.sin(i) * 25, 0],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.4,
                      ease: 'easeInOut',
                    }}
                    style={{
                      left: `${40 + i * 6}%`,
                      top: '25%',
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Main Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">
                Your Lab Awaits!
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                Start building your personalized developer toolkit by starring
                tools with a{' '}
                <Star className="mx-1 inline h-5 w-5 fill-amber-500 text-amber-500" />{' '}
                to add them here.
              </p>
            </motion.div>

            {/* Enhanced Action Buttons */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="mb-12 flex flex-col gap-4 sm:flex-row sm:justify-center"
            >
              <Link
                href="/tools"
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-8 py-4',
                  'bg-gradient-to-r from-purple-600 to-violet-600',
                  'text-lg font-semibold text-white',
                  'hover:from-purple-700 hover:to-violet-700',
                  'transform transition-all hover:scale-105',
                  'shadow-lg hover:shadow-xl'
                )}
              >
                <Search className="h-5 w-5" />
                Explore All Tools
              </Link>

              <Link
                href="/categories"
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-8 py-4',
                  'border-2 border-purple-600 text-purple-600',
                  'hover:bg-purple-50 dark:hover:bg-purple-950/30',
                  'text-lg font-semibold transition-all',
                  'dark:border-purple-400 dark:text-purple-400'
                )}
              >
                <Grid3X3 className="h-5 w-5" />
                Browse Categories
              </Link>
            </motion.div>

            {/* Enhanced Pro Tips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="rounded-2xl border border-gray-200 bg-gradient-to-br from-purple-50 to-violet-50 p-6 dark:border-gray-700 dark:from-purple-950/20 dark:to-violet-950/20"
            >
              <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                💡 Pro Tips for Your Lab:
              </h3>
              <ul className="space-y-3 text-left text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <Star className="mt-1 h-5 w-5 flex-shrink-0 fill-amber-500 text-amber-500" />
                  <span>
                    Click the star on any tool card to add it to your personal
                    collection
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="mt-1 h-5 w-5 flex-shrink-0 fill-amber-500 text-amber-500" />
                  <span>
                    Star entire categories for quick access to related tools
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                  <span>
                    Everything stays completely private - stored locally in your
                    browser with zero tracking
                  </span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

export default function LabHubContent() {
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
    setLabVisited();

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-purple-800 py-20">
          <div className="animate-pulse">
            <div className="mx-auto max-w-4xl px-4 text-center">
              <div className="mx-auto mb-4 h-12 w-96 rounded bg-white/20" />
              <div className="w-128 mx-auto mb-8 h-6 rounded bg-white/10" />
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-40 rounded-xl bg-gray-200 dark:bg-gray-800"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const favoriteCount = getFavoriteCount();
  const recentTools = getRecentTools();
  const isEmpty = favoriteCount === 0;

  // Get valid favorite categories
  const validFavoriteCategories = favoriteCategories.filter((categoryId) => {
    const category = CATEGORIES.find((cat) => cat.id === categoryId);
    return category && category.tools.length > 0;
  });

  // Get standalone favorite tools
  const standaloneFavoriteTools = favoriteTools.filter((toolSlug) => {
    const tool = TOOLS_CONFIG.find((t) => t.id === toolSlug);
    return tool && !favoriteCategories.includes(tool.categories[0]);
  });

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <WelcomePopup />

        {/* Enhanced Header with Gradient - Empty State */}
        <section className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-violet-600 to-purple-800">
          {/* Pattern Overlay */}
          <div className="bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] absolute inset-0 opacity-50" />

          {/* Gradient Decorations */}
          <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-gradient-to-br from-white/20 to-white/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-white/15 to-white/5 blur-3xl" />

          <div className="relative py-20 lg:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                {/* Breadcrumbs */}
                <nav
                  className="mb-8 flex justify-center"
                  aria-label="Breadcrumb"
                >
                  <ol className="flex items-center space-x-2 text-sm text-white/70">
                    <li>
                      <Link
                        href="/"
                        className="transition-colors hover:text-white"
                      >
                        Home
                      </Link>
                    </li>
                    <li>
                      <ArrowRight className="h-3 w-3" />
                    </li>
                    <li className="font-medium text-white">Lab</li>
                  </ol>
                </nav>

                {/* Hero Icons */}
                <div className="mb-8 flex items-center justify-center gap-4">
                  <span className="animate-pulse text-6xl lg:text-7xl">🧪</span>
                  <div className="h-12 w-px bg-white/30" />
                  <span
                    className="animate-pulse text-6xl lg:text-7xl"
                    style={{ animationDelay: '0.5s' }}
                  >
                    ⚗️
                  </span>
                </div>

                {/* Main Heading */}
                <h1 className="mb-6 text-4xl font-bold text-white lg:text-5xl">
                  Your Personal{' '}
                  <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    Developer Lab
                  </span>
                </h1>

                {/* Enhanced Tagline */}
                <p className="mx-auto mb-4 max-w-2xl text-xl text-white/90 lg:text-2xl">
                  Curate your favorite tools for instant access and streamlined
                  workflows
                </p>

                {/* Enhanced Description */}
                <p className="mx-auto mb-8 max-w-4xl text-lg leading-relaxed text-white/80">
                  Build your personalized toolkit by starring tools across
                  ToolsLab. Your Lab stays completely private - all data stored
                  locally in your browser with no account required.
                </p>

                {/* Trust Badges */}
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/90">
                  <span className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-300" />
                    Completely Private
                  </span>
                  <span className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-300" />
                    Instant Access
                  </span>
                  <span className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-pink-300" />
                    Zero Setup
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <EnhancedEmptyState />
      </div>
    );
  }

  const lastUsedTool =
    recentTools.length > 0
      ? TOOLS_CONFIG.find((t) => t.id === recentTools[0].tool)
      : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <WelcomePopup />
      <HelpButton />

      {/* Enhanced Header with Gradient - With Tools */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-violet-600 to-purple-800">
        {/* Pattern Overlay */}
        <div className="bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] absolute inset-0 opacity-50" />

        {/* Gradient Decorations */}
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-gradient-to-br from-white/20 to-white/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-white/15 to-white/5 blur-3xl" />

        <div className="relative py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Breadcrumbs */}
              <nav className="mb-6 flex justify-center" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-sm text-white/70">
                  <li>
                    <Link
                      href="/"
                      className="transition-colors hover:text-white"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <ArrowRight className="h-3 w-3" />
                  </li>
                  <li className="font-medium text-white">Lab</li>
                </ol>
              </nav>

              {/* Hero Icons */}
              <div className="mb-6 flex items-center justify-center gap-3">
                <span className="animate-pulse text-5xl lg:text-6xl">🧪</span>
                <div className="h-10 w-px bg-white/30" />
                <span
                  className="animate-pulse text-5xl lg:text-6xl"
                  style={{ animationDelay: '0.5s' }}
                >
                  ⚗️
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
                Your Personal{' '}
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Developer Lab
                </span>
              </h1>

              {/* Dynamic Tagline with Stats */}
              <p className="mx-auto mb-6 max-w-2xl text-lg text-white/90 lg:text-xl">
                Quick access to your{' '}
                <span className="font-semibold text-yellow-300">
                  {favoriteCount}
                </span>{' '}
                favorite development tools
              </p>

              {/* Stats Bar */}
              <div className="mx-auto mb-6 flex max-w-md items-center justify-center gap-6 rounded-full bg-white/10 px-6 py-3 backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-lg font-bold text-white">
                    {favoriteCount}
                  </div>
                  <div className="text-xs text-white/70">Tools Saved</div>
                </div>
                {lastUsedTool && (
                  <>
                    <div className="h-8 w-px bg-white/30" />
                    <div className="text-center">
                      <div className="max-w-32 truncate text-sm font-semibold text-white">
                        {lastUsedTool.name}
                      </div>
                      <div className="text-xs text-white/70">Last Used</div>
                    </div>
                  </>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/30"
                >
                  <Search className="h-4 w-4" />
                  Browse Tools
                </Link>
                <Link
                  href="/categories"
                  className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/30"
                >
                  <Filter className="h-4 w-4" />
                  Categories
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-12">
          {/* Favorite Categories */}
          {validFavoriteCategories.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="mb-8 flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white">
                <span>📁</span>
                Favorite Categories
                <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                  {validFavoriteCategories.length}
                </span>
              </h2>
              <div className="space-y-6">
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
              <h2 className="mb-8 flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white">
                <span>⭐</span>
                Favorite Tools
                <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                  {standaloneFavoriteTools.length}
                </span>
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
              <h2 className="mb-8 flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white">
                <span>🕒</span>
                Recent Activity
                <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                  {recentTools.length}
                </span>
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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

        {/* SEO Content Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 rounded-2xl bg-gradient-to-br from-purple-50 to-violet-50 py-16 dark:from-purple-950/20 dark:to-violet-950/20"
        >
          <div className="mx-auto max-w-4xl px-8 text-center">
            <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
              Why Create a Personal Developer Lab?
            </h2>

            <div className="prose prose-lg mx-auto max-w-none text-gray-700 dark:text-gray-300">
              <p className="mb-6">
                Your Personal Lab transforms scattered tool usage into an
                organized, efficient workflow. By curating your favorite tools,
                you eliminate the time spent searching and create muscle memory
                for your most common development tasks.
              </p>

              <div className="grid gap-8 text-left md:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                    Privacy & Control
                  </h3>
                  <p>
                    Everything in your Lab is stored locally using browser
                    localStorage. No accounts, no tracking, no server-side
                    storage. Your workflow preferences stay completely private
                    and under your control.
                  </p>
                </div>

                <div>
                  <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                    Workflow Optimization
                  </h3>
                  <p>
                    Star frequently-used tools like our{' '}
                    <Link
                      href="/tools/json-formatter"
                      className="text-purple-600 hover:text-purple-800 dark:text-purple-400"
                    >
                      JSON Formatter
                    </Link>
                    ,{' '}
                    <Link
                      href="/tools/base64-encode"
                      className="text-purple-600 hover:text-purple-800 dark:text-purple-400"
                    >
                      Base64 Encoder
                    </Link>
                    , and{' '}
                    <Link
                      href="/category/encoding"
                      className="text-purple-600 hover:text-purple-800 dark:text-purple-400"
                    >
                      security utilities
                    </Link>{' '}
                    to build workflows that match your development patterns.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-6 py-3 font-semibold text-white transition-all hover:scale-105 hover:bg-purple-700"
              >
                <Search className="h-4 w-4" />
                Explore All Tools
              </Link>

              <Link
                href="/categories"
                className="inline-flex items-center gap-2 rounded-full border-2 border-purple-600 px-6 py-3 font-semibold text-purple-600 transition-all hover:bg-purple-50 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-950/20"
              >
                <Grid3X3 className="h-4 w-4" />
                Browse Categories
              </Link>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
