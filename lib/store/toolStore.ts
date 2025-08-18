import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  
  addToHistory: (operation: ToolOperation) => void;
  setChainedData: (data: any) => void;
  getUserLevel: () => 'first_time' | 'returning' | 'power';
  clearHistory: () => void;
  getHistoryByTool: (tool: string) => ToolOperation[];
  setUserLevel: (level: 'first_time' | 'returning' | 'power') => void;
  setProUser: (isPro: boolean) => void;
}

export const useToolStore = create<ToolStore>()(
  persist(
    (set, get) => ({
      history: [],
      chainedData: null,
      userLevel: 'first_time',
      proUser: false,

      addToHistory: (operation: ToolOperation) =>
        set((state) => ({
          history: [operation, ...state.history].slice(0, 100), // Keep last 100 operations
        })),

      setChainedData: (data: any) =>
        set({ chainedData: data }),

      getUserLevel: () => {
        const state = get();
        const historyCount = state.history.length;
        
        if (historyCount === 0) return 'first_time';
        if (historyCount < 10) return 'returning';
        return 'power';
      },

      clearHistory: () =>
        set({ history: [], chainedData: null }),

      getHistoryByTool: (tool: string) => {
        const state = get();
        return state.history.filter(op => op.tool === tool);
      },

      setUserLevel: (level: 'first_time' | 'returning' | 'power') =>
        set({ userLevel: level }),

      setProUser: (isPro: boolean) =>
        set({ proUser: isPro }),
    }),
    {
      name: 'octotools-store',
      partialize: (state) => ({
        history: state.history,
        userLevel: state.userLevel,
        proUser: state.proUser,
      }),
    }
  )
);