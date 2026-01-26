/**
 * Shared utilities for Base64 image conversion tools.
 * Provides sanitization, auto-correction, and format detection.
 */

export interface SanitizeResult {
  cleaned: string;
  corrections: string[];
  detectedFormat?: 'png' | 'gif' | 'jpeg' | 'webp' | 'unknown';
}

/**
 * Known image format signatures in decoded bytes
 */
const FORMAT_SIGNATURES: {
  format: 'png' | 'gif' | 'jpeg' | 'webp';
  base64Prefix: string;
  description: string;
}[] = [
  { format: 'png', base64Prefix: 'iVBORw0KGgo', description: 'PNG' },
  { format: 'gif', base64Prefix: 'R0lGOD', description: 'GIF' },
  { format: 'jpeg', base64Prefix: '/9j/', description: 'JPEG' },
  { format: 'webp', base64Prefix: 'UklGR', description: 'WebP' },
];

/**
 * Sanitizes and auto-corrects common user input errors in Base64 strings.
 * Applies multiple heuristics to clean up the input before validation/decoding.
 */
export function sanitizeBase64Input(raw: string): SanitizeResult {
  const corrections: string[] = [];
  let cleaned = raw;

  // 1. Remove BOM and zero-width characters
  const bomPattern = /^[\uFEFF\u200B\u200C\u200D\u2060]/;
  if (bomPattern.test(cleaned)) {
    cleaned = cleaned.replace(/[\uFEFF\u200B\u200C\u200D\u2060]/g, '');
    corrections.push('Removed invisible characters (BOM/zero-width)');
  }

  // 2. Strip wrapping quotes (from JSON copy, code snippets)
  const quotePattern = /^(['"`])([\s\S]*)\1$/;
  const quoteMatch = cleaned.trim().match(quotePattern);
  if (quoteMatch) {
    cleaned = quoteMatch[2];
    corrections.push('Removed wrapping quotes');
  }

  // 3. Strip PEM-style headers/footers
  const pemPattern =
    /-----BEGIN\s+[A-Z0-9\s]+-----\n?([\s\S]*?)\n?-----END\s+[A-Z0-9\s]+-----/;
  const pemMatch = cleaned.match(pemPattern);
  if (pemMatch) {
    cleaned = pemMatch[1];
    corrections.push('Removed PEM headers/footers');
  }

  // 4. Strip line numbers (e.g., "1: data", "  12\tdata", "001 data")
  const lines = cleaned.split('\n');
  const lineNumberPattern = /^\s*\d+[\s:|\t]+/;
  const linesWithNumbers = lines.filter(
    (line) => line.trim() && lineNumberPattern.test(line)
  );
  if (
    linesWithNumbers.length > 0 &&
    linesWithNumbers.length >= lines.filter((l) => l.trim()).length * 0.5
  ) {
    cleaned = lines
      .map((line) => line.replace(lineNumberPattern, ''))
      .join('\n');
    corrections.push('Removed line numbers');
  }

  // 5. Remove data URL prefix (handled here for consistency, tools also handle this)
  const dataUrlPattern = /^data:[^,]*;base64,/i;
  if (dataUrlPattern.test(cleaned.trim())) {
    cleaned = cleaned.trim().replace(dataUrlPattern, '');
    corrections.push('Removed data URL prefix');
  }

  // 6. Trim whitespace and remove all internal whitespace/newlines
  cleaned = cleaned.replace(/\s+/g, '');

  // 7. Convert URL-safe Base64 to standard Base64
  if (cleaned.includes('-') || cleaned.includes('_')) {
    const hasStandardChars = cleaned.includes('+') || cleaned.includes('/');
    // Only convert if it looks like URL-safe variant (has - or _ but not + or /)
    if (!hasStandardChars) {
      cleaned = cleaned.replace(/-/g, '+').replace(/_/g, '/');
      corrections.push('Converted URL-safe Base64 to standard format');
    }
  }

  // 8. Fix missing padding
  const paddingNeeded = (4 - (cleaned.length % 4)) % 4;
  if (paddingNeeded > 0 && paddingNeeded <= 2 && cleaned.length > 0) {
    // Only add padding if the string doesn't already end with =
    if (!cleaned.endsWith('=')) {
      cleaned += '='.repeat(paddingNeeded);
      corrections.push('Added missing Base64 padding');
    }
  }

  // 9. Detect format from the cleaned base64 prefix
  const detectedFormat = detectFormatFromBase64(cleaned);

  return { cleaned, corrections, detectedFormat };
}

/**
 * Detects the image format from the Base64-encoded data prefix.
 * This works by checking known base64 prefixes that correspond to file signatures.
 */
export function detectFormatFromBase64(
  base64String: string
): 'png' | 'gif' | 'jpeg' | 'webp' | 'unknown' {
  if (!base64String || base64String.length < 4) {
    return 'unknown';
  }

  for (const sig of FORMAT_SIGNATURES) {
    if (base64String.startsWith(sig.base64Prefix)) {
      return sig.format;
    }
  }

  return 'unknown';
}

/**
 * Returns a human-readable format name
 */
export function getFormatDisplayName(
  format: 'png' | 'gif' | 'jpeg' | 'webp' | 'unknown'
): string {
  const names: Record<string, string> = {
    png: 'PNG',
    gif: 'GIF',
    jpeg: 'JPEG',
    webp: 'WebP',
    unknown: 'Unknown',
  };
  return names[format] || 'Unknown';
}

/**
 * Validates if a string is valid Base64 format (shared implementation)
 */
export function isValidBase64(str: string): boolean {
  if (!str || str.length === 0) {
    return false;
  }

  const cleanStr = str.replace(/\s+/g, '');

  // Check if it's valid Base64 characters (with optional padding)
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  return base64Regex.test(cleanStr);
}

/**
 * Estimates decoded size from Base64 string, accounting for padding
 */
export function estimateDecodedSize(base64String: string): number {
  const cleanString = base64String.replace(/\s+/g, '');
  const paddingCount = (cleanString.match(/=/g) || []).length;
  const base64Length = cleanString.length;
  return Math.floor((base64Length * 3) / 4) - paddingCount;
}

/**
 * Format file size to human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Helper function to download a blob as a file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Maximum allowed Base64 input size (50MB encoded ≈ 37MB decoded)
 */
export const MAX_BASE64_INPUT_SIZE = 50 * 1024 * 1024;

/**
 * Checks if input exceeds the maximum size limit
 */
export function exceedsMaxSize(input: string): boolean {
  return input.length > MAX_BASE64_INPUT_SIZE;
}
