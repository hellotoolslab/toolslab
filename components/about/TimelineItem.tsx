'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface TimelineItemProps {
  icon: LucideIcon;
  title: string;
  period: string;
  description: string;
  delay?: number;
  isLast?: boolean;
}

export function TimelineItem({
  icon: Icon,
  title,
  period,
  description,
  delay = 0,
  isLast = false,
}: TimelineItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay }}
      className="relative flex gap-6"
    >
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-6 top-12 h-full w-0.5 bg-gradient-to-b from-violet-500 to-purple-600 opacity-30" />
      )}

      {/* Icon */}
      <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white">
        <Icon className="h-5 w-5" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-8">
        <div className="mb-1 flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {period}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </motion.div>
  );
}
