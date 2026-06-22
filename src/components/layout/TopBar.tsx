'use client'

import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Menu,
  MoonStar,
  Search,
  Sparkles,
  SunMedium,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react'

import { useMarketStatus } from '@/hooks/useMarketStatus'
import { getMarketIndexSnapshots } from '@/lib/services/marketService'
import { getStockLivePrice, searchStockUniverse } from '@/lib/services/stockService'
import { cn, formatCurrency, formatPct } from '@/lib/utils/formatters'
import { useUIStore } from '@/store/uiStore'
import type { UserProfile } from '@/types/user'

import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Tooltip } from '../ui/Tooltip'

interface TopBarProps {
  user: UserProfile | null
}

export function TopBar({ user }: TopBarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { sidebarOpen, theme, toggleSidebar, toggleTheme } = useUIStore()
  const marketStatus = useMarketStatus()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [step, setStep] = useState(0)

  useEffect(() => {
    setStep(Math.floor(Date.now() / 5000))
    const timer = window.setInterval(() => setStep(Math.floor(Date.now() / 5000)), 5000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleSlash = (event: globalThis.KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return
      }

      if (event.key === '/') {
        event.preventDefault()
        inputRef.current?.focus()
        setOpen(true)
      }
    }

    window.addEventListener('mousedown', handleOutside)
    window.addEventListener('keydown', handleSlash)

    return () => {
      window.removeEventListener('mousedown', handleOutside)
      window.removeEventListener('keydown', handleSlash)
    }
  }, [])

  const suggestions = useMemo(
    () =>
      searchStockUniverse(query).map((stock) => ({
        ...stock,
        price: getStockLivePrice(stock.ticker, step),
      })),
    [query, step],
  )

  const indices = useMemo(() => getMarketIndexSnapshots(step).slice(0, 3), [step])
  const topBarOffset = sidebarOpen ? 'lg:left-[15rem]' : 'lg:left-[4.75rem]'

  const selectSuggestion = (ticker: string) => {
    setQuery(ticker)
    setOpen(false)
    router.push(`/stock/${ticker}`)
  }

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) {
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      setActiveIndex((current) => (current + 1) % suggestions.length)
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setOpen(true)
      setActiveIndex((current) => (current - 1 + suggestions.length) % suggestions.length)
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      selectSuggestion(suggestions[activeIndex]?.ticker ?? suggestions[0].ticker)
    }

    if (event.key === 'Escape') {
      setOpen(false)
      inputRef.current?.blur()
    }
  }

  return (
    <header className={cn('fixed inset-x-0 top-0 z-30 border-b border-border bg-surface/92 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-[left] duration-300 lg:right-0', topBarOffset)}>
      <div className="mx-auto flex h-[52px] max-w-[1440px] items-center gap-3 px-3 md:px-5">
        <Button
          className="shrink-0"
          leadingIcon={<Menu className="h-4 w-4" />}
          onClick={toggleSidebar}
          size="icon"
          variant="secondary"
        />

        <div className="relative flex-1" ref={rootRef}>
          <Input
            className="h-8 rounded-md border-border bg-base pr-12 text-[13px] text-primary shadow-inner"
            leading={<Search className="h-4 w-4" />}
            onChange={(event) => {
              setQuery(event.target.value)
              setOpen(true)
              setActiveIndex(0)
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search stocks, e.g. TCS, HDFC Bank..."
            ref={inputRef}
            trailing={
              query ? (
                <button
                  aria-label="Clear search"
                  className="rounded-full p-1 text-muted transition hover:text-primary"
                  onClick={() => {
                    setQuery('')
                    inputRef.current?.focus()
                  }}
                  type="button"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : (
                <span className="hidden rounded-md border border-border bg-surface px-2 py-1 text-[10px] uppercase text-secondary md:inline-flex">
                  /
                </span>
              )
            }
            value={query}
          />
          {open ? (
            <div className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-50 overflow-hidden rounded-xl border border-border bg-surface p-1 shadow-float">
              <div className="flex items-center justify-between px-3 py-2">
                <p className="text-[10px] font-semibold uppercase text-secondary">
                  {query ? 'Search results' : 'Quick jump'}
                </p>
                <p className="text-[10px] text-secondary">Simulated market data</p>
              </div>
              <div className="space-y-1">
                {suggestions.length ? (
                  suggestions.map((item, index) => {
                    const positive = item.price.changePct >= 0

                    return (
                      <button
                        className={cn(
                          'flex w-full items-center justify-between gap-4 rounded-md px-3 py-2.5 text-left transition',
                          index === activeIndex
                            ? 'bg-[var(--color-accent-blue-soft)]'
                            : 'hover:bg-[var(--color-surface-soft)]',
                        )}
                        key={item.ticker}
                        onClick={() => selectSuggestion(item.ticker)}
                        onMouseEnter={() => setActiveIndex(index)}
                        type="button"
                      >
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-primary">
                            {item.ticker}
                            <span className="ml-2 text-secondary">{item.name}</span>
                          </p>
                          <p className="truncate text-[11px] text-secondary">{item.sector}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-xs font-medium text-primary">{formatCurrency(item.price.current)}</p>
                          <p
                            className={cn(
                              'text-xs font-medium',
                              positive ? 'text-[var(--color-green)]' : 'text-[var(--color-red)]',
                            )}
                          >
                            {formatPct(item.price.changePct)}
                          </p>
                        </div>
                      </button>
                    )
                  })
                ) : (
                  <div className="rounded-md px-3 py-4 text-sm text-secondary">
                    No matches yet. Try <span className="text-primary">RELIANCE</span> or{' '}
                    <span className="text-primary">Financials</span>.
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        <div className="hidden items-center gap-2 xl:flex">
          {indices.map((index) => {
            const positive = index.changePct >= 0
            const TrendIcon = positive ? TrendingUp : TrendingDown

            return (
              <div className="rounded-lg border border-border bg-base px-3 py-1.5 shadow-sm" key={index.symbol}>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium text-secondary">{index.symbol}</span>
                  <TrendIcon
                    className={cn(
                      'h-3.5 w-3.5',
                      positive ? 'text-[var(--color-green)]' : 'text-[var(--color-red)]',
                    )}
                  />
                </div>
                <p className="mt-1 font-mono text-[11px] text-primary">
                  {formatCurrency(index.value)} · {formatPct(index.changePct)}
                </p>
              </div>
            )
          })}
        </div>

        <Tooltip content={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
          <Button
            className="shrink-0"
            leadingIcon={theme === 'dark' ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
            onClick={toggleTheme}
            size="icon"
            variant="secondary"
          />
        </Tooltip>

        <Link className="hidden md:block" href="/login">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,#2f81f7,#8b5cf6)] text-xs font-bold text-white">
            {user?.avatarInitials ?? 'U'}
          </div>
        </Link>

        <Link className="md:hidden" href="/login">
          <Button leadingIcon={<Sparkles className="h-4 w-4" />} size="icon" variant="secondary" />
        </Link>
      </div>
    </header>
  )
}

export default TopBar
