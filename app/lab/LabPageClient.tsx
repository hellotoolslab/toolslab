'use client';

import NewLabHubContent from '../../components/layout/NewLabHubContent';
import { type Locale } from '@/lib/i18n/config';
import { DictionaryProvider } from '@/components/providers/DictionaryProvider';

interface LabPageClientProps {
  locale?: Locale;
  dictionary?: any;
}

export function LabPageClient({
  locale = 'en',
  dictionary,
}: LabPageClientProps) {
  const labSections = ['common', 'lab'];

  return (
    <DictionaryProvider
      locale={locale}
      sections={labSections}
      initialDictionary={dictionary}
    >
      <NewLabHubContent locale={locale} dictionary={dictionary} />
    </DictionaryProvider>
  );
}
