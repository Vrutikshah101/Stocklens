import { NextResponse } from 'next/server'

type ApiHandler<T> = () => Promise<T> | T

export async function withApiTiming<T>(route: string, handler: ApiHandler<T>) {
  const startedAt = performance.now()

  try {
    const result = await handler()
    const durationMs = Math.round(performance.now() - startedAt)

    if (process.env.API_TIMING_LOGS === 'true') {
      console.info(`[api] ${route} ok ${durationMs}ms`)
    }

    return result
  } catch (error) {
    const durationMs = Math.round(performance.now() - startedAt)
    console.error(`[api] ${route} error ${durationMs}ms`, error)
    throw error
  }
}

export function jsonWithTiming<T>(route: string, handler: ApiHandler<T>) {
  return withApiTiming(route, async () => NextResponse.json(await handler()))
}
