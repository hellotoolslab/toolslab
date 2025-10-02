'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ToolOperation {
  id: string;
  tool: string;
  input: string;
  output: string;
  timestamp: number;
}

interface ToolStore {
  history: ToolOperation[];
  chainedData: any;
  userLevel: 'first_time' | 'returning' | 'power';
  proUser: boolean;

  // Lab features
  favoriteTools: string[];
  favoriteCategories: string[];
  labVisited: boolean;
  lastLabAccess: number;
  favoritesCountAtLastVisit: number;

  // Original actions
  addToHistory: (operation: ToolOperation) => void;
  setChainedData: (data: any) => void;
  getUserLevel: () => 'first_time' | 'returning' | 'power';
  clearHistory: () => void;
  getHistoryByTool: (tool: string) => ToolOperation[];
  setUserLevel: (level: 'first_time' | 'returning' | 'power') => void;
  setProUser: (isPro: boolean) => void;

  // Lab actions
  toggleToolFavorite: (toolSlug: string) => void;
  toggleCategoryFavorite: (categoryId: string) => void;
  setLabVisited: () => void;
  getFavoriteCount: () => number;
  getNewFavoritesCount: () => number;
  isFavorite: (type: 'tool' | 'category', id: string) => boolean;
  getRecentTools: (limit?: number) => ToolOperation[];
}

// Store logic separated for reuse in both SSR and client environments
const storeLogic: any = (set: any, get: any): ToolStore => ({
  history: [],
  chainedData: null,
  userLevel: 'first_time' as const,
  proUser: false,

  // Lab initial state
  favoriteTools: [],
  favoriteCategories: [],
  labVisited: false,
  lastLabAccess: 0,
  favoritesCountAtLastVisit: 0,

  // Original actions
  addToHistory: (operation: ToolOperation) =>
    set((state: ToolStore) => ({
      history: [operation, ...state.history].slice(0, 100), // Keep last 100 operations
    })),

  setChainedData: (data: any) => set({ chainedData: data }),

  getUserLevel: () => {
    const state = get() as ToolStore;
    const historyCount = state.history.length;

    if (historyCount === 0) return 'first_time';
    if (historyCount < 10) return 'returning';
    return 'power';
  },

  clearHistory: () => set({ history: [], chainedData: null }),

  getHistoryByTool: (tool: string) => {
    const state = get() as ToolStore;
    return state.history.filter((op: ToolOperation) => op.tool === tool);
  },

  setUserLevel: (level: 'first_time' | 'returning' | 'power') =>
    set({ userLevel: level }),

  setProUser: (isPro: boolean) => set({ proUser: isPro }),

  // Lab actions
  toggleToolFavorite: (toolSlug: string) =>
    set((state: ToolStore) => {
      const favorites = state.favoriteTools;
      const index = favorites.indexOf(toolSlug);

      if (index > -1) {
        return { favoriteTools: favorites.filter((t) => t !== toolSlug) };
      } else {
        return { favoriteTools: [...favorites, toolSlug] };
      }
    }),

  toggleCategoryFavorite: (categoryId: string) =>
    set((state: ToolStore) => {
      const favorites = state.favoriteCategories;
      const index = favorites.indexOf(categoryId);

      if (index > -1) {
        return {
          favoriteCategories: favorites.filter((c) => c !== categoryId),
        };
      } else {
        return { favoriteCategories: [...favorites, categoryId] };
      }
    }),

  setLabVisited: () =>
    set((state: ToolStore) => ({
      labVisited: true,
      lastLabAccess: Date.now(),
      favoritesCountAtLastVisit:
        state.favoriteTools.length + state.favoriteCategories.length,
    })),

  getFavoriteCount: () => {
    const state = get() as ToolStore;
    return state.favoriteTools.length + state.favoriteCategories.length;
  },

  getNewFavoritesCount: () => {
    const state = get() as ToolStore;
    const currentCount =
      state.favoriteTools.length + state.favoriteCategories.length;
    return Math.max(0, currentCount - state.favoritesCountAtLastVisit);
  },

  isFavorite: (type: 'tool' | 'category', id: string) => {
    const state = get() as ToolStore;
    if (type === 'tool') {
      return state.favoriteTools.includes(id);
    }
    return state.favoriteCategories.includes(id);
  },

  getRecentTools: (limit = 5) => {
    const state = get() as ToolStore;
    const uniqueTools = new Map<string, ToolOperation>();

    for (const op of state.history) {
      if (!uniqueTools.has(op.tool)) {
        uniqueTools.set(op.tool, op);
      }
      if (uniqueTools.size >= limit) break;
    }

    return Array.from(uniqueTools.values());
  },
});

// Create base store without persistence
const createStore = () =>
  create<ToolStore>()(
    persist(storeLogic, {
      name: 'toolslab-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        history: state.history,
        userLevel: state.userLevel,
        proUser: state.proUser,
        favoriteTools: state.favoriteTools,
        favoriteCategories: state.favoriteCategories,
        labVisited: state.labVisited,
        lastLabAccess: state.lastLabAccess,
        favoritesCountAtLastVisit: state.favoritesCountAtLastVisit,
      }),
    })
  );

// Export store - only use persist on client, plain store on server
export const useToolStore =
  typeof window === 'undefined'
    ? create<ToolStore>()(storeLogic)
    : createStore();
