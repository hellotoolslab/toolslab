// UmamiSessionTracker - Session tracking for Umami analytics
// Responsabilità:
// - Session lifecycle (start/end)
// - Tab visibility tracking
// - Session metadata and history

import type {
  SessionStartEvent,
  SessionTabHiddenEvent,
  SessionTabVisibleEvent,
  SessionEndEvent,
} from '../types/events';
import { getUmamiAdapter } from './UmamiSDKAdapter';
import { EventNormalizer } from '../core/EventNormalizer';

export interface SessionData {
  sessionId: string;
  startTime: number;
  lastActivity: number;
  pageViews: number;
  events: number;
  toolsUsed: Set<string>;
  // Visibility tracking
  lastVisibleTime: number; // When tab became visible
  lastHiddenTime: number | null; // When tab became hidden
  totalHiddenDuration: number; // Total time tab was hidden
  tabHiddenCount: number; // Number of times tab was hidden
}

interface SessionHistory {
  sessionCount: number;
  lastSessionTime: number;
}

class UmamiSessionTracker {
  private sessionData: SessionData | null = null;
  private readonly STORAGE_KEY = 'toolslab-session-history';

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeSession();
      this.setupListeners();
    }
  }

  /**
   * Get session history from localStorage
   */
  private getSessionHistory(): SessionHistory | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // localStorage not available or parse error
    }
    return null;
  }

  /**
   * Update session history in localStorage
   */
  private updateSessionHistory(): void {
    try {
      const history = this.getSessionHistory() || {
        sessionCount: 0,
        lastSessionTime: 0,
      };

      history.sessionCount++;
      history.lastSessionTime = Date.now();

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    } catch {
      // Ignore localStorage errors
    }
  }

  /**
   * Send session start event
   */
  private sendSessionStart(): void {
    if (!this.sessionData) return;

    const history = this.getSessionHistory();
    const isReturningUser = history !== null;
    const previousSessionCount = history?.sessionCount || 0;

    let daysSinceLastVisit: number | undefined;
    if (history?.lastSessionTime) {
      const millisSinceLastVisit = Date.now() - history.lastSessionTime;
      daysSinceLastVisit = Math.floor(
        millisSinceLastVisit / (1000 * 60 * 60 * 24)
      );
    }

    const event: SessionStartEvent = {
      event: 'session.start',
      sessionId: this.sessionData.sessionId,
      isReturningUser,
      previousSessionCount,
      daysSinceLastVisit,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      entryPage: typeof window !== 'undefined' ? window.location.pathname : '/',
    };

    const enriched = EventNormalizer.enrichEvent(event);
    getUmamiAdapter().track(enriched);

    // Update session history after sending event
    this.updateSessionHistory();
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

    // Generate new session ID if needed (new session)
    const isNewSession = !sessionId;
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

    const now = Date.now();

    this.sessionData = {
      sessionId,
      startTime: now,
      lastActivity: now,
      pageViews: 0,
      events: 0,
      toolsUsed: new Set(),
      // Visibility tracking - initialized as visible
      lastVisibleTime: now,
      lastHiddenTime: null,
      totalHiddenDuration: 0,
      tabHiddenCount: 0,
    };

    // ❌ session.start event REMOVED per request utente
    // if (isNewSession) {
    //   this.sendSessionStart();
    // }
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
   * Send session.tab_hidden event
   */
  private sendTabHidden(): void {
    if (!this.sessionData) return;

    const now = Date.now();
    const visibleDuration = now - this.sessionData.lastVisibleTime;

    const event: SessionTabHiddenEvent = {
      event: 'session.tab_hidden',
      sessionId: this.sessionData.sessionId,
      visibleDuration,
      currentPage:
        typeof window !== 'undefined' ? window.location.pathname : '/',
      timestamp: now,
    };

    const enriched = EventNormalizer.enrichEvent(event);
    getUmamiAdapter().track(enriched);

    // Update session data
    this.sessionData.lastHiddenTime = now;
    this.sessionData.tabHiddenCount++;
  }

  /**
   * Send session.tab_visible event
   */
  private sendTabVisible(): void {
    if (!this.sessionData) {
      console.warn('[SessionTracker] sendTabVisible: no sessionData');
      return;
    }

    if (!this.sessionData.lastHiddenTime) {
      console.warn('[SessionTracker] sendTabVisible: no lastHiddenTime', {
        sessionId: this.sessionData.sessionId,
        lastHiddenTime: this.sessionData.lastHiddenTime,
      });
      return;
    }

    const now = Date.now();
    const hiddenDuration = now - this.sessionData.lastHiddenTime;

    const event: SessionTabVisibleEvent = {
      event: 'session.tab_visible',
      sessionId: this.sessionData.sessionId,
      hiddenDuration,
      currentPage:
        typeof window !== 'undefined' ? window.location.pathname : '/',
      timestamp: now,
    };

    console.log('[SessionTracker] Sending session.tab_visible', {
      hiddenDuration,
      lastHiddenTime: this.sessionData.lastHiddenTime,
      now,
    });

    const enriched = EventNormalizer.enrichEvent(event);
    getUmamiAdapter().track(enriched);

    // Update session data
    this.sessionData.totalHiddenDuration += hiddenDuration;
    this.sessionData.lastVisibleTime = now;
    this.sessionData.lastHiddenTime = null;
  }

  /**
   * Send session end event
   */
  private sendSessionEnd(): void {
    if (!this.sessionData) {
      return;
    }

    const now = Date.now();
    const duration = now - this.sessionData.startTime;

    // Only send if session is meaningful (> 5 seconds)
    if (duration < 5000) {
      return;
    }

    // Calculate active duration (excluding hidden time)
    let activeDuration = duration - this.sessionData.totalHiddenDuration;

    // If currently hidden, add the current hidden period
    if (this.sessionData.lastHiddenTime) {
      const currentHiddenDuration = now - this.sessionData.lastHiddenTime;
      activeDuration -= currentHiddenDuration;
    }

    const event: SessionEndEvent = {
      event: 'session.end',
      sessionId: this.sessionData.sessionId,
      duration,
      activeDuration,
      pageViews: this.sessionData.pageViews,
      eventsCount: this.sessionData.events,
      toolsUsed: this.sessionData.toolsUsed.size,
      toolsList: Array.from(this.sessionData.toolsUsed),
      tabHiddenCount: this.sessionData.tabHiddenCount,
      timestamp: now,
    };

    const enriched = EventNormalizer.enrichEvent(event);
    getUmamiAdapter().track(enriched);

    // Force immediate flush (critical event)
    getUmamiAdapter().flush();
  }

  /**
   * Handle page hidden (user switched tab or minimized)
   */
  private handlePageHidden(): void {
    // Send tab_hidden event (user switched tab, NOT closing)
    this.sendTabHidden();
  }

  /**
   * Handle page visible (user returned)
   */
  private handlePageVisible(): void {
    if (this.sessionData) {
      this.sessionData.lastActivity = Date.now();

      // Send tab_visible event (user returned to tab)
      this.sendTabVisible();
    }
  }

  /**
   * Handle page unload (user closing browser/tab)
   */
  private handlePageUnload(): void {
    // Send session.end event (user is closing tab/browser)
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
let instance: UmamiSessionTracker | null = null;

export function getUmamiSessionTracker(): UmamiSessionTracker {
  if (!instance && typeof window !== 'undefined') {
    instance = new UmamiSessionTracker();
  }
  return instance!;
}

export { UmamiSessionTracker };
