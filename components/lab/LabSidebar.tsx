'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Grid3X3 } from 'lucide-react';
import { useToolStore } from '@/lib/store/toolStore';
import { tools, getToolById } from '@/lib/tools';
import { cn } from '@/lib/utils';
import { useToolLabel } from '@/lib/services/toolLabelService';
import { useToolLabels } from '@/lib/hooks/useToolLabels';

interface LabSidebarProps {
  selectedToolId: string | null;
  onToolSelect: (toolId: string) => void;
  onShowOverview: () => void;
}

export function LabSidebar({
  selectedToolId,
  onToolSelect,
  onShowOverview,
}: LabSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { favoriteTools } = useToolStore();

  const favoriteToolsData = favoriteTools
    .map((toolId) => getToolById(toolId))
    .filter((tool): tool is NonNullable<typeof tool> => Boolean(tool));

  return (
    <motion.div
      className={cn(
        'flex min-h-[calc(100vh-9rem)] flex-col border-r border-gray-200 bg-white transition-all duration-300 dark:border-gray-800 dark:bg-gray-950',
        isCollapsed ? 'w-16' : 'w-64'
      )}
      initial={false}
      animate={{ width: isCollapsed ? 64 : 256 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 p-3 dark:border-gray-800">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-2"
            >
              <Star className="h-4 w-4 fill-purple-500 text-purple-500" />
              <h2 className="text-sm font-medium text-gray-900 dark:text-white">
                My Tools
              </h2>
              <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500 dark:bg-gray-800">
                {favoriteToolsData.length}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-md p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-500" />
          )}
        </button>
      </div>

      {/* Overview Button */}
      <div className="border-b border-gray-200 p-3 dark:border-gray-800">
        <button
          onClick={onShowOverview}
          className={cn(
            'flex w-full items-center gap-2 rounded-lg p-2 transition-all duration-200',
            selectedToolId === null
              ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
              : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
          )}
        >
          <Grid3X3 className="h-4 w-4 flex-shrink-0" />
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-sm font-medium"
              >
                Overview
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Tools List */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1 p-3">
          <AnimatePresence>
            {favoriteToolsData.map((tool, index) => (
              <ToolSidebarItem
                key={tool.id}
                tool={tool}
                isSelected={selectedToolId === tool.id}
                isCollapsed={isCollapsed}
                index={index}
                onClick={() => onToolSelect(tool.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="border-t border-gray-200 p-4 dark:border-gray-800"
        >
          <p className="text-center text-xs text-gray-500">
            Star tools to add them here
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

interface ToolSidebarItemProps {
  tool: any;
  isSelected: boolean;
  isCollapsed: boolean;
  index: number;
  onClick: () => void;
}

function ToolSidebarItem({
  tool,
  isSelected,
  isCollapsed,
  index,
  onClick,
}: ToolSidebarItemProps) {
  const toolLabel = useToolLabel(tool.id);
  const { getToolLabelInfo } = useToolLabels();
  const labelConfig = getToolLabelInfo(toolLabel);

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'group flex w-full items-center gap-2 rounded-lg p-2 transition-all duration-200',
        isSelected
          ? 'bg-purple-50 text-purple-700 shadow-sm dark:bg-purple-900/20 dark:text-purple-300'
          : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
      )}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="flex-shrink-0 text-lg" title={tool.name}>
          {tool.icon}
        </span>

        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="min-w-0 flex-1"
            >
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium">
                  {tool.name}
                </span>
                {tool.label && labelConfig.config && (
                  <span
                    className={cn(
                      'rounded-full px-1.5 py-0.5 text-xs font-medium',
                      labelConfig.config.className
                    )}
                  >
                    {labelConfig.config.text}
                  </span>
                )}
              </div>
              <p className="truncate text-left text-xs text-gray-500 dark:text-gray-400">
                {tool.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isSelected && (
        <motion.div
          className="h-2 w-2 flex-shrink-0 rounded-full bg-purple-500"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />
      )}
    </motion.button>
  );
}
