'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Info, Lightbulb, AlertTriangle, CheckCircle } from 'lucide-react';

interface InfoBoxProps {
  variant?: 'info' | 'tip' | 'warning' | 'success';
  title?: string;
  children: ReactNode;
  className?: string;
}

const variants = {
  info: {
    container:
      'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
    icon: Info,
    iconColor: 'text-blue-600 dark:text-blue-400',
    titleColor: 'text-blue-900 dark:text-blue-100',
  },
  tip: {
    container:
      'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800',
    icon: Lightbulb,
    iconColor: 'text-purple-600 dark:text-purple-400',
    titleColor: 'text-purple-900 dark:text-purple-100',
  },
  warning: {
    container:
      'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800',
    icon: AlertTriangle,
    iconColor: 'text-amber-600 dark:text-amber-400',
    titleColor: 'text-amber-900 dark:text-amber-100',
  },
  success: {
    container:
      'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
    icon: CheckCircle,
    iconColor: 'text-green-600 dark:text-green-400',
    titleColor: 'text-green-900 dark:text-green-100',
  },
};

export function InfoBox({
  variant = 'info',
  title,
  children,
  className,
}: InfoBoxProps) {
  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'my-6 rounded-lg border-b border-l-4 border-r border-t p-6',
        config.container,
        className
      )}
    >
      <div className="flex items-start gap-4">
        <Icon
          className={cn('mt-0.5 h-6 w-6 flex-shrink-0', config.iconColor)}
        />
        <div className="flex-1">
          {title && (
            <h4 className={cn('mb-2 font-semibold', config.titleColor)}>
              {title}
            </h4>
          )}
          <div className="text-gray-700 dark:text-gray-300 [&>p:last-child]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
