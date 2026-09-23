# Architecture — Agora

Technical overview of the Agora frontend application: stack rationale, project layout,
theming conventions, and the current domain model.

## Stack Rationale

| Layer | Choice | Why |
| --- | --- | --- |
| **Language** | TypeScript | Static typing across the codebase; `verbatimModuleSyntax` + `erasableSyntaxOnly` enforce erasable, forward-compatible syntax (no enums/namespaces, explicit type-only imports). |
| **UI library** | React 19 | Mature component model, large ecosystem, `react-jsx` transform (no runtime import needed). |
| **Routing** | react-router-dom v7 | `createBrowserRouter` with a single `AppShell` layout route; `Link`s + a hash-scroll effect give cross-route navigation. |
| **Build tool** | Vite 8 | Instant cold starts and sub-50ms HMR; `tsc -b` type-checks before bundling so the build fails on type errors. |
| **Styling** | Tailwind CSS v4 | Utility-first CSS with `@theme` design tokens compiled at build time; single `@import "tailwindcss"` entry — no `tailwind.config.js`. |
| **Linting** | Oxlint | Rust-powered, near-instant linting with React + TypeScript + Oxc rules. |
| **Testing** | Vitest + RTL | Integration-heavy tests in jsdom (`vitest.config.ts`); `@testing-library/user-event` + jest-dom matchers. |
| **Package manager** | pnpm | Strict dependency resolution and a shared content-addressed store — saves disk space and speeds installs. |

## Current Project Layout

```
src/
├── app/              # App shell: AppShell (Header + main<Outlet/> + Footer)
├── components/       # Shared UI: Header, Footer, ThemeToggle
├── data/             # Domain fixtures + accessors (places.ts, events.ts)
├── features/         # Feature slices
│   ├── landing/      #   Landing page: Hero, Showcase (search/map/tabs), Features, Brand-community, HowItWorks, Testimonials, CTA
│   ├── live/         #   "What's Happening Today" day-windowed feed
│   ├── place/        #   /place/:slug detail page
│   └── plan/         #   /plan favorites planner dashboard
├── hooks/            # useFavorites, usePlan, useTheme, useScrollReveal
├── test/             # Vitest setup (jest-dom, cleanup)
├── App.tsx           # Route table (createBrowserRouter)
├── index.css         # Tailwind v4 import + @theme tokens + animation utilities
└── main.tsx          # React DOM root, StrictMode wrapper
```

## Build & TypeScript Pipeline

```
tsc -b ──► vite build
   │            │
   ├─ App refs  └─ Bundles src/ → dist/ (esbuild/Rollup under the hood)
   └─ tsconfig.json → tsconfig.app.json
```

- `tsconfig.json` is the solution file referencing `tsconfig.app.json` (app) and
  `tsconfig.node.json` (config tooling).
- App settings target **ES2023**, use bundler module resolution, and enable strict
  unused-locals/parameters checks — unused code fails the build.
- Vite is configured in `vite.config.ts` with `@vitejs/plugin-react` and
  `@tailwindcss/vite`.

## Theming Conventions

Tailwind v4 is configured entirely in CSS via `src/index.css`. The `@theme` block defines
the full palette and semantic tokens (`--color-brand-50..900`, `--color-surface`,
`--color-surface-elevated`, `--color-ink`, `--color-ink-muted`, `--color-line`,
`--color-accent`, `--color-accent-hover`, `--color-accent-subtle`, `--color-warm`,
`--color-warm-subtle`). Dark mode is a `.dark` class on `<html>` re-declaring the
semantic tokens (`src/index.css:35-49`), matched by the `@variant dark` at the top:

```css
@import "tailwindcss";
@variant dark (&:where(.dark, .dark *));

@theme {
  --color-accent: #059669;        /* light-mode accent */
  ...
}

.dark {
  --color-accent: #047857;        /* dark-mode accent override */
}
```

- Tokens become usable as `bg-surface`, `text-ink-muted`, `text-accent`, `bg-warm-subtle`.
- **Never hardcode raw hex values in components** — extend `@theme` instead.
- The theme is driven by `useTheme` (`src/hooks/useTheme.ts`): `system`/`light`/`dark`,
  persisting to `localStorage` under the `theme` key and reacting to OS changes via
  `matchMedia`.
- Animation utilities (scroll reveal, parallax, float, glow, stagger) live in
  `src/index.css`; `useScrollReveal` drives reveals via IntersectionObserver +
  MutationObserver and honors `prefers-reduced-motion`.

## Navigation Model

- The `Header` renders router `Link`s: the logo goes home, section links target
  `/#explore`-style hashes (so they work from any route), and **Plan** goes to `/plan`.
- `AppShell` (`src/app/AppShell.tsx`) watches `location` and on a `#hash` scrolls to the
  matching section — this is what makes section anchors work off the landing page.

## Linting

`.oxlintrc.json` enables the `react`, `typescript`, and `oxc` plugin sets with two rules:

- `react/rules-of-hooks` — **error** (hooks misuse fails CI)
- `react/only-export-components` — **warn**, allowing constant exports

Add type-aware rules via `oxlint-tsgolint` (`options.typeAware: true`) if strictness
is later required.

## Domain Model

Agora is a hyper-local discovery product organized around **seven category pillars**,
backed by `src/data/places.ts` (80 Uganda-themed fixtures — Kampala, Entebbe, Jinja)
and `src/data/events.ts` (a 22-event weekly feed):

```
Category                Example entities              Source
────────────────────────────────────────────────────────────────
Food & Drink            Cafés, rolex stands, eateries  places.ts (18)
Nightlife               Bars, silent discos, jazz      places.ts (12)
Sports & Fitness        Leagues, runs, gyms            places.ts (12)
Arts & Culture          Galleries, theaters, chess     places.ts (12)
Community & Events      Markets, workshops, clubs       places.ts (10)
Stays & Places          Hotels, lodges, cottages       places.ts (8)
Essential Services      Everyday services               places.ts (8)
Events (windows)        today / tomorrow / weekend      events.ts (22)
```

Data accessors keep selectors testable and swappable: `getPlaceBySlug`,
`getPlacesByCategory`, `getRelated` (`src/data/places.ts`); `happeningNow`,
`eventsForWindow`, `formatDayLabel` (`src/data/events.ts`). Pure week-window math uses
day-of-week integers + `% 7` wraparound so time logic is deterministic and unit-testable
(`src/features/live/eventsUtils.test.ts`).

### Data seam (client → backend)

`src/data/catalogue.ts` is the single entry point that components read through. It serves
the bundled fixtures (`PLACES`/`EVENTS`) until `loadCatalogue()` hydrates from the JSON
payloads shipped with the build (`public/data/places.json` + `events.json`, regenerated
from the TypeScript fixtures by `scripts/sync-data.mjs` on every `dev`/`build`). On any
fetch failure — offline, changed origin, or during tests — it falls back to fixtures, so
the app is always fully functional. Accessor signatures are unchanged, so swapping in a
live REST/graph API later is a single-module change behind `getPlaces()`/`getEvents()`.

User state (favorites, plan) lives in `localStorage` behind two hooks — `useFavorites`
(`agora:favorites`) and `usePlan` (`agora:plan`) — with validated reads and tolerated
write failures. This is the seam where a backend would slot in later.

## Roadmap Status

- **Milestone 2 — shipped:** category dashboard (tabs), interactive map with synced pins,
  live search across names/categories/tags, detail pages + modal views, paginated browse.
- **Milestone 3 — shipped:** "What's Happening Today" feed (day windows + Live now),
  saved favorites, planner dashboard.
- **Milestone 4 — in progress:** system-adaptive light/dark shipped; micro-interactions
  review and final production delivery pending. Quick-filter category chips (M3
  carryover) still open.

## Non-Functional Targets

- **Performance:** Vite builds are notably smaller than legacy webpack setups; pagination
  keeps the landing grid light; reveal animations use IntersectionObserver instead of
  scroll listeners.
- **Accessibility:** WCAG 2.2 AA is a design non-negotiable (contrast, keyboard flow,
  screen-reader semantics). Theme and section labels verified for dark-mode contrast.
- **Responsiveness:** every UI surface holds across mobile, tablet, and desktop.

## Command Reference

| Command | Pipeline |
| --- | --- |
| `pnpm dev` | `vite` |
| `pnpm build` | `tsc -b && vite build` |
| `pnpm preview` | `vite preview` |
| `pnpm lint` | `oxlint` |
| `pnpm test` | `vitest run` |
| `pnpm test:watch` | `vitest` |