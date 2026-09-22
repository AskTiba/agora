export type EventsWindow = 'today' | 'tomorrow' | 'weekend'

export const EVENT_WINDOWS: { key: EventsWindow; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'tomorrow', label: 'Tomorrow' },
  { key: 'weekend', label: 'This Weekend' },
]

export interface EventItem {
  slug: string
  title: string
  placeSlug: string
  weekday: number
  startTime: string
  endTime: string
  price: string
  tag: string
  description: string
}

export const EVENTS: EventItem[] = [
  {
    slug: 'farmers-market-weekly',
    title: 'Riverside Farmers Market',
    placeSlug: 'riverside-farmers-market',
    weekday: 6,
    startTime: '08:00',
    endTime: '13:00',
    price: 'Free entry',
    tag: 'Recurring',
    description: 'Sixty stalls of greens, cheese, honey, and hot griddles under the elms. Bring your own tote.',
  },
  {
    slug: 'silent-disco-friday',
    title: 'Silent Disco — Three Channels',
    placeSlug: 'the-frequency-silent-disco',
    weekday: 5,
    startTime: '21:00',
    endTime: '23:30',
    price: '£8 cover',
    tag: 'Weekly',
    description: 'Dance to pop, house, or Afrobeats on your own headphones while your neighbors hear none of it.',
  },
  {
    slug: 'nightowl-live-jazz',
    title: 'Live Jazz Set',
    placeSlug: 'nightowl-jazz-bar',
    weekday: 5,
    startTime: '20:00',
    endTime: '23:00',
    price: '£5 cover',
    tag: 'Featured',
    description: 'The house trio, two vocal features, and late-night bites at the neighborhood\u2019s favorite speakeasy.',
  },
  {
    slug: 'blitz-chess-thursday',
    title: 'Blitz Chess Night',
    placeSlug: 'the-rook-and-pawn-chess-club',
    weekday: 4,
    startTime: '19:00',
    endTime: '23:00',
    price: 'Free',
    tag: 'Recurring',
    description: 'Five-minute chess across sixty boards, with the house champion defending the table in the corner.',
  },
  {
    slug: 'sunrise-striders-monday',
    title: 'Group Run & Water Stops',
    placeSlug: 'sunrise-striders-run-collective',
    weekday: 1,
    startTime: '06:00',
    endTime: '07:30',
    price: 'Free',
    tag: 'Community Pick',
    description: 'Sunrise pace groups for every level along the river, with water stops and a coffee stop after.',
  },
  {
    slug: 'astro-league-night',
    title: 'Wednesday Five-a-Side League',
    placeSlug: 'astro-five-a-side-arena',
    weekday: 3,
    startTime: '18:00',
    endTime: '21:00',
    price: '£30/team',
    tag: 'League',
    description: 'Floodlit all-weather fixtures across three divisions. Spectators get the side-bar seats.',
  },
  {
    slug: 'palm-padel-social',
    title: 'Padel Social Mixer',
    placeSlug: 'palm-court-padel-club',
    weekday: 6,
    startTime: '09:00',
    endTime: '12:00',
    price: '£5',
    tag: 'New',
    description: 'Racket in hand, no partner needed — the courts manager pairs you up for easygoing doubles.',
  },
  {
    slug: 'pottery-first-timers-sunday',
    title: 'Hands-on Pottery for Beginners',
    placeSlug: 'clay-and-kiln-pottery-studio',
    weekday: 0,
    startTime: '11:00',
    endTime: '14:00',
    price: '£15',
    tag: 'Workshop',
    description: 'Wheel-throwing basics with the studio team. Whatever you make gets fired and ready by next Sunday.',
  },
  {
    slug: 'wicker-book-club',
    title: 'Monthly Book Club',
    placeSlug: 'the-wicker-bookshop',
    weekday: 2,
    startTime: '19:00',
    endTime: '20:30',
    price: 'Free',
    tag: 'Recurring',
    description: 'Cozy chairs, strong opinions, and the resident cat named Page. This month: a short-story collection.',
  },
  {
    slug: 'makers-build-night',
    title: 'Build Night — Laser Cutter Intro',
    placeSlug: 'the-makers-shed',
    weekday: 4,
    startTime: '18:30',
    endTime: '21:30',
    price: 'Members free',
    tag: 'Build Night',
    description: 'Bring a project or start one. Pizza arrives at 8pm; the laser cutter gets booked out fast.',
  },
  {
    slug: 'story-time-saturday',
    title: 'Saturday Story Hour',
    placeSlug: 'story-time-corner',
    weekday: 6,
    startTime: '10:00',
    endTime: '11:30',
    price: 'Free',
    tag: 'Family',
    description: 'Cushion-and-cupboard stories, a costume box, and the strict house rule of cookies for all.',
  },
  {
    slug: 'story-time-sunday',
    title: 'Sunday Afternoon Story Hour',
    placeSlug: 'story-time-corner',
    weekday: 0,
    startTime: '15:00',
    endTime: '16:30',
    price: 'Free',
    tag: 'Family',
    description: 'A calmer afternoon edition with longer tales and a quieter room for the literary-minded kids.',
  },
  {
    slug: 'gallery-onyx-first-friday',
    title: 'Gallery Onyx Opening Night',
    placeSlug: 'gallery-onyx',
    weekday: 5,
    startTime: '18:00',
    endTime: '21:00',
    price: 'Free',
    tag: 'Featured',
    description: 'First Friday unveiling — regional contemporary artists, two new installations, live sampling at the bar.',
  },
  {
    slug: 'splash-saturday-swim',
    title: 'Morning Lane Swimming',
    placeSlug: 'splash-harbor-swim-school',
    weekday: 6,
    startTime: '08:00',
    endTime: '11:00',
    price: '£4',
    tag: 'Recurring',
    description: 'Quiet lanes, warm water, and the sauna round the back to finish your Saturday morning.',
  },
  {
    slug: 'volunteer-river-clean',
    title: 'Riverbank Clean-Up Crew',
    placeSlug: 'volunteer-hub-36',
    weekday: 6,
    startTime: '09:00',
    endTime: '12:00',
    price: 'Free',
    tag: 'Community Pick',
    description: 'Gloves, bags, and coffee provided. An hour helping keeps the riverside green and clean.',
  },
  {
    slug: 'roast-and-review-tuesday',
    title: 'Cupping Hour + Discount Blends',
    placeSlug: 'the-daily-grind-roastery',
    weekday: 2,
    startTime: '10:00',
    endTime: '11:00',
    price: 'Free',
    tag: 'Weekly',
    description: 'Taste the week\u2019s single origins straight from the roaster, then take 10% off the blend of the day.',
  },
]

export function offsetToWeekday(target: number, today: Date): number {
  return (target - today.getDay() + 7) % 7
}

export function formatDayLabel(weekday: number, today: Date): string {
  const date = new Date(today)
  date.setDate(today.getDate() + offsetToWeekday(weekday, today))
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export function happeningNow(event: EventItem, now: Date): boolean {
  if (event.weekday !== now.getDay()) return false
  const current = now.getHours() * 60 + now.getMinutes()
  return current >= toMinutes(event.startTime) && current < toMinutes(event.endTime)
}

export function eventsForWindow(events: EventItem[], window: EventsWindow, today: Date): EventItem[] {
  const todayDay = today.getDay()
  switch (window) {
    case 'today':
      return events.filter((event) => event.weekday === todayDay)
    case 'tomorrow': {
      const tomorrowDay = (todayDay + 1) % 7
      return events.filter((event) => event.weekday === tomorrowDay)
    }
    case 'weekend':
      return events.filter(
        (event) =>
          (event.weekday === 6 || event.weekday === 0) && offsetToWeekday(event.weekday, today) >= 2,
      )
  }
}