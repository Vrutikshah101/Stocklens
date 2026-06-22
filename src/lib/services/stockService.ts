import {
  getLivePrice,
  getStockDetail,
  getUniverseTickers,
  searchStocks,
} from '@/lib/utils/constants'

export function getStockDetailByTicker(ticker: string, step: number) {
  return getStockDetail(ticker, step)
}

export function getStockLivePrice(ticker: string, step: number) {
  return getLivePrice(ticker, step)
}

export function searchStockUniverse(query: string) {
  return searchStocks(query)
}

export function getSupportedTickers() {
  return getUniverseTickers()
}
