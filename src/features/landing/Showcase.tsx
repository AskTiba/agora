import { useState } from 'react'
import { CATEGORIES, type Place } from '../../data/places'
import { useFavorites } from '../../hooks/useFavorites'
import { useCatalogue } from '../../hooks/useCatalogue'
import { PlaceModal } from './PlaceModal'
import { ExploreMap } from './ExploreMap'

const INITIAL_VISIBLE = 8
const PAGE_SIZE = 8

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </svg>
  )
}

function PlaceCard({
  place,
  index,
  onOpen,
  isFavorite,
  onToggleFavorite,
}: {
  place: Place
  index: number
  onOpen: () => void
  isFavorite: boolean
  onToggleFavorite: () => void
}) {
  return (
    <article
      className={`reveal stagger-${(index % 4) + 1} group relative overflow-hidden rounded-2xl border border-line/60 bg-surface-elevated transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent/[0.08]`}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`View details for ${place.name}`}
        className="block w-full text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {/* ── Image area ── */}
        <div className="relative h-52 overflow-hidden bg-surface-elevated">
          <img
            src={place.image}
            alt={place.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink shadow-sm backdrop-blur-sm dark:bg-black/60 dark:text-white">
            {place.tag}
          </span>

          <span className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
            <svg className="h-3 w-3 text-warm" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102 1.106 4.637c.194.813.691 1.456 1.405 1.456.714 0 1.211-.643 1.406-1.456l1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
            </svg>
            {place.rating}
            <span className="text-white/50">({place.reviews})</span>
          </span>
        </div>

        {/* ── Content ── */}
        <div className="p-5">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-accent dark:text-brand-300">
            {place.category}
          </span>
          <h3 className="mt-1.5 font-display text-lg font-bold text-ink transition-colors group-hover:text-accent">
            {place.name}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted line-clamp-2">
            {place.description}
          </p>
          <span className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-accent opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
            View details
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </div>
      </button>

      {/* ── Favorites toggle ── */}
      <button
        type="button"
        onClick={onToggleFavorite}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? `Remove ${place.name} from favorites` : `Add ${place.name} to favorites`}
        className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white shadow-md backdrop-blur-md transition-all duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warm"
      >
        <svg
          className={`h-4 w-4 ${isFavorite ? 'text-warm' : 'text-white'}`}
          fill={isFavorite ? 'currentColor' : 'none'}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      </button>
    </article>
  )
}

export function Showcase() {
  const { places } = useCatalogue()
  const { favorites, toggleFavorite, isFavorite } = useFavorites()
  const [activeCategory, setActiveCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE)
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)

  const normalized = query.trim().toLowerCase()

  const filtered = places.filter((place) => {
    if (activeCategory !== 'All' && place.category !== activeCategory) return false
    if (favoritesOnly && !isFavorite(place.slug)) return false
    if (normalized) {
      const haystack = `${place.name} ${place.category} ${place.tags.join(' ')}`.toLowerCase()
      if (!haystack.includes(normalized)) return false
    }
    return true
  })

  const visible = filtered.slice(0, visibleCount)
  const hasMore = filtered.length > visible.length

  const selectCategory = (category: string) => {
    setActiveCategory(category)
    setVisibleCount(INITIAL_VISIBLE)
  }

  const updateQuery = (value: string) => {
    setQuery(value)
    setVisibleCount(INITIAL_VISIBLE)
  }

  const resetFilters = () => {
    setActiveCategory('All')
    setQuery('')
    setFavoritesOnly(false)
    setVisibleCount(INITIAL_VISIBLE)
  }

  return (
    <section aria-labelledby="showcase-heading" id="explore" className="relative overflow-hidden bg-gradient-to-b from-surface-elevated via-surface to-surface py-24 sm:py-32">
      {/* ── Decorative glow ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="glow-pulse absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-accent/[0.03] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="reveal text-center">
          <span className="inline-block rounded-full bg-accent-subtle px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent dark:text-brand-300">
            Explore
          </span>
          <h2 id="showcase-heading" className="mt-5 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Your neighborhood, one search away
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg text-ink-muted">
            Search, filter, and pin down your next favorite spot — then favorite
            the ones worth coming back for.
          </p>

          <p className="mx-auto mt-4 max-w-xl text-sm text-ink-muted">
            {places.length} spots across {CATEGORIES.length - 1} categories — and counting.
          </p>
        </div>

        {/* ── Search + favorites ── */}
        <div className="reveal mx-auto mt-10 flex max-w-2xl flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted" />
            <input
              type="search"
              value={query}
              onChange={(event) => updateQuery(event.target.value)}
              placeholder="Search by name, vibe, or activity — e.g. chess, luwombo, marathon…"
              aria-label="Search places"
              className="w-full rounded-full border border-line bg-surface-elevated py-3.5 pl-12 pr-11 text-ink shadow-sm outline-none transition-all placeholder:text-ink-muted/70 focus:border-accent/50 focus:ring-2 focus:ring-accent/30"
            />
            {normalized && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => updateQuery('')}
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-line hover:text-ink"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <button
            type="button"
            aria-pressed={favoritesOnly}
            aria-label="Filter to favorites"
            onClick={() => setFavoritesOnly((prev) => !prev)}
            className={`flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warm ${
              favoritesOnly
                ? 'bg-warm text-ink shadow-md shadow-warm/20 dark:text-white'
                : 'border border-line bg-surface-elevated text-ink-muted hover:border-warm/40 hover:text-warm'
            }`}
          >
            <svg
              className={`h-4 w-4 ${favoritesOnly ? 'fill-current' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
            Favorites
            {favorites.length > 0 && <span aria-hidden="true">({favorites.length})</span>}
          </button>
        </div>

        {/* ── Category filter tabs ── */}
        <div className="no-scrollbar reveal mt-8 flex max-w-full items-center gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center sm:overflow-visible" role="tablist" aria-label="Filter places by category">
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => selectCategory(category)}
                className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  isActive
                    ? 'bg-accent text-white shadow-md shadow-accent/20'
                    : 'border border-line bg-surface-elevated text-ink-muted hover:border-accent/40 hover:text-accent'
                }`}
              >
                {category}
              </button>
            )
          })}
        </div>

        <p aria-live="polite" className="mt-8 text-center text-sm font-medium text-ink-muted">
          {filtered.length} {filtered.length === 1 ? 'place' : 'places'} found
        </p>

        {filtered.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-4 text-center">
            <p className="text-ink-muted">
              No places match your current search and filters.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-full bg-accent px-6 py-3 font-semibold text-white shadow-lg shadow-accent/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <ExploreMap places={visible} onSelect={setSelectedPlace} />

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {visible.map((place, i) => (
                <PlaceCard
                  key={place.slug}
                  place={place}
                  index={i}
                  onOpen={() => setSelectedPlace(place)}
                  isFavorite={isFavorite(place.slug)}
                  onToggleFavorite={() => toggleFavorite(place.slug)}
                />
              ))}
            </div>

            {hasMore && (
              <div className="mt-14 flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                  className="rounded-full bg-accent px-8 py-3.5 font-semibold text-white shadow-lg shadow-accent/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Load more places
                </button>
                <p className="text-sm text-ink-muted" aria-live="polite">
                  Showing {visible.length} of {filtered.length} places
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {selectedPlace && (
        <PlaceModal place={selectedPlace} onClose={() => setSelectedPlace(null)} />
      )}
    </section>
  )
}