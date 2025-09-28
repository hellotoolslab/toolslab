import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { locales, type Locale } from '@/lib/i18n/config';
import { LocaleLabPageClient } from './LocaleLabPageClient';

interface LocaleLabPageProps {
  params: {
    locale: string;
  };
}

export async function generateMetadata({
  params: { locale },
}: LocaleLabPageProps): Promise<Metadata> {
  // Validate locale
  if (!locales.includes(locale as Locale)) {
    return {};
  }

  const dict = await getDictionary(locale as Locale);

  const title =
    locale === 'it'
      ? 'Il Mio Lab Sviluppatore - Collezione Strumenti Personale | ToolsLab'
      : 'My Developer Lab - Personal Tool Collection | ToolsLab';

  const description =
    locale === 'it'
      ? 'Crea il tuo toolkit personale per sviluppatori con i preferiti contrassegnati con stella. Accedi a formattatori JSON, codificatori Base64, generatori hash e altro in uno spazio di lavoro privato. Nessun account richiesto - salvato localmente.'
      : 'Create your personal developer toolkit with starred favorites. Access JSON formatters, Base64 encoders, hash generators and more in one private workspace. No account required - stored locally.';

  const keywords =
    locale === 'it'
      ? [
          'lab sviluppatore personale',
          'collezione strumenti preferiti',
          'spazio lavoro sviluppatore',
          'strumenti preferiti',
          'formattatore JSON preferiti',
          'codificatore Base64 segnalibro',
          'collezione generatore hash',
          'spazio lavoro strumenti privato',
          'strumenti localStorage',
          'produttività sviluppatore',
        ]
      : [
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
        ];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description:
        locale === 'it'
          ? 'Costruisci il tuo toolkit personalizzato per sviluppatori contrassegnando i tuoi strumenti più usati. Completamente privato con localStorage - nessun account necessario.'
          : 'Build your personalized developer toolkit by starring your most-used tools. Completely private with localStorage - no account needed.',
      type: 'website',
      url: `https://toolslab.dev/${locale}/lab`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${locale === 'it' ? 'Il Mio Lab Sviluppatore' : 'My Developer Lab'} - ToolsLab`,
      description:
        locale === 'it'
          ? 'Toolkit personale per sviluppatori. Segna i tuoi preferiti, crea flussi di lavoro, mantieni la privacy.'
          : 'Personal toolkit for developers. Star your favorites, build workflows, stay private.',
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://toolslab.dev/${locale}/lab`,
      languages: {
        en: 'https://toolslab.dev/lab',
        it: 'https://toolslab.dev/it/lab',
      },
    },
  };
}

export default async function LocaleLabPage({
  params: { locale },
}: LocaleLabPageProps) {
  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const dict = await getDictionary(locale as Locale);

  return <LocaleLabPageClient locale={locale as Locale} dictionary={dict} />;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
