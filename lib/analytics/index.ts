/**
 * ToolsLab Analytics - Unified API
 *
 * SINGLE SOURCE OF TRUTH for all analytics tracking.
 * No context providers, no hooks - just simple functions.
 *
 * Usage:
 *   import { track, trackToolUse } from '@/lib/analytics';
 *   track('custom-event', { data: 'value' });
 *   trackToolUse('json-formatter', 'format', { success: true });
 */

import { getUmamiAdapter } from './umami/UmamiSDKAdapter';
import { getUmamiSessionTracker } from './umami/UmamiSessionTracker';
import { EventNormalizer } from './core/EventNormalizer';
import type {
  AnalyticsEvent,
  ToolUseEvent,
  UserFavoriteEvent,
  SocialClickEvent,
} from './types/events';

// ============================================================================
// CORE TRACKING FUNCTION
// ============================================================================

/**
 * Track any event - SINGLE entry point for all analytics
 *
 * @example
 * track('custom-event', { action: 'click', value: 123 });
 */
export function track(eventName: string, data?: Record<string, any>): void {
  try {
    const event = EventNormalizer.enrichEvent({
      event: eventName as any,
      sessionId: '',
      ...data,
    } as any);

    getUmamiAdapter().track(event);
    getUmamiSessionTracker()?.incrementEvent();
  } catch (error) {
    // Silent fail - analytics should never break the app
    if (process.env.NODE_ENV === 'development') {
      console.error('[Analytics] Track error:', error);
    }
  }
}

// ============================================================================
// TOOL TRACKING
// ============================================================================

/**
 * Track tool usage - automatically called by toolStore middleware
 *
 * @example
 * trackToolUse('json-formatter', 'format', { success: true, inputSize: 1024 });
 */
export function trackToolUse(
  toolId: string,
  action: string,
  metadata?: Record<string, any>
): void {
  try {
    const session = getUmamiSessionTracker();

    // If error, track as error event
    if (metadata?.error) {
      const errorEvent = EventNormalizer.enrichEvent({
        event: 'tool.error' as const,
        tool: toolId,
        errorType: 'ProcessingError',
        errorMessage: EventNormalizer.truncate(metadata.error, 200),
        inputSize: metadata.inputSize,
        sessionId: '',
      });
      getUmamiAdapter().track(errorEvent);
      return;
    }

    // Track successful use
    const event: ToolUseEvent = EventNormalizer.enrichEvent({
      event: 'tool.use',
      tool: toolId,
      success: metadata?.success !== false,
      inputSize: metadata?.inputSize,
      outputSize: metadata?.outputSize,
      processingTime: metadata?.processingTime,
      sessionId: '',
    });

    getUmamiAdapter().track(event);
    session?.addToolUsed(toolId);
    session?.incrementEvent();
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Analytics] Tool tracking error:', error);
    }
  }
}

/**
 * Track tool error
 */
export function trackToolError(
  toolId: string,
  error: Error | string,
  inputSize?: number
): void {
  try {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorType = typeof error === 'string' ? 'Error' : error.name;

    const event = EventNormalizer.enrichEvent({
      event: 'tool.error' as const,
      tool: toolId,
      errorType,
      errorMessage: EventNormalizer.truncate(errorMessage, 200),
      inputSize,
      sessionId: '',
    });

    getUmamiAdapter().track(event);
  } catch (err) {
    // Silent fail
  }
}

// ============================================================================
// USER ACTIONS
// ============================================================================

/**
 * Track favorite action (tool or category)
 */
export function trackFavorite(
  id: string,
  type: 'tool' | 'category',
  action: 'add' | 'remove',
  totalFavorites?: number
): void {
  try {
    const event: UserFavoriteEvent = EventNormalizer.enrichEvent({
      event: 'user.favorite',
      type,
      id,
      action,
      totalFavorites,
      sessionId: '',
    });

    getUmamiAdapter().track(event);
  } catch (error) {
    // Silent fail
  }
}

/**
 * Track social media click
 */
export function trackSocial(platform: string, from?: string): void {
  try {
    const event: SocialClickEvent = EventNormalizer.enrichEvent({
      event: 'social.click',
      platform,
      from,
      sessionId: '',
    });

    getUmamiAdapter().track(event);
  } catch (error) {
    // Silent fail
  }
}

/**
 * Track copy action
 */
export function trackCopy(toolId: string, outputSize?: number): void {
  try {
    const event = EventNormalizer.enrichEvent({
      event: 'user.copy' as const,
      tool: toolId,
      outputSize,
      sessionId: '',
    });

    getUmamiAdapter().track(event);
  } catch (error) {
    // Silent fail
  }
}

/**
 * Track download action
 */
export function trackDownload(
  toolId: string,
  format: string,
  fileSize?: number
): void {
  try {
    const event = EventNormalizer.enrichEvent({
      event: 'user.download' as const,
      tool: toolId,
      format,
      fileSize,
      sessionId: '',
    });

    getUmamiAdapter().track(event);
  } catch (error) {
    // Silent fail
  }
}

/**
 * Track conversion event (e.g., donation, signup)
 */
export function trackConversion(type: string, from?: string): void {
  try {
    const event = EventNormalizer.enrichEvent({
      event: 'conversion' as const,
      type,
      from,
      sessionId: '',
    });

    getUmamiAdapter().track(event);
  } catch (error) {
    // Silent fail
  }
}

/**
 * Track user engagement (e.g., easter egg, interaction)
 * Referrer and UTM parameters are automatically enriched by EventNormalizer
 */
export function trackEngagement(
  action: string,
  metadata?: Record<string, any>
): void {
  try {
    // Remove is_mobile/isMobile from metadata if present (avoid duplicates)
    const { is_mobile, isMobile, ...cleanMetadata } = metadata || {};

    // Create event - referrer and UTM are auto-enriched by EventNormalizer.enrichEvent()
    const event = EventNormalizer.enrichEvent({
      event: 'engagement' as const,
      action,
      sessionId: '',
      ...cleanMetadata,
    });

    getUmamiAdapter().track(event);
  } catch (error) {
    // Silent fail
  }
}

// ============================================================================
// LAB TRACKING
// ============================================================================

export { trackLabToolSelected } from './helpers/eventHelpers';

// ============================================================================
// AUTO-TRACKING (for toolStore middleware)
// ============================================================================

export { trackToolUsage } from './middleware/toolStoreMiddleware';

// ============================================================================
// ADVANCED (for special cases)
// ============================================================================

/**
 * Get raw access to UmamiAdapter (advanced use only)
 */
export { getUmamiAdapter } from './umami/UmamiSDKAdapter';

/**
 * Get raw access to SessionTracker (advanced use only)
 */
export { getUmamiSessionTracker } from './umami/UmamiSessionTracker';

/**
 * EventNormalizer utilities (advanced use only)
 */
export { EventNormalizer } from './core/EventNormalizer';

/**
 * Types
 */
export type * from './types/events';
