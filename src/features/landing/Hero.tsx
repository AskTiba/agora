export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-950">
      {/* ── Parallax floating shapes ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="parallax-slow absolute -left-32 top-[10%] h-[500px] w-[500px] rounded-full bg-white/[0.04] blur-[100px]" />
        <div className="parallax-medium absolute right-[-5%] top-[25%] h-[400px] w-[400px] rounded-full bg-brand-400/[0.06] blur-[80px]" />
        <div className="parallax-fast absolute bottom-[10%] left-[20%] h-[300px] w-[300px] rounded-full bg-warm/[0.04] blur-[60px]" />

        <div className="float-slow absolute left-[12%] top-[18%] h-3 w-3 rotate-45 rounded-sm bg-white/10" />
        <div className="float-medium absolute right-[18%] top-[35%] h-2.5 w-2.5 rounded-full bg-brand-400/20" />
        <div className="float-fast absolute left-[65%] top-[60%] h-4 w-4 rotate-12 rounded-sm bg-white/[0.06]" />
        <div className="float-slow absolute left-[8%] top-[65%] h-2 w-2 rounded-full bg-warm/15" />
        <div className="float-medium absolute right-[8%] top-[15%] h-3.5 w-3.5 rotate-45 rounded-sm bg-brand-300/10" />
      </div>

      {/* ── Radial glow ── */}
      <div
        aria-hidden="true"
        className="glow-pulse pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(110,231,183,0.18),transparent)]"
      />

      {/* ── Grid pattern ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-28 text-center sm:px-6 sm:py-36 lg:py-44">
        {/* ── Badge ── */}
        <div className="reveal stagger-1 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.08] px-5 py-2 text-sm font-medium text-white shadow-lg shadow-black/10 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-400" />
          </span>
          Your local town square
        </div>

        {/* ── Heading ── */}
        <h1 className="reveal stagger-2 mx-auto mt-8 max-w-4xl text-balance font-display text-5xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
          <span className="gradient-text">Find everything</span>
          <br />
          <span className="text-white/95">in your neighborhood</span>
        </h1>

        {/* ── Subtitle ── */}
        <p className="reveal stagger-3 mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-pretty text-white/75">
          Stays, food, nightlife, activities, and essential services — all reviewed
          by your community, all in one place.
        </p>

        {/* ── CTAs ── */}
        <div className="reveal stagger-4 mt-11 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#explore"
            className="group relative overflow-hidden rounded-full bg-warm px-9 py-4 text-sm font-semibold text-white shadow-xl shadow-warm/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-warm-hover hover:shadow-2xl hover:shadow-warm/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warm"
          >
            <span className="relative z-10 flex items-center gap-2">
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

        {/* ── Trust badges ── */}
        <div className="reveal stagger-5 mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-white/60">
          {['Free to use', 'No sign-up required', 'Community-driven'].map((t) => (
            <span key={t} className="flex items-center gap-2">
              <svg className="h-4 w-4 text-brand-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              {t}
            </span>
          ))}
        </div>

        {/* ── Scroll indicator ── */}
        <div className="reveal stagger-6 mt-20 flex justify-center">
          <div className="bounce-scroll flex h-12 w-7 items-start justify-center rounded-full border-2 border-white/20 p-1.5">
            <div className="h-2.5 w-1 animate-pulse rounded-full bg-white/40" />
          </div>
        </div>
      </div>
    </section>
  )
}