export interface Base64ToWebpOptions {
  fileName?: string;
  validateWebpHeader?: boolean;
}

export interface Base64ToWebpResult {
  success: boolean;
  webpBlob?: Blob;
  error?: string;
  fileName?: string;
  fileSize?: number;
  metadata?: {
    width?: number;
    height?: number;
    hasAlpha?: boolean;
    isAnimated?: boolean;
    compressionType?: string;
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
 * Checks if binary data is a valid WebP image
 */
export function isWebpData(uint8Array: Uint8Array): {
  isWebp: boolean;
  hasAlpha?: boolean;
  isAnimated?: boolean;
  compressionType?: string;
} {
  // WebP signature: RIFF....WEBP
  // Bytes 0-3: "RIFF" (52 49 46 46)
  // Bytes 8-11: "WEBP" (57 45 42 50)
  if (uint8Array.length < 12) {
    return { isWebp: false };
  }

  // Check RIFF signature
  const hasRiffSignature =
    uint8Array[0] === 0x52 &&
    uint8Array[1] === 0x49 &&
    uint8Array[2] === 0x46 &&
    uint8Array[3] === 0x46;

  if (!hasRiffSignature) {
    return { isWebp: false };
  }

  // Check WEBP signature
  const hasWebpSignature =
    uint8Array[8] === 0x57 &&
    uint8Array[9] === 0x45 &&
    uint8Array[10] === 0x42 &&
    uint8Array[11] === 0x50;

  if (!hasWebpSignature) {
    return { isWebp: false };
  }

  // Try to determine format type
  let hasAlpha = false;
  let isAnimated = false;
  let compressionType = 'Unknown';

  if (uint8Array.length >= 16) {
    // Check for VP8L (lossless), VP8 (lossy), or VP8X (extended)
    const chunkType = String.fromCharCode(
      uint8Array[12],
      uint8Array[13],
      uint8Array[14],
      uint8Array[15]
    );

    if (chunkType === 'VP8L') {
      compressionType = 'Lossless';
      // VP8L typically has alpha
      hasAlpha = true;
    } else if (chunkType === 'VP8 ') {
      compressionType = 'Lossy';
    } else if (chunkType === 'VP8X') {
      compressionType = 'Extended';
      // VP8X can have alpha and animation flags
      if (uint8Array.length >= 21) {
        const flags = uint8Array[20];
        hasAlpha = (flags & 0x10) !== 0;
        isAnimated = (flags & 0x02) !== 0;
      }
    }
  }

  return {
    isWebp: true,
    hasAlpha,
    isAnimated,
    compressionType,
  };
}

/**
 * Extracts WebP metadata from binary data
 */
export function extractWebpMetadata(uint8Array: Uint8Array) {
  const metadata: {
    width?: number;
    height?: number;
    hasAlpha?: boolean;
    isAnimated?: boolean;
    compressionType?: string;
  } = {};

  if (uint8Array.length < 30) {
    return metadata;
  }

  // Get WebP format info
  const webpInfo = isWebpData(uint8Array);
  metadata.hasAlpha = webpInfo.hasAlpha;
  metadata.isAnimated = webpInfo.isAnimated;
  metadata.compressionType = webpInfo.compressionType;

  // Try to extract dimensions based on chunk type
  const chunkType = String.fromCharCode(
    uint8Array[12],
    uint8Array[13],
    uint8Array[14],
    uint8Array[15]
  );

  if (chunkType === 'VP8 ' && uint8Array.length >= 30) {
    // VP8 (lossy) format
    // Width and height are in bytes 26-29
    metadata.width = ((uint8Array[26] | (uint8Array[27] << 8)) & 0x3fff) + 1;
    metadata.height = ((uint8Array[28] | (uint8Array[29] << 8)) & 0x3fff) + 1;
  } else if (chunkType === 'VP8L' && uint8Array.length >= 25) {
    // VP8L (lossless) format
    // Width and height are encoded in bits
    const bits =
      uint8Array[21] |
      (uint8Array[22] << 8) |
      (uint8Array[23] << 16) |
      (uint8Array[24] << 24);
    metadata.width = (bits & 0x3fff) + 1;
    metadata.height = ((bits >> 14) & 0x3fff) + 1;
  } else if (chunkType === 'VP8X' && uint8Array.length >= 30) {
    // VP8X (extended) format
    // Canvas width and height (24-bit)
    metadata.width =
      1 + (uint8Array[24] | (uint8Array[25] << 8) | (uint8Array[26] << 16));
    metadata.height =
      1 + (uint8Array[27] | (uint8Array[28] << 8) | (uint8Array[29] << 16));
  }

  return metadata;
}

/**
 * Converts Base64 string to WebP Blob
 */
export function base64ToWebp(
  base64Data: string,
  options: Base64ToWebpOptions = {}
): Base64ToWebpResult {
  try {
    const { fileName = `webp-${Date.now()}.webp`, validateWebpHeader = true } =
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

    // Validate WebP header if required
    if (validateWebpHeader) {
      const webpCheck = isWebpData(uint8Array);
      if (!webpCheck.isWebp) {
        return {
          success: false,
          error:
            'Data does not appear to be a WebP image. Please check your Base64 string.',
        };
      }
    }

    // Extract metadata
    const metadata = extractWebpMetadata(uint8Array);

    // Create Blob
    const webpBlob = new Blob([uint8Array], { type: 'image/webp' });

    return {
      success: true,
      webpBlob,
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
          : 'Failed to convert Base64 to WebP',
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
