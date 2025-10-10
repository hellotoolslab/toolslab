import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ToolPageClient from '@/components/tools/ToolPageClient';
import { tools, getToolById, categories } from '@/lib/tools';
import { generateToolSchema } from '@/lib/tool-schema';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { locales, type Locale } from '@/lib/i18n/config';
import { generateHreflangAlternates } from '@/lib/seo/hreflang-utils';

interface LocaleToolPageProps {
  params: {
    locale: string;
    tool: string;
  };
}

export async function generateMetadata({
  params,
}: LocaleToolPageProps): Promise<Metadata> {
  const { locale, tool: toolId } = params;

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    return {};
  }

  const tool = getToolById(toolId);
  if (!tool) {
    return {
      title: 'Tool Not Found - ToolsLab',
      description: 'The requested tool was not found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const dict = await getDictionary(locale as Locale);
  const toolDict = dict.tools[toolId];

  if (!toolDict) {
    // Fallback to English if translation is missing
    const enDict = await getDictionary('en');
    const enToolDict = enDict.tools[toolId];

    if (!enToolDict) {
      return {
        title: `${tool.name} - ToolsLab`,
        description: tool.description,
      };
    }
  }

  // Get primary category name
  const primaryCategory = categories.find(
    (cat) => cat.id === tool.categories[0]
  );
  const categoryDict = dict.categories[primaryCategory?.id || 'dev'];
  const categoryName = categoryDict?.name || primaryCategory?.name || 'Tools';

  // Generate comprehensive keywords
  const keywords = [
    toolDict?.title.toLowerCase() || tool.name.toLowerCase(),
    ...tool.keywords,
    locale === 'it' ? 'strumento online' : 'online tool',
    locale === 'it' ? 'strumento gratuito' : 'free tool',
    locale === 'it' ? 'strumento sviluppatore' : 'developer tool',
    locale === 'it' ? 'strumento web' : 'web tool',
    categoryName.toLowerCase(),
    'toolslab',
  ];

  const metaTitle =
    toolDict?.meta?.title ||
    `${toolDict?.title || tool.name} - ${locale === 'it' ? 'Strumento Online Gratuito' : 'Free Online Tool'} | ToolsLab`;
  const metaDescription =
    toolDict?.meta?.description || toolDict?.description || tool.description;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: keywords.join(', '),
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: 'website',
      url: `https://toolslab.dev/${locale}/tools/${toolId}`,
      images: [
        {
          url: `/tools/${toolId}/opengraph-image.png`,
          width: 1200,
          height: 630,
          alt: `${toolDict?.title || tool.name} - ToolsLab`,
        },
      ],
      siteName: 'ToolsLab',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${toolDict?.title || tool.name} - ToolsLab`,
      description: toolDict?.description || tool.description,
      images: [`/tools/${toolId}/opengraph-image.png`],
      creator: '@toolslab',
    },
    alternates: {
      canonical: `https://toolslab.dev/${locale}/tools/${toolId}`,
      languages: generateHreflangAlternates({
        pageType: 'tool',
        path: toolId,
      }),
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function LocaleToolPage({ params }: LocaleToolPageProps) {
  const { locale, tool: toolId } = params;

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const tool = getToolById(toolId);
  if (!tool) {
    notFound();
  }

  const dict = await getDictionary(locale as Locale);
  const toolSchema = await generateToolSchema(toolId);

  // Extract tool-specific translations from granular JSON files
  const toolData = dict.tools?.[toolId] as any;

  const toolTranslations = {
    title: toolData?.title || tool.name,
    description: toolData?.description || tool.description,
    tagline: toolData?.tagline,
    pageDescription: toolData?.pageDescription,
    placeholder: toolData?.placeholder,
    instructions: toolData?.instructions,
  };

  // Generate localized schema
  const localizedSchema = {
    ...toolSchema,
    name: toolTranslations.title,
    description: toolTranslations.description,
    url: `https://toolslab.dev/${locale}/tools/${toolId}`,
    inLanguage: locale === 'it' ? 'it-IT' : 'en-US',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localizedSchema) }}
      />
      <ToolPageClient
        toolId={toolId}
        locale={locale as Locale}
        dictionary={dict}
        toolTranslations={toolTranslations}
      />
    </>
  );
}

export async function generateStaticParams() {
  // Generate paths for all tool/locale combinations
  const paths = [];

  for (const locale of locales) {
    for (const tool of tools) {
      paths.push({
        locale,
        tool: tool.id,
      });
    }
  }

  return paths;
}
