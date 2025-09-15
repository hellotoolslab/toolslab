export interface ValidationError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  type: 'syntax' | 'structure' | 'schema' | 'security';
  suggestion?: string;
  path?: string;
}

export interface ValidationMetrics {
  validationTime: number;
  fileSize: number;
  objectDepth: number;
  arrayLength: number;
  keyCount: number;
  memoryUsage?: number;
}

export interface SecurityIssue {
  type:
    | 'potential_xss'
    | 'sql_injection'
    | 'large_payload'
    | 'suspicious_patterns'
    | 'circular_reference';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  location?: string;
  recommendation: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  metrics: ValidationMetrics;
  securityIssues: SecurityIssue[];
  formattedJson?: string;
  summary: {
    errorCount: number;
    warningCount: number;
    securityIssueCount: number;
    validationLevel: ValidationLevel;
  };
}

export type ValidationLevel = 'basic' | 'structural' | 'schema' | 'security';

export interface ValidationOptions {
  level: ValidationLevel;
  schema?: object;
  schemaVersion?: 'draft-07' | 'draft-2019-09' | 'draft-2020-12';
  enableSecurity?: boolean;
  maxDepth?: number;
  maxKeys?: number;
  maxFileSize?: number;
  strictMode?: boolean;
  allowComments?: boolean; // JSON5 support
}

export function validateJSON(
  input: string,
  options: ValidationOptions = { level: 'basic' }
): ValidationResult {
  const startTime = performance.now();
  const result: ValidationResult = {
    isValid: false,
    errors: [],
    warnings: [],
    metrics: {
      validationTime: 0,
      fileSize: new Blob([input]).size,
      objectDepth: 0,
      arrayLength: 0,
      keyCount: 0,
    },
    securityIssues: [],
    summary: {
      errorCount: 0,
      warningCount: 0,
      securityIssueCount: 0,
      validationLevel: options.level,
    },
  };

  try {
    // Basic syntax validation
    if (!input.trim()) {
      result.errors.push({
        line: 1,
        column: 1,
        message: 'Empty JSON input',
        severity: 'error',
        type: 'syntax',
        suggestion: 'Provide valid JSON data to validate',
      });
      return finalizeResult(result, startTime);
    }

    // Check file size limits
    if (options.maxFileSize && result.metrics.fileSize > options.maxFileSize) {
      result.errors.push({
        line: 1,
        column: 1,
        message: `File size (${formatBytes(result.metrics.fileSize)}) exceeds maximum (${formatBytes(options.maxFileSize)})`,
        severity: 'error',
        type: 'structure',
        suggestion: 'Use a smaller file or enable streaming mode',
      });
      return finalizeResult(result, startTime);
    }

    let parsedJson: any;
    let cleanedInput = input;

    // Check for duplicate keys before parsing
    const duplicateKeyErrors = checkForDuplicateKeys(input);
    if (duplicateKeyErrors.length > 0) {
      result.errors.push(...duplicateKeyErrors);
      return finalizeResult(result, startTime);
    }

    // Parse JSON with detailed error reporting
    try {
      if (options.allowComments) {
        // Simple JSON5-like comment removal (basic implementation)
        cleanedInput = removeJSONComments(input);
      }

      parsedJson = JSON.parse(cleanedInput);
      result.formattedJson = JSON.stringify(parsedJson, null, 2);
    } catch (parseError: any) {
      const errorInfo = parseJSONError(parseError.message, cleanedInput);
      result.errors.push({
        line: errorInfo.line,
        column: errorInfo.column,
        message: errorInfo.message,
        severity: 'error',
        type: 'syntax',
        suggestion: errorInfo.suggestion,
      });
      return finalizeResult(result, startTime);
    }

    // Calculate basic metrics
    result.metrics = {
      ...result.metrics,
      objectDepth: calculateDepth(parsedJson),
      arrayLength: calculateArrayLength(parsedJson),
      keyCount: calculateKeyCount(parsedJson),
    };

    // Structural validation
    if (options.level !== 'basic') {
      performStructuralValidation(parsedJson, result, options);
    }

    // Schema validation
    if (options.level === 'schema' && options.schema) {
      performSchemaValidation(parsedJson, options.schema, result, options);
    }

    // Security validation
    if (options.enableSecurity || options.level === 'security') {
      performSecurityValidation(parsedJson, input, result, options);
    }

    result.isValid = result.errors.length === 0;
  } catch (error: any) {
    result.errors.push({
      line: 1,
      column: 1,
      message: `Unexpected validation error: ${error.message}`,
      severity: 'error',
      type: 'syntax',
    });
  }

  return finalizeResult(result, startTime);
}

function checkForDuplicateKeys(input: string): ValidationError[] {
  const errors: ValidationError[] = [];

  try {
    // More sophisticated approach - need to track object context
    let objectDepth = 0;
    let inString = false;
    let escapeNext = false;
    let currentObjectKeys = [new Set<string>()];
    let keyBuffer = '';
    let expectingKey = false;
    let expectingColon = false;

    for (let i = 0; i < input.length; i++) {
      const char = input[i];

      if (escapeNext) {
        escapeNext = false;
        continue;
      }

      if (char === '\\' && inString) {
        escapeNext = true;
        continue;
      }

      if (char === '"' && !escapeNext) {
        if (!inString) {
          inString = true;
          keyBuffer = '';
          if (expectingKey) {
            // We're starting to read a key
          }
        } else {
          inString = false;
          if (expectingKey && !expectingColon) {
            // We just finished reading a key
            expectingColon = true;
          }
        }
        continue;
      }

      if (inString) {
        if (expectingKey && !expectingColon) {
          keyBuffer += char;
        }
        continue;
      }

      // Not in string, process structural characters
      if (char === '{') {
        objectDepth++;
        currentObjectKeys.push(new Set<string>());
        expectingKey = true;
        expectingColon = false;
      } else if (char === '}') {
        currentObjectKeys.pop();
        objectDepth--;
        expectingKey = false;
        expectingColon = false;
      } else if (char === ':' && expectingColon) {
        // We have a complete key, check for duplicates
        const currentKeys = currentObjectKeys[currentObjectKeys.length - 1];
        if (currentKeys && keyBuffer) {
          if (currentKeys.has(keyBuffer)) {
            // Find line number
            let lineNumber = 1;
            for (let j = 0; j < i; j++) {
              if (input[j] === '\n') lineNumber++;
            }

            errors.push({
              line: lineNumber,
              column: 1,
              message: `Duplicate key "${keyBuffer}" found in JSON object`,
              severity: 'error',
              type: 'syntax',
              suggestion:
                'Remove duplicate keys - JSON objects must have unique property names',
            });
          } else {
            currentKeys.add(keyBuffer);
          }
        }
        expectingKey = false;
        expectingColon = false;
      } else if (char === ',' && objectDepth > 0) {
        expectingKey = true;
        expectingColon = false;
      }
    }
  } catch (error) {
    // If parsing fails, we'll catch it in the main JSON.parse
  }

  return errors;
}

function removeJSONComments(input: string): string {
  // Basic implementation - remove // and /* */ comments
  return input
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove /* */ comments
    .replace(/\/\/.*$/gm, '') // Remove // comments
    .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
}

function parseJSONError(
  errorMessage: string,
  input: string
): {
  line: number;
  column: number;
  message: string;
  suggestion: string;
} {
  // Parse error position from JSON.parse error message
  const positionMatch = errorMessage.match(/position (\d+)/);
  const unexpectedMatch = errorMessage.match(/Unexpected token (.*?) in JSON/);
  const expectedMatch = errorMessage.match(/Expected property name or '}'/);
  const duplicateMatch = errorMessage.match(/duplicate key|Duplicate key/i);

  let line = 1;
  let column = 1;
  let suggestion = 'Check JSON syntax and formatting';

  if (positionMatch) {
    const position = parseInt(positionMatch[1]);
    const lines = input.substring(0, position).split('\n');
    line = lines.length;
    column = lines[line - 1].length + 1;
  }

  let message = errorMessage;

  if (duplicateMatch) {
    suggestion =
      'Remove duplicate keys - JSON objects must have unique property names';
  } else if (unexpectedMatch) {
    const token = unexpectedMatch[1];
    if (token === 'u') {
      suggestion = 'Check for invalid Unicode escape sequences';
    } else if (token === ',') {
      suggestion = 'Remove trailing comma or add missing property';
    } else if (token === '"') {
      suggestion = 'Check for missing closing quote or escaped characters';
    }
  } else if (expectedMatch) {
    suggestion = 'Add missing property name or closing brace';
  }

  return { line, column, message, suggestion };
}

function calculateDepth(obj: any, currentDepth = 1): number {
  if (typeof obj !== 'object' || obj === null) {
    return currentDepth;
  }

  let maxDepth = currentDepth;

  if (Array.isArray(obj)) {
    for (const item of obj) {
      maxDepth = Math.max(maxDepth, calculateDepth(item, currentDepth + 1));
    }
  } else {
    for (const value of Object.values(obj)) {
      maxDepth = Math.max(maxDepth, calculateDepth(value, currentDepth + 1));
    }
  }

  return maxDepth;
}

function calculateArrayLength(obj: any): number {
  let maxLength = 0;

  if (Array.isArray(obj)) {
    maxLength = Math.max(maxLength, obj.length);
    // Also check nested arrays
    for (const item of obj) {
      maxLength = Math.max(maxLength, calculateArrayLength(item));
    }
  } else if (typeof obj === 'object' && obj !== null) {
    for (const value of Object.values(obj)) {
      maxLength = Math.max(maxLength, calculateArrayLength(value));
    }
  }

  return maxLength;
}

function calculateKeyCount(obj: any): number {
  if (typeof obj !== 'object' || obj === null) {
    return 0;
  }

  let count = 0;

  if (Array.isArray(obj)) {
    for (const item of obj) {
      count += calculateKeyCount(item);
    }
  } else {
    count += Object.keys(obj).length;
    for (const value of Object.values(obj)) {
      count += calculateKeyCount(value);
    }
  }

  return count;
}

function performStructuralValidation(
  data: any,
  result: ValidationResult,
  options: ValidationOptions
): void {
  // Check depth limits
  if (options.maxDepth && result.metrics.objectDepth > options.maxDepth) {
    result.warnings.push({
      line: 1,
      column: 1,
      message: `Object depth (${result.metrics.objectDepth}) exceeds recommended maximum (${options.maxDepth})`,
      severity: 'warning',
      type: 'structure',
      suggestion:
        'Consider flattening deeply nested objects for better performance',
    });
  }

  // Check key count limits
  if (options.maxKeys && result.metrics.keyCount > options.maxKeys) {
    result.warnings.push({
      line: 1,
      column: 1,
      message: `Total key count (${result.metrics.keyCount}) exceeds recommended maximum (${options.maxKeys})`,
      severity: 'warning',
      type: 'structure',
      suggestion: 'Consider breaking large objects into smaller chunks',
    });
  }

  // Check for duplicate keys in objects (this is different from the syntax check above)
  checkDuplicateKeys(data, result, '');

  // Check for mixed types in arrays
  checkMixedTypesInArrays(data, result, '');

  // Check for excessive nesting depth
  if (result.metrics.objectDepth > 10) {
    result.warnings.push({
      line: 1,
      column: 1,
      message: `Nesting depth exceeds recommended limit (${result.metrics.objectDepth} levels deep)`,
      severity: 'warning',
      type: 'structure',
      suggestion:
        'Consider flattening deeply nested objects for better readability and performance',
    });
  }

  // Check for circular references
  checkCircularReferences(data, result);
}

function checkDuplicateKeys(
  obj: any,
  result: ValidationResult,
  path: string
): void {
  if (typeof obj !== 'object' || obj === null) {
    return;
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      checkDuplicateKeys(item, result, `${path}[${index}]`);
    });
  } else {
    const keys = Object.keys(obj);
    const lowerCaseKeys = keys.map((k) => k.toLowerCase());
    const uniqueKeys = new Set(lowerCaseKeys);

    if (uniqueKeys.size !== keys.length) {
      result.warnings.push({
        line: 1,
        column: 1,
        message: 'Potential case-sensitive duplicate keys detected',
        severity: 'warning',
        type: 'structure',
        path: path || 'root',
        suggestion: 'Ensure key names are unique and follow consistent casing',
      });
    }

    for (const [key, value] of Object.entries(obj)) {
      checkDuplicateKeys(value, result, path ? `${path}.${key}` : key);
    }
  }
}

function checkCircularReferences(
  obj: any,
  result: ValidationResult,
  visited = new WeakSet()
): void {
  if (typeof obj !== 'object' || obj === null) {
    return;
  }

  if (visited.has(obj)) {
    result.securityIssues.push({
      type: 'circular_reference',
      severity: 'medium',
      message: 'Circular reference detected in JSON structure',
      recommendation:
        'Remove circular references to prevent infinite loops during processing',
    });
    return;
  }

  visited.add(obj);

  if (Array.isArray(obj)) {
    obj.forEach((item) => checkCircularReferences(item, result, visited));
  } else {
    for (const value of Object.values(obj)) {
      checkCircularReferences(value, result, visited);
    }
  }

  visited.delete(obj);
}

function checkMixedTypesInArrays(
  obj: any,
  result: ValidationResult,
  path: string
): void {
  if (Array.isArray(obj)) {
    if (obj.length > 1) {
      const types = new Set<string>();

      obj.forEach((item, index) => {
        let type: string = typeof item;

        // More specific type detection
        if (item === null) {
          type = 'null';
        } else if (Array.isArray(item)) {
          type = 'array';
        } else if (typeof item === 'object') {
          type = 'object';
        }

        types.add(type);
      });

      // Check if array has mixed types (more than one type)
      if (types.size > 1) {
        const typeList = Array.from(types).join(', ');
        result.warnings.push({
          line: 1,
          column: 1,
          message: `Mixed types in array${path ? ` at ${path}` : ''}: ${typeList}`,
          severity: 'warning',
          type: 'structure',
          path: path || 'root',
          suggestion:
            'Consider using consistent types within arrays for better data integrity',
        });
      }
    }

    // Recursively check nested arrays and objects
    obj.forEach((item, index) => {
      const newPath = path ? `${path}[${index}]` : `[${index}]`;
      checkMixedTypesInArrays(item, result, newPath);
    });
  } else if (typeof obj === 'object' && obj !== null) {
    // Check nested objects
    for (const [key, value] of Object.entries(obj)) {
      const newPath = path ? `${path}.${key}` : key;
      checkMixedTypesInArrays(value, result, newPath);
    }
  }
}

function performSchemaValidation(
  data: any,
  schema: object,
  result: ValidationResult,
  options: ValidationOptions
): void {
  try {
    // Basic schema validation implementation
    // In a production environment, you'd use a library like ajv
    const schemaErrors = validateAgainstSchema(
      data,
      schema,
      options.schemaVersion || 'draft-07'
    );

    schemaErrors.forEach((error) => {
      result.errors.push({
        line: 1,
        column: 1,
        message: error.message,
        severity: 'error',
        type: 'schema',
        path: error.path,
        suggestion: error.suggestion,
      });
    });
  } catch (error: any) {
    result.errors.push({
      line: 1,
      column: 1,
      message: `Schema validation failed: ${error.message}`,
      severity: 'error',
      type: 'schema',
      suggestion: 'Check that your schema is valid JSON Schema format',
    });
  }
}

function validateAgainstSchema(
  data: any,
  schema: any,
  version: string
): Array<{
  message: string;
  path: string;
  suggestion: string;
}> {
  const errors: Array<{ message: string; path: string; suggestion: string }> =
    [];

  // Basic type validation
  if (schema.type) {
    const dataType = Array.isArray(data) ? 'array' : typeof data;
    if (dataType !== schema.type) {
      errors.push({
        message: `Expected type '${schema.type}' but got '${dataType}'`,
        path: 'root',
        suggestion: `Convert data to ${schema.type} type`,
      });
    }
  }

  // Required properties validation
  if (schema.required && typeof data === 'object' && !Array.isArray(data)) {
    schema.required.forEach((prop: string) => {
      if (!(prop in data)) {
        errors.push({
          message: `Missing required property '${prop}'`,
          path: `root.${prop}`,
          suggestion: `Add the required property '${prop}' to your JSON`,
        });
      }
    });
  }

  // Properties validation
  if (schema.properties && typeof data === 'object' && !Array.isArray(data)) {
    for (const [key, propSchema] of Object.entries(schema.properties)) {
      if (key in data) {
        const nestedErrors = validateAgainstSchema(
          data[key],
          propSchema,
          version
        );
        errors.push(
          ...nestedErrors.map((err) => ({
            ...err,
            path: `root.${key}${err.path === 'root' ? '' : '.' + err.path.substring(5)}`,
          }))
        );
      }
    }
  }

  return errors;
}

function performSecurityValidation(
  data: any,
  originalInput: string,
  result: ValidationResult,
  options: ValidationOptions
): void {
  // Check for potential XSS patterns
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe[^>]*>/gi,
  ];

  const stringData = JSON.stringify(data);

  xssPatterns.forEach((pattern) => {
    if (pattern.test(stringData)) {
      result.securityIssues.push({
        type: 'potential_xss',
        severity: 'high',
        message: 'Potential XSS content detected in JSON data',
        recommendation:
          'Sanitize or escape HTML/JavaScript content before processing',
      });
    }
  });

  // Check for SQL injection patterns
  const sqlPatterns = [
    /union\s+select/gi,
    /drop\s+table/gi,
    /insert\s+into/gi,
    /delete\s+from/gi,
    /'\s*or\s*'1'\s*=\s*'1/gi,
  ];

  sqlPatterns.forEach((pattern) => {
    if (pattern.test(stringData)) {
      result.securityIssues.push({
        type: 'sql_injection',
        severity: 'critical',
        message: 'Potential SQL injection pattern detected',
        recommendation: 'Use parameterized queries and input validation',
      });
    }
  });

  // Check for suspiciously large payloads
  if (result.metrics.fileSize > 10 * 1024 * 1024) {
    // 10MB
    result.securityIssues.push({
      type: 'large_payload',
      severity: 'medium',
      message: 'Unusually large JSON payload detected',
      recommendation:
        'Implement payload size limits and consider streaming for large data',
    });
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /eval\s*\(/gi,
    /function\s*\(/gi,
    /require\s*\(/gi,
    /import\s+/gi,
    /process\.env/gi,
  ];

  suspiciousPatterns.forEach((pattern) => {
    if (pattern.test(stringData)) {
      result.securityIssues.push({
        type: 'suspicious_patterns',
        severity: 'medium',
        message: 'Suspicious code patterns detected in JSON content',
        recommendation: 'Review content for potential code injection attempts',
      });
    }
  });
}

function finalizeResult(
  result: ValidationResult,
  startTime: number
): ValidationResult {
  result.metrics.validationTime = performance.now() - startTime;
  result.summary = {
    errorCount: result.errors.length,
    warningCount: result.warnings.length,
    securityIssueCount: result.securityIssues.length,
    validationLevel: result.summary.validationLevel,
  };

  return result;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Export function for formatting JSON
export function formatJSON(
  input: string,
  indent = 2
): { success: boolean; result?: string; error?: string } {
  try {
    const parsed = JSON.parse(input);
    return {
      success: true,
      result: JSON.stringify(parsed, null, indent),
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Export function for minifying JSON
export function minifyJSON(input: string): {
  success: boolean;
  result?: string;
  error?: string;
} {
  try {
    const parsed = JSON.parse(input);
    return {
      success: true,
      result: JSON.stringify(parsed),
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Export validation results to different formats
export function exportValidationResults(
  result: ValidationResult,
  format: 'json' | 'html' | 'csv' | 'text' = 'json'
): string {
  switch (format) {
    case 'json':
      return JSON.stringify(result, null, 2);

    case 'html':
      return generateHTMLReport(result);

    case 'csv':
      return generateCSVReport(result);

    case 'text':
      return generateTextReport(result);

    default:
      return JSON.stringify(result, null, 2);
  }
}

function generateHTMLReport(result: ValidationResult): string {
  const { summary, errors, warnings, securityIssues, metrics } = result;

  return `
<!DOCTYPE html>
<html>
<head>
    <title>JSON Validation Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .summary { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        .error { color: #d32f2f; }
        .warning { color: #f57c00; }
        .security { color: #7b1fa2; }
        .metric { margin: 5px 0; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f5f5f5; }
    </style>
</head>
<body>
    <h1>JSON Validation Report</h1>

    <div class="summary">
        <h2>Summary</h2>
        <div class="metric">Validation Status: ${result.isValid ? '✅ Valid' : '❌ Invalid'}</div>
        <div class="metric">Errors: ${summary.errorCount}</div>
        <div class="metric">Warnings: ${summary.warningCount}</div>
        <div class="metric">Security Issues: ${summary.securityIssueCount}</div>
        <div class="metric">Validation Level: ${summary.validationLevel}</div>
        <div class="metric">Processing Time: ${metrics.validationTime.toFixed(2)}ms</div>
        <div class="metric">File Size: ${formatBytes(metrics.fileSize)}</div>
    </div>

    ${
      errors.length > 0
        ? `
    <h2 class="error">Errors (${errors.length})</h2>
    <table>
        <tr><th>Line</th><th>Column</th><th>Type</th><th>Message</th><th>Suggestion</th></tr>
        ${errors
          .map(
            (error) => `
        <tr>
            <td>${error.line}</td>
            <td>${error.column}</td>
            <td>${error.type}</td>
            <td>${error.message}</td>
            <td>${error.suggestion || '-'}</td>
        </tr>
        `
          )
          .join('')}
    </table>
    `
        : ''
    }

    ${
      warnings.length > 0
        ? `
    <h2 class="warning">Warnings (${warnings.length})</h2>
    <table>
        <tr><th>Line</th><th>Column</th><th>Type</th><th>Message</th><th>Suggestion</th></tr>
        ${warnings
          .map(
            (warning) => `
        <tr>
            <td>${warning.line}</td>
            <td>${warning.column}</td>
            <td>${warning.type}</td>
            <td>${warning.message}</td>
            <td>${warning.suggestion || '-'}</td>
        </tr>
        `
          )
          .join('')}
    </table>
    `
        : ''
    }

    ${
      securityIssues.length > 0
        ? `
    <h2 class="security">Security Issues (${securityIssues.length})</h2>
    <table>
        <tr><th>Type</th><th>Severity</th><th>Message</th><th>Recommendation</th></tr>
        ${securityIssues
          .map(
            (issue) => `
        <tr>
            <td>${issue.type}</td>
            <td>${issue.severity}</td>
            <td>${issue.message}</td>
            <td>${issue.recommendation}</td>
        </tr>
        `
          )
          .join('')}
    </table>
    `
        : ''
    }

</body>
</html>`;
}

function generateCSVReport(result: ValidationResult): string {
  const lines = ['Type,Line,Column,Severity,Message,Suggestion'];

  result.errors.forEach((error) => {
    lines.push(
      `Error,${error.line},${error.column},${error.severity},"${error.message}","${error.suggestion || ''}"`
    );
  });

  result.warnings.forEach((warning) => {
    lines.push(
      `Warning,${warning.line},${warning.column},${warning.severity},"${warning.message}","${warning.suggestion || ''}"`
    );
  });

  return lines.join('\n');
}

function generateTextReport(result: ValidationResult): string {
  const lines = [
    'JSON Validation Report',
    '='.repeat(50),
    '',
    `Status: ${result.isValid ? 'VALID' : 'INVALID'}`,
    `Errors: ${result.summary.errorCount}`,
    `Warnings: ${result.summary.warningCount}`,
    `Security Issues: ${result.summary.securityIssueCount}`,
    `Processing Time: ${result.metrics.validationTime.toFixed(2)}ms`,
    `File Size: ${formatBytes(result.metrics.fileSize)}`,
    '',
  ];

  if (result.errors.length > 0) {
    lines.push('ERRORS:', '');
    result.errors.forEach((error, index) => {
      lines.push(
        `${index + 1}. Line ${error.line}, Column ${error.column}: ${error.message}`
      );
      if (error.suggestion) {
        lines.push(`   Suggestion: ${error.suggestion}`);
      }
      lines.push('');
    });
  }

  if (result.warnings.length > 0) {
    lines.push('WARNINGS:', '');
    result.warnings.forEach((warning, index) => {
      lines.push(
        `${index + 1}. Line ${warning.line}, Column ${warning.column}: ${warning.message}`
      );
      if (warning.suggestion) {
        lines.push(`   Suggestion: ${warning.suggestion}`);
      }
      lines.push('');
    });
  }

  return lines.join('\n');
}
