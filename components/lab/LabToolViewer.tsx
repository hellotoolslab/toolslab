'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ExternalLink, Info, BookOpen } from 'lucide-react';
import { getToolById } from '@/lib/tools';
import ToolWorkspace from '@/components/tools/ToolWorkspace';
import ToolHeroSection from '@/components/tools/ToolHeroSection';
import ToolHowToUse from '@/components/tools/ToolHowToUse';
import { FavoriteButton } from '@/components/lab/FavoriteButton';
import { useToolLabel } from '@/lib/services/toolLabelService';
import { useToolLabels } from '@/lib/hooks/useToolLabels';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface LabToolViewerProps {
  toolId: string;
  onBack: () => void;
}

export function LabToolViewer({ toolId, onBack }: LabToolViewerProps) {
  const [showInstructions, setShowInstructions] = useState(false);
  const [mounted, setMounted] = useState(false);

  const tool = getToolById(toolId);
  const toolLabel = useToolLabel(toolId);
  const { getToolLabelInfo } = useToolLabels();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !tool) {
    return (
      <div className="flex-1 p-8">
        <div className="animate-pulse">
          <div className="mb-4 h-8 w-1/3 rounded bg-gray-200 dark:bg-gray-800"></div>
          <div className="mb-8 h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-800"></div>
          <div className="h-64 rounded bg-gray-200 dark:bg-gray-800"></div>
        </div>
      </div>
    );
  }

  const labelConfig = getToolLabelInfo(toolLabel);

  return (
    <motion.div
      className="flex h-full flex-1 flex-col overflow-hidden"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="border-b border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
        <div className="mb-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-xs">Back to Lab</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className={cn(
                'flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                showInstructions
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              )}
            >
              <BookOpen className="h-4 w-4" />
              How to use
            </button>

            <Link
              href={tool.route}
              target="_blank"
              className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <ExternalLink className="h-4 w-4" />
              Open in new tab
            </Link>

            <FavoriteButton type="tool" id={tool.id} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{tool.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {tool.name}
                </h1>
                {tool.label && labelConfig.config && (
                  <span
                    className={cn(
                      'rounded-full px-2 py-1 text-xs font-medium',
                      labelConfig.config.className
                    )}
                  >
                    {labelConfig.config.text}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {tool.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {showInstructions ? (
            <motion.div
              key="instructions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full overflow-y-auto p-6"
            >
              <ToolHowToUse toolId={tool.id} categoryColor="purple" />
            </motion.div>
          ) : (
            <motion.div
              key="tool"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full"
            >
              <ToolWorkspace
                tool={
                  {
                    ...tool,
                    slug: tool.id,
                    category: tool.categories[0] || 'dev',
                  } as any
                }
                categoryColor="purple"
                isLabMode={true}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
