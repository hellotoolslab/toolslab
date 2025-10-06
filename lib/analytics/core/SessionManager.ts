// SessionManager - Unified session tracking for ToolsLab

import type { SessionEndEvent } from '../types/events';
import { getTrackingManager } from './TrackingManager';
import { EventNormalizer } from './EventNormalizer';

export interface SessionData {
  sessionId: string;
  startTime: number;
  lastActivity: number;
  pageViews: number;
  events: number;
  toolsUsed: Set<string>;
}

class SessionManager {
  private sessionData: SessionData | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeSession();
      this.setupListeners();
    }
  }

  /**
   * Initialize session data
   */
  private initializeSession(): void {
    // Try to get existing session ID from sessionStorage
    let sessionId: string | null = null;

    try {
      sessionId = sessionStorage.getItem('toolslab-session-id');
    } catch {
      // sessionStorage not available
    }

    // Generate new session ID if needed
    if (!sessionId) {
      sessionId =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;

      try {
        sessionStorage.setItem('toolslab-session-id', sessionId);
      } catch {
        // Ignore errors
      }
    }

    this.sessionData = {
      sessionId,
      startTime: Date.now(),
      lastActivity: Date.now(),
      pageViews: 0,
      events: 0,
      toolsUsed: new Set(),
    };
  }

  /**
   * Setup event listeners
   */
  private setupListeners(): void {
    // Page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.handlePageHidden();
      } else {
        this.handlePageVisible();
      }
    });

    // Before unload
    window.addEventListener('beforeunload', () => {
      this.handlePageUnload();
    });
  }

  /**
   * Send session end event
   */
  private sendSessionEnd(): void {
    if (!this.sessionData) {
      return;
    }

    const duration = Date.now() - this.sessionData.startTime;

    // Only send if session is meaningful (> 5 seconds)
    if (duration < 5000) {
      return;
    }

    const event: SessionEndEvent = {
      event: 'session.end',
      sessionId: this.sessionData.sessionId,
      duration,
      pageViews: this.sessionData.pageViews,
      eventsCount: this.sessionData.events,
      toolsUsed: this.sessionData.toolsUsed.size,
      toolsList: Array.from(this.sessionData.toolsUsed),
      timestamp: Date.now(),
    };

    const enriched = EventNormalizer.enrichEvent(event);
    getTrackingManager().track(enriched);

    // Force immediate flush (critical event)
    getTrackingManager().flush();
  }

  /**
   * Handle page hidden (user switched tab or minimized)
   */
  private handlePageHidden(): void {
    this.sendSessionEnd();
  }

  /**
   * Handle page visible (user returned)
   */
  private handlePageVisible(): void {
    if (this.sessionData) {
      this.sessionData.lastActivity = Date.now();
    }
  }

  /**
   * Handle page unload (user closing browser/tab)
   */
  private handlePageUnload(): void {
    this.sendSessionEnd();
  }

  /**
   * Increment page view count
   */
  public incrementPageView(): void {
    if (this.sessionData) {
      this.sessionData.pageViews++;
      this.sessionData.lastActivity = Date.now();
    }
  }

  /**
   * Increment event count
   */
  public incrementEvent(): void {
    if (this.sessionData) {
      this.sessionData.events++;
      this.sessionData.lastActivity = Date.now();
    }
  }

  /**
   * Add tool to used tools list
   */
  public addToolUsed(toolId: string): void {
    if (this.sessionData) {
      this.sessionData.toolsUsed.add(toolId);
      this.sessionData.lastActivity = Date.now();
    }
  }

  /**
   * Get current session data
   */
  public getSessionData(): SessionData {
    if (!this.sessionData) {
      this.initializeSession();
    }
    return this.sessionData!;
  }

  /**
   * Get session ID
   */
  public getSessionId(): string {
    return this.getSessionData().sessionId;
  }
}

// Singleton instance
let instance: SessionManager | null = null;

export function getSessionManager(): SessionManager {
  if (!instance && typeof window !== 'undefined') {
    instance = new SessionManager();
  }
  return instance!;
}

export { SessionManager };
