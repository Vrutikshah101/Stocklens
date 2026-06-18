import { CalendarDays, Megaphone } from 'lucide-react'

import { formatDate } from '@/lib/utils/formatters'
import type { CorporateEvent } from '@/types/stock'

interface CorporateEventsListProps {
  events: CorporateEvent[]
}

const impactTone: Record<CorporateEvent['impact'], string> = {
  positive: 'border-[color:var(--color-green)] bg-[color:var(--color-green-soft)] text-gain',
  neutral: 'border-border bg-surface text-primary',
  negative: 'border-[color:var(--color-red)] bg-[color:var(--color-red-soft)] text-loss',
}

export function CorporateEventsList({ events }: CorporateEventsListProps) {
  const now = Date.now()

  const ordered = [...events].sort((left, right) => {
    const leftTime = new Date(left.date).getTime()
    const rightTime = new Date(right.date).getTime()
    const leftUpcoming = leftTime >= now
    const rightUpcoming = rightTime >= now

    if (leftUpcoming !== rightUpcoming) {
      return leftUpcoming ? -1 : 1
    }

    return leftUpcoming ? leftTime - rightTime : rightTime - leftTime
  })

  return (
    <section className="rounded-lg border border-border bg-surface p-4">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.24em] text-secondary">
          Catalyst calendar
        </p>
        <h2 className="mt-1 text-xl font-semibold text-primary">
          Corporate events
        </h2>
        <p className="mt-2 text-sm leading-6 text-secondary">
          Upcoming and recently completed company milestones stay visible so the
          slice keeps event risk in the same workflow as price and fundamentals.
        </p>
      </div>

      <div className="space-y-4">
        {ordered.map((event) => {
          const eventTime = new Date(event.date).getTime()
          const isUpcoming = eventTime >= now

          return (
            <article
              className="relative rounded-lg border border-border bg-base/70 p-4 pl-6"
              key={`${event.type}-${event.date}-${event.title}`}
            >
              <span className="absolute left-3 top-5 h-3 w-3 rounded-full bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.55)]" />
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md border border-border px-2.5 py-1 text-xs text-secondary">
                      {event.type}
                    </span>
                    <span
                      className={`rounded-md border px-2.5 py-1 text-xs ${impactTone[event.impact]}`}
                    >
                      {event.impact}
                    </span>
                    <span className="rounded-md border border-border px-2.5 py-1 text-xs text-secondary">
                      {isUpcoming ? 'Upcoming' : 'Completed'}
                    </span>
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-primary">
                    {event.title}
                  </h3>
                </div>
                <div className="rounded-md border border-border bg-surface p-2.5 text-secondary">
                  {event.type === 'Conference Call' ? (
                    <Megaphone className="h-4 w-4" />
                  ) : (
                    <CalendarDays className="h-4 w-4" />
                  )}
                </div>
              </div>
              <p className="mt-3 text-sm text-secondary">
                {formatDate(event.date)}
              </p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
