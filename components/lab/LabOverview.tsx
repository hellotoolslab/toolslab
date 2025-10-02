'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useToolStore } from '@/lib/store/toolStore';
import { getToolById } from '@/lib/tools';
import { FavoriteButton } from '@/components/lab/FavoriteButton';
import { useToolLabel } from '@/lib/services/toolLabelService';
import { useToolLabels } from '@/lib/hooks/useToolLabels';
import { cn } from '@/lib/utils';
import { useHydration } from '@/lib/hooks/useHydration';

interface LabOverviewProps {
  onToolSelect: (toolId: string) => void;
}

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function LabOverview({ onToolSelect }: LabOverviewProps) {
  const isHydrated = useHydration();
  const { favoriteTools, getRecentTools } = useToolStore();

  const favoriteToolsData = isHydrated
    ? favoriteTools
        .map((toolId) => getToolById(toolId))
        .filter((tool): tool is NonNullable<typeof tool> => Boolean(tool))
    : [];

  const recentTools = isHydrated ? getRecentTools(6) : [];

  return (
    <motion.div
      className="flex-1 overflow-y-auto p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Favorite Tools Grid */}
        <div>
          <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
            Favorite Tools
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {favoriteToolsData.map((tool, index) => (
              <ToolOverviewCard
                key={tool.id}
                tool={tool}
                index={index}
                onClick={() => onToolSelect(tool.id)}
              />
            ))}
          </div>
        </div>

        {/* Recent Tools */}
        {recentTools.length > 0 && (
          <div>
            <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
              Recently Used
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentTools.slice(0, 6).map((recentTool, index) => {
                const tool = getToolById(recentTool.id);
                if (!tool) return null;

                return (
                  <div
                    key={tool.id}
                    className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
                    onClick={() => onToolSelect(tool.id)}
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <span className="text-2xl">{tool.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 transition-colors group-hover:text-purple-600 dark:text-white dark:group-hover:text-purple-400">
                          {tool.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Used {formatTimeAgo(recentTool.timestamp)}
                        </p>
                      </div>
                      <FavoriteButton type="tool" id={tool.id} />
                    </div>
                    <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                      {tool.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface ToolOverviewCardProps {
  tool: any;
  index: number;
  onClick: () => void;
}

function ToolOverviewCard({ tool, index, onClick }: ToolOverviewCardProps) {
  const toolLabel = useToolLabel(tool.id);
  const { getToolLabelInfo } = useToolLabels();
  const labelConfig = getToolLabelInfo(toolLabel);

  return (
    <motion.div
      className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-gray-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="text-3xl">{tool.icon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 transition-colors group-hover:text-purple-600 dark:text-white dark:group-hover:text-purple-400">
              {tool.name}
            </h3>
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
        </div>
        <FavoriteButton type="tool" id={tool.id} />
      </div>
      <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
        {tool.description}
      </p>
    </motion.div>
  );
}
