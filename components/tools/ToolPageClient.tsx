'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Tool } from '@/types/tool';
import { tools } from '@/data/tools';
import { categoryColors } from '@/data/categories';
import ToolWorkspace from './ToolWorkspace';
import AdBanner from '@/components/ads/AdBanner';
import { useFeatureFlag } from '@/hooks/useEdgeConfig';
import { useUmami } from '@/components/analytics/UmamiProvider';
import {
  ChevronRight,
  Share2,
  Clock,
  TrendingUp,
  X,
  Info,
  BookOpen,
  HelpCircle,
  ArrowRight,
  Star,
} from 'lucide-react';
import { FavoriteButton } from '@/components/lab/FavoriteButton';

interface ToolPageClientProps {
  toolSlug: string;
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function ToolPageClient({
  toolSlug,
  searchParams,
}: ToolPageClientProps) {
  const { theme } = useTheme();
  const { trackEngagement, trackToolUse } = useUmami();
  const [isAdDismissed, setIsAdDismissed] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const adsEnabled = useFeatureFlag('adsEnabled');

  // Extract initial input from search params
  const initialInput = searchParams?.input
    ? Array.isArray(searchParams.input)
      ? searchParams.input[0]
      : searchParams.input
    : undefined;

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Simulate usage count
    setUsageCount(Math.floor(Math.random() * 5000) + 1000);

    // Track tool page view
    if (toolSlug) {
      trackEngagement('tool-page-viewed', {
        tool: toolSlug,
        has_initial_input: !!initialInput,
        is_mobile: window.innerWidth < 768,
      });
    }

    // Check ad dismiss state
    const dismissed = localStorage.getItem('ad-dismissed');
    if (dismissed) {
      const dismissTime = new Date(dismissed).getTime();
      const now = new Date().getTime();
      if (now - dismissTime < 24 * 60 * 60 * 1000) {
        setIsAdDismissed(true);
      }
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, [toolSlug, initialInput, trackEngagement]);

  const tool = tools.find((t) => t.slug === toolSlug);

  if (!tool) {
    return <div>Tool not found</div>;
  }

  const handleDismissAd = () => {
    setIsAdDismissed(true);
    localStorage.setItem('ad-dismissed', new Date().toISOString());
    trackEngagement('ad-dismissed', {
      tool: toolSlug,
      ad_type: 'banner',
    });
  };

  const handleShare = async () => {
    const hasNativeShare =
      typeof navigator !== 'undefined' && 'share' in navigator;

    trackEngagement('tool-share-clicked', {
      tool: toolSlug,
      method: hasNativeShare ? 'native' : 'clipboard',
    });

    if (hasNativeShare && navigator.share) {
      try {
        await navigator.share({
          title: `${tool.name} - OctoTools`,
          text: tool.description,
          url: window.location.href,
        });
        trackEngagement('tool-share-completed', {
          tool: toolSlug,
          method: 'native',
        });
      } catch (err) {
        console.log('Share cancelled');
        trackEngagement('tool-share-cancelled', {
          tool: toolSlug,
          method: 'native',
        });
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      trackEngagement('tool-share-completed', {
        tool: toolSlug,
        method: 'clipboard',
      });
      // Show toast notification
    }
  };

  // Get related tools from same category
  const relatedTools = tools
    .filter((t) => t.category === tool.category && t.slug !== tool.slug)
    .slice(0, 4);

  // Get color for category
  const categoryColor = categoryColors[tool.category] || categoryColors.default;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Header Ad Banner */}
      {!isAdDismissed && adsEnabled && (
        <div className="relative border-b border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
          <div className="mx-auto max-w-7xl px-4 py-2">
            <button
              onClick={handleDismissAd}
              className="absolute right-4 top-2 rounded-lg p-1 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Dismiss ad"
            >
              <X className="h-4 w-4" />
            </button>
            <AdBanner type="header" />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-4 sm:py-8">
        {/* Breadcrumb */}
        <nav className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:mb-6 sm:text-sm">
          <Link
            href="/"
            className="text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Home
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <Link
            href={`/category/${tool.category}`}
            className="capitalize text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            style={{ color: categoryColor }}
          >
            {tool.category}
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <span className="font-medium text-gray-900 dark:text-white">
            {tool.name}
          </span>
        </nav>

        {/* Tool Header */}
        <div className="mb-6 sm:mb-8">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2 sm:gap-3">
                <div
                  className="rounded-xl p-2 sm:p-3"
                  style={{ backgroundColor: `${categoryColor}20` }}
                >
                  <tool.icon
                    className="h-6 w-6 sm:h-8 sm:w-8"
                    style={{ color: categoryColor }}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl md:text-4xl">
                    {tool.name}
                  </h1>
                  <FavoriteButton
                    type="tool"
                    id={tool.slug}
                    name={tool.name}
                    size="lg"
                    showLabel={false}
                  />
                </div>
                <span
                  className="rounded-full px-3 py-1 text-xs font-medium capitalize"
                  style={{
                    backgroundColor: `${categoryColor}20`,
                    color: categoryColor,
                  }}
                >
                  {tool.category}
                </span>
                {usageCount > 2000 && (
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    Popular
                  </span>
                )}
              </div>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400 sm:text-lg">
                {tool.description}
              </p>

              {/* Tool Stats Bar */}
              <div className="flex flex-wrap items-center gap-2 text-xs sm:gap-4 sm:text-sm">
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <TrendingUp className="h-4 w-4" />
                  <span>Used {usageCount.toLocaleString()} times today</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>Saves ~5 min per use</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="ml-1 text-gray-500 dark:text-gray-400">
                    4.8
                  </span>
                </div>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Tool Workspace */}
          <div className="lg:col-span-2">
            <ToolWorkspace
              tool={tool}
              categoryColor={categoryColor}
              initialInput={initialInput}
            />

            {/* How to Use Section */}
            <div className="mt-8 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:mt-12 sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <BookOpen
                  className="h-5 w-5"
                  style={{ color: categoryColor }}
                />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  How to Use {tool.name}
                </h2>
              </div>
              <ol className="space-y-3">
                <li className="flex gap-3">
                  <span
                    className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: categoryColor }}
                  >
                    1
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    Enter or paste your input in the text area above
                  </span>
                </li>
                <li className="flex gap-3">
                  <span
                    className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: categoryColor }}
                  >
                    2
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    Configure any options or settings as needed
                  </span>
                </li>
                <li className="flex gap-3">
                  <span
                    className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: categoryColor }}
                  >
                    3
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    Click the process button to generate your result
                  </span>
                </li>
                <li className="flex gap-3">
                  <span
                    className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: categoryColor }}
                  >
                    4
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    Copy, download, or share your output as needed
                  </span>
                </li>
              </ol>
            </div>

            {/* FAQ Section */}
            <div className="mt-8 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <HelpCircle
                  className="h-5 w-5"
                  style={{ color: categoryColor }}
                />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Frequently Asked Questions
                </h2>
              </div>
              <div className="space-y-4">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">
                      Is this tool free to use?
                    </span>
                    <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
                    Yes, all OctoTools are completely free to use with no limits
                    or registration required.
                  </p>
                </details>
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">
                      Is my data secure?
                    </span>
                    <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
                    All processing happens locally in your browser. Your data
                    never leaves your device.
                  </p>
                </details>
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">
                      Can I use this offline?
                    </span>
                    <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
                    Once loaded, most tools work offline as they process data
                    locally in your browser.
                  </p>
                </details>
              </div>
            </div>
          </div>

          {/* Sidebar (Desktop Only) */}
          {!isMobile && (
            <div className="space-y-6">
              {/* Related Tools */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Related Tools
                </h3>
                <div className="space-y-3">
                  {relatedTools.map((relatedTool) => (
                    <Link
                      key={relatedTool.slug}
                      href={`/tools/${relatedTool.slug}`}
                      className="group flex items-center gap-3 rounded-lg p-3 transition-all hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <div
                        className="rounded-lg p-2"
                        style={{ backgroundColor: `${categoryColor}20` }}
                      >
                        <relatedTool.icon
                          className="h-5 w-5"
                          style={{ color: categoryColor }}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {relatedTool.name}
                        </p>
                        <p className="line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
                          {relatedTool.description}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 transition-colors group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Sidebar Ad */}
              {adsEnabled && (
                <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Advertisement
                  </span>
                  <AdBanner type="sidebar" />
                </div>
              )}

              {/* Quick Tips */}
              <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 p-6 dark:border-blue-800 dark:from-blue-900/20 dark:to-purple-900/20">
                <div className="mb-3 flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Pro Tips
                  </h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-blue-600 dark:text-blue-400">
                      •
                    </span>
                    <span>Use keyboard shortcuts for faster workflow</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-blue-600 dark:text-blue-400">
                      •
                    </span>
                    <span>Bookmark this page for quick access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-blue-600 dark:text-blue-400">
                      •
                    </span>
                    <span>Try our API for automation needs</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Related Tools */}
        {isMobile && (
          <div className="mt-8 sm:mt-12">
            <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
              Related Tools
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {relatedTools.map((relatedTool) => (
                <Link
                  key={relatedTool.slug}
                  href={`/tools/${relatedTool.slug}`}
                  className="rounded-xl border border-gray-200 bg-white p-4 transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                >
                  <div
                    className="mb-2 inline-block rounded-lg p-2"
                    style={{ backgroundColor: `${categoryColor}20` }}
                  >
                    <relatedTool.icon
                      className="h-5 w-5"
                      style={{ color: categoryColor }}
                    />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {relatedTool.name}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                    {relatedTool.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
