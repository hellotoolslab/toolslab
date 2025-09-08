import { describe, it, expect } from '@jest/globals';
import {
  encodeUrlComponent,
  decodeUrlComponent,
  encodeFullUrl,
  decodeFullUrl,
  isValidUrlEncoded,
  parseQueryParameters,
  buildQueryString,
  detectEncoding,
  detectOperation,
  processUrls,
  generateSampleUrls,
} from '@/lib/tools/url-encode';

describe('URL Encode Tool', () => {
  describe('encodeUrlComponent', () => {
    it('should encode special characters in URL components', () => {
      expect(encodeUrlComponent('Hello World')).toBe('Hello%20World');
      expect(encodeUrlComponent('user@example.com')).toBe('user%40example.com');
      expect(encodeUrlComponent('price: $10.99')).toBe('price%3A%20%2410.99');
    });

    it('should encode international characters', () => {
      expect(encodeUrlComponent('café')).toBe('caf%C3%A9');
      expect(encodeUrlComponent('世界')).toBe('%E4%B8%96%E7%95%8C');
      expect(encodeUrlComponent('🌍')).toBe('%F0%9F%8C%8D');
    });

    it('should handle empty string', () => {
      expect(encodeUrlComponent('')).toBe('');
    });

    it('should preserve safe characters', () => {
      expect(encodeUrlComponent('abc123')).toBe('abc123');
      expect(encodeUrlComponent('test-file_name.ext')).toBe(
        'test-file_name.ext'
      );
    });

    it('should encode query parameter values correctly', () => {
      expect(encodeUrlComponent('search query with spaces')).toBe(
        'search%20query%20with%20spaces'
      );
      expect(encodeUrlComponent('key=value&other=param')).toBe(
        'key%3Dvalue%26other%3Dparam'
      );
    });
  });

  describe('decodeUrlComponent', () => {
    it('should decode percent-encoded characters', () => {
      expect(decodeUrlComponent('Hello%20World')).toBe('Hello World');
      expect(decodeUrlComponent('user%40example.com')).toBe('user@example.com');
      expect(decodeUrlComponent('price%3A%20%2410.99')).toBe('price: $10.99');
    });

    it('should decode international characters', () => {
      expect(decodeUrlComponent('caf%C3%A9')).toBe('café');
      expect(decodeUrlComponent('%E4%B8%96%E7%95%8C')).toBe('世界');
      expect(decodeUrlComponent('%F0%9F%8C%8D')).toBe('🌍');
    });

    it('should handle malformed percent encoding', () => {
      expect(() => decodeUrlComponent('invalid%ZZ')).toThrow();
      expect(() => decodeUrlComponent('incomplete%2')).toThrow();
    });

    it('should handle plus signs as spaces', () => {
      expect(decodeUrlComponent('hello+world', true)).toBe('hello world');
      expect(decodeUrlComponent('test+query+string', true)).toBe(
        'test query string'
      );
    });

    it('should preserve already decoded text', () => {
      expect(decodeUrlComponent('normal text')).toBe('normal text');
      expect(decodeUrlComponent('test-file_name.ext')).toBe(
        'test-file_name.ext'
      );
    });
  });

  describe('encodeFullUrl', () => {
    it('should preserve URL structure while encoding special characters', () => {
      expect(encodeFullUrl('https://example.com/path with spaces')).toBe(
        'https://example.com/path%20with%20spaces'
      );
      expect(
        encodeFullUrl('https://user@host:8080/path?query=value with spaces')
      ).toBe('https://user@host:8080/path?query=value%20with%20spaces');
    });

    it('should handle international domain names', () => {
      expect(encodeFullUrl('https://café.example.com/path')).toBe(
        'https://caf%C3%A9.example.com/path'
      );
    });

    it('should preserve fragment identifiers', () => {
      expect(
        encodeFullUrl('https://example.com/page#section with spaces')
      ).toBe('https://example.com/page#section%20with%20spaces');
    });

    it('should handle complex URLs with multiple components', () => {
      const complexUrl =
        'https://user:pass@example.com:8080/path/to/resource?param1=value 1&param2=café#fragment with spaces';
      const encoded = encodeFullUrl(complexUrl);
      expect(encoded).toContain('%20'); // spaces encoded
      expect(encoded).toContain('https://'); // protocol preserved
      expect(encoded).toContain('?'); // query separator preserved
      expect(encoded).toContain('&'); // parameter separator preserved
      expect(encoded).toContain('#'); // fragment separator preserved
    });
  });

  describe('decodeFullUrl', () => {
    it('should decode full URLs while preserving structure', () => {
      expect(decodeFullUrl('https://example.com/path%20with%20spaces')).toBe(
        'https://example.com/path with spaces'
      );
      expect(
        decodeFullUrl('https://user@host:8080/path?query=value%20with%20spaces')
      ).toBe('https://user@host:8080/path?query=value with spaces');
    });

    it('should handle encoded international characters in URLs', () => {
      // Test with encoded characters in path instead of domain (domains get punycode converted)
      const decoded = decodeFullUrl('https://example.com/caf%C3%A9/path');
      expect(decoded).toContain('café'); // The café part should be decoded
    });

    it('should preserve URL structure during decoding', () => {
      const encodedUrl = 'https://example.com/page#section%20with%20spaces';
      const decoded = decodeFullUrl(encodedUrl);
      expect(decoded).toBe('https://example.com/page#section with spaces');
    });
  });

  describe('isValidUrlEncoded', () => {
    it('should validate correct percent encoding', () => {
      expect(isValidUrlEncoded('Hello%20World')).toBe(true);
      expect(isValidUrlEncoded('user%40example.com')).toBe(true);
      expect(isValidUrlEncoded('normal-text')).toBe(true);
    });

    it('should detect invalid percent encoding', () => {
      expect(isValidUrlEncoded('invalid%ZZ')).toBe(false);
      expect(isValidUrlEncoded('incomplete%2')).toBe(false);
      expect(isValidUrlEncoded('invalid%')).toBe(false);
    });

    it('should handle mixed valid and invalid sequences', () => {
      expect(isValidUrlEncoded('valid%20invalid%ZZ')).toBe(false);
      expect(isValidUrlEncoded('all%20valid%20sequences')).toBe(true);
    });
  });

  describe('parseQueryParameters', () => {
    it('should parse simple query parameters', () => {
      const params = parseQueryParameters('?key1=value1&key2=value2');
      expect(params).toEqual({
        key1: 'value1',
        key2: 'value2',
      });
    });

    it('should handle encoded parameter values', () => {
      const params = parseQueryParameters(
        '?search=hello%20world&email=user%40example.com'
      );
      expect(params).toEqual({
        search: 'hello world',
        email: 'user@example.com',
      });
    });

    it('should handle parameters without values', () => {
      const params = parseQueryParameters('?flag&debug=true&empty=');
      expect(params).toEqual({
        flag: '',
        debug: 'true',
        empty: '',
      });
    });

    it('should handle array-like parameters', () => {
      const params = parseQueryParameters('?tags=tag1&tags=tag2&tags=tag3');
      expect(params.tags).toBe('tag3'); // Last value wins in simple parsing
    });

    it('should handle plus signs as spaces', () => {
      const params = parseQueryParameters('?query=hello+world&name=John+Doe');
      expect(params).toEqual({
        query: 'hello world',
        name: 'John Doe',
      });
    });
  });

  describe('buildQueryString', () => {
    it('should build query string from parameters object', () => {
      const params = { key1: 'value1', key2: 'value2' };
      expect(buildQueryString(params)).toBe('key1=value1&key2=value2');
    });

    it('should encode parameter values', () => {
      const params = { search: 'hello world', email: 'user@example.com' };
      expect(buildQueryString(params)).toBe(
        'search=hello%20world&email=user%40example.com'
      );
    });

    it('should handle empty and null values', () => {
      const params = { empty: '', null: null, undefined: undefined };
      expect(buildQueryString(params)).toBe('empty=');
    });

    it('should handle special characters in keys', () => {
      const params = { 'key with spaces': 'value', 'key@symbol': 'test' };
      expect(buildQueryString(params)).toContain('key%20with%20spaces=value');
      expect(buildQueryString(params)).toContain('key%40symbol=test');
    });
  });

  describe('detectEncoding', () => {
    it('should detect URL encoded strings', () => {
      expect(detectEncoding('Hello%20World')).toBe('encoded');
      expect(detectEncoding('user%40domain%2Ecom')).toBe('encoded');
    });

    it('should detect plain text', () => {
      expect(detectEncoding('Hello World')).toBe('plain');
      expect(detectEncoding('user@example.com')).toBe('plain');
    });

    it('should detect mixed encoding', () => {
      expect(detectEncoding('Hello%20World and plain text')).toBe('mixed');
    });

    it('should handle edge cases', () => {
      expect(detectEncoding('')).toBe('plain');
      expect(detectEncoding('%')).toBe('plain'); // Invalid encoding
      expect(detectEncoding('%20%20%20')).toBe('encoded');
    });
  });

  describe('detectOperation', () => {
    it('should suggest decode for encoded strings', () => {
      expect(detectOperation('Hello%20World')).toBe('decode');
      expect(detectOperation('user%40example%2Ecom')).toBe('decode');
    });

    it('should suggest encode for plain text with special characters', () => {
      expect(detectOperation('Hello World')).toBe('encode');
      expect(detectOperation('user@example.com')).toBe('encode');
      expect(detectOperation('test with spaces')).toBe('encode');
    });

    it('should suggest decode for mixed encoding', () => {
      expect(detectOperation('Hello%20World and plain text')).toBe('decode');
    });

    it('should suggest encode for safe plain text', () => {
      expect(detectOperation('simpletext')).toBe('encode');
      expect(detectOperation('test-file_name.ext')).toBe('encode');
    });

    it('should handle edge cases', () => {
      expect(detectOperation('')).toBe('encode');
    });
  });

  describe('processUrls', () => {
    it('should process multiple URLs', () => {
      const urls = [
        'https://example.com/path with spaces',
        'https://café.example.com/search?q=hello world',
      ];
      const result = processUrls(urls, { mode: 'encode', type: 'component' });

      expect(result.results).toHaveLength(2);
      expect(result.results[0].result).toContain('%20');
      expect(result.results[1].result).toContain('%C3%A9');
    });

    it('should auto-detect operations for mixed URLs', () => {
      const urls = [
        'https://example.com/path with spaces', // plain text -> encode
        'https://example.com/path%20with%20spaces', // encoded -> decode
      ];
      const result = processUrls(urls, { mode: 'auto', type: 'component' });

      expect(result.results).toHaveLength(2);
      expect(result.results[0].detectedOperation).toBe('encode');
      expect(result.results[1].detectedOperation).toBe('decode');
    });

    it('should handle mixed valid and invalid URLs', () => {
      const urls = ['valid-url.com', 'invalid%ZZ-url.com'];
      const result = processUrls(urls, { mode: 'decode', type: 'component' });

      expect(result.results[0].success).toBe(true);
      expect(result.results[1].success).toBe(false);
      expect(result.results[1].error).toContain('Failed to decode');
    });

    it('should provide statistics', () => {
      const urls = ['url1.com', 'url2.com', 'invalid%ZZ.com'];
      const result = processUrls(urls, { mode: 'encode', type: 'component' });

      expect(result.stats.total).toBe(3);
      expect(result.stats.successful).toBe(3); // All encode operations should succeed
      expect(result.stats.failed).toBe(0);
    });
  });

  describe('generateSampleUrls', () => {
    it('should generate sample URLs for different use cases', () => {
      const samples = generateSampleUrls();

      expect(samples).toBeInstanceOf(Array);
      expect(samples.length).toBeGreaterThan(0);

      // Should have different categories of samples
      const categories = samples.map((s) => s.category);
      expect(new Set(categories).size).toBeGreaterThan(1);
    });

    it('should include both encoded and decoded examples', () => {
      const samples = generateSampleUrls();

      const hasEncoded = samples.some((s) => s.url.includes('%'));
      const hasPlain = samples.some((s) => !s.url.includes('%'));

      expect(hasEncoded).toBe(true);
      expect(hasPlain).toBe(true);
    });

    it('should provide descriptions for samples', () => {
      const samples = generateSampleUrls();

      samples.forEach((sample) => {
        expect(sample.description).toBeDefined();
        expect(sample.description.length).toBeGreaterThan(0);
      });
    });
  });

  // Edge cases and error handling
  describe('Edge Cases', () => {
    it('should handle extremely long URLs', () => {
      const longPath = 'a'.repeat(2000);
      const longUrl = `https://example.com/${longPath}`;

      expect(() => encodeUrlComponent(longPath)).not.toThrow();
      expect(() => encodeFullUrl(longUrl)).not.toThrow();
    });

    it('should handle URLs with multiple consecutive spaces', () => {
      expect(encodeUrlComponent('multiple    spaces')).toBe(
        'multiple%20%20%20%20spaces'
      );
      expect(decodeUrlComponent('multiple%20%20%20%20spaces')).toBe(
        'multiple    spaces'
      );
    });

    it('should handle URLs with only special characters', () => {
      expect(encodeUrlComponent('!@#$%^&*()')).not.toBe('!@#$%^&*()');
      expect(decodeUrlComponent(encodeUrlComponent('!@#$%^&*()'))).toBe(
        '!@#$%^&*()'
      );
    });

    it('should preserve case sensitivity', () => {
      expect(encodeUrlComponent('CaseSensitive')).toBe('CaseSensitive');
      expect(decodeUrlComponent('Case%20Sensitive')).toBe('Case Sensitive');
    });
  });

  // Performance tests
  describe('Performance', () => {
    it('should handle large batches efficiently', () => {
      const largeBatch = Array.from(
        { length: 1000 },
        (_, i) => `https://example.com/path${i}`
      );
      const start = performance.now();
      processUrls(largeBatch, { mode: 'encode', type: 'component' });
      const end = performance.now();

      // Should complete within reasonable time (adjust threshold as needed)
      expect(end - start).toBeLessThan(1000); // 1 second
    });

    it('should handle very long individual URLs', () => {
      const veryLongUrl = 'https://example.com/' + 'x'.repeat(10000);
      const start = performance.now();
      encodeFullUrl(veryLongUrl);
      const end = performance.now();

      expect(end - start).toBeLessThan(100); // 100ms
    });
  });
});
