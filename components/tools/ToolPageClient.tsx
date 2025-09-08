'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  tools,
  getToolById,
  categories,
  getCategoryColorClass,
} from '@/lib/tools';
import ToolWorkspace from './ToolWorkspace';
import { useUmami } from '@/components/analytics/OptimizedUmamiProvider';
import {
  ChevronRight,
  Share2,
  X,
  Info,
  BookOpen,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { FavoriteButton } from '@/components/lab/FavoriteButton';
import { useToolLabel } from '@/lib/services/toolLabelService';
import { useToolLabels } from '@/lib/hooks/useToolLabels';
import { FAQModal } from '@/components/ui/faq-modal';
import ToolHowToUse from './ToolHowToUse';
import ToolHeroSection from './ToolHeroSection';

interface ToolPageClientProps {
  toolId: string;
}

export default function ToolPageClient({ toolId }: ToolPageClientProps) {
  const searchParams = useSearchParams();
  const { theme } = useTheme();
  const { trackEngagement, trackToolUse } = useUmami();
  const [usageCount, setUsageCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Tool label system
  const toolLabel = useToolLabel(toolId);
  const { getToolLabelInfo, getLabelComponent } = useToolLabels();
  const labelInfo = getToolLabelInfo(toolLabel);

  // Extract initial input from search params
  const initialInput = searchParams?.get('input') || undefined;

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Simulate usage count
    setUsageCount(Math.floor(Math.random() * 5000) + 1000);

    // Track tool page view
    if (toolId) {
      trackEngagement('tool-page-viewed', {
        tool: toolId,
        has_initial_input: !!initialInput,
        is_mobile: window.innerWidth < 768,
      });
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, [toolId, initialInput]); // Removed trackEngagement from deps

  const tool = getToolById(toolId);

  if (!tool) {
    return <div>Tool not found</div>;
  }

  // Get primary category information
  const primaryCategory = categories.find(
    (cat) => cat.id === tool.categories[0]
  );
  const categoryId = tool.categories[0];

  // Get category color using the same system as ToolCard
  const getCategoryColor = (category: string) => {
    const colors = {
      data: '#0EA5E9',
      encoding: '#10B981',
      text: '#8B5CF6',
      generators: '#F97316',
      web: '#EC4899',
      dev: '#F59E0B',
      formatters: '#6366F1',
    };
    return colors[category as keyof typeof colors] || '#3B82F6';
  };

  const categoryColor = getCategoryColor(categoryId);

  const handleShare = async () => {
    const hasNativeShare =
      typeof navigator !== 'undefined' && 'share' in navigator;

    trackEngagement('tool-share-clicked', {
      tool: toolId,
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
          tool: toolId,
          method: 'native',
        });
      } catch (err) {
        // Share cancelled by user
        trackEngagement('tool-share-cancelled', {
          tool: toolId,
          method: 'native',
        });
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      trackEngagement('tool-share-completed', {
        tool: toolId,
        method: 'clipboard',
      });
      // Show toast notification
    }
  };

  // Get related tools from same category (excluding coming-soon tools)
  const getRelatedTools = () => {
    let filteredTools = tools.filter(
      (t) =>
        t.categories.includes(tool.categories[0]) &&
        t.id !== tool.id &&
        t.label !== 'coming-soon'
    );

    // Special case: Add JSON Formatter to Base64 related tools
    if (toolId === 'base64-encode') {
      const jsonFormatter = tools.find((t) => t.id === 'json-formatter');
      if (jsonFormatter && !filteredTools.includes(jsonFormatter)) {
        filteredTools.unshift(jsonFormatter); // Add JSON Formatter at the beginning
      }
    }

    return filteredTools.slice(0, 4);
  };

  const relatedTools = getRelatedTools();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Header Ad Banner - Hidden */}

      <div className="mx-auto max-w-7xl px-4 py-4 sm:py-8">
        {/* Breadcrumb - Reduced spacing */}
        <nav className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm">
          <Link
            href="/"
            className="text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Home
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <Link
            href="/tools"
            className="text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Tools
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <Link
            href={`/category/${categoryId}`}
            className="capitalize text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            style={{ color: categoryColor }}
          >
            {primaryCategory?.name || categoryId}
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <span className="font-medium text-gray-900 dark:text-white">
            {tool.name}
          </span>
        </nav>

        {/* Tool Hero Section - Optimized spacing */}
        <div className="mb-5 flex items-start justify-between gap-4">
          <ToolHeroSection
            toolId={tool.id}
            toolName={tool.name}
            categoryColor={categoryColor}
            categoryName={primaryCategory?.name || categoryId}
            favoriteButton={
              <FavoriteButton
                type="tool"
                id={tool.id}
                name={tool.name}
                size="lg"
                showLabel={false}
              />
            }
            categoryBadge={
              <span
                className="rounded-full px-2.5 py-1 text-xs font-medium capitalize"
                style={{
                  backgroundColor: `${categoryColor}15`,
                  color: categoryColor,
                }}
              >
                {primaryCategory?.name || categoryId}
              </span>
            }
            labelBadge={
              labelInfo.hasLabel
                ? getLabelComponent(toolLabel, 'xs')
                : undefined
            }
            className="relative flex-1"
          />

          {/* Share Button - Aligned with header */}
          <div className="flex items-start pt-1">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Tool Workspace */}
          <div className="lg:col-span-2">
            <ToolWorkspace
              tool={{ ...tool, slug: tool.id, category: categoryId } as any}
              categoryColor={categoryColor}
              initialInput={initialInput}
            />

            {/* How to Use Section */}
            <ToolHowToUse toolId={tool.id} categoryColor={categoryColor} />
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
                      key={relatedTool.id}
                      href={`/tools/${relatedTool.id}`}
                      className="group flex items-center gap-3 rounded-lg p-3 transition-all hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <div
                        className="rounded-lg p-2"
                        style={{ backgroundColor: `${categoryColor}20` }}
                      >
                        <span
                          className="flex h-5 w-5 items-center justify-center text-lg"
                          style={{ color: categoryColor }}
                        >
                          {relatedTool.icon}
                        </span>
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

              {/* Sidebar Ad - Hidden */}
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
                  key={relatedTool.id}
                  href={`/tools/${relatedTool.id}`}
                  className="rounded-xl border border-gray-200 bg-white p-4 transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                >
                  <div
                    className="mb-2 inline-block rounded-lg p-2"
                    style={{ backgroundColor: `${categoryColor}20` }}
                  >
                    <span
                      className="flex h-5 w-5 items-center justify-center text-lg"
                      style={{ color: categoryColor }}
                    >
                      {relatedTool.icon}
                    </span>
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

        {/* FAQ Modal */}
        <FAQModal categoryColor={categoryColor} toolName={tool.name} />
      </div>
    </div>
  );
}
