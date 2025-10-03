import React from 'react';
import Link from 'next/link';
import { Tool } from '@/lib/tools';
import { cn } from '@/lib/utils';
import { FavoriteButton } from '@/components/lab/FavoriteButton';
import { useToolLabels } from '@/lib/hooks/useToolLabels';
import { ToolLabel } from '@/lib/edge-config/types';
import { useLocale } from '@/hooks/useLocale';

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

interface ToolCardProps {
  tool: Tool;
  className?: string;
  showStats?: boolean;
  toolLabel?: ToolLabel;
}

export function ToolCard({
  tool,
  className,
  showStats = false,
  toolLabel,
}: ToolCardProps) {
  const { getToolLabelInfo, getLabelComponent } = useToolLabels();
  const labelInfo = getToolLabelInfo(toolLabel);
  const { createHref } = useLocale();

  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (!labelInfo.isClickable) {
      return (
        <div className="group block h-full cursor-not-allowed">
          <div
            className={cn(
              'relative flex h-full flex-col rounded-xl border shadow-sm transition-all duration-200',
              'border-gray-300 bg-gray-50 opacity-60 dark:border-gray-700 dark:bg-gray-800',
              className
            )}
          >
            {children}
          </div>
        </div>
      );
    }

    return (
      <Link href={createHref(tool.route)} className="group block h-full">
        <div
          className={cn(
            'relative flex h-full flex-col rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg dark:border-gray-800 dark:bg-gray-900',
            className
          )}
        >
          {children}
        </div>
      </Link>
    );
  };

  return (
    <CardWrapper>
      {/* Category color border top */}
      <div
        className="absolute left-0 right-0 top-0 h-1 rounded-t-xl opacity-80"
        style={{
          background: `linear-gradient(90deg, ${getCategoryColor(tool.categories[0])}, transparent)`,
        }}
      />

      {/* Header Section - Fixed Height */}
      <div className="relative flex-shrink-0 p-6 pb-4">
        {/* Favorite Button */}
        <div className="absolute right-4 top-4 z-20">
          <FavoriteButton
            type="tool"
            id={tool.id}
            name={tool.name}
            size="sm"
            className="z-30"
          />
        </div>

        {/* Icon and Label */}
        <div className="flex items-start gap-2">
          <div
            className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border-2 text-2xl transition-all duration-200"
            style={{
              backgroundColor: `${getCategoryColor(tool.categories[0])}20`,
              borderColor: `${getCategoryColor(tool.categories[0])}40`,
            }}
          >
            <span className="text-3xl" aria-hidden="true">
              {typeof tool.icon === 'string' ? tool.icon : '📄'}
            </span>
          </div>

          {/* Label - Adjusted positioning */}
          {labelInfo.hasLabel && (
            <div className="relative z-50 mt-0.5 flex-shrink-0">
              {getLabelComponent(toolLabel, 'xs')}
            </div>
          )}
        </div>
      </div>

      {/* Content Section - Flexible Height */}
      <div className="flex flex-1 flex-col px-6 pb-6">
        {/* Title and Category */}
        <div className="mb-4">
          <h3
            className={cn(
              'mb-2 text-lg font-bold leading-tight',
              labelInfo.isComingSoon
                ? 'text-gray-500 dark:text-gray-400'
                : 'text-gray-900 dark:text-gray-100'
            )}
          >
            {tool.name}
          </h3>
          <div
            className={cn(
              'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium',
              labelInfo.isComingSoon && 'opacity-60'
            )}
            style={{
              backgroundColor: `${getCategoryColor(tool.categories[0])}15`,
              color: getCategoryColor(tool.categories[0]),
              borderColor: `${getCategoryColor(tool.categories[0])}30`,
            }}
          >
            {tool.categories[0]}
          </div>
        </div>

        {/* Description - Fixed height */}
        <p
          className={cn(
            'mb-4 line-clamp-3 flex-1 text-sm leading-relaxed',
            labelInfo.isComingSoon
              ? 'text-gray-500 dark:text-gray-500'
              : 'text-gray-600 dark:text-gray-400'
          )}
        >
          {labelInfo.isComingSoon
            ? 'This tool is coming soon. Stay tuned for updates!'
            : tool.description}
        </p>

        {/* Keywords - Bottom section */}
        {tool.keywords && tool.keywords.length > 0 && (
          <div className="mt-auto">
            <div className="flex flex-wrap gap-1.5">
              {tool.keywords.slice(0, 4).map((keyword) => (
                <span
                  key={keyword}
                  className={cn(
                    'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium transition-colors',
                    labelInfo.isComingSoon
                      ? 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-500'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  )}
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hover effect overlay - only for clickable cards */}
      {labelInfo.isClickable && (
        <div
          className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-200 group-hover:opacity-5"
          style={{ backgroundColor: getCategoryColor(tool.categories[0]) }}
        />
      )}
    </CardWrapper>
  );
}
