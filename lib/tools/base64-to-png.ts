export interface Base64ToPngOptions {
  fileName?: string;
  validatePngHeader?: boolean;
}

export interface Base64ToPngResult {
  success: boolean;
  pngBlob?: Blob;
  error?: string;
  fileName?: string;
  fileSize?: number;
  metadata?: {
    width?: number;
    height?: number;
    colorType?: string;
    bitDepth?: number;
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
 * Checks if binary data is a valid PNG image
 */
export function isPngData(uint8Array: Uint8Array): {
  isPng: boolean;
  colorType?: string;
  bitDepth?: number;
} {
  // PNG signature: 89 50 4E 47 0D 0A 1A 0A (8 bytes)
  const pngSignature = [137, 80, 78, 71, 13, 10, 26, 10];

  if (uint8Array.length < 8) {
    return { isPng: false };
  }

  // Check PNG signature
  for (let i = 0; i < 8; i++) {
    if (uint8Array[i] !== pngSignature[i]) {
      return { isPng: false };
    }
  }

  // Try to extract basic metadata from IHDR chunk (if present)
  if (uint8Array.length >= 24) {
    const bitDepth = uint8Array[24];
    const colorTypeValue = uint8Array[25];

    const colorTypes: { [key: number]: string } = {
      0: 'Grayscale',
      2: 'Truecolor',
      3: 'Indexed',
      4: 'Grayscale with Alpha',
      6: 'Truecolor with Alpha',
    };

    return {
      isPng: true,
      bitDepth,
      colorType: colorTypes[colorTypeValue] || 'Unknown',
    };
  }

  return { isPng: true };
}

/**
 * Extracts PNG metadata from binary data
 */
export function extractPngMetadata(uint8Array: Uint8Array) {
  const metadata: {
    width?: number;
    height?: number;
    bitDepth?: number;
    colorType?: string;
  } = {};

  // PNG IHDR chunk starts at byte 12 (after signature and chunk length)
  if (uint8Array.length >= 24) {
    // Width (4 bytes, big-endian)
    metadata.width =
      (uint8Array[16] << 24) |
      (uint8Array[17] << 16) |
      (uint8Array[18] << 8) |
      uint8Array[19];

    // Height (4 bytes, big-endian)
    metadata.height =
      (uint8Array[20] << 24) |
      (uint8Array[21] << 16) |
      (uint8Array[22] << 8) |
      uint8Array[23];

    // Bit depth
    metadata.bitDepth = uint8Array[24];

    // Color type
    const colorTypeValue = uint8Array[25];
    const colorTypes: { [key: number]: string } = {
      0: 'Grayscale',
      2: 'Truecolor',
      3: 'Indexed',
      4: 'Grayscale with Alpha',
      6: 'Truecolor with Alpha',
    };
    metadata.colorType = colorTypes[colorTypeValue] || 'Unknown';
  }

  return metadata;
}

/**
 * Converts Base64 string to PNG Blob
 */
export function base64ToPng(
  base64Data: string,
  options: Base64ToPngOptions = {}
): Base64ToPngResult {
  try {
    const { fileName = `png-${Date.now()}.png`, validatePngHeader = true } =
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

    // Validate PNG header if required
    if (validatePngHeader) {
      const pngCheck = isPngData(uint8Array);
      if (!pngCheck.isPng) {
        return {
          success: false,
          error:
            'Data does not appear to be a PNG image. Please check your Base64 string.',
        };
      }
    }

    // Extract metadata
    const metadata = extractPngMetadata(uint8Array);

    // Create Blob
    const pngBlob = new Blob([uint8Array], { type: 'image/png' });

    return {
      success: true,
      pngBlob,
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
          : 'Failed to convert Base64 to PNG',
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
