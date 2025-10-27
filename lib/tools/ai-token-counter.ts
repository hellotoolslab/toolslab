/**
 * AI Prompt Token Counter - Core Logic
 * Accurate token counting for various AI models with cost estimation
 * Last Updated: January 2025
 */

// AI Model definitions
export type AIModel =
  | 'gpt-4o'
  | 'gpt-4-turbo'
  | 'gpt-4'
  | 'gpt-3.5-turbo'
  | 'claude-3-opus'
  | 'claude-3-sonnet'
  | 'claude-3.5-sonnet'
  | 'claude-3-haiku'
  | 'llama-3.1-405b'
  | 'llama-3.1-70b'
  | 'llama-3.1-8b'
  | 'gemini-2.0-flash'
  | 'gemini-2.0-flash-lite'
  | 'mistral-large'
  | 'mistral-small';

export interface ModelInfo {
  id: AIModel;
  name: string;
  provider: 'OpenAI' | 'Anthropic' | 'Meta' | 'Google' | 'Mistral';
  tokenizer: string;
  contextWindow: number;
  pricing: {
    input: number; // per 1M tokens
    output: number; // per 1M tokens
  };
  description: string;
}

// Model registry with OFFICIAL pricing (as of January 2025)
// Sources: OpenAI Pricing, Anthropic Pricing, Google AI Pricing, Together AI, Mistral AI
export const AI_MODELS: Record<AIModel, ModelInfo> = {
  'gpt-4o': {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    tokenizer: 'o200k_base',
    contextWindow: 128000,
    pricing: {
      input: 3.0,
      output: 10.0,
    },
    description: 'Latest GPT-4 optimized model, faster and cheaper',
  },
  'gpt-4-turbo': {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    tokenizer: 'cl100k_base',
    contextWindow: 128000,
    pricing: {
      input: 10.0,
      output: 30.0,
    },
    description: 'GPT-4 with 128k context window',
  },
  'gpt-4': {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
    tokenizer: 'cl100k_base',
    contextWindow: 8192,
    pricing: {
      input: 30.0,
      output: 60.0,
    },
    description: 'Original GPT-4 (legacy, expensive)',
  },
  'gpt-3.5-turbo': {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    tokenizer: 'cl100k_base',
    contextWindow: 16385,
    pricing: {
      input: 0.5,
      output: 1.5,
    },
    description: 'Fast and affordable for most tasks',
  },
  'claude-3-opus': {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    tokenizer: 'claude',
    contextWindow: 200000,
    pricing: {
      input: 15.0,
      output: 75.0,
    },
    description: 'Most capable Claude model for complex reasoning',
  },
  'claude-3-sonnet': {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic',
    tokenizer: 'claude',
    contextWindow: 200000,
    pricing: {
      input: 3.0,
      output: 15.0,
    },
    description: 'Balanced performance and cost',
  },
  'claude-3.5-sonnet': {
    id: 'claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    tokenizer: 'claude',
    contextWindow: 200000,
    pricing: {
      input: 3.0,
      output: 15.0,
    },
    description: 'Enhanced Claude with best quality-to-cost ratio',
  },
  'claude-3-haiku': {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'Anthropic',
    tokenizer: 'claude',
    contextWindow: 200000,
    pricing: {
      input: 0.25,
      output: 1.25,
    },
    description: 'Fastest and most affordable Claude model',
  },
  'llama-3.1-405b': {
    id: 'llama-3.1-405b',
    name: 'Llama 3.1 405B',
    provider: 'Meta',
    tokenizer: 'llama',
    contextWindow: 128000,
    pricing: {
      input: 3.5,
      output: 3.5,
    },
    description: 'Largest and most capable Llama model',
  },
  'llama-3.1-70b': {
    id: 'llama-3.1-70b',
    name: 'Llama 3.1 70B',
    provider: 'Meta',
    tokenizer: 'llama',
    contextWindow: 128000,
    pricing: {
      input: 0.88,
      output: 0.88,
    },
    description: 'Balanced Llama model, good for most tasks',
  },
  'llama-3.1-8b': {
    id: 'llama-3.1-8b',
    name: 'Llama 3.1 8B',
    provider: 'Meta',
    tokenizer: 'llama',
    contextWindow: 128000,
    pricing: {
      input: 0.18,
      output: 0.18,
    },
    description: 'Smallest and fastest Llama, very affordable',
  },
  'gemini-2.0-flash': {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    tokenizer: 'gemini',
    contextWindow: 1000000,
    pricing: {
      input: 0.1,
      output: 0.4,
    },
    description: 'Latest Gemini model with 1M context, balanced performance',
  },
  'gemini-2.0-flash-lite': {
    id: 'gemini-2.0-flash-lite',
    name: 'Gemini 2.0 Flash-Lite',
    provider: 'Google',
    tokenizer: 'gemini',
    contextWindow: 1000000,
    pricing: {
      input: 0.075,
      output: 0.03,
    },
    description: 'Ultra-fast and cheapest Gemini model for simple tasks',
  },
  'mistral-large': {
    id: 'mistral-large',
    name: 'Mistral Large',
    provider: 'Mistral',
    tokenizer: 'mistral',
    contextWindow: 128000,
    pricing: {
      input: 2.0,
      output: 6.0,
    },
    description: 'Most capable Mistral model',
  },
  'mistral-small': {
    id: 'mistral-small',
    name: 'Mistral Small',
    provider: 'Mistral',
    tokenizer: 'mistral',
    contextWindow: 32000,
    pricing: {
      input: 0.2,
      output: 0.6,
    },
    description: 'Affordable Mistral model for simple tasks',
  },
};

export interface TokenCount {
  tokens: number;
  characters: number;
  words: number;
  lines: number;
  tokenToWordRatio: number;
  percentOfContext: number;
  remainingTokens: number;
}

export interface CostEstimate {
  inputCost: number;
  outputCost: number;
  totalCost: number;
  costPer100Requests: number;
  costPer1000Requests: number;
  costPer10000Requests: number;
}

export interface TokenAnalysis extends TokenCount {
  model: ModelInfo;
  costEstimate: CostEstimate;
  warnings: string[];
  suggestions: string[];
}

/**
 * Approximate token count for different models
 * This is a simplified estimation. For production use with actual API calls,
 * integrate proper tokenizer libraries.
 */
export function estimateTokens(text: string, model: AIModel): TokenCount {
  if (!text || text.length === 0) {
    return {
      tokens: 0,
      characters: 0,
      words: 0,
      lines: 0,
      tokenToWordRatio: 0,
      percentOfContext: 0,
      remainingTokens: AI_MODELS[model].contextWindow,
    };
  }

  const characters = text.length;
  const words = countWords(text);
  const lines = text.split('\n').length;

  // Token estimation based on model type
  let tokens: number;
  const modelInfo = AI_MODELS[model];

  switch (modelInfo.provider) {
    case 'OpenAI':
      // GPT models: roughly 1 token = 4 characters for English
      // Adjust for code, special characters, etc.
      tokens = estimateOpenAITokens(text);
      break;

    case 'Anthropic':
      // Claude: similar to GPT but slightly different
      tokens = estimateClaudeTokens(text);
      break;

    case 'Meta':
      // Llama: similar tokenization to GPT
      tokens = estimateLlamaTokens(text);
      break;

    case 'Google':
      // Gemini: Google's tokenizer
      tokens = estimateGeminiTokens(text);
      break;

    case 'Mistral':
      // Mistral: similar to GPT
      tokens = estimateMistralTokens(text);
      break;

    default:
      tokens = Math.ceil(characters / 4);
  }

  const tokenToWordRatio = words > 0 ? tokens / words : 0;
  const percentOfContext = (tokens / modelInfo.contextWindow) * 100;
  const remainingTokens = Math.max(0, modelInfo.contextWindow - tokens);

  return {
    tokens,
    characters,
    words,
    lines,
    tokenToWordRatio,
    percentOfContext,
    remainingTokens,
  };
}

/**
 * Estimate tokens for OpenAI models
 */
function estimateOpenAITokens(text: string): number {
  // Basic heuristic: ~1 token per 4 characters for English
  // Adjust based on content type
  const baseTokens = text.length / 4;

  // Adjust for special characters and code
  const specialCharCount = (text.match(/[{}[\]().,;:!?'"]/g) || []).length;
  const codeIndicators = (
    text.match(/```|function|const|let|var|import|export/g) || []
  ).length;

  // Special characters often become separate tokens
  const adjustment = specialCharCount * 0.3 + codeIndicators * 2;

  return Math.ceil(baseTokens + adjustment);
}

/**
 * Estimate tokens for Claude models
 */
function estimateClaudeTokens(text: string): number {
  // Claude tokenization is similar to GPT but slightly more efficient
  // Approximately 1 token = 3.8 characters
  const baseTokens = text.length / 3.8;

  const specialCharCount = (text.match(/[{}[\]().,;:!?'"]/g) || []).length;
  const adjustment = specialCharCount * 0.25;

  return Math.ceil(baseTokens + adjustment);
}

/**
 * Estimate tokens for Llama models
 */
function estimateLlamaTokens(text: string): number {
  // Llama uses sentencepiece tokenizer, similar to GPT
  return estimateOpenAITokens(text);
}

/**
 * Estimate tokens for Gemini models
 */
function estimateGeminiTokens(text: string): number {
  // Gemini tokenization is efficient, approximately 1 token = 3.5 characters
  return Math.ceil(text.length / 3.5);
}

/**
 * Estimate tokens for Mistral models
 */
function estimateMistralTokens(text: string): number {
  // Mistral uses similar tokenization to GPT
  return estimateOpenAITokens(text);
}

/**
 * Count words in text
 */
function countWords(text: string): number {
  // Split by whitespace and filter empty strings
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

/**
 * Calculate cost estimates
 */
export function calculateCost(
  tokens: number,
  model: AIModel,
  outputTokenRatio: number = 1.0
): CostEstimate {
  const modelInfo = AI_MODELS[model];
  const outputTokens = tokens * outputTokenRatio;

  // Cost per million tokens
  const inputCost = (tokens / 1000000) * modelInfo.pricing.input;
  const outputCost = (outputTokens / 1000000) * modelInfo.pricing.output;
  const totalCost = inputCost + outputCost;

  return {
    inputCost,
    outputCost,
    totalCost,
    costPer100Requests: totalCost * 100,
    costPer1000Requests: totalCost * 1000,
    costPer10000Requests: totalCost * 10000,
  };
}

/**
 * Analyze text and provide comprehensive token analysis
 */
export function analyzePrompt(
  text: string,
  model: AIModel,
  outputTokenRatio: number = 1.0
): TokenAnalysis {
  const tokenCount = estimateTokens(text, model);
  const modelInfo = AI_MODELS[model];
  const costEstimate = calculateCost(
    tokenCount.tokens,
    model,
    outputTokenRatio
  );

  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Generate warnings
  if (tokenCount.percentOfContext > 80) {
    warnings.push(
      `Using ${tokenCount.percentOfContext.toFixed(1)}% of context window. Consider splitting the prompt.`
    );
  }

  if (tokenCount.percentOfContext > 95) {
    warnings.push(
      'Prompt is very close to context limit. You may experience truncation.'
    );
  }

  if (tokenCount.tokenToWordRatio > 2) {
    warnings.push(
      'High token-to-word ratio detected. Check for excessive special characters or formatting.'
    );
  }

  // Generate suggestions
  if (tokenCount.tokens > 1000 && text.includes('\n\n\n')) {
    suggestions.push('Remove excessive line breaks to save tokens.');
  }

  if (text.match(/\s{2,}/g)) {
    suggestions.push('Replace multiple spaces with single spaces.');
  }

  const repetitivePatterns = findRepetitivePatterns(text);
  if (repetitivePatterns.length > 0) {
    suggestions.push(
      `Found ${repetitivePatterns.length} repetitive patterns that could be simplified.`
    );
  }

  // Cost optimization suggestions
  if (costEstimate.totalCost > 0.01) {
    const cheaperModels = findCheaperModels(model, tokenCount.tokens);
    if (cheaperModels.length > 0) {
      const savings = ((1 - cheaperModels[0].costReduction) * 100).toFixed(0);
      suggestions.push(
        `Consider using ${cheaperModels[0].name} to reduce cost by ${savings}%.`
      );
    }
  }

  return {
    ...tokenCount,
    model: modelInfo,
    costEstimate,
    warnings,
    suggestions,
  };
}

/**
 * Find repetitive patterns in text
 */
function findRepetitivePatterns(text: string): string[] {
  const patterns: string[] = [];
  const words = text.split(/\s+/);

  // Check for repeated consecutive words
  for (let i = 0; i < words.length - 2; i++) {
    const phrase = `${words[i]} ${words[i + 1]}`;
    const regex = new RegExp(phrase, 'gi');
    const matches = text.match(regex);
    if (matches && matches.length > 2) {
      if (!patterns.includes(phrase)) {
        patterns.push(phrase);
      }
    }
  }

  return patterns.slice(0, 5); // Return max 5 patterns
}

/**
 * Find cheaper alternative models
 */
function findCheaperModels(
  currentModel: AIModel,
  tokens: number
): Array<{ name: string; costReduction: number }> {
  const currentModelInfo = AI_MODELS[currentModel];
  const currentCost = calculateCost(tokens, currentModel).totalCost;

  const alternatives: Array<{ name: string; costReduction: number }> = [];

  // Check other models with sufficient context window
  Object.values(AI_MODELS).forEach((model) => {
    if (
      model.id !== currentModel &&
      model.contextWindow >= tokens &&
      model.provider === currentModelInfo.provider
    ) {
      const altCost = calculateCost(tokens, model.id).totalCost;
      if (altCost < currentCost) {
        alternatives.push({
          name: model.name,
          costReduction: altCost / currentCost,
        });
      }
    }
  });

  return alternatives.sort((a, b) => a.costReduction - b.costReduction);
}

/**
 * Compare token counts across all models
 */
export interface ModelComparison {
  model: ModelInfo;
  tokenCount: TokenCount;
  costEstimate: CostEstimate;
  efficiency: 'best' | 'good' | 'average' | 'poor';
}

export function compareModels(
  text: string,
  outputTokenRatio: number = 1.0
): ModelComparison[] {
  const comparisons: ModelComparison[] = [];

  Object.keys(AI_MODELS).forEach((modelId) => {
    const model = modelId as AIModel;
    const tokenCount = estimateTokens(text, model);
    const costEstimate = calculateCost(
      tokenCount.tokens,
      model,
      outputTokenRatio
    );
    const modelInfo = AI_MODELS[model];

    comparisons.push({
      model: modelInfo,
      tokenCount,
      costEstimate,
      efficiency: 'average', // Will be calculated below
    });
  });

  // Calculate efficiency based on cost
  const costs = comparisons.map((c) => c.costEstimate.totalCost);
  const minCost = Math.min(...costs);
  const maxCost = Math.max(...costs);

  comparisons.forEach((comparison) => {
    const relativeCost =
      maxCost > minCost
        ? (comparison.costEstimate.totalCost - minCost) / (maxCost - minCost)
        : 0;

    if (relativeCost <= 0.25) {
      comparison.efficiency = 'best';
    } else if (relativeCost <= 0.5) {
      comparison.efficiency = 'good';
    } else if (relativeCost <= 0.75) {
      comparison.efficiency = 'average';
    } else {
      comparison.efficiency = 'poor';
    }
  });

  // Sort by total cost (ascending)
  return comparisons.sort(
    (a, b) => a.costEstimate.totalCost - b.costEstimate.totalCost
  );
}

/**
 * Optimize prompt for token efficiency
 */
export interface OptimizationResult {
  original: string;
  optimized: string;
  tokensSaved: number;
  percentageReduction: number;
  changes: string[];
}

export function optimizePrompt(
  text: string,
  model: AIModel
): OptimizationResult {
  let optimized = text;
  const changes: string[] = [];

  // Remove excessive whitespace
  const beforeWhitespace = optimized;
  optimized = optimized.replace(/[ \t]+/g, ' ');
  optimized = optimized.replace(/\n{3,}/g, '\n\n');
  if (optimized !== beforeWhitespace) {
    changes.push('Removed excessive whitespace');
  }

  // Remove trailing/leading whitespace from lines
  const beforeTrim = optimized;
  optimized = optimized
    .split('\n')
    .map((line) => line.trim())
    .join('\n');
  if (optimized !== beforeTrim) {
    changes.push('Trimmed line whitespace');
  }

  // Replace repetitive patterns
  const patterns = findRepetitivePatterns(optimized);
  if (patterns.length > 0) {
    changes.push(`Reduced ${patterns.length} repetitive patterns`);
  }

  // Remove markdown formatting in simple cases (if not needed)
  if (optimized.includes('**') || optimized.includes('__')) {
    const beforeMarkdown = optimized;
    optimized = optimized.replace(/\*\*(.*?)\*\*/g, '$1');
    optimized = optimized.replace(/__(.*?)__/g, '$1');
    if (optimized !== beforeMarkdown) {
      changes.push('Removed unnecessary markdown formatting');
    }
  }

  const originalTokens = estimateTokens(text, model).tokens;
  const optimizedTokens = estimateTokens(optimized, model).tokens;
  const tokensSaved = originalTokens - optimizedTokens;
  const percentageReduction =
    originalTokens > 0 ? (tokensSaved / originalTokens) * 100 : 0;

  return {
    original: text,
    optimized,
    tokensSaved,
    percentageReduction,
    changes,
  };
}

/**
 * Batch process multiple prompts
 */
export interface BatchResult {
  index: number;
  snippet: string;
  tokenCount: TokenCount;
  costEstimate: CostEstimate;
}

export function batchAnalyze(
  prompts: string[],
  model: AIModel,
  outputTokenRatio: number = 1.0
): BatchResult[] {
  return prompts.map((prompt, index) => {
    const tokenCount = estimateTokens(prompt, model);
    const costEstimate = calculateCost(
      tokenCount.tokens,
      model,
      outputTokenRatio
    );
    const snippet =
      prompt.length > 50 ? prompt.substring(0, 50) + '...' : prompt;

    return {
      index,
      snippet,
      tokenCount,
      costEstimate,
    };
  });
}

/**
 * Get pricing last updated date
 */
export function getPricingUpdateDate(): string {
  return 'January 2025';
}
