'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Tool } from '@/types/tool'
import { tools } from '@/data/tools'
import { categoryColors } from '@/data/categories'
import ToolWorkspace from './ToolWorkspace'
import AdBanner from '@/components/ads/AdBanner'
import { 
  ChevronRight, 
  Share2, 
  Clock, 
  TrendingUp,
  X,
  Info,
  BookOpen,
  HelpCircle,
  ArrowRight,
  Star
} from 'lucide-react'

interface ToolPageClientProps {
  toolSlug: string
  searchParams?: { [key: string]: string | string[] | undefined }
}

export default function ToolPageClient({ toolSlug, searchParams }: ToolPageClientProps) {
  const tool = tools.find(t => t.slug === toolSlug)
  
  if (!tool) {
    return <div>Tool not found</div>
  }
  const { theme } = useTheme()
  const [isAdDismissed, setIsAdDismissed] = useState(false)
  const [usageCount, setUsageCount] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  
  // Extract initial input from search params
  const initialInput = searchParams?.input ? 
    (Array.isArray(searchParams.input) ? searchParams.input[0] : searchParams.input) : 
    undefined

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    // Simulate usage count
    setUsageCount(Math.floor(Math.random() * 5000) + 1000)
    
    // Check ad dismiss state
    const dismissed = localStorage.getItem('ad-dismissed')
    if (dismissed) {
      const dismissTime = new Date(dismissed).getTime()
      const now = new Date().getTime()
      if (now - dismissTime < 24 * 60 * 60 * 1000) {
        setIsAdDismissed(true)
      }
    }

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleDismissAd = () => {
    setIsAdDismissed(true)
    localStorage.setItem('ad-dismissed', new Date().toISOString())
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${tool.name} - OctoTools`,
          text: tool.description,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      // Show toast notification
    }
  }

  // Get related tools from same category
  const relatedTools = tools
    .filter(t => t.category === tool.category && t.slug !== tool.slug)
    .slice(0, 4)

  // Get color for category
  const categoryColor = categoryColors[tool.category] || categoryColors.default

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Header Ad Banner */}
      {!isAdDismissed && (
        <div className="relative bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <button
              onClick={handleDismissAd}
              className="absolute top-2 right-4 p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Dismiss ad"
            >
              <X className="w-4 h-4" />
            </button>
            <AdBanner type="header" />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm mb-6">
          <Link 
            href="/" 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <Link 
            href={`/category/${tool.category}`}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors capitalize"
            style={{ color: categoryColor }}
          >
            {tool.category}
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 dark:text-white font-medium">
            {tool.name}
          </span>
        </nav>

        {/* Tool Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div 
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: `${categoryColor}20` }}
                >
                  <tool.icon className="w-8 h-8" style={{ color: categoryColor }} />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {tool.name}
                </h1>
                <span 
                  className="px-3 py-1 rounded-full text-xs font-medium capitalize"
                  style={{ 
                    backgroundColor: `${categoryColor}20`,
                    color: categoryColor 
                  }}
                >
                  {tool.category}
                </span>
                {usageCount > 2000 && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    Popular
                  </span>
                )}
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                {tool.description}
              </p>
              
              {/* Tool Stats Bar */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <TrendingUp className="w-4 h-4" />
                  <span>Used {usageCount.toLocaleString()} times today</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Saves ~5 min per use</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                  <span className="text-gray-500 dark:text-gray-400 ml-1">4.8</span>
                </div>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tool Workspace */}
          <div className="lg:col-span-2">
            <ToolWorkspace tool={tool} categoryColor={categoryColor} initialInput={initialInput} />
            
            {/* How to Use Section */}
            <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5" style={{ color: categoryColor }} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  How to Use {tool.name}
                </h2>
              </div>
              <ol className="space-y-3">
                <li className="flex gap-3">
                  <span 
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white"
                    style={{ backgroundColor: categoryColor }}
                  >
                    1
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    Enter or paste your input in the text area above
                  </span>
                </li>
                <li className="flex gap-3">
                  <span 
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white"
                    style={{ backgroundColor: categoryColor }}
                  >
                    2
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    Configure any options or settings as needed
                  </span>
                </li>
                <li className="flex gap-3">
                  <span 
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white"
                    style={{ backgroundColor: categoryColor }}
                  >
                    3
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    Click the process button to generate your result
                  </span>
                </li>
                <li className="flex gap-3">
                  <span 
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white"
                    style={{ backgroundColor: categoryColor }}
                  >
                    4
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    Copy, download, or share your output as needed
                  </span>
                </li>
              </ol>
            </div>

            {/* FAQ Section */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="w-5 h-5" style={{ color: categoryColor }} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Frequently Asked Questions
                </h2>
              </div>
              <div className="space-y-4">
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <span className="font-medium text-gray-900 dark:text-white">
                      Is this tool free to use?
                    </span>
                    <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-2 text-gray-600 dark:text-gray-400 pl-4">
                    Yes, all OctoTools are completely free to use with no limits or registration required.
                  </p>
                </details>
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <span className="font-medium text-gray-900 dark:text-white">
                      Is my data secure?
                    </span>
                    <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-2 text-gray-600 dark:text-gray-400 pl-4">
                    All processing happens locally in your browser. Your data never leaves your device.
                  </p>
                </details>
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <span className="font-medium text-gray-900 dark:text-white">
                      Can I use this offline?
                    </span>
                    <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-2 text-gray-600 dark:text-gray-400 pl-4">
                    Once loaded, most tools work offline as they process data locally in your browser.
                  </p>
                </details>
              </div>
            </div>
          </div>

          {/* Sidebar (Desktop Only) */}
          {!isMobile && (
            <div className="space-y-6">
              {/* Related Tools */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Related Tools
                </h3>
                <div className="space-y-3">
                  {relatedTools.map((relatedTool) => (
                    <Link
                      key={relatedTool.slug}
                      href={`/tools/${relatedTool.slug}`}
                      className="group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                    >
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${categoryColor}20` }}
                      >
                        <relatedTool.icon className="w-5 h-5" style={{ color: categoryColor }} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {relatedTool.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                          {relatedTool.description}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Sidebar Ad */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <span className="text-xs text-gray-500 dark:text-gray-400">Advertisement</span>
                <AdBanner type="sidebar" />
              </div>

              {/* Quick Tips */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Pro Tips
                  </h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                    <span>Use keyboard shortcuts for faster workflow</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                    <span>Bookmark this page for quick access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                    <span>Try our API for automation needs</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Related Tools */}
        {isMobile && (
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Related Tools
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {relatedTools.map((relatedTool) => (
                <Link
                  key={relatedTool.slug}
                  href={`/tools/${relatedTool.slug}`}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
                >
                  <div 
                    className="p-2 rounded-lg inline-block mb-2"
                    style={{ backgroundColor: `${categoryColor}20` }}
                  >
                    <relatedTool.icon className="w-5 h-5" style={{ color: categoryColor }} />
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    {relatedTool.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                    {relatedTool.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}