import { Suspense } from 'react';
import { Metadata } from 'next';
import ToolPageClient from '@/components/tools/ToolPageClient';

const TOOL_ID = 'unix-timestamp-converter';

export const metadata: Metadata = {
  title: 'Unix Timestamp Converter - Convert Timestamps to Dates | ToolsLab',
  description:
    'Professional Unix timestamp converter with timezone support, batch processing, and code generation. Convert epoch time to readable dates and vice versa with real-time validation. Features multiple date formats, relative time calculations, developer code examples, and timezone-aware conversions. Perfect for developers working with APIs, databases, logs, and system integrations.',
  keywords: [
    'unix timestamp converter',
    'epoch time converter',
    'timestamp to date',
    'date to timestamp',
    'unix time',
    'epoch converter',
    'timestamp converter online',
    'unix timestamp to date',
    'date to unix timestamp',
    'timestamp generator',
    'timezone converter',
    'batch timestamp converter',
    'timestamp code generator',
    'unix time converter',
    'milliseconds to date',
    'seconds to date',
    'posix time converter',
    'developer tools',
    'timestamp validation',
    'time zone conversion',
  ],
  openGraph: {
    title: 'Unix Timestamp Converter - Convert Timestamps to Dates',
    description:
      'Professional Unix timestamp converter with timezone support and batch processing. Convert epoch time to readable dates with code examples for developers.',
    type: 'website',
    url: 'https://toolslab.dev/tools/unix-timestamp-converter',
  },
  alternates: {
    canonical: 'https://toolslab.dev/tools/unix-timestamp-converter',
  },
  other: {
    'format-detection': 'telephone=no',
  },
};

export default function UnixTimestampConverterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ToolPageClient toolId={TOOL_ID} />
    </Suspense>
  );
}
