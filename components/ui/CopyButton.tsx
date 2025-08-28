'use client';

import { useState } from 'react';
import { Copy, Check } from '@/lib/icons';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  text: string;
  className?: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function CopyButton({
  text,
  className,
  variant = 'default',
  size = 'md',
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      // Create ripple effect
      const button = document.activeElement as HTMLElement;
      if (button) {
        button.classList.add('btn-ripple');
        setTimeout(() => {
          button.classList.remove('btn-ripple');
        }, 300);
      }

      // Reset after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  const variantClasses = {
    default: 'btn btn-copy',
    ghost: 'btn btn-secondary',
    outline: 'btn btn-secondary border border-gray-300 dark:border-gray-600',
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'focus-visible relative overflow-hidden transition-all duration-200',
        variantClasses[variant],
        sizeClasses[size],
        copied &&
          'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
        className
      )}
      title={copied ? 'Copied!' : 'Click to copy'}
      disabled={!text}
    >
      {/* Icons with transition */}
      <Copy
        className={cn(
          'transition-all duration-200',
          copied ? 'scale-50 opacity-0' : 'scale-100 opacity-100',
          size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5'
        )}
      />
      <Check
        className={cn(
          'absolute inset-0 m-auto transition-all duration-200',
          copied ? 'scale-100 opacity-100' : 'scale-50 opacity-0',
          size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5'
        )}
      />

      {/* Success animation */}
      {copied && (
        <div className="absolute inset-0 animate-ping rounded-lg bg-green-400 opacity-75" />
      )}
    </button>
  );
}
