import Link from 'next/link';
import { ToolCategory, getCategoryColorClass } from '@/lib/tools';
import { cn } from '@/lib/utils';
import { ArrowRight, Zap } from 'lucide-react';

interface CategoryCardProps {
  category: ToolCategory;
  className?: string;
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  const categoryClass = getCategoryColorClass(category.color);
  const previewTools = category.tools.slice(0, 4);

  return (
    <Link href={`/?category=${category.id}`} className="group block">
      <div
        className={cn(
          'category-card hover-lift group-hover:scale-105 transition-all duration-300',
          categoryClass,
          className
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border-2 transition-all duration-300 group-hover:scale-110"
              style={{ 
                backgroundColor: `var(--category-bg)`,
                borderColor: `var(--category-border)`,
                color: `var(--category-primary)`
              }}
            >
              {category.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-opacity-80 transition-colors">
                {category.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className="badge badge-category">
                  {category.tools.length} tool{category.tools.length === 1 ? '' : 's'}
                </span>
                {category.tools.some(tool => tool.isPopular) && (
                  <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                    <Zap className="w-3 h-3" />
                    <span>Popular</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <ArrowRight 
            className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-all duration-200 group-hover:translate-x-1"
            style={{ color: `var(--category-primary)` }}
          />
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
          {category.description}
        </p>

        {/* Preview Tools */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Featured Tools:
          </div>
          <div className="grid grid-cols-2 gap-3">
            {previewTools.map((tool) => (
              <div
                key={tool.id}
                className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="text-lg flex-shrink-0">{tool.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {tool.name}
                  </div>
                  {tool.isPopular && (
                    <div className="text-xs text-amber-600 dark:text-amber-400">Popular</div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {category.tools.length > 4 && (
            <div className="text-center pt-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                +{category.tools.length - 4} more tools
              </span>
            </div>
          )}
        </div>

        {/* Hover overlay */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"
          style={{ backgroundColor: `var(--category-primary)` }}
        />
      </div>
    </Link>
  );
}