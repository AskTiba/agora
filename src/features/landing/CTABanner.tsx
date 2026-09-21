export function CTABanner() {
  return (
    <section aria-labelledby="cta-heading" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="reveal-scale relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-950 px-8 py-20 text-center sm:px-16">
          {/* ── Parallax decoration ── */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="parallax-slow absolute -left-20 top-10 h-64 w-64 rounded-full bg-white/[0.04] blur-[60px]" />
            <div className="parallax-medium absolute bottom-0 right-10 h-48 w-48 rounded-full bg-warm/[0.06] blur-[50px]" />
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
                backgroundSize: '48px 48px',
              }}
            />
          </div>

          <div className="relative">
            <h2
              id="cta-heading"
              className="mx-auto max-w-2xl text-balance font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl"
            >
              Your neighborhood is waiting
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-lg text-white/80">
              Start discovering local spots, events, and services — all
              curated by your community.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#explore"
                className="group relative overflow-hidden rounded-full bg-warm px-9 py-4 text-sm font-semibold text-white shadow-xl shadow-warm/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-warm-hover hover:shadow-2xl hover:shadow-warm/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warm"
              >
                <span className="flex items-center gap-2">
                  Start Exploring
                  <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </span>
              </a>
              <a
                href="#features"
                className="glass rounded-full px-9 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/[0.12] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                See How It Works
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}