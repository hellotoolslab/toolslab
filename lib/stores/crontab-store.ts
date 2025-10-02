'use client';

// lib/stores/crontab-store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CrontabHistoryItem {
  id: string;
  expression: string;
  description: string;
  timestamp: number;
  timezone: string;
}

export interface CrontabFavorite {
  id: string;
  name: string;
  expression: string;
  description: string;
  category?: string;
  tags?: string[];
  createdAt: number;
  updatedAt: number;
}

interface CrontabStore {
  // History
  history: CrontabHistoryItem[];
  addToHistory: (
    expression: string,
    description: string,
    timezone: string
  ) => void;
  clearHistory: () => void;
  removeFromHistory: (id: string) => void;

  // Favorites
  favorites: CrontabFavorite[];
  addToFavorites: (
    favorite: Omit<CrontabFavorite, 'id' | 'createdAt' | 'updatedAt'>
  ) => void;
  removeFromFavorites: (id: string) => void;
  updateFavorite: (id: string, updates: Partial<CrontabFavorite>) => void;
  getFavoritesByCategory: (category?: string) => CrontabFavorite[];

  // Settings
  settings: {
    selectedTimezone: string;
    maxHistoryItems: number;
    autoSaveToHistory: boolean;
    showNextExecutions: number;
  };
  updateSettings: (updates: Partial<CrontabStore['settings']>) => void;

  // UI State
  selectedExpression: string | null;
  setSelectedExpression: (expression: string | null) => void;

  // Analytics
  getUsageStats: () => {
    totalExpressions: number;
    favoriteCount: number;
    historyCount: number;
    mostUsedTimezone: string;
    commonPatterns: Array<{ pattern: string; count: number }>;
  };
}

const MAX_HISTORY_ITEMS = 50;
const MAX_FAVORITES = 100;

// Store logic separated for SSR and client-side reuse
const storeLogic: any = (set: any, get: any): CrontabStore => ({
  // History
  history: [],

  addToHistory: (expression: string, description: string, timezone: string) => {
    const state = get() as CrontabStore;
    if (!state.settings.autoSaveToHistory) return;

    // Don't add duplicates from recent history
    const recent = state.history.slice(0, 5);
    if (
      recent.some(
        (item) => item.expression === expression && item.timezone === timezone
      )
    ) {
      return;
    }

    const newItem: CrontabHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      expression,
      description,
      timezone,
      timestamp: Date.now(),
    };

    set((state: CrontabStore) => ({
      history: [newItem, ...state.history].slice(
        0,
        state.settings.maxHistoryItems
      ),
    }));
  },

  clearHistory: () => set({ history: [] }),

  removeFromHistory: (id: string) => {
    set((state: CrontabStore) => ({
      history: state.history.filter((item) => item.id !== id),
    }));
  },

  // Favorites
  favorites: [],

  addToFavorites: (
    favorite: Omit<CrontabFavorite, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const state = get() as CrontabStore;

    // Check if we've reached the limit
    if (state.favorites.length >= MAX_FAVORITES) {
      console.warn(`Maximum number of favorites (${MAX_FAVORITES}) reached`);
      return;
    }

    // Check for duplicates
    if (state.favorites.some((f) => f.expression === favorite.expression)) {
      console.warn('Expression already exists in favorites');
      return;
    }

    const newFavorite: CrontabFavorite = {
      ...favorite,
      id: `fav-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    set((state: CrontabStore) => ({
      favorites: [...state.favorites, newFavorite],
    }));
  },

  removeFromFavorites: (id: string) => {
    set((state: CrontabStore) => ({
      favorites: state.favorites.filter((fav) => fav.id !== id),
    }));
  },

  updateFavorite: (id: string, updates: Partial<CrontabFavorite>) => {
    set((state: CrontabStore) => ({
      favorites: state.favorites.map((fav) =>
        fav.id === id ? { ...fav, ...updates, updatedAt: Date.now() } : fav
      ),
    }));
  },

  getFavoritesByCategory: (category?: string) => {
    const state = get() as CrontabStore;
    if (!category) return state.favorites;
    return state.favorites.filter((fav) => fav.category === category);
  },

  // Settings
  settings: {
    selectedTimezone:
      typeof window !== 'undefined'
        ? Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
        : 'UTC',
    maxHistoryItems: MAX_HISTORY_ITEMS,
    autoSaveToHistory: true,
    showNextExecutions: 10,
  },

  updateSettings: (updates: Partial<CrontabStore['settings']>) => {
    set((state: CrontabStore) => ({
      settings: { ...state.settings, ...updates },
    }));
  },

  // UI State
  selectedExpression: null,
  setSelectedExpression: (expression: string | null) =>
    set({ selectedExpression: expression }),

  // Analytics
  getUsageStats: () => {
    const state = get() as CrontabStore;

    // Count pattern frequencies
    const patterns: Record<string, number> = {};
    [...state.history, ...state.favorites].forEach((item) => {
      const pattern = analyzePattern(item.expression);
      patterns[pattern] = (patterns[pattern] || 0) + 1;
    });

    const commonPatterns = Object.entries(patterns)
      .map(([pattern, count]) => ({ pattern, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Find most used timezone
    const timezones: Record<string, number> = {};
    state.history.forEach((item) => {
      timezones[item.timezone] = (timezones[item.timezone] || 0) + 1;
    });

    const mostUsedTimezone = Object.entries(timezones).reduce(
      (most, [tz, count]) =>
        count > most.count ? { timezone: tz, count } : most,
      { timezone: state.settings.selectedTimezone, count: 0 }
    ).timezone;

    return {
      totalExpressions: state.history.length + state.favorites.length,
      favoriteCount: state.favorites.length,
      historyCount: state.history.length,
      mostUsedTimezone,
      commonPatterns,
    };
  },
});

// Create store with persist middleware
console.log('[crontabStore] Creating store, typeof window:', typeof window);

export const useCrontabStore = create<CrontabStore>()(
  persist(storeLogic, {
    name: 'crontab-storage',
    storage: createJSONStorage(() => {
      console.log(
        '[crontabStore] Storage factory called, typeof window:',
        typeof window
      );
      return localStorage;
    }),
    version: 1,
    skipHydration: true, // CRITICAL: Skip automatic hydration
    // Only persist certain parts
    partialize: (state) => ({
      history: state.history,
      favorites: state.favorites,
      settings: state.settings,
    }),
    // Handle migrations
    migrate: (persistedState: any, version: number) => {
      // Migration logic for future versions
      if (version === 0) {
        // Migrate from v0 to v1
        const userTimezone =
          typeof window !== 'undefined'
            ? Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
            : 'UTC';

        return {
          ...persistedState,
          settings: {
            selectedTimezone:
              persistedState.settings?.defaultTimezone ||
              persistedState.settings?.selectedTimezone ||
              userTimezone,
            maxHistoryItems: MAX_HISTORY_ITEMS,
            autoSaveToHistory: true,
            showNextExecutions: 10,
            ...persistedState.settings,
          },
        };
      }
      return persistedState;
    },
  })
);

/**
 * Analyze cron expression to determine its pattern type
 */
function analyzePattern(expression: string): string {
  // Handle special expressions
  if (expression.startsWith('@')) {
    return expression;
  }

  const parts = expression.split(' ');
  if (parts.length < 5) return 'invalid';

  const [minute, hour, day, month, weekday] = parts;

  // Determine pattern based on field values
  if (minute === '*' && hour === '*') {
    return 'every-minute';
  }

  if (hour === '*' && day === '*' && month === '*' && weekday === '*') {
    if (minute.includes('/')) {
      const interval = minute.split('/')[1];
      return `every-${interval}-minutes`;
    }
    return 'hourly-pattern';
  }

  if (day === '*' && month === '*' && weekday === '*') {
    if (hour.includes('/')) {
      return 'every-n-hours';
    }
    return 'daily-pattern';
  }

  if (month === '*') {
    if (weekday !== '*' && day === '*') {
      return 'weekly-pattern';
    }
    if (day !== '*' && weekday === '*') {
      return 'monthly-by-date';
    }
    return 'monthly-pattern';
  }

  return 'yearly-pattern';
}

/**
 * Export favorites to JSON
 */
export function exportFavorites(): string {
  const store = useCrontabStore.getState();
  const exportData = {
    version: 1,
    exportDate: new Date().toISOString(),
    favorites: store.favorites,
    settings: store.settings,
  };
  return JSON.stringify(exportData, null, 2);
}

/**
 * Import favorites from JSON
 */
export function importFavorites(jsonData: string): {
  success: boolean;
  message: string;
  imported?: number;
} {
  try {
    const data = JSON.parse(jsonData);

    if (!data.favorites || !Array.isArray(data.favorites)) {
      return {
        success: false,
        message: 'Invalid import format: favorites array not found',
      };
    }

    const store = useCrontabStore.getState();
    let importedCount = 0;

    data.favorites.forEach((favorite: any) => {
      if (favorite.expression && favorite.name) {
        // Avoid duplicates
        if (
          !store.favorites.some((f) => f.expression === favorite.expression)
        ) {
          store.addToFavorites({
            name: favorite.name,
            expression: favorite.expression,
            description: favorite.description || '',
            category: favorite.category,
            tags: favorite.tags,
          });
          importedCount++;
        }
      }
    });

    // Update settings if provided
    if (data.settings) {
      store.updateSettings(data.settings);
    }

    return {
      success: true,
      message: `Successfully imported ${importedCount} favorites`,
      imported: importedCount,
    };
  } catch (error) {
    return {
      success: false,
      message: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}
