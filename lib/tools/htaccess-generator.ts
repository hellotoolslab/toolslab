/**
 * Htaccess Generator - Generate .htaccess files for Apache web servers
 */

// ==================== Types ====================

export interface RedirectRule {
  id: string;
  type: '301' | '302' | '303' | '307';
  from: string;
  to: string;
  enabled: boolean;
}

export interface RewriteRule {
  id: string;
  pattern: string;
  replacement: string;
  flags: string[];
  condition?: string;
  enabled: boolean;
}

export interface SecurityConfig {
  forceHttps: boolean;
  removeWww: boolean;
  addWww: boolean;
  blockXmlRpc: boolean;
  blockWpIncludes: boolean;
  preventDirectoryListing: boolean;
  blockSensitiveFiles: boolean;
  securityHeaders: boolean;
  xssProtection: boolean;
  contentTypeNosniff: boolean;
  frameOptions: 'DENY' | 'SAMEORIGIN' | 'ALLOW' | '';
  referrerPolicy: string;
}

export interface CachingConfig {
  enableCaching: boolean;
  htmlExpiry: number; // in seconds
  cssJsExpiry: number;
  imageExpiry: number;
  fontExpiry: number;
  enableGzip: boolean;
  enableBrotli: boolean;
}

export interface CustomErrorPage {
  code: string;
  path: string;
  enabled: boolean;
}

export interface IpRule {
  id: string;
  type: 'allow' | 'deny';
  ip: string;
  enabled: boolean;
}

export interface HotlinkConfig {
  enabled: boolean;
  allowedDomains: string[];
  blockExtensions: string[];
}

export interface HtaccessConfig {
  redirects: RedirectRule[];
  rewrites: RewriteRule[];
  security: SecurityConfig;
  caching: CachingConfig;
  errorPages: CustomErrorPage[];
  ipRules: IpRule[];
  hotlink: HotlinkConfig;
  customRules: string;
}

// ==================== Default Configuration ====================

export const getDefaultConfig = (): HtaccessConfig => ({
  redirects: [],
  rewrites: [],
  security: {
    forceHttps: false,
    removeWww: false,
    addWww: false,
    blockXmlRpc: false,
    blockWpIncludes: false,
    preventDirectoryListing: true,
    blockSensitiveFiles: true,
    securityHeaders: false,
    xssProtection: true,
    contentTypeNosniff: true,
    frameOptions: 'SAMEORIGIN',
    referrerPolicy: 'strict-origin-when-cross-origin',
  },
  caching: {
    enableCaching: false,
    htmlExpiry: 3600, // 1 hour
    cssJsExpiry: 2592000, // 30 days
    imageExpiry: 2592000, // 30 days
    fontExpiry: 31536000, // 1 year
    enableGzip: false,
    enableBrotli: false,
  },
  errorPages: [],
  ipRules: [],
  hotlink: {
    enabled: false,
    allowedDomains: [],
    blockExtensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
  },
  customRules: '',
});

// ==================== Presets ====================

export interface HtaccessPreset {
  id: string;
  name: string;
  description: string;
  config: Partial<HtaccessConfig>;
}

export const HTACCESS_PRESETS: HtaccessPreset[] = [
  {
    id: 'basic-security',
    name: 'Basic Security',
    description: 'Essential security rules for any website',
    config: {
      security: {
        forceHttps: true,
        removeWww: false,
        addWww: false,
        blockXmlRpc: false,
        blockWpIncludes: false,
        preventDirectoryListing: true,
        blockSensitiveFiles: true,
        securityHeaders: true,
        xssProtection: true,
        contentTypeNosniff: true,
        frameOptions: 'SAMEORIGIN',
        referrerPolicy: 'strict-origin-when-cross-origin',
      },
    },
  },
  {
    id: 'wordpress',
    name: 'WordPress',
    description: 'Optimized settings for WordPress sites',
    config: {
      security: {
        forceHttps: true,
        removeWww: false,
        addWww: false,
        blockXmlRpc: true,
        blockWpIncludes: true,
        preventDirectoryListing: true,
        blockSensitiveFiles: true,
        securityHeaders: true,
        xssProtection: true,
        contentTypeNosniff: true,
        frameOptions: 'SAMEORIGIN',
        referrerPolicy: 'strict-origin-when-cross-origin',
      },
      caching: {
        enableCaching: true,
        htmlExpiry: 3600,
        cssJsExpiry: 2592000,
        imageExpiry: 2592000,
        fontExpiry: 31536000,
        enableGzip: true,
        enableBrotli: false,
      },
    },
  },
  {
    id: 'performance',
    name: 'Performance',
    description: 'Maximum caching and compression for speed',
    config: {
      caching: {
        enableCaching: true,
        htmlExpiry: 3600,
        cssJsExpiry: 31536000,
        imageExpiry: 31536000,
        fontExpiry: 31536000,
        enableGzip: true,
        enableBrotli: true,
      },
    },
  },
  {
    id: 'spa',
    name: 'Single Page App',
    description: 'Settings for React, Vue, Angular apps',
    config: {
      rewrites: [
        {
          id: 'spa-fallback',
          pattern: '^index\\.html$ - [L]',
          replacement: '',
          flags: [],
          enabled: true,
        },
      ],
      security: {
        forceHttps: true,
        removeWww: false,
        addWww: false,
        blockXmlRpc: false,
        blockWpIncludes: false,
        preventDirectoryListing: true,
        blockSensitiveFiles: true,
        securityHeaders: true,
        xssProtection: true,
        contentTypeNosniff: true,
        frameOptions: 'SAMEORIGIN',
        referrerPolicy: 'strict-origin-when-cross-origin',
      },
      caching: {
        enableCaching: true,
        htmlExpiry: 0,
        cssJsExpiry: 31536000,
        imageExpiry: 31536000,
        fontExpiry: 31536000,
        enableGzip: true,
        enableBrotli: false,
      },
    },
  },
];

// ==================== Generator Functions ====================

function generateRedirects(redirects: RedirectRule[]): string {
  const enabledRedirects = redirects.filter((r) => r.enabled);
  if (enabledRedirects.length === 0) return '';

  const lines = ['# ==================== Redirects ===================='];
  enabledRedirects.forEach((redirect) => {
    lines.push(`Redirect ${redirect.type} ${redirect.from} ${redirect.to}`);
  });
  lines.push('');

  return lines.join('\n');
}

function generateRewrites(rewrites: RewriteRule[]): string {
  const enabledRewrites = rewrites.filter((r) => r.enabled);
  if (enabledRewrites.length === 0) return '';

  const lines = [
    '# ==================== URL Rewrites ====================',
    'RewriteEngine On',
    '',
  ];

  enabledRewrites.forEach((rewrite) => {
    if (rewrite.condition) {
      lines.push(`RewriteCond ${rewrite.condition}`);
    }
    const flags =
      rewrite.flags.length > 0 ? ` [${rewrite.flags.join(',')}]` : '';
    lines.push(`RewriteRule ${rewrite.pattern} ${rewrite.replacement}${flags}`);
  });
  lines.push('');

  return lines.join('\n');
}

function generateSecurity(security: SecurityConfig): string {
  const lines: string[] = [];
  let needsRewriteEngine = false;

  // Force HTTPS
  if (security.forceHttps) {
    needsRewriteEngine = true;
  }

  // WWW handling
  if (security.removeWww || security.addWww) {
    needsRewriteEngine = true;
  }

  if (
    needsRewriteEngine ||
    security.forceHttps ||
    security.removeWww ||
    security.addWww
  ) {
    lines.push(
      '# ==================== Security & Redirects ===================='
    );
    lines.push('RewriteEngine On');
    lines.push('');
  }

  if (security.forceHttps) {
    lines.push('# Force HTTPS');
    lines.push('RewriteCond %{HTTPS} off');
    lines.push(
      'RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]'
    );
    lines.push('');
  }

  if (security.removeWww) {
    lines.push('# Remove www');
    lines.push('RewriteCond %{HTTP_HOST} ^www\\.(.*)$ [NC]');
    lines.push('RewriteRule ^(.*)$ https://%1/$1 [R=301,L]');
    lines.push('');
  } else if (security.addWww) {
    lines.push('# Add www');
    lines.push('RewriteCond %{HTTP_HOST} !^www\\. [NC]');
    lines.push('RewriteRule ^(.*)$ https://www.%{HTTP_HOST}/$1 [R=301,L]');
    lines.push('');
  }

  if (security.preventDirectoryListing) {
    lines.push('# Prevent directory listing');
    lines.push('Options -Indexes');
    lines.push('');
  }

  if (security.blockSensitiveFiles) {
    lines.push('# Block access to sensitive files');
    lines.push(
      '<FilesMatch "^\\.(htaccess|htpasswd|ini|log|sh|bak|config|sql)$">'
    );
    lines.push('    Order Allow,Deny');
    lines.push('    Deny from all');
    lines.push('</FilesMatch>');
    lines.push('');
    lines.push('# Block access to sensitive directories');
    lines.push('<IfModule mod_rewrite.c>');
    lines.push('    RewriteRule ^(vendor|node_modules)/ - [F,L]');
    lines.push('</IfModule>');
    lines.push('');
  }

  if (security.blockXmlRpc) {
    lines.push('# Block XML-RPC (WordPress)');
    lines.push('<Files xmlrpc.php>');
    lines.push('    Order Allow,Deny');
    lines.push('    Deny from all');
    lines.push('</Files>');
    lines.push('');
  }

  if (security.blockWpIncludes) {
    lines.push('# Block wp-includes (WordPress)');
    lines.push('<IfModule mod_rewrite.c>');
    lines.push('    RewriteRule ^wp-admin/includes/ - [F,L]');
    lines.push('    RewriteRule !^wp-includes/ - [S=3]');
    lines.push('    RewriteRule ^wp-includes/[^/]+\\.php$ - [F,L]');
    lines.push(
      '    RewriteRule ^wp-includes/js/tinymce/langs/.+\\.php - [F,L]'
    );
    lines.push('    RewriteRule ^wp-includes/theme-compat/ - [F,L]');
    lines.push('</IfModule>');
    lines.push('');
  }

  // Security headers
  if (security.securityHeaders) {
    lines.push('# ==================== Security Headers ====================');
    lines.push('<IfModule mod_headers.c>');

    if (security.xssProtection) {
      lines.push('    Header set X-XSS-Protection "1; mode=block"');
    }

    if (security.contentTypeNosniff) {
      lines.push('    Header set X-Content-Type-Options "nosniff"');
    }

    if (security.frameOptions && security.frameOptions !== 'ALLOW') {
      lines.push(`    Header set X-Frame-Options "${security.frameOptions}"`);
    }

    if (security.referrerPolicy) {
      lines.push(`    Header set Referrer-Policy "${security.referrerPolicy}"`);
    }

    lines.push(
      '    Header set Permissions-Policy "geolocation=(), microphone=(), camera=()"'
    );
    lines.push('</IfModule>');
    lines.push('');
  }

  return lines.join('\n');
}

function generateCaching(caching: CachingConfig): string {
  if (!caching.enableCaching && !caching.enableGzip && !caching.enableBrotli) {
    return '';
  }

  const lines: string[] = [];

  if (caching.enableGzip || caching.enableBrotli) {
    lines.push('# ==================== Compression ====================');

    if (caching.enableGzip) {
      lines.push('<IfModule mod_deflate.c>');
      lines.push('    AddOutputFilterByType DEFLATE text/html');
      lines.push('    AddOutputFilterByType DEFLATE text/css');
      lines.push('    AddOutputFilterByType DEFLATE text/javascript');
      lines.push('    AddOutputFilterByType DEFLATE application/javascript');
      lines.push('    AddOutputFilterByType DEFLATE application/json');
      lines.push('    AddOutputFilterByType DEFLATE application/xml');
      lines.push('    AddOutputFilterByType DEFLATE text/xml');
      lines.push('    AddOutputFilterByType DEFLATE image/svg+xml');
      lines.push('    AddOutputFilterByType DEFLATE font/ttf');
      lines.push('    AddOutputFilterByType DEFLATE font/otf');
      lines.push('</IfModule>');
      lines.push('');
    }

    if (caching.enableBrotli) {
      lines.push('<IfModule mod_brotli.c>');
      lines.push('    AddOutputFilterByType BROTLI_COMPRESS text/html');
      lines.push('    AddOutputFilterByType BROTLI_COMPRESS text/css');
      lines.push('    AddOutputFilterByType BROTLI_COMPRESS text/javascript');
      lines.push(
        '    AddOutputFilterByType BROTLI_COMPRESS application/javascript'
      );
      lines.push('    AddOutputFilterByType BROTLI_COMPRESS application/json');
      lines.push('    AddOutputFilterByType BROTLI_COMPRESS application/xml');
      lines.push('    AddOutputFilterByType BROTLI_COMPRESS text/xml');
      lines.push('    AddOutputFilterByType BROTLI_COMPRESS image/svg+xml');
      lines.push('</IfModule>');
      lines.push('');
    }
  }

  if (caching.enableCaching) {
    lines.push('# ==================== Browser Caching ====================');
    lines.push('<IfModule mod_expires.c>');
    lines.push('    ExpiresActive On');
    lines.push('');
    lines.push('    # HTML');
    lines.push(
      `    ExpiresByType text/html "access plus ${caching.htmlExpiry} seconds"`
    );
    lines.push('');
    lines.push('    # CSS & JavaScript');
    lines.push(
      `    ExpiresByType text/css "access plus ${caching.cssJsExpiry} seconds"`
    );
    lines.push(
      `    ExpiresByType application/javascript "access plus ${caching.cssJsExpiry} seconds"`
    );
    lines.push(
      `    ExpiresByType text/javascript "access plus ${caching.cssJsExpiry} seconds"`
    );
    lines.push('');
    lines.push('    # Images');
    lines.push(
      `    ExpiresByType image/jpeg "access plus ${caching.imageExpiry} seconds"`
    );
    lines.push(
      `    ExpiresByType image/png "access plus ${caching.imageExpiry} seconds"`
    );
    lines.push(
      `    ExpiresByType image/gif "access plus ${caching.imageExpiry} seconds"`
    );
    lines.push(
      `    ExpiresByType image/webp "access plus ${caching.imageExpiry} seconds"`
    );
    lines.push(
      `    ExpiresByType image/svg+xml "access plus ${caching.imageExpiry} seconds"`
    );
    lines.push(
      `    ExpiresByType image/x-icon "access plus ${caching.imageExpiry} seconds"`
    );
    lines.push('');
    lines.push('    # Fonts');
    lines.push(
      `    ExpiresByType font/ttf "access plus ${caching.fontExpiry} seconds"`
    );
    lines.push(
      `    ExpiresByType font/otf "access plus ${caching.fontExpiry} seconds"`
    );
    lines.push(
      `    ExpiresByType font/woff "access plus ${caching.fontExpiry} seconds"`
    );
    lines.push(
      `    ExpiresByType font/woff2 "access plus ${caching.fontExpiry} seconds"`
    );
    lines.push(
      `    ExpiresByType application/font-woff "access plus ${caching.fontExpiry} seconds"`
    );
    lines.push(
      `    ExpiresByType application/font-woff2 "access plus ${caching.fontExpiry} seconds"`
    );
    lines.push('</IfModule>');
    lines.push('');

    // Cache-Control headers
    lines.push('<IfModule mod_headers.c>');
    lines.push('    # Cache static assets');
    lines.push(
      '    <FilesMatch "\\.(ico|pdf|flv|jpg|jpeg|png|gif|webp|svg|js|css|swf|woff|woff2|ttf|otf)$">'
    );
    lines.push('        Header set Cache-Control "max-age=2592000, public"');
    lines.push('    </FilesMatch>');
    lines.push('');
    lines.push('    # Disable caching for dynamic content');
    lines.push('    <FilesMatch "\\.(php|cgi|pl|htm)$">');
    lines.push(
      '        Header set Cache-Control "max-age=0, private, no-store, no-cache, must-revalidate"'
    );
    lines.push('    </FilesMatch>');
    lines.push('</IfModule>');
    lines.push('');
  }

  return lines.join('\n');
}

function generateErrorPages(errorPages: CustomErrorPage[]): string {
  const enabledPages = errorPages.filter((p) => p.enabled && p.code && p.path);
  if (enabledPages.length === 0) return '';

  const lines = [
    '# ==================== Custom Error Pages ====================',
  ];
  enabledPages.forEach((page) => {
    lines.push(`ErrorDocument ${page.code} ${page.path}`);
  });
  lines.push('');

  return lines.join('\n');
}

function generateIpRules(ipRules: IpRule[]): string {
  const enabledRules = ipRules.filter((r) => r.enabled && r.ip);
  if (enabledRules.length === 0) return '';

  const lines = [
    '# ==================== IP Access Control ====================',
    'Order Deny,Allow',
  ];

  const denyRules = enabledRules.filter((r) => r.type === 'deny');
  const allowRules = enabledRules.filter((r) => r.type === 'allow');

  if (denyRules.length > 0) {
    denyRules.forEach((rule) => {
      lines.push(`Deny from ${rule.ip}`);
    });
  }

  if (allowRules.length > 0) {
    allowRules.forEach((rule) => {
      lines.push(`Allow from ${rule.ip}`);
    });
  }

  lines.push('');
  return lines.join('\n');
}

function generateHotlinkProtection(hotlink: HotlinkConfig): string {
  if (!hotlink.enabled || hotlink.allowedDomains.length === 0) return '';

  const lines = [
    '# ==================== Hotlink Protection ====================',
    'RewriteEngine On',
  ];

  // Add conditions for each allowed domain
  hotlink.allowedDomains.forEach((domain) => {
    lines.push(
      `RewriteCond %{HTTP_REFERER} !^https?://(www\\.)?${domain.replace(/\./g, '\\.')}/ [NC]`
    );
  });

  // Block direct linking
  lines.push('RewriteCond %{HTTP_REFERER} !^$');

  // Apply to specified extensions
  const extensions = hotlink.blockExtensions.join('|');
  lines.push(`RewriteRule \\.(${extensions})$ - [F,NC,L]`);
  lines.push('');

  return lines.join('\n');
}

// ==================== Main Generator ====================

export function generateHtaccess(config: HtaccessConfig): string {
  const sections: string[] = [
    '# ========================================================',
    '# .htaccess generated by ToolsLab Htaccess Generator',
    '# https://toolslab.dev/tools/htaccess-generator',
    '# ========================================================',
    '',
  ];

  const security = generateSecurity(config.security);
  if (security) sections.push(security);

  const redirects = generateRedirects(config.redirects);
  if (redirects) sections.push(redirects);

  const rewrites = generateRewrites(config.rewrites);
  if (rewrites) sections.push(rewrites);

  const caching = generateCaching(config.caching);
  if (caching) sections.push(caching);

  const errorPages = generateErrorPages(config.errorPages);
  if (errorPages) sections.push(errorPages);

  const ipRules = generateIpRules(config.ipRules);
  if (ipRules) sections.push(ipRules);

  const hotlink = generateHotlinkProtection(config.hotlink);
  if (hotlink) sections.push(hotlink);

  if (config.customRules && config.customRules.trim()) {
    sections.push('# ==================== Custom Rules ====================');
    sections.push(config.customRules.trim());
    sections.push('');
  }

  return sections.join('\n');
}

// ==================== Validation ====================

export function validateRedirectPath(path: string): boolean {
  // Must start with /
  return path.startsWith('/') || path.startsWith('http');
}

export function validateIpAddress(ip: string): boolean {
  // Simple IP validation (IPv4, IPv6, or CIDR notation)
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  const allRegex = /^all$/i;

  return ipv4Regex.test(ip) || ipv6Regex.test(ip) || allRegex.test(ip);
}

export function validateDomain(domain: string): boolean {
  const domainRegex =
    /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.([a-zA-Z]{2,}|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})$/;
  return domainRegex.test(domain);
}

// ==================== Utility Functions ====================

export function createRedirectRule(
  from: string,
  to: string,
  type: '301' | '302' | '303' | '307' = '301'
): RedirectRule {
  return {
    id: crypto.randomUUID(),
    type,
    from,
    to,
    enabled: true,
  };
}

export function createErrorPage(code: string, path: string): CustomErrorPage {
  return {
    code,
    path,
    enabled: true,
  };
}

export function createIpRule(ip: string, type: 'allow' | 'deny'): IpRule {
  return {
    id: crypto.randomUUID(),
    type,
    ip,
    enabled: true,
  };
}

export function secondsToReadable(seconds: number): string {
  if (seconds >= 31536000) {
    return `${Math.round(seconds / 31536000)} year(s)`;
  } else if (seconds >= 2592000) {
    return `${Math.round(seconds / 2592000)} month(s)`;
  } else if (seconds >= 86400) {
    return `${Math.round(seconds / 86400)} day(s)`;
  } else if (seconds >= 3600) {
    return `${Math.round(seconds / 3600)} hour(s)`;
  } else if (seconds >= 60) {
    return `${Math.round(seconds / 60)} minute(s)`;
  }
  return `${seconds} second(s)`;
}

export const CACHE_PRESETS = {
  none: 0,
  hour: 3600,
  day: 86400,
  week: 604800,
  month: 2592000,
  year: 31536000,
} as const;

export const ERROR_CODES = [
  { code: '400', name: 'Bad Request' },
  { code: '401', name: 'Unauthorized' },
  { code: '403', name: 'Forbidden' },
  { code: '404', name: 'Not Found' },
  { code: '500', name: 'Internal Server Error' },
  { code: '502', name: 'Bad Gateway' },
  { code: '503', name: 'Service Unavailable' },
  { code: '504', name: 'Gateway Timeout' },
] as const;
