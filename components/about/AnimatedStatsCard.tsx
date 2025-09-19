'use client';

import { motion, useInView } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

interface AnimatedStatsCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  description: string;
  delay?: number;
  isNumber?: boolean;
}

export function AnimatedStatsCard({
  icon: Icon,
  value,
  label,
  description,
  delay = 0,
  isNumber = false,
}: AnimatedStatsCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [animatedValue, setAnimatedValue] = useState(isNumber ? '0' : value);

  useEffect(() => {
    if (isInView && isNumber) {
      const numericValue = parseInt(value.replace(/\D/g, ''));
      let start = 0;
      const duration = 2000;
      const increment = numericValue / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= numericValue) {
          setAnimatedValue(value);
          clearInterval(timer);
        } else {
          const suffix = value.includes('+')
            ? '+'
            : value.includes('%')
              ? '%'
              : '';
          setAnimatedValue(Math.floor(start) + suffix);
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, value, isNumber]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, type: 'spring', stiffness: 100 }}
      className="group relative"
    >
      {/* Card with glassmorphism effect */}
      <div className="relative h-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-white/20 hover:bg-white/10">
        {/* Animated gradient border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-indigo-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-indigo-500/10 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative z-10 text-center">
          {/* Icon with gradient background */}
          <motion.div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-lg"
            whileHover={{
              scale: 1.1,
              rotate: [0, -5, 5, 0],
              transition: { duration: 0.3 },
            }}
            animate={{
              boxShadow: [
                '0 0 20px rgba(147, 51, 234, 0.3)',
                '0 0 30px rgba(59, 130, 246, 0.4)',
                '0 0 20px rgba(147, 51, 234, 0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Icon className="h-8 w-8" />
          </motion.div>

          {/* Animated value */}
          <motion.div
            className="mb-2 text-3xl font-bold text-white"
            animate={isNumber ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {animatedValue}
          </motion.div>

          {/* Label */}
          <div className="mb-2 text-sm font-semibold text-purple-200">
            {label}
          </div>

          {/* Description */}
          <div className="text-xs text-gray-400">{description}</div>
        </div>

        {/* Floating particles inside card */}
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white/30"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              y: [-5, 5, -5],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random(),
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
