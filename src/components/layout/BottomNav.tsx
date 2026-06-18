'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, BellRing, BriefcaseBusiness, LayoutDashboard, SearchCheck, type LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils/formatters'

const items: Array<{ href: string; icon: LucideIcon; label: string }> = [
  { href: '/', icon: LayoutDashboard, label: 'Home' },
  { href: '/stock/RELIANCE', icon: BarChart3, label: 'Stocks' },
  { href: '/screener', icon: SearchCheck, label: 'Screener' },
  { href: '/portfolio', icon: BriefcaseBusiness, label: 'Portfolio' },
  { href: '/alerts', icon: BellRing, label: 'Alerts' },
]

function isActive(href: string, pathname: string) {
  if (href === '/') {
    return pathname === '/'
  }

  if (href.startsWith('/stock')) {
    return pathname.startsWith('/stock')
  }

  return pathname.startsWith(href)
}

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-3 z-30 px-3 lg:hidden">
      <div className="panel-elevated mx-auto flex max-w-md items-center justify-between rounded-[28px] px-2 py-2">
        {items.map((item) => {
          const Icon = item.icon
          const active = pathname ? isActive(item.href, pathname) : false

          return (
            <Link
              className={cn(
                'flex min-w-[4.2rem] flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition-all',
                active
                  ? 'bg-[var(--color-accent-blue-soft)] text-primary'
                  : 'text-muted hover:bg-[var(--color-surface-soft)] hover:text-primary',
              )}
              href={item.href}
              key={item.href}
            >
              <Icon className={cn('h-4 w-4', active && 'text-[var(--color-accent-blue)]')} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav
