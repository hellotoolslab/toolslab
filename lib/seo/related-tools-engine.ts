/**
 * Related Tools Engine
 *
 * Intelligent algorithm for suggesting related tools based on:
 * - Semantic relationships (categories, workflows)
 * - Link distribution (boost under-linked tools)
 * - User experience (include some popular tools)
 *
 * Goal: Eliminate orphan pages while maintaining relevance
 */

import { tools, getToolById } from '@/lib/tools';
import {
  toolRelationships,
  getAllRelatedTools,
  needsBoost,
  getBoostTools,
} from './tool-relationships';
import { internalLinkingConfig } from './internal-linking-config';

export interface RelatedToolsConfig {
  toolId: string;
  count?: number; // Number of related tools to return (default: 4)
  strategy?: 'semantic' | 'category' | 'mixed'; // Strategy to use
  excludeTools?: string[]; // Tools to exclude from suggestions
}

export interface ScoredTool {
  id: string;
  score: number;
  reasons: string[]; // Why this tool was suggested
}

export class RelatedToolsEngine {
  private linkCounts: Map<string, number> = new Map();

  constructor() {
    // Initialize link counts (in real implementation, would load from audit)
    this.initializeLinkCounts();
  }

  /**
   * Initialize link counts for all tools
   * In production, this should load from actual link audit data
   */
  private initializeLinkCounts() {
    tools.forEach((tool) => {
      // Estimate based on popularity and category
      let estimatedLinks = 5; // baseline

      if (tool.label === 'popular') estimatedLinks += 3;
      if (tool.label === 'popular') estimatedLinks += 2;

      // Boost tools get fewer initial links (they're orphans)
      if (needsBoost(tool.id)) {
        estimatedLinks = Math.max(1, estimatedLinks - 3);
      }

      this.linkCounts.set(tool.id, estimatedLinks);
    });
  }

  /**
   * Get related tools for a given tool ID
   */
  public getRelatedTools(config: RelatedToolsConfig | string): string[] {
    // Allow simple string input for backward compatibility
    const toolConfig: RelatedToolsConfig =
      typeof config === 'string' ? { toolId: config } : config;

    const {
      toolId,
      count = internalLinkingConfig.relatedToolsPerPage,
      strategy = 'mixed',
      excludeTools = [],
    } = toolConfig;

    const sourceTool = getToolById(toolId);
    if (!sourceTool) {
      console.warn(`Tool not found: ${toolId}`);
      return [];
    }

    // Score all potential related tools
    const scoredTools = this.scoreAllTools(
      toolId,
      sourceTool.categories,
      strategy,
      excludeTools
    );

    // Sort by score (highest first)
    scoredTools.sort((a, b) => b.score - a.score);

    // Return top N tools
    return scoredTools.slice(0, count).map((t) => t.id);
  }

  /**
   * Score all tools for relevance to source tool
   */
  private scoreAllTools(
    sourceToolId: string,
    sourceCategories: string[],
    strategy: string,
    excludeTools: string[]
  ): ScoredTool[] {
    const scored: ScoredTool[] = [];

    tools.forEach((tool) => {
      // Skip self and excluded tools
      if (tool.id === sourceToolId || excludeTools.includes(tool.id)) {
        return;
      }

      const score = this.calculateScore(
        sourceToolId,
        tool.id,
        sourceCategories,
        tool.categories,
        strategy
      );

      if (score.score > 0) {
        scored.push(score);
      }
    });

    return scored;
  }

  /**
   * Calculate relevance score for a tool
   */
  private calculateScore(
    sourceToolId: string,
    targetToolId: string,
    sourceCategories: string[],
    targetCategories: string[],
    strategy: string
  ): ScoredTool {
    let score = 0;
    const reasons: string[] = [];
    const weights = internalLinkingConfig.weights;

    // 1. Same Category Score (40%)
    const categoriesMatch = sourceCategories.some((cat) =>
      targetCategories.includes(cat)
    );
    if (categoriesMatch) {
      const categoryScore = weights.sameCategory * 100;
      score += categoryScore;
      reasons.push('Same category');
    }

    // 2. Workflow Score (30%)
    const relationship = toolRelationships[sourceToolId];
    if (relationship) {
      if (relationship.workflow?.includes(targetToolId)) {
        const workflowScore = weights.workflow * 100;
        score += workflowScore;
        reasons.push('Workflow relationship');
      } else if (relationship.complementary?.includes(targetToolId)) {
        const compScore = weights.workflow * 80; // Slightly lower than direct workflow
        score += compScore;
        reasons.push('Complementary tool');
      } else if (relationship.alternatives?.includes(targetToolId)) {
        const altScore = weights.workflow * 60; // Even lower for alternatives
        score += altScore;
        reasons.push('Alternative format');
      }
    }

    // 3. Under-linked Boost Score (20%)
    const targetLinkCount = this.linkCounts.get(targetToolId) || 0;
    if (targetLinkCount < internalLinkingConfig.thresholds.underlinked) {
      const boostScore = weights.underlinked * 100;
      score += boostScore;
      reasons.push('Needs visibility boost');

      // Extra boost for critical orphans
      if (needsBoost(targetToolId)) {
        score += weights.underlinked * 50; // Extra 50% boost
        reasons.push('Critical orphan');
      }
    }

    // 4. Popular Tools Score (10%)
    const targetTool = getToolById(targetToolId);
    if (targetTool?.label === 'popular') {
      const popScore = weights.popular * 100;
      score += popScore;
      reasons.push('Popular tool');
    }

    // Penalty for over-linked tools
    if (targetLinkCount > internalLinkingConfig.thresholds.overlinked) {
      score *= 0.5; // 50% penalty
      reasons.push('Over-linked (penalty)');
    }

    return {
      id: targetToolId,
      score,
      reasons,
    };
  }

  /**
   * Get debug information about scoring
   */
  public getRelatedToolsWithScores(
    toolId: string,
    count: number = 10
  ): ScoredTool[] {
    const sourceTool = getToolById(toolId);
    if (!sourceTool) return [];

    const scoredTools = this.scoreAllTools(
      toolId,
      sourceTool.categories,
      'mixed',
      []
    );

    scoredTools.sort((a, b) => b.score - a.score);

    return scoredTools.slice(0, count);
  }

  /**
   * Update link count for a tool (useful for testing)
   */
  public updateLinkCount(toolId: string, count: number) {
    this.linkCounts.set(toolId, count);
  }

  /**
   * Get link count for a tool
   */
  public getLinkCount(toolId: string): number {
    return this.linkCounts.get(toolId) || 0;
  }
}

// Singleton instance
let engineInstance: RelatedToolsEngine | null = null;

/**
 * Get singleton instance of RelatedToolsEngine
 */
export function getRelatedToolsEngine(): RelatedToolsEngine {
  if (!engineInstance) {
    engineInstance = new RelatedToolsEngine();
  }
  return engineInstance;
}

/**
 * Helper function for quick access
 */
export function getSmartRelatedTools(toolId: string, count?: number): string[] {
  const engine = getRelatedToolsEngine();
  return engine.getRelatedTools({ toolId, count });
}
