/**
 * String Case Converter - Convert text between different naming conventions
 * Supports camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, and more
 */

export type CaseType =
  | 'camelCase'
  | 'PascalCase'
  | 'snake_case'
  | 'kebab-case'
  | 'CONSTANT_CASE'
  | 'dot.case'
  | 'path/case'
  | 'Title Case'
  | 'Sentence case'
  | 'lowercase'
  | 'UPPERCASE'
  | 'Header-Case';

export interface ConversionResult {
  caseType: CaseType;
  value: string;
  label: string;
  description: string;
}

export interface StringCaseResult {
  original: string;
  words: string[];
  conversions: ConversionResult[];
}

/**
 * Split a string into words, handling various input formats
 */
export function splitIntoWords(input: string): string[] {
  if (!input || typeof input !== 'string') {
    return [];
  }

  // Trim the input
  const trimmed = input.trim();
  if (!trimmed) {
    return [];
  }

  // Step 1: Insert spaces before uppercase letters in camelCase/PascalCase
  // But handle consecutive uppercase (acronyms) specially: "XMLParser" -> "XML Parser"
  let processed = trimmed.replace(/([a-z])([A-Z])/g, '$1 $2');
  processed = processed.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');

  // Step 2: Replace common separators with spaces
  processed = processed.replace(/[-_./\\]+/g, ' ');

  // Step 3: Split by whitespace and filter empty strings
  const words = processed
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .map((word) => word.toLowerCase());

  return words;
}

/**
 * Convert words array to camelCase
 */
export function toCamelCase(words: string[]): string {
  if (words.length === 0) return '';
  return words
    .map((word, index) => (index === 0 ? word.toLowerCase() : capitalize(word)))
    .join('');
}

/**
 * Convert words array to PascalCase
 */
export function toPascalCase(words: string[]): string {
  if (words.length === 0) return '';
  return words.map((word) => capitalize(word)).join('');
}

/**
 * Convert words array to snake_case
 */
export function toSnakeCase(words: string[]): string {
  return words.map((word) => word.toLowerCase()).join('_');
}

/**
 * Convert words array to kebab-case
 */
export function toKebabCase(words: string[]): string {
  return words.map((word) => word.toLowerCase()).join('-');
}

/**
 * Convert words array to CONSTANT_CASE (SCREAMING_SNAKE_CASE)
 */
export function toConstantCase(words: string[]): string {
  return words.map((word) => word.toUpperCase()).join('_');
}

/**
 * Convert words array to dot.case
 */
export function toDotCase(words: string[]): string {
  return words.map((word) => word.toLowerCase()).join('.');
}

/**
 * Convert words array to path/case
 */
export function toPathCase(words: string[]): string {
  return words.map((word) => word.toLowerCase()).join('/');
}

/**
 * Convert words array to Title Case
 */
export function toTitleCase(words: string[]): string {
  return words.map((word) => capitalize(word)).join(' ');
}

/**
 * Convert words array to Sentence case
 */
export function toSentenceCase(words: string[]): string {
  if (words.length === 0) return '';
  return words
    .map((word, index) => (index === 0 ? capitalize(word) : word.toLowerCase()))
    .join(' ');
}

/**
 * Convert words array to lowercase
 */
export function toLowerCase(words: string[]): string {
  return words.map((word) => word.toLowerCase()).join(' ');
}

/**
 * Convert words array to UPPERCASE
 */
export function toUpperCase(words: string[]): string {
  return words.map((word) => word.toUpperCase()).join(' ');
}

/**
 * Convert words array to Header-Case
 */
export function toHeaderCase(words: string[]): string {
  return words.map((word) => capitalize(word)).join('-');
}

/**
 * Capitalize first letter of a string
 */
function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Get all case type metadata
 */
export function getCaseTypes(): {
  type: CaseType;
  label: string;
  description: string;
  example: string;
}[] {
  return [
    {
      type: 'camelCase',
      label: 'camelCase',
      description: 'First word lowercase, subsequent words capitalized',
      example: 'myVariableName',
    },
    {
      type: 'PascalCase',
      label: 'PascalCase',
      description: 'All words capitalized, no separators',
      example: 'MyClassName',
    },
    {
      type: 'snake_case',
      label: 'snake_case',
      description: 'Lowercase with underscores',
      example: 'my_variable_name',
    },
    {
      type: 'kebab-case',
      label: 'kebab-case',
      description: 'Lowercase with hyphens',
      example: 'my-css-class',
    },
    {
      type: 'CONSTANT_CASE',
      label: 'CONSTANT_CASE',
      description: 'Uppercase with underscores',
      example: 'MAX_VALUE',
    },
    {
      type: 'dot.case',
      label: 'dot.case',
      description: 'Lowercase with dots',
      example: 'config.file.path',
    },
    {
      type: 'path/case',
      label: 'path/case',
      description: 'Lowercase with forward slashes',
      example: 'my/file/path',
    },
    {
      type: 'Title Case',
      label: 'Title Case',
      description: 'Each word capitalized with spaces',
      example: 'My Title Here',
    },
    {
      type: 'Sentence case',
      label: 'Sentence case',
      description: 'First word capitalized, rest lowercase',
      example: 'My sentence here',
    },
    {
      type: 'lowercase',
      label: 'lowercase',
      description: 'All characters lowercase',
      example: 'all lowercase',
    },
    {
      type: 'UPPERCASE',
      label: 'UPPERCASE',
      description: 'All characters uppercase',
      example: 'ALL UPPERCASE',
    },
    {
      type: 'Header-Case',
      label: 'Header-Case',
      description: 'Capitalized words with hyphens',
      example: 'Content-Type',
    },
  ];
}

/**
 * Convert words to a specific case type
 */
export function convertToCase(words: string[], caseType: CaseType): string {
  switch (caseType) {
    case 'camelCase':
      return toCamelCase(words);
    case 'PascalCase':
      return toPascalCase(words);
    case 'snake_case':
      return toSnakeCase(words);
    case 'kebab-case':
      return toKebabCase(words);
    case 'CONSTANT_CASE':
      return toConstantCase(words);
    case 'dot.case':
      return toDotCase(words);
    case 'path/case':
      return toPathCase(words);
    case 'Title Case':
      return toTitleCase(words);
    case 'Sentence case':
      return toSentenceCase(words);
    case 'lowercase':
      return toLowerCase(words);
    case 'UPPERCASE':
      return toUpperCase(words);
    case 'Header-Case':
      return toHeaderCase(words);
    default:
      return words.join(' ');
  }
}

/**
 * Convert input string to all case formats
 */
export function convertString(input: string): StringCaseResult {
  const words = splitIntoWords(input);
  const caseTypes = getCaseTypes();

  const conversions: ConversionResult[] = caseTypes.map((ct) => ({
    caseType: ct.type,
    value: convertToCase(words, ct.type),
    label: ct.label,
    description: ct.description,
  }));

  return {
    original: input,
    words,
    conversions,
  };
}

/**
 * Batch convert multiple strings
 */
export function batchConvert(
  inputs: string[],
  targetCase: CaseType
): { original: string; converted: string }[] {
  return inputs.map((input) => {
    const words = splitIntoWords(input);
    return {
      original: input,
      converted: convertToCase(words, targetCase),
    };
  });
}

/**
 * Detect the most likely case type of an input string
 */
export function detectCase(input: string): CaseType | null {
  if (!input || typeof input !== 'string') {
    return null;
  }

  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  // Check for specific patterns
  if (/^[a-z]+([A-Z][a-z]*)+$/.test(trimmed)) {
    return 'camelCase';
  }
  if (/^[A-Z][a-z]*([A-Z][a-z]*)+$/.test(trimmed)) {
    return 'PascalCase';
  }
  if (/^[a-z]+(_[a-z]+)+$/.test(trimmed)) {
    return 'snake_case';
  }
  if (/^[a-z]+(-[a-z]+)+$/.test(trimmed)) {
    return 'kebab-case';
  }
  if (/^[A-Z]+(_[A-Z]+)+$/.test(trimmed)) {
    return 'CONSTANT_CASE';
  }
  if (/^[a-z]+(\.[a-z]+)+$/.test(trimmed)) {
    return 'dot.case';
  }
  if (/^[a-z]+(\/[a-z]+)+$/.test(trimmed)) {
    return 'path/case';
  }
  if (/^[A-Z][a-z]*(-[A-Z][a-z]*)+$/.test(trimmed)) {
    return 'Header-Case';
  }
  if (/^[A-Z][a-z]*( [A-Z][a-z]*)+$/.test(trimmed)) {
    return 'Title Case';
  }
  if (/^[A-Z][a-z]*( [a-z]+)*$/.test(trimmed)) {
    return 'Sentence case';
  }
  if (/^[a-z\s]+$/.test(trimmed)) {
    return 'lowercase';
  }
  if (/^[A-Z\s]+$/.test(trimmed)) {
    return 'UPPERCASE';
  }

  return null;
}
