'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  categories,
  getToolsByCategory,
  getCategoryColorClass,
} from '@/lib/tools';
import { ToolCardWrapper } from '@/components/tools/ToolCardWrapper';
import { SearchBar } from '@/components/SearchBar';
import {
  getCategorySEO,
  generateCategoryStructuredData,
} from '@/lib/category-seo';
import { getToolById } from '@/lib/tools';
import {
  ChevronRight,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Zap,
  Shield,
  Clock,
  ArrowRight,
} from 'lucide-react';
import Script from 'next/script';
import { type Locale } from '@/lib/i18n/config';
import { type Dictionary } from '@/lib/i18n/get-dictionary';
import { useLocale } from '@/hooks/useLocale';

interface LocaleCategoryPageContentProps {
  categoryId: string;
  locale: Locale;
  dictionary: Dictionary;
}

export default function LocaleCategoryPageContent({
  categoryId,
  locale,
  dictionary,
}: LocaleCategoryPageContentProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const { createHref } = useLocale();

  const category = categories.find((cat) => cat.id === categoryId);
  const seoContent = getCategorySEO(categoryId);

  if (!category || !seoContent) {
    return <div>Category not found</div>;
  }

  const tools = getToolsByCategory(category.id);
  const structuredData = generateCategoryStructuredData(seoContent);

  // Get localized category data
  const categoryDict = dictionary.categories[categoryId];
  const categoryName = categoryDict?.name || category.name;
  const categoryDescription = categoryDict?.description || category.description;

  // Translate FAQs based on locale
  const getLocalizedFaqs = () => {
    if (locale === 'it') {
      // Italian translations for category FAQs
      const italianFaqs: Record<
        string,
        Array<{ question: string; answer: string }>
      > = {
        text: [
          {
            question: 'Quali formati di testo posso elaborare?',
            answer:
              'I nostri strumenti supportano testo semplice, Markdown, HTML, e vari formati di codice con evidenziazione della sintassi e validazione in tempo reale.',
          },
          {
            question: 'Posso elaborare file di testo di grandi dimensioni?',
            answer:
              "Sì, puoi elaborare file fino a 50MB direttamente nel tuo browser. Tutta l'elaborazione avviene localmente per massima velocità e privacy.",
          },
          {
            question: 'È sicuro elaborare documenti sensibili?',
            answer:
              'Assolutamente. Tutto avviene localmente nel tuo browser. I tuoi dati non lasciano mai il tuo dispositivo, garantendo completa privacy e sicurezza.',
          },
        ],
        data: [
          {
            question: 'Quali formati di file posso convertire?',
            answer:
              'I nostri strumenti supportano JSON, CSV, XML, YAML, Base64 e formati di testo semplice con rilevamento automatico e validazione.',
          },
          {
            question: "C'è un limite di dimensione del file?",
            answer:
              "Puoi elaborare file fino a 50MB direttamente nel tuo browser. Tutta l'elaborazione avviene localmente per massima velocità e privacy.",
          },
          {
            question: 'Quanto è sicuro il processo di conversione?',
            answer:
              'Tutte le conversioni avvengono localmente nel tuo browser. I tuoi dati non lasciano mai il tuo dispositivo, garantendo completa privacy e sicurezza.',
          },
        ],
        encoding: [
          {
            question: 'Quali standard di codifica supportate?',
            answer:
              'Supportiamo Base64, URL encoding, JWT, hash (SHA, MD5, bcrypt) e molti altri standard di codifica e sicurezza.',
          },
          {
            question: 'Posso decodificare token JWT?',
            answer:
              'Sì, il nostro JWT Decoder analizza e visualizza header, payload e signature. Ricorda che tutti i processi avvengono localmente nel tuo browser.',
          },
          {
            question: 'Come funziona la generazione di hash?',
            answer:
              'Supportiamo vari algoritmi (MD5, SHA-1, SHA-256, SHA-512, bcrypt). Tutti gli hash vengono generati localmente nel tuo browser per massima sicurezza.',
          },
        ],
        generators: [
          {
            question: 'Quali tipi di dati posso generare?',
            answer:
              'Puoi generare UUID, password sicure, hash, colori, QR code, dati mock e molto altro con opzioni personalizzabili.',
          },
          {
            question: 'I dati generati sono sicuri da usare?',
            answer:
              'Sì, utilizziamo algoritmi crittografici sicuri. UUID e password sono generati con entropia elevata per massima sicurezza.',
          },
          {
            question: 'Posso personalizzare le opzioni di generazione?',
            answer:
              'Assolutamente! Ogni generatore offre opzioni avanzate per lunghezza, caratteri speciali, formati e altri parametri specifici.',
          },
        ],
        dev: [
          {
            question: 'Quali utilità per sviluppatori offrite?',
            answer:
              'Offriamo crontab builder, regex tester, diff checker, validatori di codice e molti altri strumenti essenziali per lo sviluppo.',
          },
          {
            question: 'Posso testare espressioni regolari complesse?',
            answer:
              'Sì, il nostro Regex Tester supporta tutti i pattern con evidenziazione dei match in tempo reale, spiegazioni e test cases.',
          },
          {
            question: 'Il crontab builder supporta tutti i formati?',
            answer:
              'Sì, supporta la sintassi standard cron con validazione in tempo reale e descrizioni leggibili delle espressioni generate.',
          },
        ],
        pdf: [
          {
            question: 'Quanto è accurata la conversione da PDF a Word?',
            answer:
              'Il nostro convertitore PDF to Word utilizza algoritmi avanzati per preservare formattazione, immagini, tabelle e layout del testo con oltre il 90% di accuratezza, paragonabile a strumenti professionali come Adobe Acrobat.',
          },
          {
            question: 'Quali sono i limiti di dimensione del file?',
            answer:
              "Puoi elaborare file PDF fino a 10MB. Tutte le conversioni avvengono su server sicuri con pulizia automatica dopo l'elaborazione.",
          },
          {
            question: 'I miei dati sono sicuri durante la conversione?',
            answer:
              "Sì, tutte le conversioni avvengono su server sicuri con trasmissione crittografata. I file vengono automaticamente eliminati dopo l'elaborazione e non accediamo mai ai tuoi documenti.",
          },
        ],
      };

      return italianFaqs[categoryId] || seoContent.faqs;
    }

    if (locale === 'es') {
      // Spanish translations for category FAQs
      const spanishFaqs: Record<
        string,
        Array<{ question: string; answer: string }>
      > = {
        pdf: [
          {
            question: '¿Qué tan precisa es la conversión de PDF a Word?',
            answer:
              'Nuestro convertidor de PDF a Word utiliza algoritmos avanzados para preservar el formato, imágenes, tablas y diseño del texto con más del 90% de precisión, comparable a herramientas profesionales como Adobe Acrobat.',
          },
          {
            question: '¿Cuáles son los límites de tamaño de archivo?',
            answer:
              'Puedes procesar archivos PDF de hasta 10MB. Todas las conversiones se realizan en servidores seguros con limpieza automática después del procesamiento.',
          },
          {
            question: '¿Mis datos están seguros durante la conversión?',
            answer:
              'Sí, todas las conversiones se realizan en servidores seguros con transmisión encriptada. Los archivos se eliminan automáticamente después del procesamiento y nunca accedemos a tus documentos.',
          },
        ],
      };

      return spanishFaqs[categoryId] || seoContent.faqs;
    }

    if (locale === 'fr') {
      // French translations for category FAQs
      const frenchFaqs: Record<
        string,
        Array<{ question: string; answer: string }>
      > = {
        pdf: [
          {
            question:
              'Quelle est la précision de la conversion PDF vers Word ?',
            answer:
              'Notre convertisseur PDF vers Word utilise des algorithmes avancés pour préserver la mise en forme, les images, les tableaux et la disposition du texte avec plus de 90% de précision, comparable aux outils professionnels comme Adobe Acrobat.',
          },
          {
            question: 'Quelles sont les limites de taille de fichier ?',
            answer:
              "Vous pouvez traiter des fichiers PDF jusqu'à 10MB. Toutes les conversions se font sur des serveurs sécurisés avec nettoyage automatique après le traitement.",
          },
          {
            question:
              'Mes données sont-elles sécurisées pendant la conversion ?',
            answer:
              "Oui, toutes les conversions se font sur des serveurs sécurisés avec transmission cryptée. Les fichiers sont automatiquement supprimés après le traitement et nous n'accédons jamais à vos documents.",
          },
        ],
      };

      return frenchFaqs[categoryId] || seoContent.faqs;
    }

    if (locale === 'de') {
      // German translations for category FAQs
      const germanFaqs: Record<
        string,
        Array<{ question: string; answer: string }>
      > = {
        pdf: [
          {
            question: 'Wie genau ist die PDF-zu-Word-Konvertierung?',
            answer:
              'Unser PDF-zu-Word-Konverter verwendet fortschrittliche Algorithmen, um Formatierung, Bilder, Tabellen und Textlayout mit über 90% Genauigkeit zu erhalten, vergleichbar mit professionellen Tools wie Adobe Acrobat.',
          },
          {
            question: 'Welche Dateigrößenlimits gibt es?',
            answer:
              'Sie können PDF-Dateien bis zu 10MB verarbeiten. Alle Konvertierungen erfolgen auf sicheren Servern mit automatischer Bereinigung nach der Verarbeitung.',
          },
          {
            question: 'Sind meine Daten während der Konvertierung sicher?',
            answer:
              'Ja, alle Konvertierungen erfolgen auf sicheren Servern mit verschlüsselter Übertragung. Dateien werden nach der Verarbeitung automatisch gelöscht und wir greifen niemals auf Ihre Dokumente zu.',
          },
        ],
      };

      return germanFaqs[categoryId] || seoContent.faqs;
    }

    return seoContent.faqs;
  };

  const localizedFaqs = getLocalizedFaqs();

  // Helper function to get tool label
  const getToolLabelForTool = (toolId: string) => {
    const tool = getToolById(toolId);
    return tool?.label || '';
  };

  // Filter tools by their labels
  const newTools = tools.filter(
    (tool) => getToolLabelForTool(tool.id) === 'new'
  );
  const popularTools = tools.filter(
    (tool) => getToolLabelForTool(tool.id) === 'popular'
  );
  const testTools = tools.filter(
    (tool) => getToolLabelForTool(tool.id) === 'test'
  );
  const otherTools = tools.filter((tool) => {
    const label = getToolLabelForTool(tool.id);
    return (
      !label ||
      (label !== 'new' &&
        label !== 'popular' &&
        label !== 'coming-soon' &&
        label !== 'test')
    );
  });

  const categoryColorClass = getCategoryColorClass(category.id);

  // Get category color for inline styles
  const getCategoryColor = () => {
    const colors: Record<string, string> = {
      data: '#0EA5E9',
      encoding: '#10B981',
      text: '#8B5CF6',
      generators: '#F97316',
      web: '#EC4899',
      dev: '#F59E0B',
      formatters: '#6366F1',
      social: '#F43F5E',
    };
    return colors[categoryId] || '#3B82F6';
  };

  const categoryColor = getCategoryColor();

  // Localized text
  const text = {
    home: locale === 'it' ? 'Home' : 'Home',
    tools: dictionary.common?.nav?.allTools || 'Tools',
    categories: dictionary.common?.nav?.categories || 'Categories',
    newTools: locale === 'it' ? 'Nuovi Strumenti' : 'New Tools',
    recentlyAdded: locale === 'it' ? 'Aggiunti di Recente' : 'Recently Added',
    popularTools: locale === 'it' ? 'Strumenti Popolari' : 'Popular Tools',
    mostUsed: locale === 'it' ? 'Più Usati' : 'Most Used',
    inTesting: locale === 'it' ? 'In Testing' : 'In Testing',
    betaPhase: locale === 'it' ? 'Fase Beta' : 'Beta Phase',
    moreTools:
      locale === 'it'
        ? `Altri Strumenti per ${categoryName}`
        : `More ${categoryName} Tools`,
    faqTitle:
      locale === 'it'
        ? `Domande Frequenti sui Strumenti ${categoryName}`
        : `Frequently Asked Questions about ${categoryName} Tools`,
    relatedCategories:
      locale === 'it' ? 'Categorie Correlate' : 'Related Categories',
    needMoreTools:
      locale === 'it' ? 'Hai Bisogno di Altri Strumenti?' : 'Need More Tools?',
    exploreCollection:
      locale === 'it'
        ? `Esplora la nostra collezione completa di ${categories.reduce((sum, cat) => sum + cat.tools.length, 0)}+ strumenti per sviluppatori in tutte le categorie.`
        : `Explore our complete collection of ${categories.reduce((sum, cat) => sum + cat.tools.length, 0)}+ developer tools across all categories.`,
    browseAllTools:
      locale === 'it' ? 'Sfoglia Tutti gli Strumenti' : 'Browse All Tools',
    toolsCount: locale === 'it' ? 'strumenti' : 'tools',
    perfectFor: locale === 'it' ? '💡 Perfetto per:' : '💡 Perfect for:',
  };

  return (
    <>
      {/* Structured Data */}
      <Script
        id="category-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            ...structuredData,
            name: categoryName,
            description: categoryDescription,
            inLanguage: locale === 'it' ? 'it-IT' : 'en-US',
          }),
        }}
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        {/* Optimized Hero Section - Reduced spacing by 40% */}
        <section className="relative py-8 sm:py-10">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            {/* Breadcrumb - Minimal top margin */}
            <nav className="mb-3 flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
              <Link
                href={createHref('/')}
                className="hover:text-gray-900 dark:hover:text-gray-100"
              >
                {text.home}
              </Link>
              <ChevronRight className="h-3 w-3" />
              <Link
                href={createHref('/tools')}
                className="hover:text-gray-900 dark:hover:text-gray-100"
              >
                {text.tools}
              </Link>
              <ChevronRight className="h-3 w-3" />
              <Link
                href={createHref('/categories')}
                className="hover:text-gray-900 dark:hover:text-gray-100"
              >
                {text.categories}
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {categoryName}
              </span>
            </nav>

            {/* Header aligned with tool page design */}
            <div className="mb-2 flex items-center gap-2 sm:gap-3">
              {/* Compact Icon */}
              <div
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl shadow-sm sm:h-14 sm:w-14"
                style={{ backgroundColor: `${categoryColor}20` }}
              >
                <span className="text-2xl" style={{ color: categoryColor }}>
                  {category.icon}
                </span>
              </div>

              {/* Title inline */}
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl lg:text-4xl">
                {categoryName}
              </h1>

              {/* Category count badge */}
              <span
                className="ml-auto rounded-full px-2.5 py-1 text-xs font-medium capitalize"
                style={{
                  backgroundColor: `${categoryColor}15`,
                  color: categoryColor,
                }}
              >
                {tools.length} {text.toolsCount}
              </span>
            </div>

            {/* Description */}
            <p className="mb-4 text-base text-gray-700 dark:text-gray-300 sm:text-lg">
              {categoryDescription}
            </p>

            {/* SEO Description - proper separation */}
            <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {locale === 'it'
                ? `Scopri ${tools.length} strumenti professionali per ${categoryName.toLowerCase()}. Tutti gratuiti, sicuri e senza registrazione.`
                : seoContent.description}
            </p>

            {/* Benefits Grid - Compact */}
            <div className="mb-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
              {seoContent.benefits.slice(0, 3).map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle
                    className="h-3.5 w-3.5 flex-shrink-0"
                    style={{ color: categoryColor }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>

            {/* Use Cases - Inline */}
            <div className="mb-4 flex flex-wrap items-center gap-1">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {text.perfectFor}
              </span>
              {seoContent.useCases.map((useCase, index) => (
                <span key={index}>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {useCase}
                  </span>
                  {index < seoContent.useCases.length - 1 && (
                    <span className="mx-1 text-gray-400">•</span>
                  )}
                </span>
              ))}
            </div>

            {/* Search Bar - Simplified */}
            <div className="mb-5 w-full">
              <SearchBar />
            </div>
          </div>
        </section>

        {/* Tools Grid - Minimal spacing */}
        <section className="container mx-auto max-w-7xl px-4 pb-12 sm:px-6">
          {/* New Tools */}
          {newTools.length > 0 && (
            <section className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold sm:text-xl">
                  <Sparkles className="h-5 w-5 text-green-500" />
                  {text.newTools}
                </h2>
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  {text.recentlyAdded}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {newTools.map((tool) => (
                  <ToolCardWrapper key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          )}

          {/* Popular Tools */}
          {popularTools.length > 0 && (
            <section className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold sm:text-xl">
                  <TrendingUp className="h-5 w-5 text-yellow-500" />
                  {text.popularTools}
                </h2>
                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                  {text.mostUsed}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {popularTools.map((tool) => (
                  <ToolCardWrapper key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          )}

          {/* Test Tools */}
          {testTools.length > 0 && (
            <section className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold sm:text-xl">
                  <svg
                    className="h-5 w-5 text-blue-500"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
                  </svg>
                  {text.inTesting}
                </h2>
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  {text.betaPhase}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {testTools.map((tool) => (
                  <ToolCardWrapper key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          )}

          {/* All Other Tools */}
          {otherTools.length > 0 && (
            <section className="mb-8">
              <div className="mb-4">
                <h2 className="text-lg font-bold sm:text-xl">
                  {text.moreTools}
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {otherTools.map((tool) => (
                  <ToolCardWrapper key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          )}

          {/* FAQ Section - SEO Rich */}
          <section className="mt-12 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold">{text.faqTitle}</h2>
            <div className="space-y-3">
              {localizedFaqs.map((faq, index) => (
                <div
                  key={index}
                  className="border-b border-gray-100 pb-3 last:border-0 dark:border-gray-700"
                >
                  <button
                    onClick={() =>
                      setExpandedFaq(expandedFaq === index ? null : index)
                    }
                    className="flex w-full items-start justify-between text-left"
                  >
                    <h3 className="pr-4 text-sm font-medium text-gray-900 dark:text-white">
                      {faq.question}
                    </h3>
                    <ChevronRight
                      className={`h-4 w-4 flex-shrink-0 transition-transform ${
                        expandedFaq === index ? 'rotate-90' : ''
                      }`}
                      style={{ color: categoryColor }}
                    />
                  </button>
                  {expandedFaq === index && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Related Categories */}
          {seoContent.relatedCategories.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-3 text-lg font-bold">
                {text.relatedCategories}
              </h2>
              <div className="flex flex-wrap gap-2">
                {seoContent.relatedCategories.map((relatedId) => {
                  const relatedCategory = categories.find(
                    (c) => c.id === relatedId
                  );
                  if (!relatedCategory) return null;

                  const relatedCategoryName =
                    dictionary.categories[relatedId]?.name ||
                    relatedCategory.name;

                  return (
                    <Link
                      key={relatedId}
                      href={createHref(`/category/${relatedId}`)}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                    >
                      <span>{relatedCategory.icon}</span>
                      <span>{relatedCategoryName}</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Browse All Tools CTA - Moved to be last after Related Categories */}
          <section className="mb-8 mt-12 text-center">
            <div className="rounded-xl border border-gray-200 bg-gradient-to-r from-violet-50 to-purple-50 p-8 dark:border-gray-700 dark:from-violet-900/20 dark:to-purple-900/20">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                {text.needMoreTools}
              </h2>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                {text.exploreCollection}
              </p>
              <Link
                href={createHref('/tools')}
                className="inline-flex items-center rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                {text.browseAllTools}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </section>
        </section>
      </div>
    </>
  );
}
