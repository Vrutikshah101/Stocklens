import { getMarketOverview } from '@/lib/services/marketService'
import { getStockDetailByTicker, getSupportedTickers } from '@/lib/services/stockService'
import type { MarketDataProvider } from '@/lib/providers/marketData/types'
import { mapQuoteToStockDetail, toNumber } from '@/lib/providers/marketData/quoteUtils'

type AlphaQuoteResponse = {
  'Error Message'?: string
  'Global Quote'?: {
    '01. symbol'?: string
    '02. open'?: string
    '03. high'?: string
    '04. low'?: string
    '05. price'?: string
    '06. volume'?: string
    '07. latest trading day'?: string
    '08. previous close'?: string
    '09. change'?: string
    '10. change percent'?: string
  }
  Note?: string
}

function getApiKey() {
  return process.env.ALPHA_VANTAGE_API_KEY
}

function toAlphaSymbol(ticker: string) {
  return `${ticker.toUpperCase()}.BSE`
}

function parsePercent(value?: string) {
  return toNumber(value?.replace('%', ''))
}

async function fetchAlphaQuote(ticker: string) {
  const apiKey = getApiKey()

  if (!apiKey) {
    throw new Error('ALPHA_VANTAGE_API_KEY is not configured')
  }

  const url = new URL('https://www.alphavantage.co/query')
  url.searchParams.set('function', 'GLOBAL_QUOTE')
  url.searchParams.set('symbol', toAlphaSymbol(ticker))
  url.searchParams.set('apikey', apiKey)

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 300 },
  })

  if (!response.ok) {
    throw new Error(`Alpha Vantage quote request failed: ${response.status}`)
  }

  const payload = await response.json() as AlphaQuoteResponse
  const quote = payload['Global Quote']
  const current = toNumber(quote?.['05. price'])

  if (payload.Note || payload['Error Message'] || current === undefined) {
    throw new Error(payload.Note ?? payload['Error Message'] ?? 'Alpha Vantage returned no usable quote')
  }

  return {
    change: toNumber(quote?.['09. change']),
    changePct: parsePercent(quote?.['10. change percent']),
    current,
    high: toNumber(quote?.['03. high']),
    low: toNumber(quote?.['04. low']),
    open: toNumber(quote?.['02. open']),
    previousClose: toNumber(quote?.['08. previous close']),
    updatedAt: quote?.['07. latest trading day'] ? new Date(quote['07. latest trading day']).toISOString() : undefined,
    volume: toNumber(quote?.['06. volume']),
  }
}

export const alphaVantageMarketDataProvider: MarketDataProvider = {
  cacheTtlSeconds: 300,
  mode: 'live',
  name: 'alpha',
  async getMarketOverview(step) {
    return getMarketOverview(step)
  },
  async getStockDetail(ticker, step) {
    const fallback = getStockDetailByTicker(ticker, step)

    try {
      return mapQuoteToStockDetail(ticker, fallback, await fetchAlphaQuote(ticker))
    } catch {
      return fallback
    }
  },
  async getSupportedTickers() {
    return getSupportedTickers()
  },
  async health() {
    try {
      await fetchAlphaQuote('RELIANCE')

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
        reason: error instanceof Error ? error.message : 'Alpha Vantage health check failed',
      }
    }
  },
}
