import { AlertTriangle, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react'

import type { SWOTAnalysis } from '@/types/stock'

interface SWOTCardProps {
  swot: SWOTAnalysis
}

const sections = [
  {
    key: 'strengths',
    label: 'Strengths',
    icon: ShieldCheck,
    tone: 'border-emerald-500/20 bg-emerald-500/8 text-emerald-100',
    bullet: 'bg-emerald-300',
  },
  {
    key: 'weaknesses',
    label: 'Weaknesses',
    icon: AlertTriangle,
    tone: 'border-rose-500/20 bg-rose-500/8 text-rose-100',
    bullet: 'bg-rose-300',
  },
  {
    key: 'opportunities',
    label: 'Opportunities',
    icon: TrendingUp,
    tone: 'border-sky-500/20 bg-sky-500/8 text-sky-100',
    bullet: 'bg-sky-300',
  },
  {
    key: 'threats',
    label: 'Threats',
    icon: Sparkles,
    tone: 'border-amber-500/20 bg-amber-500/8 text-amber-100',
    bullet: 'bg-amber-300',
  },
] as const

export function SWOTCard({ swot }: SWOTCardProps) {
  return (
    <section className="rounded-3xl border border-border bg-surface/90 p-5 shadow-panel">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.24em] text-secondary">
          Investment framing
        </p>
        <h2 className="mt-1 text-xl font-semibold text-primary">SWOT snapshot</h2>
        <p className="mt-2 text-sm leading-6 text-secondary">
          A quick qualitative frame so the slice balances raw numbers with
          thesis-level context.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {sections.map(({ bullet, icon: Icon, key, label, tone }) => {
          const items = swot[key]

          return (
            <article className={`rounded-3xl border p-4 ${tone}`} key={key}>
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl border border-border bg-base/60 p-2.5">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em]">
                  {label}
                </h3>
              </div>
              <ul className="space-y-3 text-sm leading-6">
                {items.map((item) => (
                  <li className="flex gap-3" key={item}>
                    <span
                      className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${bullet}`}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          )
        })}
      </div>
    </section>
  )
}
