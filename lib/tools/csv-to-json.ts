export interface CsvToJsonOptions {
  delimiter?: string;
  hasHeaders?: boolean;
  customHeaders?: string[];
  detectTypes?: boolean;
  trimValues?: boolean;
  nullValues?: string[];
  outputFormat?: 'array' | 'nested' | 'compact';
  strictMode?: boolean;
}

export interface CsvToJsonResult {
  success: boolean;
  data: any;
  error?: string;
  rowCount: number;
  columnCount: number;
}

export function parseCsvToJson(
  csvData: string,
  options: CsvToJsonOptions = {}
): CsvToJsonResult {
  const {
    delimiter = ',',
    hasHeaders = true,
    customHeaders = [],
    detectTypes = false,
    trimValues = false,
    nullValues = [],
    outputFormat = 'array',
    strictMode = false,
  } = options;

  try {
    // Handle empty input
    if (!csvData || csvData.trim() === '') {
      return {
        success: false,
        error: 'Input is empty',
        data: null,
        rowCount: 0,
        columnCount: 0,
      };
    }

    // Remove BOM if present
    let cleanedCsv = csvData.replace(/^\uFEFF/, '');

    // Normalize line endings
    cleanedCsv = cleanedCsv.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // Parse CSV
    const rows = parseCSVRows(cleanedCsv, delimiter);

    if (rows.length === 0) {
      return {
        success: false,
        error: 'No data found',
        data: null,
        rowCount: 0,
        columnCount: 0,
      };
    }

    // Determine headers
    let headers: string[];
    let dataRows: string[][];

    if (customHeaders.length > 0) {
      headers = customHeaders;
      dataRows = rows;
    } else if (hasHeaders) {
      headers = rows[0];
      dataRows = rows.slice(1);
    } else {
      // Generate default headers
      const columnCount = rows[0].length;
      headers = Array.from({ length: columnCount }, (_, i) => `column${i + 1}`);
      dataRows = rows;
    }

    // Trim headers if needed
    if (trimValues) {
      headers = headers.map((h) => h.trim());
    }

    // Validate column consistency in strict mode
    if (strictMode) {
      for (let i = 0; i < dataRows.length; i++) {
        if (dataRows[i].length !== headers.length) {
          return {
            success: false,
            error: `Inconsistent column count at row ${i + 2}: expected ${headers.length}, got ${dataRows[i].length}`,
            data: null,
            rowCount: 0,
            columnCount: 0,
          };
        }
      }
    }

    // Convert to JSON based on format
    let jsonData: any;

    switch (outputFormat) {
      case 'compact':
        jsonData = {
          headers: headers,
          rows: dataRows.map((row) =>
            row.map((value) =>
              processValue(value, detectTypes, trimValues, nullValues)
            )
          ),
        };
        break;

      case 'nested':
        jsonData = {};
        dataRows.forEach((row) => {
          const key = row[0];
          if (key) {
            const obj: any = {};
            for (let i = 1; i < headers.length; i++) {
              const value = row[i] || '';
              obj[headers[i]] = processValue(
                value,
                detectTypes,
                trimValues,
                nullValues
              );
            }
            jsonData[processValue(key, detectTypes, trimValues, nullValues)] =
              obj;
          }
        });
        break;

      case 'array':
      default:
        jsonData = dataRows.map((row) => {
          const obj: any = {};
          headers.forEach((header, index) => {
            const value = row[index] || '';
            obj[header] = processValue(
              value,
              detectTypes,
              trimValues,
              nullValues
            );
          });
          return obj;
        });
        break;
    }

    return {
      success: true,
      data: jsonData,
      rowCount: dataRows.length,
      columnCount: headers.length,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse CSV',
      data: null,
      rowCount: 0,
      columnCount: 0,
    };
  }
}

function parseCSVRows(csv: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  const lines = csv.split('\n');
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    let j = 0;

    while (j < line.length) {
      const char = line[j];
      const nextChar = line[j + 1];

      if (inQuotes) {
        if (char === '"' && nextChar === '"') {
          // Escaped quote
          currentField += '"';
          j += 2;
        } else if (char === '"') {
          // End of quoted field
          inQuotes = false;
          j++;
        } else {
          currentField += char;
          j++;
        }
      } else {
        if (char === '"') {
          // Start of quoted field
          inQuotes = true;
          j++;
        } else if (char === delimiter) {
          // End of field
          currentRow.push(currentField);
          currentField = '';
          j++;
        } else {
          currentField += char;
          j++;
        }
      }
    }

    if (inQuotes) {
      // Multi-line field
      currentField += '\n';
      i++;
    } else {
      // End of row
      currentRow.push(currentField);
      if (currentRow.some((field) => field !== '') || currentRow.length > 1) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
      i++;
    }
  }

  // Handle last field if any
  if (currentField !== '' || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some((field) => field !== '') || currentRow.length > 1) {
      rows.push(currentRow);
    }
  }

  return rows;
}

function processValue(
  value: string,
  detectTypes: boolean,
  trimValues: boolean,
  nullValues: string[]
): any {
  // Trim if needed
  let processedValue = trimValues ? value.trim() : value;

  // Check for null values
  if (nullValues.includes(processedValue)) {
    return null;
  }

  // Type detection
  if (detectTypes && processedValue !== '') {
    // Boolean
    if (processedValue.toLowerCase() === 'true') return true;
    if (processedValue.toLowerCase() === 'false') return false;

    // Number
    if (/^-?\d+$/.test(processedValue)) {
      const num = parseInt(processedValue, 10);
      if (!isNaN(num)) return num;
    }
    if (/^-?\d*\.?\d+$/.test(processedValue)) {
      const num = parseFloat(processedValue);
      if (!isNaN(num)) return num;
    }
  }

  return processedValue;
}

export function detectDelimiter(csvSample: string): string {
  const delimiters = [',', ';', '\t', '|'];
  const counts: Record<string, number> = {};

  // Count occurrences of each delimiter in first few lines
  const sampleLines = csvSample.split('\n').slice(0, 5);

  for (const delimiter of delimiters) {
    counts[delimiter] = 0;
    for (const line of sampleLines) {
      counts[delimiter] += (
        line.match(new RegExp(delimiter, 'g')) || []
      ).length;
    }
  }

  // Return delimiter with highest count
  let maxCount = 0;
  let detectedDelimiter = ',';

  for (const [delimiter, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      detectedDelimiter = delimiter;
    }
  }

  return detectedDelimiter;
}

export function validateCsv(
  csvData: string,
  delimiter: string = ','
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  try {
    const rows = parseCSVRows(csvData, delimiter);

    if (rows.length === 0) {
      errors.push('No data found');
      return { valid: false, errors };
    }

    // Check for consistent column count
    const columnCount = rows[0].length;
    for (let i = 1; i < rows.length; i++) {
      if (rows[i].length !== columnCount) {
        errors.push(
          `Row ${i + 1} has ${rows[i].length} columns, expected ${columnCount}`
        );
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'Invalid CSV format');
    return { valid: false, errors };
  }
}

export function getCsvStats(
  csvData: string,
  delimiter: string = ','
): {
  rows: number;
  columns: number;
  hasHeaders: boolean;
  delimiter: string;
} {
  try {
    const detectedDelimiter = detectDelimiter(csvData);
    const rows = parseCSVRows(csvData, detectedDelimiter);

    if (rows.length === 0) {
      return {
        rows: 0,
        columns: 0,
        hasHeaders: false,
        delimiter: detectedDelimiter,
      };
    }

    // Simple heuristic to detect headers
    const firstRow = rows[0];
    const hasHeaders = firstRow.every(
      (cell) =>
        isNaN(Number(cell)) &&
        cell.length > 0 &&
        !/^\d{4}-\d{2}-\d{2}/.test(cell)
    );

    return {
      rows: hasHeaders ? rows.length - 1 : rows.length,
      columns: rows[0].length,
      hasHeaders,
      delimiter: detectedDelimiter,
    };
  } catch {
    return {
      rows: 0,
      columns: 0,
      hasHeaders: false,
      delimiter,
    };
  }
}
