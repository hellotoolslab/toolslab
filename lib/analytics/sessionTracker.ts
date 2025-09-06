interface SessionData {
  sessionId: string;
  startTime: number;
  lastActivity: number;
  pageViews: number;
  events: number;
  isValid: boolean;
}

export class SessionTracker {
  private sessionData: SessionData;
  private minSessionDuration = 3000; // 3 seconds minimum
  private maxInactivity = 300000; // 5 minutes max inactivity

  constructor() {
    this.sessionData = this.initSession();
    this.setupActivityTracking();
  }

  private initSession(): SessionData {
    const sessionId = this.generateSessionId();
    const now = Date.now();

    return {
      sessionId,
      startTime: now,
      lastActivity: now,
      pageViews: 0,
      events: 0,
      isValid: false, // Becomes valid after minimum duration
    };
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupActivityTracking(): void {
    if (typeof window === 'undefined') return;

    // Track genuine user interactions
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];

    events.forEach((event) => {
      window.addEventListener(
        event,
        () => {
          this.updateActivity();
        },
        { passive: true }
      );
    });

    // Validate session after minimum duration
    setTimeout(() => {
      if (this.isActiveSession()) {
        this.sessionData.isValid = true;
      }
    }, this.minSessionDuration);
  }

  private updateActivity(): void {
    const now = Date.now();
    this.sessionData.lastActivity = now;

    // Session becomes valid if user interacts for minimum duration
    if (now - this.sessionData.startTime >= this.minSessionDuration) {
      this.sessionData.isValid = true;
    }
  }

  private isActiveSession(): boolean {
    const now = Date.now();
    const sessionDuration = now - this.sessionData.startTime;
    const timeSinceActivity = now - this.sessionData.lastActivity;

    return (
      sessionDuration >= this.minSessionDuration &&
      timeSinceActivity <= this.maxInactivity &&
      (this.sessionData.pageViews > 1 || this.sessionData.events > 0)
    );
  }

  incrementPageView(): void {
    this.sessionData.pageViews++;
    this.updateActivity();
  }

  incrementEvent(): void {
    this.sessionData.events++;
    this.updateActivity();
  }

  shouldTrack(): boolean {
    return this.sessionData.isValid && this.isActiveSession();
  }

  getSessionData(): SessionData {
    return { ...this.sessionData };
  }
}
