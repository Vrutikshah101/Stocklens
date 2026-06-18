'use client'

import { create } from 'zustand'

interface PortfolioStore {
  selectedPortfolioId: string
  pendingTicker: string
  setSelectedPortfolioId: (id: string) => void
  setPendingTicker: (ticker: string) => void
}

export const usePortfolioStore = create<PortfolioStore>((set) => ({
  selectedPortfolioId: 'core-alpha',
  pendingTicker: 'RELIANCE',
  setSelectedPortfolioId: (id) => set({ selectedPortfolioId: id }),
  setPendingTicker: (ticker) => set({ pendingTicker: ticker }),
}))

