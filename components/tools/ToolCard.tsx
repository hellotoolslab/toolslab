import Link from 'next/link';
import { Tool } from '@/lib/tools';
import { cn } from '@/lib/utils';
import { TrendingUp, Sparkles, Clock, Users } from 'lucide-react';

const getCategoryColor = (category: string) => {
  const colors = {
    data: '#0EA5E9',
    encoding: '#10B981', 
    text: '#8B5CF6',
    generators: '#F97316',
    web: '#EC4899',
    dev: '#F59E0B'
  };
  return colors[category as keyof typeof colors] || '#3B82F6';
};

interface ToolCardProps {
  tool: Tool;
  className?: string;
  showStats?: boolean;
}

export function ToolCard({ tool, className, showStats = false }: ToolCardProps) {
  return (
    <Link href={tool.route} className="group block">
      <div
        className={cn(
          'relative overflow-hidden bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] p-6',
          className
        )}
      >
        {/* Category color border top */}
        <div 
          className="absolute top-0 left-0 right-0 h-1 opacity-80"
          style={{ 
            background: `linear-gradient(90deg, ${getCategoryColor(tool.categoryColor)}, transparent)`
          }} 
        />
        
        {/* Badges */}
        <div className="absolute top-4 right-4 flex gap-2">
          {tool.isPopular && (
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
              <TrendingUp className="w-3 h-3" />
              Popular
            </div>
          )}
          {tool.isNew && (
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
              <Sparkles className="w-3 h-3" />
              New
            </div>
          )}
        </div>

        <div>
          {/* Icon and Title */}
          <div className="flex items-start space-x-4 mb-4">
            <div 
              className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl border-2 transition-all duration-200"
              style={{ 
                backgroundColor: `${getCategoryColor(tool.categoryColor)}20`,
                borderColor: `${getCategoryColor(tool.categoryColor)}40`
              }}
            >
              <span className="text-2xl" aria-hidden="true">
                {tool.icon}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100 group-hover:opacity-80 transition-all duration-200">
                {tool.name}
              </h3>
              <div 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                style={{
                  backgroundColor: `${getCategoryColor(tool.categoryColor)}20`,
                  color: getCategoryColor(tool.categoryColor),
                  borderColor: `${getCategoryColor(tool.categoryColor)}40`
                }}
              >
                {tool.category}
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
            {tool.description}
          </p>

          {/* Keywords */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tool.keywords.slice(0, 3).map((keyword) => (
              <span
                key={keyword}
                className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-400"
              >
                {keyword}
              </span>
            ))}
            {tool.keywords.length > 3 && (
              <span className="text-xs text-gray-400 flex items-center">
                +{tool.keywords.length - 3} more
              </span>
            )}
          </div>

          {/* Stats */}
          {showStats && (
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{(tool.searchVolume / 100).toFixed(1)}k uses</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Updated today</span>
              </div>
            </div>
          )}
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
      </div>
    </Link>
  );
}