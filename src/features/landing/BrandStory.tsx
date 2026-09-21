const PILLARS = [
  {
    title: 'Built Locally',
    description:
      'Made by people who live in real neighborhoods — not a distant corporate office. Every feature reflects what locals actually need.',
    stat: '10,000+',
    statLabel: 'Active members',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    gradient: 'from-brand-400 to-emerald-500',
  },
  {
    title: 'All in One',
    description:
      'Stays, food, nightlife, activities, services — one platform replaces a dozen apps. Stop switching, start exploring.',
    stat: '4',
    statLabel: 'Core categories',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
    gradient: 'from-cyan-400 to-blue-500',
  },
  {
    title: 'Always Current',
    description:
      'Real-time updates on events, openings, and community happenings — never miss what matters in your area.',
    stat: '50+',
    statLabel: 'Events this week',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    gradient: 'from-amber-400 to-orange-500',
  },
]

export function BrandStory() {
  return (
    <section aria-labelledby="story-heading" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="reveal text-center">
          <span className="inline-block rounded-full bg-accent-subtle px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
            Why Agora
          </span>
          <h2 id="story-heading" className="mt-5 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Built for people who love where they live
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg text-ink-muted">
            Not just another directory — a platform designed to help you get
            more out of your neighborhood every single day.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {PILLARS.map((pillar, i) => (
            <div
              key={pillar.title}
              className={`reveal stagger-${i + 1} group relative overflow-hidden rounded-2xl border border-line/60 bg-surface-elevated p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/[0.04]`}
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${pillar.gradient} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                {pillar.icon}
              </div>
              <h3 className="mt-6 font-display text-xl font-bold text-ink">
                {pillar.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {pillar.description}
              </p>
              <div className="mt-6 border-t border-line/60 pt-5">
                <p className="font-display text-2xl font-extrabold text-accent">
                  {pillar.stat}
                </p>
                <p className="text-xs font-medium text-ink-muted">{pillar.statLabel}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}