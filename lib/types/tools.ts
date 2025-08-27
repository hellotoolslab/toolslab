/**
 * Base types for all tool components
 * Eliminates duplicate interface definitions across tools
 */

// Base props that every tool component receives
export interface BaseToolProps {
  categoryColor: string;
  initialInput?: string;
  onInputChange?: (input: string) => void;
  onOutputChange?: (output: string) => void;
}

// Common tool state pattern
export interface ToolState<TInput = string, TOutput = string> {
  input: TInput;
  output: TOutput;
  isProcessing: boolean;
  error: string | null;
}

// Tool processing result
export interface ToolProcessResult<T = string> {
  output: T;
  metadata?: Record<string, unknown>;
  suggestions?: string[];
  warnings?: string[];
}

// Tool validation result
export interface ToolValidationResult {
  isValid: boolean;
  error?: string;
  warnings?: string[];
}

// Tool configuration options
export interface ToolOptions {
  autoProcess?: boolean;
  debounceMs?: number;
  maxInputLength?: number;
  validateInput?: boolean;
}

// Tool metadata for analytics and insights
export interface ToolMetadata {
  processingTime?: number;
  inputSize: number;
  outputSize: number;
  success: boolean;
  errorType?: string;
}

// JSON-specific types to replace 'any'
export type JsonPrimitive = string | number | boolean | null;
export type JsonArray = JsonValue[];
export type JsonObject = { [key: string]: JsonValue };
export type JsonValue = JsonPrimitive | JsonArray | JsonObject;

// Hash algorithm types
export type HashAlgorithm =
  | 'SHA-1'
  | 'SHA-256'
  | 'SHA-384'
  | 'SHA-512'
  | 'MD5'
  | 'CRC32';

// UUID version types
export type UUIDVersion = 'v1' | 'v3' | 'v4' | 'v5';

// Base64 encoding types
export interface Base64Options {
  urlSafe?: boolean;
  lineBreaks?: boolean;
  lineLength?: number;
}

// Password generation options
export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  pronounceable?: boolean;
}

// Regex testing types
export interface RegexMatch {
  match: string;
  index: number;
  groups?: string[];
}

export interface RegexTestResult {
  matches: RegexMatch[];
  isValid: boolean;
  flags: string;
  global: boolean;
}

// Tool constants
export const TOOL_CONSTANTS = {
  DEFAULT_COPY_TIMEOUT: 2000,
  DEFAULT_DEBOUNCE_MS: 300,
  MAX_INPUT_SIZE: 1024 * 1024, // 1MB
  MAX_OUTPUT_DISPLAY: 10000, // characters
  MAX_PROCESSING_TIME: 5000, // 5 seconds
} as const;

// Error types for better error handling
export class ToolError extends Error {
  constructor(
    message: string,
    public readonly toolName: string,
    public readonly operation: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'ToolError';
  }
}

export class ValidationError extends ToolError {
  constructor(message: string, toolName: string, cause?: Error) {
    super(message, toolName, 'validation', cause);
    this.name = 'ValidationError';
  }
}

export class ProcessingError extends ToolError {
  constructor(message: string, toolName: string, cause?: Error) {
    super(message, toolName, 'processing', cause);
    this.name = 'ProcessingError';
  }
}
