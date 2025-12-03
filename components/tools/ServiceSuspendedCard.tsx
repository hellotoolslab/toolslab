'use client';

import { Card } from '@/components/ui/card';
import { AlertTriangleIcon, CoffeeIcon, HeartIcon } from 'lucide-react';
import { trackConversion } from '@/lib/analytics';

// Default suspended messages (English fallback)
export const defaultSuspendedMessages = {
  title: 'Service Temporarily Unavailable',
  description: "We're sorry, but this service has been temporarily suspended.",
  whyTitle: 'Why is this happening?',
  whyDescription:
    "This tool requires a dedicated paid server to process your files. The server is owned and operated by us, but the hosting costs have become unsustainable. We've had to temporarily suspend the service until we can cover these expenses.",
  helpTitle: 'Help us bring it back!',
  helpDescription:
    'Your support can help us cover the server costs and reactivate this service. Every contribution, no matter how small, makes a difference.',
  donateButton: 'Buy me a coffee',
  thanks: 'Thank you for your understanding and support!',
};

export interface SuspendedMessages {
  title: string;
  description: string;
  whyTitle: string;
  whyDescription: string;
  helpTitle: string;
  helpDescription: string;
  donateButton: string;
  thanks: string;
}

interface ServiceSuspendedCardProps {
  messages?: Partial<SuspendedMessages>;
  donateUrl?: string;
}

export function ServiceSuspendedCard({
  messages,
  donateUrl = 'https://buymeacoffee.com/toolslab',
}: ServiceSuspendedCardProps) {
  // Merge provided messages with defaults
  const m = { ...defaultSuspendedMessages, ...messages };

  return (
    <Card className="p-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
          <AlertTriangleIcon className="h-8 w-8 text-amber-600 dark:text-amber-500" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {m.title}
        </h2>
        <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
          {m.description}
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <div className="rounded-lg bg-gray-100 p-4 text-sm dark:bg-gray-700/50">
          <p className="mb-2 font-medium text-gray-900 dark:text-white">
            {m.whyTitle}
          </p>
          <p className="text-gray-600 dark:text-gray-400">{m.whyDescription}</p>
        </div>

        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <div className="mb-3 flex items-center justify-center gap-2">
            <HeartIcon className="h-5 w-5 text-primary" />
            <p className="font-medium text-gray-900 dark:text-white">
              {m.helpTitle}
            </p>
          </div>
          <p className="mb-4 text-center text-sm text-gray-600 dark:text-gray-400">
            {m.helpDescription}
          </p>
          <a
            href={donateUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackConversion('donation', 'suspended-service-card')
            }
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#FFDD00] px-4 py-3 font-medium text-black transition-colors hover:bg-[#FFDD00]/90"
          >
            <CoffeeIcon className="h-5 w-5" />
            {m.donateButton}
          </a>
        </div>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          {m.thanks}
        </p>
      </div>
    </Card>
  );
}
