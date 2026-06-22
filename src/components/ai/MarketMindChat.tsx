'use client'

import { useMemo, useState } from 'react'
import { Bot, Send, Sparkles } from 'lucide-react'

import { getMarketMindSuggestions } from '@/lib/services/aiHarnessService'
import { cn } from '@/lib/utils/formatters'

const STARTER_MESSAGE =
  'I can help summarize momentum, risk, and valuation with the same demo market feed powering the rest of this prototype.'

export function MarketMindChat() {
  const [messages, setMessages] = useState<string[]>([STARTER_MESSAGE])
  const [prompt, setPrompt] = useState('')

  const suggestions = useMemo(() => getMarketMindSuggestions(), [])

  const respond = (nextPrompt: string) => {
    if (!nextPrompt.trim()) {
      return
    }

    setMessages((current) => [
      ...current,
      `You: ${nextPrompt}`,
      `MarketMind: ${buildResponse(nextPrompt)}`,
    ])
    setPrompt('')
  }

  return (
    <section className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-ai">
            <Sparkles className="h-4 w-4" />
            MarketMind AI
          </div>
          <p className="mt-1 text-sm text-secondary">
            Calm, explainable prompts layered on top of live sample data.
          </p>
        </div>
        <div className="rounded-md border border-ai/30 bg-ai/10 px-2.5 py-1 text-xs text-ai">
          Demo Mode
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {messages.slice(-4).map((message) => {
          const isUser = message.startsWith('You:')
          return (
            <div
              key={message}
              className={cn(
                'rounded-md border border-border px-3 py-2 text-sm',
                isUser ? 'bg-accent/10 text-primary' : 'bg-base/70 text-secondary',
              )}
            >
              <div className="flex items-start gap-3">
                <Bot className={cn('mt-0.5 h-4 w-4 shrink-0', isUser ? 'text-accent' : 'text-ai')} />
                <span>{message}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            className="rounded-md border border-border bg-base px-3 py-1.5 text-xs text-secondary transition hover:border-accent hover:text-primary"
            onClick={() => respond(suggestion)}
            type="button"
          >
            {suggestion}
          </button>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          className="h-9 min-w-0 flex-1 rounded-md border border-border bg-base px-3 text-sm outline-none ring-0 transition placeholder:text-muted focus:border-accent"
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Ask for a risk summary, valuation take, or sector snapshot"
          value={prompt}
        />
        <button
          className="inline-flex h-9 items-center gap-2 rounded-md bg-accent px-3 text-sm font-medium text-white transition hover:brightness-110"
          onClick={() => respond(prompt)}
          type="button"
        >
          <Send className="h-4 w-4" />
          Ask
        </button>
      </div>
    </section>
  )
}

function buildResponse(prompt: string) {
  const normalized = prompt.toLowerCase()

  if (normalized.includes('risk')) {
    return 'Risk is concentrated in financials and energy, but the prototype portfolio still trends quality-heavy with healthy DVM support.'
  }

  if (normalized.includes('momentum')) {
    return 'Momentum is strongest in telecom and banks right now, with ICICIBANK and BHARTIARTL showing the cleanest follow-through.'
  }

  if (normalized.includes('valuation')) {
    return 'Valuation looks most comfortable in select financials, while premium IT names are asking for steadier earnings confirmation.'
  }

  return 'The clearest theme today is selective strength: higher-quality large caps are leading, while leverage-heavy names need more confirmation.'
}
