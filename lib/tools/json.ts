export interface ToolResult {
  success: boolean;
  result?: string;
  error?: string;
  line?: number;
  warnings?: string[];
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  line?: number;
  warnings?: string[];
}

/**
 * Formats JSON with proper indentation
 */
export function formatJSON(input: string): ToolResult {
  try {
    // Handle edge cases
    if (!input) {
      return { success: false, error: 'Invalid input' };
    }

    if (input === null || input === undefined) {
      return { success: false, error: 'Invalid input' };
    }

    // Clean and parse the input
    const cleanInput = input.trim();
    if (!cleanInput) {
      return { success: false, error: 'Empty input' };
    }

    // For very large inputs, we might need to handle them differently
    const parsed = JSON.parse(cleanInput);
    const formatted = JSON.stringify(parsed, null, 2);

    return {
      success: true,
      result: formatted,
    };
  } catch (error: any) {
    const errorMessage = error.message || 'Unknown error';

    // Handle stack overflow or deep nesting issues
    if (
      errorMessage.includes('Maximum call stack') ||
      errorMessage.includes('stack overflow')
    ) {
      return {
        success: false,
        error: 'JSON nesting too deep - maximum depth exceeded',
      };
    }

    // Try to extract line number from error
    let lineNumber;
    const lineMatch =
      errorMessage.match(/line (\d+)/i) ||
      errorMessage.match(/position (\d+)/i);
    if (lineMatch) {
      lineNumber = parseInt(lineMatch[1]);
    }

    return {
      success: false,
      error: errorMessage,
      line: lineNumber,
    };
  }
}

/**
 * Minifies JSON by removing whitespace
 */
export function minifyJSON(input: string): ToolResult {
  try {
    if (!input) {
      return { success: false, error: 'Invalid input' };
    }

    const cleanInput = input.trim();
    if (!cleanInput) {
      return { success: false, error: 'Empty input' };
    }

    const parsed = JSON.parse(cleanInput);
    const minified = JSON.stringify(parsed);

    return {
      success: true,
      result: minified,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Invalid JSON',
    };
  }
}

/**
 * Validates JSON and provides detailed error information
 */
export function validateJSON(input: string): ValidationResult {
  try {
    if (!input) {
      return {
        valid: false,
        error: 'Empty input',
      };
    }

    const cleanInput = input.trim();
    if (!cleanInput) {
      return {
        valid: false,
        error: 'Empty input',
      };
    }

    // Parse the JSON
    const parsed = JSON.parse(cleanInput);

    // Check for duplicate keys (basic check)
    const warnings: string[] = [];
    const originalString = JSON.stringify(parsed);
    const keys = extractKeys(cleanInput);
    const uniqueKeys = [...new Set(keys)];

    if (keys.length !== uniqueKeys.length) {
      warnings.push('Duplicate key');
    }

    return {
      valid: true,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (error: any) {
    const errorMessage = error.message || 'Invalid JSON';

    // Extract line number from error
    let lineNumber;
    const lineMatch =
      errorMessage.match(/line (\d+)/i) ||
      errorMessage.match(/position (\d+)/i);
    if (lineMatch) {
      lineNumber = parseInt(lineMatch[1]);
    }

    // Handle common error patterns
    if (
      errorMessage.includes('Unexpected end') ||
      errorMessage.includes("Expected ',' or '}' after property value")
    ) {
      return {
        valid: false,
        error:
          'Unexpected end of JSON input - missing closing bracket or quote',
        line: lineNumber,
      };
    }

    return {
      valid: false,
      error: errorMessage,
      line: lineNumber || 1,
    };
  }
}

/**
 * Helper function to extract keys from JSON string (basic implementation)
 */
function extractKeys(jsonString: string): string[] {
  const keys: string[] = [];
  const keyRegex = /"([^"]+)":/g;
  let match;

  while ((match = keyRegex.exec(jsonString)) !== null) {
    keys.push(match[1]);
  }

  return keys;
}
