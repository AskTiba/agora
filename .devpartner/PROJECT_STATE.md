# Project State — Agora

## Project Name: Agora
## Current Status: Milestone 4 in progress (theme shipped; micro-interactions + final delivery review pending)
## Technologies: React 19, Tailwind CSS v4, TypeScript, Vite 8, pnpm, vitest-env

## Conventions
- **Test strategy:** Vitest 5 + React Testing Library (integration-heavy, no shallow render)
- **User events:** @testing-library/user-event (not fireEvent)
- **Assertions:** @testing-library/jest-dom (via /vitest entry)
- **Environment:** jsdom; vitest config in `vitest.config.ts`; global cleanup in `src/test/setup.ts`
- **Test command:** `pnpm test` (CI-style run); `pnpm test:watch` (development)
- **Package manager:** pnpm (never npm/yarn); `pnpm-lock.yaml` is the lockfile (package-lock deleted)
- **Lint:** oxlint (`.oxlintrc.json`); type-check runs inside `pnpm build` via `tsc -b`
- **Routing:** react-router-dom v7 `createBrowserRouter`; section nav uses router `Link`s + hash-scroll effect in AppShell
- **Persistence:** `useFavorites` (`agora:favorites`) and `usePlan` (`agora:plan`) in localStorage

## Core Pillars
- Food & Drink · Nightlife · Sports & Fitness · Arts & Culture · Community & Events · Stays & Places · Essential Services
- 80 places (Uganda-Kampala/Entebbe/Jinja themed, fictional venues), 7 categories + "All", 22 weekly events with Today/Tomorrow/Weekend windows

## Current Sprint Focus
- Milestone 4 closeout: micro-interactions review, final production build verification
- Future: live API data, geolocation ("near me"), quick-filter category chips (M3 carryover)

## Documentation
- README.md — product definition, pillars, quick start, structure, roadmap.
- docs/GETTING_STARTED.md — prerequisites, install, commands, troubleshooting.
- docs/ARCHITECTURE.md — stack rationale, layout, theming, linting, domain model.
- .devpartner/INTERVIEW_QA.md — live interview study bank.

## System Boundaries & Integrations
- Local environment setup (Vite + React SPA).
- Mock data fixtures for all places and events (client-side only; no backend yet).
- In-memory search + category index; localStorage persistence for user data.
- CI: GitHub Actions (lint + test + build) on main push / PR.