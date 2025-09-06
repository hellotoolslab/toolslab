'use client';

import { Suspense, lazy } from 'react';

// Eager load critical above-the-fold components
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { PoweredBy } from '@/components/home/PoweredBy';

// Lazy load below-the-fold components for better performance
const FeaturedTools = lazy(() =>
  import('@/components/home/FeaturedTools').then((mod) => ({
    default: mod.FeaturedTools,
  }))
);
const TrustMetrics = lazy(() =>
  import('@/components/home/TrustMetrics').then((mod) => ({
    default: mod.TrustMetrics,
  }))
);
const WhyToolsLab = lazy(() =>
  import('@/components/home/WhyToolsLab').then((mod) => ({
    default: mod.WhyToolsLab,
  }))
);
const InteractiveDemo = lazy(() =>
  import('@/components/home/InteractiveDemo').then((mod) => ({
    default: mod.InteractiveDemo,
  }))
);
const ToolDiscovery = lazy(() =>
  import('@/components/home/ToolDiscovery').then((mod) => ({
    default: mod.ToolDiscovery,
  }))
);
const SEOContent = lazy(() =>
  import('@/components/home/SEOContent').then((mod) => ({
    default: mod.SEOContent,
  }))
);
const FooterCTA = lazy(() =>
  import('@/components/home/FooterCTA').then((mod) => ({
    default: mod.FooterCTA,
  }))
);

// Loading placeholder for lazy components
function LoadingPlaceholder() {
  return (
    <div className="flex h-96 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
    </div>
  );
}

export default function HomePageContent() {
  return (
    <main className="min-h-screen">
      {/* Above the fold - loaded immediately */}
      <HeroSection />
      <CategoryGrid />

      {/* Powered By section - lightweight, loaded immediately */}
      <PoweredBy />

      {/* Below the fold - lazy loaded */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FeaturedTools />
      </Suspense>

      <Suspense fallback={<LoadingPlaceholder />}>
        <TrustMetrics />
      </Suspense>

      <Suspense fallback={<LoadingPlaceholder />}>
        <WhyToolsLab />
      </Suspense>

      <Suspense fallback={<LoadingPlaceholder />}>
        <InteractiveDemo />
      </Suspense>

      <Suspense fallback={<LoadingPlaceholder />}>
        <ToolDiscovery />
      </Suspense>

      <Suspense fallback={<LoadingPlaceholder />}>
        <SEOContent />
      </Suspense>

      <Suspense fallback={<LoadingPlaceholder />}>
        <FooterCTA />
      </Suspense>
    </main>
  );
}
