/**
 * Centralized constants for all tools
 * Eliminates magic numbers and inconsistent values
 */

// Timing constants
export const TIMING = {
  COPY_TIMEOUT: 2000,
  DEBOUNCE_MS: 300,
  PROCESSING_TIMEOUT: 5000,
  ANIMATION_DURATION: 150,
  AUTO_PROCESS_DELAY: 500,
  RETRY_DELAY_BASE: 1000,
} as const;

// Size limits
export const LIMITS = {
  MAX_INPUT_SIZE: 1024 * 1024, // 1MB
  MAX_OUTPUT_DISPLAY: 10000, // characters
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_UUID_COUNT: 100,
  MAX_PASSWORD_HISTORY: 10,
  MAX_HASH_ALGORITHMS: 6,
} as const;

// UI constants
export const UI = {
  DEFAULT_INDENT_SIZE: 2,
  DEFAULT_LINE_LENGTH: 76,
  TEXTAREA_HEIGHT: 200,
  MAX_VISIBLE_HEIGHT: 400,
  BORDER_RADIUS: 'rounded-lg',
  ANIMATION_CLASS: 'animate-slideIn',
} as const;

// Error messages
export const ERRORS = {
  INVALID_JSON: 'Invalid JSON format',
  INVALID_BASE64: 'Invalid Base64 string',
  INVALID_REGEX: 'Invalid regular expression',
  PROCESSING_FAILED: 'Processing failed',
  COPY_FAILED: 'Failed to copy to clipboard',
  DOWNLOAD_FAILED: 'Failed to download file',
  FILE_TOO_LARGE: 'File size exceeds limit',
  NETWORK_ERROR: 'Network error occurred',
  TIMEOUT_ERROR: 'Operation timed out',
} as const;

// Success messages
export const SUCCESS = {
  COPIED: 'Copied!',
  ALL_COPIED: 'All Copied!',
  DOWNLOADED: 'Downloaded successfully',
  PROCESSED: 'Processing completed',
  GENERATED: 'Generated successfully',
} as const;

// Regex patterns
export const PATTERNS = {
  BASE64: /^[A-Za-z0-9+/\-_]*={0,2}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/[^\s]+$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  HEX_COLOR: /^#([0-9a-f]{3}|[0-9a-f]{6})$/i,
} as const;

// File extensions mapping
export const FILE_EXTENSIONS = {
  'application/json': 'json',
  'text/plain': 'txt',
  'text/csv': 'csv',
  'application/xml': 'xml',
  'text/xml': 'xml',
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
  'application/pdf': 'pdf',
  'application/zip': 'zip',
} as const;

// Tool categories and colors
export const TOOL_COLORS = {
  'data-conversion': '#0EA5E9',
  'encoding-security': '#10B981',
  'text-format': '#8B5CF6',
  generators: '#F97316',
  'web-design': '#EC4899',
  'dev-utilities': '#F59E0B',
} as const;

// Performance thresholds
export const PERFORMANCE = {
  LARGE_INPUT_THRESHOLD: 50000,
  VIRTUALIZATION_THRESHOLD: 1000,
  MEMOIZATION_THRESHOLD: 100,
  WORKER_THRESHOLD: 100000,
} as const;

// Analytics events
export const ANALYTICS = {
  TOOL_USED: 'tool-used',
  TOOL_COPIED: 'tool-copied',
  TOOL_DOWNLOADED: 'tool-downloaded',
  TOOL_ERROR: 'tool-error',
  TOOL_SHARED: 'tool-shared',
} as const;

export default {
  TIMING,
  LIMITS,
  UI,
  ERRORS,
  SUCCESS,
  PATTERNS,
  FILE_EXTENSIONS,
  TOOL_COLORS,
  PERFORMANCE,
  ANALYTICS,
};
