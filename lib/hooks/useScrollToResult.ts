import { useRef, useCallback, useEffect } from 'react';

export interface ScrollToResultOptions {
  /**
   * Scroll behavior: 'smooth' for animated scroll, 'instant' for immediate scroll
   * @default 'smooth'
   */
  behavior?: ScrollBehavior;

  /**
   * Delay in milliseconds before scrolling (useful to wait for DOM updates)
   * @default 100
   */
  delay?: number;

  /**
   * Additional offset from the top of the element (in pixels)
   * @default 20
   */
  offset?: number;

  /**
   * Whether to scroll only if the element is not visible
   * @default true
   */
  onlyIfNotVisible?: boolean;
}

/**
 * Hook to automatically scroll to the result section after processing
 *
 * @example
 * ```tsx
 * const { resultRef, scrollToResult } = useScrollToResult();
 *
 * const handleProcess = async () => {
 *   const result = await processData(input);
 *   setOutput(result);
 *   scrollToResult(); // Automatically scroll to result
 * };
 *
 * return (
 *   <div>
 *     <button onClick={handleProcess}>Process</button>
 *     <div ref={resultRef}>
 *       {output && <Result data={output} />}
 *     </div>
 *   </div>
 * );
 * ```
 */
export function useScrollToResult(options: ScrollToResultOptions = {}) {
  const {
    behavior = 'smooth',
    delay = 100,
    offset = 20,
    onlyIfNotVisible = true,
  } = options;

  const resultRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Check if an element is visible in the viewport
   */
  const isElementVisible = useCallback((element: HTMLElement): boolean => {
    const rect = element.getBoundingClientRect();
    const windowHeight =
      window.innerHeight || document.documentElement.clientHeight;

    // Element is visible if at least partially in viewport
    return rect.top < windowHeight && rect.bottom > 0;
  }, []);

  /**
   * Scroll to the result element
   */
  const scrollToResult = useCallback(() => {
    // Clear any pending scroll
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (!resultRef.current) return;

      // Check if we should scroll
      if (onlyIfNotVisible && isElementVisible(resultRef.current)) {
        return;
      }

      // Calculate target position with offset
      const elementTop =
        resultRef.current.getBoundingClientRect().top + window.pageYOffset;
      const targetPosition = elementTop - offset;

      // Scroll to target
      window.scrollTo({
        top: targetPosition,
        behavior,
      });
    }, delay);
  }, [behavior, delay, offset, onlyIfNotVisible, isElementVisible]);

  /**
   * Cleanup timeout on unmount
   */
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return {
    /**
     * Ref to attach to the result container element
     */
    resultRef,

    /**
     * Function to trigger scroll to result
     * Call this after setting the output/result state
     */
    scrollToResult,
  };
}

/**
 * Hook variant that automatically scrolls when a dependency changes
 * Useful when you want to scroll automatically when output is set
 *
 * @example
 * ```tsx
 * const resultRef = useAutoScrollToResult([output], {
 *   shouldScroll: !!output
 * });
 *
 * return (
 *   <div ref={resultRef}>
 *     {output && <Result data={output} />}
 *   </div>
 * );
 * ```
 */
export function useAutoScrollToResult(
  deps: React.DependencyList,
  options: ScrollToResultOptions & {
    /**
     * Condition to determine if scroll should happen
     * @default true
     */
    shouldScroll?: boolean;
  } = {}
) {
  const { shouldScroll = true, ...scrollOptions } = options;
  const { resultRef, scrollToResult } = useScrollToResult(scrollOptions);

  useEffect(() => {
    if (shouldScroll) {
      scrollToResult();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return resultRef;
}
