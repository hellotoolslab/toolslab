'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon: string;
  badge?: string;
  className?: string;
}

export function ToolCard({
  title,
  description,
  href,
  icon,
  badge,
  className,
}: ToolCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative block rounded-xl border p-6 transition-all duration-300',
        'hover:-translate-y-1 hover:border-purple-300 hover:shadow-lg',
        'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800',
        'dark:hover:border-purple-600',
        className
      )}
    >
      {badge && (
        <div className="absolute -right-3 -top-3">
          <span className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1 text-xs font-semibold text-white">
            {badge}
          </span>
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <span className="text-3xl" role="img" aria-label="Tool icon">
            {icon}
          </span>
        </div>

        <div className="flex-1">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 transition-colors group-hover:text-purple-600 dark:text-gray-100 dark:group-hover:text-purple-400">
              {title}
            </h3>
            <ArrowRight className="h-5 w-5 text-gray-400 transition-all group-hover:translate-x-1 group-hover:text-purple-500" />
          </div>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
