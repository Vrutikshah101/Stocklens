import { DEMO_TRANSACTIONS, getPortfolioNames } from '@/lib/utils/constants'
import type { PortfolioTransaction } from '@/types/portfolio'

export function getPortfolioOptions() {
  return getPortfolioNames()
}

export function getInitialPortfolioTransactions(): PortfolioTransaction[] {
  return DEMO_TRANSACTIONS
}
