'use client';

import { motion } from 'framer-motion';
import { Zap, Shield, Link, Moon, Smartphone, Rocket } from 'lucide-react';
import { type Locale } from '@/lib/i18n/config';
import { type Dictionary } from '@/lib/i18n/get-dictionary';

const benefitKeys = [
  {
    key: 'instantProcessing',
    icon: Zap,
    color: 'from-yellow-400 to-orange-500',
  },
  {
    key: 'zeroDataStorage',
    icon: Shield,
    color: 'from-green-400 to-emerald-500',
  },
  {
    key: 'chainTools',
    icon: Link,
    color: 'from-blue-400 to-indigo-500',
  },
  {
    key: 'darkMode',
    icon: Moon,
    color: 'from-purple-400 to-pink-500',
  },
  {
    key: 'worksEverywhere',
    icon: Smartphone,
    color: 'from-cyan-400 to-blue-500',
  },
  {
    key: 'noSignup',
    icon: Rocket,
    color: 'from-red-400 to-orange-500',
  },
];

interface WhyToolsLabProps {
  locale?: Locale;
  dictionary?: Dictionary;
}

export function WhyToolsLab({ locale, dictionary }: WhyToolsLabProps) {
  // Fallback texts for when dictionary is not available
  const defaultTexts = {
    title: 'Why Choose ToolsLab?',
    subtitle: 'Six reasons developers love our platform',
    footer: 'Built with ❤️ by developers who understand your needs',
  };

  const texts = {
    title: dictionary?.home?.whyToolsLab?.title || defaultTexts.title,
    subtitle: dictionary?.home?.whyToolsLab?.subtitle || defaultTexts.subtitle,
    footer: dictionary?.home?.whyToolsLab?.footer || defaultTexts.footer,
  };

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {texts.title}
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            {texts.subtitle}
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {benefitKeys.map((benefit, index) => {
            const Icon = benefit.icon;
            const benefitData =
              dictionary?.home?.whyToolsLab?.benefits?.[
                benefit.key as keyof typeof dictionary.home.whyToolsLab.benefits
              ];

            return (
              <motion.div
                key={benefit.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
                  {/* Background gradient on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
                  />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div
                      className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${benefit.color} text-white shadow-lg`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    {/* Content */}
                    <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                      {benefitData?.title || benefit.key}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {benefitData?.description || ''}
                    </p>

                    {/* Decorative element */}
                    <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 opacity-20 dark:from-gray-700 dark:to-gray-800" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional trust message */}
        <div className="mt-12 text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {texts.footer}
          </p>
        </div>
      </div>
    </section>
  );
}
