'use client';

import { Download, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DownloadCardProps {
  filename: string;
  platform: string;
  size: string;
  downloads: number;
  downloadUrl: string;
  directUrl: string;
  icon: string;
}

export function DownloadCard({
  filename,
  platform,
  size,
  downloads,
  downloadUrl,
  directUrl,
  icon,
}: DownloadCardProps) {
  return (
    <div className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-violet-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-violet-600">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{icon}</div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              {platform}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {filename}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{size}</span>
        <span>{downloads.toLocaleString()} downloads</span>
      </div>

      <div className="mt-4 flex gap-2">
        <a
          href={downloadUrl}
          className={cn(
            'inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2',
            'text-sm font-medium text-white transition-colors hover:bg-violet-700',
            'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2'
          )}
        >
          <Download className="h-4 w-4" />
          Download
        </a>

        <a
          href={directUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <ExternalLink className="h-3 w-3" />
          Direct
        </a>
      </div>
    </div>
  );
}
