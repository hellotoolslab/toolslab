/**
 * File Upload Validation Utilities
 *
 * Centralized security validations for file uploads across all tools.
 * Prevents common attacks like:
 * - Oversized files (DoS)
 * - Malicious file types (XSS, malware)
 * - Zip bombs
 * - Path traversal attacks
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Default maximum file size in bytes (10MB)
 */
export const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Allowed MIME types for different tool categories
 */
export const ALLOWED_MIME_TYPES = {
  // Text-based files
  text: [
    'text/plain',
    'text/csv',
    'text/html',
    'text/css',
    'text/javascript',
    'text/xml',
    'text/markdown',
    'application/json',
    'application/xml',
    'application/javascript',
    'application/x-yaml',
  ],

  // Image files
  images: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/bmp',
    'image/tiff',
  ],

  // Document files
  documents: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],

  // Data files
  data: [
    'application/json',
    'text/csv',
    'application/xml',
    'text/xml',
    'application/x-yaml',
    'text/yaml',
  ],

  // Email files
  email: ['message/rfc822', 'application/eml'],
} as const;

/**
 * Dangerous file extensions that should be blocked
 */
const DANGEROUS_EXTENSIONS = new Set([
  '.exe',
  '.dll',
  '.bat',
  '.cmd',
  '.msi',
  '.vbs',
  '.vbe',
  '.js',
  '.jse',
  '.ws',
  '.wsf',
  '.wsc',
  '.wsh',
  '.ps1',
  '.psm1',
  '.psd1',
  '.scr',
  '.hta',
  '.cpl',
  '.msc',
  '.jar',
  '.com',
  '.pif',
  '.application',
  '.gadget',
  '.msp',
  '.scf',
  '.lnk',
  '.inf',
  '.reg',
  '.sh',
  '.bash',
  '.zsh',
  '.php',
  '.php3',
  '.php4',
  '.php5',
  '.phtml',
  '.asp',
  '.aspx',
  '.py',
  '.pl',
  '.rb',
]);

// ============================================================================
// TYPES
// ============================================================================

export interface FileValidationOptions {
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Allowed MIME types */
  allowedTypes?: string[];
  /** Allow dangerous extensions (default: false) */
  allowDangerousExtensions?: boolean;
  /** Custom extension whitelist (overrides dangerous check) */
  allowedExtensions?: string[];
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  sanitizedName?: string;
  mimeType?: string;
  size?: number;
}

// ============================================================================
// MAIN VALIDATION FUNCTION
// ============================================================================

/**
 * Validates a file for security concerns.
 *
 * @param file - The File object to validate
 * @param options - Validation options
 * @returns Validation result with sanitized filename if valid
 *
 * @example
 * ```typescript
 * const result = validateFile(file, {
 *   maxSize: 5 * 1024 * 1024, // 5MB
 *   allowedTypes: ALLOWED_MIME_TYPES.images,
 * });
 *
 * if (!result.valid) {
 *   console.error(result.error);
 *   return;
 * }
 * ```
 */
export function validateFile(
  file: File,
  options: FileValidationOptions = {}
): FileValidationResult {
  const {
    maxSize = DEFAULT_MAX_FILE_SIZE,
    allowedTypes,
    allowDangerousExtensions = false,
    allowedExtensions,
  } = options;

  // 1. Check if file exists
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  // 2. Check file size
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File too large (${fileSizeMB}MB). Maximum allowed size is ${maxSizeMB}MB`,
    };
  }

  // 3. Check file size minimum (empty or nearly empty files)
  if (file.size === 0) {
    return { valid: false, error: 'File is empty' };
  }

  // 4. Sanitize and validate filename
  const sanitizedName = sanitizeFilename(file.name);
  if (!sanitizedName) {
    return { valid: false, error: 'Invalid filename' };
  }

  // 5. Check file extension
  const extension = getFileExtension(sanitizedName).toLowerCase();

  // Check against whitelist if provided
  if (allowedExtensions && allowedExtensions.length > 0) {
    const normalizedAllowed = allowedExtensions.map((ext) =>
      ext.startsWith('.') ? ext.toLowerCase() : `.${ext.toLowerCase()}`
    );
    if (!normalizedAllowed.includes(extension)) {
      return {
        valid: false,
        error: `File type not allowed. Allowed types: ${normalizedAllowed.join(', ')}`,
      };
    }
  } else if (!allowDangerousExtensions && DANGEROUS_EXTENSIONS.has(extension)) {
    // Check against dangerous extensions
    return {
      valid: false,
      error: `File type '${extension}' is not allowed for security reasons`,
    };
  }

  // 6. Check MIME type if whitelist provided
  if (allowedTypes && allowedTypes.length > 0) {
    const mimeValid = allowedTypes.some(
      (type) => file.type === type || file.type.startsWith(type.split('/')[0])
    );
    if (!mimeValid && file.type) {
      return {
        valid: false,
        error: `File type '${file.type}' is not allowed`,
      };
    }
  }

  return {
    valid: true,
    sanitizedName,
    mimeType: file.type,
    size: file.size,
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Sanitizes a filename to prevent path traversal and other attacks.
 *
 * @param filename - The original filename
 * @returns Sanitized filename or null if invalid
 */
export function sanitizeFilename(filename: string): string | null {
  if (!filename || typeof filename !== 'string') {
    return null;
  }

  // Remove path components (prevent path traversal)
  let sanitized = filename.replace(/^.*[/\\]/, '');

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');

  // Remove control characters
  // eslint-disable-next-line no-control-regex
  sanitized = sanitized.replace(/[\x00-\x1f\x80-\x9f]/g, '');

  // Remove dangerous characters
  sanitized = sanitized.replace(/[<>:"|?*]/g, '_');

  // Prevent hidden files (starting with .)
  if (sanitized.startsWith('.')) {
    sanitized = '_' + sanitized.slice(1);
  }

  // Limit length
  if (sanitized.length > 255) {
    const ext = getFileExtension(sanitized);
    const base = sanitized.slice(0, 255 - ext.length);
    sanitized = base + ext;
  }

  // Ensure not empty after sanitization
  if (!sanitized || sanitized === '.' || sanitized === '..') {
    return null;
  }

  return sanitized;
}

/**
 * Gets the file extension from a filename.
 *
 * @param filename - The filename
 * @returns File extension including the dot (e.g., '.txt')
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1 || lastDot === 0) {
    return '';
  }
  return filename.slice(lastDot);
}

/**
 * Checks if a file content looks like it might be a zip bomb.
 * Should be called after reading file content.
 *
 * @param compressedSize - Size of compressed data
 * @param decompressedSize - Size after decompression
 * @param maxRatio - Maximum allowed compression ratio (default: 100)
 * @returns true if file appears to be a zip bomb
 */
export function detectZipBomb(
  compressedSize: number,
  decompressedSize: number,
  maxRatio: number = 100
): boolean {
  if (compressedSize === 0) return true;
  return decompressedSize / compressedSize > maxRatio;
}

/**
 * Validates file content type by checking magic bytes.
 * More reliable than MIME type for security purposes.
 *
 * @param buffer - First few bytes of the file
 * @returns Detected file type or null if unknown
 */
export function detectFileTypeByMagicBytes(buffer: ArrayBuffer): string | null {
  const bytes = new Uint8Array(buffer.slice(0, 12));

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return 'image/png';
  }

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'image/jpeg';
  }

  // GIF: 47 49 46 38
  if (
    bytes[0] === 0x47 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x38
  ) {
    return 'image/gif';
  }

  // WEBP: 52 49 46 46 ... 57 45 42 50
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return 'image/webp';
  }

  // PDF: 25 50 44 46 (%PDF)
  if (
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46
  ) {
    return 'application/pdf';
  }

  // ZIP: 50 4B 03 04 or 50 4B 05 06 or 50 4B 07 08
  if (bytes[0] === 0x50 && bytes[1] === 0x4b) {
    return 'application/zip';
  }

  return null;
}

/**
 * Formats file size for display.
 *
 * @param bytes - Size in bytes
 * @returns Human-readable file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
