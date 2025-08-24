'use client';

import { useState, useEffect } from 'react';
import { useUmami } from '@/components/analytics/UmamiProvider';
import { Button } from '@/components/ui/button';

interface EventLog {
  id: string;
  timestamp: Date;
  event: string;
  data: any;
}

export function UmamiDebugger() {
  const [isVisible, setIsVisible] = useState(false);
  const [events, setEvents] = useState<EventLog[]>([]);
  const [isRecording, setIsRecording] = useState(true);
  const {
    track,
    trackToolUse,
    trackFavorite,
    trackSocial,
    trackConversion,
    trackEngagement,
  } = useUmami();

  // Override console.log to capture Umami events
  useEffect(() => {
    if (!isRecording) return;

    const originalLog = console.log;
    const originalGroup = console.group;

    // Intercept console.group calls for Umami events
    console.group = (...args: any[]) => {
      const message = args[0];
      if (typeof message === 'string' && message.includes('📊 Umami Event:')) {
        const eventName = message.replace('📊 Umami Event: ', '');

        // Capture the event (we'll get the data in the next console.log calls)
        const newEvent: EventLog = {
          id: Date.now().toString(),
          timestamp: new Date(),
          event: eventName,
          data: null, // Will be populated by subsequent logs
        };

        setEvents((prev) => [newEvent, ...prev.slice(0, 49)]); // Keep last 50 events
      }
      originalGroup(...args);
    };

    return () => {
      console.log = originalLog;
      console.group = originalGroup;
    };
  }, [isRecording]);

  // Show/hide debugger with keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + U = Toggle Umami Debugger
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'U') {
        e.preventDefault();
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Don't show in production unless debug is enabled
  if (
    process.env.NODE_ENV === 'production' &&
    process.env.NEXT_PUBLIC_UMAMI_DEBUG !== 'true'
  ) {
    return null;
  }

  const testEvents = [
    {
      name: 'Tool Use',
      action: () =>
        trackToolUse('json-formatter', 'format', {
          success: true,
          input_size: 150,
        }),
    },
    {
      name: 'Favorite Tool',
      action: () => trackFavorite('tool', 'json-formatter', true),
    },
    {
      name: 'Social Click',
      action: () => trackSocial('twitter', 'debugger'),
    },
    {
      name: 'Conversion',
      action: () => trackConversion('donation', 'debugger'),
    },
    {
      name: 'Engagement',
      action: () => trackEngagement('debugger-test', { source: 'manual' }),
    },
  ];

  const clearEvents = () => setEvents([]);

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          className="bg-purple-600 text-white shadow-lg hover:bg-purple-700"
          size="sm"
        >
          📊 Umami Debug
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-4 z-50 bg-black/80 backdrop-blur-sm">
      <div className="h-full overflow-hidden rounded-lg bg-white shadow-2xl dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between bg-purple-600 p-4 text-white">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            📊 Umami Analytics Debugger
          </h2>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsRecording(!isRecording)}
              variant={isRecording ? 'secondary' : 'outline'}
              size="sm"
            >
              {isRecording ? '⏸️ Pause' : '▶️ Record'}
            </Button>
            <Button
              onClick={() => setIsVisible(false)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-purple-700"
            >
              ✕
            </Button>
          </div>
        </div>

        <div className="flex h-[calc(100%-60px)]">
          {/* Test Panel */}
          <div className="w-1/3 border-r border-gray-200 p-4 dark:border-gray-700">
            <h3 className="mb-4 font-semibold">🧪 Test Events</h3>
            <div className="space-y-2">
              {testEvents.map((test, index) => (
                <Button
                  key={index}
                  onClick={test.action}
                  variant="outline"
                  className="w-full justify-start text-sm"
                  size="sm"
                >
                  {test.name}
                </Button>
              ))}
            </div>

            <div className="mt-6">
              <h4 className="mb-2 font-medium">🎯 Tips</h4>
              <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                <li>• Use tools to see real events</li>
                <li>• Add items to Lab</li>
                <li>• Click social links</li>
                <li>• Share a tool</li>
                <li>• Dismiss ads</li>
              </ul>
            </div>
          </div>

          {/* Events Log */}
          <div className="flex flex-1 flex-col">
            <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
              <h3 className="font-semibold">📋 Events Log ({events.length})</h3>
              <Button onClick={clearEvents} variant="outline" size="sm">
                🗑️ Clear
              </Button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {events.length === 0 ? (
                <div className="mt-8 text-center text-gray-500">
                  <div className="mb-2 text-4xl">📊</div>
                  <p>No events captured yet.</p>
                  <p className="mt-1 text-sm">
                    {isRecording
                      ? 'Interact with the app to see events!'
                      : 'Recording is paused.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="rounded-lg border-l-4 border-purple-500 bg-gray-50 p-3 dark:bg-gray-800"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <span className="font-medium text-purple-600 dark:text-purple-400">
                          {event.event}
                        </span>
                        <span className="text-xs text-gray-500">
                          {event.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      {event.data && (
                        <pre className="overflow-x-auto rounded bg-gray-100 p-2 text-xs dark:bg-gray-900">
                          {JSON.stringify(event.data, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 p-2 text-center text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
          Press{' '}
          <kbd className="rounded bg-gray-200 px-1 dark:bg-gray-700">
            Ctrl/Cmd + Shift + U
          </kbd>{' '}
          to toggle debugger
        </div>
      </div>
    </div>
  );
}
