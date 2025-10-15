'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToolStore } from '@/lib/store/toolStore';
import { WelcomePopup, HelpButton } from '@/components/lab/WelcomePopup';
import { labToasts } from '@/lib/utils/toasts';
import { LabSidebar } from '@/components/lab/LabSidebar';
import { LabToolViewer } from '@/components/lab/LabToolViewer';
import { LabOverview } from '@/components/lab/LabOverview';
import { useHydration } from '@/lib/hooks/useHydration';
import {
  trackLabVisited,
  trackLabEmptyStateVisited,
  trackLabWelcomeToastShown,
  trackLabToolSelected,
  trackLabOverviewSelected,
} from '@/lib/analytics/helpers/trackingHelpers';

// Import della vista vuota esistente
import LabHubContent from './LabHubContent';

export default function NewLabHubContent() {
  const isHydrated = useHydration();
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
    if (!isHydrated) return; // Wait for hydration before accessing store

    setLabVisited();

    const { favoriteTools, favoriteCategories } = useToolStore.getState();
    const favoriteCount = favoriteTools.length + favoriteCategories.length;

    if (favoriteCount === 0) {
      trackLabEmptyStateVisited();
    } else {
      trackLabVisited({
        favoritesCount: favoriteCount,
        toolsCount: favoriteTools.length,
        categoriesCount: favoriteCategories.length,
      });
    }
  }, [isHydrated]); // Re-run when hydration completes

  // Show welcome toast if first visit with favorites
  useEffect(() => {
    const { labVisited } = useToolStore.getState();
    if (
      !labVisited &&
      (favoriteTools.length > 0 || favoriteCategories.length > 0)
    ) {
      setTimeout(() => {
        labToasts.welcomeToLab();
        trackLabWelcomeToastShown();
      }, 1000);
    }
  }, [favoriteTools.length, favoriteCategories.length]);

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
    trackLabToolSelected(toolId);
  };

  const handleShowOverview = () => {
    setSelectedToolId(null);
    trackLabOverviewSelected();
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
              My Developer Lab
            </h1>
            <p className="text-sm text-purple-100">
              Your personalized toolkit for maximum productivity
            </p>
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
