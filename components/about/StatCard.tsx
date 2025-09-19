'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  description?: string;
  delay?: number;
}

export function StatCard({
  icon: Icon,
  value,
  label,
  description,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="rounded-xl border bg-white/50 p-6 text-center backdrop-blur-sm dark:bg-gray-900/50"
    >
      <div className="mb-4 flex justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white">
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </div>
      <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
        {label}
      </div>
      {description && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {description}
        </div>
      )}
    </motion.div>
  );
}
