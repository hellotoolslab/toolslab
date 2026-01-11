import yaml from 'js-yaml';

export interface YamlValidationResult {
  success: boolean;
  isValid: boolean;
  parsedData?: unknown;
  prettyYaml?: string;
  documentCount?: number;
  error?: {
    message: string;
    line?: number;
    column?: number;
    snippet?: string;
  };
  metadata?: {
    documentCount: number;
    hasMultipleDocuments: boolean;
    rootType: string;
    keyCount?: number;
  };
}

export interface YamlValidatorOptions {
  allowDuplicateKeys?: boolean;
  strict?: boolean;
}

/**
 * Get the type of a YAML value for display purposes
 */
function getYamlType(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (Array.isArray(value)) return 'array';
  if (value instanceof Date) return 'date';
  return typeof value;
}

/**
 * Count keys in an object recursively
 */
function countKeys(obj: unknown): number {
  if (obj === null || obj === undefined) return 0;
  if (typeof obj !== 'object') return 0;

  if (Array.isArray(obj)) {
    return obj.reduce((count, item) => count + countKeys(item), 0);
  }

  let count = Object.keys(obj).length;
  for (const value of Object.values(obj)) {
    count += countKeys(value);
  }
  return count;
}

/**
 * Extract line snippet around error for context
 */
function getErrorSnippet(input: string, line: number): string {
  const lines = input.split('\n');
  const start = Math.max(0, line - 2);
  const end = Math.min(lines.length, line + 2);

  return lines
    .slice(start, end)
    .map((l, i) => {
      const lineNum = start + i + 1;
      const prefix = lineNum === line ? '→ ' : '  ';
      return `${prefix}${lineNum}: ${l}`;
    })
    .join('\n');
}

/**
 * Check for duplicate keys in YAML content
 */
function checkDuplicateKeys(input: string): {
  hasDuplicates: boolean;
  duplicates: string[];
} {
  const duplicates: string[] = [];
  const keyPattern = /^(\s*)([^:\n#]+):/gm;
  const keysByIndent: Map<number, Map<string, number>> = new Map();

  let match;
  while ((match = keyPattern.exec(input)) !== null) {
    const indent = match[1].length;
    const key = match[2].trim();

    // Skip if it looks like a value continuation
    if (key.startsWith('-') || key.startsWith('"') || key.startsWith("'"))
      continue;

    if (!keysByIndent.has(indent)) {
      keysByIndent.set(indent, new Map());
    }

    const keysAtLevel = keysByIndent.get(indent)!;
    const count = keysAtLevel.get(key) || 0;
    keysAtLevel.set(key, count + 1);

    if (count === 1) {
      duplicates.push(key);
    }
  }

  return {
    hasDuplicates: duplicates.length > 0,
    duplicates: [...new Set(duplicates)],
  };
}

/**
 * Validate YAML content
 */
export function validateYaml(
  input: string,
  options: YamlValidatorOptions = {}
): YamlValidationResult {
  const { allowDuplicateKeys = false, strict = true } = options;

  // Handle empty input
  if (!input || !input.trim()) {
    return {
      success: false,
      isValid: false,
      error: {
        message: 'Input is empty. Please provide YAML content to validate.',
      },
    };
  }

  try {
    // Check for duplicate keys if not allowed
    if (!allowDuplicateKeys) {
      const duplicateCheck = checkDuplicateKeys(input);
      if (duplicateCheck.hasDuplicates) {
        return {
          success: true,
          isValid: false,
          error: {
            message: `Duplicate keys found: ${duplicateCheck.duplicates.join(', ')}. Duplicate keys can cause unexpected behavior.`,
          },
        };
      }
    }

    // Try to parse as multi-document YAML
    const documents = yaml.loadAll(input, undefined, {
      json: !strict,
      schema: yaml.DEFAULT_SCHEMA,
    });

    const documentCount = documents.length;
    const hasMultipleDocuments = documentCount > 1;

    // Get the primary document for analysis
    const primaryDoc = documents[0];
    const rootType = getYamlType(primaryDoc);
    const keyCount = rootType === 'object' ? countKeys(primaryDoc) : undefined;

    // Generate pretty-printed YAML
    let prettyYaml: string;
    if (hasMultipleDocuments) {
      prettyYaml = documents
        .map((doc: unknown) =>
          yaml.dump(doc, { indent: 2, lineWidth: 80, noRefs: true })
        )
        .join('---\n');
    } else {
      prettyYaml = yaml.dump(primaryDoc, {
        indent: 2,
        lineWidth: 80,
        noRefs: true,
      });
    }

    return {
      success: true,
      isValid: true,
      parsedData: hasMultipleDocuments ? documents : primaryDoc,
      prettyYaml,
      documentCount,
      metadata: {
        documentCount,
        hasMultipleDocuments,
        rootType,
        keyCount,
      },
    };
  } catch (err) {
    const yamlError = err as yaml.YAMLException;

    // Extract error details
    const line =
      yamlError.mark?.line !== undefined ? yamlError.mark.line + 1 : undefined;
    const column =
      yamlError.mark?.column !== undefined
        ? yamlError.mark.column + 1
        : undefined;
    const snippet = line ? getErrorSnippet(input, line) : undefined;

    // Clean up error message
    let message = yamlError.message || 'Unknown YAML parsing error';
    // Remove the mark info from message since we display it separately
    message = message.replace(/at line \d+, column \d+:?/gi, '').trim();
    message = message.replace(/:\s*$/, '');

    return {
      success: true,
      isValid: false,
      error: {
        message: message || 'Invalid YAML syntax',
        line,
        column,
        snippet,
      },
    };
  }
}

/**
 * Format YAML content (pretty print)
 */
export function formatYaml(input: string): YamlValidationResult {
  const result = validateYaml(input);

  if (!result.isValid) {
    return result;
  }

  return {
    ...result,
    prettyYaml: result.prettyYaml,
  };
}

/**
 * Get sample YAML templates
 */
export function getYamlSamples(): {
  name: string;
  description: string;
  content: string;
}[] {
  return [
    {
      name: 'Basic Config',
      description: 'Simple key-value configuration',
      content: `# Application Configuration
app:
  name: MyApp
  version: 1.0.0
  debug: false

server:
  host: localhost
  port: 8080
  timeout: 30

database:
  driver: postgres
  host: localhost
  port: 5432
  name: myapp_db`,
    },
    {
      name: 'Kubernetes Deployment',
      description: 'K8s Deployment manifest',
      content: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80`,
    },
    {
      name: 'Docker Compose',
      description: 'Docker Compose service definition',
      content: `version: '3.8'

services:
  web:
    build: .
    ports:
      - "5000:5000"
    volumes:
      - .:/code
    environment:
      - FLASK_ENV=development
    depends_on:
      - redis

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"`,
    },
    {
      name: 'GitHub Actions',
      description: 'CI/CD workflow',
      content: `name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: npm ci

    - name: Run tests
      run: npm test`,
    },
    {
      name: 'Multi-Document',
      description: 'Multiple YAML documents',
      content: `# First document
---
name: document1
type: config
settings:
  enabled: true
  level: info

# Second document
---
name: document2
type: data
items:
  - id: 1
    value: first
  - id: 2
    value: second`,
    },
    {
      name: 'Complex Types',
      description: 'YAML type examples',
      content: `# String types
plain_string: Hello World
quoted_string: "Contains: special chars"
multiline_literal: |
  This is a
  multiline string
  that preserves newlines
multiline_folded: >
  This is a long string
  that will be folded into
  a single line

# Number types
integer: 42
float: 3.14159
scientific: 1.23e+10
hex: 0xFF
octal: 0o755

# Boolean and null
is_enabled: true
is_disabled: false
empty_value: null
also_null: ~

# Date and time
date: 2024-01-15
datetime: 2024-01-15T10:30:00Z

# Collections
simple_list:
  - item1
  - item2
  - item3

inline_list: [a, b, c]

nested_map:
  level1:
    level2:
      level3: deep value

inline_map: {key1: value1, key2: value2}`,
    },
  ];
}
