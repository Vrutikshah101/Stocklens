'use client'

import { Bell } from 'lucide-react'

import { AlertForm } from '@/components/alerts/AlertForm'
import { AlertsList } from '@/components/alerts/AlertsList'
import { useAlerts } from '@/hooks/useAlerts'

export default function AlertsPage() {
  const { alerts, createAlert, toggleAlert, removeAlert } = useAlerts()

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-border bg-surface p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-md border border-border bg-base p-2 text-accent">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-primary">Alerts Engine</h1>
            <p className="mt-1 max-w-3xl text-sm leading-5 text-secondary">
              Create signal-driven workflows for price, DVM, volume, and event-based nudges using demo realtime feeds.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.4fr]">
        <AlertForm onCreate={createAlert} />
        <AlertsList alerts={alerts} onRemove={removeAlert} onToggle={toggleAlert} />
      </div>
    </div>
  )
}
