interface BotDetectionResult {
  isBot: boolean;
  reason?: string;
  confidence: number;
}

export class BotDetector {
  private botPatterns = [
    /bot|crawler|spider|scraper|facebook|twitter|discord|slack/i,
    /googlebot|bingbot|yahoobot|duckduckbot|baiduspider|yandexbot/i,
    /lighthouse|pagespeed|gtmetrix|pingdom|uptime/i,
    /headless|phantom|selenium|playwright|puppeteer/i,
    /axios|fetch|curl|wget|python|java|node/i,
  ];

  private suspiciousPatterns = [
    /localhost|127\.0\.0\.1|192\.168/,
    /test|staging|dev\..*|.*\.test/,
    /^\d+\.\d+\.\d+\.\d+$/, // Direct IP access
  ];

  detectBot(
    userAgent: string,
    referer: string = '',
    url: string = ''
  ): BotDetectionResult {
    const ua = userAgent.toLowerCase();

    // Check user agent patterns
    for (const pattern of this.botPatterns) {
      if (pattern.test(ua)) {
        return {
          isBot: true,
          reason: 'Bot user agent detected',
          confidence: 0.95,
        };
      }
    }

    // Check for headless browsers
    if (this.isHeadlessBrowser(ua)) {
      return {
        isBot: true,
        reason: 'Headless browser detected',
        confidence: 0.9,
      };
    }

    // Check for suspicious URLs
    if (this.suspiciousPatterns.some((pattern) => pattern.test(url))) {
      return {
        isBot: true,
        reason: 'Suspicious URL pattern',
        confidence: 0.8,
      };
    }

    // Check for missing common browser features
    if (this.isMissingBrowserFeatures()) {
      return {
        isBot: true,
        reason: 'Missing browser features',
        confidence: 0.7,
      };
    }

    return {
      isBot: false,
      confidence: 0.1,
    };
  }

  private isHeadlessBrowser(ua: string): boolean {
    return (
      ua.includes('headlesschrome') ||
      ua.includes('phantomjs') ||
      (ua.includes('chrome') &&
        !ua.includes('mobile') &&
        !ua.includes('android'))
    );
  }

  private isMissingBrowserFeatures(): boolean {
    if (typeof window === 'undefined') return true;

    return (
      !window.navigator?.cookieEnabled ||
      !window.localStorage ||
      !window.sessionStorage ||
      !window.history?.pushState
    );
  }
}

export const botDetector = new BotDetector();
