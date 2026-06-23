import {
  getMarketIndices,
  getNewsfeed,
  getSectorHeatmap,
  getTopMovers,
} from '@/lib/utils/constants'
import type { IndexSnapshot, MarketMover, NewsItem, SectorHeatCell } from '@/types/stock'

export interface MarketOverview {
  indices: IndexSnapshot[]
  movers: MarketMover[]
  heatmap: SectorHeatCell[]
  news: NewsItem[]
  generatedAt: string
  source: 'sample' | 'yahoo' | 'fmp' | 'twelve' | 'alpha' | 'multi'
}

export function getMarketOverview(step: number): MarketOverview {
  return {
    indices: getMarketIndices(step),
    movers: getTopMovers(step),
    heatmap: getSectorHeatmap(step),
    news: getNewsfeed(step),
    generatedAt: new Date().toISOString(),
    source: 'sample',
  }
}

export function getMarketIndexSnapshots(step: number) {
  return getMarketIndices(step)
}
