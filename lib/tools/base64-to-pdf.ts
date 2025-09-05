/**
 * Base64 to PDF Converter
 * Converts Base64 encoded data to PDF files for download
 */

export interface Base64ToPdfResult {
  success: boolean;
  error?: string;
  pdfBlob?: Blob;
  fileSize?: number;
  fileName?: string;
  metadata?: {
    isPdf: boolean;
    hasValidHeader: boolean;
    estimatedSize: number;
  };
}

export interface Base64ToPdfOptions {
  fileName?: string;
  validatePdfHeader?: boolean;
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

  // Check if length is valid (multiple of 4)
  if (cleanStr.length % 4 !== 0) {
    return false;
  }

  return true;
}

/**
 * Checks if the decoded Base64 data represents a PDF file
 */
export function isPdfData(uint8Array: Uint8Array): boolean {
  // PDF files start with "%PDF-" which is [37, 80, 68, 70, 45] in bytes
  const pdfHeader = [37, 80, 68, 70, 45]; // %PDF-

  if (uint8Array.length < pdfHeader.length) {
    return false;
  }

  for (let i = 0; i < pdfHeader.length; i++) {
    if (uint8Array[i] !== pdfHeader[i]) {
      return false;
    }
  }

  return true;
}

/**
 * Extracts basic metadata from PDF bytes
 */
export function extractPdfMetadata(uint8Array: Uint8Array): {
  isPdf: boolean;
  hasValidHeader: boolean;
  estimatedSize: number;
} {
  const isPdf = isPdfData(uint8Array);
  const hasValidHeader = isPdf;
  const estimatedSize = uint8Array.length;

  return {
    isPdf,
    hasValidHeader,
    estimatedSize,
  };
}

/**
 * Converts Base64 string to PDF file
 */
export function base64ToPdf(
  base64Data: string,
  options: Base64ToPdfOptions = {}
): Base64ToPdfResult {
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
    const metadata = extractPdfMetadata(uint8Array);

    // Validate PDF header if requested
    if (options.validatePdfHeader !== false && !metadata.isPdf) {
      return {
        success: false,
        error:
          'The decoded data does not appear to be a valid PDF file. PDF files should start with "%PDF-" header.',
        metadata,
      };
    }

    // Create PDF blob - create a copy of the bytes
    const pdfBlob = new Blob([uint8Array.slice()], { type: 'application/pdf' });

    // Generate filename
    const fileName = options.fileName || `document_${Date.now()}.pdf`;

    return {
      success: true,
      pdfBlob,
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
