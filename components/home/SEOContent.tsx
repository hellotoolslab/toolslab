'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: 'What makes ToolsLab different from other developer tool sites?',
    answer:
      'Unlike other tool sites, ToolsLab processes everything locally in your browser using WebAssembly and Web Workers. This means zero data storage, instant processing, and complete privacy. We also offer unique features like tool chaining for complex workflows and a clean, ad-free interface.',
  },
  {
    question: "Is ToolsLab really free? What's the catch?",
    answer:
      'Yes, ToolsLab is completely free with no hidden costs. We believe in providing value to the developer community. The platform may be supported through ethical, non-intrusive ads in the future and optional donations. There are no premium tiers, no signup walls, and no feature limitations.',
  },
  {
    question: 'How does ToolsLab ensure my data privacy?',
    answer:
      "All processing happens directly in your browser using client-side JavaScript. Your data never leaves your device or touches our servers. We don't use tracking cookies, we don't store your inputs, and we're fully GDPR compliant. You can even use ToolsLab offline once the page loads.",
  },
  {
    question: 'Can I use ToolsLab for commercial projects?',
    answer:
      'Yes, you can use ToolsLab for commercial projects, but we ethically encourage using it primarily for personal and educational purposes. ToolsLab was built as a free community resource for developers. While there are no licensing restrictions, supporting the project through donations is appreciated if you find significant commercial value.',
  },
  {
    question: 'What browsers and devices does ToolsLab support?',
    answer:
      'ToolsLab works on all modern browsers including Chrome, Firefox, Safari, and Edge. Our responsive design ensures a great experience on desktop, tablet, and mobile devices. We recommend using the latest browser version for optimal performance.',
  },
];

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
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            The Complete Developer Toolbox You&apos;ve Been Looking For
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            ToolsLab brings together{' '}
            <strong>50+ essential developer tools</strong> in one fast,
            privacy-focused platform. Whether you need to format JSON, decode
            Base64, generate UUIDs, or validate JWTs, we&apos;ve got you
            covered. Our tools are designed to save you time and streamline your
            development workflow.
          </p>

          <h3 className="mt-8 text-2xl font-semibold text-gray-900 dark:text-white">
            Built for Developers, by Developers
          </h3>

          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Every tool is optimized for speed and accuracy. No ads cluttering
            your workspace, no tracking cookies following you around, no
            mandatory signups blocking your access. Just pure functionality that
            respects your privacy and time. We understand the frustration of
            bloated tool sites, so we built something better.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                🚀 Lightning Fast
              </h4>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                All tools run directly in your browser. No server round-trips,
                no waiting for responses. Process megabytes of data in
                milliseconds.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                🔒 100% Private
              </h4>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Your data never leaves your browser. No cloud storage, no
                analytics tracking, no data mining. Complete privacy guaranteed.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                🔗 Tool Chaining
              </h4>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Connect tools together for complex workflows. Format JSON, then
                encode to Base64, then generate a hash - all in one seamless
                flow.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                📱 Works Everywhere
              </h4>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Responsive design that works perfectly on desktop, tablet, and
                mobile. Use ToolsLab wherever you code.
              </p>
            </div>
          </div>

          <h3 className="mt-12 text-2xl font-semibold text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h3>

          <div className="mt-6">
            {faqs.map((faq) => (
              <FAQItem key={faq.question} {...faq} />
            ))}
          </div>

          <div className="mt-12 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 p-6 dark:from-blue-900/20 dark:to-purple-900/20">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Ready to supercharge your development workflow?
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Join hundreds of developers who use ToolsLab daily. No signup
              required, just pick a tool and start coding smarter.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
