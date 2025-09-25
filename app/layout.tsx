import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { UmamiProvider } from '@/components/analytics/UmamiProvider';
import { PageViewTracker } from '@/components/analytics/PageViewTracker';
import { ToastProvider } from '@/components/providers/ToastProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { UpdateNotification } from '@/components/UpdateNotification';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { cn } from '@/lib/utils';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://toolslab.dev'),
  title: {
    default: 'ToolsLab - Laboratory for Developer Tools',
    template: '%s | ToolsLab',
  },
  description:
    'Your Laboratory for Developer Tools - Experiment, Chain, Optimize. Free online tools for developers including JSON formatter, Base64 encoder, JWT decoder, UUID generator and more.',
  keywords: [
    'developer tools',
    'online tools',
    'json formatter',
    'base64 encoder',
    'url encoder',
    'jwt decoder',
    'uuid generator',
    'hash generator',
    'password generator',
    'regex tester',
    'crontab builder',
    'free tools',
    'web tools',
    'laboratory',
    'toolslab',
  ],
  authors: [{ name: 'ToolsLab' }],
  creator: 'ToolsLab',
  publisher: 'ToolsLab',

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://toolslab.dev',
    title: 'ToolsLab - Laboratory for Developer Tools',
    description:
      'Your Laboratory for Developer Tools - Experiment, Chain, Optimize. Free online tools for developers.',
    siteName: 'ToolsLab',
    images: [
      {
        url: '/opengraph-image.png', // Next.js generates this automatically
        width: 1200,
        height: 630,
        alt: 'ToolsLab - Laboratory for Developer Tools',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'ToolsLab - Laboratory for Developer Tools',
    description:
      'Your Laboratory for Developer Tools - Free online tools for developers',
    creator: '@toolslab', // Replace with actual handle if you have one
    images: ['/opengraph-image.png'],
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

  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },

  verification: {
    google: 'your-google-verification-code', // Replace with actual verification code
    other: {
      'msvalidate.01': 'A915DC41215EC56805DD7990E7B00EE4',
    },
  },

  alternates: {
    canonical: 'https://toolslab.dev',
  },

  category: 'technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
            body { font-family: system-ui, -apple-system, sans-serif; }
          `,
          }}
        />
      </head>
      <body
        className={cn(
          inter.className,
          'min-h-screen bg-background font-sans antialiased'
        )}
      >
        <UmamiProvider>
          <ThemeProvider>
            <Suspense fallback={null}>
              <PageViewTracker />
            </Suspense>
            <ScrollToTop />
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <UpdateNotification />
            <ToastProvider />
          </ThemeProvider>
        </UmamiProvider>
        <SpeedInsights />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  );
}
