export interface JsonToCsvOptions {
  delimiter?: string;
  qualifier?: string;
  lineEnding?: string;
  includeHeaders?: boolean;
  selectedColumns?: string[];
  columnMapping?: ColumnMapping;
  flattenNested?: boolean;
  flattenSeparator?: string;
  nullValue?: string;
  arrayDelimiter?: string;
  includeBOM?: boolean;
}

export interface ColumnMapping {
  [key: string]: string;
}

export interface ConversionStats {
  rowCount: number;
  columnCount: number;
  emptyFields: number;
  processingTime: number;
}

export interface JsonToCsvResult {
  success: boolean;
  csv?: string;
  error?: string;
  stats?: ConversionStats;
}

export interface ParseResult {
  success: boolean;
  data?: any[];
  error?: string;
}

/**
 * Parse JSON input string to array of objects
 */
export function parseJsonInput(input: string): ParseResult {
  if (!input || input.trim() === '') {
    return { success: false, error: 'Input is required' };
  }

  try {
    const parsed = JSON.parse(input.trim());

    // Convert single object to array
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return { success: true, data: [parsed] };
    }

    // Handle array
    if (Array.isArray(parsed)) {
      return { success: true, data: parsed };
    }

    // Invalid type
    return {
      success: false,
      error: 'Input must be an object or array of objects',
    };
  } catch (error) {
    return {
      success: false,
      error: `Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Flatten nested object with customizable separator
 */
export function flattenObject(
  obj: any,
  separator: string = '.',
  prefix: string = ''
): Record<string, any> {
  const flattened: Record<string, any> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}${separator}${key}` : key;

      if (value === null || value === undefined) {
        flattened[newKey] = value;
      } else if (Array.isArray(value)) {
        // Handle arrays
        if (value.length === 0) {
          flattened[newKey] = value;
        } else if (
          value.every((item) => typeof item !== 'object' || item === null)
        ) {
          // Array of primitives - flatten with index
          value.forEach((item, index) => {
            flattened[`${newKey}${separator}${index}`] = item;
          });
        } else {
          // Array of objects - flatten with index
          value.forEach((item, index) => {
            if (typeof item === 'object' && item !== null) {
              const nestedFlattened = flattenObject(
                item,
                separator,
                `${newKey}${separator}${index}`
              );
              Object.assign(flattened, nestedFlattened);
            } else {
              flattened[`${newKey}${separator}${index}`] = item;
            }
          });
        }
      } else if (typeof value === 'object' && Object.keys(value).length > 0) {
        // Recursive flattening for nested objects
        const nestedFlattened = flattenObject(value, separator, newKey);
        Object.assign(flattened, nestedFlattened);
      } else if (typeof value === 'object' && Object.keys(value).length === 0) {
        // Empty object
        flattened[newKey] = value;
      } else {
        // Primitive values
        flattened[newKey] = value;
      }
    }
  }

  return flattened;
}

/**
 * Detect all unique columns from array of objects
 */
export function detectColumns(data: any[]): string[] {
  const columnSet = new Set<string>();

  data.forEach((row) => {
    if (row && typeof row === 'object') {
      Object.keys(row).forEach((key) => columnSet.add(key));
    }
  });

  return Array.from(columnSet);
}

/**
 * Safely stringify an object, handling circular references
 */
export function safeStringify(obj: any): string {
  try {
    const seen = new WeakSet();
    return JSON.stringify(obj, (key, value) => {
      // Handle circular references
      if (value !== null && typeof value === 'object') {
        if (seen.has(value)) {
          return '[Circular]';
        }
        seen.add(value);
      }
      return value;
    });
  } catch (error) {
    // Fallback for non-serializable objects
    if (obj && typeof obj === 'object') {
      if (Array.isArray(obj)) {
        return '[Array]';
      }
      return '[Object]';
    }
    return String(obj);
  }
}

/**
 * Escape CSV value based on delimiter and qualifier
 */
export function escapeCSVValue(
  value: any,
  delimiter: string,
  qualifier: string,
  nullValue: string = ''
): string {
  // Handle null/undefined
  if (value === null || value === undefined) {
    return nullValue;
  }

  // Convert to string
  let stringValue = String(value);

  // Handle arrays
  if (Array.isArray(value)) {
    return stringValue;
  }

  // Check if value needs to be qualified
  const needsQualifying =
    stringValue.includes(delimiter) ||
    stringValue.includes(qualifier) ||
    stringValue.includes('\n') ||
    stringValue.includes('\r');

  if (needsQualifying) {
    // Escape existing qualifiers by doubling them
    stringValue = stringValue.replace(
      new RegExp(qualifier, 'g'),
      qualifier + qualifier
    );
    return qualifier + stringValue + qualifier;
  }

  return stringValue;
}

/**
 * Convert JSON to CSV format
 */
export function convertJsonToCsv(
  input: string,
  options: JsonToCsvOptions = {}
): JsonToCsvResult {
  const startTime = performance.now();

  // Default options
  const {
    delimiter = ',',
    qualifier = '"',
    lineEnding = '\n',
    includeHeaders = true,
    selectedColumns,
    columnMapping = {},
    flattenNested = false,
    flattenSeparator = '.',
    nullValue = '',
    arrayDelimiter = ',',
    includeBOM = false,
  } = options;

  // Parse input
  const parseResult = parseJsonInput(input);
  if (!parseResult.success || !parseResult.data) {
    return { success: false, error: parseResult.error };
  }

  const data = parseResult.data;

  // Check for empty data
  if (data.length === 0) {
    return { success: false, error: 'No data to convert' };
  }

  // Process data: flatten if needed OR handle arrays specially
  const processedData = data.map((row) => {
    if (flattenNested) {
      return flattenObject(row, flattenSeparator);
    } else {
      // If not flattening, still need to handle arrays for CSV output
      const processedRow: any = {};
      for (const key in row) {
        if (Array.isArray(row[key])) {
          // Join arrays with delimiter for CSV output
          processedRow[key] = row[key];
        } else {
          processedRow[key] = row[key];
        }
      }
      return processedRow;
    }
  });

  // Detect or use selected columns
  const detectedColumns = detectColumns(processedData);
  const columns =
    selectedColumns && selectedColumns.length > 0
      ? selectedColumns.filter((col) => detectedColumns.includes(col))
      : detectedColumns;

  if (columns.length === 0) {
    return { success: false, error: 'No valid columns found' };
  }

  // Build CSV
  const csvRows: string[] = [];

  // Add headers if requested
  if (includeHeaders) {
    const headers = columns.map((col) => {
      const mappedName = columnMapping[col] || col;
      // Don't escape header names unless they contain special chars
      const needsEscape =
        mappedName.includes(delimiter) ||
        mappedName.includes(qualifier) ||
        mappedName.includes('\n') ||
        mappedName.includes('\r');
      return needsEscape
        ? escapeCSVValue(mappedName, delimiter, qualifier)
        : mappedName;
    });
    csvRows.push(headers.join(delimiter));
  }

  // Add data rows
  let emptyFieldCount = 0;
  processedData.forEach((row) => {
    const values = columns.map((col) => {
      let value = row[col];

      // Count empty fields
      if (value === null || value === undefined || value === '') {
        emptyFieldCount++;
      }

      // Handle arrays
      if (Array.isArray(value)) {
        const joinedValue = value.join(arrayDelimiter);
        // Only quote if contains delimiter or special chars
        const needsQuoting =
          joinedValue.includes(delimiter) ||
          joinedValue.includes(qualifier) ||
          joinedValue.includes('\n') ||
          joinedValue.includes('\r');
        return needsQuoting
          ? escapeCSVValue(joinedValue, delimiter, qualifier, nullValue)
          : joinedValue;
      }

      // Handle objects (stringify them)
      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
      ) {
        if (Object.keys(value).length === 0) {
          value = '';
        } else {
          value = safeStringify(value);
        }
      }

      // Don't quote numbers and simple strings unless they contain special chars
      if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
      }

      if (typeof value === 'string') {
        const needsQuoting =
          value.includes(delimiter) ||
          value.includes(qualifier) ||
          value.includes('\n') ||
          value.includes('\r') ||
          value.includes(' '); // Quote strings with spaces like names
        return needsQuoting
          ? escapeCSVValue(value, delimiter, qualifier, nullValue)
          : value;
      }

      return escapeCSVValue(value, delimiter, qualifier, nullValue);
    });
    csvRows.push(values.join(delimiter));
  });

  // Join rows with line ending
  let csvContent = csvRows.join(lineEnding);

  // Add BOM if requested (for Excel UTF-8 compatibility)
  if (includeBOM) {
    csvContent = '\uFEFF' + csvContent;
  }

  const processingTime = performance.now() - startTime;

  return {
    success: true,
    csv: csvContent,
    stats: {
      rowCount: processedData.length,
      columnCount: columns.length,
      emptyFields: emptyFieldCount,
      processingTime: Math.round(processingTime * 100) / 100,
    },
  };
}

/**
 * Generate sample JSON for testing
 */
export function generateSampleJson(): string {
  const sample = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
      department: 'Engineering',
      address: {
        street: '123 Main St',
        city: 'New York',
        country: 'USA',
        postal: '10001',
      },
      skills: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
      projects: [
        { name: 'Project A', status: 'completed', hours: 120 },
        { name: 'Project B', status: 'in-progress', hours: 45 },
      ],
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      age: 28,
      department: 'Design',
      address: {
        street: '456 Oak Ave',
        city: 'Los Angeles',
        country: 'USA',
        postal: '90001',
      },
      skills: ['Figma', 'Sketch', 'UI/UX', 'Prototyping'],
      projects: [
        { name: 'Project C', status: 'completed', hours: 80 },
        { name: 'Project D', status: 'planning', hours: 15 },
      ],
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      age: 35,
      department: 'Marketing',
      address: {
        street: '789 Pine Rd',
        city: 'Chicago',
        country: 'USA',
        postal: '60601',
      },
      skills: ['SEO', 'Content Strategy', 'Analytics', 'Social Media'],
      projects: [
        { name: 'Campaign X', status: 'completed', hours: 200 },
        { name: 'Campaign Y', status: 'in-progress', hours: 120 },
      ],
    },
  ];

  return JSON.stringify(sample, null, 2);
}

/**
 * Validate CSV output
 */
export function validateCsv(csv: string, delimiter: string = ','): boolean {
  try {
    const lines = csv.split(/\r?\n/);
    if (lines.length === 0) return false;

    const headerCount = lines[0].split(delimiter).length;

    // Check each row has same number of fields
    for (const line of lines) {
      if (line.trim() === '') continue;
      // This is a simplified check - real CSV parsing is more complex
      const fieldCount = line.split(delimiter).length;
      if (fieldCount !== headerCount) {
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Download CSV file
 */
export function downloadCsv(
  csvContent: string,
  filename: string = 'data.csv'
): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Copy CSV to clipboard
 */
export async function copyCsvToClipboard(csvContent: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(csvContent);
    return true;
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = csvContent;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    } catch {
      document.body.removeChild(textarea);
      return false;
    }
  }
}
