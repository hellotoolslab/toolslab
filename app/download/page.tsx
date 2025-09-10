import { Metadata } from 'next';
import {
  Download,
  ExternalLink,
  Github,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import {
  fetchGitHubReleases,
  fetchLatestRelease,
  parseReleaseData,
  getAssetIcon,
  getAssetPlatform,
} from '@/lib/github-releases';
import { PlatformDetector } from '@/components/download/PlatformDetector';
import { DownloadCard } from '@/components/download/DownloadCard';
import { ReleaseCard } from '@/components/download/ReleaseCard';
import { InstallInstructions } from '@/components/download/InstallInstructions';

export const metadata: Metadata = {
  title: 'Download ToolsLab Desktop App | Native Developer Tools',
  description:
    'Download ToolsLab desktop app for Windows, macOS, and Linux. Professional developer tools that work completely offline with auto-updates.',
  keywords: [
    'toolslab download',
    'desktop app',
    'developer tools',
    'windows mac linux',
    'offline tools',
    'native app',
  ],
  openGraph: {
    title: 'Download ToolsLab Desktop App',
    description:
      'Professional developer tools in a native desktop app. Works offline, auto-updates, available for all platforms.',
    images: [
      {
        url: '/api/og?title=Download%20Desktop%20App&subtitle=Windows%20%7C%20macOS%20%7C%20Linux',
        width: 1200,
        height: 630,
        alt: 'ToolsLab Desktop App Download',
      },
    ],
  },
};

export default async function DownloadPage() {
  const [releases, latestRelease] = await Promise.all([
    fetchGitHubReleases(),
    fetchLatestRelease(),
  ]);

  const releaseData = releases.map((release, index) =>
    parseReleaseData(release, index === 0)
  );

  const totalDownloads = releaseData.reduce(
    (sum, release) => sum + release.downloads.total,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 p-4 shadow-2xl">
              <Download className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-4xl font-bold text-transparent dark:from-white dark:to-gray-300">
            Download ToolsLab Desktop
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Professional developer tools in a native desktop app. Works
            completely offline, auto-updates enabled, and respects your privacy.
          </p>

          {/* Stats */}
          <div className="mt-8 flex flex-wrap justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>{totalDownloads.toLocaleString()} total downloads</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>100% offline capable</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Auto-updates enabled</span>
            </div>
          </div>
        </div>

        {/* Platform Detector - Recommended Download */}
        <PlatformDetector latestVersion={latestRelease?.tag_name || 'v1.0.0'} />

        {/* Latest Release Details */}
        {latestRelease && (
          <div className="mb-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Latest Release
              </h2>
              <a
                href={latestRelease.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                <Github className="h-4 w-4" />
                View on GitHub
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <ReleaseCard
              release={parseReleaseData(latestRelease, true)}
              isLatest={true}
            />
          </div>
        )}

        {/* All Downloads */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
            All Downloads
          </h2>

          {latestRelease && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {latestRelease.assets
                .filter(
                  (asset) =>
                    asset.name.endsWith('.exe') ||
                    asset.name.endsWith('.dmg') ||
                    asset.name.endsWith('.AppImage') ||
                    asset.name.endsWith('.deb') ||
                    asset.name.endsWith('.msi')
                )
                .map((asset) => (
                  <DownloadCard
                    key={asset.id}
                    filename={asset.name}
                    platform={getAssetPlatform(asset.name)}
                    size={Math.round(asset.size / 1024 / 1024) + ' MB'}
                    downloads={asset.download_count}
                    downloadUrl={`/api/download?file=${asset.name}&version=${latestRelease.tag_name}`}
                    directUrl={asset.browser_download_url}
                    icon={getAssetIcon(asset.name)}
                  />
                ))}
            </div>
          )}
        </div>

        {/* Installation Instructions */}
        <InstallInstructions />

        {/* Previous Releases */}
        {releaseData.length > 1 && (
          <div className="mb-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Previous Releases
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {releaseData.length - 1} previous releases
              </p>
            </div>

            <div className="space-y-4">
              {releaseData.slice(1, 6).map((release) => (
                <ReleaseCard
                  key={release.version}
                  release={release}
                  isLatest={false}
                  compact={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-6 dark:border-orange-800 dark:bg-orange-950">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-orange-600 dark:text-orange-400" />
            <div>
              <h3 className="font-semibold text-orange-900 dark:text-orange-100">
                Security Information
              </h3>
              <p className="mt-1 text-sm text-orange-800 dark:text-orange-200">
                Always download ToolsLab from official sources. Our desktop app
                includes automatic signature verification and secure
                auto-updates. All releases are signed and verified.
              </p>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-orange-700 dark:text-orange-300">
                <span>✓ Code signed binaries</span>
                <span>✓ Secure auto-updates</span>
                <span>✓ No telemetry or tracking</span>
                <span>✓ Open source</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
