'use client'

import { useState, useEffect } from 'react'
import { 
  Copy, 
  Check,
  Shield,
  Hash,
  FileText,
  Loader2
} from 'lucide-react'

interface HashGeneratorProps {
  categoryColor: string
}

export default function HashGenerator({ categoryColor }: HashGeneratorProps) {
  const [input, setInput] = useState('')
  const [algorithm, setAlgorithm] = useState('SHA-256')
  const [hashes, setHashes] = useState<Record<string, string>>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [copiedHash, setCopiedHash] = useState<string | null>(null)
  const [salt, setSalt] = useState('')
  const [compareMode, setCompareMode] = useState(false)
  const [compareHash, setCompareHash] = useState('')
  const [isMatch, setIsMatch] = useState<boolean | null>(null)

  const algorithms = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512', 'MD5']

  useEffect(() => {
    if (input) {
      generateHashes()
    } else {
      setHashes({})
    }
  }, [input, salt])

  const generateHashes = async () => {
    if (!input) return
    
    setIsProcessing(true)
    const newHashes: Record<string, string> = {}
    const textToHash = salt ? `${salt}${input}` : input

    try {
      // Generate hash for selected algorithm
      const encoder = new TextEncoder()
      const data = encoder.encode(textToHash)
      
      if (algorithm === 'MD5') {
        // MD5 would require a library, using placeholder
        newHashes[algorithm] = 'MD5 requires external library'
      } else {
        const hashBuffer = await crypto.subtle.digest(algorithm, data)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
        newHashes[algorithm] = hashHex
      }

      // Generate other common hashes
      for (const algo of algorithms) {
        if (algo !== algorithm && algo !== 'MD5') {
          const hashBuffer = await crypto.subtle.digest(algo, data)
          const hashArray = Array.from(new Uint8Array(hashBuffer))
          const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
          newHashes[algo] = hashHex
        }
      }

      setHashes(newHashes)
    } catch (error) {
      console.error('Error generating hash:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCopy = async (hash: string, algo: string) => {
    try {
      await navigator.clipboard.writeText(hash)
      setCopiedHash(algo)
      setTimeout(() => setCopiedHash(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleCompare = () => {
    if (compareHash && hashes[algorithm]) {
      setIsMatch(compareHash.toLowerCase() === hashes[algorithm].toLowerCase())
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Tool Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5" style={{ color: categoryColor }} />
          <h3 className="font-semibold text-gray-900 dark:text-white">Hash Generator</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              compareMode 
                ? 'bg-gray-200 dark:bg-gray-700' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Compare Mode
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Text to Hash
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to generate hash..."
              className="w-full h-32 px-4 py-3 rounded-lg border-2 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 font-mono text-sm resize-none transition-all focus:outline-none"
              style={{
                borderColor: `${categoryColor}30`,
              }}
              onFocus={(e) => e.target.style.borderColor = categoryColor}
              onBlur={(e) => e.target.style.borderColor = `${categoryColor}30`}
            />
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{input.length} characters</span>
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                Algorithm
              </label>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {algorithms.map(algo => (
                  <option key={algo} value={algo}>{algo}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                Salt (Optional)
              </label>
              <input
                type="text"
                value={salt}
                onChange={(e) => setSalt(e.target.value)}
                placeholder="Add salt to hash"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Compare Mode */}
        {compareMode && input && hashes[algorithm] && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Compare with Hash
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={compareHash}
                onChange={(e) => setCompareHash(e.target.value)}
                placeholder="Paste hash to compare..."
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
              />
              <button
                onClick={handleCompare}
                className="px-4 py-2 rounded-lg font-medium text-white transition-all hover:scale-105"
                style={{ backgroundColor: categoryColor }}
              >
                Compare
              </button>
            </div>
            {isMatch !== null && (
              <div className={`text-sm font-medium ${isMatch ? 'text-green-600' : 'text-red-600'}`}>
                {isMatch ? '✓ Hashes match!' : '✗ Hashes do not match'}
              </div>
            )}
          </div>
        )}

        {/* Hash Results */}
        {Object.keys(hashes).length > 0 && (
          <div className="space-y-3 animate-slideIn">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Generated Hashes
            </label>
            
            {/* Primary Hash */}
            {hashes[algorithm] && (
              <div
                className="p-4 rounded-lg border-2 bg-gradient-to-r from-transparent to-transparent hover:from-gray-50 hover:to-gray-50 dark:hover:from-gray-900 dark:hover:to-gray-900 transition-all"
                style={{ borderColor: categoryColor }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">{algorithm}</span>
                  <button
                    onClick={() => handleCopy(hashes[algorithm], algorithm)}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    {copiedHash === algorithm ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <code className="block font-mono text-xs text-gray-700 dark:text-gray-300 break-all">
                  {hashes[algorithm]}
                </code>
              </div>
            )}

            {/* Other Hashes */}
            <details className="group">
              <summary className="cursor-pointer list-none">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <Hash className="w-4 h-4" />
                  <span>Show other algorithms</span>
                </div>
              </summary>
              <div className="mt-3 space-y-2">
                {Object.entries(hashes).map(([algo, hash]) => {
                  if (algo === algorithm || algo === 'MD5') return null
                  return (
                    <div
                      key={algo}
                      className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{algo}</span>
                        <button
                          onClick={() => handleCopy(hash, algo)}
                          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                          {copiedHash === algo ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <code className="block font-mono text-xs text-gray-600 dark:text-gray-400 break-all">
                        {hash}
                      </code>
                    </div>
                  )
                })}
              </div>
            </details>
          </div>
        )}

        {/* Info */}
        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Cryptographic hash functions produce a fixed-size output from any input. The same input always produces the same hash, but it&rsquo;s computationally infeasible to reverse.
          </p>
        </div>
      </div>
    </div>
  )
}