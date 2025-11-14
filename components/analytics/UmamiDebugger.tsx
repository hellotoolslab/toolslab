'use client';

import { useState, useEffect } from 'react';
import {
  track,
  trackToolUse,
  trackFavorite,
  trackSocial,
  trackConversion,
  trackEngagement,
} from '@/lib/analytics';
import { cn } from '@/lib/utils';

interface EventLog {
  id: string;
  timestamp: Date;
  event: string;
  data: any;
}

// Simple Button component for the debugger
function Button({
  children,
  onClick,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  [key: string]: any;
}) {
  const baseClasses =
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2';

  const variantClasses = {
    default: 'bg-purple-600 text-white hover:bg-purple-700',
    outline:
      'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700',
    ghost:
      'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800',
    secondary:
      'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function UmamiDebugger() {
  const [isVisible, setIsVisible] = useState(false);
  const [events, setEvents] = useState<EventLog[]>([]);
  const [isRecording, setIsRecording] = useState(true);

  // Override console.log to capture Umami events
  useEffect(() => {
    if (!isRecording) return;

    const originalLog = console.log;
    const originalGroup = console.group;
    const originalGroupEnd = console.groupEnd;
    let currentEvent: EventLog | null = null;
    let captureData = false;

    // Intercept console.group calls for Umami events
    console.group = (...args: any[]) => {
      const message = args[0];
      if (typeof message === 'string' && message.includes('📊 Umami Event:')) {
        const eventName = message.replace('📊 Umami Event: ', '');
        captureData = true;

        currentEvent = {
          id: Date.now().toString(),
          timestamp: new Date(),
          event: eventName,
          data: {},
        };

        setEvents((prev) => [currentEvent!, ...prev.slice(0, 49)]);
      }
      originalGroup(...args);
    };

    // Intercept console.log calls to capture event data
    console.log = (...args: any[]) => {
      if (captureData && currentEvent && currentEvent.id && args.length >= 2) {
        const label = args[0];
        const value = args[1];
        const eventId = currentEvent.id;

        // Build data object from all console.log calls
        if (typeof label === 'string' && eventId) {
          let key = '';
          if (label === '📅 Time:') key = 'timestamp';
          else if (label === '📍 Event:') key = 'event_name';
          else if (label === '📋 Data:') key = 'metadata';
          else if (label === '🌍 URL:') key = 'url';
          else if (label === '👤 User Agent:') key = 'user_agent';

          if (key) {
            setEvents((prev) =>
              prev.map((event) => {
                if (!event || !event.id || event.id !== eventId) return event;
                return {
                  ...event,
                  data: { ...(event.data || {}), [key]: value },
                };
              })
            );

            // Update local reference if still exists
            if (currentEvent && currentEvent.data !== null) {
              currentEvent.data = {
                ...(currentEvent.data || {}),
                [key]: value,
              };
            }
          }
        }
      }

      originalLog(...args);
    };

    // Reset when group ends
    console.groupEnd = () => {
      captureData = false;
      currentEvent = null;
      originalGroupEnd();
    };

    return () => {
      console.log = originalLog;
      console.group = originalGroup;
      console.groupEnd = originalGroupEnd;
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
          inputSize: 150,
        }),
    },
    {
      name: 'Favorite Tool',
      action: () => trackFavorite('json-formatter', 'tool', 'add', 1),
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

              <div className="mt-4 rounded-lg bg-orange-50 p-3 dark:bg-orange-950/20">
                <div className="flex items-center gap-2 text-xs font-medium text-orange-700 dark:text-orange-400">
                  <span>⚠️</span>
                  <span>Development Mode</span>
                </div>
                <p className="mt-1 text-xs text-orange-600 dark:text-orange-300">
                  Events are logged but NOT sent to Umami in development. Data
                  is only sent in production.
                </p>
              </div>
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
                  {events
                    .filter((event) => event && event.id)
                    .map((event) => (
                      <div
                        key={event.id}
                        className="rounded-lg border-l-4 border-purple-500 bg-gray-50 p-3 dark:bg-gray-800"
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <span className="font-medium text-purple-600 dark:text-purple-400">
                            {event.event || 'Unknown Event'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {event.timestamp
                              ? event.timestamp.toLocaleTimeString()
                              : 'No time'}
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
