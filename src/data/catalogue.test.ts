import { beforeEach, describe, expect, it } from 'vitest'
import {
  getEvents,
  getPlaceBySlug,
  getPlaces,
  getPlacesByCategory,
  getRelated,
  loadCatalogue,
  resetCatalogue,
} from './catalogue'
import { PLACES } from './places'

function jsonResponse(body: unknown, ok = true): Response {
  return {
    ok,
    json: async () => body,
  } as unknown as Response
}

describe('catalogue data seam', () => {
  beforeEach(() => {
    resetCatalogue()
  })

  it('falls back to the bundled fixtures before the catalogue is loaded', () => {
    expect(getPlaces()).toEqual(PLACES)
    expect(getPlaces().length).toBe(80)
    expect(getEvents().length).toBeGreaterThan(0)
  })

  it('keeps accessor signatures working on the bundled fixtures', () => {
    const rolex = getPlaceBySlug('bombo-road-rolex')
    expect(rolex?.name).toBe('Rolex & Chapati Corner')
    expect(getPlacesByCategory('Food & Drink')).toHaveLength(18)
    expect(getRelated('bombo-road-rolex')[0]?.category).toBe('Food & Drink')
  })

  it('hydrates the catalogue from the shipped JSON when it loads', async () => {
    await loadCatalogue(
      async () => jsonResponse([PLACES[0], PLACES[1]]) as unknown as Promise<Response>,
    )

    expect(getPlaces()).toHaveLength(2)
    expect(getPlaceBySlug('bombo-road-rolex')?.name).toBe('Rolex & Chapati Corner')
  })

  it('ignores malformed or empty payloads and keeps the fixtures', async () => {
    await loadCatalogue(async () => jsonResponse({ not: 'a list' }) as unknown as Response)

    expect(getPlaces()).toEqual(PLACES)
  })

  it('ignores an empty places payload and keeps the fixtures', async () => {
    await loadCatalogue(async () => jsonResponse([]) as unknown as Response)

    expect(getPlaces()).toEqual(PLACES)
  })

  it('falls back to fixtures when a fetch fails', async () => {
    await loadCatalogue(async () => {
      throw new Error('network unreachable')
    })

    expect(getPlaces()).toEqual(PLACES)
    expect(getEvents().length).toBeGreaterThan(0)
  })
})