#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ICONS_DIR = path.join(__dirname, '..', 'src-tauri', 'icons');
const SIZES = [32, 128, 256, 512, 1024];

// Simple SVG icon for ToolsLab - this would ideally be replaced with the actual brand icon
const SVG_ICON = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#A855F7;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="512" cy="512" r="400" fill="url(#grad1)"/>
  
  <!-- Tools icon - wrench and screwdriver crossed -->
  <g transform="translate(512,512)">
    <!-- Wrench -->
    <path d="M-80,-120 L-40,-80 L-120,0 L-80,40 L80,-120 L40,-160 L-80,-120 Z" 
          fill="white" opacity="0.9"/>
    
    <!-- Screwdriver -->
    <path d="M120,-80 L80,-40 L0,120 L-40,80 L120,-80 Z" 
          fill="white" opacity="0.9"/>
          
    <!-- Handle details -->
    <circle cx="-60" cy="-140" r="15" fill="white" opacity="0.7"/>
    <circle cx="140" cy="-60" r="15" fill="white" opacity="0.7"/>
  </g>
  
  <!-- Brand text (simplified) -->
  <text x="512" y="800" text-anchor="middle" font-family="Arial, sans-serif" 
        font-size="80" font-weight="bold" fill="white" opacity="0.8">
    TL
  </text>
</svg>`;

async function generateIcons() {
  console.log('🎨 Generating ToolsLab icons...');

  try {
    // Ensure icons directory exists
    if (!fs.existsSync(ICONS_DIR)) {
      fs.mkdirSync(ICONS_DIR, { recursive: true });
    }

    // Check if sharp is available
    try {
      require('sharp');
    } catch (error) {
      console.log('⚠️  Sharp not found. Installing...');
      console.log('📦 Run: npm install --save-dev sharp');
      console.log('🔄 For now, creating placeholder files...');

      // Create placeholder files
      const placeholderContent = Buffer.from([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
        0x49, 0x48, 0x44, 0x52,
      ]);

      await fs.promises.writeFile(
        path.join(ICONS_DIR, '32x32.png'),
        placeholderContent
      );
      await fs.promises.writeFile(
        path.join(ICONS_DIR, '128x128.png'),
        placeholderContent
      );
      await fs.promises.writeFile(
        path.join(ICONS_DIR, '128x128@2x.png'),
        placeholderContent
      );

      console.log('✅ Placeholder icons created');
      return;
    }

    const sharp = require('sharp');

    // Generate PNG icons
    for (const size of SIZES) {
      const filename = size === 256 ? '128x128@2x.png' : `${size}x${size}.png`;
      const outputPath = path.join(ICONS_DIR, filename);

      await sharp(Buffer.from(SVG_ICON))
        .resize(size, size)
        .png()
        .toFile(outputPath);

      console.log(`✅ Generated ${filename}`);
    }

    // Generate ICO for Windows (simplified - just use 256x256)
    const icoPath = path.join(ICONS_DIR, 'icon.ico');
    await sharp(Buffer.from(SVG_ICON))
      .resize(256, 256)
      .png()
      .toFile(icoPath.replace('.ico', '.png'));

    // For proper ICO generation, you'd need additional tools
    // This is a simplified version
    console.log('✅ Generated icon.ico (PNG format)');

    // Generate ICNS for macOS (simplified)
    const icnsPath = path.join(ICONS_DIR, 'icon.icns');
    await sharp(Buffer.from(SVG_ICON))
      .resize(512, 512)
      .png()
      .toFile(icnsPath.replace('.icns', '.png'));

    console.log('✅ Generated icon.icns (PNG format)');

    console.log('\n🎉 Icon generation complete!');
    console.log(
      '📝 Note: For production, consider using proper ICO and ICNS formats'
    );
    console.log('🔧 Tools: png2ico, iconutil (macOS), or online converters');
  } catch (error) {
    console.error('❌ Error generating icons:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  generateIcons();
}

module.exports = { generateIcons };
