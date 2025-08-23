// components/ads/EthicalAd.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useFeatureFlag } from '@/hooks/useEdgeConfig';

interface EthicalAdProps {
  placement?: 'header' | 'sidebar' | 'footer';
  className?: string;
  force?: boolean; // Override user level check for testing
}

export function EthicalAd({
  placement = 'sidebar',
  className = '',
  force = false,
}: EthicalAdProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [adError, setAdError] = useState(false);

  // Check if ads are enabled via Edge Config
  const adsEnabledFromConfig = useFeatureFlag('ads');
  // Allow force override for testing or fallback to env variable
  const adsEnabled =
    force ||
    adsEnabledFromConfig ||
    process.env.NEXT_PUBLIC_ENABLE_ADS === 'true';
  const publisherId =
    process.env.NEXT_PUBLIC_ETHICAL_ADS_PUBLISHER || 'toolslab';

  useEffect(() => {
    if (!adRef.current || isLoaded) return;

    try {
      // Create the ad container
      const adContainer = document.createElement('div');
      adContainer.className = 'ethical-ad';
      adContainer.setAttribute('data-ea-publisher', publisherId);
      adContainer.setAttribute('data-ea-type', getAdType(placement));

      // Optional: Set specific ad campaigns or keywords
      adContainer.setAttribute(
        'data-ea-keywords',
        'developer-tools|programming|web-development'
      );

      adRef.current.appendChild(adContainer);

      // Load EthicalAds script
      const script = document.createElement('script');
      script.src = 'https://media.ethicalads.io/media/client/ethicalads.min.js';
      script.async = true;
      script.onload = () => setIsLoaded(true);
      script.onerror = () => {
        console.error('Failed to load EthicalAds');
        setAdError(true);
      };

      document.head.appendChild(script);

      // Cleanup function
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    } catch (error) {
      console.error('Error initializing EthicalAds:', error);
      setAdError(true);
    }
  }, [publisherId, placement, isLoaded]);

  // Don't show ads if:
  // 1. Ads are disabled globally
  // 2. Ad failed to load
  if (!adsEnabled || adError) {
    return null;
  }

  // Determine ad type based on placement
  function getAdType(placement: string): string {
    switch (placement) {
      case 'header':
        return 'horizontal';
      case 'sidebar':
        return 'vertical';
      case 'footer':
        return 'horizontal';
      default:
        return 'text';
    }
  }

  // Different styles for different placements
  const getPlacementStyles = () => {
    switch (placement) {
      case 'header':
        return 'min-h-[90px] max-w-[728px] mx-auto';
      case 'sidebar':
        return 'min-h-[250px] max-w-[300px]';
      case 'footer':
        return 'min-h-[90px] max-w-[728px] mx-auto';
      default:
        return '';
    }
  };

  return (
    <div
      ref={adRef}
      className={`ethical-ad-container ${getPlacementStyles()} ${className}`}
      aria-label="Advertisement"
    >
      {!isLoaded && !adError && (
        <div className="ad-placeholder animate-pulse rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
          <div className="text-center text-xs text-gray-500">
            Advertisement Loading...
          </div>
        </div>
      )}
    </div>
  );
}

// Optional: Ad wrapper with close button for better UX
export function DismissibleAd(props: EthicalAdProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsDismissed(true)}
        className="absolute right-0 top-0 z-10 p-1 text-gray-400 hover:text-gray-600"
        aria-label="Dismiss advertisement"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <EthicalAd {...props} />
    </div>
  );
}
