'use client';

import { useEffect, useState } from 'react';
import { useFeatureFlag } from '@/hooks/useEdgeConfig';

interface AdBannerProps {
  type: 'header' | 'sidebar' | 'inline';
}

export default function AdBanner({ type }: AdBannerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const adsEnabled = useFeatureFlag('ads');

  useEffect(() => {
    // Only simulate ad loading if ads are enabled
    if (adsEnabled) {
      const timer = setTimeout(() => setIsLoaded(true), 500);
      return () => clearTimeout(timer);
    }
  }, [adsEnabled]);

  // Don't render if ads are disabled
  if (!adsEnabled) {
    return null;
  }

  const dimensions = {
    header: { width: 728, height: 90 },
    sidebar: { width: 300, height: 250 },
    inline: { width: 320, height: 100 },
  };

  const { width, height } = dimensions[type];

  if (!isLoaded) {
    return (
      <div
        className="animate-pulse rounded bg-gray-200 dark:bg-gray-700"
        style={{ width: '100%', maxWidth: width, height }}
      />
    );
  }

  return (
    <div
      className="relative flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800"
      style={{ width: '100%', maxWidth: width, height }}
    >
      {/* Placeholder content */}
      <div className="p-4 text-center">
        <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
          Advertisement
        </p>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {type === 'header' && 'Header Ad Space (728x90)'}
          {type === 'sidebar' && 'Sidebar Ad (300x250)'}
          {type === 'inline' && 'Inline Ad (320x100)'}
        </p>
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute left-0 top-0 h-32 w-32 rounded-full bg-blue-500 blur-3xl filter" />
        <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-purple-500 blur-3xl filter" />
      </div>
    </div>
  );
}
