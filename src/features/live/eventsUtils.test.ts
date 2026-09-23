import { describe, expect, it } from 'vitest'
import {
  EVENTS,
  eventsForWindow,
  formatDayLabel,
  happeningNow,
  offsetToWeekday,
  type EventItem,
} from '../../data/events'

const TUESDAY = new Date(2026, 8, 22, 10, 0, 0)

function eventWith(weekday: number, startTime: string, endTime: string): EventItem {
  return {
    slug: 'test-event',
    title: 'Test Event',
    placeSlug: 'bombo-road-rolex',
    weekday,
    startTime,
    endTime,
    price: 'Free',
    tag: 'Test',
    description: '',
  }
}

describe('event date utilities', () => {
  it('computes the weekday offset from a given date', () => {
    expect(TUESDAY.getDay()).toBe(2)
    expect(offsetToWeekday(6, TUESDAY)).toBe(4)
    expect(offsetToWeekday(0, TUESDAY)).toBe(5)
    expect(offsetToWeekday(2, TUESDAY)).toBe(0)
    expect(offsetToWeekday(3, TUESDAY)).toBe(1)
  })

  it('formats a readable day label for an upcoming weekday', () => {
    expect(formatDayLabel(6, TUESDAY)).toBe('Sat, Sep 26')
  })

  it('buckets events by the today window', () => {
    const results = eventsForWindow(EVENTS, 'today', TUESDAY)
    expect(results.some((event) => event.slug === 'book-club-tuesday')).toBe(true)
    expect(results.some((event) => event.slug === 'cupping-hour-tuesday')).toBe(true)
    expect(results.some((event) => event.slug === 'silent-disco-friday')).toBe(false)
  })

  it('buckets events by the tomorrow window', () => {
    const results = eventsForWindow(EVENTS, 'tomorrow', TUESDAY)
    expect(results.some((event) => event.slug === 'five-a-side-league')).toBe(true)
    expect(results.some((event) => event.slug === 'book-club-tuesday')).toBe(false)
  })

  it('buckets upcoming weekend events and excludes today', () => {
    const results = eventsForWindow(EVENTS, 'weekend', TUESDAY)
    expect(results.some((event) => event.slug === 'ggaba-lakeside-weekend-market')).toBe(true)
    expect(results.some((event) => event.slug === 'book-club-tuesday')).toBe(false)
  })

  it('detects an event happening right now', () => {
    const midday = eventWith(2, '09:00', '17:00')
    expect(happeningNow(midday, new Date(2026, 8, 22, 12, 0))).toBe(true)
    expect(happeningNow(midday, new Date(2026, 8, 22, 18, 0))).toBe(false)
    expect(happeningNow(midday, new Date(2026, 8, 23, 12, 0))).toBe(false)
  })
})