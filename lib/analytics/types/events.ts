// Analytics Event Types for ToolsLab

export type UserLevel = 'first_time' | 'returning' | 'power';

export type EventName =
  | 'pageview'
  | 'tool.use'
  | 'tool.error'
  | 'user.copy'
  | 'user.download'
  | 'user.favorite'
  | 'session.end'
  | 'chain.start'
  | 'chain.step'
  | 'chain.complete';

export interface BaseEventMetadata {
  // Timestamp
  timestamp: number;

  // Session
  sessionId: string;

  // Locale
  locale?: string;

  // User context
  userLevel?: UserLevel;

  // Device
  viewport?: string;
  isMobile?: boolean;

  // Custom metadata
  [key: string]: any;
}

export interface PageviewEvent extends BaseEventMetadata {
  event: 'pageview';
  page: string; // Normalized page ID (e.g., 'tool:json-formatter')
  referrer?: string;
}

export interface ToolUseEvent extends BaseEventMetadata {
  event: 'tool.use';
  tool: string;
  inputSize?: number; // bytes
  outputSize?: number; // bytes
  processingTime?: number; // milliseconds
  success: boolean;
}

export interface ToolErrorEvent extends BaseEventMetadata {
  event: 'tool.error';
  tool: string;
  errorType: string;
  errorMessage?: string;
  inputSize?: number;
}

export interface UserCopyEvent extends BaseEventMetadata {
  event: 'user.copy';
  tool: string;
  outputSize?: number;
}

export interface UserDownloadEvent extends BaseEventMetadata {
  event: 'user.download';
  tool: string;
  format: string;
  fileSize?: number;
}

export interface UserFavoriteEvent extends BaseEventMetadata {
  event: 'user.favorite';
  type: 'tool' | 'category';
  id: string;
  action: 'add' | 'remove';
}

export interface SessionEndEvent extends BaseEventMetadata {
  event: 'session.end';
  duration: number; // total milliseconds
  pageViews: number;
  eventsCount: number;
  toolsUsed: number;
  toolsList?: string[];
}

export interface ChainStartEvent extends BaseEventMetadata {
  event: 'chain.start';
  startTool: string;
}

export interface ChainStepEvent extends BaseEventMetadata {
  event: 'chain.step';
  chainId: string;
  fromTool: string;
  toTool: string;
  stepNumber: number;
}

export interface ChainCompleteEvent extends BaseEventMetadata {
  event: 'chain.complete';
  chainId: string;
  totalSteps: number;
  toolsChain: string[];
  totalDuration: number;
}

export type AnalyticsEvent =
  | PageviewEvent
  | ToolUseEvent
  | ToolErrorEvent
  | UserCopyEvent
  | UserDownloadEvent
  | UserFavoriteEvent
  | SessionEndEvent
  | ChainStartEvent
  | ChainStepEvent
  | ChainCompleteEvent;

// Event batch for sending multiple events at once
export interface EventBatch {
  events: AnalyticsEvent[];
  batchId: string;
  timestamp: number;
}

// Delivery methods
export type DeliveryMethod = 'beacon' | 'fetch' | 'umami' | 'none';

// Delivery result
export interface DeliveryResult {
  success: boolean;
  method: DeliveryMethod;
  error?: string;
  retryCount?: number;
}
