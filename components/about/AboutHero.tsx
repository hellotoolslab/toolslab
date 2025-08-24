'use client';

import { motion } from 'framer-motion';

export function AboutHero() {
  return (
    <section className="relative overflow-hidden py-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23667eea' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='2'/%3E%3Ccircle cx='37' cy='37' r='2'/%3E%3Ccircle cx='7' cy='37' r='2'/%3E%3Ccircle cx='37' cy='7' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container relative mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-6 flex items-center justify-center gap-4">
            <span className="animate-bounce text-8xl">🧪</span>
          </div>

          <h1 className="mb-6 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
            Why ToolsLab Exists
          </h1>

          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600 dark:text-gray-400 md:text-2xl">
            A manifesto for developer tools that just work
          </p>
        </motion.div>
      </div>
    </section>
  );
}
