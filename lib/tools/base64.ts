/**
 * Base64 Encoder/Decoder Tool
 * Handles encoding and decoding of Base64 strings with support for files, URL-safe encoding, and MIME formatting
 */

export interface Base64Options {
  urlSafe?: boolean;
  lineBreaks?: boolean;
  lineLength?: number;
}

export interface FileProcessResult {
  base64: string;
  mimeType: string;
  fileName: string;
  size: number;
  dataURL?: string;
}

export interface Base64ProcessResult {
  output: string;
  isBase64Input: boolean;
  operation: 'encode' | 'decode';
  mimeType?: string;
  isDataURL?: boolean;
  suggestions?: string[];
}

/**
 * Encodes a string to Base64
 */
export function encodeBase64(input: string): string {
  if (!input) return '';

  try {
    return btoa(unescape(encodeURIComponent(input)));
  } catch (error) {
    throw new Error('Failed to encode string to Base64');
  }
}

/**
 * Decodes a Base64 string
 */
export function decodeBase64(input: string): string {
  if (!input) return '';

  // Remove whitespace and line breaks
  const cleanInput = input.replace(/\s/g, '');

  // Validate Base64
  if (!isValidBase64(cleanInput)) {
    throw new Error('Invalid Base64 string');
  }

  try {
    return decodeURIComponent(escape(atob(cleanInput)));
  } catch (error) {
    throw new Error('Failed to decode Base64 string');
  }
}

/**
 * Encodes a string to URL-safe Base64 (replaces + with -, / with _, removes padding)
 */
export function encodeBase64URLSafe(input: string): string {
  const base64 = encodeBase64(input);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Decodes URL-safe Base64
 */
export function decodeBase64URLSafe(input: string): string {
  let base64 = input.replace(/-/g, '+').replace(/_/g, '/');

  // Add padding if needed
  const padding = 4 - (base64.length % 4);
  if (padding !== 4) {
    base64 += '='.repeat(padding);
  }

  return decodeBase64(base64);
}

/**
 * Detects if a string is likely Base64 encoded
 */
export function detectBase64(input: string): boolean {
  if (!input) return false;

  // Check for data URL format
  if (input.startsWith('data:') && input.includes('base64,')) {
    return true;
  }

  // Remove whitespace for validation
  const clean = input.replace(/\s/g, '');

  // Must be at least 4 characters
  if (clean.length < 4) return false;

  // Quick heuristic checks before full validation
  const base64Chars = /^[A-Za-z0-9+/\-_]*={0,2}$/;
  if (!base64Chars.test(clean)) {
    return false;
  }

  // Check if it looks like a typical word or sentence (common non-Base64 text)
  if (/^[a-zA-Z\s]+$/.test(input)) {
    // Contains spaces - likely not Base64
    if (input.includes(' ')) {
      return false;
    }

    const hasUpperLower = /[a-z]/.test(input) && /[A-Z]/.test(input);
    const hasNumbers = /[0-9]/.test(input);
    const hasSpecialChars = /[+/=\-_]/.test(input);

    // If it's just letters without mixed case, numbers, or special chars, likely not Base64
    if (!hasUpperLower && !hasNumbers && !hasSpecialChars) {
      return false;
    }
  }

  return isValidBase64(clean);
}

/**
 * Validates if a string is valid Base64
 */
export function isValidBase64(input: string): boolean {
  if (!input) return true; // Empty string is valid

  const clean = input.replace(/\s/g, '');

  // Base64 regex pattern (including URL-safe characters)
  const base64Regex = /^[A-Za-z0-9+/\-_]*={0,2}$/;

  if (!base64Regex.test(clean)) {
    return false;
  }

  // For unpadded Base64, length should be valid when padded
  let testString = clean;
  const remainder = testString.length % 4;
  if (remainder) {
    testString += '='.repeat(4 - remainder);
  }

  try {
    // Try to decode to verify validity
    atob(testString.replace(/-/g, '+').replace(/_/g, '/'));
    return true;
  } catch {
    return false;
  }
}

/**
 * Formats Base64 string with line breaks (MIME format)
 */
export function formatWithLineBreaks(
  input: string,
  lineLength: number = 76
): string {
  if (!input || input.length <= lineLength) {
    return input;
  }

  const lines: string[] = [];
  for (let i = 0; i < input.length; i += lineLength) {
    lines.push(input.slice(i, i + lineLength));
  }

  return lines.join('\n');
}

/**
 * Processes a file and converts it to Base64
 */
export function processFile(
  file: File,
  maxSize: number = 10 * 1024 * 1024 // 10MB default limit
): Promise<FileProcessResult> {
  return new Promise((resolve, reject) => {
    if (file.size > maxSize) {
      reject(
        new Error(
          `File size exceeds limit of ${Math.round(maxSize / 1024 / 1024)}MB`
        )
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (!result) {
        reject(new Error('Failed to read file'));
        return;
      }

      // Extract Base64 from data URL
      const base64 = result.split(',')[1] || '';
      const mimeType = file.type || 'application/octet-stream';

      const processResult: FileProcessResult = {
        base64,
        mimeType,
        fileName: file.name,
        size: file.size,
      };

      // Add data URL for images
      if (mimeType.startsWith('image/')) {
        processResult.dataURL = result;
      }

      resolve(processResult);
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Creates a data URL from Base64 string and MIME type
 */
export function getDataURLFromBase64(
  base64: string,
  mimeType: string = 'application/octet-stream'
): string {
  return `data:${mimeType};base64,${base64}`;
}

/**
 * Extracts MIME type from data URL
 */
export function extractMimeType(dataUrl: string): string | null {
  const match = dataUrl.match(/^data:([^;,]+)/);
  return match ? match[1] : null;
}

/**
 * Main processing function that auto-detects operation
 */
export function processBase64Input(
  input: string,
  options: Base64Options = {},
  forceOperation?: 'encode' | 'decode'
): Base64ProcessResult {
  if (!input.trim()) {
    return {
      output: '',
      isBase64Input: false,
      operation: 'encode',
      suggestions: [],
    };
  }

  const isBase64Input = detectBase64(input);
  let operation: 'encode' | 'decode';
  let output: string;
  let mimeType: string | undefined;
  let isDataURL = false;
  const suggestions: string[] = [];

  // Determine operation
  if (forceOperation) {
    operation = forceOperation;
  } else {
    operation = isBase64Input ? 'decode' : 'encode';
  }

  try {
    if (operation === 'decode') {
      // Handle data URL
      if (input.startsWith('data:') && input.includes('base64,')) {
        isDataURL = true;
        mimeType = extractMimeType(input) || undefined;
        const base64Part = input.split('base64,')[1];

        if (options.urlSafe) {
          output = decodeBase64URLSafe(base64Part);
        } else {
          output = decodeBase64(base64Part);
        }
      } else {
        if (options.urlSafe) {
          output = decodeBase64URLSafe(input);
        } else {
          output = decodeBase64(input);
        }
      }

      // Add suggestions based on decoded content
      try {
        const parsed = JSON.parse(output);
        if (parsed && typeof parsed === 'object') {
          suggestions.push(
            'This looks like JSON - try the JSON Formatter tool'
          );
        }
      } catch {
        // Not JSON, continue
      }

      // Check if it looks like a JWT payload
      if (input.includes('.') && !input.startsWith('data:')) {
        suggestions.push(
          'This might be part of a JWT token - try the JWT Decoder tool'
        );
      }
    } else {
      // Encoding
      if (options.urlSafe) {
        output = encodeBase64URLSafe(input);
      } else {
        output = encodeBase64(input);
      }

      // Apply line breaks if requested
      if (options.lineBreaks) {
        output = formatWithLineBreaks(output, options.lineLength);
      }

      // Add suggestions for encoded content
      if (input.length > 1000) {
        suggestions.push(
          'For large content, consider using line breaks for MIME compatibility'
        );
      }
    }

    return {
      output,
      isBase64Input,
      operation,
      mimeType,
      isDataURL,
      suggestions,
    };
  } catch (error) {
    throw new Error(
      `${operation === 'encode' ? 'Encoding' : 'Decoding'} failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Downloads content as file
 */
export function downloadAsFile(
  content: string,
  filename: string,
  mimeType: string = 'text/plain'
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

/**
 * Downloads Base64 as binary file
 */
export function downloadBase64AsBinary(
  base64: string,
  filename: string,
  mimeType: string = 'application/octet-stream'
): void {
  try {
    const binaryString = atob(base64.replace(/\s/g, ''));
    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([bytes], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error(
      'Failed to download binary file: ' +
        (error instanceof Error ? error.message : 'Unknown error')
    );
  }
}

/**
 * Gets appropriate file extension from MIME type
 */
export function getFileExtensionFromMimeType(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    'text/plain': 'txt',
    'application/json': 'json',
    'text/html': 'html',
    'text/css': 'css',
    'application/javascript': 'js',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
    'application/pdf': 'pdf',
    'application/zip': 'zip',
    'application/xml': 'xml',
    'text/xml': 'xml',
    'text/csv': 'csv',
  };

  return mimeToExt[mimeType] || 'bin';
}
