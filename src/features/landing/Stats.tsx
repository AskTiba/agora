import { useEffect, useRef, useState } from 'react'

const STATS = [
  { label: 'Core Categories', value: 4, suffix: '' },
  { label: 'Local Places', value: 250, suffix: '+' },
  { label: 'Weekly Events', value: 50, suffix: '+' },
  { label: 'Community Members', value: 10000, suffix: '+' },
]

function useCountUp(end: number, duration = 2200) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setValue(end)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          observer.disconnect()
          const start = performance.now()
          const animate = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - (1 - progress) ** 3
            setValue(Math.round(eased * end))
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.4 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration])

  return { ref, value }
}

function StatItem({
  stat,
  index,
  isLast,
}: {
  stat: (typeof STATS)[number]
  index: number
  isLast: boolean
}) {
  const { ref, value: displayValue } = useCountUp(stat.value)

  return (
    <>
      <div
        ref={ref}
        className={`reveal stagger-${index + 1} flex flex-col items-center px-6 py-4`}
      >
        <p className="font-display text-4xl font-extrabold tabular-nums tracking-tight text-ink sm:text-5xl">
          {displayValue.toLocaleString()}
          <span className="text-2xl font-bold text-accent sm:text-3xl">{stat.suffix}</span>
        </p>
        <p className="mt-2 text-sm font-medium text-ink-muted">{stat.label}</p>
      </div>
      {!isLast && (
        <div className="hidden h-16 w-px self-center bg-line sm:block" aria-hidden="true" />
      )}
    </>
  )
}

export function Stats() {
  return (
    <section aria-labelledby="stats-heading" className="relative bg-surface py-16 sm:py-20">
      {/* ── Subtle radial glow ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="glow-pulse absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.04] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
        <div className="reveal-scale flex flex-wrap items-center justify-center gap-2 sm:gap-0">
          {STATS.map((stat, i) => (
            <StatItem
              key={stat.label}
              stat={stat}
              index={i}
              isLast={i === STATS.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}