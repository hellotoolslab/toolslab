import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CategoriesHubContentSimple from '@/components/layout/CategoriesHubContentSimple';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { locales, type Locale } from '@/lib/i18n/config';

interface LocaleCategoriesPageProps {
  params: {
    locale: string;
  };
}

export async function generateMetadata({
  params: { locale },
}: LocaleCategoriesPageProps): Promise<Metadata> {
  // Validate locale
  if (!locales.includes(locale as Locale)) {
    return {};
  }

  const dict = await getDictionary(locale as Locale);

  const title =
    locale === 'it'
      ? 'Categorie Strumenti Sviluppatori - Naviga per Funzionalità'
      : 'Developer Tool Categories - Browse by Functionality';

  const description =
    locale === 'it'
      ? 'Esplora 24+ strumenti professionali per sviluppatori organizzati in 6 categorie specializzate. Dalla conversione dati alle utilità di sicurezza, trova strumenti per formattazione JSON, codifica Base64, generazione hash e altro.'
      : 'Explore 24+ professional developer tools organized into 6 specialized categories. From data conversion to security utilities, find tools for JSON formatting, Base64 encoding, hash generation, and more.';

  const keywords =
    locale === 'it'
      ? 'categorie strumenti sviluppatori, JSON formattater , codificatore Base64, generatore hash, strumenti conversione dati, utilità sicurezza, strumenti sviluppo web, utilità programmazione'
      : 'developer tools categories, JSON formatter, Base64 encoder, hash generator, data conversion tools, security utilities, web development tools, programming utilities';

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://toolslab.dev/${locale}/categories`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} - ToolsLab`,
      description,
    },
    alternates: {
      canonical: `https://toolslab.dev/${locale}/categories`,
      languages: {
        en: 'https://toolslab.dev/categories',
        it: 'https://toolslab.dev/it/categories',
      },
    },
  };
}

export default async function LocaleCategoriesPage({
  params: { locale },
}: LocaleCategoriesPageProps) {
  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const dict = await getDictionary(locale as Locale);

  return (
    <CategoriesHubContentSimple locale={locale as Locale} dictionary={dict} />
  );
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
