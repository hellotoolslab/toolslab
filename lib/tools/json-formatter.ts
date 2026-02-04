export interface JsonResult {
  success: boolean;
  result?: string;
  error?: string;
}

/**
 * Check if a character is a valid identifier character (a-z, A-Z, 0-9, _)
 */
function isIdentChar(ch: string | undefined): boolean {
  if (!ch) return false;
  return /[a-zA-Z0-9_]/.test(ch);
}

/**
 * Convert Python dict-like syntax to valid JSON.
 * Handles: single quotes → double quotes, True → true, False → false, None → null
 */
export function pythonToJson(input: string): string {
  let result = '';
  let i = 0;

  while (i < input.length) {
    if (input[i] === "'") {
      // Single-quoted string → convert to double-quoted
      result += '"';
      i++;
      while (i < input.length && input[i] !== "'") {
        if (input[i] === '"') {
          result += '\\"';
        } else if (
          input[i] === '\\' &&
          i + 1 < input.length &&
          input[i + 1] === "'"
        ) {
          result += "'";
          i++;
        } else {
          result += input[i];
        }
        i++;
      }
      result += '"';
      if (i < input.length) i++;
    } else if (input[i] === '"') {
      // Double-quoted string → keep as-is
      result += '"';
      i++;
      while (i < input.length && input[i] !== '"') {
        if (input[i] === '\\' && i + 1 < input.length) {
          result += input[i] + input[i + 1];
          i += 2;
        } else {
          result += input[i];
          i++;
        }
      }
      if (i < input.length) {
        result += '"';
        i++;
      }
    } else if (
      input.startsWith('True', i) &&
      !isIdentChar(input[i - 1]) &&
      !isIdentChar(input[i + 4])
    ) {
      result += 'true';
      i += 4;
    } else if (
      input.startsWith('False', i) &&
      !isIdentChar(input[i - 1]) &&
      !isIdentChar(input[i + 5])
    ) {
      result += 'false';
      i += 5;
    } else if (
      input.startsWith('None', i) &&
      !isIdentChar(input[i - 1]) &&
      !isIdentChar(input[i + 4])
    ) {
      result += 'null';
      i += 4;
    } else {
      result += input[i];
      i++;
    }
  }

  return result;
}

export function formatJson(input: string): JsonResult {
  try {
    if (!input?.trim()) {
      return { success: false, error: 'Input is required' };
    }

    // Try parsing as standard JSON first
    let parsed: unknown;
    try {
      parsed = JSON.parse(input);
    } catch {
      // Fallback: try converting Python dict syntax to JSON
      const converted = pythonToJson(input);
      parsed = JSON.parse(converted);
    }

    const formatted = JSON.stringify(parsed, null, 2);

    return { success: true, result: formatted };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Invalid JSON format',
    };
  }
}
