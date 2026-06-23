import type { StockDetail } from '@/types/stock'

export type ProviderQuote = {
  change?: number
  changePct?: number
  current: number
  high?: number
  low?: number
  name?: string
  open?: number
  previousClose?: number
  updatedAt?: string
  volume?: number
}

export function mapQuoteToStockDetail(ticker: string, fallback: StockDetail, quote: ProviderQuote): StockDetail {
  const previousClose = quote.previousClose ?? fallback.price.previousClose
  const change = quote.change ?? Number((quote.current - previousClose).toFixed(2))
  const changePct = quote.changePct ?? (previousClose > 0 ? Number(((change / previousClose) * 100).toFixed(2)) : fallback.price.changePct)

  return {
    ...fallback,
    info: {
      ...fallback.info,
      name: quote.name ?? fallback.info.name,
      ticker: ticker.toUpperCase(),
    },
    price: {
      change,
      changePct,
      current: quote.current,
      high: quote.high ?? fallback.price.high,
      low: quote.low ?? fallback.price.low,
      open: quote.open ?? fallback.price.open,
      previousClose,
      ticker: ticker.toUpperCase(),
      updatedAt: quote.updatedAt ?? new Date().toISOString(),
      volume: quote.volume ?? fallback.price.volume,
    },
  }
}

export function toNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const parsed = Number(value)

    return Number.isFinite(parsed) ? parsed : undefined
  }

  return undefined
}
