/**
 * JavaScript Object to JSON Converter
 * Converts JavaScript object literals to valid JSON with special value handling
 */

export interface ConversionOptions {
  /** Indentation size (2 or 4 spaces) */
  indent?: 2 | 4;
  /** Output compact JSON without formatting */
  compact?: boolean;
  /** How to handle undefined values: 'remove' | 'null' */
  handleUndefined?: 'remove' | 'null';
  /** How to handle functions: 'remove' | 'string' */
  handleFunctions?: 'remove' | 'string';
  /** How to handle BigInt: 'string' | 'number' | 'error' */
  handleBigInt?: 'string' | 'number' | 'error';
  /** Sort keys alphabetically */
  sortKeys?: boolean;
}

export interface ConversionResult {
  success: boolean;
  output?: string;
  error?: string;
  warnings?: string[];
}

export interface ParseResult {
  success: boolean;
  data?: any;
  error?: string;
}

export interface CircularCheckResult {
  hasCircular: boolean;
  path?: string;
}

const DEFAULT_OPTIONS: ConversionOptions = {
  indent: 2,
  compact: false,
  handleUndefined: 'remove',
  handleFunctions: 'remove',
  handleBigInt: 'string',
  sortKeys: false,
};

/**
 * Detects circular references in an object
 */
export function detectCircularReference(obj: any): CircularCheckResult {
  if (obj === null || typeof obj !== 'object') {
    return { hasCircular: false };
  }

  const seen = new WeakSet();
  const path: string[] = [];

  function detect(current: any, currentPath: string[]): CircularCheckResult {
    if (current === null || typeof current !== 'object') {
      return { hasCircular: false };
    }

    if (seen.has(current)) {
      return { hasCircular: true, path: currentPath.join('.') || 'root' };
    }

    seen.add(current);

    if (Array.isArray(current)) {
      for (let i = 0; i < current.length; i++) {
        const result = detect(current[i], [...currentPath, `[${i}]`]);
        if (result.hasCircular) return result;
      }
    } else {
      for (const key of Object.keys(current)) {
        const result = detect(current[key], [...currentPath, key]);
        if (result.hasCircular) return result;
      }
    }

    return { hasCircular: false };
  }

  return detect(obj, []);
}

/**
 * Parses a JavaScript object literal string into an actual object
 */
export function parseJsObject(input: string): ParseResult {
  const trimmed = input.trim();

  if (!trimmed) {
    return { success: false, error: 'Input is empty' };
  }

  // Try standard JSON.parse first (for already valid JSON)
  try {
    const data = JSON.parse(trimmed);
    return { success: true, data };
  } catch {
    // Not valid JSON, continue with JS parsing
  }

  // Try using Function constructor first (preserves undefined, BigInt, etc.)
  try {
    // Wrap in parentheses to handle object literals
    const wrapped = trimmed.startsWith('{') ? `(${trimmed})` : trimmed;

    // Create a safe evaluation context with proper handling of special values
    const safeEval = new Function(`
      "use strict";
      const undefined = void 0;
      const NaN = Number.NaN;
      const Infinity = Number.POSITIVE_INFINITY;
      return ${wrapped};
    `);

    const data = safeEval();
    return { success: true, data };
  } catch {
    // Function constructor failed, try preprocessing as fallback
  }

  // Fallback: Preprocess the input to make it valid JSON
  try {
    const processed = preprocessJsToJson(trimmed);
    const data = JSON.parse(processed);
    return { success: true, data };
  } catch (e: any) {
    return {
      success: false,
      error: `Invalid JavaScript object syntax: ${e.message}`,
    };
  }
}

/**
 * Preprocesses JavaScript object syntax to valid JSON
 * Note: This is a fallback when Function constructor fails
 */
function preprocessJsToJson(input: string): string {
  let result = input;

  // Remove single-line comments
  result = result.replace(/\/\/.*$/gm, '');

  // Remove multi-line comments
  result = result.replace(/\/\*[\s\S]*?\*\//g, '');

  // Handle template literals (basic support)
  result = result.replace(/`([^`]*)`/g, (_, content) => {
    // Escape the content and wrap in double quotes
    const escaped = content.replace(/"/g, '\\"').replace(/\n/g, '\\n');
    return `"${escaped}"`;
  });

  // Replace single quotes with double quotes (careful with nested quotes)
  result = replaceSingleQuotes(result);

  // Add quotes around unquoted keys
  result = quoteUnquotedKeys(result);

  // Remove trailing commas
  result = result.replace(/,(\s*[}\]])/g, '$1');

  // Handle special values - convert to JSON-compatible placeholders
  // These will be converted to null in JSON
  result = result.replace(/:\s*undefined\b/g, ': null');
  result = result.replace(/:\s*NaN\b/g, ': null');
  result = result.replace(/:\s*Infinity\b/g, ': null');
  result = result.replace(/:\s*-Infinity\b/g, ': null');

  // Handle BigInt literals (remove the 'n' suffix and keep as number string)
  result = result.replace(/:\s*(\d+)n\b/g, ': "$1"');

  // Handle hex, octal, binary numbers
  result = result.replace(
    /:\s*0x([0-9a-fA-F]+)\b/g,
    (_, hex) => `: ${parseInt(hex, 16)}`
  );
  result = result.replace(
    /:\s*0o([0-7]+)\b/g,
    (_, oct) => `: ${parseInt(oct, 8)}`
  );
  result = result.replace(
    /:\s*0b([01]+)\b/g,
    (_, bin) => `: ${parseInt(bin, 2)}`
  );

  return result;
}

/**
 * Replaces single quotes with double quotes, handling escaped quotes
 */
function replaceSingleQuotes(input: string): string {
  let result = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let i = 0;

  while (i < input.length) {
    const char = input[i];
    const prevChar = i > 0 ? input[i - 1] : '';

    if (char === "'" && !inDoubleQuote && prevChar !== '\\') {
      if (!inSingleQuote) {
        result += '"';
        inSingleQuote = true;
      } else {
        result += '"';
        inSingleQuote = false;
      }
    } else if (char === '"' && !inSingleQuote && prevChar !== '\\') {
      result += char;
      inDoubleQuote = !inDoubleQuote;
    } else if (char === '"' && inSingleQuote) {
      // Escape double quotes inside single-quoted strings
      result += '\\"';
    } else {
      result += char;
    }
    i++;
  }

  return result;
}

/**
 * Adds quotes around unquoted object keys
 */
function quoteUnquotedKeys(input: string): string {
  // Match unquoted keys followed by a colon
  // This regex matches keys that are valid JS identifiers but not quoted
  return input.replace(
    /([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)(\s*:)/g,
    '$1"$2"$3'
  );
}

/**
 * Converts a JavaScript object to JSON with special value handling
 */
export function jsObjectToJson(
  input: string,
  options: ConversionOptions = {}
): ConversionResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const warnings: string[] = [];

  // Check for empty input
  if (!input || !input.trim()) {
    return { success: false, error: 'Input is empty' };
  }

  // Parse the JS object
  const parseResult = parseJsObject(input);
  if (!parseResult.success) {
    return { success: false, error: parseResult.error };
  }

  let data = parseResult.data;

  // Check for circular references
  const circularCheck = detectCircularReference(data);
  if (circularCheck.hasCircular) {
    return {
      success: false,
      error: `Circular reference detected at path: ${circularCheck.path}`,
    };
  }

  // Process the data to handle special values
  data = processValue(data, opts, warnings, '');

  // Sort keys if requested
  if (
    opts.sortKeys &&
    typeof data === 'object' &&
    data !== null &&
    !Array.isArray(data)
  ) {
    data = sortObjectKeys(data);
  }

  // Convert to JSON string
  try {
    const indent = opts.compact ? undefined : opts.indent;
    const output = JSON.stringify(data, null, indent);

    return {
      success: true,
      output,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (e: any) {
    return {
      success: false,
      error: `Failed to stringify JSON: ${e.message}`,
    };
  }
}

/**
 * Recursively processes values to handle special types
 */
function processValue(
  value: any,
  options: ConversionOptions,
  warnings: string[],
  path: string
): any {
  // Handle null
  if (value === null) {
    return null;
  }

  // Handle undefined
  if (value === undefined) {
    if (options.handleUndefined === 'null') {
      warnings.push(`Converted undefined to null at '${path || 'root'}'`);
      return null;
    }
    warnings.push(`Removed undefined value at '${path || 'root'}'`);
    return undefined; // Will be removed by JSON.stringify
  }

  // Handle functions
  if (typeof value === 'function') {
    if (options.handleFunctions === 'string') {
      warnings.push(`Converted function to string at '${path || 'root'}'`);
      return '[Function]';
    }
    warnings.push(`Removed function at '${path || 'root'}'`);
    return undefined;
  }

  // Handle BigInt
  if (typeof value === 'bigint') {
    if (options.handleBigInt === 'error') {
      throw new Error(`BigInt value at '${path}' cannot be serialized to JSON`);
    }
    if (options.handleBigInt === 'number') {
      warnings.push(
        `Converted BigInt to number at '${path || 'root'}' (may lose precision)`
      );
      return Number(value);
    }
    warnings.push(`Converted BigInt to string at '${path || 'root'}'`);
    return value.toString();
  }

  // Handle Symbol
  if (typeof value === 'symbol') {
    warnings.push(`Removed Symbol at '${path || 'root'}'`);
    return undefined;
  }

  // Handle NaN and Infinity
  if (typeof value === 'number') {
    if (Number.isNaN(value)) {
      warnings.push(`Converted NaN to null at '${path || 'root'}'`);
      return null;
    }
    if (!Number.isFinite(value)) {
      warnings.push(`Converted Infinity to null at '${path || 'root'}'`);
      return null;
    }
    return value;
  }

  // Handle Date
  if (value instanceof Date) {
    return value.toISOString();
  }

  // Handle RegExp
  if (value instanceof RegExp) {
    warnings.push(`Converted RegExp to string at '${path || 'root'}'`);
    return value.toString();
  }

  // Handle Map
  if (value instanceof Map) {
    warnings.push(`Converted Map to object at '${path || 'root'}'`);
    const obj: Record<string, any> = {};
    for (const [k, v] of value) {
      obj[String(k)] = processValue(v, options, warnings, `${path}.${k}`);
    }
    return obj;
  }

  // Handle Set
  if (value instanceof Set) {
    warnings.push(`Converted Set to array at '${path || 'root'}'`);
    return Array.from(value).map((v, i) =>
      processValue(v, options, warnings, `${path}[${i}]`)
    );
  }

  // Handle arrays
  if (Array.isArray(value)) {
    return value
      .map((item, index) =>
        processValue(item, options, warnings, `${path}[${index}]`)
      )
      .filter((item) => item !== undefined);
  }

  // Handle objects
  if (typeof value === 'object') {
    const result: Record<string, any> = {};
    for (const key of Object.keys(value)) {
      const processed = processValue(
        value[key],
        options,
        warnings,
        path ? `${path}.${key}` : key
      );
      if (processed !== undefined) {
        result[key] = processed;
      }
    }
    return result;
  }

  // Primitives (string, number, boolean)
  return value;
}

/**
 * Recursively sorts object keys alphabetically
 */
function sortObjectKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }

  if (obj !== null && typeof obj === 'object') {
    const sorted: Record<string, any> = {};
    const keys = Object.keys(obj).sort();
    for (const key of keys) {
      sorted[key] = sortObjectKeys(obj[key]);
    }
    return sorted;
  }

  return obj;
}

export default jsObjectToJson;
