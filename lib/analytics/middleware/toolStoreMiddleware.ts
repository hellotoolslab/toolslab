// toolStore Middleware - Auto-tracks tool usage when addToHistory() called

import type { ToolUseEvent, UserLevel } from '../types/events';
import { getTrackingManager } from '../core/TrackingManager';
import { EventNormalizer } from '../core/EventNormalizer';

interface ToolOperation {
  id: string;
  tool: string;
  input: string;
  output: string;
  timestamp: number;
}

interface ToolStore {
  history: ToolOperation[];
  userLevel: 'first_time' | 'returning' | 'power';
  getUserLevel: () => 'first_time' | 'returning' | 'power';
}

/**
 * Track tool usage automatically when addToHistory is called
 * This is the core auto-tracking mechanism - NO manual tracking needed in tools!
 */
export function trackToolUsage(
  operation: ToolOperation,
  store: ToolStore
): void {
  try {
    // Calculate processing time (rough estimate from timestamp)
    const now = Date.now();
    const processingTime = now - operation.timestamp;

    // Get user level
    const userLevel: UserLevel = store.getUserLevel();

    // Calculate data sizes
    const inputSize = EventNormalizer.getByteSize(operation.input);
    const outputSize = EventNormalizer.getByteSize(operation.output);

    // Create tool.use event
    const event: ToolUseEvent = {
      event: 'tool.use',
      tool: operation.tool,
      inputSize,
      outputSize,
      processingTime:
        processingTime > 0 && processingTime < 60000
          ? processingTime
          : undefined,
      success: true,
      timestamp: now,
      sessionId: '', // Will be enriched by EventNormalizer
      userLevel,
    };

    // Enrich event with automatic context
    const enrichedEvent = EventNormalizer.enrichEvent(event);

    // Get TrackingManager and track
    const manager = getTrackingManager();
    manager.track(enrichedEvent);

    // Log in debug mode
    if (process.env.NEXT_PUBLIC_UMAMI_DEBUG === 'true') {
      console.log('[toolStoreMiddleware] Auto-tracked tool usage:', {
        tool: operation.tool,
        inputSize,
        outputSize,
        userLevel,
      });
    }
  } catch (error) {
    // Silent fail - don't break tool functionality if tracking fails
    if (process.env.NEXT_PUBLIC_UMAMI_DEBUG === 'true') {
      console.error('[toolStoreMiddleware] Tracking error:', error);
    }
  }
}

/**
 * Track tool error (can be called manually from tools if needed)
 */
export function trackToolError(
  tool: string,
  error: Error | string,
  inputSize?: number
): void {
  try {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorType = typeof error === 'string' ? 'Error' : error.name;

    const event = EventNormalizer.enrichEvent({
      event: 'tool.error' as const,
      tool,
      errorType,
      errorMessage: EventNormalizer.truncate(errorMessage, 200),
      inputSize,
      timestamp: Date.now(),
      sessionId: '',
    });

    const manager = getTrackingManager();
    manager.track(event);

    if (process.env.NEXT_PUBLIC_UMAMI_DEBUG === 'true') {
      console.log('[toolStoreMiddleware] Tracked tool error:', {
        tool,
        errorType,
      });
    }
  } catch (err) {
    // Silent fail
    if (process.env.NEXT_PUBLIC_UMAMI_DEBUG === 'true') {
      console.error('[toolStoreMiddleware] Error tracking failed:', err);
    }
  }
}
