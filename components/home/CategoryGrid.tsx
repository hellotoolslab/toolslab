'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Database,
  Lock,
  FileText,
  Palette,
  Settings,
  Rocket,
  ChevronRight,
  Share2,
} from 'lucide-react';
import { categories } from '@/lib/tools';
import { type Locale, defaultLocale } from '@/lib/i18n/config';
import { type Dictionary } from '@/lib/i18n/get-dictionary';
import { useLocale } from '@/hooks/useLocale';

const categoryIcons = {
  data: Database,
  encoding: Lock,
  text: FileText,
  web: Palette,
  dev: Settings,
  generators: Rocket,
  formatters: FileText,
  social: Share2,
  pdf: FileText,
};

const categoryGradients = {
  data: 'from-blue-500 to-cyan-500',
  encoding: 'from-green-500 to-emerald-500',
  text: 'from-purple-500 to-pink-500',
  web: 'from-pink-500 to-rose-500',
  dev: 'from-amber-500 to-orange-500',
  generators: 'from-orange-500 to-red-500',
  formatters: 'from-indigo-500 to-purple-500',
  social: 'from-rose-500 to-pink-500',
  pdf: 'from-red-600 to-orange-600',
};

interface CategoryGridProps {
  locale?: Locale;
  dictionary?: Dictionary;
}

export function CategoryGrid({
  locale = defaultLocale,
  dictionary,
}: CategoryGridProps) {
  const { createHref } = useLocale();

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {dictionary?.home?.categories?.title || 'Explore by Category'}
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            {dictionary?.home?.categories?.viewAll ||
              'Choose from our comprehensive collection of developer tools'}
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => {
            const Icon =
              categoryIcons[category.id as keyof typeof categoryIcons] ||
              Database;
            const gradient =
              categoryGradients[
                category.id as keyof typeof categoryGradients
              ] || 'from-gray-500 to-gray-600';

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={createHref(`/category/${category.id}`)}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
                >
                  {/* Background gradient on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
                  />

                  {/* Icon and content */}
                  <div className="relative z-10 flex items-start justify-between">
                    <div className="flex-1">
                      <div
                        className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${gradient} p-3 text-white shadow-lg`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>

                      <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                        {dictionary?.categories?.[category.id]?.name ||
                          category.name}
                      </h3>

                      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                        {dictionary?.categories?.[category.id]?.description ||
                          category.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                          {category.tools.length}{' '}
                          {category.tools.length === 1 ? 'tool' : 'tools'}
                        </span>

                        <ChevronRight className="h-5 w-5 text-gray-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-300" />
                      </div>
                    </div>
                  </div>

                  {/* Popular tools preview */}
                  <div className="mt-4 flex flex-wrap gap-1">
                    {category.tools.slice(0, 3).map((tool) => (
                      <span
                        key={tool.id}
                        className="rounded-md bg-gray-50 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700/50 dark:text-gray-400"
                      >
                        {tool.name}
                      </span>
                    ))}
                    {category.tools.length > 3 && (
                      <span className="rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-500 dark:bg-gray-700/50 dark:text-gray-400">
                        +{category.tools.length - 3} more
                      </span>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
