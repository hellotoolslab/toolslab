import { formatJSON, minifyJSON, validateJSON } from '@/lib/tools/json';
import { TEST_JSON } from '../../fixtures/test-data';

describe('JSON Formatter', () => {
  describe('formatJSON', () => {
    it('should format valid JSON with proper indentation', () => {
      const result = formatJSON(TEST_JSON.valid.simple);
      expect(result.success).toBe(true);
      expect(result.result).toContain('\n');
      expect(result.result).toContain('  ');
    });

    it('should handle nested objects correctly', () => {
      const result = formatJSON(TEST_JSON.valid.nested);
      expect(result.success).toBe(true);
      expect(result.result?.split('\n').length).toBeGreaterThan(3);
    });

    it('should return error for invalid JSON', () => {
      const result = formatJSON(TEST_JSON.invalid.syntaxError);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.line).toBeDefined();
    });

    it('should handle unicode characters', () => {
      const result = formatJSON(TEST_JSON.edge.unicode);
      expect(result.success).toBe(true);
      expect(result.result).toContain('🐙');
    });

    it('should handle empty JSON', () => {
      const result = formatJSON(TEST_JSON.edge.empty);
      expect(result.success).toBe(true);
      expect(result.result).toBe('{}');
    });

    it('should preserve special characters', () => {
      const result = formatJSON(TEST_JSON.edge.specialChars);
      expect(result.success).toBe(true);
      expect(result.result).toContain('\\\\');
    });

    it('should handle large JSON files', () => {
      const startTime = performance.now();
      const result = formatJSON(TEST_JSON.edge.largeFile);
      const duration = performance.now() - startTime;

      expect(result.success).toBe(true);
      expect(duration).toBeLessThan(500); // Should process within 500ms
    });
  });

  describe('minifyJSON', () => {
    it('should remove all unnecessary whitespace', () => {
      const formatted = '{ "name": "test", "value": 123 }';
      const result = minifyJSON(formatted);
      expect(result.success).toBe(true);
      expect(result.result).toBe('{"name":"test","value":123}');
    });

    it('should handle arrays correctly', () => {
      const input = '{ "items": [ 1, 2, 3 ] }';
      const result = minifyJSON(input);
      expect(result.success).toBe(true);
      expect(result.result).toBe('{"items":[1,2,3]}');
    });

    it('should preserve string content', () => {
      const input = '{ "text": "  spaced  text  " }';
      const result = minifyJSON(input);
      expect(result.success).toBe(true);
      expect(result.result).toContain('"  spaced  text  "');
    });

    it('should handle nested structures', () => {
      const result = minifyJSON(TEST_JSON.valid.complex);
      expect(result.success).toBe(true);
      expect(result.result).not.toContain('\n');
      expect(result.result).not.toMatch(/\s{2,}/);
    });
  });

  describe('validateJSON', () => {
    it('should validate correct JSON', () => {
      const result = validateJSON(TEST_JSON.valid.simple);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should detect syntax errors with line numbers', () => {
      const result = validateJSON(TEST_JSON.invalid.syntaxError);
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.line).toBeGreaterThan(0);
    });

    it('should handle incomplete JSON', () => {
      const result = validateJSON(TEST_JSON.invalid.incomplete);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Unexpected end');
    });

    it('should validate complex nested structures', () => {
      const result = validateJSON(TEST_JSON.valid.complex);
      expect(result.valid).toBe(true);
    });

    it('should handle empty input', () => {
      const result = validateJSON('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Empty input');
    });

    it('should detect duplicate keys', () => {
      const duplicateKeys = '{"name": "test", "name": "duplicate"}';
      const result = validateJSON(duplicateKeys);
      // Note: Standard JSON.parse doesn't detect duplicates, but we should
      expect(result.warnings).toContain('Duplicate key');
    });
  });

  describe('Edge Cases', () => {
    it('should handle null input gracefully', () => {
      const result = formatJSON(null as any);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid input');
    });

    it('should handle undefined input gracefully', () => {
      const result = formatJSON(undefined as any);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid input');
    });

    it('should handle very deep nesting', () => {
      let deepJSON = '{"level1":';
      for (let i = 2; i <= 100; i++) {
        deepJSON += `{"level${i}":`;
      }
      deepJSON += '"value"';
      for (let i = 0; i < 100; i++) {
        deepJSON += '}';
      }
      // Note: no extra closing brace needed, we already have 100 opens and 100 closes

      const result = formatJSON(deepJSON);
      expect(result.success).toBe(true);
    });
  });
});
