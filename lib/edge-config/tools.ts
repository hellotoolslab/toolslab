/**
 * Tool-specific Edge Config functions
 * Core business logic for managing tool configurations
 */

import {
  ToolConfig,
  CategoryConfig,
  ToolConfigOptions,
  UserPlan,
  ToolAccessResult,
  EdgeConfigResult,
} from './types';
import { getCompleteConfig, withPerformanceMonitoring } from './client';
import { DEFAULT_TOOLS, DEFAULT_CATEGORIES, CORE_TOOL_SLUGS } from './defaults';

/**
 * Retrieves all tool configurations
 */
export const getToolsConfig = withPerformanceMonitoring(
  async (): Promise<EdgeConfigResult<Record<string, ToolConfig>>> => {
    const result = await getCompleteConfig();

    if (!result.success) {
      return {
        success: false,
        error: result.error,
        fallback: DEFAULT_TOOLS,
        responseTime: result.responseTime,
      };
    }

    return {
      success: true,
      data: result.data.tools,
      source: result.source,
      responseTime: result.responseTime,
    };
  },
  'getToolsConfig'
);

/**
 * Retrieves enabled tools with filtering and sorting
 */
export const getEnabledTools = withPerformanceMonitoring(
  async (options: ToolConfigOptions = {}): Promise<ToolConfig[]> => {
    const result = await getToolsConfig();
    const tools = result.success
      ? result.data
      : result.fallback || DEFAULT_TOOLS;

    let filteredTools = Object.values(tools);

    // Filter by enabled status (default: only enabled)
    if (options.enabled !== false && !options.includeDisabled) {
      filteredTools = filteredTools.filter((tool) => tool.enabled);
    }

    // Filter by featured status
    if (options.featured !== undefined) {
      filteredTools = filteredTools.filter(
        (tool) => tool.featured === options.featured
      );
    }

    // Filter by category
    if (options.category) {
      filteredTools = filteredTools.filter(
        (tool) => tool.category === options.category
      );
    }

    // Sort tools
    const sortBy = options.sortBy || 'order';
    const sortDirection = options.sortDirection || 'asc';

    filteredTools.sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'searchVolume':
          aValue = a.searchVolume || 0;
          bValue = b.searchVolume || 0;
          break;
        case 'monthlyUsers':
          aValue = a.metadata.monthlyUsers || 0;
          bValue = b.metadata.monthlyUsers || 0;
          break;
        case 'order':
        default:
          aValue = a.order;
          bValue = b.order;
          break;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      const comparison = (aValue as number) - (bValue as number);
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    // Apply limit
    if (options.limit && options.limit > 0) {
      filteredTools = filteredTools.slice(0, options.limit);
    }

    return filteredTools;
  },
  'getEnabledTools'
);

/**
 * Retrieves featured tools for homepage
 */
export const getFeaturedTools = withPerformanceMonitoring(
  async (limit?: number): Promise<ToolConfig[]> => {
    const result = await getCompleteConfig();
    const maxFeatured = result.success
      ? result.data.settings.maxFeaturedTools
      : 6;

    return getEnabledTools({
      featured: true,
      sortBy: 'order',
      limit: limit || maxFeatured,
    });
  },
  'getFeaturedTools'
);

/**
 * Retrieves a single tool by slug
 */
export const getToolBySlug = withPerformanceMonitoring(
  async (slug: string): Promise<ToolConfig | null> => {
    const result = await getToolsConfig();
    const tools = result.success
      ? result.data
      : result.fallback || DEFAULT_TOOLS;

    const tool = Object.values(tools).find((t) => t.slug === slug);
    return tool || null;
  },
  'getToolBySlug'
);

/**
 * Retrieves tools by category
 */
export const getToolsByCategory = withPerformanceMonitoring(
  async (
    category: string,
    options: Omit<ToolConfigOptions, 'category'> = {}
  ): Promise<ToolConfig[]> => {
    return getEnabledTools({
      ...options,
      category,
    });
  },
  'getToolsByCategory'
);

/**
 * Retrieves popular tools based on usage metrics
 */
export const getPopularTools = withPerformanceMonitoring(
  async (limit: number = 10): Promise<ToolConfig[]> => {
    return getEnabledTools({
      sortBy: 'monthlyUsers',
      sortDirection: 'desc',
      limit,
    });
  },
  'getPopularTools'
);

/**
 * Retrieves trending tools (marked with isTrending flag)
 */
export const getTrendingTools = withPerformanceMonitoring(
  async (limit: number = 5): Promise<ToolConfig[]> => {
    const tools = await getEnabledTools();
    const trendingTools = tools.filter((tool) => tool.flags.isTrending);

    return trendingTools
      .sort(
        (a, b) =>
          (b.metadata.monthlyUsers || 0) - (a.metadata.monthlyUsers || 0)
      )
      .slice(0, limit);
  },
  'getTrendingTools'
);

/**
 * Retrieves new tools (marked with isNew flag)
 */
export const getNewTools = withPerformanceMonitoring(
  async (limit: number = 3): Promise<ToolConfig[]> => {
    const tools = await getEnabledTools();
    const newTools = tools.filter((tool) => tool.flags.isNew);

    return newTools
      .sort(
        (a, b) =>
          new Date(b.metadata.lastUpdated).getTime() -
          new Date(a.metadata.lastUpdated).getTime()
      )
      .slice(0, limit);
  },
  'getNewTools'
);

/**
 * Retrieves all category configurations
 */
export const getCategoriesConfig = withPerformanceMonitoring(
  async (): Promise<Record<string, CategoryConfig>> => {
    const result = await getCompleteConfig();

    if (!result.success) {
      return DEFAULT_CATEGORIES;
    }

    return result.data.categories;
  },
  'getCategoriesConfig'
);

/**
 * Retrieves enabled categories
 */
export const getEnabledCategories = withPerformanceMonitoring(
  async (): Promise<CategoryConfig[]> => {
    const categories = await getCategoriesConfig();

    return Object.values(categories)
      .filter((category) => category.enabled)
      .sort((a, b) => a.order - b.order);
  },
  'getEnabledCategories'
);

/**
 * Checks if a user can access a specific tool
 */
export const canUserAccessTool = withPerformanceMonitoring(
  async (
    toolSlug: string,
    userPlan: UserPlan = {
      type: 'free',
      features: [],
      limits: { dailyRequests: 1000, concurrentRequests: 5 },
    }
  ): Promise<ToolAccessResult> => {
    const tool = await getToolBySlug(toolSlug);

    if (!tool) {
      return {
        canAccess: false,
        reason: 'not_found',
        message: 'Tool not found',
      };
    }

    if (!tool.enabled) {
      return {
        canAccess: false,
        reason: 'tool_disabled',
        message: 'This tool is currently disabled',
      };
    }

    if (tool.flags.isMaintenance) {
      return {
        canAccess: false,
        reason: 'maintenance',
        message: 'This tool is under maintenance',
      };
    }

    if (tool.flags.isPro && userPlan.type !== 'pro') {
      return {
        canAccess: false,
        reason: 'pro_required',
        message: 'This tool requires a Pro subscription',
      };
    }

    return {
      canAccess: true,
    };
  },
  'canUserAccessTool'
);

/**
 * Gets tools for static generation (generateStaticParams)
 */
export const getToolsForStaticGeneration = withPerformanceMonitoring(
  async (): Promise<string[]> => {
    const tools = await getEnabledTools({ includeDisabled: false });

    // Always include core tools even if they're temporarily disabled
    const coreTools = CORE_TOOL_SLUGS.filter(
      (slug) => !tools.find((tool) => tool.slug === slug)
    );

    const allSlugs = [...tools.map((tool) => tool.slug), ...coreTools];

    return [...new Set(allSlugs)]; // Remove duplicates
  },
  'getToolsForStaticGeneration'
);

/**
 * Searches tools by name, description, or keywords
 */
export const searchTools = withPerformanceMonitoring(
  async (query: string, limit: number = 10): Promise<ToolConfig[]> => {
    const tools = await getEnabledTools();
    const searchTerms = query
      .toLowerCase()
      .split(' ')
      .filter((term) => term.length > 0);

    if (searchTerms.length === 0) {
      return [];
    }

    const scoredTools = tools.map((tool) => {
      let score = 0;
      const searchableText = [
        tool.name,
        tool.description,
        tool.longDescription || '',
        ...(tool.metadata.keywords || []),
      ]
        .join(' ')
        .toLowerCase();

      searchTerms.forEach((term) => {
        // Exact matches in name get highest score
        if (tool.name.toLowerCase().includes(term)) {
          score += 10;
        }

        // Partial matches in description
        if (tool.description.toLowerCase().includes(term)) {
          score += 5;
        }

        // Keyword matches
        if (
          tool.metadata.keywords?.some((keyword) =>
            keyword.toLowerCase().includes(term)
          )
        ) {
          score += 3;
        }

        // General text matches
        if (searchableText.includes(term)) {
          score += 1;
        }
      });

      return { tool, score };
    });

    return scoredTools
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ tool }) => tool);
  },
  'searchTools'
);

/**
 * Gets related tools based on category and usage patterns
 */
export const getRelatedTools = withPerformanceMonitoring(
  async (toolSlug: string, limit: number = 4): Promise<ToolConfig[]> => {
    const currentTool = await getToolBySlug(toolSlug);
    if (!currentTool) {
      return [];
    }

    // Get tools from the same category
    const categoryTools = await getToolsByCategory(currentTool.category, {
      limit: limit + 1, // +1 because we'll filter out current tool
    });

    // Remove current tool and limit results
    const relatedTools = categoryTools
      .filter((tool) => tool.slug !== toolSlug)
      .slice(0, limit);

    // If we don't have enough tools from the same category, fill with popular tools
    if (relatedTools.length < limit) {
      const popularTools = await getPopularTools(limit * 2);
      const additionalTools = popularTools
        .filter(
          (tool) =>
            tool.slug !== toolSlug &&
            !relatedTools.find((rt) => rt.slug === tool.slug)
        )
        .slice(0, limit - relatedTools.length);

      relatedTools.push(...additionalTools);
    }

    return relatedTools;
  },
  'getRelatedTools'
);
