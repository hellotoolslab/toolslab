import { Metadata } from 'next';
import { LabPageClient } from './LabPageClient';

export const metadata: Metadata = {
  title: 'My Developer Lab - Personal Tool Collection | ToolsLab',
  description:
    'Create your personal developer toolkit with starred favorites. Access JSON formatters, Base64 encoders, hash generators and more in one private workspace. No account required - stored locally.',
  keywords: [
    'personal developer lab',
    'favorite tools collection',
    'developer workspace',
    'tool favorites',
    'JSON formatter favorites',
    'Base64 encoder bookmark',
    'hash generator collection',
    'private tool workspace',
    'localStorage tools',
    'developer productivity',
  ],
  openGraph: {
    title: 'My Developer Lab - Personal Tool Collection | ToolsLab',
    description:
      'Build your personalized developer toolkit by starring your most-used tools. Completely private with localStorage - no account needed.',
    type: 'website',
    url: 'https://toolslab.dev/lab',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Developer Lab - ToolsLab',
    description:
      'Personal toolkit for developers. Star your favorites, build workflows, stay private.',
  },
  robots: {
    index: false, // Don't index personalized pages
    follow: true,
  },
  alternates: {
    canonical: 'https://toolslab.dev/lab',
  },
};

export default function LabPage() {
  return <LabPageClient />;
}
