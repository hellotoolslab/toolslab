import { Metadata } from 'next';
import { LabPageClient } from './LabPageClient';

export const metadata: Metadata = {
  title: 'Your Lab - Personalized Developer Tools | ToolsLab',
  description:
    'Access your favorite developer tools in one personalized workspace. Privacy-first, no account needed.',
  robots: {
    index: false, // Don't index personalized pages
    follow: true,
  },
};

export default function LabPage() {
  return <LabPageClient />;
}
