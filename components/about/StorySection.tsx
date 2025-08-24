'use client';

import { motion } from 'framer-motion';
import { Code, Coffee, Heart, Clock } from 'lucide-react';

export function StorySection() {
  return (
    <section className="bg-gray-50 py-12 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl"
        >
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
              <Heart className="h-5 w-5" />
              <span className="font-medium">The Story</span>
            </div>
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              Built by a developer,{' '}
              <span className="text-violet-600 dark:text-violet-400">
                for developers
              </span>
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-800 dark:bg-gray-900 md:p-12">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-purple-600 text-2xl">
                👋
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  Hi, I&apos;m a developer like you
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Building tools that should exist
                </p>
              </div>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="mb-6 text-lg leading-relaxed">
                I built ToolsLab during{' '}
                <span className="font-semibold text-violet-600 dark:text-violet-400">
                  late nights and weekends
                </span>{' '}
                because I needed these tools to exist. Not as a startup, not as
                a data-harvesting operation. Just simple, fast, private tools.
              </p>

              <div className="my-8 grid gap-6 md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Code className="mt-1 h-6 w-6 flex-shrink-0 text-violet-500" />
                  <div>
                    <h4 className="mb-1 font-semibold">No venture capital</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      No pressure to monetize everything
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="mt-1 h-6 w-6 flex-shrink-0 text-emerald-500" />
                  <div>
                    <h4 className="mb-1 font-semibold">No exit strategy</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Built to last, not to flip
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Coffee className="mt-1 h-6 w-6 flex-shrink-0 text-orange-500" />
                  <div>
                    <h4 className="mb-1 font-semibold">No corporate roadmap</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Just solving real developer problems
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Heart className="mt-1 h-6 w-6 flex-shrink-0 text-red-500" />
                  <div>
                    <h4 className="mb-1 font-semibold">Just passion</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      One developer making tools for others
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border-l-4 border-violet-500 bg-gradient-to-r from-violet-50 to-purple-50 p-6 dark:from-violet-950/30 dark:to-purple-950/30">
                <p className="mb-2 text-lg font-medium text-gray-800 dark:text-gray-200">
                  &ldquo;I use these tools every day in my own work.&rdquo;
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  If they don&apos;t work perfectly for me, they won&apos;t work
                  for you either. That&apos;s my quality guarantee.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
