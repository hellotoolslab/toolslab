import {
  parseCsvToJson,
  CsvToJsonOptions,
  CsvToJsonResult,
} from '@/lib/tools/csv-to-json';

describe('CSV to JSON Converter', () => {
  describe('parseCsvToJson', () => {
    it('should convert basic CSV with headers to JSON', () => {
      const csv = `name,age,city
John,30,New York
Jane,25,Los Angeles
Bob,35,Chicago`;

      const result = parseCsvToJson(csv);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([
        { name: 'John', age: '30', city: 'New York' },
        { name: 'Jane', age: '25', city: 'Los Angeles' },
        { name: 'Bob', age: '35', city: 'Chicago' },
      ]);
      expect(result.rowCount).toBe(3);
      expect(result.columnCount).toBe(3);
    });

    it('should handle CSV with custom delimiter', () => {
      const csv = `name;age;city
John;30;Berlin
Jane;25;Paris`;

      const options: CsvToJsonOptions = {
        delimiter: ';',
      };

      const result = parseCsvToJson(csv, options);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([
        { name: 'John', age: '30', city: 'Berlin' },
        { name: 'Jane', age: '25', city: 'Paris' },
      ]);
    });

    it('should handle CSV with tab delimiter', () => {
      const csv = `name\tage\tcity
John\t30\tTokyo
Jane\t25\tSeoul`;

      const options: CsvToJsonOptions = {
        delimiter: '\t',
      };

      const result = parseCsvToJson(csv, options);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
    });

    it('should detect and convert data types when enabled', () => {
      const csv = `name,age,score,active,date
John,30,95.5,true,2024-01-15
Jane,25,87.2,false,2024-02-20`;

      const options: CsvToJsonOptions = {
        detectTypes: true,
      };

      const result = parseCsvToJson(csv, options);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([
        {
          name: 'John',
          age: 30,
          score: 95.5,
          active: true,
          date: '2024-01-15',
        },
        {
          name: 'Jane',
          age: 25,
          score: 87.2,
          active: false,
          date: '2024-02-20',
        },
      ]);
    });

    it('should handle CSV without headers', () => {
      const csv = `John,30,New York
Jane,25,Los Angeles`;

      const options: CsvToJsonOptions = {
        hasHeaders: false,
      };

      const result = parseCsvToJson(csv, options);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([
        { column1: 'John', column2: '30', column3: 'New York' },
        { column1: 'Jane', column2: '25', column3: 'Los Angeles' },
      ]);
    });

    it('should handle custom headers', () => {
      const csv = `John,30,New York
Jane,25,Los Angeles`;

      const options: CsvToJsonOptions = {
        hasHeaders: false,
        customHeaders: ['firstName', 'yearsOld', 'location'],
      };

      const result = parseCsvToJson(csv, options);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([
        { firstName: 'John', yearsOld: '30', location: 'New York' },
        { firstName: 'Jane', yearsOld: '25', location: 'Los Angeles' },
      ]);
    });

    it('should handle quoted fields with delimiters', () => {
      const csv = `name,description,price
"Product A","High quality, durable",29.99
"Product B","Lightweight, portable",19.99`;

      const result = parseCsvToJson(csv);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([
        {
          name: 'Product A',
          description: 'High quality, durable',
          price: '29.99',
        },
        {
          name: 'Product B',
          description: 'Lightweight, portable',
          price: '19.99',
        },
      ]);
    });

    it('should handle empty fields', () => {
      const csv = `name,age,city
John,,New York
,25,
Bob,35,Chicago`;

      const result = parseCsvToJson(csv);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([
        { name: 'John', age: '', city: 'New York' },
        { name: '', age: '25', city: '' },
        { name: 'Bob', age: '35', city: 'Chicago' },
      ]);
    });

    it('should handle null values when specified', () => {
      const csv = `name,age,city
John,NULL,New York
Jane,25,NULL`;

      const options: CsvToJsonOptions = {
        nullValues: ['NULL'],
        detectTypes: true,
      };

      const result = parseCsvToJson(csv, options);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([
        { name: 'John', age: null, city: 'New York' },
        { name: 'Jane', age: 25, city: null },
      ]);
    });

    it('should handle line breaks in quoted fields', () => {
      const csv = `name,description
"Product A","Line 1
Line 2
Line 3"
"Product B","Single line"`;

      const result = parseCsvToJson(csv);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([
        { name: 'Product A', description: 'Line 1\nLine 2\nLine 3' },
        { name: 'Product B', description: 'Single line' },
      ]);
    });

    it('should trim whitespace from values', () => {
      const csv = `name, age , city
  John  , 30 ,  New York  
Jane,25,Los Angeles`;

      const options: CsvToJsonOptions = {
        trimValues: true,
      };

      const result = parseCsvToJson(csv, options);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([
        { name: 'John', age: '30', city: 'New York' },
        { name: 'Jane', age: '25', city: 'Los Angeles' },
      ]);
    });

    it('should handle different output formats', () => {
      const csv = `name,age
John,30
Jane,25`;

      // Compact format
      const compactResult = parseCsvToJson(csv, { outputFormat: 'compact' });
      expect(compactResult.success).toBe(true);
      expect(compactResult.data).toEqual({
        headers: ['name', 'age'],
        rows: [
          ['John', '30'],
          ['Jane', '25'],
        ],
      });

      // Nested format
      const nestedResult = parseCsvToJson(csv, { outputFormat: 'nested' });
      expect(nestedResult.success).toBe(true);
      expect(nestedResult.data).toEqual({
        John: { age: '30' },
        Jane: { age: '25' },
      });
    });

    it('should handle edge cases', () => {
      // Empty input
      expect(parseCsvToJson('')).toEqual({
        success: false,
        error: 'Input is empty',
        data: null,
        rowCount: 0,
        columnCount: 0,
      });

      // Only headers
      const headersOnly = parseCsvToJson('name,age,city');
      expect(headersOnly.success).toBe(true);
      expect(headersOnly.data).toEqual([]);
      expect(headersOnly.rowCount).toBe(0);

      // Invalid delimiter
      const invalidDelimiter = parseCsvToJson('name|age|city\nJohn|30|NYC', {
        delimiter: ',',
      });
      expect(invalidDelimiter.success).toBe(true);
      expect(invalidDelimiter.data).toHaveLength(1);
    });

    it('should handle BOM (Byte Order Mark)', () => {
      const csvWithBOM = '\uFEFFname,age,city\nJohn,30,NYC';
      const result = parseCsvToJson(csvWithBOM);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([{ name: 'John', age: '30', city: 'NYC' }]);
    });

    it('should handle Windows line endings', () => {
      const csv = 'name,age,city\r\nJohn,30,NYC\r\nJane,25,LA';
      const result = parseCsvToJson(csv);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
    });

    it('should validate column consistency', () => {
      const csv = `name,age,city
John,30,NYC
Jane,25
Bob,35,Chicago,Extra`;

      const result = parseCsvToJson(csv, { strictMode: true });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Inconsistent column count');
    });

    it('should handle large datasets efficiently', () => {
      const rows = 10000;
      const headers = 'id,name,value';
      const data = Array.from(
        { length: rows },
        (_, i) => `${i},Name${i},${Math.random()}`
      ).join('\n');
      const csv = `${headers}\n${data}`;

      const startTime = performance.now();
      const result = parseCsvToJson(csv);
      const endTime = performance.now();

      expect(result.success).toBe(true);
      expect(result.rowCount).toBe(rows);
      expect(endTime - startTime).toBeLessThan(1000); // Should process in under 1 second
    });
  });
});
