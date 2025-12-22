/**
 * Binary to Text Converter
 * Converts binary numbers to text and vice versa
 * Supports ASCII, UTF-8, and hexadecimal formats
 */

export type ConversionMode = 'binary-to-text' | 'text-to-binary';
export type OutputFormat = 'text' | 'hex' | 'decimal';
export type InputFormat = 'binary' | 'hex' | 'decimal';

export interface BinaryToTextOptions {
  mode: ConversionMode;
  inputFormat?: InputFormat;
  outputFormat?: OutputFormat;
  spaceSeparated?: boolean; // For binary output, add spaces between bytes
  preserveLineBreaks?: boolean;
}

export interface BinaryToTextResult {
  success: boolean;
  result: string;
  originalLength: number;
  resultLength: number;
  bytesProcessed?: number;
  error?: string;
}

/**
 * Validate if a string is valid binary (only 0s and 1s)
 */
export function isValidBinary(input: string): boolean {
  // Remove spaces and check if only 0s and 1s remain
  const cleaned = input.replace(/\s/g, '');
  return /^[01]+$/.test(cleaned);
}

/**
 * Validate if a string is valid hexadecimal
 */
export function isValidHex(input: string): boolean {
  // Remove spaces, 0x prefix, and check if only hex chars remain
  const cleaned = input.replace(/\s/g, '').replace(/^0x/i, '');
  return /^[0-9A-Fa-f]+$/.test(cleaned);
}

/**
 * Convert binary string to text (ASCII/UTF-8)
 */
export function binaryToText(
  binary: string,
  options: Partial<BinaryToTextOptions> = {}
): BinaryToTextResult {
  try {
    if (!binary || binary.trim() === '') {
      return {
        success: true,
        result: '',
        originalLength: 0,
        resultLength: 0,
        bytesProcessed: 0,
      };
    }

    // Clean the input - remove spaces and newlines
    const cleanBinary = binary.replace(/\s/g, '');

    // Validate binary input
    if (!isValidBinary(cleanBinary)) {
      return {
        success: false,
        result: '',
        originalLength: binary.length,
        resultLength: 0,
        error: 'Invalid binary input. Only 0s and 1s are allowed.',
      };
    }

    // Pad to make length multiple of 8
    const paddedBinary = cleanBinary.padStart(
      Math.ceil(cleanBinary.length / 8) * 8,
      '0'
    );

    // Split into 8-bit chunks and convert to characters
    const bytes: number[] = [];
    for (let i = 0; i < paddedBinary.length; i += 8) {
      const byte = paddedBinary.substring(i, i + 8);
      bytes.push(parseInt(byte, 2));
    }

    // Convert bytes to string based on output format
    const { outputFormat = 'text' } = options;
    let result: string;

    if (outputFormat === 'hex') {
      result = bytes
        .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
        .join(' ');
    } else if (outputFormat === 'decimal') {
      result = bytes.join(' ');
    } else {
      // Default: text
      result = String.fromCharCode(...bytes);
    }

    return {
      success: true,
      result,
      originalLength: binary.length,
      resultLength: result.length,
      bytesProcessed: bytes.length,
    };
  } catch (error) {
    return {
      success: false,
      result: '',
      originalLength: binary.length,
      resultLength: 0,
      error:
        error instanceof Error
          ? error.message
          : 'Binary to text conversion failed',
    };
  }
}

/**
 * Convert text to binary string
 */
export function textToBinary(
  text: string,
  options: Partial<BinaryToTextOptions> = {}
): BinaryToTextResult {
  try {
    if (!text || text === '') {
      return {
        success: true,
        result: '',
        originalLength: 0,
        resultLength: 0,
        bytesProcessed: 0,
      };
    }

    const { spaceSeparated = true, preserveLineBreaks = true } = options;

    // Convert each character to binary
    const binaryArray: string[] = [];

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const code = char.charCodeAt(0);

      // Handle multi-byte UTF-8 characters
      if (code > 127) {
        // Convert to UTF-8 bytes
        const utf8Bytes = new TextEncoder().encode(char);
        utf8Bytes.forEach((byte) => {
          binaryArray.push(byte.toString(2).padStart(8, '0'));
        });
      } else {
        binaryArray.push(code.toString(2).padStart(8, '0'));
      }
    }

    const result = spaceSeparated
      ? binaryArray.join(' ')
      : binaryArray.join('');

    return {
      success: true,
      result,
      originalLength: text.length,
      resultLength: result.length,
      bytesProcessed: binaryArray.length,
    };
  } catch (error) {
    return {
      success: false,
      result: '',
      originalLength: text.length,
      resultLength: 0,
      error:
        error instanceof Error
          ? error.message
          : 'Text to binary conversion failed',
    };
  }
}

/**
 * Convert hexadecimal to binary
 */
export function hexToBinary(
  hex: string,
  options: Partial<BinaryToTextOptions> = {}
): BinaryToTextResult {
  try {
    if (!hex || hex.trim() === '') {
      return {
        success: true,
        result: '',
        originalLength: 0,
        resultLength: 0,
        bytesProcessed: 0,
      };
    }

    // Clean hex input - remove spaces and 0x prefix
    const cleanHex = hex.replace(/\s/g, '').replace(/^0x/i, '');

    if (!isValidHex(cleanHex)) {
      return {
        success: false,
        result: '',
        originalLength: hex.length,
        resultLength: 0,
        error: 'Invalid hexadecimal input.',
      };
    }

    const { spaceSeparated = true } = options;

    // Pad to make length even
    const paddedHex = cleanHex.length % 2 === 0 ? cleanHex : '0' + cleanHex;

    // Convert each hex pair to binary
    const binaryArray: string[] = [];
    for (let i = 0; i < paddedHex.length; i += 2) {
      const hexPair = paddedHex.substring(i, i + 2);
      const decimal = parseInt(hexPair, 16);
      binaryArray.push(decimal.toString(2).padStart(8, '0'));
    }

    const result = spaceSeparated
      ? binaryArray.join(' ')
      : binaryArray.join('');

    return {
      success: true,
      result,
      originalLength: hex.length,
      resultLength: result.length,
      bytesProcessed: binaryArray.length,
    };
  } catch (error) {
    return {
      success: false,
      result: '',
      originalLength: hex.length,
      resultLength: 0,
      error:
        error instanceof Error
          ? error.message
          : 'Hex to binary conversion failed',
    };
  }
}

/**
 * Convert binary to hexadecimal
 */
export function binaryToHex(
  binary: string,
  options: Partial<BinaryToTextOptions> = {}
): BinaryToTextResult {
  try {
    if (!binary || binary.trim() === '') {
      return {
        success: true,
        result: '',
        originalLength: 0,
        resultLength: 0,
        bytesProcessed: 0,
      };
    }

    // Clean binary input
    const cleanBinary = binary.replace(/\s/g, '');

    if (!isValidBinary(cleanBinary)) {
      return {
        success: false,
        result: '',
        originalLength: binary.length,
        resultLength: 0,
        error: 'Invalid binary input. Only 0s and 1s are allowed.',
      };
    }

    const { spaceSeparated = true } = options;

    // Pad to make length multiple of 8
    const paddedBinary = cleanBinary.padStart(
      Math.ceil(cleanBinary.length / 8) * 8,
      '0'
    );

    // Convert each 8-bit chunk to hex
    const hexArray: string[] = [];
    for (let i = 0; i < paddedBinary.length; i += 8) {
      const byte = paddedBinary.substring(i, i + 8);
      const decimal = parseInt(byte, 2);
      hexArray.push(decimal.toString(16).padStart(2, '0').toUpperCase());
    }

    const result = spaceSeparated ? hexArray.join(' ') : hexArray.join('');

    return {
      success: true,
      result,
      originalLength: binary.length,
      resultLength: result.length,
      bytesProcessed: hexArray.length,
    };
  } catch (error) {
    return {
      success: false,
      result: '',
      originalLength: binary.length,
      resultLength: 0,
      error:
        error instanceof Error
          ? error.message
          : 'Binary to hex conversion failed',
    };
  }
}

/**
 * Convert hexadecimal to text
 */
export function hexToText(hex: string): BinaryToTextResult {
  try {
    if (!hex || hex.trim() === '') {
      return {
        success: true,
        result: '',
        originalLength: 0,
        resultLength: 0,
        bytesProcessed: 0,
      };
    }

    // Clean hex input
    const cleanHex = hex.replace(/\s/g, '').replace(/^0x/i, '');

    if (!isValidHex(cleanHex)) {
      return {
        success: false,
        result: '',
        originalLength: hex.length,
        resultLength: 0,
        error: 'Invalid hexadecimal input.',
      };
    }

    // Pad to make length even
    const paddedHex = cleanHex.length % 2 === 0 ? cleanHex : '0' + cleanHex;

    // Convert each hex pair to character
    const bytes: number[] = [];
    for (let i = 0; i < paddedHex.length; i += 2) {
      const hexPair = paddedHex.substring(i, i + 2);
      bytes.push(parseInt(hexPair, 16));
    }

    const result = String.fromCharCode(...bytes);

    return {
      success: true,
      result,
      originalLength: hex.length,
      resultLength: result.length,
      bytesProcessed: bytes.length,
    };
  } catch (error) {
    return {
      success: false,
      result: '',
      originalLength: hex.length,
      resultLength: 0,
      error:
        error instanceof Error
          ? error.message
          : 'Hex to text conversion failed',
    };
  }
}

/**
 * Convert text to hexadecimal
 */
export function textToHex(
  text: string,
  options: Partial<BinaryToTextOptions> = {}
): BinaryToTextResult {
  try {
    if (!text || text === '') {
      return {
        success: true,
        result: '',
        originalLength: 0,
        resultLength: 0,
        bytesProcessed: 0,
      };
    }

    const { spaceSeparated = true } = options;

    // Convert each character to hex
    const hexArray: string[] = [];

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const code = char.charCodeAt(0);

      // Handle multi-byte UTF-8 characters
      if (code > 127) {
        const utf8Bytes = new TextEncoder().encode(char);
        utf8Bytes.forEach((byte) => {
          hexArray.push(byte.toString(16).padStart(2, '0').toUpperCase());
        });
      } else {
        hexArray.push(code.toString(16).padStart(2, '0').toUpperCase());
      }
    }

    const result = spaceSeparated ? hexArray.join(' ') : hexArray.join('');

    return {
      success: true,
      result,
      originalLength: text.length,
      resultLength: result.length,
      bytesProcessed: hexArray.length,
    };
  } catch (error) {
    return {
      success: false,
      result: '',
      originalLength: text.length,
      resultLength: 0,
      error:
        error instanceof Error
          ? error.message
          : 'Text to hex conversion failed',
    };
  }
}

/**
 * Auto-detect input format (binary, hex, or text)
 */
export function detectInputFormat(input: string): 'binary' | 'hex' | 'text' {
  const trimmed = input.trim();

  // Check for hex prefix
  if (trimmed.toLowerCase().startsWith('0x')) {
    return 'hex';
  }

  // Check if it's valid binary
  const nospaces = trimmed.replace(/\s/g, '');
  if (/^[01]+$/.test(nospaces) && nospaces.length >= 8) {
    return 'binary';
  }

  // Check if it looks like hex (only hex chars and spaces)
  if (
    /^[0-9A-Fa-f\s]+$/.test(trimmed) &&
    nospaces.length >= 2 &&
    nospaces.length % 2 === 0
  ) {
    // Additional check: if all groups are 2 chars separated by spaces, likely hex
    const groups = trimmed.split(/\s+/).filter((g) => g.length > 0);
    if (groups.every((g) => g.length === 2 && /^[0-9A-Fa-f]+$/.test(g))) {
      return 'hex';
    }
  }

  return 'text';
}

/**
 * Get statistics about the conversion
 */
export interface ConversionStats {
  inputChars: number;
  outputChars: number;
  bytesProcessed: number;
  compressionRatio: number;
}

export function getConversionStats(
  input: string,
  output: string,
  bytesProcessed: number
): ConversionStats {
  const inputChars = input.length;
  const outputChars = output.length;
  const compressionRatio = inputChars > 0 ? outputChars / inputChars : 0;

  return {
    inputChars,
    outputChars,
    bytesProcessed,
    compressionRatio,
  };
}
