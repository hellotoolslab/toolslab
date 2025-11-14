// Tracking Helpers - Convenience functions for common tracking patterns

import { getUmamiAdapter } from '../umami/UmamiSDKAdapter';
import { getUmamiSessionTracker } from '../umami/UmamiSessionTracker';
import { EventNormalizer } from '../core/EventNormalizer';
import type {
  LabVisitedEvent,
  LabEmptyStateVisitedEvent,
  LabWelcomeToastShownEvent,
  LabToolSelectedEvent,
  LabOverviewSelectedEvent,
  SocialClickEvent,
} from '../types/events';

/**
 * Track lab visited event
 */
export function trackLabVisited(params: {
  favoritesCount: number;
  toolsCount: number;
  categoriesCount: number;
}): void {
  const event: LabVisitedEvent = {
    event: 'lab.visited',
    favoritesCount: params.favoritesCount,
    toolsCount: params.toolsCount,
    categoriesCount: params.categoriesCount,
    sessionId: getUmamiSessionTracker()?.getSessionId() || '',
  };

  const enriched = EventNormalizer.enrichEvent(event);
  getUmamiAdapter().track(enriched);
}

/**
 * Track lab empty state visited
 */
export function trackLabEmptyStateVisited(): void {
  const event: LabEmptyStateVisitedEvent = {
    event: 'lab.empty_state_visited',
    sessionId: getUmamiSessionTracker()?.getSessionId() || '',
  };

  const enriched = EventNormalizer.enrichEvent(event);
  getUmamiAdapter().track(enriched);
}

/**
 * Track lab welcome toast shown
 */
export function trackLabWelcomeToastShown(): void {
  const event: LabWelcomeToastShownEvent = {
    event: 'lab.welcome_toast_shown',
    sessionId: getUmamiSessionTracker()?.getSessionId() || '',
  };

  const enriched = EventNormalizer.enrichEvent(event);
  getUmamiAdapter().track(enriched);
}

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

/**
 * Track lab overview selected
 */
export function trackLabOverviewSelected(): void {
  const event: LabOverviewSelectedEvent = {
    event: 'lab.overview_selected',
    sessionId: getUmamiSessionTracker()?.getSessionId() || '',
  };

  const enriched = EventNormalizer.enrichEvent(event);
  getUmamiAdapter().track(enriched);
}

/**
 * Track social media click
 */
export function trackSocialClick(platform: string, from?: string): void {
  const event: SocialClickEvent = {
    event: 'social.click',
    platform,
    from,
    sessionId: getUmamiSessionTracker()?.getSessionId() || '',
  };

  const enriched = EventNormalizer.enrichEvent(event);
  getUmamiAdapter().track(enriched);
}
