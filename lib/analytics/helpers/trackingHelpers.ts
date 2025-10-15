// Tracking Helpers - Convenience functions for common tracking patterns

import { getTrackingManager } from '../core/TrackingManager';
import { getSessionManager } from '../core/SessionManager';
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
    timestamp: Date.now(),
    sessionId: getSessionManager()?.getSessionId() || '',
  };

  const enriched = EventNormalizer.enrichEvent(event);
  getTrackingManager().track(enriched);
}

/**
 * Track lab empty state visited
 */
export function trackLabEmptyStateVisited(): void {
  const event: LabEmptyStateVisitedEvent = {
    event: 'lab.empty_state_visited',
    timestamp: Date.now(),
    sessionId: getSessionManager()?.getSessionId() || '',
  };

  const enriched = EventNormalizer.enrichEvent(event);
  getTrackingManager().track(enriched);
}

/**
 * Track lab welcome toast shown
 */
export function trackLabWelcomeToastShown(): void {
  const event: LabWelcomeToastShownEvent = {
    event: 'lab.welcome_toast_shown',
    timestamp: Date.now(),
    sessionId: getSessionManager()?.getSessionId() || '',
  };

  const enriched = EventNormalizer.enrichEvent(event);
  getTrackingManager().track(enriched);
}

/**
 * Track lab tool selected
 */
export function trackLabToolSelected(toolId: string): void {
  const event: LabToolSelectedEvent = {
    event: 'lab.tool_selected',
    toolId,
    timestamp: Date.now(),
    sessionId: getSessionManager()?.getSessionId() || '',
  };

  const enriched = EventNormalizer.enrichEvent(event);
  getTrackingManager().track(enriched);
}

/**
 * Track lab overview selected
 */
export function trackLabOverviewSelected(): void {
  const event: LabOverviewSelectedEvent = {
    event: 'lab.overview_selected',
    timestamp: Date.now(),
    sessionId: getSessionManager()?.getSessionId() || '',
  };

  const enriched = EventNormalizer.enrichEvent(event);
  getTrackingManager().track(enriched);
}

/**
 * Track social media click
 */
export function trackSocialClick(platform: string, from?: string): void {
  const event: SocialClickEvent = {
    event: 'social.click',
    platform,
    from,
    timestamp: Date.now(),
    sessionId: getSessionManager()?.getSessionId() || '',
  };

  const enriched = EventNormalizer.enrichEvent(event);
  getTrackingManager().track(enriched);
}
