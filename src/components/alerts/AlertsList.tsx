'use client'

import { BellRing, Trash2 } from 'lucide-react'

import { formatDate, formatTime } from '@/lib/utils/formatters'
import type { AlertRecord } from '@/types/alert'

interface AlertsListProps {
  alerts: AlertRecord[]
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}

export function AlertsList({ alerts, onToggle, onRemove }: AlertsListProps) {
  return (
    <section className="rounded-3xl border border-border bg-surface/90 p-5 shadow-panel">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-primary">Active Alerts</h3>
          <p className="mt-1 text-sm text-secondary">Triggered alerts stay visible so decision-making stays auditable.</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {alerts.map((alert) => (
          <article className="rounded-2xl border border-border bg-base/50 p-4" key={alert.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 rounded-full p-2 ${
                    alert.status === 'triggered' ? 'bg-gain/10 text-gain' : 'bg-accent/10 text-accent'
                  }`}
                >
                  <BellRing className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-primary">{alert.title}</div>
                  <div className="mt-1 text-xs text-secondary">
                    {alert.ticker} · {alert.metric} · {alert.channel}
                  </div>
                  <div className="mt-2 text-xs text-muted">
                    Created {formatDate(alert.createdAt)} at {formatTime(alert.createdAt)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="rounded-full border border-border px-3 py-1.5 text-xs text-primary transition hover:border-accent"
                  onClick={() => onToggle(alert.id)}
                  type="button"
                >
                  {alert.active ? 'Mute' : 'Re-arm'}
                </button>
                <button
                  className="rounded-full border border-border p-2 text-secondary transition hover:border-loss hover:text-loss"
                  onClick={() => onRemove(alert.id)}
                  type="button"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

