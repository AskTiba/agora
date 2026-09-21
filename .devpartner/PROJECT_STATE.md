# Project State — Agora

## Project Name: Agora
## Current Status: Milestone 2 Unit 1 Done (design tokens + app shell)
## Technologies: React, Tailwind CSS, TypeScript, Vite, pnpm

## Conventions
- **Test strategy:** Vitest 5 + React Testing Library (integration-heavy, no shallow render)
- **User events:** @testing-library/user-event (not fireEvent)
- **Assertions:** @testing-library/jest-dom (via /vitest entry)
- **Environment:** jsdom; vitest config in `vitest.config.ts`; global cleanup in `src/test/setup.ts`
- **Test command:** `pnpm test` (CI-style run); `pnpm test:watch` (development)
- **Package manager:** pnpm (never npm/yarn)
- **Lint:** oxlint (`.oxlintrc.json`); type-check runs inside `pnpm build` via `tsc -b`

## Core Pillars
- Stays & Places
- Food & Nightlife
- Activities & Community
- Essential Services

## Current Sprint Focus
- Milestone 2 — Interactive Discovery Prototype (in progress)
- Unit 2 (next): domain model & fixtures — 4-pillar categories + mock data + in-memory search/index

## Documentation
- README.md — product definition, pillars, quick start, structure, roadmap.
- docs/GETTING_STARTED.md — prerequisites, install, commands, troubleshooting.
- docs/ARCHITECTURE.md — stack rationale, layout, theming, linting, domain model.

## System Boundaries & Integrations
- Local environment setup (Vite + React SPA).
- Mock data models for all services, stays, and activities.
- In-memory search and category index.
