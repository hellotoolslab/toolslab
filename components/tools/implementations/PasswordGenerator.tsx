'use client'

import { useState, useEffect } from 'react'
import { 
  Copy, 
  Check,
  RefreshCw,
  Shield,
  Key,
  AlertTriangle,
  Zap
} from 'lucide-react'

interface PasswordGeneratorProps {
  categoryColor: string
}

export default function PasswordGenerator({ categoryColor }: PasswordGeneratorProps) {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [excludeSimilar, setExcludeSimilar] = useState(false)
  const [includePronounceable, setIncludePronounceable] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [strength, setStrength] = useState(0)
  const [passwordHistory, setPasswordHistory] = useState<string[]>([])

  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
  const numberChars = '0123456789'
  const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  const similarChars = 'il1Lo0O'

  useEffect(() => {
    generatePassword()
  }, [])

  useEffect(() => {
    if (password) {
      calculateStrength()
    }
  }, [password])

  const generatePassword = () => {
    let chars = ''
    
    if (includePronounceable) {
      // Generate pronounceable password
      const consonants = 'bcdfghjklmnpqrstvwxyz'
      const vowels = 'aeiou'
      let newPassword = ''
      
      for (let i = 0; i < length; i++) {
        if (i % 2 === 0) {
          const char = consonants[Math.floor(Math.random() * consonants.length)]
          newPassword += i % 4 === 0 && includeUppercase ? char.toUpperCase() : char
        } else {
          newPassword += vowels[Math.floor(Math.random() * vowels.length)]
        }
        
        if (includeNumbers && i % 5 === 4) {
          newPassword = newPassword.slice(0, -1) + Math.floor(Math.random() * 10)
        }
      }
      
      setPassword(newPassword.slice(0, length))
      return
    }
    
    if (includeUppercase) chars += uppercaseChars
    if (includeLowercase) chars += lowercaseChars
    if (includeNumbers) chars += numberChars
    if (includeSymbols) chars += symbolChars
    
    if (excludeSimilar) {
      chars = chars.split('').filter(char => !similarChars.includes(char)).join('')
    }
    
    if (!chars) {
      setPassword('')
      return
    }
    
    let newPassword = ''
    const array = new Uint32Array(length)
    crypto.getRandomValues(array)
    
    for (let i = 0; i < length; i++) {
      newPassword += chars[array[i] % chars.length]
    }
    
    // Ensure at least one character from each selected type
    const ensureTypes = []
    if (includeUppercase) ensureTypes.push(uppercaseChars)
    if (includeLowercase) ensureTypes.push(lowercaseChars)
    if (includeNumbers) ensureTypes.push(numberChars)
    if (includeSymbols) ensureTypes.push(symbolChars)
    
    const passwordArray = newPassword.split('')
    ensureTypes.forEach((typeChars, index) => {
      if (index < length) {
        const randomChar = typeChars[Math.floor(Math.random() * typeChars.length)]
        const randomPos = Math.floor(Math.random() * length)
        passwordArray[randomPos] = randomChar
      }
    })
    
    const finalPassword = passwordArray.join('')
    setPassword(finalPassword)
    
    // Add to history
    setPasswordHistory(prev => [finalPassword, ...prev.slice(0, 9)])
  }

  const calculateStrength = () => {
    let score = 0
    
    // Length score
    if (password.length >= 8) score += 20
    if (password.length >= 12) score += 20
    if (password.length >= 16) score += 20
    
    // Character diversity
    if (/[a-z]/.test(password)) score += 10
    if (/[A-Z]/.test(password)) score += 10
    if (/[0-9]/.test(password)) score += 10
    if (/[^a-zA-Z0-9]/.test(password)) score += 10
    
    setStrength(Math.min(100, score))
  }

  const getStrengthColor = () => {
    if (strength < 30) return '#ef4444'
    if (strength < 60) return '#f59e0b'
    if (strength < 80) return '#eab308'
    return '#22c55e'
  }

  const getStrengthText = () => {
    if (strength < 30) return 'Weak'
    if (strength < 60) return 'Fair'
    if (strength < 80) return 'Good'
    return 'Strong'
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(password)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleCopyFromHistory = async (pwd: string) => {
    try {
      await navigator.clipboard.writeText(pwd)
      // Flash effect
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Tool Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <Key className="w-5 h-5" style={{ color: categoryColor }} />
          <h3 className="font-semibold text-gray-900 dark:text-white">Password Generator</h3>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4" style={{ color: getStrengthColor() }} />
          <span className="text-sm font-medium" style={{ color: getStrengthColor() }}>
            {getStrengthText()}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Generated Password Display */}
        <div className="relative">
          <div className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-2"
               style={{ borderColor: `${categoryColor}30` }}>
            <div className="flex items-center justify-between gap-4">
              <code className="flex-1 font-mono text-lg md:text-xl text-gray-900 dark:text-white break-all">
                {password || 'Click generate to create password'}
              </code>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  disabled={!password}
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  {isCopied ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={generatePassword}
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Strength Meter */}
          <div className="mt-3">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-300 rounded-full"
                style={{ 
                  width: `${strength}%`,
                  backgroundColor: getStrengthColor()
                }}
              />
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-4">
          {/* Length Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Password Length
              </label>
              <span className="text-sm font-medium px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">
                {length}
              </span>
            </div>
            <input
              type="range"
              min="4"
              max="64"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full"
              style={{ accentColor: categoryColor }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>4</span>
              <span>16</span>
              <span>32</span>
              <span>48</span>
              <span>64</span>
            </div>
          </div>

          {/* Character Options */}
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
                className="rounded"
                style={{ accentColor: categoryColor }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Uppercase (A-Z)</span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900">
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
                className="rounded"
                style={{ accentColor: categoryColor }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Lowercase (a-z)</span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="rounded"
                style={{ accentColor: categoryColor }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Numbers (0-9)</span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="rounded"
                style={{ accentColor: categoryColor }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Symbols (!@#$%)</span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900">
              <input
                type="checkbox"
                checked={excludeSimilar}
                onChange={(e) => setExcludeSimilar(e.target.checked)}
                className="rounded"
                style={{ accentColor: categoryColor }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Exclude Similar</span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900">
              <input
                type="checkbox"
                checked={includePronounceable}
                onChange={(e) => setIncludePronounceable(e.target.checked)}
                className="rounded"
                style={{ accentColor: categoryColor }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Pronounceable</span>
            </label>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-center">
          <button
            onClick={generatePassword}
            className="px-8 py-3 rounded-lg font-medium text-white transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            style={{
              backgroundColor: categoryColor,
              boxShadow: `0 4px 12px ${categoryColor}40`
            }}
          >
            <Zap className="w-4 h-4" />
            Generate New Password
          </button>
        </div>

        {/* Password History */}
        {passwordHistory.length > 1 && (
          <details className="group">
            <summary className="cursor-pointer list-none">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <RefreshCw className="w-4 h-4" />
                <span>Recent passwords ({passwordHistory.length})</span>
              </div>
            </summary>
            <div className="mt-3 space-y-2">
              {passwordHistory.slice(1).map((pwd, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <code className="flex-1 font-mono text-xs text-gray-600 dark:text-gray-400">
                    {pwd}
                  </code>
                  <button
                    onClick={() => handleCopyFromHistory(pwd)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </details>
        )}

        {/* Security Warning */}
        {strength < 60 && password && (
          <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Consider using a longer password with mixed character types for better security.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}