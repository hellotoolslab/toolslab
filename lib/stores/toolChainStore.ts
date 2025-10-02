'use client';

import { create } from 'zustand';
import {
  detectFormat,
  getSuggestedToolsForOutput,
  FormatDetectionResult,
} from '@/lib/utils/formatDetector';

export interface ChainStep {
  id: string;
  toolSlug: string;
  toolName: string;
  input: string;
  output: string;
  timestamp: number;
  formatDetection?: FormatDetectionResult;
}

export interface ToolChainState {
  // Current chain data
  chainedData: string | null;
  currentChain: ChainStep[];
  chainId: string | null;

  // Suggestions
  suggestedTools: string[];
  lastProcessedOutput: string | null;
  lastDetection: FormatDetectionResult | null;

  // Chain history
  savedChains: ChainStep[][];

  // UI state
  showSuggestions: boolean;
  isProcessing: boolean;

  // Actions
  setChainedData: (data: string | null) => void;
  addToChain: (step: ChainStep) => void;
  startNewChain: () => void;
  updateSuggestions: (output: string, currentTool: string) => void;
  setSuggestionsVisible: (visible: boolean) => void;
  saveCurrentChain: () => void;
  loadChain: (chainIndex: number) => void;
  clearChain: () => void;
  setProcessing: (processing: boolean) => void;
  generateChainUrl: (targetTool: string) => string;
}

export const useToolChainStore = create<ToolChainState>((set, get) => ({
  // Initial state
  chainedData: null,
  currentChain: [],
  chainId: null,
  suggestedTools: [],
  lastProcessedOutput: null,
  lastDetection: null,
  savedChains: [],
  showSuggestions: false,
  isProcessing: false,

  // Actions
  setChainedData: (data) => {
    set({ chainedData: data });
  },

  addToChain: (step) => {
    set((state) => ({
      currentChain: [...state.currentChain, step],
      lastProcessedOutput: step.output,
      chainId: state.chainId || generateChainId(),
    }));

    // Auto-update suggestions based on output
    const { updateSuggestions } = get();
    updateSuggestions(step.output, step.toolSlug);
  },

  startNewChain: () => {
    set({
      currentChain: [],
      chainedData: null,
      chainId: generateChainId(),
      suggestedTools: [],
      lastProcessedOutput: null,
      lastDetection: null,
      showSuggestions: false,
    });
  },

  updateSuggestions: (output, currentTool) => {
    const detection = detectFormat(output);
    const suggestions = getSuggestedToolsForOutput(detection.type, currentTool);

    set({
      suggestedTools: suggestions,
      lastDetection: detection,
      showSuggestions: suggestions.length > 0 && output.length > 0,
    });
  },

  setSuggestionsVisible: (visible) => {
    set({ showSuggestions: visible });
  },

  saveCurrentChain: () => {
    const { currentChain, savedChains } = get();
    if (currentChain.length > 0) {
      set({
        savedChains: [...savedChains, [...currentChain]],
      });
    }
  },

  loadChain: (chainIndex) => {
    const { savedChains } = get();
    if (chainIndex >= 0 && chainIndex < savedChains.length) {
      const chain = savedChains[chainIndex];
      const lastStep = chain[chain.length - 1];

      set({
        currentChain: chain,
        chainedData: lastStep?.output || null,
        lastProcessedOutput: lastStep?.output || null,
        chainId: generateChainId(),
      });

      if (lastStep) {
        const { updateSuggestions } = get();
        updateSuggestions(lastStep.output, lastStep.toolSlug);
      }
    }
  },

  clearChain: () => {
    set({
      currentChain: [],
      chainedData: null,
      chainId: null,
      suggestedTools: [],
      lastProcessedOutput: null,
      lastDetection: null,
      showSuggestions: false,
    });
  },

  setProcessing: (processing) => {
    set({ isProcessing: processing });
  },

  generateChainUrl: (targetTool) => {
    const { chainedData, chainId } = get();
    if (!chainedData) return `/tools/${targetTool}`;

    const params = new URLSearchParams({
      input: chainedData,
      ...(chainId && { chainId }),
    });

    return `/tools/${targetTool}?${params.toString()}`;
  },
}));

function generateChainId(): string {
  return `chain_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Keyboard shortcut handlers
export const useKeyboardShortcuts = () => {
  const store = useToolChainStore();

  return {
    handleKeyDown: (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isCtrlCmd = isMac ? event.metaKey : event.ctrlKey;

      // Cmd/Ctrl + K - Toggle suggestions
      if (isCtrlCmd && event.key === 'k') {
        event.preventDefault();
        store.setSuggestionsVisible(!store.showSuggestions);
      }

      // Cmd/Ctrl + Shift + C - Copy last output
      if (isCtrlCmd && event.shiftKey && event.key === 'C') {
        event.preventDefault();
        if (store.lastProcessedOutput) {
          navigator.clipboard.writeText(store.lastProcessedOutput);
        }
      }

      // Cmd/Ctrl + Shift + N - Start new chain
      if (isCtrlCmd && event.shiftKey && event.key === 'N') {
        event.preventDefault();
        store.startNewChain();
      }

      // Escape - Hide suggestions
      if (event.key === 'Escape') {
        store.setSuggestionsVisible(false);
      }
    },
  };
};
