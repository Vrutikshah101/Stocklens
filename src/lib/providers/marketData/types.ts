import type { MarketOverview } from '@/lib/services/marketService'
import type { StockDetail } from '@/types/stock'

export type MarketDataProviderName = 'sample' | 'yahoo' | 'fmp' | 'twelve' | 'alpha' | 'multi'
export type MarketDataProviderMode = 'sample' | 'live'

export interface MarketDataProviderHealth {
  cacheTtlSeconds: number
  checkedAt: string
  mode: MarketDataProviderMode
  name: MarketDataProviderName
  ok: boolean
  reason?: string
}

export interface MarketDataProvider {
  cacheTtlSeconds: number
  mode: MarketDataProviderMode
  name: MarketDataProviderName
  getMarketOverview(step: number): Promise<MarketOverview>
  getStockDetail(ticker: string, step: number): Promise<StockDetail>
  getSupportedTickers(): Promise<string[]>
  health(): Promise<MarketDataProviderHealth>
}
