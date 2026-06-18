'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { ArrowRight, LockKeyhole, ShieldCheck, Sparkles, WandSparkles } from 'lucide-react'

import { useAuth } from '@/hooks/useAuth'
import { useMarketStatus } from '@/hooks/useMarketStatus'
import type { UserPlan } from '@/types/user'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Skeleton } from '@/components/ui/Skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'

const AUTH_CHANGED_EVENT = 'stocklens-auth-changed'

const planOptions: Array<{
  label: string
  plan: UserPlan
  subtitle: string
}> = [
  { label: 'Free', plan: 'FREE', subtitle: 'Clean market overview and starter workflows' },
  { label: 'Pro', plan: 'PRO', subtitle: 'Deeper search, portfolio context, and saved flows' },
  { label: 'Elite', plan: 'ELITE', subtitle: 'Research-heavy workspace with premium polish' },
]

export default function LoginPage() {
  const { isAuthenticated, isLoading, signIn, user } = useAuth()
  const marketStatus = useMarketStatus()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('••••••••')
  const [plan, setPlan] = useState<UserPlan>('PRO')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPlans, setShowPlans] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      return
    }

    setEmail(user.email)
    setPlan(user.plan)
  }, [user])

  const activePlan = useMemo(() => planOptions.find((item) => item.plan === plan), [plan])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSuccessMessage(null)

    await new Promise((resolve) => window.setTimeout(resolve, 650))

    signIn(plan)
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT))
    setSuccessMessage(`Demo session refreshed on the ${plan} plan. Shell entitlements now follow that tier locally.`)
    setIsSubmitting(false)
  }

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Card className="overflow-hidden">
          <CardHeader>
            <Badge icon={<LockKeyhole className="h-3.5 w-3.5" />} variant="info">
              Auth demo
            </Badge>
            <CardTitle className="text-[clamp(1.8rem,3vw,2.5rem)]">Welcome back to a calmer market workspace.</CardTitle>
            <CardDescription className="max-w-2xl text-base">
              This prototype keeps sign-in intentionally compact: choose a plan, confirm your session, and continue with a locally trusted shell.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-40" />
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    autoComplete="email"
                    label="Email"
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="vrutik@stocklens.app"
                    type="email"
                    value={email}
                  />
                  <Select
                    label="Plan"
                    onChange={(event) => setPlan(event.target.value as UserPlan)}
                    value={plan}
                  >
                    {planOptions.map((option) => (
                      <option key={option.plan} value={option.plan}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <Input
                  autoComplete="current-password"
                  hint="Any password works in the prototype. Nothing leaves the browser."
                  label="Password"
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  value={password}
                />

                {successMessage ? (
                  <div className="rounded-[24px] border border-[rgba(109,216,174,0.24)] bg-[var(--color-green-soft)] p-4 text-sm leading-6 text-[var(--color-green)]">
                    {successMessage}
                  </div>
                ) : null}

                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <Button
                    isLoading={isSubmitting}
                    leadingIcon={<Sparkles className="h-4 w-4" />}
                    trailingIcon={<ArrowRight className="h-4 w-4" />}
                    type="submit"
                  >
                    {isAuthenticated ? 'Refresh demo session' : 'Start demo session'}
                  </Button>
                  <Button onClick={() => setShowPlans(true)} type="button" variant="secondary">
                    Compare plans
                  </Button>
                </div>
              </form>
            )}
          </CardContent>

          <CardFooter className="flex-col items-start border-t border-border pt-5 text-sm text-secondary md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[var(--color-green)]" />
              <span>Local-only auth state. Theme and plan persist between sessions.</span>
            </div>
            <Link className="font-medium text-[var(--color-accent-blue)] transition hover:opacity-80" href="/register">
              Need a fresh onboarding flow?
            </Link>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Badge dot variant={marketStatus.isOpen ? 'success' : 'warning'}>
                {marketStatus.label}
              </Badge>
              <CardTitle>Trust-building details</CardTitle>
              <CardDescription>The shell avoids noisy claims and tells you exactly what is simulated right now.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-6 text-secondary">
              <div className="rounded-[24px] border border-border bg-[var(--color-surface-soft)] p-4">
                <p className="font-medium text-primary">Current session</p>
                <p className="mt-2">{user ? `${user.name} · ${user.email}` : 'A seeded demo profile appears after hydration.'}</p>
              </div>
              <div className="rounded-[24px] border border-border bg-[var(--color-surface-soft)] p-4">
                <p className="font-medium text-primary">Selected tier</p>
                <p className="mt-2">{activePlan?.subtitle}</p>
              </div>
              <div className="rounded-[24px] border border-border bg-[var(--color-surface-soft)] p-4">
                <p className="font-medium text-primary">Market status</p>
                <p className="mt-2">{marketStatus.hint}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Badge icon={<WandSparkles className="h-3.5 w-3.5" />} variant="default">
                Ready to explore
              </Badge>
              <CardTitle>What this prototype demonstrates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-secondary">
              <p>Responsive shell with persistent theme memory and a compact command-style search.</p>
              <p>Market status aligned to Indian trading hours for believable watch-mode behavior.</p>
              <p>Auth surfaces that stay honest about local demo state rather than pretending to call a backend.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog
        description="Plan labels are intentionally simple so the auth flow stays focused on confidence, not clutter."
        footer={
          <div className="flex justify-end">
            <Button onClick={() => setShowPlans(false)} variant="secondary">
              Close
            </Button>
          </div>
        }
        onOpenChange={setShowPlans}
        open={showPlans}
        size="lg"
        title="Plan comparison"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plan</TableHead>
              <TableHead>Best for</TableHead>
              <TableHead>Shell posture</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {planOptions.map((option) => (
              <TableRow key={option.plan}>
                <TableCell className="font-medium text-primary">{option.label}</TableCell>
                <TableCell>{option.subtitle}</TableCell>
                <TableCell>
                  {option.plan === 'FREE'
                    ? 'Fast orientation'
                    : option.plan === 'PRO'
                      ? 'Balanced daily workflow'
                      : 'High-conviction research mode'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Dialog>
    </>
  )
}
