# Product Roadmap — Agora

## Milestone 1: Core Foundation & Scaffolding (Complete)
- [x] Establish repository and `.devpartner/` system tracking
- [x] Scaffold Vite + React + TypeScript + Tailwind CSS application workspace
- [x] Formulate high-level Product Definition (README.md)
- [x] Write project documentation set (README, GETTING_STARTED.md, ARCHITECTURE.md)

## Milestone 2: Interactive Discovery Prototype (Complete)
- [x] Implement Unified Category Navigation Dashboard (landing Showcase category filter tabs)
- [x] Build interactive Map exploration UI (ExploreMap pins synced to results)
- [x] Live search across names, categories, and tags (with result count)
- [x] Create detailed cards and modal views for lodging, sports, events, food joints, and essential services (PlaceModal + dedicated /place/:slug page)
- [x] Paginated browsing (initial batch of 8 + Load more) to keep the landing page light

## Milestone 3: Live Events & Community Hub (Complete except chips)
- [x] "What's Happening Today" feed/carousel (day windows Today / Tomorrow / This Weekend + Live now pulse)
- [ ] Multi-category quick-filter tags (subcategory chips, e.g. "chess", "marathon") — search covers tags, standalone chip row not built
- [x] Saved Favorites with localStorage persistence
- [x] Favorites planner dashboard across saved spots (/plan: Today / Tomorrow / This Weekend assignment + removal)

## Milestone 4: Polish, Theme & Delivery (In Progress)
- [x] System-adaptive Light/Dark mode theme toggle (system/light/dark, `matchMedia` + localStorage)
- [x] Working navigation across all routes (router Links + hash-scroll; fixed dead section anchors from non-landing routes)
- [ ] Micro-interactions and fluid layout review (reduced-motion pass included; polish review pending)
- [ ] Final production build compilation check (CI green; deploy verification once a URL exists)

## Backlog / Next
- Real API data and search indexing (swap `src/data` accessors behind an adapter)
- Geolocation — "near me" distance sort using existing `map {x, y}` coordinates
- Deployment to a live URL (hero README link TODO)
- Favorites/plan cross-device sync (server-side store behind hook API)