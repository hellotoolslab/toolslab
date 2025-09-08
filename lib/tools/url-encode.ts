/**
 * URL Encoder/Decoder Tool
 * Handles encoding and decoding of URLs and URL components with support for query parameters and international characters
 */

export interface UrlEncodeOptions {
  mode: 'encode' | 'decode' | 'auto';
  type: 'component' | 'full';
  handlePlusAsSpace?: boolean;
}

export interface QueryParameter {
  key: string;
  value: string;
  encoded?: boolean;
}

export interface UrlProcessResult {
  success: boolean;
  result?: string;
  error?: string;
  originalEncoding?: 'plain' | 'encoded' | 'mixed';
  detectedOperation?: 'encode' | 'decode';
  suggestions?: string[];
  metadata?: {
    hasQueryParams?: boolean;
    parameterCount?: number;
    hasInternationalChars?: boolean;
    hasSpecialChars?: boolean;
  };
}

export interface BatchProcessResult {
  results: UrlProcessResult[];
  stats: {
    total: number;
    successful: number;
    failed: number;
  };
}

export interface SampleUrl {
  category: string;
  url: string;
  description: string;
  encoded?: boolean;
}

/**
 * Encodes a URL component using percent encoding
 */
export function encodeUrlComponent(input: string): string {
  if (!input) return '';

  try {
    return encodeURIComponent(input);
  } catch (error) {
    throw new Error('Failed to encode URL component');
  }
}

/**
 * Decodes a URL component from percent encoding
 */
export function decodeUrlComponent(
  input: string,
  handlePlusAsSpace: boolean = true
): string {
  if (!input) return '';

  try {
    // Handle plus signs as spaces in query parameters
    let processedInput = input;
    if (handlePlusAsSpace) {
      processedInput = input.replace(/\+/g, ' ');
    }

    // Validate percent encoding before decoding
    if (!isValidUrlEncoded(processedInput)) {
      throw new Error('Invalid percent encoding detected');
    }

    return decodeURIComponent(processedInput);
  } catch (error) {
    throw new Error(
      `Failed to decode URL component: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Encodes a full URL while preserving URL structure
 */
export function encodeFullUrl(input: string): string {
  if (!input) return '';

  try {
    // Simple approach: encode only the parts that need encoding
    // This preserves URL structure better
    return input
      .replace(/ /g, '%20')
      .replace(/[^\w\-._~:/?#[\]@!$&'()*+,;=%]/g, (char) =>
        encodeURIComponent(char)
      );
  } catch (error) {
    throw new Error('Failed to encode full URL');
  }
}

/**
 * Decodes a full URL while preserving URL structure
 */
export function decodeFullUrl(input: string): string {
  if (!input) return '';

  try {
    // Use built-in URL constructor for proper parsing and decoding
    const url = new URL(input);

    // Reconstruct decoded URL
    const decodedHostname = decodeURIComponent(url.hostname);
    const decodedPathname = decodeURIComponent(url.pathname);
    const decodedSearch = url.search
      ? '?' +
        url.search
          .substring(1)
          .split('&')
          .map((param) => {
            const [key, value = ''] = param.split('=');
            return `${decodeURIComponent(key)}=${decodeURIComponent(value)}`;
          })
          .join('&')
      : '';
    const decodedHash = url.hash
      ? '#' + decodeURIComponent(url.hash.substring(1))
      : '';

    return `${url.protocol}//${url.username ? decodeURIComponent(url.username) + (url.password ? ':' + decodeURIComponent(url.password) : '') + '@' : ''}${decodedHostname}${url.port ? ':' + url.port : ''}${decodedPathname}${decodedSearch}${decodedHash}`;
  } catch (error) {
    // Fallback to simple decoding if URL parsing fails
    try {
      return decodeURIComponent(input);
    } catch (fallbackError) {
      throw new Error('Failed to decode URL');
    }
  }
}

/**
 * Validates if a string contains valid percent encoding
 */
export function isValidUrlEncoded(input: string): boolean {
  if (!input) return true;

  // Check for invalid percent sequences
  const percentPattern = /%[0-9A-Fa-f]{2}/g;
  const invalidPattern = /%(?![0-9A-Fa-f]{2})/;

  // Remove valid percent sequences and check if any invalid ones remain
  const withoutValid = input.replace(percentPattern, '');
  return !invalidPattern.test(withoutValid);
}

/**
 * Parses query parameters from a query string
 */
export function parseQueryParameters(
  queryString: string
): Record<string, string> {
  if (!queryString) return {};

  const params: Record<string, string> = {};
  const cleanQuery = queryString.startsWith('?')
    ? queryString.substring(1)
    : queryString;

  cleanQuery.split('&').forEach((param) => {
    if (param.trim()) {
      const [key, value = ''] = param.split('=');
      if (key) {
        params[decodeUrlComponent(key, true)] = decodeUrlComponent(value, true);
      }
    }
  });

  return params;
}

/**
 * Builds a query string from parameters object
 */
export function buildQueryString(
  params: Record<string, string | null | undefined>
): string {
  const pairs: string[] = [];

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      // Skip null and undefined values entirely
      return;
    }
    pairs.push(`${encodeUrlComponent(key)}=${encodeUrlComponent(value)}`);
  });

  return pairs.join('&');
}

/**
 * Detects if a string is URL encoded, plain text, or mixed
 */
export function detectEncoding(input: string): 'encoded' | 'plain' | 'mixed' {
  if (!input) return 'plain';

  const hasPercent = /%[0-9A-Fa-f]{2}/.test(input);
  // Remove valid percent sequences and check for special characters
  const withoutPercent = input.replace(/%[0-9A-Fa-f]{2}/g, '');
  const hasPlainSpecialChars = /[\s@#$%^&*()+={}[\]|\\:";'<>?,./]/.test(
    withoutPercent
  );

  if (hasPercent && hasPlainSpecialChars) return 'mixed';
  if (hasPercent) return 'encoded';
  return 'plain';
}

/**
 * Automatically detects the best operation (encode or decode) based on input
 */
export function detectOperation(input: string): 'encode' | 'decode' {
  if (!input) return 'encode';

  const encoding = detectEncoding(input);

  // If the input has percent encoding, it's likely already encoded and should be decoded
  if (encoding === 'encoded') return 'decode';

  // If mixed, prefer decode as user might want to clean up encoding
  if (encoding === 'mixed') return 'decode';

  // If plain text, especially with special characters or spaces, it should be encoded
  if (encoding === 'plain') {
    // Check for characters that need URL encoding
    const needsEncoding = /[^\w\-._~]/.test(input);
    return needsEncoding ? 'encode' : 'encode'; // Default to encode for plain text
  }

  return 'encode';
}

/**
 * Processes multiple URLs with the given options
 */
export function processUrls(
  urls: string[],
  options: UrlEncodeOptions
): BatchProcessResult {
  const results: UrlProcessResult[] = [];
  let successful = 0;
  let failed = 0;

  urls.forEach((url) => {
    try {
      const originalEncoding = detectEncoding(url);
      let result: string;
      const suggestions: string[] = [];

      // Determine the operation - either from options or auto-detect
      let actualMode: 'encode' | 'decode';
      if (options.mode === 'auto') {
        actualMode = detectOperation(url);
      } else {
        actualMode = options.mode;
      }

      // Perform the operation
      if (actualMode === 'encode') {
        if (options.type === 'component') {
          result = encodeUrlComponent(url);
        } else {
          result = encodeFullUrl(url);
        }

        if (originalEncoding === 'encoded') {
          suggestions.push(
            'Input appears to be already encoded - consider decoding first'
          );
        }
      } else {
        // decode
        if (options.type === 'component') {
          result = decodeUrlComponent(url, options.handlePlusAsSpace);
        } else {
          result = decodeFullUrl(url);
        }

        if (originalEncoding === 'plain') {
          suggestions.push(
            'Input appears to be plain text - no decoding needed'
          );
        }
      }

      // Generate metadata
      const metadata = {
        hasQueryParams: url.includes('?'),
        parameterCount: url.includes('?')
          ? url.split('?')[1]?.split('&').length || 0
          : 0,
        hasInternationalChars: /[^\x00-\x7F]/.test(url),
        hasSpecialChars: /[!@#$%^&*()+={}[\]|\\:";'<>?,./]/.test(url),
      };

      results.push({
        success: true,
        result,
        originalEncoding,
        detectedOperation: actualMode,
        suggestions: suggestions.length > 0 ? suggestions : undefined,
        metadata,
      });
      successful++;
    } catch (error) {
      results.push({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        originalEncoding: detectEncoding(url),
      });
      failed++;
    }
  });

  return {
    results,
    stats: {
      total: urls.length,
      successful,
      failed,
    },
  };
}

/**
 * Generates sample URLs for different use cases
 */
export function generateSampleUrls(): SampleUrl[] {
  return [
    {
      category: 'Basic Examples',
      url: 'https://example.com/path with spaces',
      description: 'Simple URL with spaces that need encoding',
      encoded: false,
    },
    {
      category: 'Basic Examples',
      url: 'https://example.com/path%20with%20spaces',
      description: 'URL with encoded spaces (%20)',
      encoded: true,
    },
    {
      category: 'Query Parameters',
      url: 'https://example.com/search?q=hello world&category=web tools',
      description: 'URL with query parameters containing spaces',
      encoded: false,
    },
    {
      category: 'Query Parameters',
      url: 'https://example.com/search?q=hello%20world&category=web%20tools',
      description: 'URL with encoded query parameters',
      encoded: true,
    },
    {
      category: 'Special Characters',
      url: 'https://example.com/api?email=user@example.com&price=$19.99',
      description: 'URL with email addresses and currency symbols',
      encoded: false,
    },
    {
      category: 'Special Characters',
      url: 'https://example.com/api?email=user%40example.com&price=%2419.99',
      description: 'URL with encoded special characters',
      encoded: true,
    },
    {
      category: 'International Characters',
      url: 'https://café.example.com/búsqueda?término=programación',
      description: 'URL with international characters (accented letters)',
      encoded: false,
    },
    {
      category: 'International Characters',
      url: 'https://caf%C3%A9.example.com/b%C3%BAsqueda?t%C3%A9rmino=programaci%C3%B3n',
      description: 'URL with encoded international characters',
      encoded: true,
    },
    {
      category: 'Complex URLs',
      url: 'https://user:password@example.com:8080/path?param1=value1&param2=value2#section',
      description:
        'Complex URL with authentication, port, query params, and fragment',
      encoded: false,
    },
    {
      category: 'Complex URLs',
      url: 'https://user:password@example.com:8080/path?param1=value%201&param2=value%202#section%20title',
      description: 'Complex URL with some encoded components',
      encoded: true,
    },
    {
      category: 'Edge Cases',
      url: 'https://example.com/path?data={"key": "value with spaces", "number": 123}',
      description: 'URL with JSON data in query parameter',
      encoded: false,
    },
    {
      category: 'Edge Cases',
      url: 'https://example.com/path?data=%7B%22key%22%3A%20%22value%20with%20spaces%22%2C%20%22number%22%3A%20123%7D',
      description: 'URL with encoded JSON data',
      encoded: true,
    },
  ];
}

/**
 * Main processing function that handles URL encoding/decoding with comprehensive options
 */
export function processUrl(
  input: string,
  options: UrlEncodeOptions
): UrlProcessResult {
  if (!input.trim()) {
    return {
      success: false,
      error: 'Input cannot be empty',
    };
  }

  try {
    const originalEncoding = detectEncoding(input);
    let result: string;
    const suggestions: string[] = [];

    // Determine the operation - either from options or auto-detect
    let actualMode: 'encode' | 'decode';
    if (options.mode === 'auto') {
      actualMode = detectOperation(input);
    } else {
      actualMode = options.mode;
    }

    // Perform the operation
    if (actualMode === 'encode') {
      if (originalEncoding === 'encoded') {
        suggestions.push(
          'Input appears to be already encoded - consider decoding first'
        );
      }

      if (options.type === 'component') {
        result = encodeUrlComponent(input);
      } else {
        result = encodeFullUrl(input);
      }
    } else {
      // decode
      if (originalEncoding === 'plain') {
        suggestions.push('Input appears to be plain text - no decoding needed');
      }

      if (options.type === 'component') {
        result = decodeUrlComponent(input, options.handlePlusAsSpace);
      } else {
        result = decodeFullUrl(input);
      }
    }

    // Generate metadata
    const metadata = {
      hasQueryParams: input.includes('?'),
      parameterCount: input.includes('?')
        ? input.split('?')[1]?.split('&').length || 0
        : 0,
      hasInternationalChars: /[^\x00-\x7F]/.test(input),
      hasSpecialChars: /[!@#$%^&*()+={}[\]|\\:";'<>?,./]/.test(input),
    };

    return {
      success: true,
      result,
      originalEncoding,
      detectedOperation: actualMode,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
      metadata,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      originalEncoding: detectEncoding(input),
    };
  }
}
