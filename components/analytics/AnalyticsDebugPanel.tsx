'use client';

import { useState, useEffect } from 'react';
import { getTrackingManager } from '@/lib/analytics/core/TrackingManager';
import { getSessionManager } from '@/lib/analytics/core/SessionManager';

/**
 * Analytics Debug Panel
 * Shows real-time analytics status in development mode
 *
 * Usage: Add ?debug=analytics to URL
 */
export function AnalyticsDebugPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const [sessionData, setSessionData] = useState<any>(null);

  useEffect(() => {
    // Only show in development or when debug flag is set
    if (typeof window === 'undefined') return;

    const isDev = process.env.NODE_ENV === 'development';
    const hasDebugFlag = window.location.search.includes('debug=analytics');

    if (isDev || hasDebugFlag) {
      setIsVisible(true);

      // Update status every 2 seconds
      const interval = setInterval(() => {
        try {
          const manager = getTrackingManager();
          const session = getSessionManager();

          setStatus(manager.getStatus());
          setSessionData(session?.getSessionData());
        } catch (error) {
          console.error('Debug panel error:', error);
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-[9999] font-mono text-xs"
      style={{ maxWidth: '400px' }}
    >
      {/* Collapsed Button */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="rounded-lg border border-blue-500 bg-blue-950 px-4 py-2 text-blue-300 shadow-lg transition-all hover:bg-blue-900"
        >
          📊 Analytics Debug
        </button>
      )}

      {/* Expanded Panel */}
      {isExpanded && (
        <div className="rounded-lg border border-blue-500 bg-blue-950/95 p-4 text-blue-100 shadow-2xl backdrop-blur-sm">
          {/* Header */}
          <div className="mb-3 flex items-center justify-between border-b border-blue-700 pb-2">
            <span className="font-bold text-blue-300">
              📊 Analytics Debug Panel
            </span>
            <button
              onClick={() => setIsExpanded(false)}
              className="rounded px-2 py-1 text-blue-400 hover:bg-blue-800"
            >
              ✕
            </button>
          </div>

          {/* TrackingManager Status */}
          <div className="mb-3">
            <div className="mb-1 font-semibold text-blue-300">
              TrackingManager
            </div>
            {status ? (
              <div className="space-y-1 rounded bg-blue-900/50 p-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      status.enabled ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  <span>{status.enabled ? 'Active' : 'Disabled'}</span>
                </div>
                <div>
                  Queue:{' '}
                  <span className="font-bold text-yellow-400">
                    {status.queueSize}
                  </span>{' '}
                  events
                </div>
                <div>
                  Retry Queue:{' '}
                  <span className="font-bold text-orange-400">
                    {status.retryQueueSize}
                  </span>
                </div>
                <div>
                  Offline Queue:{' '}
                  <span className="font-bold text-purple-400">
                    {status.offlineQueueSize}
                  </span>
                </div>
                <div>
                  Online:{' '}
                  <span
                    className={
                      status.isOnline ? 'text-green-400' : 'text-red-400'
                    }
                  >
                    {status.isOnline ? '✓ Yes' : '✗ No'}
                  </span>
                </div>
                <div>
                  Timer:{' '}
                  <span className={status.hasTimer ? 'text-yellow-400' : ''}>
                    {status.hasTimer ? '⏱️ Active' : 'Idle'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-gray-400">Loading...</div>
            )}
          </div>

          {/* Session Status */}
          <div className="mb-3">
            <div className="mb-1 font-semibold text-blue-300">Session</div>
            {sessionData ? (
              <div className="space-y-1 rounded bg-blue-900/50 p-2">
                <div>
                  ID:{' '}
                  <span className="font-mono text-xs text-gray-300">
                    {sessionData.sessionId.slice(0, 8)}...
                  </span>
                </div>
                <div>
                  Duration:{' '}
                  <span className="font-bold text-green-400">
                    {Math.round((Date.now() - sessionData.startTime) / 1000)}s
                  </span>
                </div>
                <div>
                  Page Views:{' '}
                  <span className="font-bold text-blue-400">
                    {sessionData.pageViews}
                  </span>
                </div>
                <div>
                  Events:{' '}
                  <span className="font-bold text-purple-400">
                    {sessionData.events}
                  </span>
                </div>
                <div>
                  Tools Used:{' '}
                  <span className="font-bold text-orange-400">
                    {sessionData.toolsUsed?.size || 0}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-gray-400">Loading...</div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-1 border-t border-blue-700 pt-2">
            <button
              onClick={() => {
                try {
                  const manager = getTrackingManager();
                  manager.flush();
                  alert('Queue flushed!');
                } catch (error) {
                  alert('Flush failed: ' + error);
                }
              }}
              className="w-full rounded bg-blue-800 px-3 py-1 text-left hover:bg-blue-700"
            >
              🚀 Flush Queue Now
            </button>
            <button
              onClick={() => {
                const manager = getTrackingManager();
                console.log('TrackingManager Config:', manager.getConfig());
                alert('Config logged to console');
              }}
              className="w-full rounded bg-blue-800 px-3 py-1 text-left hover:bg-blue-700"
            >
              ⚙️ Log Config
            </button>
          </div>

          {/* Footer */}
          <div className="mt-3 border-t border-blue-700 pt-2 text-center text-xs text-blue-400">
            Press F12 to see console logs
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalyticsDebugPanel;
