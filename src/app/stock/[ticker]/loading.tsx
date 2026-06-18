function SkeletonBlock({ className }: { className: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-base ${className}`} />
  )
}

export function StockPageSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 text-primary">
        <section className="rounded-lg border border-border bg-surface p-4">
          <div className="grid gap-4 xl:grid-cols-[1.45fr,0.9fr]">
            <div className="space-y-4">
              <SkeletonBlock className="h-6 w-32" />
              <SkeletonBlock className="h-12 w-80 max-w-full" />
              <SkeletonBlock className="h-4 w-full max-w-3xl" />
              <SkeletonBlock className="h-4 w-5/6" />
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <SkeletonBlock key={index} className="h-24 w-full" />
                ))}
              </div>
            </div>
            <div className="space-y-4 rounded-lg border border-border bg-surface p-4">
              <SkeletonBlock className="h-5 w-28" />
              <SkeletonBlock className="h-10 w-40" />
              <SkeletonBlock className="h-4 w-36" />
              <SkeletonBlock className="h-28 w-full" />
            </div>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-32 w-full" />
          ))}
        </div>

        <SkeletonBlock className="h-14 w-full" />

        <div className="grid gap-4 xl:grid-cols-[1.55fr,0.95fr]">
          <SkeletonBlock className="h-[420px] w-full" />
          <SkeletonBlock className="h-[420px] w-full" />
        </div>

        <SkeletonBlock className="h-[360px] w-full" />
    </div>
  )
}

export default function Loading() {
  return <StockPageSkeleton />
}
