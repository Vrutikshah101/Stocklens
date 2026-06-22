'use client'

import { useEffect, useMemo, useState } from 'react'

import { fetchJson, sendJson } from '@/lib/services/clientApi'
import { getInitialPortfolioTransactions, getPortfolioOptions } from '@/lib/services/portfolioService'
import { getStockDetailByTicker } from '@/lib/services/stockService'
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
  const [transactions, setTransactions] = useState<PortfolioTransaction[]>(getInitialPortfolioTransactions)
  const [portfolioOptions, setPortfolioOptions] = useState(getPortfolioOptions)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      setTransactions(JSON.parse(raw) as PortfolioTransaction[])
    }

    const controller = new AbortController()
    fetchJson<{
      portfolios: ReturnType<typeof getPortfolioOptions>
      selectedPortfolioId?: string
      transactions: PortfolioTransaction[]
    }>('/api/portfolio', controller.signal)
      .then((payload) => {
        setPortfolioOptions(payload.portfolios)
        setTransactions(payload.transactions)
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload.transactions))
        if (payload.selectedPortfolioId) {
          setSelectedPortfolioId(payload.selectedPortfolioId)
        }
      })
      .catch(() => undefined)

    setStep(Math.floor(Date.now() / 5000))
    const timer = window.setInterval(() => {
      setStep(Math.floor(Date.now() / 5000))
    }, 5000)

    return () => {
      controller.abort()
      window.clearInterval(timer)
    }
  }, [setSelectedPortfolioId])

  const persist = (nextTransactions: PortfolioTransaction[]) => {
    setTransactions(nextTransactions)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTransactions))
  }

  const addTransaction = (transaction: Omit<PortfolioTransaction, 'id'>) => {
    const optimisticTransaction = {
      ...transaction,
      id: `txn-${Date.now()}`,
    }
    persist([optimisticTransaction, ...transactions])

    sendJson<PortfolioTransaction>('/api/portfolio/transactions', {
      body: JSON.stringify(transaction),
      method: 'POST',
    })
      .then((createdTransaction) => persist([createdTransaction, ...transactions]))
      .catch(() => undefined)
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
        const detail = getStockDetailByTicker(ticker, step)
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
      (total, holding) => total + (holding.currentPrice - getStockDetailByTicker(holding.ticker, Math.max(step - 1, 0)).price.current) * holding.quantity,
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
        const detail = getStockDetailByTicker(transaction.ticker, replayStep)
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
    name: portfolioOptions.find((item) => item.id === selectedPortfolioId)?.name ?? portfolioOptions[0]?.name ?? 'Core Alpha',
    strategy: portfolioOptions.find((item) => item.id === selectedPortfolioId)?.strategy ?? portfolioOptions[0]?.strategy ?? 'Quality + momentum blend',
    transactions,
    holdings,
    navHistory,
    snapshot,
  }

  return {
    portfolio,
    portfolios: portfolioOptions,
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
