import { NextResponse } from 'next/server'

export function validateCronRequest(request: Request) {
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret) {
    return null
  }

  const authorization = request.headers.get('authorization')
  const expected = `Bearer ${cronSecret}`

  if (authorization === expected) {
    return null
  }

  return NextResponse.json({ error: 'Unauthorized cron request' }, { status: 401 })
}
