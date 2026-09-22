import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import type { Place } from '../../data/places'

interface PlaceModalProps {
  place: Place
  onClose: () => void
}

export function PlaceModal({ place, onClose }: PlaceModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previous = document.activeElement as HTMLElement
    closeRef.current?.focus()
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      previous?.focus()
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6"
      aria-labelledby="place-modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* ── Backdrop ── */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── Dialog ── */}
      <div className="reveal-scale relative z-10 max-h-[92vh] w-full max-w-lg overflow-hidden rounded-t-3xl bg-surface shadow-2xl sm:rounded-3xl">
        {/* ── Header image ── */}
        <div className="relative h-56 overflow-hidden">
          <img src={place.image} alt={place.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-black/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="absolute left-5 right-5 bottom-4">
            <span className="inline-block rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink shadow-sm dark:bg-black/60 dark:text-white">
              {place.tag}
            </span>
            <h3
              id="place-modal-title"
              className="mt-3 font-display text-2xl font-extrabold tracking-tight text-white"
            >
              {place.name}
            </h3>
            <div className="mt-2 flex items-center gap-2 text-sm text-white/90">
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4 text-warm" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102 1.106 4.637c.194.813.691 1.456 1.405 1.456.714 0 1.211-.643 1.406-1.456l1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                </svg>
                {place.rating}
              </span>
              <span className="text-white/60">({place.reviews} reviews)</span>
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs backdrop-blur-md">{place.price}</span>
            </div>
          </div>
        </div>

        {/* ── Detail body ── */}
        <div className="max-h-[calc(92vh-14rem)] overflow-y-auto p-5">
          <p className="text-sm leading-relaxed text-ink-muted">{place.description}</p>

          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3.75 0c0 6.63-7.5 12-7.5 12s-7.5-5.37-7.5-12a7.5 7.5 0 1115 0z" />
              </svg>
              <dd className="text-ink">{place.address}</dd>
            </div>
            <div className="flex items-start gap-3">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <dd className="text-ink">{place.hours}</dd>
            </div>
            <div className="flex items-start gap-3">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              <dd className="text-ink">{place.phone}</dd>
            </div>
          </dl>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Link
              to={`/place/${place.slug}`}
              className="flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-md shadow-accent/20 transition-all hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Open Full Page
            </Link>
            <a
              href={`#${place.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="flex items-center justify-center gap-2 rounded-full border border-line bg-surface-elevated px-5 py-3 text-sm font-semibold text-ink transition-all hover:border-accent/40 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Get Directions
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}