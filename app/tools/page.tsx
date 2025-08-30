import { Metadata } from 'next';
import { Suspense } from 'react';
import ToolsHubContent from '@/components/tools/ToolsHubContent';

export const metadata: Metadata = {
  title: 'All Developer Tools - Free Online Utilities | ToolsLab',
  description:
    'Discover 20+ free online tools for JSON formatting, Base64 encoding, URL decoding, hash generation, and more. All tools work entirely in your browser with no data transmission to servers. Perfect for development, debugging, and data processing workflows.',
  keywords: [
    'online developer tools',
    'free developer utilities',
    'web development tools',
    'json formatter',
    'base64 encoder',
    'url decoder',
    'hash generator',
    'browser based tools',
    'privacy first tools',
    'developer utilities',
    'coding tools',
    'programming utilities',
  ],
  openGraph: {
    title: 'All Developer Tools - Free Online Utilities | ToolsLab',
    description:
      'Complete collection of professional tools for developers, data analysts, and system administrators. 20+ tools, all free and privacy-first.',
    type: 'website',
    url: 'https://octotools.org/tools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Developer Tools - ToolsLab',
    description:
      'Free online developer tools for JSON, encoding, generators, and more. All browser-based with zero data transmission.',
  },
  alternates: {
    canonical: 'https://octotools.org/tools',
  },
};

export default function ToolsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ToolsHubContent />
    </Suspense>
  );
}
