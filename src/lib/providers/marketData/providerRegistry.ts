import { sampleMarketDataProvider } from '@/lib/providers/marketData/sampleProvider'
import { yahooMarketDataProvider } from '@/lib/providers/marketData/yahooProvider'
import type {
  MarketDataProvider,
  MarketDataProviderHealth,
  MarketDataProviderName,
} from '@/lib/providers/marketData/types'

const providers: Record<MarketDataProviderName, MarketDataProvider> = {
  sample: sampleMarketDataProvider,
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
