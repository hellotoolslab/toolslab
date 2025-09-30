'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, TrendingUp, Clock } from 'lucide-react';
import { tools } from '@/lib/tools';
import { type Locale, defaultLocale } from '@/lib/i18n/config';
import { type Dictionary } from '@/lib/i18n/get-dictionary';
import { useLocale } from '@/hooks/useLocale';

// Get featured tools (new ones or without label, excluding coming-soon)
const featuredTools = tools
  .filter((tool) => {
    // Exclude coming-soon tools first
    if (tool.label === 'coming-soon') return false;
    // Include tools with label "new" or empty/undefined label
    return (
      tool.label === 'new' || tool.label === '' || tool.label === undefined
    );
  })
  .slice(0, 6);

interface FeaturedToolsProps {
  locale?: Locale;
  dictionary?: Dictionary;
}

export function FeaturedTools({
  locale = defaultLocale,
  dictionary,
}: FeaturedToolsProps) {
  const { createHref } = useLocale();

  return (
    <section className="bg-gray-50 py-16 dark:bg-gray-900 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Centered header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {dictionary?.home?.popular?.title || 'Most Used This Week'}
          </h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            {dictionary?.home?.popular?.subtitle ||
              'Join hundreds of developers using these tools daily'}
          </p>
          <Link
            href={createHref('/tools')}
            className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {dictionary?.common?.nav?.allTools || 'View all tools'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {featuredTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Link
                  href={createHref(tool.route)}
                  className="group relative block h-full overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800"
                >
                  {/* Tool label badge */}
                  {tool.label && (
                    <div className="absolute right-4 top-4">
                      {tool.label === 'new' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1 text-xs font-bold text-white">
                          NEW
                        </span>
                      )}
                      {tool.label === 'popular' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 px-3 py-1 text-xs font-bold text-white">
                          <TrendingUp className="h-3 w-3" />
                          POPULAR
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    {/* Tool icon */}
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-2xl dark:from-blue-900/20 dark:to-blue-800/20">
                      {tool.icon}
                    </div>

                    {/* Tool info */}
                    <div className="flex-1">
                      <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                        {dictionary?.tools?.[tool.id]?.title || tool.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {(
                          dictionary?.tools?.[tool.id]?.description ||
                          tool.description
                        )
                          .split(' ')
                          .slice(0, 10)
                          .join(' ')}
                        ...
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span>Instant</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center gap-2 font-medium text-blue-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:text-blue-400">
                      Try Now
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                  </div>

                  {/* Live indicator */}
                  <div className="absolute left-4 top-4">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <div className="absolute inset-0 h-2 w-2 animate-ping rounded-full bg-green-500"></div>
                      </div>
                      <span className="text-xs font-medium text-green-600 dark:text-green-400">
                        Live
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Mobile view all link */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href={createHref('/tools')}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            {dictionary?.common?.nav?.allTools || 'View all tools'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
