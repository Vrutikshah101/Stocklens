'use client'

import { create } from 'zustand'

type Theme = 'dark' | 'light'

interface UIStore {
  sidebarOpen: boolean
  marketMindOpen: boolean
  theme: Theme
  toggleSidebar: () => void
  setSidebarOpen: (value: boolean) => void
  toggleMarketMind: () => void
  toggleTheme: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  marketMindOpen: true,
  theme: 'light',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (value) => set({ sidebarOpen: value }),
  toggleMarketMind: () => set((state) => ({ marketMindOpen: !state.marketMindOpen })),
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'dark' ? 'light' : 'dark',
    })),
}))
