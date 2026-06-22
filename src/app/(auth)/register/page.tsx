'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { ArrowRight, BriefcaseBusiness, Building2, Mail, Sparkles, UserRound } from 'lucide-react'

import { useAuth } from '@/hooks/useAuth'
import type { UserPlan } from '@/types/user'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Skeleton } from '@/components/ui/Skeleton'

const AUTH_CHANGED_EVENT = 'stocklens-auth-changed'

const planHighlights: Array<{
  focus: string
  label: string
  plan: UserPlan
}> = [
  { focus: 'Learn the shell quietly', label: 'Free', plan: 'FREE' },
  { focus: 'Run the daily investing workflow', label: 'Pro', plan: 'PRO' },
  { focus: 'Build a research-heavy command center', label: 'Elite', plan: 'ELITE' },
]

export default function RegisterPage() {
  const { isLoading, signIn, user } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('Independent investor')
  const [plan, setPlan] = useState<UserPlan>('PRO')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!user) {
      return
    }

    setEmail(user.email)
    setFullName(user.name)
    setPlan(user.plan)
  }, [user])

  const selectedPlan = useMemo(() => planHighlights.find((item) => item.plan === plan), [plan])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    await new Promise((resolve) => window.setTimeout(resolve, 700))

    signIn(plan)
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT))
    setSubmitted(true)
    setIsSubmitting(false)
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
      <Card>
        <CardHeader>
          <Badge icon={<Building2 className="h-3.5 w-3.5" />} variant="default">
            Guided onboarding
          </Badge>
          <CardTitle className="text-[clamp(1.8rem,3vw,2.4rem)]">Set up a stock workspace that feels composed from day one.</CardTitle>
          <CardDescription className="max-w-2xl text-base">
            Registration stays intentionally light. We capture your preferences, then activate the shared demo profile with the plan you choose.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Full name"
                  leading={<UserRound className="h-4 w-4" />}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Vrutik Shah"
                  value={fullName}
                />
                <Input
                  label="Work email"
                  leading={<Mail className="h-4 w-4" />}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@fundhouse.com"
                  type="email"
                  value={email}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Select
                  label="Role"
                  leading={<BriefcaseBusiness className="h-4 w-4" />}
                  onChange={(event) => setRole(event.target.value)}
                  value={role}
                >
                  <option>Independent investor</option>
                  <option>Research analyst</option>
                  <option>Portfolio manager</option>
                  <option>Family office advisor</option>
                </Select>
                <Select label="Workspace plan" onChange={(event) => setPlan(event.target.value as UserPlan)} value={plan}>
                  {planHighlights.map((option) => (
                    <option key={option.plan} value={option.plan}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="rounded-md border border-border bg-base p-3">
                <p className="text-sm font-medium text-primary">How this prototype handles sign-up</p>
                <p className="mt-2 text-sm leading-6 text-secondary">
                  Your form choices stay on the page for context, while the shared demo identity activates behind the scenes so the rest of the shell remains coherent.
                </p>
              </div>

              {submitted ? (
                <div className="rounded-md border border-[rgba(47,129,247,0.35)] bg-[var(--color-accent-blue-soft)] p-3 text-sm leading-5 text-secondary">
                  <p className="font-medium text-primary">Workspace created</p>
                  <p className="mt-2">
                    {fullName || 'Your'} preferences are staged for the <span className="text-primary">{selectedPlan?.label}</span> experience.
                    The shared demo identity is now signed in so the shell stays consistent across routes.
                  </p>
                </div>
              ) : null}

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Button
                  isLoading={isSubmitting}
                  leadingIcon={<Sparkles className="h-4 w-4" />}
                  trailingIcon={<ArrowRight className="h-4 w-4" />}
                  type="submit"
                >
                  Create demo workspace
                </Button>
                <Link
                  className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-[var(--color-bg-elevated)] px-4 text-sm font-medium text-primary transition hover:bg-[var(--color-surface-soft)]"
                  href="/login"
                >
                  Already have a session?
                </Link>
              </div>
            </form>
          )}
        </CardContent>

        <CardFooter className="border-t border-border pt-5 text-sm text-secondary">
          <p>The shell remembers theme, plan, and demo auth state locally so the experience feels stable between visits.</p>
        </CardFooter>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <Badge variant="info">Why this flow works</Badge>
            <CardTitle>Compact by design</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-secondary">
            <div className="rounded-md border border-border bg-base p-3">
              <p className="font-medium text-primary">Low cognitive load</p>
              <p className="mt-2">Only the decisions that influence the prototype are surfaced: role, plan, and a trusted email anchor.</p>
            </div>
            <div className="rounded-md border border-border bg-base p-3">
              <p className="font-medium text-primary">Shared identity model</p>
              <p className="mt-2">The current implementation keeps a single demo profile so nav, search, and shell state never drift out of sync.</p>
            </div>
            <div className="rounded-md border border-border bg-base p-3">
              <p className="font-medium text-primary">Future-safe shell</p>
              <p className="mt-2">As feature pages arrive, the same layout already carries theme, market timing, and responsive navigation.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Badge variant="outline">Plan snapshot</Badge>
            <CardTitle>{selectedPlan?.label ?? 'Pro'} best fits this prototype</CardTitle>
            <CardDescription>{selectedPlan?.focus}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-secondary">
            <p>Free keeps the surface light and exploratory.</p>
            <p>Pro feels balanced for everyday decision-making.</p>
            <p>Elite adds the high-trust posture you would expect in a research cockpit.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
