'use client';

import { motion } from 'framer-motion';
import { Check, X, Shield } from 'lucide-react';

const commitments = [
  { text: '100% free to use, forever', icon: Check, positive: true },
  { text: 'No account ever required', icon: Check, positive: true },
  { text: 'Your data stays in your browser', icon: Check, positive: true },
  { text: 'New tools added regularly', icon: Check, positive: true },
  { text: 'Open to community suggestions', icon: Check, positive: true },
  { text: 'Code is fully open source', icon: Check, positive: true },
  { text: 'Privacy-first analytics with Umami', icon: Check, positive: true },
  { text: 'Will never paywall existing tools', icon: X, positive: false },
  { text: 'Will never track or profile you', icon: X, positive: false },
];

export function CommitmentSection() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl"
        >
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-2 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400">
              <Shield className="h-5 w-5" />
              <span className="font-medium">The Promise</span>
            </div>
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              The{' '}
              <span className="text-violet-600 dark:text-violet-400">
                ToolsLab
              </span>{' '}
              Commitment
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              As long as ToolsLab exists:
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-800 dark:bg-gray-900">
            <div className="grid gap-4">
              {commitments.map((commitment, index) => {
                const Icon = commitment.icon;
                const isPositive = commitment.positive;

                return (
                  <motion.div
                    key={commitment.text}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center gap-4 rounded-xl p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        isPositive
                          ? 'bg-green-100 text-green-600 dark:bg-green-950/30 dark:text-green-400'
                          : 'bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`text-lg font-medium ${
                        isPositive
                          ? 'text-gray-800 dark:text-gray-200'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {commitment.text}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-8 rounded-xl border-l-4 border-violet-500 bg-gradient-to-r from-violet-50 to-purple-50 p-6 dark:from-violet-950/20 dark:to-purple-950/20">
              <p className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
                This isn&apos;t just marketing copy.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                These commitments are built into the fundamental architecture of
                ToolsLab. Your tools work offline, your data never hits our
                servers, and there&apos;s no user tracking infrastructure to
                &ldquo;accidentally&rdquo; turn on later.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
