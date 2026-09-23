import { EVENTS, type EventItem } from './events'
import { PLACES, type Place } from './places'

export type { EventItem } from './events'
export type { Place } from './places'

let cachedPlaces: Place[] | null = null
let cachedEvents: EventItem[] | null = null
let loadStarted = false
let version = 0
const listeners = new Set<() => void>()

function isValidPlace(value: unknown): value is Place {
  if (!value || typeof value !== 'object') return false
  const entry = value as Record<string, unknown>
  return (
    typeof entry.slug === 'string' &&
    typeof entry.name === 'string' &&
    typeof entry.category === 'string' &&
    typeof entry.rating === 'number'
  )
}

function isValidEvent(value: unknown): value is EventItem {
  if (!value || typeof value !== 'object') return false
  const entry = value as Record<string, unknown>
  return (
    typeof entry.slug === 'string' &&
    typeof entry.title === 'string' &&
    typeof entry.placeSlug === 'string' &&
    typeof entry.weekday === 'number'
  )
}

function validPlaces(value: unknown): value is Place[] {
  return Array.isArray(value) && value.length > 0 && value.every(isValidPlace)
}

function validEvents(value: unknown): value is EventItem[] {
  return Array.isArray(value) && value.length > 0 && value.every(isValidEvent)
}

function emit(): void {
  version += 1
  for (const listener of listeners) listener()
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getSnapshot(): number {
  return version
}

export function getPlaces(): Place[] {
  return cachedPlaces ?? PLACES
}

export function getEvents(): EventItem[] {
  return cachedEvents ?? EVENTS
}

export function getPlaceBySlug(slug: string): Place | undefined {
  return getPlaces().find((place) => place.slug === slug)
}

export function getPlacesByCategory(category: string): Place[] {
  const places = getPlaces()
  return category === 'All' ? places : places.filter((place) => place.category === category)
}

export function getRelated(slug: string, count = 3): Place[] {
  const places = getPlaces()
  const place = getPlaceBySlug(slug)
  if (!place) return places.slice(0, count)
  return places
    .filter((p) => p.slug !== slug && p.category === place.category)
    .concat(places.filter((p) => p.slug !== slug && p.category !== place.category))
    .slice(0, count)
}

/**
 * Tries to hydrate the catalogue from the JSON files shipped with the deploy
 * (public/data/*). Falls back to the bundled fixtures on any failure so the
 * app stays fully functional offline and in tests.
 */
export async function loadCatalogue(
  fetchImpl: typeof globalThis.fetch = fetch,
): Promise<void> {
  if (loadStarted) return
  loadStarted = true
  try {
    const [placesRes, eventsRes] = await Promise.all([
      fetchImpl('data/places.json'),
      fetchImpl('data/events.json'),
    ])
    if (!placesRes.ok || !eventsRes.ok) return
    const [placesJson, eventsJson] = await Promise.all([
      placesRes.json(),
      eventsRes.json(),
    ])
    if (validPlaces(placesJson)) cachedPlaces = placesJson
    if (validEvents(eventsJson)) cachedEvents = eventsJson
    emit()
  } catch {
    // fall back to the bundled fixtures — the catalogue stays fully functional
  }
}

export function resetCatalogue(): void {
  cachedPlaces = null
  cachedEvents = null
  loadStarted = false
  emit()
}