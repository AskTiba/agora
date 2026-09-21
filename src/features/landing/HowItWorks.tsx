const STEPS = [
  {
    number: '01',
    title: 'Browse',
    description: 'Explore curated categories or search directly — cafés, parks, clinics, events, all in one place.',
    visual: (
      <div className="relative flex h-40 items-center justify-center">
        {/* ── Search bar mockup ── */}
        <div className="w-full max-w-[200px] rounded-xl border border-line bg-surface-elevated p-3 shadow-lg">
          <div className="flex items-center gap-2 rounded-lg bg-surface px-3 py-2">
            <svg className="h-4 w-4 text-ink-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <span className="text-xs text-ink-muted">Search places...</span>
          </div>
          <div className="mt-2 space-y-1.5">
            {['Cafés nearby', 'Live music', 'Parks'].map((t) => (
              <div key={t} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] text-ink-muted hover:bg-accent/5">
                <span className="h-1 w-1 rounded-full bg-accent/40" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    number: '02',
    title: 'Discover',
    description: 'Dive into details — photos, ratings, reviews, hours, and insider tips from real locals.',
    visual: (
      <div className="relative flex h-40 items-center justify-center">
        {/* ── Card mockup ── */}
        <div className="w-full max-w-[200px] overflow-hidden rounded-xl border border-line bg-surface-elevated shadow-lg">
          <div className="h-16 bg-gradient-to-br from-brand-400 to-emerald-600" />
          <div className="p-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="h-2.5 w-2.5 text-warm" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102 1.106 4.637c.194.813.691 1.456 1.405 1.456.714 0 1.211-.643 1.406-1.456l1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                </svg>
              ))}
              <span className="ml-1 text-[10px] text-ink-muted">4.8</span>
            </div>
            <p className="mt-1 text-xs font-semibold text-ink">The Green Leaf</p>
            <p className="text-[10px] text-ink-muted">Open until 10pm</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    number: '03',
    title: 'Connect',
    description: 'Visit, book, or join — seamless links to reservations, directions, and community events.',
    visual: (
      <div className="relative flex h-40 items-center justify-center">
        {/* ── Action buttons mockup ── */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-white shadow-md shadow-accent/20">
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            Get Directions
          </div>
          <div className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs font-semibold text-ink">
            <svg className="h-3 w-3 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            Reserve Table
          </div>
        </div>
      </div>
    ),
  },
]

export function HowItWorks() {
  return (
    <section aria-labelledby="how-heading" className="relative overflow-hidden bg-gradient-to-b from-surface via-surface to-surface-elevated py-24 sm:py-32">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="reveal text-center">
          <span className="inline-block rounded-full bg-accent-subtle px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
            How it works
          </span>
          <h2 id="how-heading" className="mt-5 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Three steps to your next discovery
          </h2>
        </div>

        <div className="relative mt-16">
          {/* ── Connecting line (desktop) ── */}
          <div aria-hidden="true" className="absolute top-28 left-[20%] hidden h-px w-[60%] lg:block">
            <div className="h-full bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
            {/* ── Animated dot on line ── */}
            <div className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-accent/60" style={{ animation: 'float 4s ease-in-out infinite' }} />
          </div>

          <div className="grid gap-10 lg:grid-cols-3 lg:gap-8">
            {STEPS.map((step, i) => (
              <div key={step.number} className={`reveal stagger-${i + 1} relative`}>
                {/* ── Visual ── */}
                <div className="relative mx-auto mb-6 overflow-hidden rounded-2xl border border-line/40 bg-surface-elevated/60 backdrop-blur-sm">
                  {step.visual}
                  {/* ── Step number badge ── */}
                  <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-white shadow-lg shadow-accent/20">
                    {step.number}
                  </div>
                </div>

                {/* ── Text ── */}
                <div className="text-center">
                  <h3 className="font-display text-xl font-bold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}