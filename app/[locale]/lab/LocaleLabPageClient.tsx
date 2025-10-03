'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToolStore } from '@/lib/store/toolStore';
import { WelcomePopup, HelpButton } from '@/components/lab/WelcomePopup';
import { labToasts } from '@/lib/utils/toasts';
import { useUmami } from '@/components/analytics/OptimizedUmamiProvider';
import { LabSidebar } from '@/components/lab/LabSidebar';
import { LabToolViewer } from '@/components/lab/LabToolViewer';
import { LabOverview } from '@/components/lab/LabOverview';
import { type Locale } from '@/lib/i18n/config';
import { type Dictionary } from '@/lib/i18n/get-dictionary';

// Import della vista vuota esistente
import LabHubContent from '../../../components/layout/LabHubContent';

interface LocaleLabPageClientProps {
  locale: Locale;
  dictionary: Dictionary;
}

export function LocaleLabPageClient({
  locale,
  dictionary,
}: LocaleLabPageClientProps) {
  const { trackEngagement } = useUmami();
  const {
    favoriteTools,
    favoriteCategories,
    labVisited,
    getFavoriteCount,
    getRecentTools,
    setLabVisited,
  } = useToolStore();

  const [mounted, setMounted] = useState(false);
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setLabVisited();

    const { favoriteTools, favoriteCategories } = useToolStore.getState();
    const favoriteCount = favoriteTools.length + favoriteCategories.length;

    if (favoriteCount === 0) {
      trackEngagement('lab-empty-state-visited', { locale });
    } else {
      trackEngagement('lab-visited', {
        favorites_count: favoriteCount,
        tools_count: favoriteTools.length,
        categories_count: favoriteCategories.length,
        locale,
      });
    }
  }, []); // Run only once on mount

  // Show welcome toast if first visit with favorites
  useEffect(() => {
    const { labVisited } = useToolStore.getState();
    if (
      !labVisited &&
      (favoriteTools.length > 0 || favoriteCategories.length > 0)
    ) {
      setTimeout(() => {
        labToasts.welcomeToLab();
        trackEngagement('lab-welcome-toast-shown', { locale });
      }, 1000);
    }
  }, [
    favoriteTools.length,
    favoriteCategories.length,
    trackEngagement,
    locale,
  ]);

  // Localized texts
  const text = {
    title: locale === 'it' ? 'Il Mio Lab' : 'My Developer Lab',
    subtitle:
      locale === 'it'
        ? 'Il tuo toolkit personalizzato per la massima produttività'
        : 'Your personalized toolkit for maximum productivity',
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-purple-800 py-20">
          <div className="animate-pulse">
            <div className="mx-auto max-w-4xl px-4 text-center">
              <div className="mx-auto mb-4 h-12 w-96 rounded bg-white/20" />
              <div className="w-128 mx-auto mb-8 h-6 rounded bg-white/10" />
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-40 rounded-xl bg-gray-200 dark:bg-gray-800"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const favoriteCount = getFavoriteCount();
  const isEmpty = favoriteCount === 0;

  // Se non ci sono tool preferiti, mostra la vista vuota esistente
  if (isEmpty) {
    return <LabHubContent />;
  }

  const handleToolSelect = (toolId: string) => {
    setSelectedToolId(toolId);
    trackEngagement('lab-tool-selected', { tool_id: toolId, locale });
  };

  const handleShowOverview = () => {
    setSelectedToolId(null);
    trackEngagement('lab-overview-selected', { locale });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-purple-800 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="mb-2 text-2xl font-bold text-white md:text-3xl">
              {text.title}
            </h1>
            <p className="text-sm text-purple-100">{text.subtitle}</p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-9rem)]">
        {/* Sidebar */}
        <LabSidebar
          selectedToolId={selectedToolId}
          onToolSelect={handleToolSelect}
          onShowOverview={handleShowOverview}
        />

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {selectedToolId ? (
              <LabToolViewer
                key={selectedToolId}
                toolId={selectedToolId}
                onBack={handleShowOverview}
              />
            ) : (
              <LabOverview key="overview" onToolSelect={handleToolSelect} />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Welcome popup and help button */}
      <WelcomePopup />
      <HelpButton />
    </div>
  );
}
