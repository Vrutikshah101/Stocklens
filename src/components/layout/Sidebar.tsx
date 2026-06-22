'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  BellRing,
  BookMarked,
  BriefcaseBusiness,
  ChevronLeft,
  LayoutDashboard,
  Rocket,
  SearchCheck,
  ShieldCheck,
} from 'lucide-react'

import { useMarketStatus } from '@/hooks/useMarketStatus'
import { NAV_ITEMS } from '@/lib/utils/constants'
import { cn } from '@/lib/utils/formatters'
import { useUIStore } from '@/store/uiStore'
import type { UserProfile } from '@/types/user'

import { Badge } from '../ui/Badge'
import { Tooltip } from '../ui/Tooltip'

interface SidebarProps {
  user: UserProfile | null
}

const navIcons = {
  Alerts: BellRing,
  Dashboard: LayoutDashboard,
  IPO: Rocket,
  Portfolio: BriefcaseBusiness,
  Screener: SearchCheck,
  Stocks: BarChart3,
  Watchlist: BookMarked,
}

function isActive(href: string, pathname: string) {
  if (href === '/') {
    return pathname === '/'
  }

  if (href.startsWith('/stock')) {
    return pathname.startsWith('/stock')
  }

  return pathname.startsWith(href)
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const { marketMindOpen, setSidebarOpen, sidebarOpen, toggleMarketMind, toggleSidebar } = useUIStore()
  const marketStatus = useMarketStatus()
  const expanded = sidebarOpen

  return (
    <>
      <button
        aria-hidden={!sidebarOpen}
        className={cn(
          'fixed inset-0 z-40 bg-slate-950/62 backdrop-blur-sm transition-opacity lg:hidden',
          sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={() => setSidebarOpen(false)}
        tabIndex={sidebarOpen ? 0 : -1}
        type="button"
      />
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[15rem] flex-col overflow-hidden border-r border-border bg-surface/95 shadow-[18px_0_50px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-[calc(100%+1rem)] lg:translate-x-0',
          expanded ? 'lg:w-[15rem]' : 'lg:w-[4.75rem]',
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-4">
          <div className={cn('flex items-center gap-3', !expanded && 'lg:justify-center')}>
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[linear-gradient(135deg,#2f81f7,#8b5cf6)] text-xs font-bold text-white">
              SL
            </div>
            <div className={cn('min-w-0', !expanded && 'lg:hidden')}>
              <p className="text-sm font-bold text-primary">StockLens</p>
              <p className="text-[10px] text-secondary">NSE · BSE Analytics</p>
            </div>
          </div>
          <button
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-base text-secondary transition hover:text-primary lg:hidden"
            onClick={() => setSidebarOpen(false)}
            type="button"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-2 py-3">
          <nav className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = navIcons[item.label as keyof typeof navIcons]
              const active = pathname ? isActive(item.href, pathname) : false
              const link = (
                <Link
                  className={cn(
                    'group flex h-9 items-center gap-2.5 rounded-md px-2.5 text-[13px] font-medium transition-all duration-200',
                    active
                      ? 'bg-[var(--color-accent-blue-soft)] text-accent shadow-sm'
                      : 'text-secondary hover:bg-[var(--color-surface-soft)] hover:text-primary',
                    !expanded && 'lg:justify-center lg:px-0',
                  )}
                  href={item.href}
                  key={item.href}
                >
                  <span
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-md transition-colors',
                      active
                        ? 'text-accent'
                        : 'bg-transparent text-secondary group-hover:text-primary',
                    )}
                  >
                    {Icon ? <Icon className="h-4 w-4" /> : null}
                  </span>
                  <span className={cn('truncate', !expanded && 'lg:hidden')}>{item.label}</span>
                </Link>
              )

              if (!expanded) {
                return (
                  <Tooltip content={item.label} key={item.href} side="right">
                    {link}
                  </Tooltip>
                )
              }

              return link
            })}
          </nav>

          <div className={cn('space-y-3', !expanded && 'lg:hidden')}>
            <div className="rounded-xl border border-border bg-base p-3 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-primary">Market pulse</p>
                  <p className="mt-1 text-xs leading-5 text-secondary">Indian timing updates every minute.</p>
                </div>
                <Badge dot variant={marketStatus.isOpen ? 'success' : 'warning'}>
                  {marketStatus.label}
                </Badge>
              </div>
              <p className="mt-3 text-xs leading-5 text-secondary">{marketStatus.hint}</p>
              <button
                className="mt-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase text-secondary transition hover:text-primary"
                onClick={toggleMarketMind}
                type="button"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                {marketMindOpen ? 'Hide trust notes' : 'Show trust notes'}
              </button>
              {marketMindOpen ? (
                <ul className="mt-3 space-y-2 text-xs text-secondary">
                  <li>Simulated NSE and BSE-style data keeps flows realistic.</li>
                  <li>Theme choice persists locally for continuity between sessions.</li>
                  <li>Search and nav remain one click away on every screen.</li>
                </ul>
              ) : null}
            </div>
          </div>
        </div>

        <div className={cn('border-t border-border px-2 py-3', !expanded && 'lg:px-2')}>
          <div
            className={cn(
              'rounded-xl border border-border bg-base p-2.5 shadow-sm',
              !expanded && 'lg:flex lg:justify-center lg:p-2',
            )}
          >
            <div className={cn('flex items-center gap-3', !expanded && 'lg:flex-col')}>
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--color-accent-blue-soft)] text-xs font-bold text-accent">
                {user?.avatarInitials ?? 'SL'}
              </div>
              <div className={cn('min-w-0 flex-1', !expanded && 'lg:hidden')}>
                <p className="truncate text-xs font-medium text-primary">{user?.name ?? 'Guest mode'}</p>
                <p className="truncate text-[10px] text-secondary">{user?.email ?? 'Local demo state'}</p>
              </div>
              {expanded ? (
                <Badge size="sm" variant="outline">
                  {user?.plan ?? 'DEMO'}
                </Badge>
              ) : null}
            </div>
          </div>
          <button
            className="mt-3 hidden h-9 w-full items-center justify-center gap-2 rounded-md border border-border bg-base text-xs font-medium text-secondary transition hover:text-primary lg:inline-flex"
            onClick={toggleSidebar}
            type="button"
          >
            <ChevronLeft className={cn('h-4 w-4 transition-transform', !expanded && 'rotate-180')} />
            <span className={cn(!expanded && 'hidden')}>Collapse</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
