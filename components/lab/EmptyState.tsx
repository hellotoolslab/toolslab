'use client';

import { motion } from 'framer-motion';
import { Star, Search } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function EmptyState() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-md"
      >
        {/* Empty Beaker Animation */}
        <motion.div
          className="relative mb-8"
          animate={{
            rotate: [0, -5, 5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="mb-4 text-8xl">🧪</div>

          {/* Floating particles */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-2 w-2 rounded-full bg-violet-400"
                animate={{
                  y: [-10, -30, -10],
                  x: [0, Math.sin(i) * 20, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: 'easeInOut',
                }}
                style={{
                  left: `${45 + i * 5}%`,
                  top: '30%',
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Main Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h2 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
            Your Lab is Empty!
          </h2>
          <p className="mb-8 leading-relaxed text-gray-600 dark:text-gray-400">
            Start by marking your favorite tools and categories with a{' '}
            <Star className="mx-1 inline h-4 w-4 fill-amber-500 text-amber-500" />
            to add them here.
          </p>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <Link
            href="/"
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-6 py-3',
              'bg-gradient-to-r from-violet-500 to-purple-600',
              'font-medium text-white',
              'hover:from-violet-600 hover:to-purple-700',
              'transform transition-all hover:scale-105',
              'shadow-lg hover:shadow-xl'
            )}
          >
            <Search className="h-5 w-5" />
            Explore Tools
          </Link>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-12 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900"
        >
          <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
            Pro Tips:
          </h3>
          <ul className="space-y-2 text-left text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <Star className="mt-0.5 h-4 w-4 flex-shrink-0 fill-amber-500 text-amber-500" />
              <span>Click the star on any tool card to add it to your Lab</span>
            </li>
            <li className="flex items-start gap-2">
              <Star className="mt-0.5 h-4 w-4 flex-shrink-0 fill-amber-500 text-amber-500" />
              <span>Mark entire categories as favorites for quick access</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex-shrink-0 text-base font-medium text-violet-500">
                🔒
              </span>
              <span>
                Everything stays private in your browser - no accounts needed
              </span>
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
}
