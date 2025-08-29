export interface FaviconOptions {
  padding: number;
  borderRadius: number;
  backgroundColor: string;
  backgroundType: 'transparent' | 'solid' | 'gradient';
  gradientStart?: string;
  gradientEnd?: string;
  themeColor: string;
  compressionQuality: number;
  generateMonochrome: boolean;
}

export interface FaviconSize {
  name: string;
  width: number;
  height: number;
  format: 'png' | 'ico' | 'svg';
  description: string;
  filename: string;
}

export interface GeneratedFavicon {
  name: string;
  filename: string;
  blob: Blob;
  dataUrl: string;
  size: number;
  format: string;
  dimensions: string;
  description: string;
}

export interface FaviconPackage {
  favicons: GeneratedFavicon[];
  manifest: string;
  browserconfig: string;
  htmlCode: string;
  totalSize: number;
}

export const FAVICON_SIZES: FaviconSize[] = [
  {
    name: 'ICO Multi-size',
    width: 32,
    height: 32,
    format: 'ico',
    description: 'Classic favicon for browsers (contains 16x16, 32x32, 48x48)',
    filename: 'favicon.ico',
  },
  {
    name: 'Favicon 16x16',
    width: 16,
    height: 16,
    format: 'png',
    description: 'Small favicon for browser tabs',
    filename: 'favicon-16x16.png',
  },
  {
    name: 'Favicon 32x32',
    width: 32,
    height: 32,
    format: 'png',
    description: 'Standard favicon size',
    filename: 'favicon-32x32.png',
  },
  {
    name: 'Apple Touch Icon',
    width: 180,
    height: 180,
    format: 'png',
    description: 'iOS home screen icon',
    filename: 'apple-touch-icon.png',
  },
  {
    name: 'Apple Touch Icon 152x152',
    width: 152,
    height: 152,
    format: 'png',
    description: 'iPad home screen icon',
    filename: 'apple-touch-icon-152x152.png',
  },
  {
    name: 'Android Chrome 192x192',
    width: 192,
    height: 192,
    format: 'png',
    description: 'Android home screen icon',
    filename: 'android-chrome-192x192.png',
  },
  {
    name: 'Android Chrome 512x512',
    width: 512,
    height: 512,
    format: 'png',
    description: 'High-res Android icon for splash screens',
    filename: 'android-chrome-512x512.png',
  },
  {
    name: 'MS Tile',
    width: 150,
    height: 150,
    format: 'png',
    description: 'Windows tile icon',
    filename: 'mstile-150x150.png',
  },
  {
    name: 'Safari Pinned Tab',
    width: 512,
    height: 512,
    format: 'svg',
    description: 'Monochrome vector icon for Safari pinned tabs',
    filename: 'safari-pinned-tab.svg',
  },
];

export const DEFAULT_FAVICON_OPTIONS: FaviconOptions = {
  padding: 10,
  borderRadius: 0,
  backgroundColor: '#ffffff',
  backgroundType: 'transparent',
  gradientStart: '#6366f1',
  gradientEnd: '#8b5cf6',
  themeColor: '#ffffff',
  compressionQuality: 85,
  generateMonochrome: true,
};

/**
 * Generate a canvas with the processed image based on options
 */
export function createProcessedCanvas(
  sourceImage: HTMLImageElement,
  size: number,
  options: FaviconOptions
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  canvas.width = size;
  canvas.height = size;

  // Apply background
  if (options.backgroundType !== 'transparent') {
    if (options.backgroundType === 'solid') {
      ctx.fillStyle = options.backgroundColor;
      ctx.fillRect(0, 0, size, size);
    } else if (options.backgroundType === 'gradient') {
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, options.gradientStart || '#6366f1');
      gradient.addColorStop(1, options.gradientEnd || '#8b5cf6');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
    }
  }

  // Apply border radius if needed
  if (options.borderRadius > 0) {
    const radius = Math.min(options.borderRadius, size / 2);
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, radius);
    ctx.clip();
  }

  // Calculate image dimensions with padding
  const padding = options.padding;
  const imageSize = size - padding * 2;
  const imageX = padding;
  const imageY = padding;

  // Draw the image
  ctx.drawImage(sourceImage, imageX, imageY, imageSize, imageSize);

  return canvas;
}

/**
 * Convert canvas to blob with specified format and quality
 */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: 'png' | 'ico' | 'svg',
  quality: number = 0.85
): Promise<Blob> {
  return new Promise((resolve) => {
    if (format === 'ico') {
      // For ICO, we'll use PNG format and handle ICO conversion later
      canvas.toBlob((blob) => resolve(blob!), 'image/png', quality);
    } else {
      const mimeType = format === 'svg' ? 'image/svg+xml' : `image/${format}`;
      canvas.toBlob((blob) => resolve(blob!), mimeType, quality);
    }
  });
}

/**
 * Create monochrome version for Safari pinned tab
 */
export function createMonochromeCanvas(
  sourceImage: HTMLImageElement,
  size: number
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  canvas.width = size;
  canvas.height = size;

  // Draw image
  ctx.drawImage(sourceImage, 0, 0, size, size);

  // Convert to monochrome
  const imageData = ctx.getImageData(0, 0, size, size);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    // Calculate luminance
    const luminance =
      0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];

    // Set to black or transparent based on luminance
    if (luminance > 128) {
      data[i] = data[i + 1] = data[i + 2] = 0; // Black
      data[i + 3] = 255; // Fully opaque
    } else {
      data[i + 3] = 0; // Transparent
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/**
 * Generate site.webmanifest content
 */
export function generateWebManifest(
  themeColor: string,
  backgroundColor: string
): string {
  return JSON.stringify(
    {
      name: 'ToolsLab',
      short_name: 'ToolsLab',
      icons: [
        {
          src: '/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
      theme_color: themeColor,
      background_color: backgroundColor,
      display: 'standalone',
      start_url: '/',
    },
    null,
    2
  );
}

/**
 * Generate browserconfig.xml for Windows tiles
 */
export function generateBrowserConfig(themeColor: string): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square150x150logo src="/mstile-150x150.png"/>
            <TileColor>${themeColor}</TileColor>
        </tile>
    </msapplication>
</browserconfig>`;
}

/**
 * Generate HTML code for favicon links
 */
export function generateHtmlCode(themeColor: string): string {
  return `<!-- Favicon -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">

<!-- Apple Touch Icons -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png">

<!-- Android Chrome Icons -->
<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png">

<!-- Safari Pinned Tab -->
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="${themeColor}">

<!-- Windows Tile -->
<meta name="msapplication-TileColor" content="${themeColor}">
<meta name="msapplication-config" content="/browserconfig.xml">

<!-- Theme Color -->
<meta name="theme-color" content="${themeColor}">

<!-- Web App Manifest -->
<link rel="manifest" href="/site.webmanifest">`;
}

/**
 * Create favicon from text/initials
 */
export function createTextFavicon(
  text: string,
  size: number,
  options: {
    fontFamily?: string;
    textColor?: string;
    backgroundColor?: string;
    fontSize?: number;
  } = {}
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  canvas.width = size;
  canvas.height = size;

  const {
    fontFamily = 'Arial, sans-serif',
    textColor = '#ffffff',
    backgroundColor = '#6366f1',
    fontSize = size * 0.6,
  } = options;

  // Fill background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, size, size);

  // Set font
  ctx.font = `bold ${fontSize}px ${fontFamily}`;
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Draw text
  ctx.fillText(text.toUpperCase(), size / 2, size / 2);

  return canvas;
}

/**
 * Create favicon from emoji
 */
export function createEmojiFavicon(
  emoji: string,
  size: number
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  canvas.width = size;
  canvas.height = size;

  // Set font size to fill most of the canvas
  const fontSize = size * 0.8;
  ctx.font = `${fontSize}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Draw emoji
  ctx.fillText(emoji, size / 2, size / 2);

  return canvas;
}

/**
 * Load image from URL
 */
export function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.crossOrigin = 'anonymous';
    img.src = url;
  });
}

/**
 * Load image from file
 */
export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Download blob as file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
