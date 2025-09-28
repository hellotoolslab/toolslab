import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { locales, type Locale } from '@/lib/i18n/config';
import ToolsHubContent from '@/components/tools/ToolsHubContent';

interface LocaleToolsPageProps {
  params: {
    locale: string;
  };
}

export async function generateMetadata({
  params: { locale },
}: LocaleToolsPageProps): Promise<Metadata> {
  // Validate locale
  if (!locales.includes(locale as Locale)) {
    return {};
  }

  const dict = await getDictionary(locale as Locale);

  const title =
    locale === 'it'
      ? 'Tutti gli Strumenti Sviluppatore - Utilità Online Gratuite | ToolsLab'
      : 'All Developer Tools - Free Online Utilities | ToolsLab';

  const description =
    locale === 'it'
      ? 'Scopri 20+ strumenti online gratuiti per formattazione JSON, codifica Base64, decodifica URL, generazione hash e altro. Tutti gli strumenti funzionano interamente nel tuo browser senza trasmissione dati ai server. Perfetti per flussi di lavoro di sviluppo, debug e elaborazione dati.'
      : 'Discover 20+ free online tools for JSON formatting, Base64 encoding, URL decoding, hash generation, and more. All tools work entirely in your browser with no data transmission to servers. Perfect for development, debugging, and data processing workflows.';

  const keywords =
    locale === 'it'
      ? [
          'strumenti sviluppatore online',
          'utilità sviluppatore gratuite',
          'strumenti sviluppo web',
          'formattatore json',
          'codificatore base64',
          'decodificatore url',
          'generatore hash',
          'strumenti basati su browser',
          'strumenti privacy first',
          'utilità sviluppatore',
          'strumenti codifica',
          'utilità programmazione',
        ]
      : [
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
        ];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description:
        locale === 'it'
          ? 'Collezione completa di strumenti professionali per sviluppatori, analisti dati e amministratori di sistema. 20+ strumenti, tutti gratuiti e privacy-first.'
          : 'Complete collection of professional tools for developers, data analysts, and system administrators. 20+ tools, all free and privacy-first.',
      type: 'website',
      url: `https://toolslab.dev/${locale}/tools`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${locale === 'it' ? 'Tutti gli Strumenti Sviluppatore' : 'All Developer Tools'} - ToolsLab`,
      description:
        locale === 'it'
          ? 'Strumenti sviluppatore online gratuiti per JSON, codifica, generatori e altro. Tutti basati su browser senza trasmissione dati.'
          : 'Free online developer tools for JSON, encoding, generators, and more. All browser-based with zero data transmission.',
    },
    alternates: {
      canonical: `https://toolslab.dev/${locale}/tools`,
      languages: {
        en: 'https://toolslab.dev/tools',
        it: 'https://toolslab.dev/it/tools',
      },
    },
  };
}

export default async function LocaleToolsPage({
  params: { locale },
}: LocaleToolsPageProps) {
  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const dict = await getDictionary(locale as Locale);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ToolsHubContent />
    </Suspense>
  );
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
