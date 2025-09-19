'use client';

import { motion, useInView } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useRef } from 'react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
  gradient?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  delay = 0,
  gradient = 'from-purple-500 to-blue-600',
}: FeatureCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.6,
        delay,
        type: 'spring',
        stiffness: 100,
      }}
      className="group h-full"
    >
      <motion.div
        className="relative h-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/20"
        whileHover={{
          scale: 1.05,
          y: -8,
          rotateY: 5,
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Animated border gradient */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-indigo-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          animate={{
            background: [
              'linear-gradient(45deg, rgba(147, 51, 234, 0.2), rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.2))',
              'linear-gradient(45deg, rgba(99, 102, 241, 0.2), rgba(147, 51, 234, 0.2), rgba(59, 130, 246, 0.2))',
              'linear-gradient(45deg, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.2), rgba(147, 51, 234, 0.2))',
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-indigo-500/10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

        <div className="relative z-10">
          {/* Icon with 3D effect */}
          <motion.div
            className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}
            whileHover={{
              scale: 1.1,
              rotateY: 180,
              boxShadow: '0 20px 40px rgba(147, 51, 234, 0.3)',
            }}
            transition={{ duration: 0.4 }}
            animate={{
              boxShadow: [
                '0 4px 20px rgba(147, 51, 234, 0.2)',
                '0 8px 30px rgba(59, 130, 246, 0.3)',
                '0 4px 20px rgba(147, 51, 234, 0.2)',
              ],
            }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <Icon className="h-7 w-7" />
          </motion.div>

          {/* Title */}
          <motion.h3
            className="mb-3 text-lg font-bold text-white"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            {title}
          </motion.h3>

          {/* Description */}
          <motion.p
            className="text-sm leading-relaxed text-gray-300"
            initial={{ opacity: 0.8 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {description}
          </motion.p>
        </div>

        {/* Corner decorations */}
        <motion.div
          className="absolute right-3 top-3 h-2 w-2 rounded-full bg-gradient-to-r from-purple-400 to-blue-400"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: delay * 0.5,
          }}
        />

        <motion.div
          className="absolute bottom-3 left-3 h-1 w-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 opacity-50"
          animate={{
            width: [32, 48, 32],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: delay * 0.3,
          }}
        />

        {/* Floating particles */}
        {Array.from({ length: 2 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white/30"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              y: [-3, 3, -3],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 1.5 + Math.random(),
              repeat: Infinity,
              delay: Math.random() + delay * 0.1,
            }}
          />
        ))}

        {/* Arrow indicator on hover */}
        <motion.div
          className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100"
          initial={{ x: -10 }}
          whileHover={{ x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg
            className="h-4 w-4 text-purple-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 13l3 3 7-7"
            />
          </svg>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
