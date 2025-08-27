/**
 * Hook for using Web Workers safely with proper cleanup and error handling
 */

import { useCallback, useRef, useEffect } from 'react';

export interface WebWorkerMessage {
  id: string;
  type: string;
  payload?: any;
  result?: any;
  error?: string;
}

export interface UseWebWorkerOptions {
  workerPath: string;
  timeout?: number; // Default 30 seconds
  onError?: (error: Error) => void;
}

export interface UseWebWorkerReturn {
  postMessage: <T = any>(type: string, payload?: any) => Promise<T>;
  isWorkerSupported: boolean;
  terminate: () => void;
}

export function useWebWorker({
  workerPath,
  timeout = 30000,
  onError,
}: UseWebWorkerOptions): UseWebWorkerReturn {
  const workerRef = useRef<Worker | null>(null);
  const pendingPromises = useRef<
    Map<
      string,
      {
        resolve: (value: any) => void;
        reject: (error: Error) => void;
        timeoutId: NodeJS.Timeout;
      }
    >
  >(new Map());

  // Check if Web Workers are supported
  const isWorkerSupported = typeof Worker !== 'undefined';

  // Initialize worker
  useEffect(() => {
    if (!isWorkerSupported) return;

    try {
      workerRef.current = new Worker(workerPath);

      workerRef.current.onmessage = (event: MessageEvent<WebWorkerMessage>) => {
        const { id, type, result, error } = event.data;
        const promise = pendingPromises.current.get(id);

        if (promise) {
          clearTimeout(promise.timeoutId);
          pendingPromises.current.delete(id);

          if (error) {
            promise.reject(new Error(error));
          } else if (type.endsWith('_SUCCESS')) {
            promise.resolve(result);
          } else if (type.endsWith('_ERROR')) {
            promise.reject(new Error(error || 'Worker operation failed'));
          }
        }
      };

      workerRef.current.onerror = (error) => {
        const err = new Error(`Worker error: ${error.message}`);
        onError?.(err);

        // Reject all pending promises
        pendingPromises.current.forEach(({ reject, timeoutId }) => {
          clearTimeout(timeoutId);
          reject(err);
        });
        pendingPromises.current.clear();
      };
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to create worker');
      onError?.(error);
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }

      // Clear all pending promises
      pendingPromises.current.forEach(({ timeoutId }) => {
        clearTimeout(timeoutId);
      });
      pendingPromises.current.clear();
    };
  }, [workerPath, isWorkerSupported, onError]);

  const postMessage = useCallback(
    <T = any>(type: string, payload?: any): Promise<T> => {
      return new Promise((resolve, reject) => {
        if (!isWorkerSupported) {
          reject(new Error('Web Workers are not supported in this browser'));
          return;
        }

        if (!workerRef.current) {
          reject(new Error('Worker not initialized'));
          return;
        }

        const id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Set up timeout
        const timeoutId = setTimeout(() => {
          pendingPromises.current.delete(id);
          reject(new Error(`Worker operation timed out after ${timeout}ms`));
        }, timeout);

        // Store promise resolvers
        pendingPromises.current.set(id, {
          resolve,
          reject,
          timeoutId,
        });

        // Send message to worker
        workerRef.current.postMessage({
          id,
          type,
          payload,
        });
      });
    },
    [isWorkerSupported, timeout]
  );

  const terminate = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }

    // Reject all pending promises
    pendingPromises.current.forEach(({ reject, timeoutId }) => {
      clearTimeout(timeoutId);
      reject(new Error('Worker was terminated'));
    });
    pendingPromises.current.clear();
  }, []);

  return {
    postMessage,
    isWorkerSupported,
    terminate,
  };
}

/**
 * Hook specifically for hash generation using Web Workers
 */
export function useHashWorker() {
  const { postMessage, isWorkerSupported, terminate } = useWebWorker({
    workerPath: '/workers/hash-worker.js',
    timeout: 15000, // 15 seconds for hash operations
    onError: (error) => {
      console.error('Hash worker error:', error);
    },
  });

  const generateHashes = useCallback(
    async (
      input: string,
      salt: string = '',
      algorithms: string[] = ['SHA-256']
    ): Promise<Record<string, string>> => {
      if (!isWorkerSupported) {
        throw new Error(
          'Web Workers not supported - falling back to main thread'
        );
      }

      return postMessage<Record<string, string>>('HASH_GENERATE', {
        input,
        salt,
        algorithms,
      });
    },
    [postMessage, isWorkerSupported]
  );

  const generateSingleHash = useCallback(
    async (text: string, algorithm: string = 'SHA-256'): Promise<string> => {
      if (!isWorkerSupported) {
        throw new Error(
          'Web Workers not supported - falling back to main thread'
        );
      }

      return postMessage<string>('HASH_SINGLE', {
        text,
        algorithm,
      });
    },
    [postMessage, isWorkerSupported]
  );

  return {
    generateHashes,
    generateSingleHash,
    isWorkerSupported,
    terminate,
  };
}

/**
 * Hook for JSON processing using Web Workers
 */
export function useJsonWorker() {
  const { postMessage, isWorkerSupported, terminate } = useWebWorker({
    workerPath: '/workers/json-worker.js',
    timeout: 10000, // 10 seconds for JSON operations
    onError: (error) => {
      console.error('JSON worker error:', error);
    },
  });

  const formatJson = useCallback(
    async (input: string, indent: number = 2): Promise<string> => {
      if (!isWorkerSupported) {
        // Fallback to main thread
        const parsed = JSON.parse(input);
        return JSON.stringify(parsed, null, indent);
      }

      return postMessage<string>('JSON_FORMAT', {
        input,
        indent,
      });
    },
    [postMessage, isWorkerSupported]
  );

  const validateJson = useCallback(
    async (input: string): Promise<{ valid: boolean; error?: string }> => {
      if (!isWorkerSupported) {
        // Fallback to main thread
        try {
          JSON.parse(input);
          return { valid: true };
        } catch (error) {
          return {
            valid: false,
            error: error instanceof Error ? error.message : 'Invalid JSON',
          };
        }
      }

      return postMessage<{ valid: boolean; error?: string }>('JSON_VALIDATE', {
        input,
      });
    },
    [postMessage, isWorkerSupported]
  );

  return {
    formatJson,
    validateJson,
    isWorkerSupported,
    terminate,
  };
}
