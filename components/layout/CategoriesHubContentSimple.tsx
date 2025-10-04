'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, X } from 'lucide-react';
import { categories, getCategoryColorClass } from '@/lib/tools';
import { useLocale } from '@/hooks/useLocale';
import { type Dictionary } from '@/lib/i18n/get-dictionary';
import { type Locale } from '@/lib/i18n/config';

interface CategoriesHubContentSimpleProps {
  locale?: Locale;
  dictionary?: Dictionary;
}

export default function CategoriesHubContentSimple({
  locale: serverLocale,
  dictionary: serverDictionary,
}: CategoriesHubContentSimpleProps) {
  const { locale: clientLocale, createHref } = useLocale();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Use server props if available, otherwise client-side detection
  const locale = serverLocale || clientLocale;
  const dictionary = serverDictionary;

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalTools = categories.reduce(
    (sum, category) => sum + category.tools.length,
    0
  );

  const filteredCategories = categories.filter(
    (category) =>
      searchQuery === '' ||
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.tools.some(
        (tool) =>
          tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.keywords.some((keyword) =>
            keyword.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
  );

  const clearSearch = () => {
    setSearchQuery('');
  };

  // Show loading state during hydration
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="animate-pulse">
          <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 py-20">
            <div className="mx-auto max-w-4xl px-4 text-center">
              <div className="mx-auto mb-4 h-12 w-96 rounded bg-white/20" />
              <div className="w-128 mx-auto mb-8 h-6 rounded bg-white/20" />
            </div>
          </div>
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-40 rounded-xl bg-gray-200 dark:bg-gray-700"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Localized text
  const text = {
    title: locale === 'it' ? 'Categorie Strumenti' : 'Tool Categories',
    subtitle:
      locale === 'it'
        ? `${totalTools}+ strumenti professionali per sviluppatori organizzati in ${categories.length} categorie specializzate.`
        : `${totalTools}+ professional developer tools organized into ${categories.length} specialized categories.`,
    searchPlaceholder:
      locale === 'it' ? 'Cerca categorie...' : 'Search categories...',
    clearSearch: locale === 'it' ? 'Cancella' : 'Clear',
    toolsText: locale === 'it' ? 'strumenti' : 'tools',
    exploreText: locale === 'it' ? 'Esplora' : 'Explore',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Breadcrumbs */}
            <nav className="mb-5 flex justify-center" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm text-white/80">
                <li>
                  <Link
                    href={createHref('/')}
                    className="transition-colors hover:text-white"
                  >
                    {locale === 'it' ? 'Home' : 'Home'}
                  </Link>
                </li>
                <li>
                  <ArrowRight className="h-3 w-3" />
                </li>
                <li className="font-medium text-white">{text.title}</li>
              </ol>
            </nav>

            {/* Hero Icon */}
            <div className="mb-5 flex justify-center">
              <div className="text-5xl lg:text-6xl">🛠️</div>
            </div>

            {/* Main Heading */}
            <h1 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
              {locale === 'it' ? (
                <>
                  Esplora le{' '}
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Categorie
                  </span>{' '}
                  di Strumenti
                </>
              ) : (
                <>
                  Explore Tool{' '}
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Categories
                  </span>
                </>
              )}
            </h1>

            {/* Simplified Header Description */}
            <div className="mx-auto mb-8 max-w-3xl">
              <p className="text-lg text-white/90 lg:text-xl">
                {text.subtitle}
              </p>
            </div>

            {/* Search Bar */}
            <div className="mx-auto mb-6 max-w-2xl">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Search className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={text.searchPlaceholder}
                  className="w-full rounded-full border border-gray-300 bg-white/90 py-3 pl-12 pr-12 text-gray-900 placeholder-gray-500 backdrop-blur-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800/90 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-400"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
              {searchQuery && (
                <p className="mt-2 text-sm text-white/80">
                  {locale === 'it'
                    ? `Trovate ${filteredCategories.length} categorie corrispondenti a "${searchQuery}"`
                    : `Found ${filteredCategories.length} categories matching "${searchQuery}"`}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mb-6 flex flex-wrap items-center justify-center gap-4">
              <Link
                href={createHref('/tools')}
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:scale-105 hover:bg-blue-700"
              >
                {locale === 'it' ? 'Sfoglia Tutti i' : 'Browse All'}{' '}
                {totalTools} {locale === 'it' ? 'Strumenti' : 'Tools'}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={createHref('/?popular=true')}
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                {locale === 'it' ? 'Strumenti Popolari' : 'Popular Tools'}
              </Link>
            </div>

            {/* Feature Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/90">
              <div className="flex items-center gap-2">
                <span>⚡</span>
                <span>
                  {locale === 'it' ? 'Velocissimo' : 'Lightning fast'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>🔒</span>
                <span>
                  {locale === 'it' ? 'Privacy garantita' : 'Privacy first'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>❤️</span>
                <span>{locale === 'it' ? 'Sempre gratis' : 'Always free'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="border-y border-gray-800 bg-gray-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-base leading-relaxed text-gray-300">
            {locale === 'it' ? (
              <>
                Che tu stia{' '}
                <Link
                  href={createHref('/tools/json-formatter')}
                  className="text-blue-400 underline underline-offset-2 hover:text-blue-300"
                >
                  formattando dati JSON
                </Link>
                ,{' '}
                <Link
                  href={createHref('/tools/base64-encode')}
                  className="text-blue-400 underline underline-offset-2 hover:text-blue-300"
                >
                  codificando stringhe Base64
                </Link>
                , o{' '}
                <Link
                  href={createHref('/tools/hash-generator')}
                  className="text-blue-400 underline underline-offset-2 hover:text-blue-300"
                >
                  generando hash sicuri
                </Link>
                , il nostro approccio categorizzato ti aiuta a trovare lo
                strumento giusto istantaneamente. Ogni categoria contiene
                utilità testate sul campo usate da migliaia di sviluppatori in
                tutto il mondo, dalla{' '}
                <strong className="text-white">conversione dati</strong> e{' '}
                <strong className="text-white">operazioni di sicurezza</strong>{' '}
                all&apos;
                <strong className="text-white">
                  elaborazione testi
                </strong> e{' '}
                <strong className="text-white">generazione codice</strong>.
                Risparmia tempo navigando tra gli strumenti che si completano a
                vicenda all&apos;interno di raggruppamenti logici progettati per
                scenari di sviluppo reali.
              </>
            ) : locale === 'es' ? (
              <>
                Ya sea que estés{' '}
                <Link
                  href={createHref('/tools/json-formatter')}
                  className="text-blue-400 underline underline-offset-2 hover:text-blue-300"
                >
                  formateando datos JSON
                </Link>
                ,{' '}
                <Link
                  href={createHref('/tools/base64-encode')}
                  className="text-blue-400 underline underline-offset-2 hover:text-blue-300"
                >
                  codificando cadenas Base64
                </Link>
                , o{' '}
                <Link
                  href={createHref('/tools/hash-generator')}
                  className="text-blue-400 underline underline-offset-2 hover:text-blue-300"
                >
                  generando hashes seguros
                </Link>
                , nuestro enfoque categorizado te ayuda a encontrar la
                herramienta correcta al instante. Cada categoría contiene
                utilidades probadas en batalla utilizadas por miles de
                desarrolladores en todo el mundo, desde{' '}
                <strong className="text-white">conversión de datos</strong> y{' '}
                <strong className="text-white">operaciones de seguridad</strong>{' '}
                hasta{' '}
                <strong className="text-white">procesamiento de texto</strong> y{' '}
                <strong className="text-white">generación de código</strong>.
                Ahorra tiempo navegando por flujos de trabajo complejos
                explorando herramientas que se complementan entre sí dentro de
                agrupaciones lógicas diseñadas para escenarios de desarrollo del
                mundo real.
              </>
            ) : locale === 'fr' ? (
              <>
                Que vous soyez en train de{' '}
                <Link
                  href={createHref('/tools/json-formatter')}
                  className="text-blue-400 underline underline-offset-2 hover:text-blue-300"
                >
                  formater des données JSON
                </Link>
                ,{' '}
                <Link
                  href={createHref('/tools/base64-encode')}
                  className="text-blue-400 underline underline-offset-2 hover:text-blue-300"
                >
                  encoder des chaînes Base64
                </Link>
                , ou{' '}
                <Link
                  href={createHref('/tools/hash-generator')}
                  className="text-blue-400 underline underline-offset-2 hover:text-blue-300"
                >
                  générer des hachages sécurisés
                </Link>
                , notre approche catégorisée vous aide à trouver le bon outil
                instantanément. Chaque catégorie contient des utilitaires
                éprouvés utilisés par des milliers de développeurs dans le monde
                entier, de la{' '}
                <strong className="text-white">conversion de données</strong> et
                des{' '}
                <strong className="text-white">opérations de sécurité</strong>{' '}
                au <strong className="text-white">traitement de texte</strong>{' '}
                et à la{' '}
                <strong className="text-white">génération de code</strong>.
                Gagnez du temps en naviguant dans des flux de travail complexes
                en parcourant des outils qui se complètent mutuellement au sein
                de groupements logiques conçus pour des scénarios de
                développement réels.
              </>
            ) : (
              <>
                Whether you&apos;re{' '}
                <Link
                  href={createHref('/tools/json-formatter')}
                  className="text-blue-400 underline underline-offset-2 hover:text-blue-300"
                >
                  formatting JSON data
                </Link>
                ,{' '}
                <Link
                  href={createHref('/tools/base64-encode')}
                  className="text-blue-400 underline underline-offset-2 hover:text-blue-300"
                >
                  encoding Base64 strings
                </Link>
                , or{' '}
                <Link
                  href={createHref('/tools/hash-generator')}
                  className="text-blue-400 underline underline-offset-2 hover:text-blue-300"
                >
                  generating secure hashes
                </Link>
                , our categorized approach helps you find the right tool
                instantly. Each category contains battle-tested utilities used
                by thousands of developers worldwide, from{' '}
                <strong className="text-white">data conversion</strong> and{' '}
                <strong className="text-white">security operations</strong> to{' '}
                <strong className="text-white">text processing</strong> and{' '}
                <strong className="text-white">code generation</strong>. Save
                time navigating complex workflows by browsing tools that
                complement each other within logical groupings designed for
                real-world development scenarios.
              </>
            )}
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.map((category, index) => {
              const getCategoryGradient = (categoryId: string) => {
                switch (categoryId) {
                  case 'data':
                    return {
                      border: 'border-blue-400',
                      gradient:
                        'from-blue-900/40 via-blue-800/30 to-blue-900/40',
                      icon: 'bg-gradient-to-br from-blue-500 to-blue-600',
                    };
                  case 'encoding':
                    return {
                      border: 'border-green-400',
                      gradient:
                        'from-green-900/40 via-green-800/30 to-green-900/40',
                      icon: 'bg-gradient-to-br from-green-500 to-green-600',
                    };
                  case 'text':
                    return {
                      border: 'border-purple-400',
                      gradient:
                        'from-purple-900/40 via-purple-800/30 to-purple-900/40',
                      icon: 'bg-gradient-to-br from-purple-500 to-purple-600',
                    };
                  case 'generators':
                    return {
                      border: 'border-orange-400',
                      gradient:
                        'from-orange-900/40 via-orange-800/30 to-orange-900/40',
                      icon: 'bg-gradient-to-br from-orange-500 to-orange-600',
                    };
                  case 'web':
                    return {
                      border: 'border-pink-400',
                      gradient:
                        'from-pink-900/40 via-pink-800/30 to-pink-900/40',
                      icon: 'bg-gradient-to-br from-pink-500 to-pink-600',
                    };
                  case 'dev':
                    return {
                      border: 'border-yellow-400',
                      gradient:
                        'from-yellow-900/40 via-yellow-800/30 to-yellow-900/40',
                      icon: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
                    };
                  case 'formatters':
                    return {
                      border: 'border-indigo-400',
                      gradient:
                        'from-indigo-900/40 via-indigo-800/30 to-indigo-900/40',
                      icon: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
                    };
                  default:
                    return {
                      border: 'border-gray-400',
                      gradient:
                        'from-gray-900/40 via-gray-800/30 to-gray-900/40',
                      icon: 'bg-gradient-to-br from-gray-500 to-gray-600',
                    };
                }
              };

              const categoryStyle = getCategoryGradient(category.id);

              return (
                <Link
                  key={category.id}
                  href={createHref(`/category/${category.id}`)}
                  className="group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className={`relative flex min-h-[320px] flex-col overflow-hidden rounded-2xl border-2 ${categoryStyle.border} bg-gradient-to-br ${categoryStyle.gradient} p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}
                  >
                    {/* Icon in top-left with larger size */}
                    <div className="mb-6 flex items-start justify-between">
                      <div
                        className={`flex h-16 w-16 items-center justify-center rounded-2xl ${categoryStyle.icon} text-3xl shadow-lg`}
                      >
                        {category.icon}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="mb-3 text-2xl font-bold text-white">
                      {dictionary?.categories?.[category.id]?.name ||
                        category.name}
                    </h3>

                    {/* Description */}
                    <p className="mb-4 flex-grow leading-relaxed text-white/80">
                      {dictionary?.categories?.[category.id]?.description ||
                        category.description}
                    </p>

                    {/* Tool count with icon */}
                    <div className="mt-auto flex items-center gap-2 text-sm text-white/90">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        />
                      </svg>
                      <span>
                        {category.tools.length} {text.toolsText}
                      </span>
                      <ArrowRight className="ml-auto h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </div>

                    {/* Background decorative element */}
                    <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 opacity-10">
                      <div className="text-8xl">{category.icon}</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-bold text-white">
            {locale === 'it' ? 'Pronti per iniziare?' : 'Ready to get started?'}
          </h2>
          <p className="mb-8 text-xl text-white/90">
            {locale === 'it'
              ? `Esplora tutti i ${totalTools}+ strumenti o immergiti in categorie specifiche.`
              : `Explore all ${totalTools}+ tools or dive into specific categories.`}
          </p>
          <Link
            href={createHref('/tools')}
            className="inline-flex items-center rounded-full bg-white px-8 py-4 font-semibold text-blue-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            {locale === 'it'
              ? 'Sfoglia Tutti gli Strumenti'
              : 'Browse All Tools'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
