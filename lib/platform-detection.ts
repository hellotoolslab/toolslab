export type Platform = 'windows' | 'macos' | 'linux' | 'unknown';
export type Architecture = 'x64' | 'arm64' | 'unknown';

export interface PlatformInfo {
  platform: Platform;
  architecture: Architecture;
  userAgent: string;
}

export function detectPlatform(): PlatformInfo {
  if (typeof window === 'undefined') {
    return {
      platform: 'unknown',
      architecture: 'unknown',
      userAgent: '',
    };
  }

  const userAgent = window.navigator.userAgent.toLowerCase();
  const platform = window.navigator.platform?.toLowerCase() || '';

  let detectedPlatform: Platform = 'unknown';
  let detectedArchitecture: Architecture = 'unknown';

  // Detect platform
  if (userAgent.includes('win') || platform.includes('win')) {
    detectedPlatform = 'windows';
  } else if (userAgent.includes('mac') || platform.includes('mac')) {
    detectedPlatform = 'macos';
  } else if (userAgent.includes('linux') || platform.includes('linux')) {
    detectedPlatform = 'linux';
  }

  // Detect architecture
  if (userAgent.includes('arm64') || userAgent.includes('aarch64')) {
    detectedArchitecture = 'arm64';
  } else if (
    userAgent.includes('x86_64') ||
    userAgent.includes('x64') ||
    userAgent.includes('amd64')
  ) {
    detectedArchitecture = 'x64';
  } else {
    // Default to x64 for most desktop systems
    detectedArchitecture = 'x64';
  }

  // Special case for Apple Silicon Macs
  if (detectedPlatform === 'macos') {
    // Check for Apple Silicon using various methods
    const isAppleSilicon =
      userAgent.includes('arm64') ||
      (typeof window !== 'undefined' &&
        'navigator' in window &&
        'userAgentData' in navigator &&
        (navigator as any).userAgentData?.platform === 'macOS' &&
        (navigator as any).userAgentData?.architecture === 'arm');

    if (isAppleSilicon) {
      detectedArchitecture = 'arm64';
    }
  }

  return {
    platform: detectedPlatform,
    architecture: detectedArchitecture,
    userAgent,
  };
}

export function getRecommendedDownload(
  platform: PlatformInfo,
  version: string
): {
  filename: string;
  displayName: string;
  icon: string;
} | null {
  const v = version.replace('v', '');

  switch (platform.platform) {
    case 'windows':
      return {
        filename: `ToolsLab_${v}_x64-setup.exe`,
        displayName: 'Windows Installer (64-bit)',
        icon: '🪟',
      };
    case 'macos':
      if (platform.architecture === 'arm64') {
        return {
          filename: `ToolsLab_${v}_aarch64.dmg`,
          displayName: 'macOS (Apple Silicon)',
          icon: '🍎',
        };
      } else {
        return {
          filename: `ToolsLab_${v}_x64.dmg`,
          displayName: 'macOS (Intel)',
          icon: '🍎',
        };
      }
    case 'linux':
      return {
        filename: `ToolsLab_${v}_amd64.AppImage`,
        displayName: 'Linux AppImage (64-bit)',
        icon: '🐧',
      };
    default:
      return null;
  }
}

export function getAllDownloads(version: string): Array<{
  platform: string;
  filename: string;
  displayName: string;
  icon: string;
  size?: string;
}> {
  const v = version.replace('v', '');

  return [
    {
      platform: 'windows',
      filename: `ToolsLab_${v}_x64-setup.exe`,
      displayName: 'Windows Installer',
      icon: '🪟',
    },
    {
      platform: 'windows',
      filename: `ToolsLab_${v}_x64.msi`,
      displayName: 'Windows MSI',
      icon: '🪟',
    },
    {
      platform: 'macos',
      filename: `ToolsLab_${v}_aarch64.dmg`,
      displayName: 'macOS (Apple Silicon)',
      icon: '🍎',
    },
    {
      platform: 'macos',
      filename: `ToolsLab_${v}_x64.dmg`,
      displayName: 'macOS (Intel)',
      icon: '🍎',
    },
    {
      platform: 'linux',
      filename: `ToolsLab_${v}_amd64.AppImage`,
      displayName: 'Linux AppImage',
      icon: '🐧',
    },
    {
      platform: 'linux',
      filename: `ToolsLab_${v}_amd64.deb`,
      displayName: 'Linux Debian/Ubuntu',
      icon: '🐧',
    },
  ];
}
