'use client';

import { Tool, getCategoryColorClass, getCategoryByTool } from '@/lib/tools';
import { ArrowLeft, Clock, Star, Copy, Download, Upload, RotateCw, Maximize2, Share2, History, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useToolStore } from '@/lib/store/toolStore';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ToolLayoutProps {
  tool: Tool;
  children?: React.ReactNode;
}

export function ToolLayout({ tool, children }: ToolLayoutProps) {
  const { history, addToHistory, getUserLevel } = useToolStore();
  const [recentUses, setRecentUses] = useState<number>(0);
  const [userLevel, setUserLevel] = useState<'first_time' | 'returning' | 'power'>('first_time');
  const categoryClass = getCategoryColorClass(tool.categoryColor);
  const category = getCategoryByTool(tool);

  useEffect(() => {
    const toolHistory = history.filter(h => h.tool === tool.id);
    setRecentUses(toolHistory.length);
    setUserLevel(getUserLevel());
  }, [history, tool.id, getUserLevel]);

  const handleToolUse = (input: string, output: string) => {
    addToHistory({
      id: `${Date.now()}-${Math.random()}`,
      tool: tool.id,
      input,
      output,
      timestamp: Date.now(),
    });
  };

  return (
    <div className={cn('min-h-screen', categoryClass)}>
      <div className="container-main py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm mb-8">
          <Link
            href="/"
            className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Tools</span>
          </Link>
          <span className="text-gray-400">/</span>
          {category && (
            <>
              <Link
                href={`/?category=${category.id}`}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                style={{ color: `var(--category-primary)` }}
              >
                {category.name}
              </Link>
              <span className="text-gray-400">/</span>
            </>
          )}
          <span className="text-gray-900 dark:text-gray-100 font-medium">{tool.name}</span>
        </nav>

        {/* Tool Header */}
        <div className="tool-header">
          <div className="tool-icon-container">
            <span className="text-4xl">{tool.icon}</span>
          </div>
          
          <div className="tool-content">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="tool-title">{tool.name}</h1>
                <div className="flex items-center gap-3 mb-4">
                  <div className="badge badge-category">
                    {category?.name || tool.category}
                  </div>
                  {tool.isPopular && (
                    <div className="badge badge-popular flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Popular
                    </div>
                  )}
                </div>
              </div>
              
              {/* Tool Actions */}
              <div className="flex items-center gap-2">
                <button className="btn btn-secondary flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button className="btn btn-secondary flex items-center gap-2">
                  <History className="w-4 h-4" />
                  History
                </button>
              </div>
            </div>

            <p className="tool-description">{tool.description}</p>
            
            <div className="tool-meta">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{recentUses} uses</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4" />
                <span className="capitalize">{userLevel.replace('_', ' ')} user</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4" />
                <span>{(tool.searchVolume / 100).toFixed(1)}k uses today</span>
              </div>
            </div>

            <div className="tool-keywords">
              {tool.keywords.map((keyword) => (
                <span key={keyword} className="badge badge-category">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tool Content */}
        {children ? (
          <div className="tool-workspace">
            {children}
          </div>
        ) : (
          <div className="tool-workspace">
            {/* Input Panel */}
            <div className="tool-panel">
              <div className="tool-panel-header">
                <div className="tool-panel-label">
                  <Upload className="w-4 h-4" />
                  <span>Input</span>
                </div>
                <div className="tool-panel-actions">
                  <button className="btn btn-secondary btn-sm">
                    <Upload className="w-4 h-4" />
                  </button>
                  <button className="btn btn-secondary btn-sm">
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <textarea
                className="textarea textarea-input input-category"
                placeholder="Paste or type your input here..."
                rows={12}
              />
              
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  0 characters
                </div>
                <button className="btn btn-category">
                  <RotateCw className="w-4 h-4 mr-2" />
                  Process
                </button>
              </div>
            </div>

            {/* Output Panel */}
            <div className="tool-panel">
              <div className="tool-panel-header">
                <div className="tool-panel-label">
                  <Download className="w-4 h-4" />
                  <span>Output</span>
                </div>
                <div className="tool-panel-actions">
                  <button className="btn btn-secondary btn-sm">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button className="btn btn-secondary btn-sm">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="btn btn-secondary btn-sm">
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <textarea
                className="textarea textarea-output input-category"
                placeholder="Processed output will appear here..."
                rows={12}
                readOnly
              />
              
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Ready to copy
                </div>
                <button className="btn btn-copy">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Result
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tool Tips */}
        <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl">💡</span>
            Tips & Shortcuts
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border text-xs">Ctrl+V</kbd>
                <span>Paste input</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border text-xs">Ctrl+A</kbd>
                <span>Select all output</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border text-xs">Ctrl+C</kbd>
                <span>Copy output</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border text-xs">Ctrl+Enter</kbd>
                <span>Process input</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}