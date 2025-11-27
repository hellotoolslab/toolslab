// Analytics Event Types for ToolsLab

export type UserLevel = 'first_time' | 'returning' | 'power';

export type EventName =
  | 'page_view' // Changed from 'pageview' - may conflict with Umami auto-tracking
  | 'tool.use'
  | 'tool.error'
  | 'user.copy'
  | 'user.download'
  | 'user.favorite'
  | 'session.start'
  | 'session.tab_hidden'
  | 'session.tab_visible'
  | 'session.end'
  | 'chain.start'
  | 'chain.step'
  | 'chain.complete'
  | 'lab.tool_selected'
  | 'social.click'
  | 'conversion'
  | 'engagement';

export interface BaseEventMetadata {
  // Session
  sessionId: string;

  // Locale
  locale?: string;

  // User context
  userLevel?: UserLevel;

  // Device
  viewport?: string;
  isMobile?: boolean;

  // Timestamp (optional)
  // UNIX timestamp in milliseconds - will be converted to seconds before sending to Umami
  // If provided, Umami will record the event with this timestamp instead of server time
  timestamp?: number;

  // Custom metadata
  [key: string]: any;
}

export interface PageviewEvent extends BaseEventMetadata {
  event: 'page_view';
  page: string; // Normalized page ID (e.g., 'tool:json-formatter')
  referrer?: string;
  // UTM Parameters (marketing attribution)
  utmSource?: string; // e.g., 'google', 'facebook', 'newsletter'
  utmMedium?: string; // e.g., 'cpc', 'email', 'social', 'organic'
  utmCampaign?: string; // e.g., 'summer-sale-2024'
  utmContent?: string; // e.g., 'banner-top', 'link-footer'
  utmTerm?: string; // e.g., 'json formatter', 'base64 encoder'
}

export interface ToolUseEvent extends BaseEventMetadata {
  event: 'tool.use';
  tool: string;
  inputSize?: number; // bytes
  outputSize?: number; // bytes
  processingTime?: number; // milliseconds
  success: boolean;
  // Attribution (auto-enriched by EventNormalizer)
  referrer?: string; // e.g., 'chatgpt.com', 'google.com'
  utmSource?: string; // e.g., 'chatgpt', 'google', 'newsletter'
  utmMedium?: string; // e.g., 'referral', 'organic', 'social'
  utmCampaign?: string; // e.g., 'ai-tools-2024'
  utmContent?: string;
  utmTerm?: string;
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
  totalFavorites?: number; // Total favorites after this action
}

export interface SessionStartEvent extends BaseEventMetadata {
  event: 'session.start';
  isReturningUser: boolean; // Based on localStorage presence
  previousSessionCount?: number; // Number of previous sessions
  daysSinceLastVisit?: number; // Days since last session
  referrer?: string; // Where the user came from
  entryPage: string; // First page of the session
}

export interface SessionTabHiddenEvent extends BaseEventMetadata {
  event: 'session.tab_hidden';
  visibleDuration: number; // How long tab was visible before hiding (ms)
  currentPage: string; // Page user was on when hiding
}

export interface SessionTabVisibleEvent extends BaseEventMetadata {
  event: 'session.tab_visible';
  hiddenDuration: number; // How long tab was hidden (ms)
  currentPage: string; // Page user returned to
}

export interface SessionEndEvent extends BaseEventMetadata {
  event: 'session.end';
  duration: number; // total milliseconds
  activeDuration: number; // duration excluding hidden time
  pageViews: number;
  eventsCount: number;
  toolsUsed: number;
  toolsList?: string[];
  tabHiddenCount: number; // Number of times user hid the tab
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

export interface LabToolSelectedEvent extends BaseEventMetadata {
  event: 'lab.tool_selected';
  toolId: string;
}

export interface SocialClickEvent extends BaseEventMetadata {
  event: 'social.click';
  platform: string;
  from?: string;
}

export interface ConversionEvent extends BaseEventMetadata {
  event: 'conversion';
  type: string; // e.g., 'donation', 'signup'
  from?: string; // Where conversion was triggered
}

export interface EngagementEvent extends BaseEventMetadata {
  event: 'engagement';
  action: string; // e.g., 'easter-egg-discovered', 'tool-page-viewed'
  // Attribution (auto-enriched by EventNormalizer)
  referrer?: string; // e.g., 'chatgpt.com', 'google.com'
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
}

export type AnalyticsEvent =
  | PageviewEvent
  | ToolUseEvent
  | ToolErrorEvent
  | UserCopyEvent
  | UserDownloadEvent
  | UserFavoriteEvent
  | SessionStartEvent
  | SessionTabHiddenEvent
  | SessionTabVisibleEvent
  | SessionEndEvent
  | ChainStartEvent
  | ChainStepEvent
  | ChainCompleteEvent
  | LabToolSelectedEvent
  | SocialClickEvent
  | ConversionEvent
  | EngagementEvent;

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
