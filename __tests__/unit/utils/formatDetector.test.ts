import { detectFormat } from '@/lib/utils/formatDetector';
import {
  TEST_JWT,
  TEST_BASE64,
  TEST_JSON,
  TEST_URL,
  TEST_UUID,
  TEST_SQL,
} from '../../fixtures/test-data';

describe('Format Detector', () => {
  describe('JWT Detection', () => {
    it('should detect valid JWT tokens', () => {
      const result = detectFormat(TEST_JWT.valid);
      expect(result.type).toBe('jwt');
      expect(result.confidence).toBeGreaterThan(0.9);
      expect(result.suggestedTools).toContain('jwt-decoder');
    });

    it('should reject malformed JWT', () => {
      const result = detectFormat(TEST_JWT.malformed);
      expect(result.type).not.toBe('jwt');
      expect(result.confidence).toBeLessThan(0.5);
    });
  });

  describe('Base64 Detection', () => {
    it('should detect Base64 encoded strings', () => {
      const result = detectFormat(TEST_BASE64.encoded);
      expect(result.type).toBe('base64');
      expect(result.confidence).toBeGreaterThan(0.7);
      expect(result.suggestedTools).toContain('base64-encoder');
    });

    it('should detect Base64 with unicode', () => {
      const result = detectFormat(TEST_BASE64.unicode);
      expect(result.type).toBe('base64');
      expect(result.confidence).toBeGreaterThan(0.8);
    });
  });

  describe('JSON Detection', () => {
    it('should detect valid JSON format', () => {
      const result = detectFormat(TEST_JSON.valid.simple);
      expect(result.type).toBe('json');
      expect(result.confidence).toBeGreaterThan(0.95);
      expect(result.suggestedTools).toContain('json-formatter');
    });

    it('should detect minified JSON', () => {
      const minified = '{"test":123,"array":[1,2,3]}';
      const result = detectFormat(minified);
      expect(result.type).toBe('json');
      expect(result.suggestedTools).toContain('json-formatter');
    });

    it('should reject invalid JSON', () => {
      const result = detectFormat(TEST_JSON.invalid.syntaxError);
      expect(result.type).not.toBe('json');
      expect(result.confidence).toBeLessThan(0.5);
    });
  });

  describe('URL Detection', () => {
    it('should detect simple URLs', () => {
      const result = detectFormat(TEST_URL.simple);
      expect(result.type).toBe('url');
      expect(result.confidence).toBeGreaterThan(0.9);
      expect(result.suggestedTools).toContain('url-encoder');
    });

    it('should detect URLs with parameters', () => {
      const result = detectFormat(TEST_URL.withParams);
      expect(result.type).toBe('url');
      expect(result.confidence).toBeGreaterThan(0.9);
    });

    it('should detect encoded URLs', () => {
      const result = detectFormat(TEST_URL.encoded);
      expect(result.type).toBe('url-encoded');
      expect(result.suggestedTools).toContain('url-encoder');
    });
  });

  describe('UUID Detection', () => {
    it('should detect UUID v4', () => {
      const result = detectFormat(TEST_UUID.v4);
      expect(result.type).toBe('uuid');
      expect(result.confidence).toBeGreaterThan(0.95);
      expect(result.metadata?.version).toBe(4);
    });

    it('should detect UUID v1', () => {
      const result = detectFormat(TEST_UUID.v1);
      expect(result.type).toBe('uuid');
      expect(result.confidence).toBeGreaterThan(0.95);
      expect(result.metadata?.version).toBe(1);
    });

    it('should reject invalid UUID', () => {
      const result = detectFormat(TEST_UUID.invalid);
      expect(result.type).not.toBe('uuid');
    });
  });

  describe('SQL Detection', () => {
    it('should detect simple SQL queries', () => {
      const result = detectFormat(TEST_SQL.simple);
      expect(result.type).toBe('sql');
      expect(result.confidence).toBeGreaterThan(0.8);
      expect(result.suggestedTools).toContain('sql-formatter');
    });

    it('should detect complex SQL queries', () => {
      const result = detectFormat(TEST_SQL.complex);
      expect(result.type).toBe('sql');
      expect(result.confidence).toBeGreaterThan(0.9);
    });

    it('should handle SQL with syntax errors', () => {
      const result = detectFormat(TEST_SQL.invalid);
      expect(result.type).toBe('sql');
      expect(result.confidence).toBeGreaterThan(0.6);
      expect(result.metadata?.hasErrors).toBe(true);
    });
  });

  describe('Ambiguous Formats', () => {
    it('should handle plain text with low confidence', () => {
      const result = detectFormat('Hello World');
      expect(result.type).toBe('text');
      expect(result.confidence).toBeLessThan(0.5);
      expect(result.suggestedTools).toContain('text-formatter');
    });

    it('should handle numbers', () => {
      const result = detectFormat('123456789');
      expect(result.type).toBe('number');
      expect(result.suggestedTools).toContain('number-converter');
    });

    it('should handle mixed content', () => {
      const mixed = 'Some text with 123 numbers and special chars!@#';
      const result = detectFormat(mixed);
      expect(result.confidence).toBeLessThan(0.6);
    });

    it('should handle empty input', () => {
      const result = detectFormat('');
      expect(result.type).toBe('empty');
      expect(result.confidence).toBe(1);
      expect(result.suggestedTools).toEqual([]);
    });

    it('should handle whitespace only', () => {
      const result = detectFormat('   \n\t  ');
      expect(result.type).toBe('whitespace');
      expect(result.confidence).toBe(1);
    });
  });

  describe('Multiple Format Detection', () => {
    it('should detect JSON containing JWT', () => {
      const jsonWithJWT = `{"token": "${TEST_JWT.valid}"}`;
      const result = detectFormat(jsonWithJWT);
      expect(result.type).toBe('json');
      expect(result.metadata?.contains).toContain('jwt');
      expect(result.suggestedTools).toContain('json-formatter');
      expect(result.suggestedTools).toContain('jwt-decoder');
    });

    it('should detect Base64 encoded JSON', () => {
      const base64JSON = Buffer.from(TEST_JSON.valid.simple).toString('base64');
      const result = detectFormat(base64JSON);
      expect(result.type).toBe('base64');
      expect(result.metadata?.decodedType).toBe('json');
    });

    it('should provide chain suggestions for nested formats', () => {
      const base64JWT = Buffer.from(TEST_JWT.valid).toString('base64');
      const result = detectFormat(base64JWT);
      expect(result.chainSuggestions).toBeDefined();
      expect(result.chainSuggestions).toContain(
        'base64-decoder -> jwt-decoder'
      );
    });
  });

  describe('Performance', () => {
    it('should detect format quickly for small inputs', () => {
      const start = performance.now();
      detectFormat('small test string');
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(10);
    });

    it('should handle large inputs efficiently', () => {
      const largeInput = 'x'.repeat(1000000); // 1MB string
      const start = performance.now();
      detectFormat(largeInput);
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });
  });
});
