const TESTIMONIALS = [
  {
    quote:
      "I used to spend 20 minutes jumping between apps to find a place to eat. Now I just open Agora — it's everything my neighborhood offers, all in one view.",
    name: 'Sarah K.',
    role: 'Local resident',
    initials: 'SK',
    rating: 5,
    gradient: 'from-brand-400 to-emerald-500',
  },
  {
    quote:
      "As a café owner, Agora brings me customers who actually care about quality. The community features helped me host my first sold-out event.",
    name: 'Marco L.',
    role: 'Café owner',
    initials: 'ML',
    rating: 5,
    gradient: 'from-amber-400 to-orange-500',
  },
  {
    quote:
      "I moved here six months ago and felt completely lost. Agora connected me with hiking groups, book clubs, and neighbors who became real friends.",
    name: 'Priya M.',
    role: 'Activity enthusiast',
    initials: 'PM',
    rating: 5,
    gradient: 'from-violet-400 to-purple-500',
  },
]

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="h-4 w-4 text-warm" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102 1.106 4.637c.194.813.691 1.456 1.405 1.456.714 0 1.211-.643 1.406-1.456l1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
        </svg>
      ))}
    </div>
  )
}

export function Testimonials() {
  return (
    <section aria-labelledby="testimonials-heading" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="reveal text-center">
          <span className="inline-block rounded-full bg-accent-subtle px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
            Testimonials
          </span>
          <h2 id="testimonials-heading" className="mt-5 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Loved by locals and businesses
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg text-ink-muted">
            Real stories from real people in the Agora community.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <blockquote
              key={t.name}
              className={`reveal stagger-${i + 1} group relative overflow-hidden rounded-2xl border border-line/60 bg-surface-elevated p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/[0.04]`}
            >
              <div className="absolute right-6 top-6 text-6xl font-display font-bold text-accent/[0.06] leading-none transition-colors group-hover:text-accent/[0.1]">
                &ldquo;
              </div>
              <StarRating count={t.rating} />
              <p className="relative mt-4 text-sm leading-relaxed text-ink">
                {t.quote}
              </p>
              <div className="relative mt-6 flex items-center gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${t.gradient} text-xs font-bold text-white shadow-md`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{t.name}</p>
                  <p className="text-xs text-ink-muted">{t.role}</p>
                </div>
              </div>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}