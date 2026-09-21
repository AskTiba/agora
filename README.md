# Agora — Hyper-Local Discovery & Community Platform

> *Agora* (Ancient Greek: ἀγορά) — the central public space and heart of community life.

Agora is a hyper-local discovery and community platform that unifies lodging, dining,
nightlife, sports, local activities, and essential services into a single, fast, and
beautiful web experience. It is designed to be the modern "town square" — the first stop
for anyone wanting to know what their area has to offer.

## Core Pillars

| Pillar | What it covers |
| --- | --- |
| **Stays & Places** | Lodging, venues, and notable local places |
| **Food & Nightlife** | Restaurants, cafés, bars, and nightlife |
| **Activities & Community** | Sports, events, things to do, community happenings |
| **Essential Services** | Everyday services people need locally |

## Current Status

**Scaffolding complete — active development ongoing.**

- [x] Repository and project-state tracking established
- [x] Vite + React + TypeScript + Tailwind CSS workspace scaffolded
- [x] Tailwind CSS v4 theming configured (`--color-brand-primary`, `--color-brand-secondary`)
- [ ] Interactive Discovery Prototype (Milestone 2)
- [ ] Live Events & Community Hub (Milestone 3)
- [ ] Polish, Theme & Delivery (Milestone 4)

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the technical overview and
[`ROADMAP` notes](#roadmap) below.

## Tech Stack

| Layer | Choice |
| --- | --- |
| Language | TypeScript |
| UI library | React 19 |
| Build tool | Vite |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`) |
| Linting | Oxlint |
| Package manager | pnpm |

## Getting Started

### Prerequisites

- **Node.js** 20.19+ or 22.12+ (required by Vite 8)
- **pnpm** (see [GETTING_STARTED.md](docs/GETTING_STARTED.md) for install options)

### Quick Start

```bash
# Install dependencies
pnpm install

# Start the dev server (HMR enabled)
pnpm dev

# Production build
pnpm build

# Lint
pnpm lint

# Preview the production build
pnpm preview
```

Open http://localhost:5173 in your browser to see the app.

> See [`docs/GETTING_STARTED.md`](docs/GETTING_STARTED.md) for a full onboarding guide.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the Vite dev server with hot module replacement |
| `pnpm build` | Type-check (`tsc -b`) then produce a production build |
| `pnpm preview` | Serve the production build locally |
| `pnpm lint` | Run Oxlint over the project |

## Project Structure

```
.
├── docs/               # Project documentation
│   ├── GETTING_STARTED.md
│   └── ARCHITECTURE.md
├── public/             # Static assets served as-is
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/         # Bundled images and icons
│   ├── App.tsx         # Root application component
│   ├── App.css         # App-level styles
│   ├── index.css       # Global styles + Tailwind theme tokens
│   └── main.tsx        # Application entry point
├── index.html          # Entry HTML
├── vite.config.ts      # Vite + plugins configuration
├── tsconfig.json       # TypeScript project configuration
└── package.json
```

## Documentation

- [Getting Started Guide](docs/GETTING_STARTED.md) — prerequisites, install, scripting, troubleshooting
- [Architecture & Conventions](docs/ARCHITECTURE.md) — stack rationale, project layout, data model, conventions

## Roadmap

- **Milestone 1 — Core Foundation & Scaffolding** *(in progress)*
- **Milestone 2 — Interactive Discovery Prototype**: unified category navigation dashboard,
  interactive map exploration UI, detailed cards/modals for all service types
- **Milestone 3 — Live Events & Community Hub**: "What's Happening Today" feed, quick-filter
  tags, saved favorites / dynamic planner dashboard
- **Milestone 4 — Polish, Theme & Delivery**: system-adaptive light/dark mode, micro-interactions,
  final production build

## License

Private — no license granted. All rights reserved.