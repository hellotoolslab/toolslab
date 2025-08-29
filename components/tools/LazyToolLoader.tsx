'use client';

import { Suspense, lazy, ComponentType } from 'react';
import { BaseToolProps } from '@/lib/types/tools';

// Loading component for tool implementations
function ToolLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Input section skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-32 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
      </div>

      {/* Action buttons skeleton */}
      <div className="flex gap-4">
        <div className="h-10 w-24 rounded-lg bg-blue-200 dark:bg-blue-800"></div>
        <div className="h-10 w-16 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
      </div>

      {/* Output section skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-32 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </div>
  );
}

// Lazy load all tool implementations
const toolComponents = {
  'json-formatter': lazy(() => import('./implementations/JsonFormatter')),
  'base64-encode': lazy(() => import('./implementations/Base64Tool')),
  'hash-generator': lazy(() => import('./implementations/HashGenerator')),
  'uuid-generator': lazy(() => import('./implementations/UuidGenerator')),
  'password-generator': lazy(
    () => import('./implementations/PasswordGenerator')
  ),
  'regex-tester': lazy(() => import('./implementations/RegexTester')),
  'favicon-generator': lazy(() => import('./implementations/FaviconGenerator')),
  // Add more as needed
} as const;

type ToolId = keyof typeof toolComponents;

interface LazyToolLoaderProps extends BaseToolProps {
  toolId: ToolId;
}

export default function LazyToolLoader({
  toolId,
  ...props
}: LazyToolLoaderProps) {
  const ToolComponent = toolComponents[toolId];

  if (!ToolComponent) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Tool not found: {toolId}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<ToolLoadingSkeleton />}>
      <ToolComponent {...props} />
    </Suspense>
  );
}

// Helper to check if a tool supports lazy loading
export function isLazyLoadingSupported(toolId: string): toolId is ToolId {
  return toolId in toolComponents;
}

// Preload a specific tool component
export function preloadTool(toolId: ToolId) {
  const component = toolComponents[toolId];
  if (component && typeof window !== 'undefined') {
    // Trigger the dynamic import to preload
    void component;
  }
}

// Preload multiple tools
export function preloadTools(toolIds: ToolId[]) {
  toolIds.forEach(preloadTool);
}

// Hook to preload related tools
export function usePreloadRelatedTools(
  currentToolId: string,
  relatedTools: string[]
) {
  const supportedTools = relatedTools.filter(isLazyLoadingSupported);

  // Preload after a short delay to not interfere with current tool loading
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      preloadTools(supportedTools);
    }, 1000);
  }
}
