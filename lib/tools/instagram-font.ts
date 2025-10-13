// Instagram Font Generator - Unicode Text Styling
// Uses Mathematical Alphanumeric Symbols (U+1D400–U+1D7FF) and other Unicode blocks

export interface FontStyle {
  id: string;
  name: string;
  description: string;
  converter: (text: string) => string;
  compatibility: {
    instagram: boolean;
    whatsapp: boolean;
    twitter: boolean;
    facebook: boolean;
  };
  example: string;
}

export interface InstagramFontResult {
  success: boolean;
  styles: Array<{
    id: string;
    name: string;
    text: string;
    compatibility: FontStyle['compatibility'];
  }>;
  error?: string;
  metadata?: {
    inputLength: number;
    stylesGenerated: number;
  };
}

// Unicode mapping utilities
const mapChar = (
  char: string,
  lowerOffset: number,
  upperOffset: number,
  preserveCase = true
): string => {
  const code = char.charCodeAt(0);

  // Lowercase a-z (97-122)
  if (code >= 97 && code <= 122) {
    return String.fromCodePoint(lowerOffset + (code - 97));
  }

  // Uppercase A-Z (65-90)
  if (code >= 65 && code <= 90) {
    if (preserveCase) {
      return String.fromCodePoint(upperOffset + (code - 65));
    }
    // If not preserving case, map to lowercase range
    return String.fromCodePoint(lowerOffset + (code - 65));
  }

  // Numbers 0-9 (48-57) - for styles that support numbers
  if (code >= 48 && code <= 57 && upperOffset > 0) {
    const digitOffset = upperOffset + 26; // After uppercase letters
    return String.fromCodePoint(digitOffset + (code - 48));
  }

  return char; // Preserve other characters
};

// Bold (Sans-serif Bold)
const toBold = (text: string): string => {
  return text
    .split('')
    .map((char) => mapChar(char, 0x1d5ee, 0x1d5d4)) // a-z: 𝗮-𝘇, A-Z: 𝗔-𝗭
    .join('');
};

// Italic (Sans-serif Italic)
const toItalic = (text: string): string => {
  return text
    .split('')
    .map((char) => mapChar(char, 0x1d622, 0x1d608)) // a-z: 𝘢-𝘻, A-Z: 𝘈-𝘡
    .join('');
};

// Bold Italic
const toBoldItalic = (text: string): string => {
  return text
    .split('')
    .map((char) => mapChar(char, 0x1d63c, 0x1d622)) // a-z: 𝙖-𝙯, A-Z: 𝙖-𝙕
    .join('');
};

// Script/Cursive
const toScript = (text: string): string => {
  // Script has some exceptions for specific letters
  const scriptMap: Record<string, string> = {
    B: '𝓑',
    E: '𝓔',
    F: '𝓕',
    H: '𝓗',
    I: '𝓘',
    L: '𝓛',
    M: '𝓜',
    R: '𝓡',
    e: 'ℯ',
    g: 'ℊ',
    o: 'ℴ',
  };

  return text
    .split('')
    .map((char) => {
      if (scriptMap[char]) return scriptMap[char];
      return mapChar(char, 0x1d4ea, 0x1d4d0);
    })
    .join('');
};

// Double-struck
const toDoubleStruck = (text: string): string => {
  // Double-struck has exceptions
  const dsMap: Record<string, string> = {
    C: 'ℂ',
    H: 'ℍ',
    N: 'ℕ',
    P: 'ℙ',
    Q: 'ℚ',
    R: 'ℝ',
    Z: 'ℤ',
  };

  return text
    .split('')
    .map((char) => {
      if (dsMap[char]) return dsMap[char];
      return mapChar(char, 0x1d552, 0x1d538);
    })
    .join('');
};

// Monospace
const toMonospace = (text: string): string => {
  return text
    .split('')
    .map((char) => mapChar(char, 0x1d68a, 0x1d670))
    .join('');
};

// Fraktur
const toFraktur = (text: string): string => {
  const frakturMap: Record<string, string> = {
    C: 'ℭ',
    H: 'ℌ',
    I: 'ℑ',
    R: 'ℜ',
    Z: 'ℨ',
  };

  return text
    .split('')
    .map((char) => {
      if (frakturMap[char]) return frakturMap[char];
      return mapChar(char, 0x1d51e, 0x1d504);
    })
    .join('');
};

// Bold Fraktur
const toBoldFraktur = (text: string): string => {
  return text
    .split('')
    .map((char) => mapChar(char, 0x1d586, 0x1d56c))
    .join('');
};

// Squared (Negative Squared)
const toSquared = (text: string): string => {
  const squaredMap: Record<string, string> = {
    A: '🄰',
    B: '🄱',
    C: '🄲',
    D: '🄳',
    E: '🄴',
    F: '🄵',
    G: '🄶',
    H: '🄷',
    I: '🄸',
    J: '🄹',
    K: '🄺',
    L: '🄻',
    M: '🄼',
    N: '🄽',
    O: '🄾',
    P: '🄿',
    Q: '🅀',
    R: '🅁',
    S: '🅂',
    T: '🅃',
    U: '🅄',
    V: '🅅',
    W: '🅆',
    X: '🅇',
    Y: '🅈',
    Z: '🅉',
  };

  return text
    .toUpperCase()
    .split('')
    .map((char) => squaredMap[char] || char)
    .join('');
};

// Circled
const toCircled = (text: string): string => {
  return text
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code >= 97 && code <= 122) {
        // a-z → ⓐ-ⓩ
        return String.fromCodePoint(0x24d0 + (code - 97));
      }
      if (code >= 65 && code <= 90) {
        // A-Z → Ⓐ-Ⓩ
        return String.fromCodePoint(0x24b6 + (code - 65));
      }
      if (code >= 48 && code <= 57) {
        // 0-9 → ⓪-⑨
        return String.fromCodePoint(0x2460 + (code - 49));
      }
      return char;
    })
    .join('');
};

// Negative Circled
const toNegativeCircled = (text: string): string => {
  const negCircledMap: Record<string, string> = {
    A: '🅐',
    B: '🅑',
    C: '🅒',
    D: '🅓',
    E: '🅔',
    F: '🅕',
    G: '🅖',
    H: '🅗',
    I: '🅘',
    J: '🅙',
    K: '🅚',
    L: '🅛',
    M: '🅜',
    N: '🅝',
    O: '🅞',
    P: '🅟',
    Q: '🅠',
    R: '🅡',
    S: '🅢',
    T: '🅣',
    U: '🅤',
    V: '🅥',
    W: '🅦',
    X: '🅧',
    Y: '🅨',
    Z: '🅩',
  };

  return text
    .toUpperCase()
    .split('')
    .map((char) => negCircledMap[char] || char)
    .join('');
};

// Strikethrough (using combining characters)
const toStrikethrough = (text: string): string => {
  return text
    .split('')
    .map((char) => {
      if (char === ' ') return char;
      return char + '\u0336'; // Combining long stroke overlay
    })
    .join('');
};

// Underline (using combining characters)
const toUnderline = (text: string): string => {
  return text
    .split('')
    .map((char) => {
      if (char === ' ') return char;
      return char + '\u0332'; // Combining low line
    })
    .join('');
};

// Small Caps (using small capital letters)
const toSmallCaps = (text: string): string => {
  const smallCapsMap: Record<string, string> = {
    a: 'ᴀ',
    b: 'ʙ',
    c: 'ᴄ',
    d: 'ᴅ',
    e: 'ᴇ',
    f: 'ꜰ',
    g: 'ɢ',
    h: 'ʜ',
    i: 'ɪ',
    j: 'ᴊ',
    k: 'ᴋ',
    l: 'ʟ',
    m: 'ᴍ',
    n: 'ɴ',
    o: 'ᴏ',
    p: 'ᴘ',
    q: 'ǫ',
    r: 'ʀ',
    s: 's',
    t: 'ᴛ',
    u: 'ᴜ',
    v: 'ᴠ',
    w: 'ᴡ',
    x: 'x',
    y: 'ʏ',
    z: 'ᴢ',
  };

  return text
    .toLowerCase()
    .split('')
    .map((char) => smallCapsMap[char] || char)
    .join('');
};

// Tiny Caps (alternate small caps)
const toTinyCaps = (text: string): string => {
  const tinyMap: Record<string, string> = {
    a: 'ᴀ',
    b: 'ʙ',
    c: 'ᴄ',
    d: 'ᴅ',
    e: 'ᴇ',
    f: 'ꜰ',
    g: 'ɢ',
    h: 'ʜ',
    i: 'ɪ',
    j: 'ᴊ',
    k: 'ᴋ',
    l: 'ʟ',
    m: 'ᴍ',
    n: 'ɴ',
    o: 'ᴏ',
    p: 'ᴘ',
    q: 'ǫ',
    r: 'ʀ',
    s: 'ꜱ',
    t: 'ᴛ',
    u: 'ᴜ',
    v: 'ᴠ',
    w: 'ᴡ',
    x: 'x',
    y: 'ʏ',
    z: 'ᴢ',
  };

  return text
    .toLowerCase()
    .split('')
    .map((char) => tinyMap[char] || char.toUpperCase())
    .join('');
};

// Superscript
const toSuperscript = (text: string): string => {
  const superMap: Record<string, string> = {
    a: 'ᵃ',
    b: 'ᵇ',
    c: 'ᶜ',
    d: 'ᵈ',
    e: 'ᵉ',
    f: 'ᶠ',
    g: 'ᵍ',
    h: 'ʰ',
    i: 'ⁱ',
    j: 'ʲ',
    k: 'ᵏ',
    l: 'ˡ',
    m: 'ᵐ',
    n: 'ⁿ',
    o: 'ᵒ',
    p: 'ᵖ',
    q: 'ᑫ',
    r: 'ʳ',
    s: 'ˢ',
    t: 'ᵗ',
    u: 'ᵘ',
    v: 'ᵛ',
    w: 'ʷ',
    x: 'ˣ',
    y: 'ʸ',
    z: 'ᶻ',
    '0': '⁰',
    '1': '¹',
    '2': '²',
    '3': '³',
    '4': '⁴',
    '5': '⁵',
    '6': '⁶',
    '7': '⁷',
    '8': '⁸',
    '9': '⁹',
  };

  return text
    .toLowerCase()
    .split('')
    .map((char) => superMap[char] || char)
    .join('');
};

// Subscript
const toSubscript = (text: string): string => {
  const subMap: Record<string, string> = {
    a: 'ₐ',
    e: 'ₑ',
    h: 'ₕ',
    i: 'ᵢ',
    j: 'ⱼ',
    k: 'ₖ',
    l: 'ₗ',
    m: 'ₘ',
    n: 'ₙ',
    o: 'ₒ',
    p: 'ₚ',
    r: 'ᵣ',
    s: 'ₛ',
    t: 'ₜ',
    u: 'ᵤ',
    v: 'ᵥ',
    x: 'ₓ',
    '0': '₀',
    '1': '₁',
    '2': '₂',
    '3': '₃',
    '4': '₄',
    '5': '₅',
    '6': '₆',
    '7': '₇',
    '8': '₈',
    '9': '₉',
  };

  return text
    .toLowerCase()
    .split('')
    .map((char) => subMap[char] || char)
    .join('');
};

// Upside Down
const toUpsideDown = (text: string): string => {
  const upsideMap: Record<string, string> = {
    a: 'ɐ',
    b: 'q',
    c: 'ɔ',
    d: 'p',
    e: 'ǝ',
    f: 'ɟ',
    g: 'ƃ',
    h: 'ɥ',
    i: 'ᴉ',
    j: 'ɾ',
    k: 'ʞ',
    l: 'l',
    m: 'ɯ',
    n: 'u',
    o: 'o',
    p: 'd',
    q: 'b',
    r: 'ɹ',
    s: 's',
    t: 'ʇ',
    u: 'n',
    v: 'ʌ',
    w: 'ʍ',
    x: 'x',
    y: 'ʎ',
    z: 'z',
    A: '∀',
    B: 'q',
    C: 'Ɔ',
    D: 'p',
    E: 'Ǝ',
    F: 'Ⅎ',
    G: '⅁',
    H: 'H',
    I: 'I',
    J: 'ſ',
    K: 'ʞ',
    L: '˥',
    M: 'W',
    N: 'N',
    O: 'O',
    P: 'Ԁ',
    Q: 'Ό',
    R: 'ᴚ',
    S: 'S',
    T: '⊥',
    U: '∩',
    V: 'Λ',
    W: 'M',
    X: 'X',
    Y: '⅄',
    Z: 'Z',
    '!': '¡',
    '?': '¿',
    '.': '˙',
    ',': '\u02BB',
    "'": ',',
    '"': '„',
    ';': '؛',
    '(': ')',
    ')': '(',
    '[': ']',
    ']': '[',
    '{': '}',
    '}': '{',
  };

  return text
    .split('')
    .reverse()
    .map((char) => upsideMap[char] || char)
    .join('');
};

// Bubble Text (Circled variant)
const toBubble = (text: string): string => {
  return text
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code >= 97 && code <= 122) {
        return String.fromCodePoint(0x24d0 + (code - 97));
      }
      if (code >= 65 && code <= 90) {
        return String.fromCodePoint(0x24b6 + (code - 65));
      }
      return char;
    })
    .join('');
};

// Fullwidth (for aesthetic spacing)
const toFullwidth = (text: string): string => {
  return text
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0);
      // ASCII 33-126 → Fullwidth FF01-FF5E
      if (code >= 33 && code <= 126) {
        return String.fromCodePoint(0xff00 + (code - 0x20));
      }
      if (code === 32) {
        return '\u3000'; // Ideographic space
      }
      return char;
    })
    .join('');
};

// Zalgo/Glitch (combining diacritical marks) - use sparingly!
const toZalgo = (text: string, intensity: number = 5): string => {
  const combiningChars = [
    '\u0300',
    '\u0301',
    '\u0302',
    '\u0303',
    '\u0304',
    '\u0305',
    '\u0306',
    '\u0307',
    '\u0308',
    '\u0309',
    '\u030a',
    '\u030b',
    '\u030c',
    '\u030d',
    '\u030e',
    '\u030f',
    '\u0310',
    '\u0311',
    '\u0312',
    '\u0313',
    '\u0314',
    '\u0315',
    '\u031a',
    '\u031b',
    '\u033d',
    '\u033e',
    '\u033f',
    '\u0340',
    '\u0341',
    '\u0342',
    '\u0343',
    '\u0344',
    '\u0345',
    '\u0346',
    '\u034a',
    '\u034b',
    '\u034c',
  ];

  return text
    .split('')
    .map((char) => {
      if (char === ' ') return char;
      let result = char;
      for (let i = 0; i < intensity; i++) {
        result +=
          combiningChars[Math.floor(Math.random() * combiningChars.length)];
      }
      return result;
    })
    .join('');
};

// Regional Indicator (Flag emoji letters)
const toRegionalIndicator = (text: string): string => {
  return text
    .toUpperCase()
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        // A-Z → 🇦-🇿
        return String.fromCodePoint(0x1f1e6 + (code - 65));
      }
      return char;
    })
    .join('');
};

// Define all font styles
export const fontStyles: FontStyle[] = [
  {
    id: 'bold',
    name: 'Bold',
    description: 'Bold sans-serif font',
    converter: toBold,
    example: '𝗕𝗼𝗹𝗱 𝗧𝗲𝘅𝘁',
    compatibility: {
      instagram: true,
      whatsapp: true,
      twitter: true,
      facebook: true,
    },
  },
  {
    id: 'italic',
    name: 'Italic',
    description: 'Italic sans-serif font',
    converter: toItalic,
    example: '𝘐𝘵𝘢𝘭𝘪𝘤 𝘛𝘦𝘹𝘵',
    compatibility: {
      instagram: true,
      whatsapp: true,
      twitter: true,
      facebook: true,
    },
  },
  {
    id: 'bold-italic',
    name: 'Bold Italic',
    description: 'Bold and italic combined',
    converter: toBoldItalic,
    example: '𝘽𝙤𝙡𝙙 𝙄𝙩𝙖𝙡𝙞𝙘',
    compatibility: {
      instagram: true,
      whatsapp: true,
      twitter: true,
      facebook: true,
    },
  },
  {
    id: 'script',
    name: 'Script / Cursive',
    description: 'Elegant script font',
    converter: toScript,
    example: '𝒮𝒸𝓇𝒾𝓅𝓉 𝒯ℯ𝓍𝓉',
    compatibility: {
      instagram: true,
      whatsapp: true,
      twitter: true,
      facebook: true,
    },
  },
  {
    id: 'double-struck',
    name: 'Double-Struck',
    description: 'Outlined double-struck font',
    converter: toDoubleStruck,
    example: '𝔻𝕠𝕦𝕓𝕝𝕖 𝕊𝕥𝕣𝕦𝕔𝕜',
    compatibility: {
      instagram: true,
      whatsapp: true,
      twitter: true,
      facebook: true,
    },
  },
  {
    id: 'monospace',
    name: 'Monospace',
    description: 'Fixed-width monospace font',
    converter: toMonospace,
    example: '𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎',
    compatibility: {
      instagram: true,
      whatsapp: true,
      twitter: true,
      facebook: true,
    },
  },
  {
    id: 'fraktur',
    name: 'Fraktur',
    description: 'Gothic Fraktur font',
    converter: toFraktur,
    example: '𝔉𝔯𝔞𝔨𝔱𝔲𝔯',
    compatibility: {
      instagram: true,
      whatsapp: true,
      twitter: true,
      facebook: true,
    },
  },
  {
    id: 'bold-fraktur',
    name: 'Bold Fraktur',
    description: 'Bold Gothic font',
    converter: toBoldFraktur,
    example: '𝕭𝖔𝖑𝖉 𝕱𝖗𝖆𝖐𝖙𝖚𝖗',
    compatibility: {
      instagram: true,
      whatsapp: true,
      twitter: true,
      facebook: true,
    },
  },
  {
    id: 'squared',
    name: 'Squared',
    description: 'Letters in squares',
    converter: toSquared,
    example: '🅂🅀🅄🄰🅁🄴🄳',
    compatibility: {
      instagram: true,
      whatsapp: true,
      twitter: true,
      facebook: true,
    },
  },
  {
    id: 'circled',
    name: 'Circled',
    description: 'Letters in circles',
    converter: toCircled,
    example: 'Ⓒⓘⓡⓒⓛⓔⓓ',
    compatibility: {
      instagram: true,
      whatsapp: true,
      twitter: true,
      facebook: true,
    },
  },
  {
    id: 'negative-circled',
    name: 'Negative Circled',
    description: 'Inverted circles',
    converter: toNegativeCircled,
    example: '🅝🅔🅖🅐🅣🅘🅥🅔',
    compatibility: {
      instagram: true,
      whatsapp: true,
      twitter: true,
      facebook: true,
    },
  },
  {
    id: 'strikethrough',
    name: 'Strikethrough',
    description: 'Text with line through',
    converter: toStrikethrough,
    example: 'S̶t̶r̶i̶k̶e̶t̶h̶r̶o̶u̶g̶h̶',
    compatibility: {
      instagram: true,
      whatsapp: true,
      twitter: true,
      facebook: false,
    },
  },
  {
    id: 'underline',
    name: 'Underline',
    description: 'Underlined text',
    converter: toUnderline,
    example: 'U̲n̲d̲e̲r̲l̲i̲n̲e̲',
    compatibility: {
      instagram: true,
      whatsapp: true,
      twitter: true,
      facebook: false,
    },
  },
  {
    id: 'small-caps',
    name: 'Small Caps',
    description: 'Small capital letters',
    converter: toSmallCaps,
    example: 'sᴍᴀʟʟ ᴄᴀᴘs',
    compatibility: {
      instagram: true,
      whatsapp: true,
      twitter: true,
      facebook: true,
    },
  },
  {
    id: 'tiny-caps',
    name: 'Tiny Caps',
    description: 'Alternative small caps',
    converter: toTinyCaps,
    example: 'ᴛɪɴʏ ᴄᴀᴘꜱ',
    compatibility: {
      instagram: true,
      whatsapp: true,
      twitter: true,
      facebook: true,
    },
  },
  {
    id: 'superscript',
    name: 'Superscript',
    description: 'Raised small letters',
    converter: toSuperscript,
    example: 'ˢᵘᵖᵉʳˢᶜʳⁱᵖᵗ',
    compatibility: {
      instagram: true,
      whatsapp: true,
      twitter: true,
      facebook: true,
    },
  },
  {
    id: 'subscript',
    name: 'Subscript',
    description: 'Lowered small letters',
    converter: toSubscript,
    example: 'ₛᵤᵦₛ𝒸ᵣᵢₚₜ',
    compatibility: {
      instagram: true,
      whatsapp: true,
      twitter: true,
      facebook: true,
    },
  },
  {
    id: 'upside-down',
    name: 'Upside Down',
    description: 'Flipped text',
    converter: toUpsideDown,
    example: 'uʍop ǝpᴉsd∩',
    compatibility: {
      instagram: true,
      whatsapp: true,
      twitter: true,
      facebook: true,
    },
  },
  {
    id: 'bubble',
    name: 'Bubble',
    description: 'Rounded bubble letters',
    converter: toBubble,
    example: 'Ⓑⓤⓑⓑⓛⓔ',
    compatibility: {
      instagram: true,
      whatsapp: true,
      twitter: true,
      facebook: true,
    },
  },
  {
    id: 'fullwidth',
    name: 'Fullwidth',
    description: 'Wide aesthetic spacing',
    converter: toFullwidth,
    example: 'Ｆｕｌｌｗｉｄｔｈ',
    compatibility: {
      instagram: true,
      whatsapp: true,
      twitter: true,
      facebook: true,
    },
  },
  {
    id: 'regional-indicator',
    name: 'Regional Flags',
    description: 'Flag emoji letters',
    converter: toRegionalIndicator,
    example: '🇫🇱🇦🇬🇸',
    compatibility: {
      instagram: true,
      whatsapp: true,
      twitter: true,
      facebook: true,
    },
  },
  {
    id: 'zalgo',
    name: 'Zalgo / Glitch',
    description: 'Chaotic glitch text (use carefully)',
    converter: (text) => toZalgo(text, 3),
    example: 'Z̴a̶l̷g̸o̴',
    compatibility: {
      instagram: false,
      whatsapp: true,
      twitter: true,
      facebook: false,
    },
  },
];

// Main conversion function
export function generateInstagramFonts(text: string): InstagramFontResult {
  try {
    if (!text || text.trim().length === 0) {
      return {
        success: false,
        styles: [],
        error: 'Input text is required',
      };
    }

    if (text.length > 500) {
      return {
        success: false,
        styles: [],
        error: 'Text exceeds maximum length of 500 characters',
      };
    }

    const styles = fontStyles.map((style) => ({
      id: style.id,
      name: style.name,
      text: style.converter(text),
      compatibility: style.compatibility,
    }));

    return {
      success: true,
      styles,
      metadata: {
        inputLength: text.length,
        stylesGenerated: styles.length,
      },
    };
  } catch (error) {
    return {
      success: false,
      styles: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Get single font style by ID
export function convertToFontStyle(
  text: string,
  styleId: string
): string | null {
  const style = fontStyles.find((s) => s.id === styleId);
  if (!style) return null;
  return style.converter(text);
}

// Get all available style IDs
export function getAvailableStyles(): string[] {
  return fontStyles.map((s) => s.id);
}

// Check compatibility for a specific platform
export function checkPlatformCompatibility(
  styleId: string,
  platform: keyof FontStyle['compatibility']
): boolean {
  const style = fontStyles.find((s) => s.id === styleId);
  return style?.compatibility[platform] ?? false;
}
