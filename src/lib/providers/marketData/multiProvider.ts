import { getMarketOverview } from '@/lib/services/marketService'
import { getStockDetailByTicker, getSupportedTickers } from '@/lib/services/stockService'
import type { MarketDataProvider } from '@/lib/providers/marketData/types'
import { fmpMarketDataProvider } from '@/lib/providers/marketData/fmpProvider'
import { twelveDataMarketDataProvider } from '@/lib/providers/marketData/twelveDataProvider'
import { alphaVantageMarketDataProvider } from '@/lib/providers/marketData/alphaVantageProvider'
import { yahooMarketDataProvider } from '@/lib/providers/marketData/yahooProvider'
import { sampleMarketDataProvider } from '@/lib/providers/marketData/sampleProvider'

const liveProviders = [
  fmpMarketDataProvider,
  twelveDataMarketDataProvider,
  alphaVantageMarketDataProvider,
  yahooMarketDataProvider,
]

export const multiMarketDataProvider: MarketDataProvider = {
  cacheTtlSeconds: 300,
  mode: 'live',
  name: 'multi',
  async getMarketOverview(step) {
    for (const provider of liveProviders) {
      const overview = await provider.getMarketOverview(step)

      if (overview.source !== 'sample') {
        return overview
      }
    }

    return getMarketOverview(step)
  },
  async getStockDetail(ticker, step) {
    const fallback = getStockDetailByTicker(ticker, step)

    for (const provider of liveProviders) {
      const detail = await provider.getStockDetail(ticker, step)

      if (
        detail.price.updatedAt !== fallback.price.updatedAt ||
        detail.price.current !== fallback.price.current
      ) {
        return detail
      }
    }

    return fallback
  },
  async getSupportedTickers() {
    return getSupportedTickers()
  },
  async health() {
    const providerHealth = await Promise.all([
      fmpMarketDataProvider.health(),
      twelveDataMarketDataProvider.health(),
      alphaVantageMarketDataProvider.health(),
      yahooMarketDataProvider.health(),
      sampleMarketDataProvider.health(),
    ])
    const liveHealthy = providerHealth.some((health) => health.mode === 'live' && health.ok)
    const sampleHealthy = providerHealth.some((health) => health.name === 'sample' && health.ok)

    return {
      cacheTtlSeconds: this.cacheTtlSeconds,
      checkedAt: new Date().toISOString(),
      mode: this.mode,
      name: this.name,
      ok: liveHealthy || sampleHealthy,
      reason: providerHealth
        .map((health) => `${health.name}:${health.ok ? 'ok' : health.reason ?? 'failed'}`)
        .join(' | '),
    }
  },
}
