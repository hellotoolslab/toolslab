export interface CSSMinifyOptions {
  removeComments?: boolean;
  removeWhitespace?: boolean;
  optimizeColors?: boolean;
  convertColorFormats?: boolean;
  optimizeUnits?: boolean;
  mergeShorthand?: boolean;
  removeDuplicateRules?: boolean;
  mergeAdjacentRules?: boolean;
  removeEmptyRules?: boolean;
  autoprefixer?: boolean;
  removeUnusedPrefixes?: boolean;
  removeUnusedKeyframes?: boolean;
  mergeMediaQueries?: boolean;
  sortDeclarations?: boolean;
  preserveImportant?: boolean;
  preserveLicense?: boolean;
  preserveCustomProperties?: boolean;
}

export interface CSSBeautifyOptions {
  indentType?: 'spaces' | 'tabs';
  indentSize?: number;
  newlineBetweenRules?: boolean;
  selectorSeparator?: 'newline' | 'space';
  bracketStyle?: 'same-line' | 'new-line';
  propertyCase?: 'lowercase' | 'as-is';
  alignVendorPrefixes?: boolean;
}

export interface CSSStats {
  originalSize: number;
  minifiedSize: number;
  compressionRatio: number;
  gzipSize?: number;
  totalRules: number;
  totalSelectors: number;
  totalDeclarations: number;
  totalMediaQueries: number;
  totalKeyframes: number;
  uniqueColors: number;
  uniqueFonts: number;
  removedComments?: number;
  mergedRules?: number;
  optimizedColors?: number;
  removedDuplicates?: number;
  warnings?: string[];
  processingTime?: number;
}

export interface CSSResult {
  success: boolean;
  css: string;
  error?: string;
  stats?: CSSStats;
  mode?: 'minify' | 'beautify';
}

// Color optimization mappings
const COLOR_NAMES: Record<string, string> = {
  '#f00': 'red',
  '#ff0000': 'red',
  'rgb(255,0,0)': 'red',
  '#0f0': 'lime',
  '#00ff00': 'lime',
  'rgb(0,255,0)': 'lime',
  '#00f': 'blue',
  '#0000ff': 'blue',
  'rgb(0,0,255)': 'blue',
  '#ffffff': '#fff',
  '#ffffff ': '#fff',
  white: '#fff',
  'rgb(255,255,255)': '#fff',
  '#000': 'black',
  '#000000': 'black',
  'rgb(0,0,0)': 'black',
};

// Helper functions
function removeComments(css: string, preserveLicense: boolean = false): string {
  if (preserveLicense) {
    // Keep /*! license comments */
    return css.replace(/\/\*(?!!)[\s\S]*?\*\//g, '');
  }
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

function optimizeColor(color: string): string {
  const normalized = color.toLowerCase().replace(/\s/g, '');

  // Check for exact matches first
  if (COLOR_NAMES[normalized]) {
    return COLOR_NAMES[normalized];
  }

  // Optimize hex colors
  if (normalized.startsWith('#')) {
    // Convert 6-digit to 3-digit if possible
    if (normalized.length === 7) {
      if (
        normalized[1] === normalized[2] &&
        normalized[3] === normalized[4] &&
        normalized[5] === normalized[6]
      ) {
        const short = `#${normalized[1]}${normalized[3]}${normalized[5]}`;
        return COLOR_NAMES[short] || short;
      }
    }
  }

  return color;
}

function optimizeUnit(value: string): string {
  // Remove units from zero values
  if (
    value === '0px' ||
    value === '0em' ||
    value === '0rem' ||
    value === '0%'
  ) {
    return '0';
  }

  // Remove leading zero from decimals
  let optimized = value.replace(/\b0\.(\d+)/g, '.$1');

  // Remove unnecessary decimal .0
  optimized = optimized.replace(/\.0+(px|em|rem|%|vh|vw|pt|ex|ch)\b/g, '$1');

  return optimized;
}

function mergeShorthandValue(value: string): string {
  const parts = value.trim().split(/\s+/);

  // All four values are the same
  if (parts.length === 4 && parts.every((p) => p === parts[0])) {
    return parts[0];
  }

  // Top/bottom and left/right are the same
  if (parts.length === 4 && parts[0] === parts[2] && parts[1] === parts[3]) {
    return `${parts[0]} ${parts[1]}`;
  }

  // Left and right are the same
  if (parts.length === 3 && parts[1] === parts[2]) {
    return `${parts[0]} ${parts[1]}`;
  }

  return value;
}

function parseCSS(
  css: string
): Array<{ selector: string; declarations: string }> {
  const rules: Array<{ selector: string; declarations: string }> = [];

  // Simple CSS parser (handles most common cases)
  const ruleRegex = /([^{]+)\{([^}]*)\}/g;
  let match;

  while ((match = ruleRegex.exec(css)) !== null) {
    rules.push({
      selector: match[1].trim(),
      declarations: match[2].trim(),
    });
  }

  return rules;
}

export function minifyCSS(
  input: string,
  options: CSSMinifyOptions = {}
): CSSResult {
  const startTime = Date.now();

  if (!input || input.trim() === '') {
    return { success: false, css: '', error: 'No CSS input provided' };
  }

  const opts: CSSMinifyOptions = {
    removeComments: true,
    removeWhitespace: true,
    optimizeColors: true,
    convertColorFormats: true,
    optimizeUnits: true,
    mergeShorthand: true,
    removeDuplicateRules: true,
    mergeAdjacentRules: true,
    removeEmptyRules: true,
    preserveImportant: true,
    preserveLicense: true,
    preserveCustomProperties: true,
    ...options,
  };

  try {
    let css = input;
    const originalSize = input.length;
    const stats: Partial<CSSStats> = {
      originalSize,
      totalRules: 0,
      totalMediaQueries: 0,
      totalKeyframes: 0,
    };

    // Remove comments
    if (opts.removeComments) {
      const beforeComments = css.length;
      css = removeComments(css, opts.preserveLicense);
      stats.removedComments = Math.floor((beforeComments - css.length) / 10); // Approximate comment count
    }

    // Count media queries and keyframes
    stats.totalMediaQueries = (css.match(/@media/g) || []).length;
    stats.totalKeyframes = (css.match(/@keyframes/g) || []).length;

    // Process rules
    const rules = new Map<string, Set<string>>();
    const ruleOrder: string[] = [];

    // Extract and process regular CSS rules
    const processedParts: string[] = [];
    const specialBlocks: string[] = [];

    // Extract media queries and keyframes first
    css = css.replace(
      /@(media|keyframes|supports|container)[^{]+\{(?:[^{}]*\{[^}]*\})*[^}]*\}/g,
      (match) => {
        if (opts.removeWhitespace) {
          match = match
            .replace(/\s*([{}:;,])\s*/g, '$1')
            .replace(/\s+/g, ' ')
            .replace(/;\s*}/g, '}')
            .trim();
        }
        specialBlocks.push(match);
        return '|||SPECIAL|||';
      }
    );

    // Process regular rules
    const ruleMatches = css.matchAll(/([^{]+)\{([^}]*)\}/g);

    for (const match of ruleMatches) {
      const selector = match[1].trim();
      const declarations = match[2].trim();

      if (selector === '|||SPECIAL|||') continue;

      // Skip empty rules
      if (opts.removeEmptyRules && !declarations) {
        continue;
      }

      // Process declarations
      let processedDeclarations = declarations
        .split(';')
        .map((decl) => decl.trim())
        .filter((decl) => decl)
        .map((decl) => {
          const [prop, ...valueParts] = decl.split(':');
          if (!valueParts.length) return decl;

          let value = valueParts.join(':').trim();

          // Optimize colors
          if (opts.optimizeColors) {
            value = value.replace(
              /#[0-9a-fA-F]{3,6}|rgb\([^)]+\)/gi,
              (match) => {
                return optimizeColor(match);
              }
            );
          }

          // Optimize units
          if (opts.optimizeUnits) {
            value = value.replace(
              /\b\d+\.?\d*(px|em|rem|%|vh|vw|pt|ex|ch)\b/g,
              (match) => {
                return optimizeUnit(match);
              }
            );
          }

          // Merge shorthand
          if (
            opts.mergeShorthand &&
            (prop === 'margin' || prop === 'padding')
          ) {
            value = mergeShorthandValue(value);
          }

          return `${prop.trim()}:${value}`;
        })
        .join(';');

      // Handle duplicate and adjacent rules
      const cleanSelector = opts.removeWhitespace
        ? selector.replace(/\s*([>+~,])\s*/g, '$1').replace(/\s+/g, ' ')
        : selector;

      if (opts.mergeAdjacentRules && rules.has(cleanSelector)) {
        // Merge with existing rule
        const existing = rules.get(cleanSelector)!;
        processedDeclarations.split(';').forEach((decl) => {
          if (decl) existing.add(decl);
        });
      } else {
        // Add new rule
        if (!rules.has(cleanSelector)) {
          ruleOrder.push(cleanSelector);
        }
        rules.set(
          cleanSelector,
          new Set(processedDeclarations.split(';').filter(Boolean))
        );
      }
    }

    // Build final CSS
    const finalRules = ruleOrder.map((selector) => {
      const declarations = Array.from(rules.get(selector)!).join(';');
      return `${selector}{${declarations}}`;
    });

    // Combine everything
    let finalCSS = finalRules.join('');

    // Re-insert special blocks
    specialBlocks.forEach((block) => {
      finalCSS = finalCSS.replace('|||SPECIAL|||', '') + block;
    });

    // Final cleanup
    if (opts.removeWhitespace) {
      finalCSS = finalCSS
        .replace(/\s*([{}:;,])\s*/g, '$1')
        .replace(/;}/g, '}')
        .replace(/\s+/g, ' ')
        .trim();
    }

    // Calculate stats
    stats.minifiedSize = finalCSS.length;
    stats.compressionRatio =
      ((originalSize - finalCSS.length) / originalSize) * 100;
    stats.totalRules = rules.size;
    stats.processingTime = Date.now() - startTime;

    return {
      success: true,
      css: finalCSS,
      stats: stats as CSSStats,
    };
  } catch (error) {
    return {
      success: false,
      css: '',
      error: `Invalid CSS: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

export function beautifyCSS(
  input: string,
  options: CSSBeautifyOptions = {}
): CSSResult {
  const startTime = Date.now();

  if (!input || input.trim() === '') {
    return { success: false, css: '', error: 'No CSS input provided' };
  }

  const opts: CSSBeautifyOptions = {
    indentType: 'spaces',
    indentSize: 2,
    newlineBetweenRules: true,
    selectorSeparator: 'space',
    bracketStyle: 'same-line',
    propertyCase: 'lowercase',
    alignVendorPrefixes: false,
    ...options,
  };

  try {
    const indent =
      opts.indentType === 'tabs' ? '\t' : ' '.repeat(opts.indentSize || 2);

    // Simple beautification approach
    let css = input.trim();

    // Normalize whitespace
    css = css.replace(/\s+/g, ' ');

    // Add line breaks and indentation
    css = css.replace(/\s*{\s*/g, ' {\n');
    css = css.replace(/;\s*/g, ';\n');
    css = css.replace(/\s*}\s*/g, '\n}\n');
    css = css.replace(
      /,\s*/g,
      opts.selectorSeparator === 'newline' ? ',\n' : ', '
    );

    // Split into lines and add proper indentation
    const lines = css.split('\n');
    let level = 0;
    const formatted = lines
      .map((line) => {
        line = line.trim();

        if (!line) return '';

        // Closing brace
        if (line === '}') {
          level--;
          return indent.repeat(level) + line;
        }

        // Property declaration
        if (line.includes(':') && line.endsWith(';')) {
          const [prop, ...valueParts] = line.split(':');
          const property = prop.trim();
          const value = valueParts.join(':').replace(';', '').trim();
          return indent.repeat(level) + property + ': ' + value + ';';
        }

        // Selector or at-rule
        if (line.endsWith('{')) {
          const result =
            indent.repeat(level) + line.substring(0, line.length - 1).trim();
          if (opts.bracketStyle === 'new-line') {
            level++;
            return result + '\n' + indent.repeat(level - 1) + '{';
          } else {
            level++;
            return result + ' {';
          }
        }

        return indent.repeat(level) + line;
      })
      .filter((line) => line !== '');

    let beautified = formatted.join('\n');

    // Add newlines between rules if requested
    if (opts.newlineBetweenRules) {
      beautified = beautified.replace(/}\n(?=[^}\s])/g, '}\n\n');
    }

    // Handle vendor prefix alignment
    if (opts.alignVendorPrefixes) {
      const lines = beautified.split('\n');
      const alignedLines: string[] = [];
      let currentBlock: string[] = [];

      for (const line of lines) {
        if (line.match(/^\s+(-webkit-|-moz-|-ms-|-o-)/)) {
          currentBlock.push(line);
        } else {
          if (currentBlock.length > 0) {
            // Find the longest prefix
            let maxPrefixLength = 0;
            currentBlock.forEach((l) => {
              const match = l.match(/^\s*(-webkit-|-moz-|-ms-|-o-|)/);
              if (match) {
                maxPrefixLength = Math.max(maxPrefixLength, match[1].length);
              }
            });

            // Align the block
            currentBlock.forEach((l) => {
              const match = l.match(/^(\s*)(.*)/);
              if (match) {
                const spaces = match[1];
                const content = match[2];
                const prefixMatch = content.match(
                  /^(-webkit-|-moz-|-ms-|-o-|)/
                );
                const prefixLength = prefixMatch ? prefixMatch[1].length : 0;
                const padding = ' '.repeat(maxPrefixLength - prefixLength);
                alignedLines.push(spaces + padding + content);
              }
            });
            currentBlock = [];
          }
          alignedLines.push(line);
        }
      }

      // Handle any remaining block
      if (currentBlock.length > 0) {
        alignedLines.push(...currentBlock);
      }

      beautified = alignedLines.join('\n');
    }

    const stats: CSSStats = {
      originalSize: input.length,
      minifiedSize: beautified.length,
      compressionRatio: 0,
      totalRules: (beautified.match(/\{/g) || []).length,
      totalSelectors: (beautified.match(/[^{]+{/g) || []).length,
      totalDeclarations: (beautified.match(/;/g) || []).length,
      totalMediaQueries: (beautified.match(/@media/g) || []).length,
      totalKeyframes: (beautified.match(/@keyframes/g) || []).length,
      uniqueColors: 0,
      uniqueFonts: 0,
      processingTime: Date.now() - startTime,
    };

    return {
      success: true,
      css: beautified.trim(),
      stats,
    };
  } catch (error) {
    return {
      success: false,
      css: '',
      error: `Failed to beautify CSS: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

export function processCSS(
  input: string,
  mode: 'minify' | 'beautify',
  options?: CSSMinifyOptions | CSSBeautifyOptions
): CSSResult {
  const result =
    mode === 'minify'
      ? minifyCSS(input, options as CSSMinifyOptions)
      : beautifyCSS(input, options as CSSBeautifyOptions);

  return { ...result, mode };
}

export function analyzeCSS(css: string): CSSStats {
  const colors = new Set<string>();
  const fonts = new Set<string>();

  // Extract colors
  const colorRegex =
    /#[0-9a-fA-F]{3,6}|rgb\([^)]+\)|rgba\([^)]+\)|hsl\([^)]+\)|hsla\([^)]+\)/gi;
  const colorMatches = css.match(colorRegex) || [];
  colorMatches.forEach((color) => colors.add(color.toLowerCase()));

  // Extract fonts
  const fontRegex = /font-family:\s*([^;]+)/gi;
  let fontMatch;
  while ((fontMatch = fontRegex.exec(css)) !== null) {
    fonts.add(fontMatch[1].trim());
  }

  return {
    originalSize: css.length,
    minifiedSize: 0,
    compressionRatio: 0,
    totalRules: (css.match(/\{/g) || []).length,
    totalSelectors: (css.match(/[^{]+{/g) || []).length,
    totalDeclarations: (css.match(/;/g) || []).length,
    totalMediaQueries: (css.match(/@media/g) || []).length,
    totalKeyframes: (css.match(/@keyframes/g) || []).length,
    uniqueColors: colors.size,
    uniqueFonts: fonts.size,
  };
}
