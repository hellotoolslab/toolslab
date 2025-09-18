import { Metadata } from 'next';
import { Suspense } from 'react';
import ToolPageClient from '@/components/tools/ToolPageClient';

export const metadata: Metadata = {
  title: 'JSON to CSV Converter - Convert JSON to Excel CSV Format | ToolsLab',
  description:
    'Convert JSON to CSV with advanced formatting, flattening, and column mapping options. Transform JSON arrays, nested objects into Excel-compatible CSV files. Free online JSON to CSV converter.',
  keywords: [
    'json to csv',
    'json converter',
    'convert json to excel',
    'json to csv online',
    'json parser',
    'csv converter',
    'json to spreadsheet',
    'data transformation',
    'flatten json',
    'export json',
    'json array to csv',
    'json to table',
    'data export',
    'api response to csv',
    'json to excel converter',
  ],
  openGraph: {
    title: 'JSON to CSV Converter - Free Online Tool | ToolsLab',
    description:
      'Transform JSON data into CSV format with advanced options. Perfect for Excel imports, data analysis, and API response conversion.',
    type: 'website',
    url: 'https://toolslab.dev/tools/json-to-csv',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON to CSV Converter - ToolsLab',
    description:
      'Convert JSON to CSV with column mapping, nested object flattening, and custom formatting. Export to Excel-compatible format.',
  },
  alternates: {
    canonical: 'https://toolslab.dev/tools/json-to-csv',
  },
};

export default function JsonToCsvPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ToolPageClient toolId="json-to-csv" />
    </Suspense>
  );
}
