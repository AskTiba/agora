# Architecture — Agora

Technical overview of the Agora frontend application: stack rationale, project layout,
theming conventions, and the planned domain model.

## Stack Rationale

| Layer | Choice | Why |
| --- | --- | --- |
| **Language** | TypeScript | Static typing across the codebase; `verbatimModuleSyntax` + `erasableSyntaxOnly` enforce erasable, forward-compatible syntax (no enums/namespaces, explicit type-only imports). |
| **UI library** | React 19 | Mature component model, large ecosystem, `react-jsx` transform (no runtime import needed). |
| **Build tool** | Vite 8 | Instant cold starts and sub-50ms HMR; `tsc -b` type-checks before bundling so the build fails on type errors. |
| **Styling** | Tailwind CSS v4 | Utility-first CSS with `@theme` design tokens compiled at build time; single `@import "tailwindcss"` entry — no `tailwind.config.js`. |
| **Linting** | Oxlint | Rust-powered, near-instant linting with React + TypeScript + Oxc rules. |
| **Package manager** | pnpm | Strict dependency resolution and a shared content-addressed store — saves disk space and speeds installs. |

## Current Project Layout

```
src/
├── assets/          # Bundled static assets (images handled by entry point)
├── App.tsx          # Root component (currently the scaffold demo screen)
├── App.css          # App-level styles
├── index.css        # Tailwind v4 import + @theme design tokens + base styles
└── main.tsx         # React DOM root, StrictMode wrapper
```

Future feature work should extend this layout with a domain-driven feature folder
structure (e.g. `src/features/<area>/`, `src/components/`, `src/data/`). See
[Planned Domain Model](#planned-domain-model).

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

Tailwind v4 is configured entirely in CSS via `src/index.css`:

```css
@import "tailwindcss";

@theme {
  --color-brand-primary: #10b981;   /* emerald-500 */
  --color-brand-secondary: #059669; /* emerald-600 */
}
```

- These tokens become usable as `bg-brand-primary`, `text-brand-secondary`, etc.
- Extend `@theme` with more `--color-*`, `--font-*`, `--radius-*` tokens as the design
  system grows — never hardcode raw hex values in components.

## Linting

`.oxlintrc.json` enables the `react`, `typescript`, and `oxc` plugin sets with two rules:

- `react/rules-of-hooks` — **error** (hooks misuse fails CI)
- `react/only-export-components` — **warn**, allowing constant exports

Add type-aware rules via `oxlint-tsgolint` (`options.typeAware: true`) if strictness
is later required.

## Planned Domain Model

Agora is organized around **four core pillars**. The fixture/mock data layer and search
index are planned as in-memory modules (SPA prototype phase):

```
Pillar                     Example entity
─────────────────────────────────────────────
Stays & Places             Hotel, Guesthouse, Venue, Landmark
Food & Nightlife           Restaurant, Café, Bar, Nightspot
Activities & Community     Event, Sport, Workshop, Community group
Essential Services         Pharmacy, Clinic, Banking, Transport, Retail
```

Planned capabilities (from the roadmap):

- **Milestone 2** — Unified category navigation dashboard; interactive map exploration UI
  (SVG/interactive panels); rich cards + modal views for every service type.
- **Milestone 3** — "What's Happening Today" feed/carousel; multi-category quick-filter
  tags; saved favorites and a dynamic planner dashboard.
- **Milestone 4** — System-adaptive light/dark mode; micro-interactions; final production
  build verification.

## Non-Functional Targets

- **Performance:** fast under real conditions; Vite builds are notably smaller than legacy
  webpack setups — keep bundle growth in check with code-splitting as features land.
- **Accessibility:** WCAG 2.2 AA is a design non-negotiable (contrast, keyboard flow,
  screen-reader semantics) — to be applied in every component built.
- **Responsiveness:** every UI surface must hold across mobile, tablet, and desktop.

## Command Reference

| Command | Pipeline |
| --- | --- |
| `pnpm dev` | `vite` |
| `pnpm build` | `tsc -b && vite build` |
| `pnpm preview` | `vite preview` |
| `pnpm lint` | `oxlint` |