'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { type Locale } from '@/lib/i18n/config';
import { type Dictionary } from '@/lib/i18n/types';
import { getClientDictionary } from '@/lib/i18n/get-dictionary-client';

/**
 * Dictionary Context
 * Provides dictionary data to all child components without multiple fetches
 */
interface DictionaryContextValue {
  dictionary: Dictionary | null;
  locale: Locale;
  loading: boolean;
  error: string | null;
  isReady: boolean;
}

const DictionaryContext = createContext<DictionaryContextValue | null>(null);

/**
 * Dictionary Provider Props
 */
interface DictionaryProviderProps {
  children: ReactNode;
  locale: Locale;
  initialDictionary?: Dictionary; // For SSR hydration
}

/**
 * Dictionary Provider Component
 *
 * Loads dictionary once and shares it with all child components via Context.
 * This prevents multiple fetch requests from individual components.
 *
 * @example
 * ```tsx
 * <DictionaryProvider locale="it">
 *   <Hero />
 *   <TrustMetrics />
 *   <InteractiveDemo />
 * </DictionaryProvider>
 * ```
 */
export function DictionaryProvider({
  children,
  locale,
  initialDictionary,
}: DictionaryProviderProps) {
  const [dictionary, setDictionary] = useState<Dictionary | null>(
    initialDictionary || null
  );
  const [loading, setLoading] = useState(!initialDictionary);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If we have initial dictionary from SSR, no need to fetch
    if (initialDictionary) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const loadDictionary = async () => {
      try {
        setLoading(true);
        setError(null);
        const dict = await getClientDictionary(locale);

        if (isMounted) {
          setDictionary(dict);
        }
      } catch (err) {
        if (isMounted) {
          console.error('DictionaryProvider: Failed to load dictionary:', err);
          setError(
            err instanceof Error ? err.message : 'Failed to load dictionary'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDictionary();

    return () => {
      isMounted = false;
    };
  }, [locale, initialDictionary]);

  const value: DictionaryContextValue = {
    dictionary,
    locale,
    loading,
    error,
    isReady: !loading && dictionary !== null,
  };

  return (
    <DictionaryContext.Provider value={value}>
      {children}
    </DictionaryContext.Provider>
  );
}

/**
 * Hook to access dictionary from Context
 * Must be used inside DictionaryProvider
 */
export function useDictionaryContext() {
  const context = useContext(DictionaryContext);

  if (!context) {
    throw new Error(
      'useDictionaryContext must be used within a DictionaryProvider'
    );
  }

  return context;
}

/**
 * Hook to access specific dictionary section from Context
 * Returns empty object if dictionary is not loaded (safe fallback)
 *
 * @example
 * ```tsx
 * const { data: home, loading } = useDictionarySectionContext('home');
 * ```
 */
export function useDictionarySectionContext<T extends keyof Dictionary>(
  section: T
) {
  const { dictionary, loading, error, isReady } = useDictionaryContext();

  return {
    data: dictionary?.[section] || ({} as Dictionary[T]),
    loading,
    error,
    isReady,
  };
}
