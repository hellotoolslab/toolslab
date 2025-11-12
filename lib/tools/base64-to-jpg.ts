export interface Base64ToJpgOptions {
  fileName?: string;
  validateJpegHeader?: boolean;
}

export interface Base64ToJpgResult {
  success: boolean;
  jpgBlob?: Blob;
  error?: string;
  fileName?: string;
  fileSize?: number;
  metadata?: {
    width?: number;
    height?: number;
    quality?: string;
  };
}

/**
 * Validates if a string is valid Base64 format
 */
export function isValidBase64(str: string): boolean {
  if (!str || str.length === 0) {
    return false;
  }

  // Remove whitespace
  const cleanStr = str.replace(/\s+/g, '');

  // Check if it's valid Base64 characters
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  return base64Regex.test(cleanStr);
}

/**
 * Checks if binary data is a valid JPEG image
 */
export function isJpegData(uint8Array: Uint8Array): {
  isJpeg: boolean;
  quality?: string;
} {
  // JPEG signature: FF D8 FF (Start of Image marker)
  // JPEG files end with FF D9 (End of Image marker)
  if (uint8Array.length < 3) {
    return { isJpeg: false };
  }

  // Check JPEG signature
  const hasJpegStart =
    uint8Array[0] === 0xff && uint8Array[1] === 0xd8 && uint8Array[2] === 0xff;

  if (!hasJpegStart) {
    return { isJpeg: false };
  }

  // Try to determine quality (simplified heuristic based on file size)
  let quality = 'Unknown';
  if (uint8Array.length > 0) {
    // Rough estimation: smaller files = lower quality
    const bytesPerPixel = uint8Array.length / 1000; // Rough estimate
    if (bytesPerPixel < 10) {
      quality = 'Low';
    } else if (bytesPerPixel < 30) {
      quality = 'Medium';
    } else {
      quality = 'High';
    }
  }

  return {
    isJpeg: true,
    quality,
  };
}

/**
 * Extracts JPEG metadata from binary data
 */
export function extractJpegMetadata(uint8Array: Uint8Array) {
  const metadata: {
    width?: number;
    height?: number;
    quality?: string;
  } = {};

  // JPEG uses SOF (Start of Frame) markers to store image dimensions
  // SOF markers: 0xFFC0 to 0xFFC3, 0xFFC5 to 0xFFC7, 0xFFC9 to 0xFFCB, 0xFFCD to 0xFFCF
  let i = 2; // Skip initial FF D8

  while (i < uint8Array.length - 8) {
    // Look for FF marker
    if (uint8Array[i] === 0xff) {
      const marker = uint8Array[i + 1];

      // Check if it's a SOF marker
      if (
        (marker >= 0xc0 && marker <= 0xc3) ||
        (marker >= 0xc5 && marker <= 0xc7) ||
        (marker >= 0xc9 && marker <= 0xcb) ||
        (marker >= 0xcd && marker <= 0xcf)
      ) {
        // SOF structure: FF marker, length (2 bytes), precision (1 byte), height (2 bytes), width (2 bytes)
        if (i + 9 < uint8Array.length) {
          metadata.height = (uint8Array[i + 5] << 8) | uint8Array[i + 6];
          metadata.width = (uint8Array[i + 7] << 8) | uint8Array[i + 8];
          break;
        }
      }

      // Skip to next marker
      const segmentLength = (uint8Array[i + 2] << 8) | uint8Array[i + 3];
      i += segmentLength + 2;
    } else {
      i++;
    }
  }

  // Estimate quality
  const jpegCheck = isJpegData(uint8Array);
  metadata.quality = jpegCheck.quality;

  return metadata;
}

/**
 * Converts Base64 string to JPEG Blob
 */
export function base64ToJpg(
  base64Data: string,
  options: Base64ToJpgOptions = {}
): Base64ToJpgResult {
  try {
    const { fileName = `jpeg-${Date.now()}.jpg`, validateJpegHeader = true } =
      options;

    // Clean Base64 string
    let cleanBase64 = base64Data.trim().replace(/\s+/g, '');

    // Remove data URL prefix if present
    if (cleanBase64.startsWith('data:')) {
      const commaIndex = cleanBase64.indexOf(',');
      if (commaIndex !== -1) {
        cleanBase64 = cleanBase64.substring(commaIndex + 1);
      }
    }

    // Validate Base64 format
    if (!isValidBase64(cleanBase64)) {
      return {
        success: false,
        error: 'Invalid Base64 format',
      };
    }

    // Decode Base64 to binary
    const binaryString = atob(cleanBase64);
    const uint8Array = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i) & 0xff;
    }

    // Validate JPEG header if required
    if (validateJpegHeader) {
      const jpegCheck = isJpegData(uint8Array);
      if (!jpegCheck.isJpeg) {
        return {
          success: false,
          error:
            'Data does not appear to be a JPEG image. Please check your Base64 string.',
        };
      }
    }

    // Extract metadata
    const metadata = extractJpegMetadata(uint8Array);

    // Create Blob
    const jpgBlob = new Blob([uint8Array], { type: 'image/jpeg' });

    return {
      success: true,
      jpgBlob,
      fileName,
      fileSize: uint8Array.length,
      metadata,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to convert Base64 to JPEG',
    };
  }
}

/**
 * Format file size to human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Estimate decoded size from Base64 string length
 */
export function estimateDecodedSize(base64Length: number): number {
  // Base64 encoding increases size by ~33%
  // So decoded size is roughly 3/4 of encoded size
  return Math.floor((base64Length * 3) / 4);
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
