'use client';

import React, { useMemo } from 'react';
import { ToolLabel } from '@/lib/edge-config/types';

export interface LabelConfig {
  label: ToolLabel;
  text: string;
  icon: React.ComponentType<{ className?: string }>;
  className: string;
  textClassName: string;
}

export interface ToolLabelInfo {
  hasLabel: boolean;
  label?: ToolLabel;
  config?: LabelConfig;
  isComingSoon: boolean;
  isClickable: boolean;
}

/**
 * Hook to manage tool labels and their styling
 */
export function useToolLabels() {
  const labelConfigs = useMemo(() => {
    const configs: Record<ToolLabel, LabelConfig> = {
      popular: {
        label: 'popular',
        text: 'Popular',
        icon: ({ className }) => (
          <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
          </svg>
        ),
        className:
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        textClassName: 'text-yellow-800 dark:text-yellow-300',
      },
      new: {
        label: 'new',
        text: 'New',
        icon: ({ className }) => (
          <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ),
        className:
          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        textClassName: 'text-green-800 dark:text-green-300',
      },
      'coming-soon': {
        label: 'coming-soon',
        text: 'Coming Soon',
        icon: ({ className }) => (
          <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        ),
        className:
          'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
        textClassName: 'text-gray-600 dark:text-gray-400',
      },
    };
    return configs;
  }, []);

  const getToolLabelInfo = (toolLabel?: ToolLabel): ToolLabelInfo => {
    const hasLabel = !!toolLabel;
    const isComingSoon = toolLabel === 'coming-soon';
    const isClickable = !isComingSoon;

    return {
      hasLabel,
      label: toolLabel,
      config: toolLabel ? labelConfigs[toolLabel] : undefined,
      isComingSoon,
      isClickable,
    };
  };

  const getLabelComponent = (
    toolLabel?: ToolLabel,
    size: 'xs' | 'sm' | 'md' = 'sm'
  ) => {
    const labelInfo = getToolLabelInfo(toolLabel);

    if (!labelInfo.hasLabel || !labelInfo.config) {
      return null;
    }

    const { config } = labelInfo;
    const sizeClasses = {
      xs: 'px-2 py-0.5 text-xs',
      sm: 'px-2.5 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
    }[size];
    const iconSize = {
      xs: 'h-3 w-3',
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
    }[size];

    return (
      <div
        className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses} ${config.className}`}
      >
        <config.icon className={`${iconSize} flex-shrink-0`} />
        {/* Show text on all screen sizes for better mobile visibility */}
        <span className="text-xs font-medium">{config.text}</span>
      </div>
    );
  };

  return {
    labelConfigs,
    getToolLabelInfo,
    getLabelComponent,
  };
}
