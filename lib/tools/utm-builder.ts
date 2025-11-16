import { z } from 'zod';

// UTM Parameter Types
export interface UtmParameters {
  url: string;
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  customParams?: Record<string, string>;
}

export interface UtmTemplate {
  id: string;
  name: string;
  parameters: UtmParameters;
  createdAt: number;
}

export interface UtmBuilderResult {
  success: boolean;
  url?: string;
  error?: string;
  parameters?: Record<string, string>;
  metadata?: {
    originalUrl: string;
    parameterCount: number;
    hasCustomParams: boolean;
  };
}

// Validation schemas
const urlSchema = z
  .string()
  .min(1, 'URL is required')
  .url('Invalid URL format')
  .refine((url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }, 'Invalid URL');

const utmParamSchema = z.string().min(1).max(200);

// Build UTM URL
export function buildUtmUrl(params: UtmParameters): UtmBuilderResult {
  try {
    // Validate URL
    const validatedUrl = urlSchema.parse(params.url);
    const url = new URL(validatedUrl);

    // Standard UTM parameters
    const utmParams: Record<string, string> = {};

    if (params.source) {
      utmParams['utm_source'] = params.source;
    }

    if (params.medium) {
      utmParams['utm_medium'] = params.medium;
    }

    if (params.campaign) {
      utmParams['utm_campaign'] = params.campaign;
    }

    if (params.term) {
      utmParams['utm_term'] = params.term;
    }

    if (params.content) {
      utmParams['utm_content'] = params.content;
    }

    // Add custom parameters
    if (params.customParams) {
      Object.entries(params.customParams).forEach(([key, value]) => {
        if (key && value) {
          utmParams[key] = value;
        }
      });
    }

    // Add parameters to URL
    Object.entries(utmParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    const finalUrl = url.toString();

    return {
      success: true,
      url: finalUrl,
      parameters: utmParams,
      metadata: {
        originalUrl: params.url,
        parameterCount: Object.keys(utmParams).length,
        hasCustomParams:
          !!params.customParams && Object.keys(params.customParams).length > 0,
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || 'Validation error',
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to build UTM URL',
    };
  }
}

// Parse UTM parameters from URL
export function parseUtmUrl(url: string): UtmBuilderResult {
  try {
    const parsedUrl = new URL(url);
    const params: Record<string, string> = {};

    // Extract all UTM parameters
    const utmKeys = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
    ];

    utmKeys.forEach((key) => {
      const value = parsedUrl.searchParams.get(key);
      if (value) {
        params[key] = value;
      }
    });

    // Extract custom parameters (non-UTM)
    const customParams: Record<string, string> = {};
    parsedUrl.searchParams.forEach((value, key) => {
      if (!utmKeys.includes(key)) {
        customParams[key] = value;
      }
    });

    return {
      success: true,
      url,
      parameters: params,
      metadata: {
        originalUrl: url,
        parameterCount: Object.keys(params).length,
        hasCustomParams: Object.keys(customParams).length > 0,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: 'Invalid URL format',
    };
  }
}

// Validate individual UTM parameter
export function validateUtmParameter(value: string): boolean {
  try {
    utmParamSchema.parse(value);
    return true;
  } catch {
    return false;
  }
}

// Common UTM presets
export const utmPresets = {
  socialMedia: {
    facebook: { source: 'facebook', medium: 'social' },
    twitter: { source: 'twitter', medium: 'social' },
    linkedin: { source: 'linkedin', medium: 'social' },
    instagram: { source: 'instagram', medium: 'social' },
    youtube: { source: 'youtube', medium: 'video' },
  },
  email: {
    newsletter: { source: 'newsletter', medium: 'email' },
    promotional: { source: 'promotional-email', medium: 'email' },
    transactional: { source: 'transactional-email', medium: 'email' },
  },
  advertising: {
    google: { source: 'google', medium: 'cpc' },
    facebook: { source: 'facebook', medium: 'paid-social' },
    display: { source: 'display-network', medium: 'display' },
  },
  content: {
    blog: { source: 'blog', medium: 'content' },
    guestPost: { source: 'guest-post', medium: 'referral' },
    pressRelease: { source: 'press-release', medium: 'pr' },
  },
};

// Export to CSV format
export function exportToCsv(urls: UtmBuilderResult[]): string {
  const headers = [
    'Original URL',
    'UTM URL',
    'Source',
    'Medium',
    'Campaign',
    'Term',
    'Content',
  ];
  const rows = urls.map((result) => [
    result.metadata?.originalUrl || '',
    result.url || '',
    result.parameters?.utm_source || '',
    result.parameters?.utm_medium || '',
    result.parameters?.utm_campaign || '',
    result.parameters?.utm_term || '',
    result.parameters?.utm_content || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  return csvContent;
}

// Template management helpers
export function saveTemplate(
  template: Omit<UtmTemplate, 'id' | 'createdAt'>
): UtmTemplate {
  const newTemplate: UtmTemplate = {
    ...template,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: Date.now(),
  };

  const templates = getTemplates();
  templates.push(newTemplate);

  if (typeof window !== 'undefined') {
    localStorage.setItem('utm-templates', JSON.stringify(templates));
  }

  return newTemplate;
}

export function getTemplates(): UtmTemplate[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem('utm-templates');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function deleteTemplate(id: string): void {
  if (typeof window === 'undefined') return;

  const templates = getTemplates().filter((t) => t.id !== id);
  localStorage.setItem('utm-templates', JSON.stringify(templates));
}
