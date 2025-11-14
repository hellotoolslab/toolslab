// Tracking Helpers - Convenience functions for common tracking patterns

import { getUmamiAdapter } from '../umami/UmamiSDKAdapter';
import { getUmamiSessionTracker } from '../umami/UmamiSessionTracker';
import { EventNormalizer } from '../core/EventNormalizer';
import type { LabToolSelectedEvent } from '../types/events';

/**
 * Track lab tool selected
 */
export function trackLabToolSelected(toolId: string): void {
  const event: LabToolSelectedEvent = {
    event: 'lab.tool_selected',
    toolId,
    sessionId: getUmamiSessionTracker()?.getSessionId() || '',
  };

  const enriched = EventNormalizer.enrichEvent(event);
  getUmamiAdapter().track(enriched);
}
