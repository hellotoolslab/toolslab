import * as YAML from 'yaml';

export interface ConversionOptions {
  // YAML to JSON options
  dateFormat?: 'iso' | 'unix' | 'string';
  expandReferences?: boolean;
  preserveComments?: boolean;
  preserveKeyOrder?: boolean;
  handleNaN?: 'null' | 'string' | 'keep';
  handleInfinity?: 'null' | 'string' | 'keep';

  // JSON to YAML options
  indent?: 2 | 4;
  quoteStyle?: 'single' | 'double' | 'none';
  flowLevel?: number;
  lineWidth?: number;
  noRefs?: boolean;
  nullStr?: 'null' | '~' | '';

  // Common options
  prettyPrint?: boolean;
  sortKeys?: 'alphabetical' | 'original' | 'none';
}

export interface ConversionResult {
  success: boolean;
  output?: string;
  error?: string;
  warnings?: string[];
  metadata?: {
    inputFormat: 'yaml' | 'json';
    outputFormat: 'yaml' | 'json';
    documentCount?: number;
    hasAnchors?: boolean;
    hasComments?: boolean;
    dataLoss?: boolean;
  };
}

export interface ValidationResult {
  valid: boolean;
  errors?: Array<{
    message: string;
    line?: number;
    column?: number;
  }>;
}

// Detect input format
export function detectFormat(input: string): 'yaml' | 'json' | 'unknown' {
  if (!input || input.trim() === '') return 'unknown';

  const trimmed = input.trim();

  // Quick JSON detection
  if (
    (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
    (trimmed.startsWith('[') && trimmed.endsWith(']'))
  ) {
    try {
      JSON.parse(trimmed);
      return 'json';
    } catch {
      // Not valid JSON, might be YAML
    }
  }

  // YAML indicators
  if (
    trimmed.includes('---') ||
    trimmed.includes(':') ||
    trimmed.includes('- ') ||
    trimmed.includes('|') ||
    trimmed.includes('>') ||
    trimmed.includes('&') ||
    trimmed.includes('*') ||
    trimmed.includes('!!') ||
    trimmed.includes('~')
  ) {
    try {
      YAML.parse(trimmed);
      return 'yaml';
    } catch {
      // Not valid YAML
    }
  }

  // Try parsing as YAML (more lenient)
  try {
    YAML.parse(trimmed);
    return 'yaml';
  } catch {
    // Try JSON as fallback
    try {
      JSON.parse(trimmed);
      return 'json';
    } catch {
      return 'unknown';
    }
  }
}

// Validate YAML
export function validateYaml(input: string): ValidationResult {
  try {
    YAML.parseAllDocuments(input, { strict: true });
    return { valid: true };
  } catch (error: any) {
    const errors: ValidationResult['errors'] = [];

    if (error instanceof YAML.YAMLError) {
      errors.push({
        message: error.message,
        line: error.linePos?.[0]?.line,
        column: error.linePos?.[0]?.col,
      });
    } else {
      errors.push({ message: error.message || 'Invalid YAML' });
    }

    return { valid: false, errors };
  }
}

// Validate JSON
export function validateJson(input: string): ValidationResult {
  try {
    JSON.parse(input);
    return { valid: true };
  } catch (error: any) {
    const errors: ValidationResult['errors'] = [];

    // Try to extract line and column from error message
    const match = error.message.match(/position (\d+)/);
    if (match) {
      const position = parseInt(match[1], 10);
      const lines = input.substring(0, position).split('\n');
      errors.push({
        message: error.message,
        line: lines.length,
        column: lines[lines.length - 1].length + 1,
      });
    } else {
      errors.push({ message: error.message || 'Invalid JSON' });
    }

    return { valid: false, errors };
  }
}

// Process special YAML values for JSON conversion
function processYamlValue(value: any, options: ConversionOptions): any {
  if (value === null || value === undefined) {
    return null;
  }

  // Handle dates
  if (value instanceof Date) {
    switch (options.dateFormat) {
      case 'unix':
        return Math.floor(value.getTime() / 1000);
      case 'string':
        return value.toString();
      case 'iso':
      default:
        return value.toISOString();
    }
  }

  // Handle special numbers
  if (typeof value === 'number') {
    if (Number.isNaN(value)) {
      switch (options.handleNaN) {
        case 'null':
          return null;
        case 'string':
          return 'NaN';
        case 'keep':
        default:
          return null; // JSON doesn't support NaN
      }
    }

    if (!Number.isFinite(value)) {
      switch (options.handleInfinity) {
        case 'null':
          return null;
        case 'string':
          return value > 0 ? 'Infinity' : '-Infinity';
        case 'keep':
        default:
          return null; // JSON doesn't support Infinity
      }
    }
  }

  // Handle arrays
  if (Array.isArray(value)) {
    return value.map((item) => processYamlValue(item, options));
  }

  // Handle objects
  if (typeof value === 'object' && value !== null) {
    const result: any = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = processYamlValue(val, options);
    }
    return result;
  }

  return value;
}

// Convert YAML to JSON
export function yamlToJson(
  input: string,
  options: ConversionOptions = {}
): ConversionResult {
  try {
    if (!input || input.trim() === '') {
      return {
        success: false,
        error: 'Input is empty',
      };
    }

    const defaultOptions: ConversionOptions = {
      dateFormat: 'iso',
      expandReferences: true,
      preserveComments: false,
      preserveKeyOrder: true,
      handleNaN: 'null',
      handleInfinity: 'null',
      prettyPrint: true,
      sortKeys: 'original',
      ...options,
    };

    const metadata: ConversionResult['metadata'] = {
      inputFormat: 'yaml',
      outputFormat: 'json',
    };

    const warnings: string[] = [];

    // Parse all documents
    const documents = YAML.parseAllDocuments(input, {
      keepSourceTokens: defaultOptions.preserveComments,
      merge: defaultOptions.expandReferences,
    });

    if (documents.length === 0) {
      return {
        success: false,
        error: 'No valid YAML documents found',
      };
    }

    metadata.documentCount = documents.length;

    // Check for features
    for (const doc of documents) {
      if (doc.errors && doc.errors.length > 0) {
        return {
          success: false,
          error: doc.errors[0].message,
        };
      }

      // Check for anchors
      if (
        doc.contents &&
        YAML.visit(doc.contents, {
          Alias: () => {
            metadata.hasAnchors = true;
            return YAML.visit.SKIP;
          },
        })
      ) {
        metadata.hasAnchors = true;
      }

      // Check for comments
      if (defaultOptions.preserveComments && doc.commentBefore) {
        metadata.hasComments = true;
      }
    }

    // Convert documents
    const results = documents.map((doc) => {
      const json = doc.toJSON();
      return processYamlValue(json, defaultOptions);
    });

    let output: any = results.length === 1 ? results[0] : results;

    // Sort keys if requested
    if (
      defaultOptions.sortKeys === 'alphabetical' &&
      typeof output === 'object' &&
      !Array.isArray(output)
    ) {
      output = sortObjectKeys(output);
    }

    // Format output
    const jsonString = defaultOptions.prettyPrint
      ? JSON.stringify(output, null, 2)
      : JSON.stringify(output);

    // Add warnings
    if (metadata.hasAnchors && defaultOptions.expandReferences) {
      warnings.push('YAML anchors and aliases were expanded in the output');
    }
    if (metadata.hasComments && !defaultOptions.preserveComments) {
      warnings.push('Comments were removed during conversion');
    }

    return {
      success: true,
      output: jsonString,
      warnings: warnings.length > 0 ? warnings : undefined,
      metadata,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to convert YAML to JSON',
    };
  }
}

// Convert JSON to YAML
export function jsonToYaml(
  input: string,
  options: ConversionOptions = {}
): ConversionResult {
  try {
    if (!input || input.trim() === '') {
      return {
        success: false,
        error: 'Input is empty',
      };
    }

    const defaultOptions: ConversionOptions = {
      indent: 2,
      quoteStyle: 'single',
      flowLevel: -1,
      lineWidth: 80,
      noRefs: false,
      nullStr: 'null',
      sortKeys: 'original',
      ...options,
    };

    const metadata: ConversionResult['metadata'] = {
      inputFormat: 'json',
      outputFormat: 'yaml',
    };

    // Parse JSON
    let data: any;
    try {
      data = JSON.parse(input);
    } catch (error: any) {
      return {
        success: false,
        error: `Invalid JSON: ${error.message}`,
      };
    }

    // Sort keys if requested
    if (
      defaultOptions.sortKeys === 'alphabetical' &&
      typeof data === 'object' &&
      !Array.isArray(data)
    ) {
      data = sortObjectKeys(data);
    }

    // Convert to YAML
    const yamlOptions: YAML.DocumentOptions &
      YAML.SchemaOptions &
      YAML.ToStringOptions = {
      indent: defaultOptions.indent,
      lineWidth: defaultOptions.lineWidth,
      minContentWidth: 20,
      singleQuote: defaultOptions.quoteStyle === 'single',
      doubleQuotedAsJSON: true,
      defaultKeyType: 'PLAIN',
      defaultStringType: 'PLAIN',
      nullStr: defaultOptions.nullStr || 'null',
    };

    // Handle multiple documents
    let output: string;
    if (
      Array.isArray(data) &&
      data.every((item) => typeof item === 'object' && item !== null)
    ) {
      // Check if this should be multi-document YAML
      const prompt =
        data.length > 1 &&
        data.every((item) => typeof item === 'object' && !Array.isArray(item));
      if (prompt && options.flowLevel === -1) {
        // Convert as multi-document
        output = data
          .map((item) => YAML.stringify(item, yamlOptions))
          .join('---\n');
        metadata.documentCount = data.length;
      } else {
        // Convert as single array
        output = YAML.stringify(data, yamlOptions);
        metadata.documentCount = 1;
      }
    } else {
      output = YAML.stringify(data, yamlOptions);
      metadata.documentCount = 1;
    }

    return {
      success: true,
      output,
      metadata,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to convert JSON to YAML',
    };
  }
}

// Helper function to sort object keys
function sortObjectKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }

  if (typeof obj === 'object' && obj !== null) {
    const sorted: any = {};
    const keys = Object.keys(obj).sort();
    for (const key of keys) {
      sorted[key] = sortObjectKeys(obj[key]);
    }
    return sorted;
  }

  return obj;
}

// Generate TypeScript interface from JSON
export function generateTypeScriptInterface(
  json: string,
  interfaceName: string = 'Root'
): string {
  try {
    const data = JSON.parse(json);
    return generateInterface(data, interfaceName);
  } catch (error: any) {
    return `// Error: ${error.message}`;
  }
}

function generateInterface(
  data: any,
  name: string,
  indent: number = 0
): string {
  const spaces = ' '.repeat(indent);

  if (data === null || data === undefined) {
    return 'null';
  }

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return 'any[]';
    }
    const firstItem = data[0];
    const itemType = generateInterface(firstItem, `${name}Item`, indent);
    return `${itemType}[]`;
  }

  if (typeof data === 'object') {
    const properties: string[] = [];
    for (const [key, value] of Object.entries(data)) {
      const safeName = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)
        ? key
        : `"${key}"`;
      const isOptional = value === null || value === undefined ? '?' : '';
      const type = generateInterface(
        value,
        `${name}${key.charAt(0).toUpperCase() + key.slice(1)}`,
        indent + 2
      );
      properties.push(`${spaces}  ${safeName}${isOptional}: ${type};`);
    }

    if (indent === 0) {
      return `export interface ${name} {\n${properties.join('\n')}\n}`;
    }
    return `{\n${properties.join('\n')}\n${spaces}}`;
  }

  if (typeof data === 'string') return 'string';
  if (typeof data === 'number') return 'number';
  if (typeof data === 'boolean') return 'boolean';

  return 'any';
}

// Generate JSON Schema from JSON
export function generateJsonSchema(json: string): object {
  try {
    const data = JSON.parse(json);
    return {
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: getSchemaType(data),
      ...generateSchemaObject(data),
    };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
}

function getSchemaType(value: any): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

function generateSchemaObject(data: any): any {
  if (data === null || data === undefined) {
    return {};
  }

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return { items: {} };
    }
    return {
      items: {
        type: getSchemaType(data[0]),
        ...generateSchemaObject(data[0]),
      },
    };
  }

  if (typeof data === 'object') {
    const properties: any = {};
    const required: string[] = [];

    for (const [key, value] of Object.entries(data)) {
      properties[key] = {
        type: getSchemaType(value),
        ...generateSchemaObject(value),
      };
      if (value !== null && value !== undefined) {
        required.push(key);
      }
    }

    return {
      properties,
      required: required.length > 0 ? required : undefined,
    };
  }

  return {};
}
