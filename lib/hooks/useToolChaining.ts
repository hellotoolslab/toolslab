'use client'

import { useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useToolChainStore, ChainStep, useKeyboardShortcuts } from '@/lib/stores/toolChainStore'
import { tools } from '@/data/tools'

export interface UseToolChainingOptions {
  toolSlug: string
  onDataReceived?: (data: string) => void
  onChainStepAdded?: (step: ChainStep) => void
}

export function useToolChaining({
  toolSlug,
  onDataReceived,
  onChainStepAdded
}: UseToolChainingOptions) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { handleKeyDown } = useKeyboardShortcuts()
  
  const {
    chainedData,
    currentChain,
    addToChain,
    setChainedData,
    updateSuggestions,
    setProcessing,
    startNewChain,
    generateChainUrl
  } = useToolChainStore()

  const currentTool = tools.find(tool => tool.slug === toolSlug)

  // Initialize with URL parameters or chained data
  useEffect(() => {
    const inputParam = searchParams.get('input')
    const chainIdParam = searchParams.get('chainId')
    
    if (inputParam) {
      // Data passed via URL parameters
      if (onDataReceived) {
        onDataReceived(inputParam)
      }
      
      // If this is a new chain step (has chainId), don't clear the chained data
      if (!chainIdParam) {
        setChainedData(inputParam)
      }
    } else if (chainedData) {
      // Data from tool chaining
      if (onDataReceived) {
        onDataReceived(chainedData)
      }
    }
  }, [searchParams, chainedData, onDataReceived, setChainedData])

  // Set up keyboard shortcuts
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Process tool output and add to chain
  const processOutput = useCallback((
    input: string,
    output: string,
    metadata?: Record<string, any>
  ) => {
    if (!currentTool) return

    const step: ChainStep = {
      id: `${toolSlug}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      toolSlug,
      toolName: currentTool.name,
      input,
      output,
      timestamp: Date.now(),
      formatDetection: undefined, // Will be set by the store
      ...metadata
    }

    addToChain(step)
    
    if (onChainStepAdded) {
      onChainStepAdded(step)
    }

    // Update suggestions based on output
    updateSuggestions(output, toolSlug)
  }, [toolSlug, currentTool, addToChain, onChainStepAdded, updateSuggestions])

  // Navigate to a tool with chained data
  const chainToTool = useCallback((targetToolSlug: string, data?: string) => {
    const dataToChain = data || chainedData
    if (!dataToChain) return

    setChainedData(dataToChain)
    const url = generateChainUrl(targetToolSlug)
    router.push(url)
  }, [chainedData, setChainedData, generateChainUrl, router])

  // Get the current chain step for this tool
  const getCurrentChainStep = useCallback(() => {
    return currentChain.find(step => step.toolSlug === toolSlug)
  }, [currentChain, toolSlug])

  // Check if this tool is part of the current chain
  const isInCurrentChain = useCallback(() => {
    return currentChain.some(step => step.toolSlug === toolSlug)
  }, [currentChain, toolSlug])

  // Get chain context (previous steps, position, etc.)
  const getChainContext = useCallback(() => {
    const currentStepIndex = currentChain.findIndex(step => step.toolSlug === toolSlug)
    const previousSteps = currentStepIndex > -1 ? currentChain.slice(0, currentStepIndex) : currentChain
    const nextSteps = currentStepIndex > -1 ? currentChain.slice(currentStepIndex + 1) : []
    
    return {
      totalSteps: currentChain.length,
      currentStepIndex,
      previousSteps,
      nextSteps,
      isFirstStep: currentStepIndex === 0,
      isLastStep: currentStepIndex === currentChain.length - 1,
      hasChainData: !!chainedData
    }
  }, [currentChain, toolSlug, chainedData])

  // Generate shareable chain URL
  const generateShareableUrl = useCallback((baseUrl?: string) => {
    if (currentChain.length === 0) return null

    const steps = currentChain.map(step => ({
      tool: step.toolSlug,
      input: step.input,
      output: step.output
    }))

    const chainData = {
      steps,
      timestamp: Date.now(),
      version: '1.0'
    }

    // Encode chain data (you might want to use a URL shortener for long chains)
    const encoded = btoa(JSON.stringify(chainData))
    const url = new URL(baseUrl || window.location.origin)
    url.pathname = '/chain'
    url.searchParams.set('data', encoded)
    
    return url.toString()
  }, [currentChain])

  // Export chain data
  const exportChain = useCallback((format: 'json' | 'csv' | 'markdown' = 'json') => {
    if (currentChain.length === 0) return null

    switch (format) {
      case 'json':
        return JSON.stringify(currentChain, null, 2)
      
      case 'csv':
        const headers = ['Step', 'Tool', 'Input', 'Output', 'Timestamp']
        const rows = currentChain.map((step, index) => [
          index + 1,
          step.toolName,
          step.input.replace(/"/g, '""'),
          step.output.replace(/"/g, '""'),
          new Date(step.timestamp).toISOString()
        ])
        
        return [
          headers.join(','),
          ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n')
      
      case 'markdown':
        return [
          '# Tool Chain Export',
          '',
          `**Created:** ${new Date().toISOString()}`,
          `**Steps:** ${currentChain.length}`,
          '',
          ...currentChain.map((step, index) => [
            `## Step ${index + 1}: ${step.toolName}`,
            '',
            '**Input:**',
            '```',
            step.input,
            '```',
            '',
            '**Output:**',
            '```',
            step.output,
            '```',
            ''
          ].join('\n'))
        ].join('\n')
      
      default:
        return null
    }
  }, [currentChain])

  return {
    // State
    chainedData,
    currentChain,
    currentTool,
    
    // Chain context
    chainContext: getChainContext(),
    currentChainStep: getCurrentChainStep(),
    isInCurrentChain: isInCurrentChain(),
    
    // Actions
    processOutput,
    chainToTool,
    startNewChain,
    setProcessing,
    
    // Utilities
    generateShareableUrl,
    exportChain,
    
    // Store access
    store: useToolChainStore.getState()
  }
}