import { Metadata } from 'next';
import { NewAboutPage } from '@/components/about/NewAboutPage';

export const metadata: Metadata = {
  title: 'About ToolsLab - The Story of Your Developer Toolbox',
  description:
    'Discover how ToolsLab evolved from a personal project to a trusted toolkit for thousands of developers worldwide. Free forever, no strings attached.',
  keywords: [
    'about toolslab',
    'developer tools story',
    'free developer tools',
    'privacy first tools',
    'independent developer',
    'toolslab mission',
    'developer productivity',
    'swiss army knife for developers',
  ],
  openGraph: {
    title: 'About ToolsLab - The Story of Your Developer Toolbox',
    description:
      'From personal frustration to community resource. Discover the story behind the trusted toolkit for developers worldwide.',
    type: 'website',
    url: 'https://toolslab.dev/about',
    siteName: 'ToolsLab',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About ToolsLab - The Story of Your Developer Toolbox',
    description:
      'From personal frustration to community resource. Discover the story behind the trusted toolkit for developers worldwide.',
  },
  alternates: {
    canonical: 'https://toolslab.dev/about',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutPage() {
  return <NewAboutPage />;
}
