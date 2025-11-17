interface BotDetectionResult {
  isBot: boolean;
  isSearchEngine: boolean;
  reason?: string;
  confidence: number;
}

export class BotDetector {
  // Search engines that should be allowed to index
  private searchEnginePatterns = [
    /googlebot|google-inspectiontool/i,
    /bingbot|msnbot/i,
    /yahoobot|slurp/i,
    /duckduckbot/i,
    /baiduspider/i,
    /yandexbot/i,
    /facebookexternalhit/i,
    /twitterbot/i,
    /linkedinbot/i,
    /applebot/i,
  ];

  // Malicious bots to block
  private botPatterns = [
    /spider|scraper|crawler/i,
    /lighthouse|pagespeed|gtmetrix|pingdom|uptime/i,
    /headless|phantom|selenium|playwright|puppeteer/i,
    /axios|fetch|curl|wget|python|java|node/i,
    /discord|slack/i,
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

    // First check if it's a search engine (allow indexing)
    for (const pattern of this.searchEnginePatterns) {
      if (pattern.test(ua)) {
        return {
          isBot: true,
          isSearchEngine: true,
          reason: 'Search engine bot detected',
          confidence: 0.95,
        };
      }
    }

    // Then check for malicious bots
    for (const pattern of this.botPatterns) {
      if (pattern.test(ua)) {
        return {
          isBot: true,
          isSearchEngine: false,
          reason: 'Malicious bot detected',
          confidence: 0.95,
        };
      }
    }

    // Check for headless browsers
    if (this.isHeadlessBrowser(ua)) {
      return {
        isBot: true,
        isSearchEngine: false,
        reason: 'Headless browser detected',
        confidence: 0.9,
      };
    }

    // Check for suspicious URLs
    if (this.suspiciousPatterns.some((pattern) => pattern.test(url))) {
      return {
        isBot: true,
        isSearchEngine: false,
        reason: 'Suspicious URL pattern',
        confidence: 0.8,
      };
    }

    // Check for missing common browser features
    if (this.isMissingBrowserFeatures()) {
      return {
        isBot: true,
        isSearchEngine: false,
        reason: 'Missing browser features',
        confidence: 0.7,
      };
    }

    return {
      isBot: false,
      isSearchEngine: false,
      confidence: 0.1,
    };
  }

  private isHeadlessBrowser(ua: string): boolean {
    // Check for explicit headless browser indicators only
    // ⚠️ IMPORTANT: Don't block regular Chrome/Firefox desktop browsers!
    return (
      ua.includes('headlesschrome') ||
      ua.includes('headless') ||
      ua.includes('phantomjs') ||
      ua.includes('selenium') ||
      ua.includes('webdriver') ||
      ua.includes('playwright') ||
      ua.includes('puppeteer')
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
