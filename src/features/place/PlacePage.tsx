import { Link, useParams } from 'react-router-dom'
import { getPlaceBySlug, getRelated } from '../../data/places'

export function PlacePage() {
  const { slug } = useParams<{ slug: string }>()
  const place = slug ? getPlaceBySlug(slug) : undefined

  if (!place) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-32 text-center sm:px-6">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">
          Place not found
        </h1>
        <p className="mt-3 text-ink-muted">
          This place may have moved or no longer exists.
        </p>
        <Link
          to="/"
          className="mt-8 inline-block rounded-full bg-accent px-8 py-3 text-sm font-semibold text-white shadow-md shadow-accent/20 transition-all hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Back to Explore
        </Link>
      </section>
    )
  }

  const related = getRelated(place.slug)

  return (
    <div className="overflow-hidden bg-surface">
      {/* ── Hero image ── */}
      <div className="relative h-[45vh] min-h-[320px] max-h-[520px] overflow-hidden">
        <img src={place.image} alt={place.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* ── Back link ── */}
        <Link
          to="/#explore"
          className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/50 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-black/70 sm:left-6 sm:top-6"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Explore
        </Link>

        {/* ── Title overlay ── */}
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
            <span className="inline-block rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink shadow-sm dark:bg-black/60 dark:text-white">
              {place.tag}
            </span>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                {place.name}
              </h1>
              <span className="rounded-full bg-warm px-2.5 py-0.5 text-sm font-bold text-white">
                {place.price}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-white/90">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-warm">
                {place.category}
              </span>
              <span className="text-white/40">·</span>
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4 text-warm" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102 1.106 4.637c.194.813.691 1.456 1.405 1.456.714 0 1.211-.643 1.406-1.456l1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                </svg>
                {place.rating}
              </span>
              <span className="text-white/60">({place.reviews} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* ── Main column ── */}
          <div className="lg:col-span-2">
            <div className="reveal">
              <h2 className="font-display text-xl font-bold text-ink">About this place</h2>
              <p className="mt-3 leading-relaxed text-ink-muted">
                {place.description}
              </p>
              <p className="mt-4 leading-relaxed text-ink-muted">
                Whether you&apos;re a long-time local or just passing through, this
                spot is loved by the community for a reason. Swing by during the
                hours below, or plan a visit with the details on this page.
              </p>
            </div>

            {/* ── Reviews ── */}
            <div className="reveal mt-12">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-ink">Reviews</h2>
                <span className="rounded-full bg-accent-subtle px-3 py-1 text-xs font-semibold text-accent dark:text-brand-300">
                  {place.rating} / 5
                </span>
              </div>
              <div className="mt-5 space-y-4">
                {[
                  {
                    name: 'Amara D.',
                    text: 'A neighborhood gem. Great experience from start to finish — will definitely be back.',
                    rating: 5,
                  },
                  {
                    name: 'Noah T.',
                    text: 'Consistently great. Easy to find, friendly staff, and fair prices for the quality.',
                    rating: 4,
                  },
                  {
                    name: 'Lena M.',
                    text: 'This is exactly why I love living here — places like this make the area special.',
                    rating: 5,
                  },
                ].map((review) => (
                  <blockquote
                    key={review.name}
                    className="rounded-2xl border border-line/60 bg-surface-elevated p-5"
                  >
                    <div className="flex gap-0.5">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <svg key={i} className="h-3.5 w-3.5 text-warm" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102 1.106 4.637c.194.813.691 1.456 1.405 1.456.714 0 1.211-.643 1.406-1.456l1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                        </svg>
                      ))}
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-ink">&ldquo;{review.text}&rdquo;</p>
                    <p className="mt-3 text-xs font-semibold text-ink-muted">{review.name}</p>
                  </blockquote>
                ))}
              </div>
            </div>
          </div>

          {/* ── Info sidebar ── */}
          <aside className="lg:col-span-1">
            <div className="reveal sticky top-24 space-y-4">
              <div className="rounded-2xl border border-line/60 bg-surface-elevated p-6">
                <h2 className="font-display text-sm font-bold uppercase tracking-widest text-ink">
                  Details
                </h2>
                <dl className="mt-4 space-y-4 text-sm">
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
                  <div className="flex items-start gap-3">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>
                    <dd className="text-ink">{place.website}</dd>
                  </div>
                </dl>
              </div>

              <div className="flex flex-col gap-3">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(place.address)}`}
                  className="flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-accent/20 transition-all hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3.75 0c0 6.63-7.5 12-7.5 12s-7.5-5.37-7.5-12a7.5 7.5 0 1115 0z" />
                  </svg>
                  Get Directions
                </a>
                <a
                  href={place.website}
                  className="flex items-center justify-center gap-2 rounded-full border border-line bg-surface-elevated px-6 py-3.5 text-sm font-semibold text-ink transition-all hover:border-accent/40 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Visit Website
                </a>
              </div>
            </div>
          </aside>
        </div>

        {/* ── Related places ── */}
        <div className="reveal mt-16 lg:mt-20">
          <h2 className="font-display text-2xl font-bold text-ink">You might also like</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((other) => (
              <Link
                key={other.slug}
                to={`/place/${other.slug}`}
                className="group overflow-hidden rounded-2xl border border-line/60 bg-surface-elevated transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={other.image}
                    alt={other.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute right-3 top-3 rounded-full bg-black/50 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-md">
                    {other.rating} ★
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-base font-bold text-ink transition-colors group-hover:text-accent">
                    {other.name}
                  </h3>
                  <p className="mt-1 text-xs font-medium uppercase tracking-widest text-accent">
                    {other.category}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}