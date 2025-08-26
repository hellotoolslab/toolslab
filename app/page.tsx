import { Metadata } from 'next';
import HomePageContent from '@/components/layout/HomePageContent';

export const metadata: Metadata = {
  title: 'ToolsLab - Your Developer Tools Laboratory',
  description:
    'Professional developer tools crafted with scientific precision. All tools work offline and deliver laboratory-grade accuracy.',
  openGraph: {
    title: 'ToolsLab - Your Developer Tools Laboratory',
    description:
      'Professional developer tools crafted with scientific precision. All tools work offline and deliver laboratory-grade accuracy.',
    url: 'https://toolslab.dev',
    siteName: 'ToolsLab',
    type: 'website',
  },
};

export default function HomePage() {
  return <HomePageContent />;
}

export async function generateStaticParams() {
  return [];
}
