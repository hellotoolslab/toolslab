'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, 
  ChevronRight, 
  Zap, 
  Eye, 
  X,
  Copy,
  Save,
  History,
  Sparkles,
  Command
} from 'lucide-react'
import { useToolChainStore } from '@/lib/stores/toolChainStore'
import { tools } from '@/data/tools'
import { cn } from '@/lib/utils'

interface ToolChainSuggestionsProps {
  className?: string
}

export default function ToolChainSuggestions({ className }: ToolChainSuggestionsProps) {
  const {
    showSuggestions,
    suggestedTools,
    lastDetection,
    lastProcessedOutput,
    currentChain,
    chainedData,
    setSuggestionsVisible,
    generateChainUrl,
    saveCurrentChain,
    setChainedData
  } = useToolChainStore()

  const [copiedToClipboard, setCopiedToClipboard] = useState(false)

  const handleCopyOutput = async () => {
    if (lastProcessedOutput) {
      await navigator.clipboard.writeText(lastProcessedOutput)
      setCopiedToClipboard(true)
      setTimeout(() => setCopiedToClipboard(false), 2000)
    }
  }

  const handleSaveChain = () => {
    saveCurrentChain()
    // Could show a toast notification here
  }

  const handleContinueWithTool = (toolSlug: string) => {
    if (lastProcessedOutput) {
      setChainedData(lastProcessedOutput)
    }
  }

  const getSuggestedToolData = (toolSlug: string) => {
    return tools.find(tool => tool.slug === toolSlug)
  }

  if (!showSuggestions || !lastDetection || suggestedTools.length === 0) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn(
          "relative bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-6 mt-6",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Continue Your Workflow
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {lastDetection.description} • {suggestedTools.length} suggested tools
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Actions */}
            <button
              onClick={handleCopyOutput}
              className="p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              title="Copy output"
            >
              <Copy className="w-4 h-4" />
            </button>

            {currentChain.length > 1 && (
              <button
                onClick={handleSaveChain}
                className="p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                title="Save workflow"
              >
                <Save className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setSuggestionsVisible(false)}
              className="p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              title="Hide suggestions"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Detection Info */}
        <div className="mb-4 p-3 bg-white/60 dark:bg-gray-800/30 rounded-lg border border-white/50 dark:border-gray-700/50">
          <div className="flex items-center gap-2 text-sm">
            <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-gray-700 dark:text-gray-300">
              Detected: <span className="font-medium">{lastDetection.type}</span>
            </span>
            <div className="flex-1" />
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {Math.round(lastDetection.confidence * 100)}% confidence
              </span>
            </div>
          </div>
        </div>

        {/* Tool Suggestions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {suggestedTools.slice(0, 6).map((toolSlug, index) => {
            const tool = getSuggestedToolData(toolSlug)
            if (!tool) return null

            return (
              <motion.div
                key={toolSlug}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={generateChainUrl(toolSlug)}
                  onClick={() => handleContinueWithTool(toolSlug)}
                  className="group flex items-center gap-3 p-3 bg-white/70 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-700 rounded-xl border border-white/50 dark:border-gray-700/50 hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex-shrink-0 text-2xl">
                    {typeof tool.icon === 'string' ? tool.icon : <tool.icon className="w-6 h-6" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {tool.name}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {tool.description}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Chain Progress */}
        {currentChain.length > 0 && (
          <div className="border-t border-white/50 dark:border-gray-700/50 pt-4">
            <div className="flex items-center gap-2 mb-3">
              <History className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Current Chain ({currentChain.length} steps)
              </span>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {currentChain.map((step, index) => (
                <div key={step.id} className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/50 dark:bg-gray-800/30 rounded-lg border border-white/50 dark:border-gray-700/50">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {step.toolName}
                    </span>
                  </div>
                  {index < currentChain.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Keyboard Hint */}
        <div className="mt-4 pt-3 border-t border-white/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white/50 dark:bg-gray-800/50 rounded border border-white/50 dark:border-gray-700/50 font-mono">
                  <Command className="w-3 h-3 inline mr-1" />K
                </kbd>
                <span>Toggle</span>
              </div>
              
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white/50 dark:bg-gray-800/50 rounded border border-white/50 dark:border-gray-700/50 font-mono">
                  <Command className="w-3 h-3 inline mr-1" />⇧C
                </kbd>
                <span>Copy</span>
              </div>
            </div>
            
            {copiedToClipboard && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-green-600 dark:text-green-400 font-medium"
              >
                Copied!
              </motion.span>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}