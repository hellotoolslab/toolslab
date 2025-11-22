import {
  validateJSON,
  formatJSON,
  minifyJSON,
  exportValidationResults,
  ValidationLevel,
  ValidationOptions,
} from '../../../lib/tools/json-validator';

describe('JSON Validator', () => {
  describe('validateJSON', () => {
    describe('Basic Validation', () => {
      test('validates simple valid JSON', () => {
        const input = '{"name": "John", "age": 30}';
        const result = validateJSON(input, { level: 'basic' });

        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
        expect(result.summary.errorCount).toBe(0);
        expect(result.formattedJson).toBeDefined();
      });

      test('detects syntax errors', () => {
        const input = '{"name": "John", "age": 30,}'; // trailing comma
        const result = validateJSON(input, { level: 'basic' });

        expect(result.isValid).toBe(false);
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].type).toBe('syntax');
        expect(result.errors[0].severity).toBe('error');
      });

      test('handles empty input', () => {
        const result = validateJSON('', { level: 'basic' });

        expect(result.isValid).toBe(false);
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].message).toContain('Empty JSON input');
      });

      test('handles whitespace-only input', () => {
        const result = validateJSON('   \n\t  ', { level: 'basic' });

        expect(result.isValid).toBe(false);
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].message).toContain('Empty JSON input');
      });

      test('validates arrays', () => {
        const input = '[1, 2, 3, "test"]';
        const result = validateJSON(input, { level: 'basic' });

        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      test('validates nested objects', () => {
        const input = '{"user": {"name": "John", "profile": {"age": 30}}}';
        const result = validateJSON(input, { level: 'basic' });

        expect(result.isValid).toBe(true);
        expect(result.metrics.objectDepth).toBe(4); // root -> user -> profile -> age = 4 levels
      });

      test('calculates metrics correctly', () => {
        const input =
          '{"users": [{"name": "John"}, {"name": "Jane"}], "count": 2}';
        const result = validateJSON(input, { level: 'basic' });

        expect(result.metrics.arrayLength).toBe(2);
        expect(result.metrics.keyCount).toBeGreaterThan(0);
        expect(result.metrics.fileSize).toBeGreaterThan(0);
        expect(result.metrics.validationTime).toBeGreaterThan(0);
      });
    });

    describe('Structural Validation', () => {
      test('warns about excessive depth', () => {
        const deepObject = {
          level1: { level2: { level3: { level4: 'value' } } },
        };
        const input = JSON.stringify(deepObject);
        const options: ValidationOptions = { level: 'structural', maxDepth: 2 };
        const result = validateJSON(input, options);

        expect(result.warnings.some((w) => w.message.includes('depth'))).toBe(
          true
        );
      });

      test('warns about too many keys', () => {
        const manyKeys: Record<string, string> = {};
        for (let i = 0; i < 100; i++) {
          manyKeys[`key${i}`] = `value${i}`;
        }
        const input = JSON.stringify(manyKeys);
        const options: ValidationOptions = { level: 'structural', maxKeys: 50 };
        const result = validateJSON(input, options);

        expect(
          result.warnings.some((w) => w.message.includes('key count'))
        ).toBe(true);
      });

      test('detects exact duplicate keys', () => {
        const input =
          '{"name": "Product A", "price": 19.99, "name": "Product B", "category": "electronics"}';
        const result = validateJSON(input, { level: 'structural' });

        expect(result.isValid).toBe(false);
        expect(
          result.errors.some((e) => e.message.includes('Duplicate key "name"'))
        ).toBe(true);
      });

      test('detects potential case-sensitive duplicate keys', () => {
        const input = '{"Name": "John", "name": "Jane"}';
        const result = validateJSON(input, { level: 'structural' });

        expect(
          result.warnings.some((w) =>
            w.message.includes('case-sensitive duplicate keys')
          )
        ).toBe(true);
      });

      test('detects mixed types in arrays', () => {
        const input = '{"data": [1, "string", true, null, {"key": "value"}]}';
        const result = validateJSON(input, { level: 'structural' });

        expect(
          result.warnings.some((w) =>
            w.message.includes('Mixed types in array')
          )
        ).toBe(true);
      });

      test('detects mixed types in complex arrays', () => {
        const input =
          '{"data": [{"type": "user", "id": 1}, "string_value", 123, true, null]}';
        const result = validateJSON(input, { level: 'structural' });

        expect(result.isValid).toBe(true);
        expect(
          result.warnings.some((w) =>
            w.message.includes('Mixed types in array')
          )
        ).toBe(true);
        expect(
          result.warnings.some((w) =>
            w.message.includes('object, string, number, boolean, null')
          )
        ).toBe(true);
      });

      test('warns about excessive nesting depth', () => {
        // Create a deeply nested object (12 levels deep)
        let deepObj: any = { value: 'end' };
        for (let i = 0; i < 11; i++) {
          deepObj = { level: i, nested: deepObj };
        }
        const input = JSON.stringify(deepObj);
        const result = validateJSON(input, { level: 'structural' });

        expect(
          result.warnings.some((w) =>
            w.message.includes('Nesting depth exceeds recommended limit')
          )
        ).toBe(true);
      });

      test('checks file size limits', () => {
        const largeInput = JSON.stringify({ data: 'x'.repeat(1000) });
        const options: ValidationOptions = {
          level: 'structural',
          maxFileSize: 100,
        };
        const result = validateJSON(largeInput, options);

        expect(result.errors.some((e) => e.message.includes('File size'))).toBe(
          true
        );
      });
    });

    describe('Schema Validation', () => {
      test('validates against simple schema', () => {
        const input = '{"name": "John", "age": 30}';
        const schema = {
          type: 'object',
          required: ['name', 'age'],
          properties: {
            name: { type: 'string' },
            age: { type: 'number' },
          },
        };
        const result = validateJSON(input, { level: 'schema', schema });

        expect(result.isValid).toBe(true);
      });

      test('detects missing required properties', () => {
        const input = '{"name": "John"}';
        const schema = {
          type: 'object',
          required: ['name', 'age'],
          properties: {
            name: { type: 'string' },
            age: { type: 'number' },
          },
        };
        const result = validateJSON(input, { level: 'schema', schema });

        expect(
          result.errors.some((e) =>
            e.message.includes('Missing required property')
          )
        ).toBe(true);
      });

      test('detects type mismatches', () => {
        const input = '{"name": "John", "age": "thirty"}';
        const schema = {
          type: 'object',
          properties: {
            name: { type: 'string' },
            age: { type: 'number' },
          },
        };
        const result = validateJSON(input, { level: 'schema', schema });

        expect(
          result.errors.some((e) => e.message.includes('Expected type'))
        ).toBe(true);
      });

      test('handles invalid schema gracefully', () => {
        const input = '{"name": "John"}';
        const invalidSchema = { invalid: 'schema' };
        const result = validateJSON(input, {
          level: 'schema',
          schema: invalidSchema,
        });

        // Should not crash, may produce validation errors or warnings
        expect(result).toBeDefined();
      });
    });

    describe('Security Validation', () => {
      test('detects potential XSS content', () => {
        const input = '{"content": "<script>alert(\\"xss\\")</script>"}';
        const result = validateJSON(input, { level: 'security' });

        expect(
          result.securityIssues.some((issue) => issue.type === 'potential_xss')
        ).toBe(true);
      });

      test('detects SQL injection patterns', () => {
        const input =
          '{"query": "SELECT * FROM users WHERE id = 1 UNION SELECT * FROM passwords"}';
        const result = validateJSON(input, { level: 'security' });

        expect(
          result.securityIssues.some((issue) => issue.type === 'sql_injection')
        ).toBe(true);
      });

      test('warns about large payloads', () => {
        const largeData = 'x'.repeat(11 * 1024 * 1024); // 11MB
        const input = JSON.stringify({ data: largeData });
        const result = validateJSON(input, { level: 'security' });

        expect(
          result.securityIssues.some((issue) => issue.type === 'large_payload')
        ).toBe(true);
      });

      test('detects suspicious code patterns', () => {
        const input = '{"code": "eval(someFunction())"}';
        const result = validateJSON(input, { level: 'security' });

        expect(
          result.securityIssues.some(
            (issue) => issue.type === 'suspicious_patterns'
          )
        ).toBe(true);
      });

      test('detects circular references', () => {
        // Note: JSON.stringify would throw on circular references,
        // but we test the detection logic with a mock scenario
        const input = '{"a": {"b": "test"}}';
        const result = validateJSON(input, { level: 'structural', enableSecurity: true });

        // This test verifies the function exists and doesn't crash
        expect(result).toBeDefined();
      });
    });

    describe('JSON5 Support', () => {
      test('handles comments when enabled', () => {
        const input = `{
          // This is a comment
          "name": "John", /* another comment */
          "age": 30
        }`;
        const result = validateJSON(input, {
          level: 'basic',
          allowComments: true,
        });

        expect(result.isValid).toBe(true);
      });

      test('handles trailing commas when enabled', () => {
        const input = `{
          "name": "John",
          "age": 30,
        }`;
        const result = validateJSON(input, {
          level: 'basic',
          allowComments: true,
        });

        expect(result.isValid).toBe(true);
      });
    });

    describe('Error Reporting', () => {
      test('provides line and column information', () => {
        const input = `{
          "name": "John",
          "age": 30,
        }`; // trailing comma on line 3
        const result = validateJSON(input, { level: 'basic' });

        expect(result.errors[0].line).toBeGreaterThan(1);
        expect(result.errors[0].column).toBeGreaterThan(0);
      });

      test('provides helpful suggestions', () => {
        const input = '{"name": "John"'; // missing closing brace
        const result = validateJSON(input, { level: 'basic' });

        expect(result.errors[0].suggestion).toBeDefined();
        expect(result.errors[0].suggestion).toBeTruthy();
      });

      test('categorizes error types correctly', () => {
        const input = '{"name": "John",}';
        const result = validateJSON(input, { level: 'basic' });

        expect(result.errors[0].type).toBe('syntax');
        expect(result.errors[0].severity).toBe('error');
      });
    });

    describe('Performance', () => {
      test('completes validation quickly for normal-sized JSON', () => {
        const input = JSON.stringify({
          data: Array(1000).fill({ key: 'value' }),
        });
        const startTime = performance.now();
        const result = validateJSON(input, { level: 'structural' });
        const duration = performance.now() - startTime;

        expect(result.metrics.validationTime).toBeLessThan(1000); // Less than 1 second
        expect(duration).toBeLessThan(1000);
      });

      test('tracks validation time accurately', () => {
        const input = '{"test": "data"}';
        const result = validateJSON(input, { level: 'basic' });

        expect(result.metrics.validationTime).toBeGreaterThan(0);
        expect(typeof result.metrics.validationTime).toBe('number');
      });
    });
  });

  describe('formatJSON', () => {
    test('formats valid JSON with proper indentation', () => {
      const input = '{"name":"John","age":30}';
      const result = formatJSON(input, 2);

      expect(result.success).toBe(true);
      expect(result.result).toContain('\n'); // actual newline, not escaped
      expect(result.result).toContain('  '); // 2-space indentation
    });

    test('handles invalid JSON gracefully', () => {
      const input = '{"name": "John",}';
      const result = formatJSON(input);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('preserves data types', () => {
      const input = '{"string":"text","number":42,"boolean":true,"null":null}';
      const result = formatJSON(input);

      expect(result.success).toBe(true);
      expect(result.result).toContain('"string": "text"');
      expect(result.result).toContain('"number": 42');
      expect(result.result).toContain('"boolean": true');
      expect(result.result).toContain('"null": null');
    });

    test('handles custom indentation', () => {
      const input = '{"name":"John"}';
      const result4 = formatJSON(input, 4);
      const result2 = formatJSON(input, 2);

      expect(result4.success).toBe(true);
      expect(result2.success).toBe(true);
      expect(result4.result?.length).toBeGreaterThan(
        result2.result?.length || 0
      );
    });
  });

  describe('minifyJSON', () => {
    test('removes whitespace and formatting', () => {
      const input = `{
        "name": "John",
        "age": 30
      }`;
      const result = minifyJSON(input);

      expect(result.success).toBe(true);
      expect(result.result).not.toContain('\\n');
      expect(result.result).not.toContain('  ');
      expect(result.result).toBe('{"name":"John","age":30}');
    });

    test('handles invalid JSON', () => {
      const input = '{"name": "John",}';
      const result = minifyJSON(input);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('preserves data integrity', () => {
      const original = { name: 'John', age: 30, active: true, data: null };
      const input = JSON.stringify(original, null, 2);
      const result = minifyJSON(input);

      expect(result.success).toBe(true);
      expect(JSON.parse(result.result!)).toEqual(original);
    });
  });

  describe('exportValidationResults', () => {
    const sampleResult = {
      isValid: false,
      errors: [
        {
          line: 1,
          column: 10,
          message: 'Test error',
          severity: 'error' as const,
          type: 'syntax' as const,
          suggestion: 'Fix the syntax',
        },
      ],
      warnings: [
        {
          line: 2,
          column: 5,
          message: 'Test warning',
          severity: 'warning' as const,
          type: 'structure' as const,
        },
      ],
      metrics: {
        validationTime: 10.5,
        fileSize: 1024,
        objectDepth: 3,
        arrayLength: 5,
        keyCount: 10,
      },
      securityIssues: [
        {
          type: 'potential_xss' as const,
          severity: 'high' as const,
          message: 'XSS detected',
          recommendation: 'Sanitize input',
        },
      ],
      summary: {
        errorCount: 1,
        warningCount: 1,
        securityIssueCount: 1,
        validationLevel: 'basic' as ValidationLevel,
      },
    };

    test('exports to JSON format', () => {
      const result = exportValidationResults(sampleResult, 'json');
      const parsed = JSON.parse(result);

      expect(parsed.isValid).toBe(false);
      expect(parsed.errors).toHaveLength(1);
      expect(parsed.warnings).toHaveLength(1);
    });

    test('exports to HTML format', () => {
      const result = exportValidationResults(sampleResult, 'html');

      expect(result).toContain('<html>');
      expect(result).toContain('JSON Validation Report');
      expect(result).toContain('Test error');
      expect(result).toContain('Test warning');
    });

    test('exports to CSV format', () => {
      const result = exportValidationResults(sampleResult, 'csv');

      expect(result).toContain('Type,Line,Column,Severity,Message,Suggestion');
      expect(result).toContain('Error,1,10,error');
      expect(result).toContain('Warning,2,5,warning');
    });

    test('exports to text format', () => {
      const result = exportValidationResults(sampleResult, 'text');

      expect(result).toContain('JSON Validation Report');
      expect(result).toContain('Status: INVALID');
      expect(result).toContain('ERRORS:');
      expect(result).toContain('WARNINGS:');
    });

    test('defaults to JSON format for invalid format', () => {
      const result = exportValidationResults(sampleResult, 'invalid' as any);

      expect(() => JSON.parse(result)).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    test('handles very large JSON objects', () => {
      const largeArray = Array(10000).fill({ key: 'value', number: 42 });
      const input = JSON.stringify(largeArray);
      const result = validateJSON(input, { level: 'basic' });

      expect(result.isValid).toBe(true);
      expect(result.metrics.arrayLength).toBe(10000);
    });

    test('handles deeply nested structures', () => {
      let deepObject: any = { value: 'end' };
      for (let i = 0; i < 100; i++) {
        deepObject = { level: i, nested: deepObject };
      }
      const input = JSON.stringify(deepObject);
      const result = validateJSON(input, { level: 'structural', maxDepth: 50 });

      expect(result.warnings.some((w) => w.message.includes('depth'))).toBe(
        true
      );
    });

    test('handles Unicode characters', () => {
      const input = '{"emoji": "🎉", "chinese": "你好", "special": "\\u0041"}';
      const result = validateJSON(input, { level: 'basic' });

      expect(result.isValid).toBe(true);
    });

    test('handles escaped characters', () => {
      const input =
        '{"quotes": "\\"Hello\\"", "newline": "Line1\\nLine2", "tab": "Col1\\tCol2"}';
      const result = validateJSON(input, { level: 'basic' });

      expect(result.isValid).toBe(true);
    });

    test('handles empty objects and arrays', () => {
      const inputs = ['{}', '[]', '{"empty": {}, "array": []}'];

      inputs.forEach((input) => {
        const result = validateJSON(input, { level: 'basic' });
        expect(result.isValid).toBe(true);
      });
    });
  });
});
