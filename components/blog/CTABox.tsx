'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CTABoxProps {
  variant?: 'primary' | 'secondary' | 'tool-highlight';
  title: string;
  description?: string;
  buttonText: string;
  buttonHref: string;
  className?: string;
}

export function CTABox({
  variant = 'primary',
  title,
  description,
  buttonText,
  buttonHref,
  className,
}: CTABoxProps) {
  const variantStyles = {
    primary:
      'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20 dark:from-blue-500/20 dark:to-purple-500/20 dark:border-blue-500/30',
    secondary:
      'bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-800',
    'tool-highlight':
      'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20 dark:from-green-500/20 dark:to-emerald-500/20 dark:border-green-500/30',
  };

  const buttonVariants = {
    primary: 'default',
    secondary: 'outline',
    'tool-highlight': 'default',
  } as const;

  return (
    <div
      className={cn(
        'rounded-lg border-2 p-6',
        variantStyles[variant],
        className
      )}
    >
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      {description && (
        <p className="mb-4 text-gray-600 dark:text-gray-400">{description}</p>
      )}
      <Link href={buttonHref}>
        <Button
          variant={buttonVariants[variant]}
          className="inline-flex items-center"
        >
          {buttonText}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
