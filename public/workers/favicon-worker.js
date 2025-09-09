// Favicon Generation Web Worker
// This worker handles heavy image processing tasks

class FaviconWorker {
  constructor() {
    this.canvas = new OffscreenCanvas(512, 512);
    this.ctx = this.canvas.getContext('2d');
  }

  // Convert data URL to Blob without using fetch (CSP-safe)
  async dataURLToBlob(dataURL) {
    // Extract the base64 data from the data URL
    const base64 = dataURL.split(',')[1];
    const mimeType = dataURL.match(/data:([^;]+)/)[1];

    // Convert base64 to binary
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Create and return the blob
    return new Blob([bytes], { type: mimeType });
  }

  // Create a multi-size ICO file
  async createMultiSizeIco(sourceImage, options) {
    const sizes = [16, 32, 48];
    const pngBlobs = [];

    // Generate PNG for each size
    for (const size of sizes) {
      const canvas = await this.createProcessedCanvas(
        sourceImage,
        size,
        options
      );
      const blob = await canvas.convertToBlob({
        type: 'image/png',
        quality: options.compressionQuality / 100,
      });
      const arrayBuffer = await blob.arrayBuffer();
      pngBlobs.push(new Uint8Array(arrayBuffer));
    }

    // Create ICO file structure
    const icoData = this.createIcoFromPngs(pngBlobs);
    return new Blob([icoData], { type: 'image/x-icon' });
  }

  // Create ICO file from multiple PNG images
  createIcoFromPngs(pngArrays) {
    const numImages = pngArrays.length;

    // ICO Header (6 bytes)
    const header = new Uint8Array(6);
    header[0] = 0; // Reserved
    header[1] = 0; // Reserved
    header[2] = 1; // Image type (1 = ICO)
    header[3] = 0; // Image type high byte
    header[4] = numImages; // Number of images
    header[5] = 0; // Number of images high byte

    // Calculate offsets
    const headerSize = 6;
    const directorySize = 16 * numImages;
    let currentOffset = headerSize + directorySize;

    // Create directory entries
    const directory = new Uint8Array(directorySize);
    const imageSizes = [16, 32, 48];

    for (let i = 0; i < numImages; i++) {
      const dirOffset = i * 16;
      const size = imageSizes[i];

      directory[dirOffset + 0] = size === 256 ? 0 : size; // Width
      directory[dirOffset + 1] = size === 256 ? 0 : size; // Height
      directory[dirOffset + 2] = 0; // Color palette
      directory[dirOffset + 3] = 0; // Reserved
      directory[dirOffset + 4] = 1; // Color planes
      directory[dirOffset + 5] = 0; // Color planes high byte
      directory[dirOffset + 6] = 32; // Bits per pixel
      directory[dirOffset + 7] = 0; // Bits per pixel high byte

      // Image size (4 bytes, little-endian)
      const imageSize = pngArrays[i].length;
      directory[dirOffset + 8] = imageSize & 0xff;
      directory[dirOffset + 9] = (imageSize >> 8) & 0xff;
      directory[dirOffset + 10] = (imageSize >> 16) & 0xff;
      directory[dirOffset + 11] = (imageSize >> 24) & 0xff;

      // Image offset (4 bytes, little-endian)
      directory[dirOffset + 12] = currentOffset & 0xff;
      directory[dirOffset + 13] = (currentOffset >> 8) & 0xff;
      directory[dirOffset + 14] = (currentOffset >> 16) & 0xff;
      directory[dirOffset + 15] = (currentOffset >> 24) & 0xff;

      currentOffset += imageSize;
    }

    // Combine all parts
    const totalSize =
      headerSize +
      directorySize +
      pngArrays.reduce((sum, arr) => sum + arr.length, 0);
    const icoFile = new Uint8Array(totalSize);

    let offset = 0;

    // Write header
    icoFile.set(header, offset);
    offset += headerSize;

    // Write directory
    icoFile.set(directory, offset);
    offset += directorySize;

    // Write PNG data
    for (const pngData of pngArrays) {
      icoFile.set(pngData, offset);
      offset += pngData.length;
    }

    return icoFile;
  }

  async processImage(imageData, sizes, options) {
    const results = [];

    // Convert data URL to blob without using fetch
    const blob = await this.dataURLToBlob(imageData);

    // Create image bitmap from blob
    const imageBitmap = await createImageBitmap(blob);

    for (const sizeConfig of sizes) {
      try {
        // Special handling for ICO format - create multiple sizes
        if (sizeConfig.format === 'ico') {
          const icoBlob = await this.createMultiSizeIco(imageBitmap, options);
          results.push({
            name: sizeConfig.name,
            filename: sizeConfig.filename,
            blob: icoBlob,
            size: icoBlob.size,
            format: sizeConfig.format,
            dimensions: '16x16, 32x32, 48x48',
            description: sizeConfig.description,
          });
        } else {
          let processedCanvas;

          // Special handling for SVG format - create monochrome version from original
          if (sizeConfig.format === 'svg') {
            processedCanvas = await this.createMonochromeCanvas(
              imageBitmap,
              sizeConfig.width,
              options
            );
          } else {
            processedCanvas = await this.createProcessedCanvas(
              imageBitmap,
              sizeConfig.width,
              options
            );
          }

          const blob = await this.canvasToBlob(
            processedCanvas,
            sizeConfig.format,
            options.compressionQuality / 100
          );

          results.push({
            name: sizeConfig.name,
            filename: sizeConfig.filename,
            blob: blob,
            size: blob.size,
            format: sizeConfig.format,
            dimensions: `${sizeConfig.width}x${sizeConfig.height}`,
            description: sizeConfig.description,
          });
        }
      } catch (error) {
        console.error(`Failed to process ${sizeConfig.name}:`, error);
      }
    }

    return results;
  }

  // Special method for small icons with better quality
  async createSmallIconCanvas(sourceImage, targetSize, options) {
    // First create a larger intermediate canvas for better quality
    const intermediateSize = 128;
    const tempCanvas = new OffscreenCanvas(intermediateSize, intermediateSize);
    const tempCtx = tempCanvas.getContext('2d');

    // Enable high quality rendering
    tempCtx.imageSmoothingEnabled = true;
    tempCtx.imageSmoothingQuality = 'high';

    // Apply background to intermediate canvas
    if (options.backgroundType !== 'transparent') {
      if (options.backgroundType === 'solid') {
        tempCtx.fillStyle = options.backgroundColor;
        tempCtx.fillRect(0, 0, intermediateSize, intermediateSize);
      } else if (options.backgroundType === 'gradient') {
        const gradient = tempCtx.createLinearGradient(
          0,
          0,
          intermediateSize,
          intermediateSize
        );
        gradient.addColorStop(0, options.gradientStart || '#6366f1');
        gradient.addColorStop(1, options.gradientEnd || '#8b5cf6');
        tempCtx.fillStyle = gradient;
        tempCtx.fillRect(0, 0, intermediateSize, intermediateSize);
      }
    }

    // Draw source image to intermediate canvas
    const padding = options.padding || 0;
    const scaledPadding = (padding / 100) * intermediateSize;
    const imageSize = intermediateSize - scaledPadding * 2;
    tempCtx.drawImage(
      sourceImage,
      scaledPadding,
      scaledPadding,
      imageSize,
      imageSize
    );

    // Now create the final small canvas
    const finalCanvas = new OffscreenCanvas(targetSize, targetSize);
    const finalCtx = finalCanvas.getContext('2d');

    // Use bicubic interpolation for the final downscale
    finalCtx.imageSmoothingEnabled = true;
    finalCtx.imageSmoothingQuality = 'high';

    // Draw the intermediate canvas to the final size
    finalCtx.drawImage(
      tempCanvas,
      0,
      0,
      intermediateSize,
      intermediateSize,
      0,
      0,
      targetSize,
      targetSize
    );

    // Apply slight sharpening for very small icons
    if (targetSize === 16) {
      this.applySharpening(finalCtx, targetSize);
    }

    return finalCanvas;
  }

  // Apply subtle sharpening to improve clarity of very small icons
  applySharpening(ctx, size) {
    const imageData = ctx.getImageData(0, 0, size, size);
    const data = imageData.data;
    const output = new Uint8ClampedArray(data);

    // Simple unsharp mask
    const amount = 0.3;

    for (let y = 1; y < size - 1; y++) {
      for (let x = 1; x < size - 1; x++) {
        const idx = (y * size + x) * 4;

        for (let c = 0; c < 3; c++) {
          const center = data[idx + c];

          // Get neighboring pixels
          const top = data[((y - 1) * size + x) * 4 + c];
          const bottom = data[((y + 1) * size + x) * 4 + c];
          const left = data[(y * size + (x - 1)) * 4 + c];
          const right = data[(y * size + (x + 1)) * 4 + c];

          // Calculate sharpened value
          const neighbors = (top + bottom + left + right) / 4;
          const diff = center - neighbors;
          output[idx + c] = Math.min(255, Math.max(0, center + diff * amount));
        }

        // Keep alpha unchanged
        output[idx + 3] = data[idx + 3];
      }
    }

    ctx.putImageData(new ImageData(output, size, size), 0, 0);
  }

  // Create monochrome canvas specifically for Safari pinned tab
  async createMonochromeCanvas(sourceImage, size, options) {
    const canvas = new OffscreenCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Enable high quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Clear canvas (transparent background for SVG)
    ctx.clearRect(0, 0, size, size);

    // Calculate image dimensions with minimal padding for better silhouette
    const padding = Math.min(options.padding || 0, 5); // Limit padding for SVG
    const imageSize = size - padding * 2;
    const imageX = padding;
    const imageY = padding;

    // Draw the original image
    ctx.drawImage(sourceImage, imageX, imageY, imageSize, imageSize);

    // Convert to monochrome silhouette
    const imageData = ctx.getImageData(0, 0, size, size);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // Calculate luminance
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

      // Create silhouette: if pixel is visible and not too bright, make it black
      if (a > 50) {
        // If pixel has some opacity
        if (luminance < 220) {
          // If pixel is not too bright/white
          data[i] = data[i + 1] = data[i + 2] = 0; // Black
          data[i + 3] = 255; // Fully opaque
        } else {
          data[i + 3] = 0; // Make white/bright pixels transparent
        }
      } else {
        data[i + 3] = 0; // Keep transparent pixels transparent
      }
    }

    // Apply the monochrome transformation
    ctx.putImageData(imageData, 0, 0);

    return canvas;
  }

  async createProcessedCanvas(sourceImage, size, options) {
    // For very small sizes, use a different approach
    if (size <= 32) {
      return this.createSmallIconCanvas(sourceImage, size, options);
    }

    this.canvas.width = size;
    this.canvas.height = size;

    // Enable image smoothing for better quality
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';

    // Clear canvas
    this.ctx.clearRect(0, 0, size, size);

    // Apply background
    if (options.backgroundType !== 'transparent') {
      if (options.backgroundType === 'solid') {
        this.ctx.fillStyle = options.backgroundColor;
        this.ctx.fillRect(0, 0, size, size);
      } else if (options.backgroundType === 'gradient') {
        const gradient = this.ctx.createLinearGradient(0, 0, size, size);
        gradient.addColorStop(0, options.gradientStart || '#6366f1');
        gradient.addColorStop(1, options.gradientEnd || '#8b5cf6');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, size, size);
      }
    }

    // Apply border radius if needed
    if (options.borderRadius > 0) {
      const radius = Math.min(options.borderRadius, size / 2);
      this.ctx.beginPath();
      this.ctx.roundRect(0, 0, size, size, radius);
      this.ctx.clip();
    }

    // Calculate image dimensions with padding
    const padding = options.padding || 0;
    const imageSize = size - padding * 2;
    const imageX = padding;
    const imageY = padding;

    // Draw the image with better quality
    this.ctx.drawImage(sourceImage, imageX, imageY, imageSize, imageSize);

    return this.canvas;
  }

  async canvasToBlob(canvas, format, quality = 0.85) {
    // For SVG format, we need to generate actual SVG content
    if (format === 'svg') {
      // Temporarily set the context to the passed canvas for SVG generation
      const originalCanvas = this.canvas;
      const originalCtx = this.ctx;
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');

      const svgContent = this.canvasToSvg(canvas.width);

      // Restore original canvas
      this.canvas = originalCanvas;
      this.ctx = originalCtx;

      return new Blob([svgContent], { type: 'image/svg+xml' });
    }

    const mimeType = format === 'ico' ? 'image/png' : `image/${format}`;

    return await canvas.convertToBlob({
      type: mimeType,
      quality: quality,
    });
  }

  async createTextFavicon(text, size, textOptions) {
    this.canvas.width = size;
    this.canvas.height = size;

    const {
      fontFamily = 'Arial, sans-serif',
      textColor = '#ffffff',
      backgroundColor = '#6366f1',
      fontSize = size * 0.6,
    } = textOptions;

    // Fill background
    this.ctx.fillStyle = backgroundColor;
    this.ctx.fillRect(0, 0, size, size);

    // Set font
    this.ctx.font = `bold ${fontSize}px ${fontFamily}`;
    this.ctx.fillStyle = textColor;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    // Draw text
    this.ctx.fillText(text.toUpperCase(), size / 2, size / 2);

    return await this.canvas.convertToBlob({ type: 'image/png' });
  }

  async createEmojiFavicon(emoji, size) {
    this.canvas.width = size;
    this.canvas.height = size;

    // Clear canvas with transparent background
    this.ctx.clearRect(0, 0, size, size);

    // Set font size to fill most of the canvas
    const fontSize = size * 0.8;
    this.ctx.font = `${fontSize}px system-ui, -apple-system, sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    // Draw emoji
    this.ctx.fillText(emoji, size / 2, size / 2);

    return await this.canvas.convertToBlob({ type: 'image/png' });
  }

  canvasToSvg(size) {
    // Get image data from the already processed monochrome canvas
    const imageData = this.ctx.getImageData(0, 0, size, size);
    const data = imageData.data;

    // Optimize SVG path generation using run-length encoding
    const paths = [];
    const visited = new Set();

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const key = `${x},${y}`;
        if (visited.has(key)) continue;

        const i = (y * size + x) * 4;
        if (data[i + 3] > 128) {
          // If pixel is black
          // Find horizontal run length
          let width = 1;
          while (x + width < size) {
            const nextI = (y * size + (x + width)) * 4;
            if (data[nextI + 3] > 128) {
              visited.add(`${x + width},${y}`);
              width++;
            } else {
              break;
            }
          }

          // Create optimized rectangle for the run
          if (width > 1) {
            paths.push(`M${x},${y}h${width}v1h-${width}z`);
          } else {
            paths.push(`M${x},${y}h1v1h-1z`);
          }

          visited.add(key);
        }
      }
    }

    // Generate optimized SVG
    const path = paths.join('');

    return `<svg xmlns="https://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <path fill="#000000" d="${path}"/>
</svg>`;
  }
}

const worker = new FaviconWorker();

self.onmessage = async function (e) {
  const { type, data } = e.data;

  try {
    switch (type) {
      case 'PROCESS_IMAGE':
        const result = await worker.processImage(
          data.imageData,
          data.sizes,
          data.options
        );
        self.postMessage({ type: 'PROCESS_COMPLETE', data: result });
        break;

      case 'CREATE_TEXT_FAVICON':
        const textBlob = await worker.createTextFavicon(
          data.text,
          data.size,
          data.options
        );
        self.postMessage({
          type: 'TEXT_FAVICON_COMPLETE',
          data: { blob: textBlob, size: data.size },
        });
        break;

      case 'CREATE_EMOJI_FAVICON':
        const emojiBlob = await worker.createEmojiFavicon(
          data.emoji,
          data.size
        );
        self.postMessage({
          type: 'EMOJI_FAVICON_COMPLETE',
          data: { blob: emojiBlob, size: data.size },
        });
        break;

      default:
        throw new Error(`Unknown message type: ${type}`);
    }
  } catch (error) {
    self.postMessage({
      type: 'ERROR',
      error: error.message,
    });
  }
};
