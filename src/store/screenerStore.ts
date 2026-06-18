'use client'

import { create } from 'zustand'

import type { ScreenerFilter } from '@/types/screener'

interface ScreenerStore {
  filters: ScreenerFilter[]
  activeTemplateId: string | null
  setFilters: (filters: ScreenerFilter[]) => void
  addFilter: (filter: ScreenerFilter) => void
  updateFilter: (id: string, updates: Partial<ScreenerFilter>) => void
  removeFilter: (id: string) => void
  applyTemplate: (templateId: string | null, filters: ScreenerFilter[]) => void
  clearFilters: () => void
}

export const useScreenerStore = create<ScreenerStore>((set) => ({
  filters: [],
  activeTemplateId: null,
  setFilters: (filters) => set({ filters }),
  addFilter: (filter) => set((state) => ({ filters: [...state.filters, filter] })),
  updateFilter: (id, updates) =>
    set((state) => ({
      filters: state.filters.map((filter) => (filter.id === id ? { ...filter, ...updates } : filter)),
    })),
  removeFilter: (id) =>
    set((state) => ({
      filters: state.filters.filter((filter) => filter.id !== id),
    })),
  applyTemplate: (templateId, filters) =>
    set({
      activeTemplateId: templateId,
      filters,
    }),
  clearFilters: () => set({ filters: [], activeTemplateId: null }),
}))

