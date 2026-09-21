const PLACES = [
  {
    name: 'The Green Leaf Café',
    category: 'Food & Nightlife',
    rating: 4.8,
    reviews: 124,
    description: 'Artisan coffee and farm-to-table brunch in the heart of downtown.',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop&q=80',
    tag: 'Popular',
  },
  {
    name: 'Riverside Park',
    category: 'Activities',
    rating: 4.9,
    reviews: 312,
    description: 'Scenic trails, kayak rentals, and a weekend farmers market.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&q=80',
    tag: 'Trending',
  },
  {
    name: 'The Grand Hotel',
    category: 'Stays & Places',
    rating: 4.7,
    reviews: 89,
    description: 'Boutique lodging with rooftop views and local art installations.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop&q=80',
    tag: 'Featured',
  },
  {
    name: 'Nightowl Jazz Bar',
    category: 'Food & Nightlife',
    rating: 4.6,
    reviews: 67,
    description: 'Live jazz, craft cocktails, and late-night bites every Friday.',
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&h=400&fit=crop&q=80',
    tag: 'New',
  },
]

function PlaceCard({
  place,
  index,
}: {
  place: (typeof PLACES)[number]
  index: number
}) {
  return (
    <article
      className={`reveal stagger-${index + 1} group relative overflow-hidden rounded-2xl border border-line/60 bg-surface-elevated transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent/[0.08]`}
    >
      {/* ── Image area ── */}
      <div className="relative h-52 overflow-hidden bg-surface-elevated">
        <img
          src={place.image}
          alt={place.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        <div className="absolute left-4 top-4 z-10">
          <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink shadow-sm backdrop-blur-sm dark:bg-black/60 dark:text-white">
            {place.tag}
          </span>
        </div>

        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
          <svg className="h-3 w-3 text-warm" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102 1.106 4.637c.194.813.691 1.456 1.405 1.456.714 0 1.211-.643 1.406-1.456l1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
          </svg>
          <span>{place.rating}</span>
          <span className="text-white/50">({place.reviews})</span>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="p-5">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-accent">
          {place.category}
        </span>
        <h3 className="mt-1.5 font-display text-lg font-bold text-ink transition-colors group-hover:text-accent">
          {place.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted line-clamp-2">
          {place.description}
        </p>
        <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-accent opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
          View details
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>
    </article>
  )
}

export function Showcase() {
  return (
    <section aria-labelledby="showcase-heading" id="explore" className="relative overflow-hidden bg-gradient-to-b from-surface-elevated via-surface to-surface py-24 sm:py-32">
      {/* ── Decorative glow ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="glow-pulse absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-accent/[0.03] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="reveal text-center">
          <span className="inline-block rounded-full bg-accent-subtle px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
            Explore
          </span>
          <h2 id="showcase-heading" className="mt-5 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Places waiting for you
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg text-ink-muted">
            A glimpse of what your community has to offer — real places, real
            reviews, real experiences.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PLACES.map((place, i) => (
            <PlaceCard key={place.name} place={place} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}