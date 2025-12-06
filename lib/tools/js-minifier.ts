export interface JSMinifyOptions {
  compressionLevel?: 'basic' | 'standard' | 'advanced' | 'aggressive';
  mangle?: boolean;
  mangleProperties?: boolean;
  removeDeadCode?: boolean;
  removeConsole?: boolean;
  preserveLicense?: boolean;
  preserveFunctionNames?: boolean;
  preserveTypeScript?: boolean;
  optimizeNumbers?: boolean;
  optimizeStrings?: boolean;
  inlineFunctions?: boolean;
  generateSourceMap?: boolean;
  jsx?: boolean;
  moduleFormat?: 'auto' | 'es6' | 'commonjs' | 'umd';
}

export interface JSBeautifyOptions {
  indentType?: 'spaces' | 'tabs';
  indentSize?: number;
  braceStyle?: 'collapse' | 'expand' | 'end-expand' | 'allman';
  insertSemicolons?: boolean;
  maxLineLength?: number;
  preserveNewlines?: boolean;
  wrapAttributes?: 'auto' | 'force' | 'preserve';
  spaceAfterKeywords?: boolean;
  spaceInParen?: boolean;
}

export interface JSStats {
  originalSize: number;
  minifiedSize: number;
  compressionRatio: number;
  savedBytes: number;
  savedPercentage: number;
  totalFunctions: number;
  totalClasses: number;
  totalVariables: number;
  totalLines: number;
  processingTime: number;
  optimizationsApplied: string[];
}

export interface JSResult {
  success: boolean;
  js?: string;
  sourceMap?: string;
  stats?: JSStats;
  error?: string;
  mode?: 'minify' | 'beautify';
  warnings?: string[];
}

// Simple JavaScript tokenizer for basic parsing
interface Token {
  type:
    | 'keyword'
    | 'identifier'
    | 'string'
    | 'number'
    | 'operator'
    | 'punctuation'
    | 'comment'
    | 'whitespace'
    | 'regex';
  value: string;
  start: number;
  end: number;
}

const JS_KEYWORDS = new Set([
  'abstract',
  'await',
  'boolean',
  'break',
  'byte',
  'case',
  'catch',
  'char',
  'class',
  'const',
  'continue',
  'debugger',
  'default',
  'delete',
  'do',
  'double',
  'else',
  'enum',
  'export',
  'extends',
  'false',
  'final',
  'finally',
  'float',
  'for',
  'function',
  'goto',
  'if',
  'implements',
  'import',
  'in',
  'instanceof',
  'int',
  'interface',
  'let',
  'long',
  'native',
  'new',
  'null',
  'package',
  'private',
  'protected',
  'public',
  'return',
  'short',
  'static',
  'super',
  'switch',
  'synchronized',
  'this',
  'throw',
  'throws',
  'transient',
  'true',
  'try',
  'typeof',
  'var',
  'void',
  'volatile',
  'while',
  'with',
  'yield',
  'async',
  'of',
]);

const RESERVED_NAMES = new Set([
  'arguments',
  'eval',
  'undefined',
  'NaN',
  'Infinity',
  'console',
  'window',
  'document',
  'global',
  'process',
  'Buffer',
  'require',
  'module',
  'exports',
  '__dirname',
  '__filename',
]);

// Simple tokenizer implementation
function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < code.length) {
    const char = code[i];

    // Skip whitespace but track it
    if (/\s/.test(char)) {
      const start = i;
      while (i < code.length && /\s/.test(code[i])) i++;
      tokens.push({
        type: 'whitespace',
        value: code.slice(start, i),
        start,
        end: i,
      });
      continue;
    }

    // Comments
    if (char === '/' && code[i + 1] === '/') {
      const start = i;
      while (i < code.length && code[i] !== '\n') i++;
      tokens.push({
        type: 'comment',
        value: code.slice(start, i),
        start,
        end: i,
      });
      continue;
    }

    if (char === '/' && code[i + 1] === '*') {
      const start = i;
      i += 2;
      while (i < code.length - 1 && !(code[i] === '*' && code[i + 1] === '/'))
        i++;
      i += 2;
      tokens.push({
        type: 'comment',
        value: code.slice(start, i),
        start,
        end: i,
      });
      continue;
    }

    // String literals
    if (char === '"' || char === "'" || char === '`') {
      const start = i;
      const quote = char;
      i++;
      while (i < code.length) {
        if (code[i] === quote && code[i - 1] !== '\\') {
          i++;
          break;
        }
        if (quote === '`' && code[i] === '$' && code[i + 1] === '{') {
          // Template literal interpolation
          i += 2;
          let depth = 1;
          while (i < code.length && depth > 0) {
            if (code[i] === '{') depth++;
            if (code[i] === '}') depth--;
            i++;
          }
        } else {
          i++;
        }
      }
      tokens.push({
        type: 'string',
        value: code.slice(start, i),
        start,
        end: i,
      });
      continue;
    }

    // Regular expressions
    if (char === '/' && tokens.length > 0) {
      const prevToken = tokens[tokens.length - 1];
      const prevType = prevToken.type;

      // Check if this could be a regex based on context
      if (
        prevType === 'operator' ||
        prevType === 'punctuation' ||
        (prevType === 'keyword' &&
          ['return', 'throw', 'case'].includes(prevToken.value.trim()))
      ) {
        const start = i;
        i++;
        while (i < code.length && code[i] !== '/' && code[i] !== '\n') {
          if (code[i] === '\\') i++; // Skip escaped characters
          i++;
        }
        if (i < code.length && code[i] === '/') {
          i++;
          // Check for regex flags
          while (i < code.length && /[gimuy]/.test(code[i])) i++;
          tokens.push({
            type: 'regex',
            value: code.slice(start, i),
            start,
            end: i,
          });
          continue;
        } else {
          i = start; // Reset if not a valid regex
        }
      }
    }

    // Numbers
    if (/\d/.test(char) || (char === '.' && /\d/.test(code[i + 1]))) {
      const start = i;
      while (i < code.length && /[\d.eE+\-xXbBoO]/.test(code[i])) i++;
      tokens.push({
        type: 'number',
        value: code.slice(start, i),
        start,
        end: i,
      });
      continue;
    }

    // Identifiers and keywords
    if (/[a-zA-Z_$]/.test(char)) {
      const start = i;
      while (i < code.length && /[a-zA-Z0-9_$]/.test(code[i])) i++;
      const value = code.slice(start, i);
      tokens.push({
        type: JS_KEYWORDS.has(value) ? 'keyword' : 'identifier',
        value,
        start,
        end: i,
      });
      continue;
    }

    // Operators and punctuation
    const start = i;
    if (
      i < code.length - 2 &&
      ['===', '!==', '>>>'].includes(code.slice(i, i + 3))
    ) {
      i += 3;
    } else if (
      i < code.length - 1 &&
      [
        '==',
        '!=',
        '<=',
        '>=',
        '&&',
        '||',
        '++',
        '--',
        '<<',
        '>>',
        '**',
        '??',
        '?.',
        '||=',
        '&&=',
        '??=',
      ].includes(code.slice(i, i + 2))
    ) {
      i += 2;
    } else {
      i++;
    }

    const value = code.slice(start, i);
    tokens.push({
      type: /[+\-*/%=<>!&|^~?:]/.test(value) ? 'operator' : 'punctuation',
      value,
      start,
      end: i,
    });
  }

  return tokens;
}

// Variable name generator for mangling
function generateMangledName(index: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let name = '';
  let num = index;

  do {
    name = chars[num % chars.length] + name;
    num = Math.floor(num / chars.length);
  } while (num > 0);

  return name;
}

// Analyze JavaScript code structure
function analyzeCode(tokens: Token[]): {
  functions: number;
  classes: number;
  variables: number;
  lines: number;
} {
  let functions = 0;
  let classes = 0;
  let variables = 0;
  let lines = 1;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type === 'whitespace' && token.value.includes('\n')) {
      lines += (token.value.match(/\n/g) || []).length;
    }

    if (token.type === 'keyword') {
      if (token.value === 'function') functions++;
      if (token.value === 'class') classes++;
      if (['var', 'let', 'const'].includes(token.value)) variables++;
    }

    // Count arrow functions
    if (token.type === 'operator' && token.value === '=>') {
      functions++;
    }
  }

  return { functions, classes, variables, lines };
}

// Basic minification implementation
function performMinification(
  tokens: Token[],
  options: JSMinifyOptions
): {
  minified: string;
  optimizations: string[];
} {
  const optimizations: string[] = [];
  let result = '';
  let mangledNames: Map<string, string> = new Map();
  let mangledIndex = 0;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const nextToken = tokens[i + 1];

    // Skip comments (except license comments)
    if (token.type === 'comment') {
      if (options.preserveLicense && token.value.startsWith('/*!')) {
        result += token.value;
      } else {
        optimizations.push('Removed comments');
      }
      continue;
    }

    // Skip unnecessary whitespace
    if (token.type === 'whitespace') {
      const prevToken = tokens[i - 1];

      // Keep whitespace in specific cases
      if (prevToken && nextToken) {
        const needsSpace =
          (prevToken.type === 'keyword' && nextToken.type === 'identifier') ||
          (prevToken.type === 'keyword' && nextToken.type === 'keyword') ||
          (prevToken.type === 'identifier' && nextToken.type === 'keyword') ||
          (prevToken.type === 'identifier' &&
            nextToken.type === 'identifier') ||
          (prevToken.value === 'return' && nextToken.type !== 'punctuation') ||
          (prevToken.value === 'else' && nextToken.type !== 'punctuation') ||
          (prevToken.value === 'typeof' && nextToken.type === 'identifier') ||
          (prevToken.value === 'delete' && nextToken.type === 'identifier') ||
          (prevToken.value === 'void' && nextToken.type === 'identifier') ||
          (prevToken.value === 'new' && nextToken.type === 'identifier') ||
          (prevToken.value === 'in' && nextToken.type === 'identifier') ||
          (prevToken.value === 'of' && nextToken.type === 'identifier') ||
          (prevToken.value === 'instanceof' && nextToken.type === 'identifier');

        if (needsSpace) {
          result += ' ';
        } else {
          optimizations.push('Removed whitespace');
        }
      }
      continue;
    }

    // Mangle variable names
    if (
      options.mangle &&
      token.type === 'identifier' &&
      !RESERVED_NAMES.has(token.value)
    ) {
      if (!mangledNames.has(token.value)) {
        mangledNames.set(token.value, generateMangledName(mangledIndex++));
        optimizations.push('Mangled variable names');
      }
      result += mangledNames.get(token.value);
      continue;
    }

    // Optimize numbers
    if (options.optimizeNumbers && token.type === 'number') {
      let optimized = token.value;

      // Convert 0.5 to .5
      if (optimized.startsWith('0.') && optimized.length > 2) {
        optimized = optimized.substring(1);
        optimizations.push('Optimized decimal numbers');
      }

      // Convert large numbers to scientific notation
      const num = parseFloat(optimized);
      if (num >= 1000000 && num.toString() === optimized) {
        const scientific = num.toExponential();
        if (scientific.length < optimized.length) {
          optimized = scientific;
          optimizations.push('Used scientific notation');
        }
      }

      result += optimized;
      continue;
    }

    // Remove dead code (basic implementation)
    if (
      options.removeDeadCode &&
      token.type === 'keyword' &&
      token.value === 'if'
    ) {
      // Look for if (false) blocks
      const nextTokens = tokens.slice(i + 1, i + 10);
      const falseCondition = nextTokens.find(
        (t) => t.type === 'keyword' && t.value === 'false'
      );

      if (falseCondition) {
        // Skip the entire if block (simplified)
        let depth = 0;
        let j = i;
        while (j < tokens.length) {
          if (tokens[j].value === '{') depth++;
          if (tokens[j].value === '}') {
            depth--;
            if (depth === 0) break;
          }
          j++;
        }
        i = j;
        optimizations.push('Removed dead code');
        continue;
      }
    }

    // Remove console statements
    if (
      options.removeConsole &&
      token.type === 'identifier' &&
      token.value === 'console' &&
      nextToken?.value === '.'
    ) {
      // Skip until semicolon or newline
      while (
        i < tokens.length &&
        tokens[i].value !== ';' &&
        !tokens[i].value.includes('\n')
      ) {
        i++;
      }
      optimizations.push('Removed console statements');
      continue;
    }

    result += token.value;
  }

  return { minified: result, optimizations };
}

// Basic beautification implementation
function performBeautification(
  tokens: Token[],
  options: JSBeautifyOptions
): string {
  let result = '';
  let indentLevel = 0;
  const indent =
    options.indentType === 'tabs' ? '\t' : ' '.repeat(options.indentSize || 2);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const nextToken = tokens[i + 1];
    const prevToken = tokens[i - 1];

    // Skip existing whitespace - we'll add our own
    if (token.type === 'whitespace') continue;

    // Handle opening braces
    if (token.value === '{') {
      if (
        options.braceStyle === 'allman' &&
        prevToken &&
        prevToken.type !== 'whitespace'
      ) {
        result += '\n' + indent.repeat(indentLevel);
      } else if (
        options.braceStyle !== 'allman' &&
        prevToken &&
        prevToken.type !== 'whitespace'
      ) {
        result += ' ';
      }
      result += '{';
      indentLevel++;
      if (nextToken && nextToken.value !== '}') {
        result += '\n' + indent.repeat(indentLevel);
      }
      continue;
    }

    // Handle closing braces
    if (token.value === '}') {
      indentLevel = Math.max(0, indentLevel - 1);
      if (prevToken && prevToken.value !== '{') {
        result += '\n' + indent.repeat(indentLevel);
      }
      result += '}';
      if (
        nextToken &&
        nextToken.value !== ';' &&
        nextToken.type !== 'operator'
      ) {
        result += '\n' + indent.repeat(indentLevel);
      }
      continue;
    }

    // Handle semicolons
    if (token.value === ';') {
      result += ';';
      if (nextToken && nextToken.value !== '}') {
        result += '\n' + indent.repeat(indentLevel);
      }
      continue;
    }

    // Handle commas in objects/arrays
    if (
      token.value === ',' &&
      nextToken &&
      nextToken.value !== '}' &&
      nextToken.value !== ']'
    ) {
      result += ', ';
      continue;
    }

    // Add space after keywords
    if (
      token.type === 'keyword' &&
      nextToken &&
      ['if', 'for', 'while', 'switch', 'catch', 'function'].includes(
        token.value
      )
    ) {
      result += token.value + ' ';
      continue;
    }

    // Add space around operators
    if (
      token.type === 'operator' &&
      [
        '=',
        '==',
        '===',
        '!=',
        '!==',
        '<=',
        '>=',
        '<',
        '>',
        '+',
        '-',
        '*',
        '/',
        '%',
      ].includes(token.value)
    ) {
      result += ' ' + token.value + ' ';
      continue;
    }

    // Add space after colons in objects
    if (token.value === ':' && nextToken) {
      result += ': ';
      continue;
    }

    result += token.value;
  }

  return result;
}

/**
 * Validates JavaScript syntax without executing code.
 * Uses tokenization and bracket matching for security (no eval/Function).
 *
 * @param input - JavaScript code to validate
 * @returns Object with valid status and optional error message
 */
function validateJSSyntax(input: string): { valid: boolean; error?: string } {
  try {
    const tokens = tokenize(input);

    // Check for balanced brackets/parentheses/braces
    const stack: string[] = [];
    const pairs: Record<string, string> = {
      '(': ')',
      '[': ']',
      '{': '}',
    };
    const closers = new Set([')', ']', '}']);

    for (const token of tokens) {
      if (token.type === 'punctuation') {
        const char = token.value;

        if (pairs[char]) {
          stack.push(pairs[char]);
        } else if (closers.has(char)) {
          if (stack.length === 0) {
            return {
              valid: false,
              error: `Unexpected '${char}' at position ${token.start}`,
            };
          }
          const expected = stack.pop();
          if (expected !== char) {
            return {
              valid: false,
              error: `Expected '${expected}' but found '${char}' at position ${token.start}`,
            };
          }
        }
      }
    }

    if (stack.length > 0) {
      const missing = stack.reverse().join('');
      return {
        valid: false,
        error: `Unclosed bracket(s), missing: ${missing}`,
      };
    }

    // Check for unclosed strings (tokenizer would have produced partial tokens)
    const lastToken = tokens[tokens.length - 1];
    if (lastToken && lastToken.type === 'string') {
      const quote = lastToken.value[0];
      if (!lastToken.value.endsWith(quote) || lastToken.value.length === 1) {
        return {
          valid: false,
          error: `Unclosed string starting at position ${lastToken.start}`,
        };
      }
    }

    // Check for common syntax patterns that would be invalid
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      const nextToken = tokens[i + 1];

      // Check for consecutive operators (except valid combinations)
      if (
        token.type === 'operator' &&
        nextToken?.type === 'operator' &&
        !['!', '+', '-', '~'].includes(token.value) &&
        !['!', '+', '-', '~'].includes(nextToken.value)
      ) {
        // Allow chained operators like !== or ===
        const combined = token.value + nextToken.value;
        if (!['==', '!=', '===', '!==', '&&', '||', '??'].includes(combined)) {
          return {
            valid: false,
            error: `Invalid operator sequence '${token.value}${nextToken.value}' at position ${token.start}`,
          };
        }
      }
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: `Tokenization failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

export function minifyJS(
  input: string,
  options: JSMinifyOptions = {}
): JSResult {
  const startTime = performance.now();

  try {
    if (!input.trim()) {
      return { success: false, error: 'No JavaScript input provided' };
    }

    // Secure syntax validation (no eval/Function execution)
    const validation = validateJSSyntax(input);
    if (!validation.valid) {
      return {
        success: false,
        error: `Invalid JavaScript: ${validation.error || 'Syntax error'}`,
      };
    }

    const tokens = tokenize(input);
    const analysis = analyzeCode(tokens);
    const { minified, optimizations } = performMinification(tokens, options);

    const endTime = performance.now();
    const originalSize = input.length;
    const minifiedSize = minified.length;

    const stats: JSStats = {
      originalSize,
      minifiedSize,
      compressionRatio: minifiedSize / originalSize,
      savedBytes: originalSize - minifiedSize,
      savedPercentage: ((originalSize - minifiedSize) / originalSize) * 100,
      totalFunctions: analysis.functions,
      totalClasses: analysis.classes,
      totalVariables: analysis.variables,
      totalLines: analysis.lines,
      processingTime: endTime - startTime,
      optimizationsApplied: [...new Set(optimizations)],
    };

    return {
      success: true,
      js: minified,
      stats,
      mode: 'minify',
    };
  } catch (error) {
    return {
      success: false,
      error: `Minification failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

export function beautifyJS(
  input: string,
  options: JSBeautifyOptions = {}
): JSResult {
  const startTime = performance.now();

  try {
    if (!input.trim()) {
      return { success: false, error: 'No JavaScript input provided' };
    }

    // Secure syntax validation (no eval/Function execution)
    const validation = validateJSSyntax(input);
    if (!validation.valid) {
      return {
        success: false,
        error: `Invalid JavaScript: ${validation.error || 'Syntax error'}`,
      };
    }

    const tokens = tokenize(input);
    const beautified = performBeautification(tokens, options);

    const endTime = performance.now();

    const stats: JSStats = {
      originalSize: input.length,
      minifiedSize: beautified.length,
      compressionRatio: beautified.length / input.length,
      savedBytes: input.length - beautified.length,
      savedPercentage:
        ((input.length - beautified.length) / input.length) * 100,
      totalFunctions: 0,
      totalClasses: 0,
      totalVariables: 0,
      totalLines: 0,
      processingTime: endTime - startTime,
      optimizationsApplied: ['Code beautification'],
    };

    return {
      success: true,
      js: beautified,
      stats,
      mode: 'beautify',
    };
  } catch (error) {
    return {
      success: false,
      error: `Beautification failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

export function processJS(
  input: string,
  mode: 'minify' | 'beautify',
  options: JSMinifyOptions | JSBeautifyOptions = {}
): JSResult {
  if (mode === 'minify') {
    return minifyJS(input, options as JSMinifyOptions);
  } else {
    return beautifyJS(input, options as JSBeautifyOptions);
  }
}
