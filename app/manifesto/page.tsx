import { Metadata } from 'next';
import ManifestoPageClient from '@/components/manifesto/ManifestoPageClient';

export const metadata: Metadata = {
  title: 'The ToolsLab Manifesto - Our Commitment to Developers',
  description:
    'Our commitment to building a better web for developers. Privacy by design, offline first, open source, and community driven.',
  keywords:
    'manifesto, developer tools, privacy, open source, principles, values, commitment',
  openGraph: {
    title: 'The ToolsLab Manifesto',
    description: 'Our commitment to building a better web for developers',
    type: 'website',
  },
};

export default function ManifestoPage() {
  return <ManifestoPageClient />;
}
