import { describe, it, expect } from '@jest/globals';
import {
  encodeBase64,
  decodeBase64,
  detectBase64,
  encodeBase64URLSafe,
  decodeBase64URLSafe,
  formatWithLineBreaks,
  processFile,
  getDataURLFromBase64,
  extractMimeType,
  isValidBase64,
} from '@/lib/tools/base64';

describe('Base64 Tool', () => {
  describe('encodeBase64', () => {
    it('should encode plain text to Base64', () => {
      expect(encodeBase64('Hello World')).toBe('SGVsbG8gV29ybGQ=');
      expect(encodeBase64('ToolsLab')).toBe('VG9vbHNMYWI=');
    });

    it('should handle empty string', () => {
      expect(encodeBase64('')).toBe('');
    });

    it('should handle special characters', () => {
      expect(encodeBase64('Hello! 世界 🌍')).toBe('SGVsbG8hIOS4lueVjCDwn4yN');
    });

    it('should handle multi-line text', () => {
      const multiline = 'Line 1\nLine 2\nLine 3';
      const encoded = encodeBase64(multiline);
      expect(decodeBase64(encoded)).toBe(multiline);
    });
  });

  describe('decodeBase64', () => {
    it('should decode Base64 to plain text', () => {
      expect(decodeBase64('SGVsbG8gV29ybGQ=')).toBe('Hello World');
      expect(decodeBase64('VG9vbHNMYWI=')).toBe('ToolsLab');
    });

    it('should handle Base64 without padding', () => {
      expect(decodeBase64('SGVsbG8gV29ybGQ')).toBe('Hello World');
    });

    it('should handle empty string', () => {
      expect(decodeBase64('')).toBe('');
    });

    it('should throw error for invalid Base64', () => {
      expect(() => decodeBase64('Not@Valid#Base64!')).toThrow(
        'Invalid Base64 string'
      );
      expect(() => decodeBase64('!!!!')).toThrow('Invalid Base64 string');
    });

    it('should handle Base64 with line breaks', () => {
      const base64WithBreaks = 'SGVsbG8gV29y\nbGQ=';
      expect(decodeBase64(base64WithBreaks)).toBe('Hello World');
    });
  });

  describe('detectBase64', () => {
    it('should detect valid Base64 strings', () => {
      expect(detectBase64('SGVsbG8gV29ybGQ=')).toBe(true);
      expect(detectBase64('VG9vbHNMYWI=')).toBe(true);
      expect(detectBase64('YWJjZGVmZ2hpams=')).toBe(true);
    });

    it('should detect invalid Base64 strings', () => {
      expect(detectBase64('Hello World')).toBe(false); // Contains space
      expect(detectBase64('Not Base64!')).toBe(false); // Contains !
      expect(detectBase64('hello')).toBe(false); // Simple word, no mixed case/numbers
      expect(detectBase64('simple')).toBe(false); // Simple word
    });

    it('should handle edge cases', () => {
      expect(detectBase64('')).toBe(false);
      expect(detectBase64('a')).toBe(false); // Too short
      expect(detectBase64('ab')).toBe(false); // Too short
      expect(detectBase64('abc')).toBe(false); // Invalid length
    });

    it('should detect Base64 data URLs', () => {
      expect(detectBase64('data:image/png;base64,iVBORw0KGgo=')).toBe(true);
      expect(detectBase64('data:text/plain;base64,SGVsbG8=')).toBe(true);
    });
  });

  describe('URL-Safe Base64', () => {
    it('should encode to URL-safe Base64', () => {
      // Use known text that produces + and / characters
      const text = '???>>';
      const standard = encodeBase64(text);
      const urlSafe = encodeBase64URLSafe(text);

      // Just test the functionality works
      expect(standard).toBeDefined();
      expect(urlSafe).toBeDefined();

      // Verify URL-safe doesn't have + or /
      expect(urlSafe).not.toContain('+');
      expect(urlSafe).not.toContain('/');

      // Verify they decode to the same thing
      expect(decodeBase64(standard)).toBe(text);
      expect(decodeBase64URLSafe(urlSafe)).toBe(text);
    });

    it('should decode URL-safe Base64', () => {
      const original = 'sure.?>/+test';
      const urlSafe = encodeBase64URLSafe(original);
      expect(decodeBase64URLSafe(urlSafe)).toBe(original);
    });

    it('should handle round-trip encoding/decoding', () => {
      const original = 'Test+String/With=Special?Chars';
      const encoded = encodeBase64URLSafe(original);
      const decoded = decodeBase64URLSafe(encoded);
      expect(decoded).toBe(original);
    });
  });

  describe('formatWithLineBreaks', () => {
    it('should add line breaks every 76 characters', () => {
      const longBase64 = 'a'.repeat(200);
      const formatted = formatWithLineBreaks(longBase64);
      const lines = formatted.split('\n');

      expect(lines.length).toBeGreaterThan(1);
      lines.slice(0, -1).forEach((line) => {
        expect(line.length).toBe(76);
      });
    });

    it('should handle strings shorter than 76 chars', () => {
      const shortBase64 = 'SGVsbG8gV29ybGQ=';
      expect(formatWithLineBreaks(shortBase64)).toBe(shortBase64);
    });

    it('should handle custom line length', () => {
      const base64 = 'a'.repeat(100);
      const formatted = formatWithLineBreaks(base64, 50);
      const lines = formatted.split('\n');

      expect(lines[0].length).toBe(50);
      expect(lines[1].length).toBe(50);
    });
  });

  describe('processFile', () => {
    it('should process text file to Base64', async () => {
      const file = new File(['Hello World'], 'test.txt', {
        type: 'text/plain',
      });
      const result = await processFile(file);

      expect(result.base64).toBe('SGVsbG8gV29ybGQ=');
      expect(result.mimeType).toBe('text/plain');
      expect(result.fileName).toBe('test.txt');
      expect(result.size).toBe(11);
    });

    it('should handle binary files', async () => {
      const binaryData = new Uint8Array([0xff, 0xd8, 0xff, 0xe0]);
      const file = new File([binaryData], 'test.jpg', { type: 'image/jpeg' });
      const result = await processFile(file);

      expect(result.base64).toBeTruthy();
      expect(result.mimeType).toBe('image/jpeg');
      expect(result.dataURL).toContain('data:image/jpeg;base64,');
    });

    it('should handle empty file', async () => {
      const file = new File([], 'empty.txt', { type: 'text/plain' });
      const result = await processFile(file);

      expect(result.base64).toBe('');
      expect(result.size).toBe(0);
    });

    it('should reject files over size limit', async () => {
      const largeData = new Uint8Array(11 * 1024 * 1024); // 11MB
      const file = new File([largeData], 'large.bin', {
        type: 'application/octet-stream',
      });

      await expect(processFile(file, 10 * 1024 * 1024)).rejects.toThrow(
        'File size exceeds limit'
      );
    });
  });

  describe('getDataURLFromBase64', () => {
    it('should create data URL from Base64', () => {
      const base64 = 'SGVsbG8gV29ybGQ=';
      const dataURL = getDataURLFromBase64(base64, 'text/plain');

      expect(dataURL).toBe('data:text/plain;base64,SGVsbG8gV29ybGQ=');
    });

    it('should handle image MIME types', () => {
      const base64 = 'iVBORw0KGgo=';
      const dataURL = getDataURLFromBase64(base64, 'image/png');

      expect(dataURL).toBe('data:image/png;base64,iVBORw0KGgo=');
    });

    it('should use default MIME type when not provided', () => {
      const base64 = 'SGVsbG8=';
      const dataURL = getDataURLFromBase64(base64);

      expect(dataURL).toBe('data:application/octet-stream;base64,SGVsbG8=');
    });
  });

  describe('extractMimeType', () => {
    it('should extract MIME type from data URL', () => {
      expect(extractMimeType('data:image/png;base64,iVBORw0KGgo=')).toBe(
        'image/png'
      );
      expect(extractMimeType('data:text/plain;base64,SGVsbG8=')).toBe(
        'text/plain'
      );
      expect(
        extractMimeType('data:application/json;base64,eyJ0ZXN0Ijp0cnVlfQ==')
      ).toBe('application/json');
    });

    it('should return null for invalid data URLs', () => {
      expect(extractMimeType('SGVsbG8gV29ybGQ=')).toBeNull();
      expect(extractMimeType('not a data url')).toBeNull();
      expect(extractMimeType('')).toBeNull();
    });

    it('should handle data URLs without base64 marker', () => {
      expect(extractMimeType('data:text/plain,Hello')).toBe('text/plain');
    });
  });

  describe('isValidBase64', () => {
    it('should validate correct Base64 strings', () => {
      expect(isValidBase64('SGVsbG8gV29ybGQ=')).toBe(true);
      expect(isValidBase64('VGVzdA==')).toBe(true);
      expect(isValidBase64('YWJjZGVmZ2hpams=')).toBe(true);
    });

    it('should reject invalid Base64 strings', () => {
      expect(isValidBase64('Not Base64!')).toBe(false);
      expect(isValidBase64('SGVsbG8@V29ybGQ=')).toBe(false);
      expect(isValidBase64('%%%')).toBe(false);
    });

    it('should handle Base64 without padding', () => {
      expect(isValidBase64('SGVsbG8gV29ybGQ')).toBe(true);
      expect(isValidBase64('VGVzdA')).toBe(true);
    });

    it('should handle empty string', () => {
      expect(isValidBase64('')).toBe(true);
    });

    it('should handle Base64 with whitespace', () => {
      expect(isValidBase64('SGVsbG8g\nV29ybGQ=')).toBe(true);
      expect(isValidBase64('SGVsbG8g V29ybGQ=')).toBe(true);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle JWT token payload', () => {
      const jwtPayload =
        'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ';
      const decoded = decodeBase64(jwtPayload);
      const parsed = JSON.parse(decoded);

      expect(parsed.sub).toBe('1234567890');
      expect(parsed.name).toBe('John Doe');
      expect(parsed.iat).toBe(1516239022);
    });

    it('should handle email MIME encoding', () => {
      const longText =
        'This is a very long email content that needs to be encoded in Base64 for MIME format with proper line breaks according to RFC 2045 specification.';
      const encoded = encodeBase64(longText);
      const formatted = formatWithLineBreaks(encoded, 76);

      expect(formatted).toContain('\n');
      const decoded = decodeBase64(formatted);
      expect(decoded).toBe(longText);
    });

    it('should handle image data URL round-trip', () => {
      const imageData = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
      const base64 = Buffer.from(imageData).toString('base64');
      const dataURL = getDataURLFromBase64(base64, 'image/png');

      expect(dataURL).toContain('data:image/png;base64,');

      const extracted = dataURL.replace('data:image/png;base64,', '');
      const decoded = Buffer.from(extracted, 'base64');

      expect(Array.from(decoded)).toEqual(Array.from(imageData));
    });
  });
});
