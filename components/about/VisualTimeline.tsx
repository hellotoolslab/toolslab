'use client';

import { motion, useInView } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useRef } from 'react';

interface TimelineStep {
  icon: LucideIcon;
  title: string;
  year: string;
  description: string;
  isLeft?: boolean;
}

interface VisualTimelineProps {
  steps: TimelineStep[];
}

export function VisualTimeline({ steps }: VisualTimelineProps) {
  return (
    <div className="relative mx-auto max-w-4xl">
      {/* Main timeline line */}
      <div className="absolute bottom-0 left-1/2 top-0 hidden w-0.5 -translate-x-1/2 transform bg-gradient-to-b from-purple-500 via-blue-500 to-indigo-500 md:block" />

      <div className="space-y-8 md:space-y-16">
        {steps.map((step, index) => (
          <TimelineItem
            key={index}
            step={step}
            index={index}
            isLeft={index % 2 === 0}
            totalSteps={steps.length}
          />
        ))}
      </div>
    </div>
  );
}

function TimelineItem({
  step,
  index,
  isLeft,
  totalSteps,
}: {
  step: TimelineStep;
  index: number;
  isLeft: boolean;
  totalSteps: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className={`relative flex items-center ${
        isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
      } flex-col md:flex-row`}
    >
      {/* Content card */}
      <div className={`w-full md:w-5/12 ${isLeft ? 'md:pr-8' : 'md:pl-8'}`}>
        <motion.div
          className="group relative rounded-2xl border border-white/20 bg-slate-800/80 p-6 backdrop-blur-sm transition-all duration-300 hover:border-purple-500/50 hover:bg-slate-800/90"
          whileHover={{ scale: 1.02, y: -5 }}
        >
          {/* Gradient border on hover */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-indigo-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="relative z-10">
            {/* Year badge */}
            <motion.div
              className="mb-3 inline-block rounded-full bg-gradient-to-r from-purple-500 to-blue-600 px-3 py-1 text-xs font-semibold text-white shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              {step.year}
            </motion.div>

            {/* Title */}
            <h3 className="mb-3 text-xl font-bold text-white">{step.title}</h3>

            {/* Description */}
            <p className="leading-relaxed text-gray-200">{step.description}</p>
          </div>

          {/* Decorative elements */}
          <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-purple-400/30" />
          <div className="absolute bottom-2 left-2 h-1 w-1 rounded-full bg-blue-400/30" />
        </motion.div>
      </div>

      {/* Central icon */}
      <div className="relative z-20 flex h-16 w-16 items-center justify-center md:absolute md:left-1/2 md:-translate-x-1/2 md:transform">
        <motion.div
          className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/20 bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-lg"
          whileHover={{
            scale: 1.1,
            rotate: 360,
            boxShadow: '0 0 30px rgba(147, 51, 234, 0.5)',
            transition: { duration: 0.3 },
          }}
          animate={{
            boxShadow: [
              '0 0 20px rgba(147, 51, 234, 0.3)',
              '0 0 25px rgba(59, 130, 246, 0.4)',
              '0 0 20px rgba(147, 51, 234, 0.3)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <step.icon className="h-6 w-6" />
        </motion.div>

        {/* Connection line to card */}
        <motion.div
          className={`absolute top-1/2 hidden h-0.5 w-8 bg-gradient-to-r from-purple-500 to-blue-500 md:block ${
            isLeft ? 'right-16' : 'left-16'
          }`}
          initial={{ width: 0 }}
          animate={isInView ? { width: '2rem' } : {}}
          transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
        />
      </div>

      {/* Empty space for alternating layout */}
      <div className="hidden md:block md:w-5/12" />

      {/* Mobile connection line */}
      {index < totalSteps - 1 && (
        <motion.div
          className="mx-auto mt-8 flex h-8 w-0.5 bg-gradient-to-b from-purple-500 to-blue-500 md:hidden"
          initial={{ height: 0 }}
          animate={isInView ? { height: '2rem' } : {}}
          transition={{ duration: 0.5, delay: index * 0.2 + 0.5 }}
        />
      )}
    </motion.div>
  );
}
