import Link from 'next/link';
import { Tool } from '@/lib/tools';
import { cn } from '@/lib/utils';
import { TrendingUp, Sparkles, Clock, Users } from 'lucide-react';
import { FavoriteButton } from '@/components/lab/FavoriteButton';

const getCategoryColor = (category: string) => {
  const colors = {
    data: '#0EA5E9',
    encoding: '#10B981',
    text: '#8B5CF6',
    generators: '#F97316',
    web: '#EC4899',
    dev: '#F59E0B',
  };
  return colors[category as keyof typeof colors] || '#3B82F6';
};

interface ToolCardProps {
  tool: Tool;
  className?: string;
  showStats?: boolean;
}

export function ToolCard({
  tool,
  className,
  showStats = false,
}: ToolCardProps) {
  return (
    <Link href={tool.route} className="group block">
      <div
        className={cn(
          'relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg dark:border-gray-800 dark:bg-gray-900',
          className
        )}
      >
        {/* Category color border top */}
        <div
          className="absolute left-0 right-0 top-0 h-1 opacity-80"
          style={{
            background: `linear-gradient(90deg, ${getCategoryColor(tool.categoryColor)}, transparent)`,
          }}
        />

        {/* Badges and Favorite Button */}
        <div className="absolute right-4 top-4 z-20 flex gap-2">
          <FavoriteButton
            type="tool"
            id={tool.id}
            name={tool.name}
            size="sm"
            className="z-30"
          />
          {tool.isPopular && (
            <div className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
              <TrendingUp className="h-3 w-3" />
              Popular
            </div>
          )}
          {tool.isNew && (
            <div className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
              <Sparkles className="h-3 w-3" />
              New
            </div>
          )}
        </div>

        <div>
          {/* Icon and Title */}
          <div className="mb-4 flex items-start space-x-4">
            <div
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border-2 text-2xl transition-all duration-200"
              style={{
                backgroundColor: `${getCategoryColor(tool.categoryColor)}20`,
                borderColor: `${getCategoryColor(tool.categoryColor)}40`,
              }}
            >
              <span className="text-2xl" aria-hidden="true">
                {tool.icon}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="mb-2 text-lg font-semibold text-gray-900 transition-all duration-200 group-hover:opacity-80 dark:text-gray-100">
                {tool.name}
              </h3>
              <div
                className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium"
                style={{
                  backgroundColor: `${getCategoryColor(tool.categoryColor)}20`,
                  color: getCategoryColor(tool.categoryColor),
                  borderColor: `${getCategoryColor(tool.categoryColor)}40`,
                }}
              >
                {tool.category}
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {tool.description}
          </p>

          {/* Keywords */}
          <div className="mb-4 flex flex-wrap gap-2">
            {tool.keywords.slice(0, 3).map((keyword) => (
              <span
                key={keyword}
                className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
              >
                {keyword}
              </span>
            ))}
            {tool.keywords.length > 3 && (
              <span className="flex items-center text-xs text-gray-400">
                +{tool.keywords.length - 3} more
              </span>
            )}
          </div>

          {/* Stats */}
          {showStats && (
            <div className="flex items-center justify-between border-t border-gray-200 pt-3 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{(tool.searchVolume / 100).toFixed(1)}k uses</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Updated today</span>
              </div>
            </div>
          )}
        </div>

        {/* Hover effect overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent to-white/5 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      </div>
    </Link>
  );
}
