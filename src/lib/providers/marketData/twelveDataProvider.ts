import { getMarketOverview } from '@/lib/services/marketService'
import { getStockDetailByTicker, getSupportedTickers } from '@/lib/services/stockService'
import type { MarketDataProvider } from '@/lib/providers/marketData/types'
import { mapQuoteToStockDetail, toNumber } from '@/lib/providers/marketData/quoteUtils'

type TwelveQuote = {
  change?: string
  close?: string
  datetime?: string
  high?: string
  low?: string
  name?: string
  open?: string
  percent_change?: string
  previous_close?: string
  status?: string
  volume?: string
}

function getApiKey() {
  return process.env.TWELVE_DATA_API_KEY
}

function toTwelveSymbol(ticker: string) {
  return `${ticker.toUpperCase()}:NSE`
}

async function fetchTwelveQuote(ticker: string) {
  const apiKey = getApiKey()

  if (!apiKey) {
    throw new Error('TWELVE_DATA_API_KEY is not configured')
  }

  const url = new URL('https://api.twelvedata.com/quote')
  url.searchParams.set('symbol', toTwelveSymbol(ticker))
  url.searchParams.set('apikey', apiKey)

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 300 },
  })

  if (!response.ok) {
    throw new Error(`Twelve Data quote request failed: ${response.status}`)
  }

  const quote = await response.json() as TwelveQuote
  const current = toNumber(quote.close)

  if (quote.status === 'error' || current === undefined) {
    throw new Error('Twelve Data returned no usable quote')
  }

  return {
    change: toNumber(quote.change),
    changePct: toNumber(quote.percent_change),
    current,
    high: toNumber(quote.high),
    low: toNumber(quote.low),
    name: quote.name,
    open: toNumber(quote.open),
    previousClose: toNumber(quote.previous_close),
    updatedAt: quote.datetime ? new Date(quote.datetime).toISOString() : undefined,
    volume: toNumber(quote.volume),
  }
}

export const twelveDataMarketDataProvider: MarketDataProvider = {
  cacheTtlSeconds: 300,
  mode: 'live',
  name: 'twelve',
  async getMarketOverview(step) {
    return getMarketOverview(step)
  },
  async getStockDetail(ticker, step) {
    const fallback = getStockDetailByTicker(ticker, step)

    try {
      return mapQuoteToStockDetail(ticker, fallback, await fetchTwelveQuote(ticker))
    } catch {
      return fallback
    }
  },
  async getSupportedTickers() {
    return getSupportedTickers()
  },
  async health() {
    try {
      await fetchTwelveQuote('RELIANCE')

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
        reason: error instanceof Error ? error.message : 'Twelve Data health check failed',
      }
    }
  },
}
