'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDictionarySectionContext } from '@/components/providers/DictionaryProvider';

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-start justify-between py-4 text-left"
      >
        <span className="font-medium text-gray-900 dark:text-white">
          {question}
        </span>
        {isOpen ? (
          <ChevronUp className="ml-2 h-5 w-5 flex-shrink-0 text-gray-500" />
        ) : (
          <ChevronDown className="ml-2 h-5 w-5 flex-shrink-0 text-gray-500" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-gray-600 dark:text-gray-400">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SEOContent() {
  const { data: t } = useDictionarySectionContext('home');
  const seoContent = t?.seoContent;
  const rawFaqs = seoContent?.faqs || [];
  const faqs = Array.isArray(rawFaqs) ? rawFaqs : [];

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {seoContent?.mainTitle ||
              "The Complete Developer Toolbox You've Been Looking For"}
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            {seoContent?.intro ||
              'ToolsLab brings together 50+ essential developer tools in one fast, privacy-focused platform.'}
          </p>

          <h3 className="mt-8 text-2xl font-semibold text-gray-900 dark:text-white">
            {seoContent?.builtForDevs?.title ||
              'Built for Developers, by Developers'}
          </h3>

          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {seoContent?.builtForDevs?.description ||
              'Every tool is optimized for speed and accuracy.'}
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {seoContent?.features?.lightningFast?.title ||
                  '🚀 Lightning Fast'}
              </h4>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {seoContent?.features?.lightningFast?.description ||
                  'All tools run directly in your browser.'}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {seoContent?.features?.private?.title || '🔒 100% Private'}
              </h4>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {seoContent?.features?.private?.description ||
                  'Your data never leaves your browser.'}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {seoContent?.features?.toolChaining?.title ||
                  '🔗 Tool Chaining'}
              </h4>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {seoContent?.features?.toolChaining?.description ||
                  'Connect tools together for complex workflows.'}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {seoContent?.features?.worksEverywhere?.title ||
                  '📱 Works Everywhere'}
              </h4>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {seoContent?.features?.worksEverywhere?.description ||
                  'Responsive design that works perfectly on desktop, tablet, and mobile.'}
              </p>
            </div>
          </div>

          <h3 className="mt-12 text-2xl font-semibold text-gray-900 dark:text-white">
            {seoContent?.title || 'Frequently Asked Questions'}
          </h3>

          <div className="mt-6">
            {faqs.length > 0 &&
              faqs.map((faq: any) => (
                <FAQItem
                  key={faq.question}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))}
          </div>

          <div className="mt-12 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 p-6 dark:from-blue-900/20 dark:to-purple-900/20">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {seoContent?.ctaBox?.title ||
                'Ready to supercharge your development workflow?'}
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {seoContent?.ctaBox?.description ||
                'Join hundreds of developers who use ToolsLab daily.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
