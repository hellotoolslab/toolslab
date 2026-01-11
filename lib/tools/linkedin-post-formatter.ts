// LinkedIn Post Formatter - Unicode Text Formatting
// Uses Mathematical Alphanumeric Symbols for bold/italic formatting

export interface LinkedInFormatterResult {
  success: boolean;
  text?: string;
  error?: string;
  metadata?: {
    inputLength: number;
    outputLength: number;
    formattingApplied: string;
  };
}

export interface FormatOptions {
  preserveLineBreaks?: boolean;
}

// Constants
export const LINKEDIN_CHAR_LIMIT = 3000;
export const LINKEDIN_OPTIMAL_LENGTH = 1300; // Optimal for engagement

// Unicode mapping utilities
const mapChar = (
  char: string,
  lowerOffset: number,
  upperOffset: number
): string => {
  const code = char.charCodeAt(0);

  // Lowercase a-z (97-122)
  if (code >= 97 && code <= 122) {
    return String.fromCodePoint(lowerOffset + (code - 97));
  }

  // Uppercase A-Z (65-90)
  if (code >= 65 && code <= 90) {
    return String.fromCodePoint(upperOffset + (code - 65));
  }

  return char; // Preserve other characters (numbers, punctuation, etc.)
};

// Bold (Sans-serif Bold) - Most compatible with LinkedIn
export function toBold(text: string): string {
  return text
    .split('')
    .map((char) => mapChar(char, 0x1d5ee, 0x1d5d4))
    .join('');
}

// Italic (Sans-serif Italic)
export function toItalic(text: string): string {
  return text
    .split('')
    .map((char) => mapChar(char, 0x1d622, 0x1d608))
    .join('');
}

// Bold Italic (Sans-serif Bold Italic)
export function toBoldItalic(text: string): string {
  return text
    .split('')
    .map((char) => mapChar(char, 0x1d656, 0x1d63c))
    .join('');
}

// Serif Bold - Alternative bold style
export function toSerifBold(text: string): string {
  return text
    .split('')
    .map((char) => mapChar(char, 0x1d41a, 0x1d400))
    .join('');
}

// Serif Italic - Alternative italic style
export function toSerifItalic(text: string): string {
  return text
    .split('')
    .map((char) => mapChar(char, 0x1d44e, 0x1d434))
    .join('');
}

// Underline using combining character
export function toUnderline(text: string): string {
  return text
    .split('')
    .map((char) => {
      if (char === ' ' || char === '\n') return char;
      return char + '\u0332'; // Combining low line
    })
    .join('');
}

// Strikethrough using combining character
export function toStrikethrough(text: string): string {
  return text
    .split('')
    .map((char) => {
      if (char === ' ' || char === '\n') return char;
      return char + '\u0336'; // Combining long stroke overlay
    })
    .join('');
}

// Monospace
export function toMonospace(text: string): string {
  return text
    .split('')
    .map((char) => mapChar(char, 0x1d68a, 0x1d670))
    .join('');
}

// Bullet point styles
export const bulletStyles = {
  dot: '•',
  circle: '○',
  diamond: '◆',
  arrow: '→',
  check: '✓',
  star: '★',
  square: '■',
  dash: '—',
} as const;

export type BulletStyle = keyof typeof bulletStyles;

// Number styles for lists
export const numberStyles = {
  standard: (n: number) => `${n}.`,
  parenthesis: (n: number) => `${n})`,
  bracket: (n: number) => `[${n}]`,
  circled: (n: number) => {
    const circledNumbers = [
      '⓪',
      '①',
      '②',
      '③',
      '④',
      '⑤',
      '⑥',
      '⑦',
      '⑧',
      '⑨',
      '⑩',
    ];
    return n <= 10 ? circledNumbers[n] : `${n}.`;
  },
} as const;

export type NumberStyle = keyof typeof numberStyles;

/**
 * Format text with bold
 */
export function formatBold(text: string): LinkedInFormatterResult {
  try {
    if (!text) {
      return { success: false, error: 'Text is required' };
    }

    const result = toBold(text);
    return {
      success: true,
      text: result,
      metadata: {
        inputLength: text.length,
        outputLength: result.length,
        formattingApplied: 'bold',
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to format text',
    };
  }
}

/**
 * Format text with italic
 */
export function formatItalic(text: string): LinkedInFormatterResult {
  try {
    if (!text) {
      return { success: false, error: 'Text is required' };
    }

    const result = toItalic(text);
    return {
      success: true,
      text: result,
      metadata: {
        inputLength: text.length,
        outputLength: result.length,
        formattingApplied: 'italic',
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to format text',
    };
  }
}

/**
 * Format text with bold italic
 */
export function formatBoldItalic(text: string): LinkedInFormatterResult {
  try {
    if (!text) {
      return { success: false, error: 'Text is required' };
    }

    const result = toBoldItalic(text);
    return {
      success: true,
      text: result,
      metadata: {
        inputLength: text.length,
        outputLength: result.length,
        formattingApplied: 'bold-italic',
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to format text',
    };
  }
}

/**
 * Format text with underline
 */
export function formatUnderline(text: string): LinkedInFormatterResult {
  try {
    if (!text) {
      return { success: false, error: 'Text is required' };
    }

    const result = toUnderline(text);
    return {
      success: true,
      text: result,
      metadata: {
        inputLength: text.length,
        outputLength: result.length,
        formattingApplied: 'underline',
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to format text',
    };
  }
}

/**
 * Format text with strikethrough
 */
export function formatStrikethrough(text: string): LinkedInFormatterResult {
  try {
    if (!text) {
      return { success: false, error: 'Text is required' };
    }

    const result = toStrikethrough(text);
    return {
      success: true,
      text: result,
      metadata: {
        inputLength: text.length,
        outputLength: result.length,
        formattingApplied: 'strikethrough',
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to format text',
    };
  }
}

/**
 * Format text with monospace
 */
export function formatMonospace(text: string): LinkedInFormatterResult {
  try {
    if (!text) {
      return { success: false, error: 'Text is required' };
    }

    const result = toMonospace(text);
    return {
      success: true,
      text: result,
      metadata: {
        inputLength: text.length,
        outputLength: result.length,
        formattingApplied: 'monospace',
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to format text',
    };
  }
}

/**
 * Create a bullet list from lines of text
 */
export function createBulletList(
  lines: string[],
  bulletStyle: BulletStyle = 'dot'
): LinkedInFormatterResult {
  try {
    if (!lines || lines.length === 0) {
      return { success: false, error: 'Lines are required' };
    }

    const bullet = bulletStyles[bulletStyle];
    const result = lines
      .filter((line) => line.trim())
      .map((line) => `${bullet} ${line.trim()}`)
      .join('\n');

    return {
      success: true,
      text: result,
      metadata: {
        inputLength: lines.join('').length,
        outputLength: result.length,
        formattingApplied: `bullet-list-${bulletStyle}`,
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to create bullet list',
    };
  }
}

/**
 * Create a numbered list from lines of text
 */
export function createNumberedList(
  lines: string[],
  numberStyle: NumberStyle = 'standard'
): LinkedInFormatterResult {
  try {
    if (!lines || lines.length === 0) {
      return { success: false, error: 'Lines are required' };
    }

    const formatter = numberStyles[numberStyle];
    const result = lines
      .filter((line) => line.trim())
      .map((line, index) => `${formatter(index + 1)} ${line.trim()}`)
      .join('\n');

    return {
      success: true,
      text: result,
      metadata: {
        inputLength: lines.join('').length,
        outputLength: result.length,
        formattingApplied: `numbered-list-${numberStyle}`,
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to create numbered list',
    };
  }
}

/**
 * Add line spacing by inserting blank lines
 */
export function addLineSpacing(
  text: string,
  spacing: 1 | 2 = 1
): LinkedInFormatterResult {
  try {
    if (!text) {
      return { success: false, error: 'Text is required' };
    }

    const spacer = '\n'.repeat(spacing + 1);
    const lines = text.split('\n');
    const result = lines.join(spacer);

    return {
      success: true,
      text: result,
      metadata: {
        inputLength: text.length,
        outputLength: result.length,
        formattingApplied: `line-spacing-${spacing}`,
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to add line spacing',
    };
  }
}

/**
 * Apply formatting to selected text within a larger text
 */
export function applyFormatting(
  fullText: string,
  selectionStart: number,
  selectionEnd: number,
  format:
    | 'bold'
    | 'italic'
    | 'boldItalic'
    | 'underline'
    | 'strikethrough'
    | 'monospace'
): LinkedInFormatterResult {
  try {
    if (!fullText) {
      return { success: false, error: 'Text is required' };
    }

    if (
      selectionStart < 0 ||
      selectionEnd > fullText.length ||
      selectionStart >= selectionEnd
    ) {
      return { success: false, error: 'Invalid selection range' };
    }

    const before = fullText.substring(0, selectionStart);
    const selected = fullText.substring(selectionStart, selectionEnd);
    const after = fullText.substring(selectionEnd);

    let formattedSelection: string;
    switch (format) {
      case 'bold':
        formattedSelection = toBold(selected);
        break;
      case 'italic':
        formattedSelection = toItalic(selected);
        break;
      case 'boldItalic':
        formattedSelection = toBoldItalic(selected);
        break;
      case 'underline':
        formattedSelection = toUnderline(selected);
        break;
      case 'strikethrough':
        formattedSelection = toStrikethrough(selected);
        break;
      case 'monospace':
        formattedSelection = toMonospace(selected);
        break;
      default:
        formattedSelection = selected;
    }

    const result = before + formattedSelection + after;

    return {
      success: true,
      text: result,
      metadata: {
        inputLength: fullText.length,
        outputLength: result.length,
        formattingApplied: format,
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to apply formatting',
    };
  }
}

/**
 * Get character count info for LinkedIn
 */
export function getCharacterInfo(text: string): {
  count: number;
  limit: number;
  remaining: number;
  isOverLimit: boolean;
  isOptimal: boolean;
  percentage: number;
} {
  const count = text.length;
  return {
    count,
    limit: LINKEDIN_CHAR_LIMIT,
    remaining: LINKEDIN_CHAR_LIMIT - count,
    isOverLimit: count > LINKEDIN_CHAR_LIMIT,
    isOptimal: count <= LINKEDIN_OPTIMAL_LENGTH,
    percentage: Math.round((count / LINKEDIN_CHAR_LIMIT) * 100),
  };
}

/**
 * Convert text to lines for list creation
 */
export function textToLines(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

/**
 * Sample templates for LinkedIn posts
 */
export const postTemplates = {
  announcement: {
    name: 'Announcement',
    template: `🎉 ${toBold('[Exciting News]')}

[Your announcement here]

${toBold('Key highlights:')}
• [Point 1]
• [Point 2]
• [Point 3]

What do you think? 👇`,
  },
  tips: {
    name: 'Tips & Advice',
    template: `💡 ${toBold('[X] Tips for [Topic]')}

Here's what I've learned:

1️⃣ [Tip 1]
2️⃣ [Tip 2]
3️⃣ [Tip 3]
4️⃣ [Tip 4]
5️⃣ [Tip 5]

Which tip resonates with you the most?`,
  },
  story: {
    name: 'Personal Story',
    template: `${toBold('I used to think [belief].')}

Then [something happened].

Here's what I learned:

[Lesson 1]
[Lesson 2]
[Lesson 3]

${toItalic('The biggest takeaway?')} [Key insight]

Have you experienced something similar?`,
  },
  question: {
    name: 'Engaging Question',
    template: `${toBold('[Provocative question]?')}

I've been thinking about this lately.

Here's my take:
• [Perspective 1]
• [Perspective 2]
• [Perspective 3]

What's your opinion? I'd love to hear different viewpoints. 💭`,
  },
  milestone: {
    name: 'Milestone/Achievement',
    template: `🎯 ${toBold('Milestone achieved!')}

[What you accomplished]

${toBold('The journey:')}
• Started: [When/How]
• Challenges: [What you overcame]
• Key learnings: [What you learned]

${toBold("What's next:")} [Your next goal]

Thank you to everyone who supported me along the way! 🙏`,
  },
};

export type PostTemplate = keyof typeof postTemplates;
