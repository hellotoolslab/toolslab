'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Zap, Shield, Sparkles } from 'lucide-react';

export function ManifestoSection() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* The Problem */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-4xl"
        >
          <div className="mb-6 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-red-600 dark:bg-red-950/30 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">The Problem</span>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-800 dark:bg-gray-900">
            <blockquote className="text-lg italic leading-relaxed text-gray-700 dark:text-gray-300 md:text-xl">
              &ldquo;Ever tried to quickly format JSON online?
              <br />
              First, you decline cookies. Then close a newsletter popup.
              <br />
              Maybe watch an ad. Create an account. Verify your email.
              <br />
              Finally, you can paste your 10 lines of code.
              <br />
              <span className="font-semibold not-italic text-violet-600 dark:text-violet-400">
                By then, you could&apos;ve written your own formatter.
              </span>
              &rdquo;
            </blockquote>
          </div>
        </motion.div>

        {/* The Solution */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto max-w-4xl"
        >
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-green-600 dark:bg-green-950/30 dark:text-green-400">
              <Sparkles className="h-5 w-5" />
              <span className="font-medium">The Solution</span>
            </div>
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              ToolsLab:{' '}
              <span className="text-violet-600 dark:text-violet-400">
                No BS
              </span>{' '}
              Developer Tools
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="group text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 transition-transform group-hover:scale-110">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Works Instantly</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Paste, process, done.
                <br />
                No loading screens.
              </p>
            </div>

            <div className="group text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 transition-transform group-hover:scale-110">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Privacy First</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your data never
                <br />
                leaves your browser.
              </p>
            </div>

            <div className="group text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 transition-transform group-hover:scale-110">
                <AlertTriangle className="h-8 w-8 rotate-180 transform text-white" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Zero Friction</h3>
              <p className="text-gray-600 dark:text-gray-400">
                No login, no popups,
                <br />
                no tracking.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Just tools. That work.{' '}
              <span className="text-violet-600 dark:text-violet-400">
                Like they should.
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
