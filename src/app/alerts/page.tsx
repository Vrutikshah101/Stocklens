'use client'

import { Bell } from 'lucide-react'

import { AlertForm } from '@/components/alerts/AlertForm'
import { AlertsList } from '@/components/alerts/AlertsList'
import { useAlerts } from '@/hooks/useAlerts'

export default function AlertsPage() {
  const { alerts, createAlert, toggleAlert, removeAlert } = useAlerts()

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-gradient-to-br from-surface via-surface to-base p-6 shadow-panel">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-accent/10 p-3 text-accent">
            <Bell className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-primary">Alerts Engine</h1>
            <p className="mt-2 max-w-3xl text-sm text-secondary">
              Create signal-driven workflows for price, DVM, volume, and event-based nudges using demo realtime feeds.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.4fr]">
        <AlertForm onCreate={createAlert} />
        <AlertsList alerts={alerts} onRemove={removeAlert} onToggle={toggleAlert} />
      </div>
    </div>
  )
}

