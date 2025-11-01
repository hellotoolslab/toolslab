/**
 * HTML Encoder/Decoder
 * Converts text to HTML entities and decodes HTML entities to plain text
 */

export type EncodingMode = 'encode' | 'decode';

export type EncodingType =
  | 'named' // Use named entities (&lt; &gt; &amp; etc.)
  | 'decimal' // Use decimal entities (&#60; &#62; etc.)
  | 'hexadecimal' // Use hexadecimal entities (&#x3C; &#x3E; etc.)
  | 'special-only' // Encode only special HTML characters
  | 'all'; // Encode all characters

export interface HtmlEncodeOptions {
  encodingType: EncodingType;
}

export interface HtmlEncodeResult {
  success: boolean;
  result: string;
  originalLength: number;
  resultLength: number;
  error?: string;
}

/**
 * Named HTML entities map
 */
const namedEntities: Record<string, string> = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '"': '&quot;',
  "'": '&#39;', // &apos; not supported in HTML4
  ' ': '&nbsp;', // Non-breaking space
  '©': '&copy;',
  '®': '&reg;',
  '™': '&trade;',
  '€': '&euro;',
  '£': '&pound;',
  '¥': '&yen;',
  '¢': '&cent;',
  '§': '&sect;',
  '«': '&laquo;',
  '»': '&raquo;',
  '°': '&deg;',
  '±': '&plusmn;',
  '×': '&times;',
  '÷': '&divide;',
  '¿': '&iquest;',
  '¡': '&iexcl;',
};

/**
 * Reverse map for decoding named entities
 */
const namedEntitiesReverse: Record<string, string> = Object.fromEntries(
  Object.entries(namedEntities).map(([char, entity]) => [entity, char])
);

/**
 * Special HTML characters that should always be encoded
 */
const specialChars = ['<', '>', '&', '"', "'"];

/**
 * Encode text to HTML entities
 */
export function htmlEncode(
  text: string,
  options: HtmlEncodeOptions = { encodingType: 'special-only' }
): HtmlEncodeResult {
  try {
    if (!text) {
      return {
        success: true,
        result: '',
        originalLength: 0,
        resultLength: 0,
      };
    }

    const { encodingType } = options;
    let result = '';

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const code = char.charCodeAt(0);

      if (encodingType === 'all') {
        // Encode all characters
        result += `&#${code};`;
      } else if (encodingType === 'hexadecimal') {
        // Encode special chars as hexadecimal
        if (specialChars.includes(char) || code > 127) {
          result += `&#x${code.toString(16).toUpperCase()};`;
        } else {
          result += char;
        }
      } else if (encodingType === 'decimal') {
        // Encode special chars as decimal
        if (specialChars.includes(char) || code > 127) {
          result += `&#${code};`;
        } else {
          result += char;
        }
      } else if (encodingType === 'named') {
        // Use named entities when available
        if (namedEntities[char]) {
          result += namedEntities[char];
        } else if (code > 127) {
          result += `&#${code};`;
        } else {
          result += char;
        }
      } else {
        // special-only (default)
        if (namedEntities[char] && specialChars.includes(char)) {
          result += namedEntities[char];
        } else {
          result += char;
        }
      }
    }

    return {
      success: true,
      result,
      originalLength: text.length,
      resultLength: result.length,
    };
  } catch (error) {
    return {
      success: false,
      result: '',
      originalLength: text.length,
      resultLength: 0,
      error: error instanceof Error ? error.message : 'Encoding failed',
    };
  }
}

/**
 * Decode HTML entities to plain text
 */
export function htmlDecode(text: string): HtmlEncodeResult {
  try {
    if (!text) {
      return {
        success: true,
        result: '',
        originalLength: 0,
        resultLength: 0,
      };
    }

    let result = text;

    // Decode named entities first
    Object.entries(namedEntitiesReverse).forEach(([entity, char]) => {
      const regex = new RegExp(
        entity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        'g'
      );
      result = result.replace(regex, char);
    });

    // Decode decimal entities (&#60;)
    result = result.replace(/&#(\d+);/g, (match, dec) => {
      const code = parseInt(dec, 10);
      if (code >= 0 && code <= 1114111) {
        // Valid Unicode range
        return String.fromCharCode(code);
      }
      return match; // Keep original if invalid
    });

    // Decode hexadecimal entities (&#x3C; or &#X3C;)
    result = result.replace(/&#[xX]([0-9A-Fa-f]+);/g, (match, hex) => {
      const code = parseInt(hex, 16);
      if (code >= 0 && code <= 1114111) {
        // Valid Unicode range
        return String.fromCharCode(code);
      }
      return match; // Keep original if invalid
    });

    return {
      success: true,
      result,
      originalLength: text.length,
      resultLength: result.length,
    };
  } catch (error) {
    return {
      success: false,
      result: '',
      originalLength: text.length,
      resultLength: 0,
      error: error instanceof Error ? error.message : 'Decoding failed',
    };
  }
}

/**
 * Validate if text contains HTML entities
 */
export function containsHtmlEntities(text: string): boolean {
  // Check for named entities
  const hasNamedEntities = /&[a-z]+;/i.test(text);

  // Check for decimal entities
  const hasDecimalEntities = /&#\d+;/.test(text);

  // Check for hexadecimal entities
  const hasHexEntities = /&#[xX][0-9A-Fa-f]+;/.test(text);

  return hasNamedEntities || hasDecimalEntities || hasHexEntities;
}

/**
 * Get statistics about HTML entities in text
 */
export interface EntityStats {
  totalEntities: number;
  namedEntities: number;
  decimalEntities: number;
  hexEntities: number;
  malformedEntities: number;
}

export function getEntityStats(text: string): EntityStats {
  const stats: EntityStats = {
    totalEntities: 0,
    namedEntities: 0,
    decimalEntities: 0,
    hexEntities: 0,
    malformedEntities: 0,
  };

  // Count named entities
  const namedMatches = text.match(/&[a-z]+;/gi);
  if (namedMatches) {
    stats.namedEntities = namedMatches.length;
    stats.totalEntities += namedMatches.length;
  }

  // Count decimal entities
  const decimalMatches = text.match(/&#\d+;/g);
  if (decimalMatches) {
    stats.decimalEntities = decimalMatches.length;
    stats.totalEntities += decimalMatches.length;
  }

  // Count hexadecimal entities
  const hexMatches = text.match(/&#[xX][0-9A-Fa-f]+;/g);
  if (hexMatches) {
    stats.hexEntities = hexMatches.length;
    stats.totalEntities += hexMatches.length;
  }

  // Count malformed entities (& followed by text but no semicolon)
  const malformedMatches = text.match(/&[a-z0-9]+(?!;)/gi);
  if (malformedMatches) {
    stats.malformedEntities = malformedMatches.length;
  }

  return stats;
}
