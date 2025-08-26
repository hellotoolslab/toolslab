'use client';

import { useState, useCallback } from 'react';

export interface UseToolProcessorOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  debounceMs?: number;
}

export interface UseToolProcessorReturn<T, R> {
  isProcessing: boolean;
  error: string | null;
  process: (input: T, processor: (input: T) => Promise<R>) => Promise<R>;
  processSync: (input: T, processor: (input: T) => R) => R;
  clearError: () => void;
  reset: () => void;
}

/**
 * Hook for unified tool processing logic
 * Eliminates duplicate processing patterns across all tools
 * Handles loading states, error management, and async operations
 */
export function useToolProcessor<T = string, R = string>(
  options: UseToolProcessorOptions = {}
): UseToolProcessorReturn<T, R> {
  const { onSuccess, onError, debounceMs = 0 } = options;

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const process = useCallback(
    async (input: T, processor: (input: T) => Promise<R>): Promise<R> => {
      setIsProcessing(true);
      setError(null);

      try {
        // Add debounce if specified
        if (debounceMs > 0) {
          await new Promise((resolve) => setTimeout(resolve, debounceMs));
        }

        const result = await processor(input);
        onSuccess?.();
        return result;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Processing failed');
        const errorMessage = error.message;

        setError(errorMessage);
        onError?.(error);
        throw error;
      } finally {
        setIsProcessing(false);
      }
    },
    [debounceMs, onSuccess, onError]
  );

  const processSync = useCallback(
    (input: T, processor: (input: T) => R): R => {
      setIsProcessing(true);
      setError(null);

      try {
        const result = processor(input);
        onSuccess?.();
        return result;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Processing failed');
        const errorMessage = error.message;

        setError(errorMessage);
        onError?.(error);
        throw error;
      } finally {
        setIsProcessing(false);
      }
    },
    [onSuccess, onError]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setIsProcessing(false);
    setError(null);
  }, []);

  return {
    isProcessing,
    error,
    process,
    processSync,
    clearError,
    reset,
  };
}

/**
 * Hook for tools that need to process with automatic retry logic
 */
export function useToolProcessorWithRetry<T = string, R = string>(
  maxRetries: number = 3,
  retryDelayMs: number = 1000
) {
  const [retryCount, setRetryCount] = useState(0);
  const processor = useToolProcessor<T, R>();

  const processWithRetry = useCallback(
    async (input: T, processorFn: (input: T) => Promise<R>): Promise<R> => {
      let lastError: Error | null = null;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          setRetryCount(attempt);
          const result = await processor.process(input, processorFn);
          setRetryCount(0); // Reset on success
          return result;
        } catch (err) {
          lastError = err instanceof Error ? err : new Error('Unknown error');

          // If not the last attempt, wait before retrying
          if (attempt < maxRetries) {
            await new Promise((resolve) =>
              setTimeout(resolve, retryDelayMs * (attempt + 1))
            );
          }
        }
      }

      // All retries failed
      if (lastError) {
        throw new Error(
          `Failed after ${maxRetries} retries: ${lastError.message}`
        );
      }

      throw new Error('Processing failed');
    },
    [maxRetries, retryDelayMs, processor]
  );

  return {
    ...processor,
    processWithRetry,
    retryCount,
  };
}
