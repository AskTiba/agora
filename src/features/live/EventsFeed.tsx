import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  EVENTS,
  EVENT_WINDOWS,
  eventsForWindow,
  formatDayLabel,
  happeningNow,
  type EventItem,
  type EventsWindow,
} from '../../data/events'
import { getPlaceBySlug } from '../../data/places'

function EventCard({ event, today }: { event: EventItem; today: Date }) {
  const place = getPlaceBySlug(event.placeSlug)
  const live = happeningNow(event, today)

  return (
    <article className="reveal group relative flex flex-col overflow-hidden rounded-2xl border border-line/60 bg-surface-elevated transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-accent/[0.08]">
      {place && (
        <div className="relative h-36 overflow-hidden">
          <img
            src={place.image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute left-4 top-4 flex flex-col gap-2">
            <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink shadow-sm backdrop-blur-sm dark:bg-black/60 dark:text-white">
              {event.tag}
            </span>
            {live && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-warm px-3 py-1 text-xs font-bold text-ink shadow-sm dark:text-white">
                <span aria-hidden="true" className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
                </span>
                Live now
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent">
          <span className="tabular-nums">{formatDayLabel(event.weekday, today)}</span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-line" />
          <span className="tabular-nums">
            {event.startTime} – {event.endTime}
          </span>
        </p>
        <h3 className="mt-2 font-display text-lg font-bold text-ink transition-colors group-hover:text-accent">
          {event.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted line-clamp-3">
          {event.description}
        </p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <Link
            to={`/place/${event.placeSlug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-label={`View ${place?.name ?? event.placeSlug} for ${event.title}`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
              />
            </svg>
            {place?.name ?? event.placeSlug}
          </Link>
          <span className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-ink-muted">
            {event.price}
          </span>
        </div>
      </div>
    </article>
  )
}

export function EventsFeed() {
  const today = new Date()
  const [activeWindow, setActiveWindow] = useState<EventsWindow>('today')
  const displayed = eventsForWindow(EVENTS, activeWindow, today)

  return (
    <section aria-labelledby="events-heading" id="events" className="relative py-24 sm:py-32">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="reveal text-center">
          <span className="inline-block rounded-full bg-warm-subtle px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-warm dark:text-ink-muted">
            Happening
          </span>
          <h2
            id="events-heading"
            className="mt-5 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl"
          >
            What&rsquo;s happening in your neighborhood
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg text-ink-muted">
            From farmers markets to silent discos — drop into something that
            brings the whole community together.
          </p>
        </div>

        <div
          className="no-scrollbar reveal mx-auto mt-12 flex max-w-fit items-center gap-1 overflow-x-auto rounded-full border border-line bg-surface-elevated p-1 shadow-sm"
          role="tablist"
          aria-label="Filter events by day"
        >
          {EVENT_WINDOWS.map(({ key, label }) => {
            const isActive = activeWindow === key
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveWindow(key)}
                className={`whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  isActive
                    ? 'bg-accent text-white shadow-md shadow-accent/20'
                    : 'text-ink-muted hover:text-accent'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>

        <p aria-live="polite" className="mt-8 text-center text-sm font-medium text-ink-muted">
          {displayed.length} {displayed.length === 1 ? 'event' : 'events'} scheduled
        </p>

        {displayed.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-4 text-center">
            <p className="text-ink-muted">
              Nothing scheduled for this window — check another day.
            </p>
            <button
              type="button"
              onClick={() => setActiveWindow('weekend')}
              className="rounded-full border border-line bg-surface-elevated px-6 py-3 font-semibold text-accent transition-colors hover:border-accent/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              See the upcoming weekend
            </button>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayed.map((event, i) => (
              <div key={event.slug} className={`reveal stagger-${(i % 3) + 1}`}>
                <EventCard event={event} today={today} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}