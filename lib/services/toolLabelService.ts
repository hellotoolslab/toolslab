'use client';

import { ToolLabel } from '@/lib/edge-config/types';
import { useFeatureFlag } from '@/hooks/useEdgeConfig';

/**
 * Service for managing tool labels via Edge Config
 */
export class ToolLabelService {
  private static instance: ToolLabelService;
  private labelCache = new Map<string, ToolLabel>();

  private constructor() {}

  static getInstance(): ToolLabelService {
    if (!ToolLabelService.instance) {
      ToolLabelService.instance = new ToolLabelService();
    }
    return ToolLabelService.instance;
  }

  /**
   * Get label for a specific tool
   */
  getToolLabel(toolId: string): ToolLabel | undefined {
    return this.labelCache.get(toolId);
  }

  /**
   * Set label for a specific tool
   */
  setToolLabel(toolId: string, label: ToolLabel | undefined): void {
    if (label) {
      this.labelCache.set(toolId, label);
    } else {
      this.labelCache.delete(toolId);
    }
  }

  /**
   * Get all tools with a specific label
   */
  getToolsByLabel(label: ToolLabel): string[] {
    return Array.from(this.labelCache.entries())
      .filter(([_, toolLabel]) => toolLabel === label)
      .map(([toolId]) => toolId);
  }

  /**
   * Load labels from Edge Config
   */
  async loadLabelsFromConfig(): Promise<void> {
    try {
      // This would fetch from your Edge Config API
      const response = await fetch('/api/edge-config');
      if (response.ok) {
        const config = await response.json();

        // Process tool labels from config
        if (config.toolLabels) {
          Object.entries(config.toolLabels).forEach(([toolId, label]) => {
            if (this.isValidLabel(label as string)) {
              this.labelCache.set(toolId, label as ToolLabel);
            }
          });
        }
      }
    } catch (error) {
      console.error('Failed to load tool labels from Edge Config:', error);
    }
  }

  /**
   * Check if a string is a valid ToolLabel
   */
  private isValidLabel(label: string): boolean {
    return ['popular', 'new', 'coming-soon'].includes(label);
  }

  /**
   * Clear all cached labels
   */
  clearCache(): void {
    this.labelCache.clear();
  }
}

/**
 * Hook to use tool label service
 */
export function useToolLabelService() {
  const service = ToolLabelService.getInstance();

  return {
    getToolLabel: (toolId: string) => service.getToolLabel(toolId),
    setToolLabel: (toolId: string, label: ToolLabel | undefined) =>
      service.setToolLabel(toolId, label),
    getToolsByLabel: (label: ToolLabel) => service.getToolsByLabel(label),
    loadLabels: () => service.loadLabelsFromConfig(),
    clearCache: () => service.clearCache(),
  };
}

// Default tool labels for demonstration
export const DEFAULT_TOOL_LABELS: Record<string, ToolLabel> = {
  'json-formatter': 'popular',
  'base64-encode': 'popular',
  'url-encode': 'coming-soon',
  'hash-generator': 'new',
  'uuid-generator': 'new',
  // Add more as needed
};

/**
 * Hook to get tool label with fallbacks
 */
export function useToolLabel(toolId: string): ToolLabel | undefined {
  const { getToolLabel } = useToolLabelService();

  // Try to get from service first, then fallback to defaults
  return getToolLabel(toolId) || DEFAULT_TOOL_LABELS[toolId];
}
