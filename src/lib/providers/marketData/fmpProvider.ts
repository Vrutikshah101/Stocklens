import { getMarketOverview } from '@/lib/services/marketService'
import { getStockDetailByTicker, getSupportedTickers } from '@/lib/services/stockService'
import type { MarketDataProvider } from '@/lib/providers/marketData/types'
import { mapQuoteToStockDetail, toNumber } from '@/lib/providers/marketData/quoteUtils'

type FmpQuote = {
  change?: number
  changesPercentage?: number
  dayHigh?: number
  dayLow?: number
  name?: string
  open?: number
  previousClose?: number
  price?: number
  timestamp?: number
  volume?: number
}

function getApiKey() {
  return process.env.FMP_API_KEY
}

function toFmpSymbol(ticker: string) {
  return `${ticker.toUpperCase()}.NS`
}

async function fetchFmpQuote(ticker: string) {
  const apiKey = getApiKey()

  if (!apiKey) {
    throw new Error('FMP_API_KEY is not configured')
  }

  const response = await fetch(`https://financialmodelingprep.com/api/v3/quote/${encodeURIComponent(toFmpSymbol(ticker))}?apikey=${encodeURIComponent(apiKey)}`, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 300 },
  })

  if (!response.ok) {
    throw new Error(`FMP quote request failed: ${response.status}`)
  }

  const quotes = await response.json() as FmpQuote[]
  const quote = quotes[0]
  const current = toNumber(quote?.price)

  if (!quote || current === undefined) {
    throw new Error('FMP returned no usable quote')
  }

  return {
    change: toNumber(quote.change),
    changePct: toNumber(quote.changesPercentage),
    current,
    high: toNumber(quote.dayHigh),
    low: toNumber(quote.dayLow),
    name: quote.name,
    open: toNumber(quote.open),
    previousClose: toNumber(quote.previousClose),
    updatedAt: quote.timestamp ? new Date(quote.timestamp * 1000).toISOString() : undefined,
    volume: toNumber(quote.volume),
  }
}

export const fmpMarketDataProvider: MarketDataProvider = {
  cacheTtlSeconds: 300,
  mode: 'live',
  name: 'fmp',
  async getMarketOverview(step) {
    return getMarketOverview(step)
  },
  async getStockDetail(ticker, step) {
    const fallback = getStockDetailByTicker(ticker, step)

    try {
      return mapQuoteToStockDetail(ticker, fallback, await fetchFmpQuote(ticker))
    } catch {
      return fallback
    }
  },
  async getSupportedTickers() {
    return getSupportedTickers()
  },
  async health() {
    try {
      await fetchFmpQuote('RELIANCE')

      return {
        cacheTtlSeconds: this.cacheTtlSeconds,
        checkedAt: new Date().toISOString(),
        mode: this.mode,
        name: this.name,
        ok: true,
      }
    } catch (error) {
      return {
        cacheTtlSeconds: this.cacheTtlSeconds,
        checkedAt: new Date().toISOString(),
        mode: this.mode,
        name: this.name,
        ok: false,
        reason: error instanceof Error ? error.message : 'FMP health check failed',
      }
    }
  },
}
