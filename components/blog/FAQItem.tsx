'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
  className?: string;
}

export function FAQItem({
  question,
  answer,
  defaultOpen = false,
  className,
}: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={cn(
        'rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800',
        className
      )}
    >
      <button
        className="flex w-full items-center justify-between rounded-lg px-6 py-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <h3 className="pr-4 font-semibold text-gray-900 dark:text-gray-100">
          {question}
        </h3>
        <ChevronDown
          className={cn(
            'h-5 w-5 flex-shrink-0 text-gray-500 transition-transform dark:text-gray-400',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div className="px-6 pb-4">
          <div className="border-t border-gray-100 pt-2 dark:border-gray-700">
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              {answer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
