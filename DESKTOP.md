# ToolsLab Desktop App

Complete system for distributing ToolsLab as a native desktop application across Windows, macOS, and Linux.

## 🚀 Features

- **Multi-Platform Support**: Windows, macOS (Intel + Apple Silicon), Linux
- **Auto-Updates**: Automatic background updates with user notification
- **Offline First**: Full functionality without internet connection
- **Native Performance**: Tauri-based for optimal performance
- **Secure**: Code signing and signature verification
- **Privacy Focused**: No telemetry or tracking

## 📁 Project Structure

```
├── .github/workflows/release.yml    # Automated build & release
├── src-tauri/                       # Tauri configuration
│   ├── tauri.conf.json             # Main config with auto-updater
│   ├── Cargo.toml                  # Rust dependencies
│   ├── src/main.rs                 # Rust backend with update logic
│   └── icons/                      # App icons for all platforms
├── app/download/                    # Download page
├── app/api/download/               # Download tracking API
├── components/
│   ├── UpdateNotification.tsx      # Auto-update UI component
│   └── download/                   # Download page components
└── lib/
    ├── github-releases.ts          # GitHub API integration
    └── platform-detection.ts      # OS/architecture detection
```

## 🛠 Development

### Prerequisites

- Node.js 18+
- Rust 1.77.2+
- Platform-specific dependencies:
  - **macOS**: Xcode Command Line Tools
  - **Linux**: webkit2gtk, gtk3, libayatana-appindicator3
  - **Windows**: Visual Studio Build Tools

### Setup

```bash
# Install dependencies
npm install

# Install Tauri CLI (if not already installed)
npm install -g @tauri-apps/cli

# Development mode (runs Next.js + Tauri)
npm run tauri:dev

# Build for production
npm run tauri:build
```

### Available Scripts

```bash
# Tauri Development
npm run tauri:dev          # Start dev server with Tauri
npm run tauri:build        # Build desktop app
npm run tauri:build:debug  # Debug build
npm run tauri:build:release # Full production build

# Release Management
npm run release:patch      # Bump patch version & trigger release
npm run release:minor      # Bump minor version & trigger release
npm run release:major      # Bump major version & trigger release
```

## 🏗 Build Process

### Automated Release Workflow

1. **Trigger**: Push tag with format `v*.*.*` or manual workflow dispatch
2. **Multi-Platform Build**: Simultaneous builds on:
   - Ubuntu 22.04 (Linux x64)
   - Windows Latest (x64)
   - macOS Latest (Intel + Apple Silicon)
3. **Asset Generation**: Creates installers for all platforms
4. **Release**: Publishes to GitHub Releases with auto-generated notes
5. **Update Manifest**: Generates `latest.json` for auto-updater

### Build Artifacts

| Platform      | File                     | Description       |
| ------------- | ------------------------ | ----------------- |
| Windows       | `ToolsLab_*.exe`         | NSIS installer    |
| Windows       | `ToolsLab_*.msi`         | MSI package       |
| macOS Intel   | `ToolsLab_*_x64.dmg`     | Intel DMG         |
| macOS Silicon | `ToolsLab_*_aarch64.dmg` | Apple Silicon DMG |
| Linux         | `ToolsLab_*.AppImage`    | Portable AppImage |
| Linux         | `ToolsLab_*.deb`         | Debian package    |

## 📱 Auto-Update System

### Features

- **Background Checks**: Automatic update checking on app startup
- **User-Friendly**: Non-intrusive notifications with user control
- **Secure**: Signature verification for all updates
- **Graceful Fallback**: Continues working if update server is unavailable

### Update Flow

1. App starts → Check for updates after 5 seconds
2. If update available → Show notification toast
3. User chooses to update → Download in background
4. Download complete → Show restart prompt
5. User restarts → Update applied automatically

### Configuration

Update settings in `src-tauri/tauri.conf.json`:

```json
{
  "updater": {
    "active": true,
    "dialog": true,
    "pubkey": "...",
    "endpoints": [
      "https://github.com/user/repo/releases/latest/download/latest.json"
    ]
  }
}
```

## 🌐 Download Page

### Features

- **Automatic OS Detection**: Suggests appropriate download
- **Release Information**: Latest version with changelog
- **Download Statistics**: Track downloads per platform
- **Installation Instructions**: Step-by-step guides per OS
- **Security Information**: Code signing and verification details

### API Endpoints

#### `GET /api/download`

Download tracking and redirect service.

**Parameters:**

- `file`: Filename to download
- `version`: Release version (optional)
- `platform`: Detected platform (optional)

**Response:** Redirects to GitHub release download

**Tracking:** Logs download events for analytics

## 🔒 Security

### Code Signing

- **Windows**: Code signing certificate (configure in CI/CD)
- **macOS**: Developer ID Application certificate
- **Linux**: GPG signing (optional)

### Auto-Updater Security

- **HTTPS Only**: All update endpoints use HTTPS
- **Signature Verification**: Updates verified before installation
- **Secure Channels**: Updates only from official GitHub releases

### Privacy

- **No Telemetry**: App doesn't collect personal data
- **Offline Capable**: Full functionality without internet
- **Minimal Tracking**: Only download counts for statistics

## 📊 Analytics & Monitoring

### Download Tracking

Downloads are tracked via `/api/download` endpoint:

- Platform detection and suggestions
- Download counts per release
- Geographic distribution (IP-based)
- Referrer tracking

### Integration with Umami

```javascript
// Track desktop app downloads
umami.track('desktop-download', {
  platform: 'windows',
  version: 'v1.0.0',
  filename: 'ToolsLab_1.0.0_x64-setup.exe',
});
```

## 🚨 Troubleshooting

### Common Issues

#### Build Failures

**Rust compilation errors:**

```bash
# Clear Rust cache
rm -rf src-tauri/target
cargo clean --manifest-path src-tauri/Cargo.toml
```

**Missing system dependencies (Linux):**

```bash
sudo apt-get install -y \
  libwebkit2gtk-4.1-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev \
  libgtk-3-dev
```

#### Auto-Updater Issues

**Updates not working:**

1. Check `latest.json` is accessible
2. Verify pubkey matches signing key
3. Check network connectivity
4. Review console for error messages

**GitHub API rate limits:**

```bash
# Use authenticated requests
export GITHUB_TOKEN="your-token"
```

### Debug Mode

Enable debug logging:

```bash
# Development
RUST_LOG=debug npm run tauri:dev

# Production build with debug
npm run tauri:build:debug
```

## 🎯 Production Deployment

### Prerequisites

1. **GitHub Repository**: Setup with proper permissions
2. **Secrets Configuration**:
   - `TAURI_SIGNING_PRIVATE_KEY`: Update signing key
   - `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`: Key password
3. **Code Signing Certificates**: Platform-specific certificates

### Release Process

```bash
# 1. Update version
npm version minor

# 2. Push tag (triggers release)
git push origin --tags

# 3. Monitor GitHub Actions
# https://github.com/user/repo/actions

# 4. Verify release assets
# https://github.com/user/repo/releases
```

### Post-Release

1. **Test Downloads**: Verify all platform downloads work
2. **Update Documentation**: Update version numbers
3. **Announce Release**: Blog post, social media, etc.
4. **Monitor**: Watch for issues, download metrics

## 🔄 Maintenance

### Regular Tasks

- **Update Dependencies**: Monthly Rust/Node.js dependency updates
- **Security Patches**: Apply security updates promptly
- **Certificate Renewal**: Code signing certificates expire annually
- **Performance Monitoring**: Track app performance metrics

### Version Management

- **Semantic Versioning**: Major.Minor.Patch format
- **Release Notes**: Auto-generated from commit messages
- **Backward Compatibility**: Maintain API compatibility
- **Database Migrations**: Handle data structure changes

## 📚 Additional Resources

- [Tauri Documentation](https://tauri.app/v1/guides/)
- [GitHub Actions for Tauri](https://github.com/tauri-apps/tauri-action)
- [Code Signing Guide](https://tauri.app/v1/guides/distribution/sign-your-application)
- [Auto-Updater Setup](https://tauri.app/v1/guides/distribution/updater)

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅
