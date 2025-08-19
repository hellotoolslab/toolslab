'use client'

import { useEffect, useState } from 'react'

interface AdBannerProps {
  type: 'header' | 'sidebar' | 'inline'
}

export default function AdBanner({ type }: AdBannerProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Simulate ad loading
    const timer = setTimeout(() => setIsLoaded(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const dimensions = {
    header: { width: 728, height: 90 },
    sidebar: { width: 300, height: 250 },
    inline: { width: 320, height: 100 }
  }

  const { width, height } = dimensions[type]

  if (!isLoaded) {
    return (
      <div 
        className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded"
        style={{ width: '100%', maxWidth: width, height }}
      />
    )
  }

  return (
    <div 
      className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg flex items-center justify-center overflow-hidden"
      style={{ width: '100%', maxWidth: width, height }}
    >
      {/* Placeholder content */}
      <div className="text-center p-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Advertisement</p>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {type === 'header' && 'Header Ad Space (728x90)'}
          {type === 'sidebar' && 'Sidebar Ad (300x250)'}
          {type === 'inline' && 'Inline Ad (320x100)'}
        </p>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500 rounded-full filter blur-3xl" />
      </div>
    </div>
  )
}