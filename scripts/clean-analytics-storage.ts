#!/usr/bin/env node

/**
 * Clean Analytics Storage Script
 *
 * This script can be used to manually clean corrupted analytics data from localStorage.
 * Run this in the browser console if you encounter analytics errors.
 *
 * Usage:
 * 1. Open browser console on toolslab.dev
 * 2. Copy and paste this code
 * 3. Run cleanAnalyticsStorage()
 */

function cleanAnalyticsStorage() {
  console.log('🧹 Cleaning analytics storage...');

  let cleaned = 0;

  // Clean offline queue
  try {
    const offlineQueue = localStorage.getItem('toolslab-analytics-offline');
    if (offlineQueue) {
      console.log('Found offline queue, removing...');
      localStorage.removeItem('toolslab-analytics-offline');
      cleaned++;
    }
  } catch (error) {
    console.error('Failed to clean offline queue:', error);
  }

  // Clean session data if corrupted
  try {
    const sessionHistory = localStorage.getItem('toolslab-session-history');
    if (sessionHistory) {
      const parsed = JSON.parse(sessionHistory);
      // Validate session history
      if (
        !parsed.sessionCount ||
        !parsed.lastSessionTime ||
        isNaN(parsed.lastSessionTime)
      ) {
        console.log('Found corrupted session history, removing...');
        localStorage.removeItem('toolslab-session-history');
        cleaned++;
      }
    }
  } catch (error) {
    console.error('Failed to clean session history:', error);
    // If parse fails, remove it
    localStorage.removeItem('toolslab-session-history');
    cleaned++;
  }

  console.log(`✅ Cleaned ${cleaned} corrupted items`);
  console.log('Please reload the page for changes to take effect.');
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { cleanAnalyticsStorage };
}

// Auto-run if in browser console
if (typeof window !== 'undefined') {
  console.log('💡 To clean analytics storage, run: cleanAnalyticsStorage()');
}
