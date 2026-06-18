'use client'

import { useEffect, useMemo, useState } from 'react'

import { DEMO_TRANSACTIONS, getPortfolioNames, getStockDetail } from '@/lib/utils/constants'
import { usePortfolioStore } from '@/store/portfolioStore'
import type {
  PortfolioHolding,
  PortfolioModel,
  PortfolioPoint,
  PortfolioTransaction,
} from '@/types/portfolio'

const STORAGE_KEY = 'stocklens-transactions'
const DEMO_NOW = new Date('2026-06-18T07:00:00.000Z')

export function usePortfolio() {
  const { selectedPortfolioId, setSelectedPortfolioId, pendingTicker, setPendingTicker } = usePortfolioStore()
  const [transactions, setTransactions] = useState<PortfolioTransaction[]>(DEMO_TRANSACTIONS)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      setTransactions(JSON.parse(raw) as PortfolioTransaction[])
    }
    setStep(Math.floor(Date.now() / 5000))
    const timer = window.setInterval(() => {
      setStep(Math.floor(Date.now() / 5000))
    }, 5000)

    return () => window.clearInterval(timer)
  }, [])

  const persist = (nextTransactions: PortfolioTransaction[]) => {
    setTransactions(nextTransactions)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTransactions))
  }

  const addTransaction = (transaction: Omit<PortfolioTransaction, 'id'>) => {
    persist([
      {
        ...transaction,
        id: `txn-${Date.now()}`,
      },
      ...transactions,
    ])
  }

  const holdings = useMemo<PortfolioHolding[]>(() => {
    const grouped = new Map<string, { quantity: number; invested: number }>()

    transactions.forEach((transaction) => {
      const current = grouped.get(transaction.ticker) ?? { quantity: 0, invested: 0 }
      const direction = transaction.type === 'BUY' ? 1 : -1
      current.quantity += transaction.quantity * direction
      current.invested += transaction.quantity * transaction.price * direction
      grouped.set(transaction.ticker, current)
    })

    return Array.from(grouped.entries())
      .filter(([, value]) => value.quantity > 0)
      .map(([ticker, value]) => {
        const detail = getStockDetail(ticker, step)
        const avgCost = value.invested / value.quantity
        const marketValue = detail.price.current * value.quantity
        const pnl = marketValue - value.invested
        return {
          ticker,
          name: detail.info.name,
          quantity: value.quantity,
          avgCost,
          currentPrice: detail.price.current,
          marketValue,
          invested: value.invested,
          pnl,
          pnlPct: (pnl / value.invested) * 100,
          dvm: detail.dvm.composite,
        }
      })
      .sort((left, right) => right.marketValue - left.marketValue)
  }, [step, transactions])

  const snapshot = useMemo(() => {
    const nav = holdings.reduce((total, holding) => total + holding.marketValue, 0)
    const invested = holdings.reduce((total, holding) => total + holding.invested, 0)
    const totalPnl = nav - invested
    const dayChange = holdings.reduce(
      (total, holding) => total + (holding.currentPrice - getStockDetail(holding.ticker, Math.max(step - 1, 0)).price.current) * holding.quantity,
      0,
    )

    return {
      nav,
      invested,
      totalPnl,
      totalPnlPct: invested > 0 ? (totalPnl / invested) * 100 : 0,
      dayChange,
      xirr: 18.7,
    }
  }, [holdings, step])

  const navHistory = useMemo<PortfolioPoint[]>(() => {
    return Array.from({ length: 30 }, (_, index) => {
      const replayStep = Math.max(step - (29 - index), 0)
      const value = transactions.reduce((total, transaction) => {
        const detail = getStockDetail(transaction.ticker, replayStep)
        return total + detail.price.current * transaction.quantity
      }, 0)

      return {
        date: subDays(DEMO_NOW, 29 - index).toISOString(),
        value,
      }
    })
  }, [step, transactions])

  const portfolio: PortfolioModel = {
    id: selectedPortfolioId,
    name: getPortfolioNames().find((item) => item.id === selectedPortfolioId)?.name ?? 'Core Alpha',
    strategy: getPortfolioNames().find((item) => item.id === selectedPortfolioId)?.strategy ?? 'Quality + momentum blend',
    transactions,
    holdings,
    navHistory,
    snapshot,
  }

  return {
    portfolio,
    portfolios: getPortfolioNames(),
    selectedPortfolioId,
    setSelectedPortfolioId,
    pendingTicker,
    setPendingTicker,
    addTransaction,
  }
}

function subDays(date: Date, amount: number) {
  return new Date(date.getTime() - amount * 24 * 60 * 60 * 1000)
}
