# ToolsLab Icons

This directory contains the application icons for all supported platforms.

## Required Files

- `32x32.png` - Small icon (32x32 pixels)
- `128x128.png` - Medium icon (128x128 pixels)
- `128x128@2x.png` - High DPI medium icon (256x256 pixels)
- `icon.icns` - macOS icon bundle
- `icon.ico` - Windows icon

## Icon Guidelines

- Use the ToolsLab logo/branding
- Follow platform-specific guidelines:
  - **Windows**: Square icons with rounded corners
  - **macOS**: Rounded rectangle with proper shadows
  - **Linux**: Follows freedesktop.org standards

## Generating Icons

You can use tools like:

- [Tauri Icon Generator](https://github.com/tauri-apps/tauri/tree/dev/tooling/cli/src/interface/rust/icon.rs)
- [App Icon Generator](https://www.appicon.build/)
- [IconGenerator](https://icon.kitchen/)

## Current Status

🚧 **Placeholder icons are currently in use**

To add proper icons:

1. Create a master icon file (1024x1024 PNG)
2. Generate all required sizes
3. Replace the placeholder files
4. Update `tauri.conf.json` if needed

## Icon Sources

- Master icon: `toolslab-icon-1024.png` (to be created)
- Brand colors: Violet/Purple gradient (#8B5CF6 to #A855F7)
- Style: Modern, minimalist, developer-focused
