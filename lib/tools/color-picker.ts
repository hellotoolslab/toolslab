/**
 * Color Picker Tool - Core Logic
 * Professional color manipulation and conversion utilities
 */

// Color value interfaces
export interface RGBColor {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
  a?: number; // 0-1
}

export interface HSLColor {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
  a?: number; // 0-1
}

export interface HSVColor {
  h: number; // 0-360
  s: number; // 0-100
  v: number; // 0-100
  a?: number; // 0-1
}

export interface CMYKColor {
  c: number; // 0-100
  m: number; // 0-100
  y: number; // 0-100
  k: number; // 0-100
}

export interface LABColor {
  l: number; // 0-100
  a: number; // -128 to 127
  b: number; // -128 to 127
}

export interface ColorValue {
  hex: string;
  rgb: RGBColor;
  hsl: HSLColor;
  hsv: HSVColor;
  cmyk: CMYKColor;
  lab: LABColor;
  name?: string;
}

// Harmony types for palette generation
export type HarmonyType =
  | 'complementary'
  | 'triadic'
  | 'analogous'
  | 'split-complementary'
  | 'tetradic'
  | 'monochromatic'
  | 'custom';

// Color blindness types
export type ColorBlindnessType =
  | 'normal'
  | 'protanopia'
  | 'protanomaly'
  | 'deuteranopia'
  | 'deuteranomaly'
  | 'tritanopia'
  | 'tritanomaly'
  | 'achromatopsia'
  | 'achromatomaly';

// WCAG contrast levels
export interface ContrastResult {
  ratio: number;
  AA: {
    normal: boolean;
    large: boolean;
    graphics: boolean;
  };
  AAA: {
    normal: boolean;
    large: boolean;
  };
}

// CSS named colors mapping
export const CSS_NAMED_COLORS: Record<string, string> = {
  aliceblue: '#f0f8ff',
  antiquewhite: '#faebd7',
  aqua: '#00ffff',
  aquamarine: '#7fffd4',
  azure: '#f0ffff',
  beige: '#f5f5dc',
  bisque: '#ffe4c4',
  black: '#000000',
  blanchedalmond: '#ffebcd',
  blue: '#0000ff',
  blueviolet: '#8a2be2',
  brown: '#a52a2a',
  burlywood: '#deb887',
  cadetblue: '#5f9ea0',
  chartreuse: '#7fff00',
  chocolate: '#d2691e',
  coral: '#ff7f50',
  cornflowerblue: '#6495ed',
  cornsilk: '#fff8dc',
  crimson: '#dc143c',
  cyan: '#00ffff',
  darkblue: '#00008b',
  darkcyan: '#008b8b',
  darkgoldenrod: '#b8860b',
  darkgray: '#a9a9a9',
  darkgreen: '#006400',
  darkkhaki: '#bdb76b',
  darkmagenta: '#8b008b',
  darkolivegreen: '#556b2f',
  darkorange: '#ff8c00',
  darkorchid: '#9932cc',
  darkred: '#8b0000',
  darksalmon: '#e9967a',
  darkseagreen: '#8fbc8f',
  darkslateblue: '#483d8b',
  darkslategray: '#2f4f4f',
  darkturquoise: '#00ced1',
  darkviolet: '#9400d3',
  deeppink: '#ff1493',
  deepskyblue: '#00bfff',
  dimgray: '#696969',
  dodgerblue: '#1e90ff',
  firebrick: '#b22222',
  floralwhite: '#fffaf0',
  forestgreen: '#228b22',
  fuchsia: '#ff00ff',
  gainsboro: '#dcdcdc',
  ghostwhite: '#f8f8ff',
  gold: '#ffd700',
  goldenrod: '#daa520',
  gray: '#808080',
  green: '#008000',
  greenyellow: '#adff2f',
  honeydew: '#f0fff0',
  hotpink: '#ff69b4',
  indianred: '#cd5c5c',
  indigo: '#4b0082',
  ivory: '#fffff0',
  khaki: '#f0e68c',
  lavender: '#e6e6fa',
  lavenderblush: '#fff0f5',
  lawngreen: '#7cfc00',
  lemonchiffon: '#fffacd',
  lightblue: '#add8e6',
  lightcoral: '#f08080',
  lightcyan: '#e0ffff',
  lightgoldenrodyellow: '#fafad2',
  lightgray: '#d3d3d3',
  lightgreen: '#90ee90',
  lightpink: '#ffb6c1',
  lightsalmon: '#ffa07a',
  lightseagreen: '#20b2aa',
  lightskyblue: '#87cefa',
  lightslategray: '#778899',
  lightsteelblue: '#b0c4de',
  lightyellow: '#ffffe0',
  lime: '#00ff00',
  limegreen: '#32cd32',
  linen: '#faf0e6',
  magenta: '#ff00ff',
  maroon: '#800000',
  mediumaquamarine: '#66cdaa',
  mediumblue: '#0000cd',
  mediumorchid: '#ba55d3',
  mediumpurple: '#9370db',
  mediumseagreen: '#3cb371',
  mediumslateblue: '#7b68ee',
  mediumspringgreen: '#00fa9a',
  mediumturquoise: '#48d1cc',
  mediumvioletred: '#c71585',
  midnightblue: '#191970',
  mintcream: '#f5fffa',
  mistyrose: '#ffe4e1',
  moccasin: '#ffe4b5',
  navajowhite: '#ffdead',
  navy: '#000080',
  oldlace: '#fdf5e6',
  olive: '#808000',
  olivedrab: '#6b8e23',
  orange: '#ffa500',
  orangered: '#ff4500',
  orchid: '#da70d6',
  palegoldenrod: '#eee8aa',
  palegreen: '#98fb98',
  paleturquoise: '#afeeee',
  palevioletred: '#db7093',
  papayawhip: '#ffefd5',
  peachpuff: '#ffdab9',
  peru: '#cd853f',
  pink: '#ffc0cb',
  plum: '#dda0dd',
  powderblue: '#b0e0e6',
  purple: '#800080',
  rebeccapurple: '#663399',
  red: '#ff0000',
  rosybrown: '#bc8f8f',
  royalblue: '#4169e1',
  saddlebrown: '#8b4513',
  salmon: '#fa8072',
  sandybrown: '#f4a460',
  seagreen: '#2e8b57',
  seashell: '#fff5ee',
  sienna: '#a0522d',
  silver: '#c0c0c0',
  skyblue: '#87ceeb',
  slateblue: '#6a5acd',
  slategray: '#708090',
  snow: '#fffafa',
  springgreen: '#00ff7f',
  steelblue: '#4682b4',
  tan: '#d2b48c',
  teal: '#008080',
  thistle: '#d8bfd8',
  tomato: '#ff6347',
  turquoise: '#40e0d0',
  violet: '#ee82ee',
  wheat: '#f5deb3',
  white: '#ffffff',
  whitesmoke: '#f5f5f5',
  yellow: '#ffff00',
  yellowgreen: '#9acd32',
};

/**
 * Convert HEX to RGB
 */
export function hexToRgb(hex: string): RGBColor | null {
  // Remove # if present
  hex = hex.replace('#', '');

  // Handle 3-digit hex
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('');
  }

  // Handle 4-digit hex with alpha
  if (hex.length === 4) {
    const [r, g, b, a] = hex.split('');
    hex = r + r + g + g + b + b + a + a;
  }

  // Validate hex length
  if (hex.length !== 6 && hex.length !== 8) {
    return null;
  }

  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const a = hex.length === 8 ? parseInt(hex.substr(6, 2), 16) / 255 : 1;

  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return null;
  }

  return { r, g, b, a };
}

/**
 * Convert RGB to HEX
 */
export function rgbToHex(rgb: RGBColor): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  let hex = '#' + toHex(rgb.r) + toHex(rgb.g) + toHex(rgb.b);

  if (rgb.a !== undefined && rgb.a < 1) {
    hex += toHex(Math.round(rgb.a * 255));
  }

  return hex.toUpperCase();
}

/**
 * Convert RGB to HSL
 */
export function rgbToHsl(rgb: RGBColor): HSLColor {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / diff + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / diff + 2) / 6;
        break;
      case b:
        h = ((r - g) / diff + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
    a: rgb.a,
  };
}

/**
 * Convert HSL to RGB
 */
export function hslToRgb(hsl: HSLColor): RGBColor {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
    a: hsl.a,
  };
}

/**
 * Convert RGB to HSV
 */
export function rgbToHsv(rgb: RGBColor): HSVColor {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h = 0;
  const s = max === 0 ? 0 : diff / max;
  const v = max;

  if (diff !== 0) {
    switch (max) {
      case r:
        h = ((g - b) / diff + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / diff + 2) / 6;
        break;
      case b:
        h = ((r - g) / diff + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
    a: rgb.a,
  };
}

/**
 * Convert HSV to RGB
 */
export function hsvToRgb(hsv: HSVColor): RGBColor {
  const h = hsv.h / 360;
  const s = hsv.s / 100;
  const v = hsv.v / 100;

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  let r, g, b;

  switch (i % 6) {
    case 0:
      [r, g, b] = [v, t, p];
      break;
    case 1:
      [r, g, b] = [q, v, p];
      break;
    case 2:
      [r, g, b] = [p, v, t];
      break;
    case 3:
      [r, g, b] = [p, q, v];
      break;
    case 4:
      [r, g, b] = [t, p, v];
      break;
    case 5:
      [r, g, b] = [v, p, q];
      break;
    default:
      [r, g, b] = [0, 0, 0];
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
    a: hsv.a,
  };
}

/**
 * Convert RGB to CMYK
 */
export function rgbToCmyk(rgb: RGBColor): CMYKColor {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const k = 1 - Math.max(r, g, b);

  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }

  const c = (1 - r - k) / (1 - k);
  const m = (1 - g - k) / (1 - k);
  const y = (1 - b - k) / (1 - k);

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
}

/**
 * Convert CMYK to RGB
 */
export function cmykToRgb(cmyk: CMYKColor): RGBColor {
  const c = cmyk.c / 100;
  const m = cmyk.m / 100;
  const y = cmyk.y / 100;
  const k = cmyk.k / 100;

  const r = 255 * (1 - c) * (1 - k);
  const g = 255 * (1 - m) * (1 - k);
  const b = 255 * (1 - y) * (1 - k);

  return {
    r: Math.round(r),
    g: Math.round(g),
    b: Math.round(b),
  };
}

/**
 * Convert RGB to LAB
 */
export function rgbToLab(rgb: RGBColor): LABColor {
  // First convert RGB to XYZ
  let r = rgb.r / 255;
  let g = rgb.g / 255;
  let b = rgb.b / 255;

  // Apply gamma correction
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  // Observer = 2°, Illuminant = D65
  const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  const y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0;
  const z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

  // Convert XYZ to LAB
  const fx = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
  const fy = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
  const fz = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;

  const l = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const bValue = 200 * (fy - fz);

  return {
    l: Math.round(l),
    a: Math.round(a),
    b: Math.round(bValue),
  };
}

/**
 * Convert LAB to RGB
 */
export function labToRgb(lab: LABColor): RGBColor {
  // Convert LAB to XYZ
  const fy = (lab.l + 16) / 116;
  const fx = lab.a / 500 + fy;
  const fz = fy - lab.b / 200;

  const x =
    0.95047 *
    (fx * fx * fx > 0.008856 ? fx * fx * fx : (fx - 16 / 116) / 7.787);
  const y =
    1.0 * (fy * fy * fy > 0.008856 ? fy * fy * fy : (fy - 16 / 116) / 7.787);
  const z =
    1.08883 *
    (fz * fz * fz > 0.008856 ? fz * fz * fz : (fz - 16 / 116) / 7.787);

  // Convert XYZ to RGB
  let r = x * 3.2406 + y * -1.5372 + z * -0.4986;
  let g = x * -0.9689 + y * 1.8758 + z * 0.0415;
  let b = x * 0.0557 + y * -0.204 + z * 1.057;

  // Apply gamma correction
  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
  b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : 12.92 * b;

  return {
    r: Math.round(Math.max(0, Math.min(255, r * 255))),
    g: Math.round(Math.max(0, Math.min(255, g * 255))),
    b: Math.round(Math.max(0, Math.min(255, b * 255))),
  };
}

/**
 * Parse any color string to RGB
 */
export function parseColor(color: string): RGBColor | null {
  color = color.trim().toLowerCase();

  // Check for named colors
  if (CSS_NAMED_COLORS[color]) {
    return hexToRgb(CSS_NAMED_COLORS[color]);
  }

  // Check for hex
  if (color.startsWith('#')) {
    return hexToRgb(color);
  }

  // Check for rgb/rgba
  const rgbMatch = color.match(
    /rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/
  );
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1]),
      g: parseInt(rgbMatch[2]),
      b: parseInt(rgbMatch[3]),
      a: rgbMatch[4] ? parseFloat(rgbMatch[4]) : 1,
    };
  }

  // Check for hsl/hsla
  const hslMatch = color.match(
    /hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*([\d.]+))?\s*\)/
  );
  if (hslMatch) {
    const hsl: HSLColor = {
      h: parseInt(hslMatch[1]),
      s: parseInt(hslMatch[2]),
      l: parseInt(hslMatch[3]),
      a: hslMatch[4] ? parseFloat(hslMatch[4]) : 1,
    };
    return hslToRgb(hsl);
  }

  return null;
}

/**
 * Get complete color value object
 */
export function getColorValue(input: string | RGBColor): ColorValue | null {
  let rgb: RGBColor | null = null;

  if (typeof input === 'string') {
    rgb = parseColor(input);
  } else {
    rgb = input;
  }

  if (!rgb) return null;

  const hex = rgbToHex(rgb);
  const hsl = rgbToHsl(rgb);
  const hsv = rgbToHsv(rgb);
  const cmyk = rgbToCmyk(rgb);
  const lab = rgbToLab(rgb);

  // Check for named color
  let name: string | undefined;
  for (const [colorName, colorHex] of Object.entries(CSS_NAMED_COLORS)) {
    if (colorHex.toUpperCase() === hex.substring(0, 7)) {
      name = colorName;
      break;
    }
  }

  return {
    hex,
    rgb,
    hsl,
    hsv,
    cmyk,
    lab,
    name,
  };
}

/**
 * Generate color harmony palette
 */
export function generateHarmony(
  baseColor: ColorValue,
  type: HarmonyType,
  customAngles?: number[]
): ColorValue[] {
  const hsl = baseColor.hsl;
  const colors: ColorValue[] = [baseColor];

  switch (type) {
    case 'complementary':
      // 180° opposite
      colors.push(
        getColorValue(
          hslToRgb({
            h: (hsl.h + 180) % 360,
            s: hsl.s,
            l: hsl.l,
          })
        )!
      );
      break;

    case 'triadic':
      // 120° apart
      colors.push(
        getColorValue(
          hslToRgb({
            h: (hsl.h + 120) % 360,
            s: hsl.s,
            l: hsl.l,
          })
        )!
      );
      colors.push(
        getColorValue(
          hslToRgb({
            h: (hsl.h + 240) % 360,
            s: hsl.s,
            l: hsl.l,
          })
        )!
      );
      break;

    case 'analogous':
      // 30° adjacent
      colors.push(
        getColorValue(
          hslToRgb({
            h: (hsl.h + 30) % 360,
            s: hsl.s,
            l: hsl.l,
          })
        )!
      );
      colors.push(
        getColorValue(
          hslToRgb({
            h: (hsl.h - 30 + 360) % 360,
            s: hsl.s,
            l: hsl.l,
          })
        )!
      );
      break;

    case 'split-complementary':
      // 150° and 210°
      colors.push(
        getColorValue(
          hslToRgb({
            h: (hsl.h + 150) % 360,
            s: hsl.s,
            l: hsl.l,
          })
        )!
      );
      colors.push(
        getColorValue(
          hslToRgb({
            h: (hsl.h + 210) % 360,
            s: hsl.s,
            l: hsl.l,
          })
        )!
      );
      break;

    case 'tetradic':
      // 90° apart (square)
      colors.push(
        getColorValue(
          hslToRgb({
            h: (hsl.h + 90) % 360,
            s: hsl.s,
            l: hsl.l,
          })
        )!
      );
      colors.push(
        getColorValue(
          hslToRgb({
            h: (hsl.h + 180) % 360,
            s: hsl.s,
            l: hsl.l,
          })
        )!
      );
      colors.push(
        getColorValue(
          hslToRgb({
            h: (hsl.h + 270) % 360,
            s: hsl.s,
            l: hsl.l,
          })
        )!
      );
      break;

    case 'monochromatic':
      // Variations in lightness
      const lightness = [20, 35, 50, 65, 80];
      for (const l of lightness) {
        if (l !== hsl.l) {
          colors.push(
            getColorValue(
              hslToRgb({
                h: hsl.h,
                s: hsl.s,
                l,
              })
            )!
          );
        }
      }
      break;

    case 'custom':
      // Use custom angles
      if (customAngles) {
        for (const angle of customAngles) {
          colors.push(
            getColorValue(
              hslToRgb({
                h: (hsl.h + angle) % 360,
                s: hsl.s,
                l: hsl.l,
              })
            )!
          );
        }
      }
      break;
  }

  return colors;
}

/**
 * Calculate relative luminance for WCAG contrast
 */
export function getRelativeLuminance(rgb: RGBColor): number {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate WCAG contrast ratio
 */
export function getContrastRatio(
  foreground: RGBColor,
  background: RGBColor
): number {
  const l1 = getRelativeLuminance(foreground);
  const l2 = getRelativeLuminance(background);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check WCAG contrast compliance
 */
export function checkWCAGCompliance(
  foreground: RGBColor,
  background: RGBColor
): ContrastResult {
  const ratio = getContrastRatio(foreground, background);

  return {
    ratio: Math.round(ratio * 100) / 100,
    AA: {
      normal: ratio >= 4.5,
      large: ratio >= 3,
      graphics: ratio >= 3,
    },
    AAA: {
      normal: ratio >= 7,
      large: ratio >= 4.5,
    },
  };
}

/**
 * Simulate color blindness
 */
export function simulateColorBlindness(
  rgb: RGBColor,
  type: ColorBlindnessType
): RGBColor {
  if (type === 'normal') return rgb;

  // Color blindness simulation matrices
  const matrices: Record<ColorBlindnessType, number[][]> = {
    normal: [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ],
    protanopia: [
      [0.567, 0.433, 0],
      [0.558, 0.442, 0],
      [0, 0.242, 0.758],
    ],
    protanomaly: [
      [0.817, 0.183, 0],
      [0.333, 0.667, 0],
      [0, 0.125, 0.875],
    ],
    deuteranopia: [
      [0.625, 0.375, 0],
      [0.7, 0.3, 0],
      [0, 0.3, 0.7],
    ],
    deuteranomaly: [
      [0.8, 0.2, 0],
      [0.258, 0.742, 0],
      [0, 0.142, 0.858],
    ],
    tritanopia: [
      [0.95, 0.05, 0],
      [0, 0.433, 0.567],
      [0, 0.475, 0.525],
    ],
    tritanomaly: [
      [0.967, 0.033, 0],
      [0, 0.733, 0.267],
      [0, 0.183, 0.817],
    ],
    achromatopsia: [
      [0.299, 0.587, 0.114],
      [0.299, 0.587, 0.114],
      [0.299, 0.587, 0.114],
    ],
    achromatomaly: [
      [0.618, 0.32, 0.062],
      [0.163, 0.775, 0.062],
      [0.163, 0.32, 0.516],
    ],
  };

  const matrix = matrices[type];
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const newR = matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b;
  const newG = matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b;
  const newB = matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b;

  return {
    r: Math.round(Math.max(0, Math.min(255, newR * 255))),
    g: Math.round(Math.max(0, Math.min(255, newG * 255))),
    b: Math.round(Math.max(0, Math.min(255, newB * 255))),
    a: rgb.a,
  };
}

/**
 * Generate tints (add white)
 */
export function generateTints(
  baseColor: ColorValue,
  steps: number = 5
): ColorValue[] {
  const colors: ColorValue[] = [];
  const rgb = baseColor.rgb;

  for (let i = 1; i <= steps; i++) {
    const factor = i / (steps + 1);
    const tint: RGBColor = {
      r: Math.round(rgb.r + (255 - rgb.r) * factor),
      g: Math.round(rgb.g + (255 - rgb.g) * factor),
      b: Math.round(rgb.b + (255 - rgb.b) * factor),
      a: rgb.a,
    };
    colors.push(getColorValue(tint)!);
  }

  return colors;
}

/**
 * Generate shades (add black)
 */
export function generateShades(
  baseColor: ColorValue,
  steps: number = 5
): ColorValue[] {
  const colors: ColorValue[] = [];
  const rgb = baseColor.rgb;

  for (let i = 1; i <= steps; i++) {
    const factor = 1 - i / (steps + 1);
    const shade: RGBColor = {
      r: Math.round(rgb.r * factor),
      g: Math.round(rgb.g * factor),
      b: Math.round(rgb.b * factor),
      a: rgb.a,
    };
    colors.push(getColorValue(shade)!);
  }

  return colors;
}

/**
 * Mix two colors
 */
export function mixColors(
  color1: ColorValue,
  color2: ColorValue,
  ratio: number = 0.5
): ColorValue {
  const rgb1 = color1.rgb;
  const rgb2 = color2.rgb;

  const mixed: RGBColor = {
    r: Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio),
    g: Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio),
    b: Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio),
    a:
      rgb1.a !== undefined && rgb2.a !== undefined
        ? rgb1.a * (1 - ratio) + rgb2.a * ratio
        : 1,
  };

  return getColorValue(mixed)!;
}

/**
 * Adjust color temperature (warm/cool)
 */
export function adjustTemperature(
  color: ColorValue,
  adjustment: number // -100 to 100
): ColorValue {
  const rgb = color.rgb;
  const factor = adjustment / 100;

  const adjusted: RGBColor = {
    r: Math.round(Math.max(0, Math.min(255, rgb.r + factor * 30))),
    g: Math.round(Math.max(0, Math.min(255, rgb.g))),
    b: Math.round(Math.max(0, Math.min(255, rgb.b - factor * 30))),
    a: rgb.a,
  };

  return getColorValue(adjusted)!;
}

/**
 * Export color as CSS
 */
export function exportAsCSS(color: ColorValue, format: string = 'hex'): string {
  switch (format) {
    case 'hex':
      return color.hex;
    case 'rgb':
      const { r, g, b, a } = color.rgb;
      return a && a < 1
        ? `rgba(${r}, ${g}, ${b}, ${a})`
        : `rgb(${r}, ${g}, ${b})`;
    case 'hsl':
      const { h, s, l } = color.hsl;
      return color.hsl.a && color.hsl.a < 1
        ? `hsla(${h}, ${s}%, ${l}%, ${color.hsl.a})`
        : `hsl(${h}, ${s}%, ${l}%)`;
    case 'css-variable':
      return `--color-primary: ${color.hex};`;
    case 'scss':
      return `$primary-color: ${color.hex};`;
    default:
      return color.hex;
  }
}

/**
 * Export palette as various formats
 */
export function exportPalette(
  colors: ColorValue[],
  format: 'json' | 'css' | 'scss' | 'tailwind' | 'js' | 'android' | 'ios'
): string {
  switch (format) {
    case 'json':
      return JSON.stringify(
        colors.map((c) => ({
          hex: c.hex,
          rgb: c.rgb,
          hsl: c.hsl,
          name: c.name,
        })),
        null,
        2
      );

    case 'css':
      return `:root {\n${colors
        .map((c, i) => `  --color-${i + 1}: ${c.hex};`)
        .join('\n')}\n}`;

    case 'scss':
      return colors.map((c, i) => `$color-${i + 1}: ${c.hex};`).join('\n');

    case 'tailwind':
      return `module.exports = {\n  colors: {\n${colors
        .map((c, i) => `    'custom-${i + 1}': '${c.hex}',`)
        .join('\n')}\n  }\n}`;

    case 'js':
      return `export const colors = {\n${colors
        .map((c, i) => `  color${i + 1}: '${c.hex}',`)
        .join('\n')}\n};`;

    case 'android':
      return `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n${colors
        .map((c, i) => `  <color name="color_${i + 1}">${c.hex}</color>`)
        .join('\n')}\n</resources>`;

    case 'ios':
      return colors
        .map((c, i) => {
          const { r, g, b, a = 1 } = c.rgb;
          return `static let color${i + 1} = UIColor(red: ${(r / 255).toFixed(
            3
          )}, green: ${(g / 255).toFixed(3)}, blue: ${(b / 255).toFixed(
            3
          )}, alpha: ${a.toFixed(3)})`;
        })
        .join('\n');

    default:
      return '';
  }
}

/**
 * Get Tailwind equivalent color
 */
export function getTailwindColor(color: ColorValue): string | null {
  // Tailwind color palette mapping (simplified)
  const tailwindColors: Record<string, string> = {
    '#ef4444': 'red-500',
    '#f87171': 'red-400',
    '#dc2626': 'red-600',
    '#3b82f6': 'blue-500',
    '#60a5fa': 'blue-400',
    '#2563eb': 'blue-600',
    '#10b981': 'green-500',
    '#34d399': 'green-400',
    '#059669': 'green-600',
    '#f59e0b': 'yellow-500',
    '#fbbf24': 'yellow-400',
    '#d97706': 'yellow-600',
    '#8b5cf6': 'purple-500',
    '#a78bfa': 'purple-400',
    '#7c3aed': 'purple-600',
    '#ec4899': 'pink-500',
    '#f472b6': 'pink-400',
    '#db2777': 'pink-600',
    '#6b7280': 'gray-500',
    '#9ca3af': 'gray-400',
    '#4b5563': 'gray-600',
  };

  const hex = color.hex.toLowerCase();
  return tailwindColors[hex] || null;
}

/**
 * Get Material Design color
 */
export function getMaterialColor(color: ColorValue): string | null {
  // Material Design color palette mapping (simplified)
  const materialColors: Record<string, string> = {
    '#f44336': 'red',
    '#e91e63': 'pink',
    '#9c27b0': 'purple',
    '#673ab7': 'deep-purple',
    '#3f51b5': 'indigo',
    '#2196f3': 'blue',
    '#03a9f4': 'light-blue',
    '#00bcd4': 'cyan',
    '#009688': 'teal',
    '#4caf50': 'green',
    '#8bc34a': 'light-green',
    '#cddc39': 'lime',
    '#ffeb3b': 'yellow',
    '#ffc107': 'amber',
    '#ff9800': 'orange',
    '#ff5722': 'deep-orange',
    '#795548': 'brown',
    '#9e9e9e': 'grey',
    '#607d8b': 'blue-grey',
  };

  const hex = color.hex.toLowerCase();
  return materialColors[hex] || null;
}

/**
 * Calculate color distance (Delta E)
 */
export function getColorDistance(
  color1: ColorValue,
  color2: ColorValue
): number {
  const lab1 = color1.lab;
  const lab2 = color2.lab;

  const deltaL = lab1.l - lab2.l;
  const deltaA = lab1.a - lab2.a;
  const deltaB = lab1.b - lab2.b;

  return Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB);
}

/**
 * Find closest named color
 */
export function getClosestNamedColor(color: ColorValue): string {
  let closestName = '';
  let minDistance = Infinity;

  for (const [name, hex] of Object.entries(CSS_NAMED_COLORS)) {
    const namedColor = getColorValue(hex)!;
    const distance = getColorDistance(color, namedColor);

    if (distance < minDistance) {
      minDistance = distance;
      closestName = name;
    }
  }

  return closestName;
}

/**
 * Generate gradient CSS
 */
export function generateGradient(
  colors: ColorValue[],
  type: 'linear' | 'radial' = 'linear',
  angle: number = 90
): string {
  const colorStops = colors.map((c) => c.hex).join(', ');

  if (type === 'linear') {
    return `linear-gradient(${angle}deg, ${colorStops})`;
  } else {
    return `radial-gradient(circle, ${colorStops})`;
  }
}

/**
 * Extract colors from image (simplified - would need Canvas API in browser)
 */
export async function extractColorsFromImage(
  imageData: ImageData,
  count: number = 5
): Promise<ColorValue[]> {
  // This is a simplified version - actual implementation would use
  // quantization algorithms like median cut or k-means clustering
  const pixels = imageData.data;
  const colorMap = new Map<string, number>();

  // Sample every 10th pixel for performance
  for (let i = 0; i < pixels.length; i += 40) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];

    if (a > 128) {
      // Ignore mostly transparent pixels
      const key = `${r},${g},${b}`;
      colorMap.set(key, (colorMap.get(key) || 0) + 1);
    }
  }

  // Sort by frequency and return top colors
  const sorted = Array.from(colorMap.entries()).sort((a, b) => b[1] - a[1]);

  return sorted.slice(0, count).map((entry) => {
    const [r, g, b] = entry[0].split(',').map(Number);
    return getColorValue({ r, g, b })!;
  });
}

/**
 * Validate color string
 */
export function isValidColor(color: string): boolean {
  return parseColor(color) !== null;
}

/**
 * Get color description in words
 */
export function getColorDescription(color: ColorValue): string {
  const { h, s, l } = color.hsl;

  let hue = '';
  if (h >= 0 && h < 20) hue = 'red';
  else if (h >= 20 && h < 45) hue = 'orange';
  else if (h >= 45 && h < 65) hue = 'yellow';
  else if (h >= 65 && h < 150) hue = 'green';
  else if (h >= 150 && h < 250) hue = 'blue';
  else if (h >= 250 && h < 330) hue = 'purple';
  else hue = 'red';

  let saturation = '';
  if (s < 10) saturation = 'gray';
  else if (s < 30) saturation = 'muted';
  else if (s < 70) saturation = '';
  else saturation = 'vibrant';

  let lightness = '';
  if (l < 20) lightness = 'very dark';
  else if (l < 40) lightness = 'dark';
  else if (l < 60) lightness = '';
  else if (l < 80) lightness = 'light';
  else lightness = 'very light';

  const parts = [lightness, saturation, hue].filter(Boolean);
  return parts.join(' ') || hue;
}
