/**
 * Base64 to GIF Converter
 * Converts Base64 encoded data to GIF image files for download
 */

export interface Base64ToGifResult {
  success: boolean;
  error?: string;
  gifBlob?: Blob;
  fileSize?: number;
  fileName?: string;
  metadata?: {
    isGif: boolean;
    hasValidHeader: boolean;
    estimatedSize: number;
    version?: 'GIF87a' | 'GIF89a';
  };
}

export interface Base64ToGifOptions {
  fileName?: string;
  validateGifHeader?: boolean;
}

/**
 * Validates if a string is valid Base64
 */
export function isValidBase64(str: string): boolean {
  if (!str || str.length === 0) {
    return false;
  }

  // Remove whitespace and newlines
  const cleanStr = str.replace(/\s+/g, '');

  // Check if string contains only valid Base64 characters
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  if (!base64Regex.test(cleanStr)) {
    return false;
  }

  // Base64 padding is optional, so we don't strictly require length % 4 === 0
  // Just verify it's reasonable (padding can be omitted)
  return true;
}

/**
 * Checks if the decoded Base64 data represents a GIF file
 */
export function isGifData(uint8Array: Uint8Array): {
  isGif: boolean;
  version?: 'GIF87a' | 'GIF89a';
} {
  // GIF files start with "GIF87a" or "GIF89a"
  // GIF87a: [71, 73, 70, 56, 55, 97]
  // GIF89a: [71, 73, 70, 56, 57, 97]
  const gifHeader = [71, 73, 70]; // "GIF"

  if (uint8Array.length < 6) {
    return { isGif: false };
  }

  // Check "GIF" prefix
  for (let i = 0; i < gifHeader.length; i++) {
    if (uint8Array[i] !== gifHeader[i]) {
      return { isGif: false };
    }
  }

  // Check version
  if (uint8Array[3] === 56 && uint8Array[4] === 57 && uint8Array[5] === 97) {
    return { isGif: true, version: 'GIF89a' };
  }

  if (uint8Array[3] === 56 && uint8Array[4] === 55 && uint8Array[5] === 97) {
    return { isGif: true, version: 'GIF87a' };
  }

  return { isGif: false };
}

/**
 * Extracts basic metadata from GIF bytes
 */
export function extractGifMetadata(uint8Array: Uint8Array): {
  isGif: boolean;
  hasValidHeader: boolean;
  estimatedSize: number;
  version?: 'GIF87a' | 'GIF89a';
} {
  const { isGif, version } = isGifData(uint8Array);
  const hasValidHeader = isGif;
  const estimatedSize = uint8Array.length;

  return {
    isGif,
    hasValidHeader,
    estimatedSize,
    version,
  };
}

/**
 * Converts Base64 string to GIF file
 */
export function base64ToGif(
  base64Data: string,
  options: Base64ToGifOptions = {}
): Base64ToGifResult {
  try {
    // Clean input data
    let cleanBase64 = base64Data.trim();

    // Remove data URL prefix if present
    if (cleanBase64.startsWith('data:')) {
      const commaIndex = cleanBase64.indexOf(',');
      if (commaIndex !== -1) {
        cleanBase64 = cleanBase64.substring(commaIndex + 1);
      }
    }

    // Remove whitespace and newlines
    cleanBase64 = cleanBase64.replace(/\s+/g, '');

    // Validate Base64 format
    if (!isValidBase64(cleanBase64)) {
      return {
        success: false,
        error:
          'Invalid Base64 format. Please ensure your data contains only valid Base64 characters.',
      };
    }

    // Decode Base64 to binary data using proper method
    let uint8Array: Uint8Array;
    try {
      if (typeof window !== 'undefined' && typeof window.atob === 'function') {
        // Browser environment - use atob with proper binary conversion
        const binaryString = atob(cleanBase64);
        const buffer = new ArrayBuffer(binaryString.length);
        uint8Array = new Uint8Array(buffer);
        for (let i = 0; i < binaryString.length; i++) {
          // Use bitwise AND to ensure we only get the lower 8 bits
          // This handles characters with codes > 255 correctly
          uint8Array[i] = binaryString.charCodeAt(i) & 0xff;
        }
      } else {
        // Node.js environment fallback
        const buffer = Buffer.from(cleanBase64, 'base64');
        uint8Array = new Uint8Array(buffer);
      }
    } catch (error) {
      return {
        success: false,
        error:
          'Failed to decode Base64 data. The data may be corrupted or incomplete.',
      };
    }

    // Extract metadata
    const metadata = extractGifMetadata(uint8Array);

    // Validate GIF header if requested
    if (options.validateGifHeader !== false && !metadata.isGif) {
      return {
        success: false,
        error:
          'The decoded data does not appear to be a valid GIF file. GIF files should start with "GIF87a" or "GIF89a" header.',
        metadata,
      };
    }

    // Create GIF blob - create a copy of the bytes
    const gifBlob = new Blob([uint8Array.slice()], { type: 'image/gif' });

    // Generate filename
    const fileName = options.fileName || `image_${Date.now()}.gif`;

    return {
      success: true,
      gifBlob,
      fileSize: uint8Array.length,
      fileName,
      metadata,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred during conversion.',
    };
  }
}

/**
 * Downloads a blob as a file
 */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Formats file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Estimates Base64 decoded size
 */
export function estimateDecodedSize(base64String: string): number {
  // Remove whitespace
  const cleanString = base64String.replace(/\s+/g, '');

  // Each Base64 character represents 6 bits, so 4 characters = 3 bytes
  // Account for padding
  const paddingCount = (cleanString.match(/=/g) || []).length;
  const base64Length = cleanString.length;

  return Math.floor((base64Length * 3) / 4) - paddingCount;
}
