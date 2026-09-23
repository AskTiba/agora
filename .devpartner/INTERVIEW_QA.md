# Interview Q&A — Agora

> **Personal software-engineering study bank.** Generated live during development plus
> post-hoc project scans — every entry maps a real design decision, file, or code pattern
> to the question an interviewer would ask, with a teaching-grade model answer written for
> an intermediate developer working toward interview readiness.
> Last updated: 2026-09-24

---

## Index

| Domain | Section | Question count |
|---|---|---|
| System Design & Architecture | §D1 | 3 |
| Algorithms & Data Structures | §D2 | 2 |
| Language Fundamentals | §D3 | 2 |
| Frontend / React | §D4 | 5 |
| Backend / API Design | §D5 | 0 (client-only SPA; see §D1 for routing) |
| Database & Queries | §D6 | 1 (client-side data layer) |
| Security | §D7 | 1 |
| Performance & Scalability | §D8 | 2 |
| Testing & QA | §D9 | 2 |
| CI/CD & DevOps | §D10 | 1 |
| Accessibility | §D11 | 2 |
| Mobile / Native | §D12 | 0 |
| Data / ML | §D13 | 0 |
| Behavioral & Decisions | §D14 | 3 |
| Project Deep-Dive | §D15 | 5 |

---

## Story Entries (Chronological)

### STORY-01 — Favorites + Planner dashboard with `usePlan` — 2026-09-24

**Q:** Why does the favorites planner live entirely in `localStorage` instead of a backend,
and how did you keep two hooks (`useFavorites`, `usePlan`) from stomping on each other's keys?

**Direct answer:** There is no backend in this product shell yet, so persistence is
client-side `localStorage`, and each concern uses a distinct namespaced storage key so the
hooks never collide.

**Concept:** `localStorage` is a synchronous key/value store scoped per origin that survives
page reloads. A hook can hydrate initial state lazily from it (`useState(reader)` runs the
reader once on mount) and mirror every change back via a `useEffect` that serializes state on
each render commit.

**Why / tradeoffs:** A backend would buy real sync, accounts, and cross-device data — all
premature for a frontend product shell whose only consumer is the browser. The tradeoff: data
is single-device and easily cleared; the escape hatch is swapping the persistence layer behind
the same hook interface without touching components.

**In this project:** `useFavorites` writes to `agora:favorites` (`src/hooks/useFavorites.ts:3`)
and `usePlan` to `agora:plan` (`src/hooks/usePlan.ts:13`). Both guard with try/catch
(`useFavorites.ts:20-26`) because Safari private mode and quota-exceeded states throw on write,
and both validate on read — `readStored` filters to strings (`useFavorites.ts:11`) and
`usePlan` whitelists against `PLAN_DAYS` (`usePlan.ts:24`) so corrupted JSON degrades to empty
state instead of crashing.

**Edge cases:** (1) Write quota: a full/blocked `localStorage` throws — wrapped in try/catch,
persistence silently degrades. (2) Corrupt JSON: `JSON.parse` throws — caught, returns `[]`
`{}`. (3) SSR/`window` undefined — `readStored` returns empty pre-hydration.

**At scale:** If plans grew to thousands of venues this still fits (tens of KB). The moment
multi-device or auth arrives, migrate to a server store with the same hook API and optimistic
updates; `localStorage` then becomes an offline cache.

**Interviewer's intent:** Whether you understand lazy state initialization, the persistence
write-back pattern, and where `localStorage` is — and isn't — the right tool.

**Follow-ups:**
- Q: What does `useState(readStored)` do that `useState([])` does not? → A: Lazy init: the
  function runs exactly once at mount to produce the initial value, so we read storage before
  first paint instead of after (which would flash empty data).
- Q: How would you make two tabs stay in sync? → A: Subscribe to the `storage` event in a
  `useEffect` and re-read the key on cross-tab writes.

---

## §D1. System Design & Architecture

### Client-side routing for a multi-section SPA

**Q:** Describe the routing structure of this app and why hash-scrolling to landing sections
needs special handling once you leave the landing page.

**Direct answer:** It's a `createBrowserRouter` single-level layout: `/` (landing), `/place/:slug`
(detail), `/plan` (planner), with a `*` catch-all that re-renders the landing page. Because
`#section` anchors for Explore/Features/Events/Community only exist as elements on the landing
route, they break when clicked from any other route — so navigation is handled client-side and a
`useEffect` in `AppShell` scrolls to the hash after render.

**Concept:** `BrowserRouter` gives real URLs with client-side transitions — no full reload. A
`Link to="/#explore"` changes `location.hash` while keeping the app mounted; separate from
that, the *scroll* to `id="explore"` must be triggered imperatively because the element only
exists after the landing page mounts.

**Why / tradeoffs:** Native `<a href="#explore">` anchors work on the landing page (same page,
element present) but are dead links from `/plan`. Converting to router `Link`s plus an
`AppShell` effect (scroll `useEffect` keyed on `location` at `src/app/AppShell.tsx:10-16`)
makes every nav link work from every route. Tradeoff: two places to keep in sync — the link
and the scroll effect — versus a custom scroll-manager hook.

**In this project:** Routes at `src/App.tsx:13-16`; scroll-on-hash in `AppShell.tsx`; the
section links use `Link to={`/${href}`}` (`src/components/Header.tsx`) and the plan link is a
normal `/plan` route.

**Edge cases:** Re-clicking a nav link while already on that hash returns the same location and
the effect won't re-fire (no `location` change) — the Header guards with an inline
`scrollIntoView` in the click handler. Wildcard `*` reroutes unknown URLs to the landing page,
so typo'd URLs degrade gracefully.

**At scale:** Adding routes (e.g., `/account`, `/venue/:id`) is additive in the route table.
For hundreds of sections, centralize the scroll logic in a `useScrollToHash` hook instead of
one effect per page.

**Interviewer's intent:** Do you understand the difference between URL state, route mounts, and
imperative DOM scrolling — a classic "why did the anchor break" debugging path.

### Imagining a real backend

**Q:** This app is a static SPA with mock data. How would you take it to a real, deployed
product?

**Direct answer:** Add an API layer (e.g., a single backend service) behind the existing data
module boundaries — `places`, `events`, favorites/plans — plus geolocation for "near me" and
per-user storage for favorites/plans.

**Concept:** Replace the synchronous `import` of fixtures with async fetches to REST/graph
endpoints, keep the same shape so selectors and components barely change, and add loading and
error states. Add user auth for server-side favorites; otherwise the `localStorage` hooks keep
working for anonymous users exactly as they do now.

**Why / tradeoffs:** Server-side search/geolocation scales and enables cross-device sync, at the
cost of latency, hosting, and a breaking change to the data access layer. Incremental path:
introduce a `PlacesApi` interface with a mock adapter first, then a `fetch` adapter later —
components never know which one they're talking to.

**In this project (realized):** `src/data/catalogue.ts` already implements the adapter point.
`loadCatalogue()` fetches the JSON shipped with the deploy (`public/data/places.json` +
`events.json`, regenerated from the TypeScript fixtures by `scripts/sync-data.mjs` on every
`dev`/`build`); any failure — offline, changed origin, tests — falls back to the bundled
fixtures. Components read through `useCatalogue()` and the unchanged accessors
(`getPlaces`/`getEvents`/`getPlaceBySlug`), so swapping in a real REST/graph endpoint later is
a single-module change.

**In this project:** The data layer already centralizes accessors — `getPlaceBySlug`
(`src/data/places.ts`), `getPlacesByCategory`, `eventsForWindow`
(`src/data/events.ts`). Port the filter/group logic to the server as-is, or keep it client
side for a fast prototype.

**Edge cases:** Cache invalidation on new venues/events; empty-result states for far-out
searches; error/offline fallbacks — the current fallback-to-fixtures loader gives you the
offline path for free but not real caching or search.

**At scale:** This is the difference between a demo and a product: a real backend with
indexed search, caching, and auth. The architecture today (feature slices, thin data module)
is the migration path.

**Interviewer's intent:** Can you scope a migration from prototype to production and identify
the persistence/API seam — most candidates would rewrite from scratch instead of finding the
adapter point.

### Why ordering the sections in the export matters in React Fast Refresh

**Q:** In `PlannerPage`, the extra `columns` helper and your test file's waiting logic — what
did the test reveal about how rendering and effects interact?

**Direct answer:** The testing lesson is that after an interaction, state updates and reeffects
are asynchronous — assertions must wait for the DOM to settle rather than assert synchronously,
which is why the removal test uses a `query...not.toBeInTheDocument` assertion after the user
clicks.

**Concept:** React state updates are batched and effects run after paint. When a click removes
a card, the updated list isn't in the DOM until the next commit; `user-event`'s API returns
promises, so awaiting a *removal* assertion (an element absent) requires waiting through
`waitFor`-style semantics or asserting on the still-present count.

**Why / tradeoffs:** Synchronous assertion flakiness vs. slightly slower tests. Prefer
testing the absence via `queryByRole` + `not.toBeInTheDocument()` after `await user.click(...)`
— asserts what the user sees instead of peeking at internal state.

**In this project:** `src/features/plan/PlannerPage.test.tsx` exercises add-to-day, removal,
and count labels across the three columns — the important assertion is removal actually
disappears and the "Still deciding" pool count updates.

**Edge cases:** Timing flakes when a component defers work to a rAF/timeout; avoid asserting
internal `localStorage` and assert rendered output only.

**Interviewer's intent:** Whether you understand async rendering and write assertions that
reflect user-observable behavior.

---

## §D2. Algorithms & Data Structures

### The week-window math

**Q:** Explain the modular arithmetic in the events windowing utilities.

**Direct answer:** Day-window filtering is `weekday` integer comparison plus modular wraparound
for tomorrow (Sunday→Monday) and a capped `offsetToWeekday` for "this weekend."

**Concept:** `today.getDay()` is 0 (Sun)–6 (Sat). Tomorrow is `(todayDay + 1) % 7` — the `% 7`
wraps Sunday (6→0). "Weekend" uses `offsetToWeekday(target, today) = (target - todayDay + 7) % 7`,
which gives the *days ahead* until that weekday in 0–6 range; the `>= 2` guard picks only a
weekend that's still ahead (not this weekend already in the past on a Sunday).

**Why / tradeoffs:** Integer weekday math is simpler and testable vs. comparing `Date` objects.
Tradeoff: these are pure functions — meaning they get deterministic unit tests with a fixed
`today` (`src/features/live/eventsUtils.test.ts`).

**In this project:** `offsetToWeekday` (`src/data/events.ts:200`), `formatDayLabel` (`:204`),
`happeningNow` (`:215` uses minutes-of-day window), `eventsForWindow` (`:221` switch on window).

**Edge cases:** A "weekend" query on a Saturday with the events being last weekend returns `[]`;
`happeningNow` guards weekday mismatch and uses `>= start && < end` to exclude the end time.

**At scale:** O(n) filter over events — fine for hundreds; at millions, pre-index events by
`weekday` (e.g., a Map keyed by weekday) for O(weekly count).

**Interviewer's intent:** Comfort with modular arithmetic and pure-function testability —
commonly probed with calendar/date logic.

### `% 7` wraparound off-by-ones

**Q:** What's the classic bug in `(todayDay + 1) % 7` for "tomorrow events," and how is it safe?

**Direct answer:** The classic bug is forgetting the wrap so Saturday's tomorrow (0, Sunday) is
wrong — `% 7` handles it. It's also safe against a `todayDay` that's Sunday (0): `(0+1)%7 = 1`
(Monday). No off-by-one because `getDay()` is already 0-based.

**Concept:** `% n` maps any integer into the range 0..n-1 — the canonical "wrap after the last
index" pattern. Used twice here (tomorrow + the distance function's `+7` to avoid negative results).

**Why / tradeoffs:** Explicit weekday constants and `% 7` — vs. `Date` addition which is tz and
DST-sensitive; reject that for deterministic demo data.

**In this project:** `eventsForWindow` case `'tomorrow'` (`src/data/events.ts:226-228`).

**Edge cases:** DST boundaries (none — no real datetimes here); locale differences in
`toLocaleDateString` (note `en-US` hardcoded at `:207` — a candidate to parameterize).

**Interviewer's intent:** Spotting wraparound arithmetic and knowing when to prefer integer math
over date libraries.

---

## §D3. Language Fundamentals

### Lazy state initialization and SSR guards

**Q:** In `useFavorites`, why is `readStored` passed to `useState` and wrapped in try/catch?

**Direct answer:** Passing the function defers it: `useState(readStored)` runs it once, lazily,
only to compute the initial value. try/catch plus a `window` guard make the reader safe outside a
browser (SSR) and against corrupted storage.

**Concept:** `useState(initializer)` — passing a function means React calls it only on the first
render, so parse work happens exactly once and never on re-renders. `window` referenced only
inside the function means no crash if the module is loaded during SSR/a test without jsdom.

**Why / tradeoffs:** Eager `useState(readStored())` runs on every render — wasteful. The cost of
the pattern: initial type `string[]` guessed from a parser that can return anything
(`unknown`), so the code defensively narrows (`Array.isArray(...).filter` at
`src/hooks/useFavorites.ts:11`).

**In this project:** `readStored` at `useFavorites.ts:5-15`; same pattern in `usePlan.ts:15-32`.

**Edge cases:** Storage disabled (private mode) — writers guarded at `:22-25`. Non-array
parsed values — the `unknown` -> `Array.isArray` narrowing returns `[]`.

**Interviewer's intent:** Do you actually know what `useState(fn)` means vs. `useState(fn())`,
and do you write parsers that can't throw.

### Overload: `as const` enums and indexing

**Q:** `CATEGORY` is declared `as const` at module level then referenced heavily — what does
`as const` buy here, and when would you reach for a `const enum` instead?

**Direct answer:** `as const` widens nothing: the literal strings (`'Food & Drink'`) stay literal
types, so the category keys are type-safe and offer autocomplete, without emitting runtime enum
code.

**Concept:** `as const` makes properties read-only with literal types — the idiomatic TS "enum
without enums." It fails fast if a data object's `category` value isn't one of the defined keys
(compile-time), unlike a plain string union (which is also fine at a distance from the data).

**Why / tradeoffs:** Literal-union from `CATEGORY` is more ergonomic than `enum` (which emits runtime
objects and has open-number footguns). Tradeoff: the literal is repeated per place entry
(`category: CATEGORY.FOOD`), and files importing `CATEGORY` pull the module — negligible here.

**In this project:** `src/data/places.ts:19-27` defines `CATEGORY`; `CATEGORIES` at `:29-38`
adds `'All'` on top for the filter UI, so the UI can render a tab row from a single source.

**Edge cases:** A `Place` with a misspelled category silently fails `getPlacesByCategory` for
its own tabs — a good place for a runtime guard once data becomes external.

**Interviewer's intent:** TS `as const` literacy and whether you can justify enum alternatives.

---

## §D4. Frontend / React

### The `ThemeToggle` system option

**Q:** How does the "system" theme option work, and what happens when the OS theme changes at
runtime?

**Direct answer:** `useTheme` resolves `system` to the OS preference through
`window.matchMedia('(prefers-color-scheme: dark)')`, applies the `dark` class right away, and
subscribes to the media query's `change` event so a live OS toggle re-applies on the fly.

**Concept:** `prefers-color-scheme` is media-query CSS; JS can observe it with
`matchMedia` + `addEventListener('change', ...)`. The effect returns a cleanup that removes the
listener — the imperative, effect-based way to react to an external signal that isn't React
state.

**Why / tradeoffs:** One class (`dark`) on `<html>` and Tailwind v4 `@theme` tokens invert the
whole palette — cheaper than prop-drilled conditional styles. Tradeoff: flash-of-wrong-theme if
the script runs late; mitigated here by a storage read for round-trips.

**In this project:** `src/hooks/useTheme.ts`: `applyTheme` mutates
`document.documentElement.classList` (`:5-17`); the `matchMedia` listener is added only when
`theme === 'system'` (`:34-40`); persistence by key `theme` (`:23, :31`).

**Edge cases:** No OS preference (returns light by default); list listeners not removed (cleanup
handled); storage containing a stale value — narrowed to the `Theme` union at `:23`.

**At scale:** "System + user override" is the classic preference model; the future step is a
`useMediaQuery` hook to share the listener across components (e.g., reduced-motion preferences).

**Interviewer's intent:** Whether you know `matchMedia` subscriptions and effect cleanup —
appears in a solid fraction of frontend interviews.

### The IntersectionObserver scroll-reveal

**Q:** `useScrollReveal` attaches two observers. What are they and why two?

**Direct answer:** An `IntersectionObserver` reveals elements as they scroll into view, and a
`MutationObserver` watches for newly-added DOM nodes (lazy-loaded/unmounted route content) so
reveal styles apply to content that appears *after* initial mount.

**Concept:** `IntersectionObserver` fires a callback when target elements cross a viewport
threshold — no scroll listener or layout thrash. `MutationObserver` observes childList/subtree
changes to `document.body` and re-runs `reveal()` on each added node.

**Why / tradeoffs:** This replaces window-scroll listeners (janky, callback-heavy) with the
browser's native intersection engine. Tradeoff: observers must be disconnected (cleanup in the
hook `src/hooks/useScrollReveal.ts:37-43`); reduced-motion users bypass animation entirely via
a `prefers-reduced-motion` check (`:7`).

**Edge cases:** Elements inside a route that's still mounting — the MutationObserver catches
them; elements already in the viewport at load — threshold 0.15 (`.15` revealed) catches them;
SSR (no `document` yet) — the effect only runs in the browser.

**At scale:** Two observers over many `.reveal` nodes are cheap (single observer observes them
all). Beyond hundreds of animated nodes, consider CSS `animation-timeline: view()` and drop JS.

**Interviewer's intent:** Do you know the browser-native alternatives to scroll listeners, and
do you handle cleanup + reduced-motion.

### Controlled `useEffect` write-back pattern

**Q:** `useFavorites` synchronizes `localStorage` in an effect keyed on `favorites`. What's a
subtle problem with writing in effects, and how does this code dodge it?

**Direct answer:** Effect-dependency-write can loop if you also read storage in the effect; this
code writes only and reads only once (lazy init), so no loop — the effect writes the *current*
state and the reader seeded state from the same store at mount.

**Concept:** Hydrate once (initial value); mirror on every change. Beware of
read-in-effect + write-in-effect pairs cycling; and of writing during render (unpure). Writing
after render (effect) is the accepted compromise.

**Why / tradeoffs:** Pure alternative is writing on *interaction* (toggle handler) — fewer
writes, but misses programmatic changes. Effect-on-state is uniform and declarative; the cost:
one extra commit where the write happens.

**In this project:** `useEffect(() => { localStorage.setItem(...) }, [favorites])` at
`src/hooks/useFavorites.ts:20-26`.

**Edge cases:** Concurrent writes across tabs (last-write-wins) — acceptable here; flush on
unmount (missing) — irrelevant because we update on every change, not at teardown.

**Interviewer's intent:** Whether you understand the effect data-flow ("suspend"/"write-after-
render") and can reason about loops.

### Layout/shell + `Outlet`

**Q:** Why is the app shell a layout route with an `Outlet`, and how do route pages share
Header/Footer?

**Direct answer:** `AppShell` renders `<Header />`, `<main><Outlet /></main>`, `<Footer />`
(`src/app/AppShell.tsx:7-14`) as a *layout route* — child routes render into `Outlet`, so they
inherit the chrome without repeating it.

**Concept:** Nesting routes lets the parent provide persistent UI; the router injects the
matching child into `Outlet`. One shell = one set of nav/footer/scroll-reveal effects, shared
across `/`, `/place/:slug`, `/plan`.

**Why / tradeoffs:** Layout routes keep chrome DRY and give you a single place for global effects
(`useScrollReveal()` call lives in `App.tsx:22`). Tradeoff: an effect placed in the shell runs on
every navigation — must be idempotent.

**In this project:** `src/App.tsx:8-18` router with `AppShell` root + 3 children + wildcard.

**Edge cases:** Route-guard logic (none here) would also live at the shell level; keeping the
keyd global effect idempotent is the maintenance risk.

**Interviewer's intent:** Router architecture literacy — nested/layout routes vs. re-mounting
shared chrome per page.

### Making "no results" and pin interaction nice

**Q:** The Showcase has search + map + pins. How do empty states keep the UI coherent?

**Direct answer:** Search filters the in-memory list to a count; when the count is 0 a "no
results" message is rendered instead of an empty grid, and pins mirror the same filtered list so
map and list never disagree.

**Concept:** Derive both grid and map from ONE `results` array — single source of truth. Empty
state is a branch in JSX with an explicit message and a way out (clear search), not a blank
section.

**Why / tradeoffs:** Consistency guarantees (map pin == card) by construction vs. keeping two
sources in sync. Tradeoff: O(n) re-filter per keystroke — fine at 80; at scale, debounce and
memoize.

**In this project:** `src/features/landing/Showcase.tsx` search over `name/category/tags`
(`:128`); tests assert both "chess" and "marathon" search paths (`Showcase.test.tsx:65-88`).

**Edge cases:** Search term with no matches must not crash the map pin renderer (shared array,
so empty is safe); category filter + search combined — check both conditions in the same filter.

**Interviewer's intent:** Thinking in derived state and graceful empty states — the difference
between a demo and a product.

---

## §D6. Database & Queries

### Client-side data layer as a "database"

**Q:** The data lives in `src/data/places.ts` with getter helpers. What would a collection-indexed
design look like if you had tens of thousands of places?

**Direct answer:** Pre-index by category and lowercase-normalized searchable text (Map/record of
category → array), so filter-and-search are O(results) instead of O(all).

**Concept:** An in-memory inverted index: `category -> places[]` and `token -> slugs[]`. Query =
look up key, filter. At thousands of records this is the "no server yet" equivalent of a DB
index.

**Why / tradeoffs:** The current linear scan (`PLACES.filter` in `getPlacesByCategory`
`src/data/places.ts`) is O(n) per keystroke — fine at 80, linear decay as data grows.
Tradeoff: index memory; but the API stays the same so components don't change.

**In this project:** `getPlaceBySlug` (`src/data/places.ts`), `getPlacesByCategory`, `getRelated`
(also re-exported through `src/data/catalogue.ts`).

**At scale:** When data leaves the bundle, this layer becomes a selector over an API response —
keep the same shape and the migration is seamless.

**Interviewer's intent:** Do you think about data access with index/query design even when there
is no SQL.

---

## §D7. Security

### User input in a client-only search

**Q:** What injection/security surface does a pure client-side search have, and what would you
counter in review?

**Direct answer:** Minimal — the client never sends data to a server, so there's no SQL/SSRF
surface. The main risks are XSS via rendered *data* (event/place descriptions built by hand for
now — future risk when user-generated content arrives) and exposing PII through any future API.

**Concept:** Client-side search = no injection sink for user input *you control at runtime*; the
danger shifts to (a) third-party/user-generated content rendered as HTML, (b) an API backend
at the URL boundary (injection, rate limiting, auth), (c) secrets accidentally committed (none
here, but a real CI hygiene issue — see §D10).

**Why / tradeoffs:** React escapes text children by default — a genuine safety freebie. The gap:
any `dangerouslySetInnerHTML` (none found) or future UGC. Keep rendering text-as-text.

**In this project:** All place/event strings render as React children (e.g., `PlacePage.tsx`,
`EventsFeed.tsx`) — no HTML injection path today. The real future surface: the backend
described in §D1.

**Edge cases:** A malicious venue name (future UGC, e.g. "`<img onerror>`") — React escapes it
today; an attacker-supplied payload in `localStorage` keys — readers validate shapes.

**Interviewer's intent:** Calmly scope a threat model — recognizing when "no backend" genuinely
shrinks the surface versus hand-waving.

---

## §D8. Performance & Scalability

### Reveal animations vs. layout thrash

**Q:** The landing uses `IntersectionObserver`-driven reveals. Why is that better than a scroll
listener for animation?

**Direct answer:** IntersectionObserver is browser-native: the callback fires only when elements
cross a viewport threshold, with no scroll-event floods, forced reflows, or manual offset
math.

**Concept:** Scroll listeners run on every pixel scrolled regardless of what changed; IO batches
intersection reports into a single callback tick. Results: bigger, but far fewer codepaths.

**Why / tradeoffs:** Paid-for with careful caps: threshold 0.15, `-40px` rootMargin
(`useScrollReveal.ts:14`). Tradeoff: element *must* be in the DOM and observed — the
MutationObserver re-observation covers route-mounted content.

**Edge cases:** Reduced motion — bypassed with a `prefers-reduced-motion` early check (`:7-22`).
Elements above the fold at load — IO catches them at first intersection.

**Interviewer's intent:** Performance literacy — knowing the native primitives and their cost
profile.

### localstorage write per keystroke

**Q:** Favorites/plan writes happen in a state effect — every toggle rewrites the whole JSON.
Is that a problem?

**Direct answer:** Not at this scale (80 entries → a few KB), but it's O(state) per write; the
fix at larger scale is writing only deltas or batching writes via a debounced flush.

**Concept:** `JSON.stringify` of the full array per change is fine for small arrays; the cost is
serialization and a synchronous main-thread write on every toggle. Batch (debounce) if writes
become frequent.

**Why / tradeoffs:** Correct and simplest vs. a write-ahead-buffer (complexity, wrong-write risk).
Severity is bounded because these are small, infrequent data.

**In this project:** `useEffect` at `useFavorites.ts:20-26` / `usePlan.ts:37-43`.

**At scale:** Plans/favorites for a logged-in user belong server-side anyway (§D1); this
perfection is a prototype concern — note it in a review, don't over-engineer.

**Interviewer's intent:** Proportionate performance instincts — can you tell trivial from real.

---

## §D9. Testing & QA

### Integration-style tests, no shallow rendering

**Q:** What's your testing contract, and why integration-style?

**Direct answer:** Vitest + RTL + jest-dom + `user-event`; render real components, drive them
via the DOM, and assert on user-visible output — never rely on shallow rendering or component
internals.

**Concept:** RTL's philosophy: "the more your tests resemble the way your software is used, the
more confidence they give." `user-event` synthesizes real pointer/keyboard sequences (vs.
`fireEvent`, which dispatches one synthetic event and skips real user-behavior wrapping).

**Why / tradeoffs:** Integration tests catch regressions shallow tests miss (a11y wiring,
aria roles, event flows) at the cost of slower execution — managed by a 20s test timeout in
`vitest.config.ts` and jsdom.

**In this project:** `src/test/setup.ts` global cleanup + jest-dom; contract enforced by tests
like `PlannerPage.test.tsx` (add/remove/day-assign), `Showcase.test.tsx` (search), and
`eventsUtils.test.ts` (pure logic). Setup at `vitest.config.ts`.

**Edge cases:** Async render timing (await removal assertion); `user-event` requires `await`;
avoid testing implementation details like internal state.

**Interviewer's intent:** Testing philosophy + pragmatism — RTL is the universal baseline, and
`user-event` over `fireEvent` is a flag interviewers look for.

### Pure logic separated for testability

**Q:** `eventsUtils.test.ts` tests date math with a fixed `today`. Why pass `today` instead of
`new Date()`?

**Direct answer:** Deterministic time: the function takes `today` as an argument, so tests inject
a known Tuesday and assert exact expected windows — no flaky "depends on when CI ran" failures.

**Concept:** Dependency injection of "now" makes time-based logic pure. `Date.now()` in the
function body = untestable. It also documents intent: "window is relative to the caller's clock."

**Why / tradeoffs:** Slight caller burden (call sites must pass `today` — e.g., `EventsFeed.tsx`
passes `today` from hook state) for perfect determinism. Peer-review repro: fails are
reproducible.

**In this project:** `src/features/live/eventsUtils.test.ts` asserts `formatDayLabel`,
`eventsForWindow(today/tomorrow/weekend)`, `happeningNow` on fixed dates.

**Interviewer's intent:** Do you design for testability (inject clocks) rather than fight
flakiness after.

---

## §D10. CI/CD & DevOps

### Setting up CI for a Vite SPA

**Q:** Walk me through the CI you'd wire for this repo.

**Direct answer:** A GitHub Actions workflow on push/PR to `main`: `pnpm install` (with a `pnpm`
version pinned via `action/setup-node` cache), then `lint`, `test`, and `build`/`tsc -b` so type
errors fail CI, not just the build.

**Concept:** CI = automated verification gate. Vite + Vitest make it three commands; the `build`
script already runs `tsc -b && vite build` (`package.json`), so a green build proves type
soundness too.

**Why / tradeoffs:** Cache the pnpm store (`~/.local/share/pnpm/store` via setup-node's
`cache: pnpm`) to cut install from minutes to seconds. Tradeoff: parallel lanes (lint/test on
one runner) vs. cost.

**In this project:** `.github/workflows/ci.yml` (added during bootstrap): `actions/checkout@v4`
→ `setup-node@v4` with `node-version: 22` (matches local runtime) → `pnpm/action-setup@v4` →
`pnpm install --frozen-lockfile` → `pnpm lint` → `pnpm test` → `pnpm build`.

**Edge cases:** `--frozen-lockfile` fails if lockfile drift — forces intentional dep changes;
cache misses on new branches (correct, just slower); flaky network — retries via the action
defaults.

**Interviewer's intent:** CI literacy and whether you understand exactly what "green build"
covers (esp. type-checking via `tsc -b`).

---

## §D11. Accessibility

### Semantic roles in the header nav

**Q:** The header nav announces itself with `aria-label="Main navigation"` and a `ul/li` list.
Why those choices?

**Direct answer:** `<nav aria-label>` gives screen-reader users a landmarks list to jump to, and
list semantics tell assistive tech there are N items of equal status — plus the links carry real
text so the accessible name is descriptive.

**Concept:** Landmarks (`nav`, `main`, `footer`) + labels are what SR users use to skip around a
page without reading every node. An unlabeled element with multiple navs is ambiguity; one nav
with a label is a named landmark.

**Why / tradeoffs:** Cost is near-zero (attributes on existing tags). The header is a
first-touch surface, so this is the highest-ROI a11y surface in the app.

**In this project:** `src/components/Header.tsx` — `<nav aria-label="Main navigation">` with
`<ul><li><Link/a>` items; the same list renders for the anchor sections and the `/plan` Link.

**Edge cases:** Icon-only buttons (e.g., theme toggle) must carry `aria-label` — they do
(`ThemeToggle.tsx` buttons: `aria-label=\`${label} theme\``) — because icons alone have no
accessible name.

**Interviewer's intent:** Whether a11y is a feature or a checklist — semantics + labels express
it immediately.

### Focus behavior in the planner

**Q:** The planner adds/removes cards dynamically. What a11y concerns follow?

**Direct answer:** Focus management and announced state changes: when a venue is removed, focus
should move somewhere predictable (or at least not vanish to `body`), and the day-count/removal
changes read naturally.

**Concept:** Removal shifts the tab order; if focus lands on removed content, SR users get lost.
`aria-live` regions announce dynamic count updates; focus fallback (e.g., to the column
heading) avoids the "speech cursor floats" failure.

**Why / tradeoffs:** Explicit focus management costs some logic; the fallback here is minimal
(dynamic count via visible text/`aria-live`) vs. a full focus-trap (overkill for a single-page
interaction).

**In this project:** Day columns render counts in plain text (`PlannerPage.tsx`), with a
still-deciding pool label; the tests assert label/count text, which doubles as the surface SR
users hear.

**Edge cases:** Keyboard-only removal must be possible (remove button reachable); don't rely on
hover-only affordances.

**Interviewer's intent:** A11y depth beyond "alt text" — focus and live-region behavior on
dynamic content.

---

## §D14. Behavioral & Decisions

### Choosing React + Vite + Tailwind over a meta-framework

**Q:** Tell me about a time you chose a stack. (Ground: DECISIONS.md — SPA stack.)

**Answer (STAR):** **Situation:** Building a local-discovery product shell from scratch.
**Task:** Pick the stack for a fast, polished, responsive prototype. **Action:** (chose
React 19 + Vite 8 + TS + Tailwind v4). **Result:** HMR in ms, deterministic tests in Vitest,
zero-config theming, and a production build — plus the SPA keeps the entire product
prototype testable in one process.

**Behavioral notes:** Emphasize the *decision trade-off* (SPA vs. SSR: no SEO/pre-render
original sin muted by the app being a demo; meta-frameworks add server complexity), and the
*pivot path* (data layer stays swappable so a future API/SSR doesn't require a rewrite).

**Interviewer's intent:** Seniority signal — can you justify a choice against costs, not just
list it.

### Scope-matching: local storage instead of a database

**Q:** Tell me about cutting a feature or using a stopgap on purpose.

**Answer (STAR):** **Situation:** Milestone 3 required a favorites + planner persistence.
**Task:** Support it without a backend. **Action:** `localStorage` hooks with strict
read-validation and write failsafes; froze no architectural decision in. **Result:** feature
shipped synchronously; documented the backend path in the roadmap (M4+), and it remains a
swap, not a rewrite.

**Behavioral notes:** Show that you can name *what you deliberately did NOT build* and why
that was the right call at the time.

**Interviewer's intent:** Judgment under scope pressure + ability to state a tradeoff plainly.

### Recovering from the bad nav commit

**Q:** Tell me about a time something you shipped didn't work.

**Answer (STAR):** **Situation:** The `/plan` route shipped but the header nav broke: landing
section anchors were dead links from other routes (and a nav "Plan" entry initially... ) **Task:**
Make every nav link work from every route. **Action:** Converted hash-only anchors to router
`Links`, added a `location.hash` scroll effect in `AppShell`, fixed the system-theme icon,
and re-verified with the full gate (lint/test/build). **Result:** navigation functional from
all routes, verified by tests that previously would not have caught a route-level regression;
goal: tighten the suite with a cross-route navigation test.

**Behavioral notes:** Own the correction, name the verification gap, commit to closing it
(test that assertion).

**Interviewer's intent:** Failure recovery and post-incident follow-through — STAR with a
visible lesson.

---

## §D15. Project Deep-Dive (answers only WAI if you worked here)

### 1. Where do the "Live now" vs. tomorrow-buffer edge cases actually live?

`happeningNow` (`src/data/events.ts:215`) uses weekday + minutes-of-day; `eventsForWindow`
(`:221`) filters by window with modular wraparound; `EventsFeed.tsx` passes `today` from state
and renders a `Live now` chip when `happeningNow` is true. Nail the `% 7` and `>= start && <
end` specifics to sound credible.

### 2. How do favorites survive reload, and what's the hook's failure mode?

`useFavorites` (`src/hooks/useFavorites.ts`) lazy-inits from `agora:favorites`, writes on
every change; failure mode is a write quota (private browsing) — it silently stops persisting,
which the try/catch accepts deliberately.

### 3. Why do the two localStorage keys differ (`agora:favorites` vs `agora:plan`)?

Collision avoidance + versioned namespace: each store has its own key, namespaced with the app
name, so a future `agora:something` won't clobber them and multiple apps on the same origin
don't interleave.

### 4. What's the one place client/server logic would currently diverge?

`getRelated` (`src/data/places.ts`) slices related places by category then falls back to a
head slice — if data ever becomes server-driven, that selector moves server-side and the exact
"top related" definition can drift. The data-module API is the seam.

### 5. How would you add "geo near me" sorting today?

Add `map: {x, y}` already exists per place (`src/data/places.ts:16`); compute distance from a
reference point (e.g., Euclidean or haversine), sort in `getPlacesByCategory` behind an
optional `opts` argument, debounce search input, and gate the feature behind a geolocation
permission that never blocks the default experience.

---

## Sprint Reviews

### Sprint 1 — Project Init → current (2026-09-20 → 2026-09-24)

**T3 deep-dive:** "Draw the whole app as it ships today." Answer: single `AppShell` layout
route (Header/Footer/persistent) hosting three children — landing with segmented sections
(Hero/Stats/Showcase/Events/Features/BrandStory/HowItWorks/Testimonials/CTA), `/place/:slug`
detail, and `/plan` planner; data flows from `src/data` fixtures through named accessors into
feature components; persistence via two namespaced localStorage hooks; theming via `dark`
class + Tailwind v4 tokens; navigation via router `Links` + a hash-scroll effect; scroll-reveal
via IntersectionObserver/MutationObserver with reduced-motion bypass. All of this is testable
in Vitest + RTL against a jsdom environment.

---

## Project Scan (Post-Hoc)

Scan performed 2026-09-24 against the committed codebase (`ad15408`). Questionnaire generated
from live session history; see Story Entries and §D1–§D15 above.

---

## Behavioral & Decision Trail

Logged in `DECISIONS.md`: the "Agora" name choice, and the SPA stack choice. Both mapped to
STAR stories in §D14.

---

## Personal Study Queue

| Question | Domain | Status (strong / weak / repeat) | Last drilled |
|---|---|---|---|
| Modular weekend math (`offsetToWeekday`, `% 7`) | D2 | review | 2026-09-24 |
| `useState(fn)` lazy init + SSR guard | D3 | review | 2026-09-24 |
| `matchMedia` system-theme subscription + cleanup | D4 | review | 2026-09-24 |
| Client-only SPA threat model | D7 | review | 2026-09-24 |