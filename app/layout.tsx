import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { UmamiProvider } from '@/components/analytics/UmamiProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'ToolsLab - Your Developer Tools Laboratory',
    template: '%s | ToolsLab',
  },
  description:
    'Professional developer tools crafted with scientific precision. All tools work offline and deliver laboratory-grade accuracy.',
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
  authors: [{ name: 'ToolsLab' }],
  creator: 'ToolsLab',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://toolslab.dev',
    title: 'ToolsLab - Your Developer Tools Laboratory',
    description:
      'Professional developer tools crafted with scientific precision. All tools work offline and deliver laboratory-grade accuracy.',
    siteName: 'ToolsLab',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ToolsLab - Your Developer Tools Laboratory',
    description:
      'Professional developer tools crafted with scientific precision. All tools work offline and deliver laboratory-grade accuracy.',
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
      <head />
      <body
        className={cn(
          inter.className,
          'min-h-screen bg-background font-sans antialiased'
        )}
      >
        <UmamiProvider>
          <ThemeProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </UmamiProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
