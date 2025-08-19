'use client'

import { useState } from 'react'
import { 
  Copy, 
  Check,
  RefreshCw,
  Download,
  Zap,
  Hash
} from 'lucide-react'

interface UuidGeneratorProps {
  categoryColor: string
}

export default function UuidGenerator({ categoryColor }: UuidGeneratorProps) {
  const [uuids, setUuids] = useState<string[]>([])
  const [count, setCount] = useState(1)
  const [version, setVersion] = useState('v4')
  const [uppercase, setUppercase] = useState(false)
  const [hyphens, setHyphens] = useState(true)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const generateUUID = () => {
    const newUuids = []
    for (let i = 0; i < count; i++) {
      let uuid = crypto.randomUUID()
      
      if (!hyphens) {
        uuid = uuid.replace(/-/g, '')
      }
      
      if (uppercase) {
        uuid = uuid.toUpperCase()
      }
      
      newUuids.push(uuid)
    }
    setUuids(newUuids)
  }

  const handleCopy = async (uuid: string, index: number) => {
    try {
      await navigator.clipboard.writeText(uuid)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(uuids.join('\n'))
      setCopiedIndex(-1)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([uuids.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `uuids-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Tool Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <Hash className="w-5 h-5" style={{ color: categoryColor }} />
          <h3 className="font-semibold text-gray-900 dark:text-white">UUID Generator</h3>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Universally Unique Identifier
        </span>
      </div>

      <div className="p-6 space-y-6">
        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                Count
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                Version
              </label>
              <select
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="v4">Version 4 (Random)</option>
                <option value="v1">Version 1 (Timestamp)</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="rounded"
                style={{ accentColor: categoryColor }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Uppercase</span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hyphens}
                onChange={(e) => setHyphens(e.target.checked)}
                className="rounded"
                style={{ accentColor: categoryColor }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Include hyphens</span>
            </label>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-center">
          <button
            onClick={generateUUID}
            className="px-8 py-3 rounded-lg font-medium text-white transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            style={{
              backgroundColor: categoryColor,
              boxShadow: `0 4px 12px ${categoryColor}40`
            }}
          >
            <Zap className="w-4 h-4" />
            Generate UUID{count > 1 ? 's' : ''}
          </button>
        </div>

        {/* Results */}
        {uuids.length > 0 && (
          <div className="space-y-3 animate-slideIn">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Generated UUIDs ({uuids.length})
              </label>
              <div className="flex items-center gap-2">
                {uuids.length > 1 && (
                  <button
                    onClick={handleCopyAll}
                    className="px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
                  >
                    {copiedIndex === -1 ? (
                      <>
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-500">All Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span className="text-sm">Copy All</span>
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={handleDownload}
                  className="px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Download</span>
                </button>
                <button
                  onClick={generateUUID}
                  className="px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-sm">Regenerate</span>
                </button>
              </div>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {uuids.map((uuid, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all"
                  style={{ 
                    animation: `slideIn ${0.1 * (index + 1)}s ease-out`,
                    borderColor: copiedIndex === index ? categoryColor : undefined
                  }}
                >
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-8">
                    {index + 1}.
                  </span>
                  <code className="flex-1 font-mono text-sm text-gray-900 dark:text-white">
                    {uuid}
                  </code>
                  <button
                    onClick={() => handleCopy(uuid, index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            UUIDs are 128-bit unique identifiers that are practically guaranteed to be unique across all systems and time.
          </p>
        </div>
      </div>
    </div>
  )
}