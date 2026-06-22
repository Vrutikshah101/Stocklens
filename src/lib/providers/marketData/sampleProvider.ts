import { getMarketOverview } from '@/lib/services/marketService'
import { getStockDetailByTicker, getSupportedTickers } from '@/lib/services/stockService'
import type { MarketDataProvider } from '@/lib/providers/marketData/types'

export const sampleMarketDataProvider: MarketDataProvider = {
  cacheTtlSeconds: 300,
  mode: 'sample',
  name: 'sample',
  async getMarketOverview(step) {
    return getMarketOverview(step)
  },
  async getStockDetail(ticker, step) {
    return getStockDetailByTicker(ticker, step)
  },
  async getSupportedTickers() {
    return getSupportedTickers()
  },
  async health() {
    const tickers = getSupportedTickers()

    return {
      cacheTtlSeconds: this.cacheTtlSeconds,
      checkedAt: new Date().toISOString(),
      mode: this.mode,
      name: this.name,
      ok: tickers.length > 0,
      reason: tickers.length > 0 ? undefined : 'Sample stock universe is empty',
    }
  },
}
