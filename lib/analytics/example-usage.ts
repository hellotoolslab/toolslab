/**
 * Example Usage of Optimized Umami Analytics in Tool Components
 *
 * This file demonstrates how to use the new optimized analytics system
 * that filters out bot traffic and provides better data quality.
 */

// In your tool component (e.g., components/tools/implementations/YourTool.tsx)
import { useUmami } from '@/components/analytics/OptimizedUmamiProvider';

export function ExampleToolComponent() {
  const { logToolAction, trackPerformance, trackConversion } = useUmami();

  const handleToolAction = async (input: string) => {
    const startTime = Date.now();

    try {
      // Your tool logic here
      const result = await processToolLogic(input);
      const duration = Date.now() - startTime;

      // Track successful action with metadata
      logToolAction('example-tool', 'process', true, {
        inputSize: input.length,
        outputSize: result.length,
        hasSpecialChars: /[^a-zA-Z0-9]/.test(input),
        processingType: 'standard',
      });

      // Track performance metrics
      trackPerformance('example-tool', 'process', duration);

      // Track conversion if user completes important action
      if (result.length > 1000) {
        trackConversion('tool-heavy-usage', result.length);
      }

      return result;
    } catch (error) {
      // Track failed action with error details
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorName = error instanceof Error ? error.name : 'Error';

      logToolAction('example-tool', 'process', false, {
        error: errorMessage,
        inputSize: input.length,
        errorType: errorName,
      });

      throw error;
    }
  };

  return (
    // Your component JSX
    null // Replace with actual component content
  );
}

// Helper function for your tool logic
async function processToolLogic(input: string): Promise<string> {
  // Simulated tool processing
  return input.toUpperCase();
}

/**
 * Key Features of the Optimized Analytics:
 *
 * 1. BOT FILTERING:
 *    - Automatically filters out crawler/bot traffic
 *    - Detects headless browsers and automation tools
 *    - Identifies suspicious traffic patterns
 *
 * 2. SESSION VALIDATION:
 *    - Only tracks sessions with genuine user interaction
 *    - Requires minimum session duration (3 seconds)
 *    - Validates user activity (clicks, scrolls, keyboard)
 *
 * 3. PERFORMANCE TRACKING:
 *    - Ignores unrealistic performance metrics (< 50ms or > 30s)
 *    - Categorizes performance as fast/normal/slow
 *    - Tracks session duration for conversion metrics
 *
 * 4. PRIVACY-FOCUSED:
 *    - No personal data collection
 *    - Truncates user agent for privacy
 *    - GDPR compliant by design
 *
 * 5. EDGE FILTERING:
 *    - Middleware blocks bots at edge level
 *    - Reduces server load from bot traffic
 *    - Improves analytics data quality
 */

/**
 * Migration Guide from Old UmamiProvider:
 *
 * 1. Update imports:
 *    OLD: import { useUmami } from '@/components/analytics/UmamiProvider';
 *    NEW: import { useUmami } from '@/components/analytics/OptimizedUmamiProvider';
 *
 * 2. New methods available:
 *    - logToolAction(tool, action, success, metadata)
 *    - trackPerformance(tool, action, duration)
 *    - trackConversion(type, value)
 *
 * 3. Automatic bot filtering:
 *    - No code changes needed
 *    - Bot traffic automatically excluded
 *    - Check isTrackingEnabled to verify tracking status
 *
 * 4. Session validation:
 *    - Events only tracked after user interaction
 *    - Single-page bot visits filtered out
 *    - More accurate user metrics
 */
