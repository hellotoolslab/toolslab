'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { TIMING } from '@/lib/constants/tools';

/**
 * Hook for debouncing values with customizable delay
 */
export function useDebounce<T>(
  value: T,
  delay: number = TIMING.DEBOUNCE_MS
): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for debouncing callbacks with automatic cleanup
 */
export function useDebounceCallback<
  T extends (...args: Parameters<T>) => ReturnType<T>,
>(callback: T, delay: number = TIMING.DEBOUNCE_MS): T {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedCallback = useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

/**
 * Hook for auto-processing with debounce
 * Combines debouncing with tool processing logic
 */
export function useAutoProcess<T>(
  input: T,
  processor: (input: T) => void | Promise<void>,
  options: {
    delay?: number;
    enabled?: boolean;
    dependencies?: unknown[];
  } = {}
): {
  isDebouncing: boolean;
  cancel: () => void;
} {
  const {
    delay = TIMING.AUTO_PROCESS_DELAY,
    enabled = true,
    dependencies = [],
  } = options;
  const [isDebouncing, setIsDebouncing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      setIsDebouncing(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    setIsDebouncing(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        await processor(input);
      } catch (error) {
        console.error('Auto-process error:', error);
      } finally {
        setIsDebouncing(false);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        setIsDebouncing(false);
      }
    };
  }, [input, enabled, delay, ...dependencies]);

  return { isDebouncing, cancel };
}

/**
 * Hook for search with debounced filtering
 */
export function useDebounceSearch<T>(
  items: T[],
  searchTerm: string,
  searchFunction: (items: T[], term: string) => T[],
  delay: number = TIMING.DEBOUNCE_MS
): {
  filteredItems: T[];
  isSearching: boolean;
} {
  const [filteredItems, setFilteredItems] = useState<T[]>(items);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setFilteredItems(items);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = searchFunction(items, debouncedSearchTerm);
      setFilteredItems(results);
    } catch (error) {
      console.error('Search error:', error);
      setFilteredItems([]);
    } finally {
      setIsSearching(false);
    }
  }, [items, debouncedSearchTerm, searchFunction]);

  // Show searching state when typing but not yet debounced
  const isCurrentlySearching =
    searchTerm !== debouncedSearchTerm && searchTerm.trim() !== '';

  return {
    filteredItems,
    isSearching: isSearching || isCurrentlySearching,
  };
}
