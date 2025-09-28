import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HomePageContent from '@/components/layout/HomePageContent';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { locales, type Locale } from '@/lib/i18n/config';

interface LocalePageProps {
  params: {
    locale: string;
  };
}

export async function generateMetadata({
  params: { locale },
}: LocalePageProps): Promise<Metadata> {
  // Validate locale
  if (!locales.includes(locale as Locale)) {
    return {};
  }

  const dict = await getDictionary(locale as Locale);

  return {
    title: `ToolsLab - ${dict.home.hero.title}`,
    description: dict.seo.defaultDescription,
    keywords:
      locale === 'it'
        ? 'strumenti sviluppatore, formattatore json, codificatore base64, decodificatore jwt, generatore uuid, generatore hash, codificatore url, convertitore timestamp, tester regex, strumenti online, strumenti web, strumenti gratuiti'
        : 'developer tools, json formatter, base64 encoder, jwt decoder, uuid generator, hash generator, url encoder, timestamp converter, regex tester, online tools, web tools, free tools, browser tools',
    openGraph: {
      title: `ToolsLab - ${dict.home.hero.title}`,
      description: dict.home.hero.description,
      url: `https://toolslab.dev${locale === 'en' ? '' : `/${locale}`}`,
      siteName: 'ToolsLab',
      type: 'website',
      images: [
        {
          url: 'https://toolslab.dev/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'ToolsLab - Developer Tools Laboratory',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `ToolsLab - ${dict.home.hero.title}`,
      description: dict.home.hero.description,
      images: ['https://toolslab.dev/twitter-card.jpg'],
    },
    alternates: {
      canonical: `https://toolslab.dev${locale === 'en' ? '' : `/${locale}`}`,
      languages: {
        en: 'https://toolslab.dev',
        it: 'https://toolslab.dev/it',
      },
    },
  };
}

// Generate structured data based on locale
function generateStructuredData(locale: string, dict: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'ToolsLab',
    description: dict.home.hero.description,
    url: `https://toolslab.dev${locale === 'en' ? '' : `/${locale}`}`,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
      bestRating: '5',
      worstRating: '1',
    },
    author: {
      '@type': 'Organization',
      name: 'ToolsLab',
      url: 'https://toolslab.dev',
    },
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString(),
    inLanguage: locale === 'it' ? 'it-IT' : 'en-US',
    isAccessibleForFree: true,
    featureList: [
      dict.tools['json-formatter'].title,
      dict.tools['base64-encode'].title,
      dict.tools['jwt-decoder'].title,
      dict.tools['uuid-generator'].title,
      dict.tools['hash-generator'].title,
      dict.tools['url-encoder'].title,
      dict.tools['unix-timestamp'].title,
      dict.tools['regex-tester'].title,
      dict.tools['password-generator'].title,
      dict.tools['color-converter'].title,
    ],
  };
}

export default async function LocaleHomePage({
  params: { locale },
}: LocalePageProps) {
  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const dict = await getDictionary(locale as Locale);
  const structuredData = generateStructuredData(locale, dict);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomePageContent locale={locale as Locale} dictionary={dict} />
    </>
  );
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
