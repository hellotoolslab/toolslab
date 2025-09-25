'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: string | ReactNode;
  title: string;
  description: string;
  highlight?: boolean;
  className?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  highlight = false,
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-xl border p-6 transition-all duration-300',
        'hover:-translate-y-1 hover:shadow-lg',
        highlight
          ? 'border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 dark:border-purple-700 dark:from-purple-900/20 dark:to-pink-900/20'
          : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800',
        className
      )}
    >
      {highlight && (
        <div className="absolute -right-3 -top-3">
          <div className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 text-xs font-semibold text-white">
            Popular
          </div>
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {typeof icon === 'string' ? (
            <span className="text-3xl" role="img" aria-label="Feature icon">
              {icon}
            </span>
          ) : (
            icon
          )}
        </div>

        <div className="flex-1">
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
