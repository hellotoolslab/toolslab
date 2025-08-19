'use client'

import { useState, useEffect } from 'react'
import { 
  Copy, 
  Download, 
  Check,
  Loader2,
  ChevronRight,
  ChevronDown,
  FileJson,
  Minimize2,
  Maximize2,
  Eye,
  Code
} from 'lucide-react'

interface JsonFormatterProps {
  categoryColor: string
}

export default function JsonFormatter({ categoryColor }: JsonFormatterProps) {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [viewMode, setViewMode] = useState<'tree' | 'formatted'>('formatted')
  const [indentSize, setIndentSize] = useState(2)
  const [sortKeys, setSortKeys] = useState(false)

  const formatJson = () => {
    setIsProcessing(true)
    setError(null)

    setTimeout(() => {
      try {
        const parsed = JSON.parse(input)
        
        // Sort keys if enabled
        const processObject = (obj: any): any => {
          if (!sortKeys || typeof obj !== 'object' || obj === null) return obj
          
          if (Array.isArray(obj)) {
            return obj.map(processObject)
          }
          
          const sorted: any = {}
          Object.keys(obj).sort().forEach(key => {
            sorted[key] = processObject(obj[key])
          })
          return sorted
        }
        
        const processed = sortKeys ? processObject(parsed) : parsed
        const formatted = JSON.stringify(processed, null, indentSize)
        setOutput(formatted)
      } catch (err) {
        setError('Invalid JSON: ' + (err as Error).message)
      } finally {
        setIsProcessing(false)
      }
    }, 100)
  }

  const minifyJson = () => {
    setIsProcessing(true)
    setError(null)

    setTimeout(() => {
      try {
        const parsed = JSON.parse(input)
        const minified = JSON.stringify(parsed)
        setOutput(minified)
      } catch (err) {
        setError('Invalid JSON: ' + (err as Error).message)
      } finally {
        setIsProcessing(false)
      }
    }, 100)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'formatted.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const renderJsonTree = (data: any, depth = 0): JSX.Element => {
    if (data === null) return <span className="text-gray-500">null</span>
    if (typeof data === 'boolean') return <span className="text-purple-600 dark:text-purple-400">{String(data)}</span>
    if (typeof data === 'number') return <span className="text-blue-600 dark:text-blue-400">{data}</span>
    if (typeof data === 'string') return <span className="text-green-600 dark:text-green-400">"{data}"</span>
    
    if (Array.isArray(data)) {
      return (
        <details open={depth < 2} className="ml-4">
          <summary className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-1">
            <span className="text-gray-500">Array[{data.length}]</span>
          </summary>
          <div className="ml-4">
            {data.map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-gray-400">{index}:</span>
                {renderJsonTree(item, depth + 1)}
              </div>
            ))}
          </div>
        </details>
      )
    }
    
    if (typeof data === 'object') {
      const entries = Object.entries(data)
      return (
        <details open={depth < 2} className="ml-4">
          <summary className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-1">
            <span className="text-gray-500">Object{`{${entries.length}}`}</span>
          </summary>
          <div className="ml-4">
            {entries.map(([key, value]) => (
              <div key={key} className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-400">"{key}":</span>
                {renderJsonTree(value, depth + 1)}
              </div>
            ))}
          </div>
        </details>
      )
    }
    
    return <span>{String(data)}</span>
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Tool Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <FileJson className="w-5 h-5" style={{ color: categoryColor }} />
          <h3 className="font-semibold text-gray-900 dark:text-white">JSON Formatter & Validator</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'tree' ? 'formatted' : 'tree')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            disabled={!output || error !== null}
          >
            {viewMode === 'tree' ? <Code className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Input Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Input JSON
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key": "value", "array": [1, 2, 3]}'
            className="w-full h-48 px-4 py-3 rounded-lg border-2 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 font-mono text-sm resize-none transition-all focus:outline-none"
            style={{
              borderColor: error ? '#ef4444' : `${categoryColor}30`,
            }}
            onFocus={(e) => e.target.style.borderColor = categoryColor}
            onBlur={(e) => e.target.style.borderColor = error ? '#ef4444' : `${categoryColor}30`}
          />
          {error && (
            <p className="text-sm text-red-500 animate-shake">{error}</p>
          )}
        </div>

        {/* Options */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Indent:</label>
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(Number(e.target.value))}
              className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={0}>Tab</option>
            </select>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={sortKeys}
              onChange={(e) => setSortKeys(e.target.checked)}
              className="rounded"
              style={{ accentColor: categoryColor }}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">Sort keys</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={formatJson}
            disabled={!input || isProcessing}
            className="px-6 py-3 rounded-lg font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 flex items-center gap-2"
            style={{
              backgroundColor: categoryColor,
              boxShadow: `0 4px 12px ${categoryColor}40`
            }}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4" />
                Format
              </>
            )}
          </button>
          <button
            onClick={minifyJson}
            disabled={!input || isProcessing}
            className="px-6 py-3 rounded-lg font-medium border-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            style={{
              borderColor: categoryColor,
              color: categoryColor
            }}
          >
            <Minimize2 className="w-4 h-4" />
            Minify
          </button>
        </div>

        {/* Output Section */}
        {output && !error && (
          <div className="space-y-2 animate-slideIn">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Output
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-500">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="text-sm">Copy</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Download</span>
                </button>
              </div>
            </div>
            
            {viewMode === 'formatted' ? (
              <pre className="w-full h-48 px-4 py-3 rounded-lg border-2 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white overflow-auto font-mono text-sm"
                style={{ borderColor: `${categoryColor}30` }}>
                <code className="language-json">{output}</code>
              </pre>
            ) : (
              <div className="w-full h-48 px-4 py-3 rounded-lg border-2 bg-gray-50 dark:bg-gray-900 overflow-auto font-mono text-sm"
                style={{ borderColor: `${categoryColor}30` }}>
                {renderJsonTree(JSON.parse(output))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}