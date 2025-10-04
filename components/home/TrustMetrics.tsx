'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useDictionarySectionContext } from '@/components/providers/DictionaryProvider';

interface MetricConfig {
  key: 'dailyOperations' | 'privacyFocused' | 'processingTime' | 'activeUsers';
  value: number;
  suffix: string;
  duration: number;
}

const metricsConfig: MetricConfig[] = [
  {
    key: 'dailyOperations',
    value: 5000,
    suffix: '+',
    duration: 2000,
  },
  {
    key: 'privacyFocused',
    value: 100,
    suffix: '%',
    duration: 1500,
  },
  {
    key: 'processingTime',
    value: 0,
    suffix: 'ms',
    duration: 1000,
  },
  {
    key: 'activeUsers',
    value: 500,
    suffix: '+',
    duration: 2500,
  },
];

function AnimatedCounter({
  value,
  duration,
  suffix,
}: {
  value: number;
  duration: number;
  suffix: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * value);

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration, isInView]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export function TrustMetrics() {
  const { data: t } = useDictionarySectionContext('home');
  const trustMetrics = t?.trustMetrics;

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-16">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-black/20" />
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

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Trusted by Developers Worldwide
          </h2>
          <p className="mt-4 text-lg text-white/90">
            Real-time metrics that showcase our commitment to performance
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-4">
          {metricsConfig.map((metric, index) => (
            <motion.div
              key={metric.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 animate-pulse rounded-full bg-white/20 blur-xl" />

                <div className="relative rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
                  <div className="text-4xl font-bold text-white sm:text-5xl">
                    <AnimatedCounter
                      value={metric.value}
                      duration={metric.duration}
                      suffix={metric.suffix}
                    />
                  </div>
                  <div className="mt-2 text-sm font-medium text-white/80">
                    {trustMetrics?.[metric.key] || metric.key}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional trust indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-white">SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-white">No Data Storage</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-white">Open Source</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-white">GDPR Compliant</span>
          </div>
        </div>
      </div>
    </section>
  );
}
