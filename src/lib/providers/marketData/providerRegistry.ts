import { alphaVantageMarketDataProvider } from '@/lib/providers/marketData/alphaVantageProvider'
import { fmpMarketDataProvider } from '@/lib/providers/marketData/fmpProvider'
import { multiMarketDataProvider } from '@/lib/providers/marketData/multiProvider'
import { sampleMarketDataProvider } from '@/lib/providers/marketData/sampleProvider'
import { twelveDataMarketDataProvider } from '@/lib/providers/marketData/twelveDataProvider'
import { yahooMarketDataProvider } from '@/lib/providers/marketData/yahooProvider'
import type {
  MarketDataProvider,
  MarketDataProviderHealth,
  MarketDataProviderName,
} from '@/lib/providers/marketData/types'

const providers: Record<MarketDataProviderName, MarketDataProvider> = {
  alpha: alphaVantageMarketDataProvider,
  fmp: fmpMarketDataProvider,
  multi: multiMarketDataProvider,
  sample: sampleMarketDataProvider,
  twelve: twelveDataMarketDataProvider,
  yahoo: yahooMarketDataProvider,
}

export function resolveMarketDataProvider() {
  const requestedProvider = process.env.MARKET_DATA_PROVIDER?.toLowerCase() as MarketDataProviderName | undefined

  return providers[requestedProvider ?? 'sample'] ?? sampleMarketDataProvider
}

export async function getMarketDataProviderHealth(): Promise<MarketDataProviderHealth> {
  const provider = resolveMarketDataProvider()

  try {
    return provider.health()
  } catch (error) {
    return {
      cacheTtlSeconds: provider.cacheTtlSeconds,
      checkedAt: new Date().toISOString(),
      mode: provider.mode,
      name: provider.name,
      ok: false,
      reason: error instanceof Error ? error.message : 'Unknown market data provider error',
    }
  }
}
