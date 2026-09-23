import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getPlaceBySlug } from '../../data/catalogue'
import { PLAN_DAY_LABELS, PLAN_DAYS, usePlan } from '../../hooks/usePlan'
import { useFavorites } from '../../hooks/useFavorites'

const PLAN_DAY_INTROS: Record<string, string> = {
  today: 'Seize the day — what gets you started?',
  tomorrow: 'Something to look forward to.',
  weekend: 'Slow mornings and long afternoons.',
}

export function PlannerPage() {
  const { favorites } = useFavorites()
  const { plan, setDay, clearDay } = usePlan()

  const saved = useMemo(
    () =>
      favorites
        .map((slug) => getPlaceBySlug(slug))
        .filter((p): p is NonNullable<typeof p> => Boolean(p)),
    [favorites],
  )

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (saved.length === 0) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
          Your notebook
        </p>
        <h1 className="mb-3 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          Plan your neighborhood days
        </h1>
        <p className="mb-6 max-w-xl text-ink-muted">
          Save spots you love from the map, then give each one a day worth filling.
        </p>
        <Link
          to="/explore"
          className="inline-flex items-center rounded-xl bg-accent px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-accent-dark"
        >
          Explore the neighborhood
        </Link>
      </main>
    )
  }

  const dayColumns = PLAN_DAYS.map((day) => ({
    day,
    label: PLAN_DAY_LABELS[day],
    spots: saved.filter((p) => plan[p.slug] === day),
  }))
  const planned = dayColumns.reduce((n, c) => n + c.spots.length, 0)
  const deciding = saved.filter((p) => !plan[p.slug])

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6">
      <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
        Your notebook
      </p>
      <h1 className="mb-3 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
        Plan your neighborhood days
      </h1>
      <p className="mb-10 text-ink-muted">
        Saved {saved.length} · planned {planned}
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {dayColumns.map((col) => (
          <section
            key={col.day}
            aria-labelledby={`plan-${col.day}`}
            className="rounded-2xl border border-line bg-surface/50 p-5"
          >
            <h2
              id={`plan-${col.day}`}
              className="mb-1 font-display text-xl font-bold text-ink"
            >
              {col.label}
            </h2>
            <p className="mb-4 text-xs text-ink-muted">{PLAN_DAY_INTROS[col.day]}</p>
            {col.spots.length === 0 ? (
              <p className="text-sm italic text-ink-muted/70">Nothing planned yet.</p>
            ) : (
              <ul className="space-y-3">
                {col.spots.map((p) => (
                  <li key={p.slug} className="flex flex-col gap-2">
                    <Link
                      to={`/place/${p.slug}`}
                      className="font-display text-lg font-bold text-ink transition-colors hover:text-accent"
                    >
                      {p.name}
                    </Link>
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                      {p.category}
                    </p>
                    <button
                      type="button"
                      onClick={() => clearDay(p.slug)}
                      aria-label={`Remove ${p.name} from ${col.label.toLowerCase()} plan`}
                      className="self-start rounded-lg px-2 py-1 text-xs font-bold text-ink-muted transition-colors hover:bg-danger/10 hover:text-danger"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      {deciding.length > 0 && (
        <section aria-labelledby="still-deciding" className="mt-12">
          <h2 id="still-deciding" className="mb-3 font-display text-2xl font-bold text-ink">
            Still deciding ({deciding.length})
          </h2>
          <p className="mb-5 max-w-lg text-sm text-ink-muted">
            These saved spots don&apos;t have a day yet. Give one a home.
          </p>
          <ul className="space-y-3">
            {deciding.map((p) => (
              <li
                key={p.slug}
                className="flex flex-col gap-3 rounded-xl border border-dashed border-line bg-surface/40 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <Link
                    to={`/place/${p.slug}`}
                    className="font-display text-lg font-bold text-ink transition-colors hover:text-accent"
                  >
                    {p.name}
                  </Link>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    {p.category}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {PLAN_DAYS.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setDay(p.slug, day)}
                      className="rounded-lg bg-accent/10 px-3 py-1.5 text-sm font-bold text-accent transition-colors hover:bg-accent hover:text-white"
                    >
                      {PLAN_DAY_LABELS[day]}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
