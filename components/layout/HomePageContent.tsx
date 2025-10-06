'use client';

import { Suspense, lazy } from 'react';
import { type Locale } from '@/lib/i18n/config';
import { type Dictionary } from '@/lib/i18n/get-dictionary';
import { DictionaryProvider } from '@/components/providers/DictionaryProvider';

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
function LoadingPlaceholder({
  minHeight = 'min-h-[200px]',
}: {
  minHeight?: string;
}) {
  return (
    <div className={`flex ${minHeight} items-center justify-center`}>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
    </div>
  );
}

interface HomePageContentProps {
  locale?: Locale;
  dictionary?: Dictionary;
}

export default function HomePageContent({
  locale = 'en',
  dictionary,
}: HomePageContentProps) {
  // Specify sections needed for homepage
  const homeSections = ['common', 'home', 'footer'];

  return (
    <DictionaryProvider
      locale={locale}
      sections={homeSections}
      initialDictionary={dictionary}
    >
      <main className="min-h-screen">
        {/* Above the fold - loaded immediately */}
        <HeroSection locale={locale} dictionary={dictionary} />

        {/* Most Used This Week - moved before CategoryGrid */}
        <Suspense fallback={<LoadingPlaceholder minHeight="min-h-[300px]" />}>
          <FeaturedTools locale={locale} dictionary={dictionary} />
        </Suspense>

        <CategoryGrid locale={locale} dictionary={dictionary} />

        {/* Powered By section - lightweight, loaded immediately */}
        <PoweredBy />

        <Suspense fallback={<LoadingPlaceholder minHeight="min-h-[200px]" />}>
          <TrustMetrics />
        </Suspense>

        <Suspense fallback={<LoadingPlaceholder minHeight="min-h-[400px]" />}>
          <WhyToolsLab locale={locale} dictionary={dictionary} />
        </Suspense>

        <Suspense fallback={<LoadingPlaceholder minHeight="min-h-[500px]" />}>
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
    </DictionaryProvider>
  );
}
