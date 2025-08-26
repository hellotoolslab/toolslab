import { Metadata } from 'next';
import { AboutHero } from '@/components/about/AboutHero';
import { ManifestoSection } from '@/components/about/ManifestoSection';
import { StorySection } from '@/components/about/StorySection';
import { CommitmentSection } from '@/components/about/CommitmentSection';
import { SupportSection } from '@/components/about/SupportSection';

export const metadata: Metadata = {
  title: 'About ToolsLab - No BS Developer Tools | Why We Exist',
  description:
    'ToolsLab is built by developers, for developers. No ads, no tracking, no login required. Just tools that work instantly.',
  keywords: [
    'about toolslab',
    'developer tools',
    'no bs tools',
    'privacy first tools',
    'independent developer',
    'support toolslab',
    'why donate toolslab',
  ],
  openGraph: {
    title: 'About ToolsLab - No BS Developer Tools',
    description:
      'Why we built ToolsLab and our commitment to keeping developer tools simple, fast, and private.',
    type: 'website',
    url: 'https://toolslab.dev/about',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About ToolsLab - No BS Developer Tools',
    description:
      'Why we built ToolsLab and our commitment to keeping developer tools simple, fast, and private.',
  },
  alternates: {
    canonical: 'https://toolslab.dev/about',
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <AboutHero />
      <ManifestoSection />
      <StorySection />
      <CommitmentSection />
      <SupportSection />
    </main>
  );
}
