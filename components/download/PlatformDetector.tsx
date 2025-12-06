'use client';

import { useEffect, useState } from 'react';
import { Download, Monitor, Smartphone } from 'lucide-react';
import {
  detectPlatform,
  getRecommendedDownload,
  type PlatformInfo,
} from '@/lib/platform-detection';
import { cn } from '@/lib/utils';

interface PlatformDetectorProps {
  latestVersion: string;
}

export function PlatformDetector({ latestVersion }: PlatformDetectorProps) {
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setPlatformInfo(detectPlatform());
  }, []);

  if (!mounted || !platformInfo) {
    return (
      <div className="mb-12 rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <div className="animate-pulse">
          <div className="mb-4 h-6 w-48 rounded bg-gray-300 dark:bg-gray-600"></div>
          <div className="h-12 w-full rounded bg-gray-300 dark:bg-gray-600"></div>
        </div>
      </div>
    );
  }

  const recommendedDownload = getRecommendedDownload(
    platformInfo,
    latestVersion
  );

  return (
    <div className="mb-12 rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-6 flex items-center gap-3">
        <Monitor className="h-6 w-6 text-violet-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Recommended for your system
        </h2>
      </div>

      {recommendedDownload ? (
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="text-3xl">{recommendedDownload.icon}</div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {recommendedDownload.displayName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Detected: {platformInfo.platform} ({platformInfo.architecture})
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Version {latestVersion}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <a
              href={`/api/download?file=${recommendedDownload.filename}&version=${latestVersion}&platform=${platformInfo.platform}`}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600',
                'px-6 py-3 font-medium text-white transition-all duration-200',
                'hover:from-violet-700 hover:to-purple-700 hover:shadow-lg',
                'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2'
              )}
            >
              <Download className="h-4 w-4" />
              Download Now
            </a>
            <button
              onClick={() =>
                document
                  .getElementById('all-downloads')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              className="rounded-lg bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Other platforms
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Smartphone className="h-8 w-8 text-gray-400" />
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Platform not detected
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Choose from available downloads below
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              document
                .getElementById('all-downloads')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
            className="rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 font-medium text-white transition-all duration-200 hover:from-violet-700 hover:to-purple-700"
          >
            View Downloads
          </button>
        </div>
      )}

      {/* Platform detection details */}
      <div className="dark:bg-gray-750 mt-6 rounded-lg bg-gray-50 p-4">
        <details className="text-sm">
          <summary className="cursor-pointer text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
            Detection details
          </summary>
          <div className="mt-2 space-y-1 text-xs text-gray-500 dark:text-gray-400">
            <p>Platform: {platformInfo.platform}</p>
            <p>Architecture: {platformInfo.architecture}</p>
            <p>User Agent: {platformInfo.userAgent.substring(0, 100)}...</p>
          </div>
        </details>
      </div>
    </div>
  );
}
