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
 * Attempts to fix common JSON formatting issues
 */
function preprocessJSON(input: string): string {
  let processed = input;

  // First, normalize the input - sometimes it might come with extra escaping
  // Remove any potential BOM or zero-width characters
  processed = processed.replace(/^\uFEFF/, '').trim();

  // Step 1: Replace single quotes with double quotes, but preserve apostrophes
  // We need to be careful not to replace apostrophes inside strings
  processed = replaceSingleQuotes(processed);

  // Step 2: Fix unescaped characters inside strings
  processed = escapeUnescapedChars(processed);

  // Step 3: Convert boolean values to lowercase
  processed = fixBooleanCase(processed);

  // Step 4: Add missing quotes to keys
  processed = addMissingQuotes(processed);

  // Step 5: Remove trailing commas
  processed = removeTrailingCommas(processed);

  return processed;
}

/**
 * Replace single quotes with double quotes, preserving apostrophes and nested JSON
 */
function replaceSingleQuotes(input: string): string {
  let result = '';
  let inString = false;
  let stringDelimiter = '';
  let escaped = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const prevChar = input[i - 1];

    if (escaped) {
      if (char === "'" && stringDelimiter === "'") {
        // Escaped apostrophe in single-quoted string - keep as apostrophe
        result += "'";
      } else {
        result += char;
      }
      escaped = false;
      continue;
    }

    if (char === '\\') {
      escaped = true;
      // Check if we're escaping an apostrophe in a single-quoted string
      if (input[i + 1] === "'" && inString && stringDelimiter === "'") {
        // Skip the backslash for apostrophes
        continue;
      }
      result += char;
      continue;
    }

    if (!inString) {
      // Not in a string
      if (char === '"' || char === "'") {
        inString = true;
        stringDelimiter = char;
        result += '"'; // Always start with double quote
      } else {
        result += char;
      }
    } else {
      // We're in a string
      if (char === stringDelimiter && !escaped) {
        // End of string
        inString = false;
        result += '"'; // Always end with double quote
        stringDelimiter = '';
      } else if (char === '"' && stringDelimiter === "'") {
        // Double quote inside single-quoted string - escape it
        result += '\\"';
      } else {
        result += char;
      }
    }
  }

  return result;
}

/**
 * Escape unescaped special characters inside strings
 */
function escapeUnescapedChars(input: string): string {
  let result = '';
  let inString = false;
  let escaped = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (escaped) {
      result += char;
      escaped = false;
      continue;
    }

    if (char === '\\') {
      escaped = true;
      result += char;
      continue;
    }

    if (char === '"' && !escaped) {
      inString = !inString;
      result += char;
      continue;
    }

    if (inString) {
      // Escape special characters that need escaping
      switch (char) {
        case '\n':
          result += '\\n';
          break;
        case '\r':
          result += '\\r';
          break;
        case '\t':
          result += '\\t';
          break;
        case '\b':
          result += '\\b';
          break;
        case '\f':
          result += '\\f';
          break;
        default:
          result += char;
      }
    } else {
      result += char;
    }
  }

  return result;
}

/**
 * Convert boolean values to lowercase
 */
function fixBooleanCase(input: string): string {
  // Match boolean values that are not inside strings
  let result = input;
  let inString = false;
  let processedResult = '';

  for (let i = 0; i < result.length; i++) {
    const char = result[i];

    if (char === '"' && (i === 0 || result[i - 1] !== '\\')) {
      inString = !inString;
      processedResult += char;
      continue;
    }

    if (!inString) {
      // Check for boolean patterns
      const remaining = result.substring(i);

      if (remaining.match(/^True\b/)) {
        processedResult += 'true';
        i += 3; // Skip True - 1
      } else if (remaining.match(/^TRUE\b/i)) {
        processedResult += 'true';
        i += 3; // Skip TRUE - 1
      } else if (remaining.match(/^False\b/)) {
        processedResult += 'false';
        i += 4; // Skip False - 1
      } else if (remaining.match(/^FALSE\b/i)) {
        processedResult += 'false';
        i += 4; // Skip FALSE - 1
      } else if (remaining.match(/^None\b/)) {
        processedResult += 'null';
        i += 3; // Skip None - 1
      } else if (remaining.match(/^NULL\b/i)) {
        processedResult += 'null';
        i += 3; // Skip NULL - 1
      } else {
        processedResult += char;
      }
    } else {
      processedResult += char;
    }
  }

  return processedResult;
}

/**
 * Add missing quotes to unquoted keys
 */
function addMissingQuotes(input: string): string {
  let result = input;
  let inString = false;
  let processedResult = '';

  for (let i = 0; i < result.length; i++) {
    const char = result[i];

    if (char === '"' && (i === 0 || result[i - 1] !== '\\')) {
      inString = !inString;
      processedResult += char;
      continue;
    }

    if (!inString && (char === '{' || char === ',')) {
      processedResult += char;

      // Look ahead for unquoted key
      let j = i + 1;
      while (j < result.length && /\s/.test(result[j])) {
        processedResult += result[j];
        j++;
      }

      if (j < result.length && result[j] !== '"' && result[j] !== '}') {
        // Found unquoted key, find the key name
        let key = '';
        while (
          j < result.length &&
          result[j] !== ':' &&
          !/\s/.test(result[j])
        ) {
          key += result[j];
          j++;
        }

        if (key && result[j] === ':') {
          // Valid unquoted key found
          processedResult += '"' + key + '"';
          i = j - 1;
        }
      }
    } else {
      processedResult += char;
    }
  }

  return processedResult;
}

/**
 * Remove trailing commas
 */
function removeTrailingCommas(input: string): string {
  // Remove trailing commas before ] or }
  return input.replace(/,(\s*[}\]])/g, '$1');
}

/**
 * Attempts to repair malformed JSON
 */
export function repairJSON(input: string): string {
  return preprocessJSON(input);
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

    // Attempt to fix common JSON issues before parsing
    let processedInput = cleanInput;
    let warnings: string[] = [];

    try {
      // First try to parse as-is
      JSON.parse(cleanInput);
    } catch (firstError: any) {
      // If parsing fails, try to fix common issues
      processedInput = preprocessJSON(cleanInput);
      try {
        JSON.parse(processedInput);
        warnings.push('Applied automatic fixes to malformed JSON');
      } catch (secondError: any) {
        // If it still fails after preprocessing, try to provide helpful error info
        const originalErrorMsg = firstError.message || 'Unknown error';
        const repairedErrorMsg = secondError.message || 'Unknown error';

        // Check if we made any progress
        if (repairedErrorMsg !== originalErrorMsg) {
          // The preprocessing changed something but still didn't fix it completely
          return {
            success: false,
            error: `Original error: ${originalErrorMsg}. After auto-fix attempt: ${repairedErrorMsg}`,
            warnings: [
              'Attempted to fix malformed JSON but it still contains errors',
            ],
          };
        } else {
          // Use original input to preserve the original error message
          processedInput = cleanInput;
        }
      }
    }

    // For very large inputs, we might need to handle them differently
    const parsed = JSON.parse(processedInput);
    const formatted = JSON.stringify(parsed, null, 2);

    return {
      success: true,
      result: formatted,
      warnings: warnings.length > 0 ? warnings : undefined,
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

    // Attempt to fix common JSON issues before parsing
    let processedInput = cleanInput;
    let warnings: string[] = [];

    try {
      // First try to parse as-is
      JSON.parse(cleanInput);
    } catch (firstError: any) {
      // If parsing fails, try to fix common issues
      processedInput = preprocessJSON(cleanInput);
      try {
        JSON.parse(processedInput);
        warnings.push('Applied automatic fixes to malformed JSON');
      } catch (secondError: any) {
        // If it still fails, return error with details
        const originalErrorMsg = firstError.message || 'Unknown error';
        const repairedErrorMsg = secondError.message || 'Unknown error';

        if (repairedErrorMsg !== originalErrorMsg) {
          return {
            success: false,
            error: `Original error: ${originalErrorMsg}. After auto-fix attempt: ${repairedErrorMsg}`,
            warnings: [
              'Attempted to fix malformed JSON but it still contains errors',
            ],
          };
        } else {
          processedInput = cleanInput;
        }
      }
    }

    const parsed = JSON.parse(processedInput);
    const minified = JSON.stringify(parsed);

    return {
      success: true,
      result: minified,
      warnings: warnings.length > 0 ? warnings : undefined,
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

    // Check for automatic fixes
    let processedInput = cleanInput;
    let autoFixed = false;

    try {
      // First try to parse as-is
      JSON.parse(cleanInput);
    } catch (firstError) {
      // If parsing fails, try to fix common issues
      processedInput = preprocessJSON(cleanInput);
      try {
        JSON.parse(processedInput);
        autoFixed = true;
      } catch (secondError) {
        // If it still fails after preprocessing, use original input
        // This preserves the original error message
        processedInput = cleanInput;
      }
    }

    // Parse the JSON
    const parsed = JSON.parse(processedInput);

    // Check for duplicate keys (basic check)
    const warnings: string[] = [];

    if (autoFixed) {
      warnings.push(
        'JSON was automatically fixed - check the formatted output'
      );
    }

    const originalString = JSON.stringify(parsed);
    const keys = extractKeys(processedInput);
    const uniqueKeys = [...new Set(keys)];

    if (keys.length !== uniqueKeys.length) {
      warnings.push('Duplicate key detected');
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
