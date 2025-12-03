'use client';

import { cn } from '@/lib/utils';

interface SectionDividerProps {
  className?: string;
}

export function SectionDivider({ className }: SectionDividerProps) {
  return (
    <div className={cn('section-divider my-12 flex items-center', className)}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600"></div>
      <span className="px-6 text-lg text-gray-400 dark:text-gray-400">•••</span>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600"></div>
    </div>
  );
}
