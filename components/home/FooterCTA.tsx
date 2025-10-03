'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { tools } from '@/lib/tools';
import { useLocale } from '@/hooks/useLocale';
import { useDictionarySectionContext } from '@/components/providers/DictionaryProvider';
import { useState, useEffect } from 'react';

const popularTools = tools.filter((tool) => tool.isPopular).slice(0, 8);

export function FooterCTA() {
  const { createHref } = useLocale();
  const { data: t } = useDictionarySectionContext('home');
  const cta = t?.footerCTA;

  // Generate particles only on client to avoid hydration mismatch
  const [particles, setParticles] = useState<
    Array<{
      left: number;
      xRange: number;
      duration: number;
      delay: number;
    }>
  >([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 10 }, () => ({
        left: Math.random() * 100,
        xRange: Math.random() * 100 - 50,
        duration: Math.random() * 5 + 5,
        delay: Math.random() * 5,
      }))
    );
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 py-8 sm:py-12">
      {/* Background effects */}
      <div className="absolute inset-0 bg-black/10" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-white/20"
            animate={{
              y: [-20, -100],
              x: [0, particle.xRange],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
            style={{
              left: `${particle.left}%`,
              bottom: 0,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <span className="text-sm font-medium text-white">
                {cta?.subtitle || 'Join hundreds of developers'}
              </span>
            </div>

            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {cta?.title || 'Start Your Experiment 🧪'}
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
              {cta?.subtitle ||
                'Join hundreds of developers using ToolsLab daily'}
            </p>
          </motion.div>

          {/* Email signup (optional) */}

          {/* Quick links to popular tools */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12"
          >
            <p className="mb-4 text-sm font-medium text-white/80">
              Popular tools to get you started:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={createHref(tool.route)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/20"
                >
                  <span>{tool.icon}</span>
                  {tool.name}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Direct CTA button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8"
          >
            <Link
              href={createHref('/tools')}
              className="hover:shadow-3xl inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-bold text-blue-600 shadow-2xl transition-all hover:-translate-y-1"
            >
              {cta?.primaryButton || 'Explore All Tools'}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
