import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Header } from '@/components/layout/Header';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'OctoTools - Essential Developer Tools',
    template: '%s | OctoTools',
  },
  description: 'A comprehensive collection of developer tools for encoding, formatting, converting, and generating. All tools work offline and respect your privacy.',
  keywords: [
    'developer tools',
    'json formatter',
    'base64 encoder',
    'url encoder',
    'jwt decoder',
    'uuid generator',
    'hash generator',
    'timestamp converter',
    'online tools',
    'web tools',
  ],
  authors: [{ name: 'OctoTools' }],
  creator: 'OctoTools',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://octotools.dev',
    title: 'OctoTools - Essential Developer Tools',
    description: 'A comprehensive collection of developer tools for encoding, formatting, converting, and generating. All tools work offline and respect your privacy.',
    siteName: 'OctoTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OctoTools - Essential Developer Tools',
    description: 'A comprehensive collection of developer tools for encoding, formatting, converting, and generating. All tools work offline and respect your privacy.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, 'min-h-screen bg-background font-sans antialiased')}>
        <ThemeProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}