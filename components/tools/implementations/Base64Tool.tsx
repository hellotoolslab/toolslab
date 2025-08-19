'use client'

import { useState, useRef } from 'react'
import { 
  Copy, 
  Download, 
  Check,
  Loader2,
  Upload,
  FileText,
  Image,
  Lock,
  Unlock
} from 'lucide-react'

interface Base64ToolProps {
  mode: 'encode' | 'decode'
  categoryColor: string
}

export default function Base64Tool({ mode, categoryColor }: Base64ToolProps) {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number; type: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleProcess = () => {
    setIsProcessing(true)
    setError(null)

    setTimeout(() => {
      try {
        if (mode === 'encode') {
          const encoded = btoa(unescape(encodeURIComponent(input)))
          setOutput(encoded)
        } else {
          const decoded = decodeURIComponent(escape(atob(input)))
          setOutput(decoded)
        }
      } catch (err) {
        setError(mode === 'encode' ? 'Failed to encode input' : 'Invalid Base64 string')
      } finally {
        setIsProcessing(false)
      }
    }, 100)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileInfo({
      name: file.name,
      size: file.size,
      type: file.type
    })

    const reader = new FileReader()
    
    if (mode === 'encode') {
      reader.onload = (event) => {
        const result = event.target?.result
        if (typeof result === 'string') {
          // Remove data URL prefix
          const base64 = result.split(',')[1]
          setInput(file.type.startsWith('text/') ? atob(base64) : '')
          setOutput(base64)
        }
      }
      reader.readAsDataURL(file)
    } else {
      reader.onload = (event) => {
        const result = event.target?.result
        if (typeof result === 'string') {
          setInput(result)
        }
      }
      reader.readAsText(file)
    }
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
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = mode === 'encode' ? 'encoded.txt' : 'decoded.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError(null)
    setFileInfo(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Tool Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          {mode === 'encode' ? (
            <Lock className="w-5 h-5" style={{ color: categoryColor }} />
          ) : (
            <Unlock className="w-5 h-5" style={{ color: categoryColor }} />
          )}
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Base64 {mode === 'encode' ? 'Encoder' : 'Decoder'}
          </h3>
        </div>
        {fileInfo && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">{fileInfo.name}</span>
            <span className="ml-2">({(fileInfo.size / 1024).toFixed(1)} KB)</span>
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* File Upload Zone */}
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            accept={mode === 'encode' ? '*' : '.txt'}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-8 border-2 border-dashed rounded-lg transition-all hover:bg-gray-50 dark:hover:bg-gray-900 group"
            style={{ borderColor: `${categoryColor}40` }}
          >
            <div className="flex flex-col items-center gap-3">
              <Upload className="w-8 h-8 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
              <div className="text-center">
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  Drop file here or click to upload
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {mode === 'encode' ? 'Any file type supported' : 'Text files only'}
                </p>
              </div>
            </div>
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 bg-white dark:bg-gray-800 text-sm text-gray-500">OR</span>
          </div>
        </div>

        {/* Text Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 string to decode...'}
            className="w-full h-40 px-4 py-3 rounded-lg border-2 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 font-mono text-sm resize-none transition-all focus:outline-none"
            style={{
              borderColor: error ? '#ef4444' : `${categoryColor}30`,
            }}
            onFocus={(e) => e.target.style.borderColor = categoryColor}
            onBlur={(e) => e.target.style.borderColor = error ? '#ef4444' : `${categoryColor}30`}
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{input.length} characters</span>
            <button
              onClick={handleClear}
              className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              disabled={!input && !output}
            >
              Clear all
            </button>
          </div>
          {error && (
            <p className="text-sm text-red-500 animate-shake">{error}</p>
          )}
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            onClick={handleProcess}
            disabled={!input || isProcessing}
            className="px-8 py-3 rounded-lg font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 flex items-center gap-2"
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
                {mode === 'encode' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                {mode === 'encode' ? 'Encode' : 'Decode'}
              </>
            )}
          </button>
        </div>

        {/* Output Section */}
        {output && !error && (
          <div className="space-y-2 animate-slideIn">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {mode === 'encode' ? 'Encoded Output' : 'Decoded Output'}
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
            <textarea
              value={output}
              readOnly
              className="w-full h-40 px-4 py-3 rounded-lg border-2 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm resize-none"
              style={{ borderColor: `${categoryColor}30` }}
            />
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{output.length} characters</span>
              {mode === 'encode' && (
                <span>Size increase: {Math.round((output.length / input.length - 1) * 100)}%</span>
              )}
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            {mode === 'encode' 
              ? 'Base64 encoding converts binary data into ASCII text format, making it safe for transmission over text-based protocols.'
              : 'Base64 decoding converts encoded ASCII text back to its original binary format.'}
          </p>
        </div>
      </div>
    </div>
  )
}