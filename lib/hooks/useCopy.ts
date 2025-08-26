'use client';

import { useState, useCallback } from 'react';

export interface UseCopyOptions {
  timeout?: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export interface UseCopyReturn {
  copied: boolean;
  copy: (text: string) => Promise<boolean>;
  reset: () => void;
}

/**
 * Hook for unified clipboard copy functionality across all tools
 * Eliminates duplicate copy logic in HashGenerator, UuidGenerator, etc.
 */
export function useCopy(options: UseCopyOptions = {}): UseCopyReturn {
  const { timeout = 2000, onSuccess, onError } = options;
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (!text) return false;

      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        onSuccess?.();

        // Auto-reset after timeout
        setTimeout(() => setCopied(false), timeout);
        return true;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Copy failed');
        onError?.(error);
        console.error('Failed to copy:', error);
        return false;
      }
    },
    [timeout, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setCopied(false);
  }, []);

  return { copied, copy, reset };
}

/**
 * Hook for copying multiple items with individual state tracking
 * Used in tools like HashGenerator that copy multiple values
 */
export function useMultiCopy<T = string>(options: UseCopyOptions = {}) {
  const { timeout = 2000, onSuccess, onError } = options;
  const [copiedItems, setCopiedItems] = useState<Set<T>>(new Set());

  const copy = useCallback(
    async (text: string, identifier: T): Promise<boolean> => {
      if (!text) return false;

      try {
        await navigator.clipboard.writeText(text);
        setCopiedItems((prev) => new Set(prev).add(identifier));
        onSuccess?.();

        // Auto-reset after timeout
        setTimeout(() => {
          setCopiedItems((prev) => {
            const newSet = new Set(prev);
            newSet.delete(identifier);
            return newSet;
          });
        }, timeout);

        return true;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Copy failed');
        onError?.(error);
        console.error('Failed to copy:', error);
        return false;
      }
    },
    [timeout, onSuccess, onError]
  );

  const isCopied = useCallback(
    (identifier: T): boolean => {
      return copiedItems.has(identifier);
    },
    [copiedItems]
  );

  const reset = useCallback((identifier?: T) => {
    if (identifier) {
      setCopiedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(identifier);
        return newSet;
      });
    } else {
      setCopiedItems(new Set());
    }
  }, []);

  return { copy, isCopied, reset };
}
