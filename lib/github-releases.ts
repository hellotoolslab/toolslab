export interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string;
  assets: GitHubAsset[];
  html_url: string;
  author: {
    login: string;
    avatar_url: string;
  };
}

export interface GitHubAsset {
  id: number;
  name: string;
  size: number;
  download_count: number;
  browser_download_url: string;
  created_at: string;
  updated_at: string;
  content_type: string;
}

export interface ReleaseData {
  version: string;
  name: string;
  body: string;
  publishedAt: Date;
  downloads: {
    total: number;
    assets: Array<{
      name: string;
      size: string;
      downloadCount: number;
      url: string;
    }>;
  };
  isLatest: boolean;
  isPrerelease: boolean;
}

const GITHUB_API_BASE = 'https://api.github.com';
const REPO_OWNER = 'hellotoolslab';
const REPO_NAME = 'toolslab';

// Cache releases for 5 minutes
let releasesCache: { data: GitHubRelease[]; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchGitHubReleases(): Promise<GitHubRelease[]> {
  // Check cache
  if (releasesCache && Date.now() - releasesCache.timestamp < CACHE_DURATION) {
    return releasesCache.data;
  }

  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/releases`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
        next: { revalidate: 300 }, // Next.js cache for 5 minutes
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch releases:', response.statusText);
      return [];
    }

    const releases = await response.json();

    // Update cache
    releasesCache = {
      data: releases,
      timestamp: Date.now(),
    };

    return releases;
  } catch (error) {
    console.error('Error fetching GitHub releases:', error);
    return [];
  }
}

export async function fetchLatestRelease(): Promise<GitHubRelease | null> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching latest release:', error);
    return null;
  }
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function parseReleaseData(
  release: GitHubRelease,
  isLatest: boolean = false
): ReleaseData {
  const totalDownloads = release.assets.reduce(
    (sum, asset) => sum + asset.download_count,
    0
  );

  return {
    version: release.tag_name,
    name: release.name,
    body: release.body,
    publishedAt: new Date(release.published_at),
    downloads: {
      total: totalDownloads,
      assets: release.assets
        .filter(
          (asset) =>
            // Filter relevant desktop app files
            asset.name.endsWith('.exe') ||
            asset.name.endsWith('.dmg') ||
            asset.name.endsWith('.AppImage') ||
            asset.name.endsWith('.deb') ||
            asset.name.endsWith('.msi')
        )
        .map((asset) => ({
          name: asset.name,
          size: formatBytes(asset.size),
          downloadCount: asset.download_count,
          url: asset.browser_download_url,
        })),
    },
    isLatest,
    isPrerelease: release.prerelease,
  };
}

export function getAssetIcon(filename: string): string {
  if (filename.endsWith('.exe') || filename.endsWith('.msi')) {
    return '🪟';
  } else if (filename.endsWith('.dmg')) {
    return '🍎';
  } else if (filename.endsWith('.AppImage') || filename.endsWith('.deb')) {
    return '🐧';
  }
  return '📦';
}

export function getAssetPlatform(filename: string): string {
  if (filename.endsWith('.exe') || filename.endsWith('.msi')) {
    return 'Windows';
  } else if (filename.endsWith('.dmg')) {
    if (filename.includes('aarch64') || filename.includes('arm64')) {
      return 'macOS (Apple Silicon)';
    }
    return 'macOS (Intel)';
  } else if (filename.endsWith('.AppImage')) {
    return 'Linux (AppImage)';
  } else if (filename.endsWith('.deb')) {
    return 'Linux (Debian/Ubuntu)';
  }
  return 'Unknown';
}
