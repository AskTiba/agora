import type { Place } from '../../data/places'

const MAX_PINS = 24

function MapBackdrop() {
  return (
    <svg
      aria-hidden="true"
      preserveAspectRatio="none"
      viewBox="0 0 800 500"
      className="pointer-events-none absolute inset-0 h-full w-full text-line"
    >
      <ellipse cx={120} cy={250} rx={100} ry={62} className="fill-brand-200/40 dark:fill-brand-900/40" />
      <ellipse cx={690} cy={140} rx={120} ry={72} className="fill-brand-200/40 dark:fill-brand-900/40" />
      <ellipse cx={640} cy={440} rx={85} ry={52} className="fill-brand-200/40 dark:fill-brand-900/40" />
      <path
        d="M-30 470 C 140 415, 185 325, 305 300 S 610 245, 835 150"
        fill="none"
        stroke="currentColor"
        strokeWidth={16}
        strokeLinecap="round"
        opacity={0.35}
      />
      <circle cx={405} cy={250} r={46} className="fill-accent/10" />
      <circle
        cx={405}
        cy={250}
        r={46}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        opacity={0.45}
        strokeDasharray="6 8"
      />
      <path d="M 305 300 L 720 60" fill="none" stroke="currentColor" strokeWidth={3} opacity={0.5} />
      <path d="M 40 120 L 760 200" fill="none" stroke="currentColor" strokeWidth={2} opacity={0.4} />
      <path d="M 380 30 L 320 360 L 60 320" fill="none" stroke="currentColor" strokeWidth={2} opacity={0.4} />
    </svg>
  )
}

function MapPin({ place, onSelect }: { place: Place; onSelect: (place: Place) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(place)}
      style={{ left: `${place.map.x}%`, top: `${place.map.y}%` }}
      aria-label={`Show ${place.name} on map`}
      className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <span className="relative flex h-5 w-5 items-center justify-center">
        <span aria-hidden="true" className="absolute inline-flex h-5 w-5 rounded-full bg-accent/25" />
        <span
          aria-hidden="true"
          className="relative inline-flex h-3 w-3 rounded-full border-2 border-white bg-accent shadow-md dark:border-surface-elevated"
        />
      </span>
      <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-line bg-surface-elevated px-2.5 py-1.5 text-xs font-semibold text-ink opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 sm:inline-flex sm:items-center sm:gap-1.5">
        {place.name}
        <span className="font-medium text-accent">★ {place.rating}</span>
      </span>
    </button>
  )
}

export function ExploreMap({
  places,
  onSelect,
}: {
  places: Place[]
  onSelect: (place: Place) => void
}) {
  const shown = places.slice(0, MAX_PINS)
  const capped = places.length > shown.length

  return (
    <div className="mt-8 overflow-hidden rounded-3xl border border-line/60 bg-surface-elevated shadow-xl shadow-accent/[0.03]">
      <div className="flex items-center justify-between gap-4 border-b border-line/60 px-5 py-3.5">
        <p className="flex items-center gap-2 text-sm font-semibold text-ink">
          <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
            />
          </svg>
          Live map
        </p>
        <p className="text-xs font-medium text-ink-muted">
          {places.length} {places.length === 1 ? 'place' : 'places'} pinned
        </p>
      </div>
      <div
        className="relative aspect-[4/3] w-full sm:aspect-[16/9]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgb(94 140 120 / 0.07) 1px, transparent 1px), linear-gradient(to bottom, rgb(94 140 120 / 0.07) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}
      >
        <MapBackdrop />
        {shown.map((place) => (
          <MapPin key={place.slug} place={place} onSelect={onSelect} />
        ))}
        {capped && (
          <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-line bg-surface-elevated/95 px-4 py-2 text-xs font-medium text-ink-muted shadow-lg backdrop-blur">
            Showing {shown.length} of {places.length} pins — load more to reveal them all
          </div>
        )}
      </div>
    </div>
  )
}