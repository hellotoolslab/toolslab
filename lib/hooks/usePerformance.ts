'use client';

import React, {
  useMemo,
  useCallback,
  useRef,
  useEffect,
  useState,
} from 'react';
import { PERFORMANCE } from '@/lib/constants/tools';

/**
 * Hook for memoizing expensive computations based on performance thresholds
 */
export function useComputationMemo<T, R>(
  computation: (input: T) => R,
  input: T,
  shouldMemoize?: (input: T) => boolean
): R {
  const defaultShouldMemo = useCallback((inp: T) => {
    if (typeof inp === 'string') {
      return inp.length > PERFORMANCE.MEMOIZATION_THRESHOLD;
    }
    if (Array.isArray(inp)) {
      return inp.length > PERFORMANCE.MEMOIZATION_THRESHOLD;
    }
    return true;
  }, []);

  const memoCheck = shouldMemoize || defaultShouldMemo;

  return useMemo(() => {
    if (memoCheck(input)) {
      return computation(input);
    }
    return computation(input);
  }, [input, computation, memoCheck]);
}

/**
 * Hook for performance monitoring and optimization suggestions
 */
export function usePerformanceMonitor(operationName: string) {
  const startTimeRef = useRef<number>();
  const performanceData = useRef<{
    operations: number;
    totalTime: number;
    averageTime: number;
    slowOperations: number;
  }>({
    operations: 0,
    totalTime: 0,
    averageTime: 0,
    slowOperations: 0,
  });

  const startOperation = useCallback(() => {
    startTimeRef.current = performance.now();
  }, []);

  const endOperation = useCallback(() => {
    if (!startTimeRef.current) return;

    const duration = performance.now() - startTimeRef.current;
    const data = performanceData.current;

    data.operations += 1;
    data.totalTime += duration;
    data.averageTime = data.totalTime / data.operations;

    // Track slow operations (over 1 second)
    if (duration > 1000) {
      data.slowOperations += 1;
    }

    // Log performance warnings in development
    if (process.env.NODE_ENV === 'development') {
      if (duration > 500) {
        console.warn(
          `Slow ${operationName} operation: ${duration.toFixed(2)}ms`
        );
      }

      if (data.operations % 10 === 0) {
        console.log(`${operationName} performance:`, {
          operations: data.operations,
          averageTime: data.averageTime.toFixed(2),
          slowOperations: data.slowOperations,
        });
      }
    }

    startTimeRef.current = undefined;
  }, [operationName]);

  const getPerformanceReport = useCallback(
    () => ({
      ...performanceData.current,
      shouldOptimize: performanceData.current.averageTime > 100,
      shouldUseWorker: performanceData.current.averageTime > 500,
    }),
    []
  );

  return {
    startOperation,
    endOperation,
    getPerformanceReport,
  };
}

/**
 * Hook for debounced memoization - combines debouncing with memoization
 */
export function useDebouncedMemo<T, R>(
  computation: (input: T) => R,
  input: T,
  delay: number = 300,
  deps: unknown[] = []
): {
  result: R | undefined;
  isComputing: boolean;
} {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const [isComputing, setIsComputing] = React.useState(false);

  const memoizedComputation = useMemo(() => computation, deps);

  const result = useMemo(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsComputing(true);

    let currentResult: R | undefined;

    timeoutRef.current = setTimeout(() => {
      currentResult = memoizedComputation(input);
      setIsComputing(false);
    }, delay);

    return currentResult;
  }, [input, memoizedComputation, delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { result, isComputing };
}

/**
 * Hook for virtual scrolling in large lists
 */
export function useVirtualization<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = React.useState(0);

  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight)
    );
    return { start, end };
  }, [scrollTop, itemHeight, containerHeight, items.length]);

  const visibleItems = useMemo(() => {
    return items
      .slice(visibleRange.start, visibleRange.end + 1)
      .map((item, index) => ({
        item,
        index: visibleRange.start + index,
      }));
  }, [items, visibleRange]);

  const totalHeight = items.length * itemHeight;

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    handleScroll,
    shouldVirtualize: items.length > PERFORMANCE.VIRTUALIZATION_THRESHOLD,
  };
}

/**
 * Hook for lazy loading heavy computations with Web Workers
 */
export function useWorkerComputation<T, R>(
  workerScript: string,
  shouldUseWorker?: (input: T) => boolean
) {
  const workerRef = useRef<Worker | null>(null);

  const defaultShouldUseWorker = useCallback((input: T) => {
    if (typeof input === 'string') {
      return input.length > PERFORMANCE.WORKER_THRESHOLD;
    }
    if (Array.isArray(input)) {
      return input.length > PERFORMANCE.WORKER_THRESHOLD;
    }
    return false;
  }, []);

  const shouldUse = shouldUseWorker || defaultShouldUseWorker;

  const compute = useCallback(
    async (input: T): Promise<R> => {
      if (!shouldUse(input)) {
        throw new Error('Input does not meet worker threshold');
      }

      return new Promise((resolve, reject) => {
        if (!workerRef.current) {
          workerRef.current = new Worker(workerScript);
        }

        const handleMessage = (event: MessageEvent<R>) => {
          resolve(event.data);
          workerRef.current?.removeEventListener('message', handleMessage);
          workerRef.current?.removeEventListener('error', handleError);
        };

        const handleError = (error: ErrorEvent) => {
          reject(new Error(`Worker error: ${error.message}`));
          workerRef.current?.removeEventListener('message', handleMessage);
          workerRef.current?.removeEventListener('error', handleError);
        };

        workerRef.current.addEventListener('message', handleMessage);
        workerRef.current.addEventListener('error', handleError);

        workerRef.current.postMessage(input);
      });
    },
    [workerScript, shouldUse]
  );

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  return { compute };
}
