'use client'

import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Clock3,
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
import { getLivePrice, getMarketIndices, searchStocks } from '@/lib/utils/constants'
import { cn, formatCurrency, formatPct } from '@/lib/utils/formatters'
import { useUIStore } from '@/store/uiStore'
import type { UserProfile } from '@/types/user'

import { Badge } from '../ui/Badge'
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
      searchStocks(query).map((stock) => ({
        ...stock,
        price: getLivePrice(stock.ticker, step),
      })),
    [query, step],
  )

  const indices = useMemo(() => getMarketIndices(step).slice(0, 3), [step])
  const topBarOffset = sidebarOpen ? 'lg:left-[19rem]' : 'lg:left-[6.5rem]'

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
    <header className={cn('fixed inset-x-0 top-0 z-30 px-3 pt-3 transition-[left] duration-300 md:px-4 lg:right-3', topBarOffset)}>
      <div className="panel-elevated mx-auto flex max-w-7xl items-center gap-3 rounded-[28px] px-3 py-3 md:px-4">
        <Button
          className="shrink-0"
          leadingIcon={<Menu className="h-4 w-4" />}
          onClick={toggleSidebar}
          size="icon"
          variant="secondary"
        />

        <div className="hidden min-w-0 md:block">
          <p className="text-sm font-semibold text-primary">StockLens shell</p>
          <p className="text-xs text-muted">
            {pathname?.startsWith('/login') || pathname?.startsWith('/register')
              ? 'Auth demo with local session state'
              : 'Responsive analytics workspace'}
          </p>
        </div>

        <div className="relative flex-1" ref={rootRef}>
          <Input
            className="pr-12"
            leading={<Search className="h-4 w-4" />}
            onChange={(event) => {
              setQuery(event.target.value)
              setOpen(true)
              setActiveIndex(0)
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search Indian equities"
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
                <span className="hidden rounded-full border border-border px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-muted md:inline-flex">
                  /
                </span>
              )
            }
            value={query}
          />
          {open ? (
            <div className="panel-elevated absolute left-0 right-0 top-[calc(100%+0.75rem)] overflow-hidden rounded-[26px] p-2 transition-all duration-200">
              <div className="flex items-center justify-between px-3 py-2">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
                  {query ? 'Search results' : 'Quick jump'}
                </p>
                <p className="text-xs text-muted">Simulated market data</p>
              </div>
              <div className="space-y-1">
                {suggestions.length ? (
                  suggestions.map((item, index) => {
                    const positive = item.price.changePct >= 0

                    return (
                      <button
                        className={cn(
                          'flex w-full items-center justify-between gap-4 rounded-2xl px-3 py-3 text-left transition',
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
                          <p className="text-sm font-medium text-primary">
                            {item.ticker}
                            <span className="ml-2 text-secondary">{item.name}</span>
                          </p>
                          <p className="truncate text-xs text-muted">{item.sector}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-primary">{formatCurrency(item.price.current)}</p>
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
                  <div className="rounded-2xl px-3 py-4 text-sm text-secondary">
                    No matches yet. Try a ticker like <span className="text-primary">RELIANCE</span> or a sector like{' '}
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
              <div className="rounded-2xl border border-border bg-[var(--color-surface-soft)] px-3 py-2" key={index.symbol}>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-primary">{index.symbol}</span>
                  <TrendIcon
                    className={cn(
                      'h-3.5 w-3.5',
                      positive ? 'text-[var(--color-green)]' : 'text-[var(--color-red)]',
                    )}
                  />
                </div>
                <p className="mt-1 text-xs text-secondary">
                  {formatCurrency(index.value)} · {formatPct(index.changePct)}
                </p>
              </div>
            )
          })}
        </div>

        <Badge className="hidden md:inline-flex" dot variant={marketStatus.isOpen ? 'success' : 'warning'}>
          {marketStatus.label}
        </Badge>

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
          <div className="rounded-[22px] border border-border bg-[var(--color-surface-soft)] px-3 py-2">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[rgba(124,156,255,0.14)] text-sm font-semibold text-[var(--color-accent-blue)]">
                {user?.avatarInitials ?? 'SL'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-primary">{user?.name ?? 'Local demo'}</p>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <Clock3 className="h-3 w-3" />
                  <span>{marketStatus.isOpen ? 'Live session' : 'After-hours prep'}</span>
                </div>
              </div>
            </div>
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
