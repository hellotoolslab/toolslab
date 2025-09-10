'use client';

import { Calendar, Download, ExternalLink, Tag } from 'lucide-react';
import { ReleaseData } from '@/lib/github-releases';
import { formatDistanceToNow } from 'date-fns';

interface ReleaseCardProps {
  release: ReleaseData;
  isLatest: boolean;
  compact?: boolean;
}

export function ReleaseCard({
  release,
  isLatest,
  compact = false,
}: ReleaseCardProps) {
  const releaseDate = formatDistanceToNow(release.publishedAt, {
    addSuffix: true,
  });

  if (compact) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-gray-500" />
              <h3 className="font-medium text-gray-900 dark:text-white">
                {release.version}
              </h3>
              {isLatest && (
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                  Latest
                </span>
              )}
              {release.isPrerelease && (
                <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                  Pre-release
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {releaseDate}
              </span>
              <span>{release.downloads.total.toLocaleString()} downloads</span>
            </div>
          </div>

          <div className="flex gap-2">
            {release.downloads.assets.map((asset) => (
              <a
                key={asset.name}
                href={`/api/download?file=${asset.name}&version=${release.version}`}
                className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-violet-700 hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-900/20"
              >
                <Download className="h-3 w-3" />
                {asset.name.split('_')[1]?.split('.')[0] || asset.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {release.name || release.version}
            </h3>
            {isLatest && (
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                Latest Release
              </span>
            )}
            {release.isPrerelease && (
              <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                Pre-release
              </span>
            )}
          </div>

          <div className="mt-2 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Released {releaseDate}
            </span>
            <span className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              {release.downloads.total.toLocaleString()} downloads
            </span>
          </div>
        </div>
      </div>

      {/* Release Notes */}
      {release.body && (
        <div className="mb-6">
          <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
            <div
              dangerouslySetInnerHTML={{
                __html: release.body
                  .replace(/### (.*)/g, '<h4>$1</h4>')
                  .replace(/## (.*)/g, '<h3>$1</h3>')
                  .replace(/# (.*)/g, '<h2>$1</h2>')
                  .replace(/\n/g, '<br>'),
              }}
            />
          </div>
        </div>
      )}

      {/* Download Assets */}
      <div id="all-downloads">
        <h4 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
          Downloads
        </h4>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {release.downloads.assets.map((asset) => (
            <div
              key={asset.name}
              className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-600"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  {asset.name}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span>{asset.size}</span>
                  <span>•</span>
                  <span>{asset.downloadCount.toLocaleString()} downloads</span>
                </div>
              </div>
              <a
                href={`/api/download?file=${asset.name}&version=${release.version}`}
                className="ml-3 inline-flex items-center gap-1 rounded bg-violet-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-violet-700"
              >
                <Download className="h-3 w-3" />
                Download
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
