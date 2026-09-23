import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { PlannerPage } from './PlannerPage'

const FAV_KEY = 'agora:favorites'
const PLAN_KEY = 'agora:plan'

function seedStorage(entries: [string, string][]) {
  for (const [k, v] of entries) window.localStorage.setItem(k, v)
}

function seedFavorites(slugs: string[]) {
  seedStorage([[FAV_KEY, JSON.stringify(slugs)]])
}

function seedPlan(plan: Record<string, string>) {
  seedStorage([[PLAN_KEY, JSON.stringify(plan)]])
}

function renderPlanner() {
  const { container } = render(
    <MemoryRouter>
      <PlannerPage />
    </MemoryRouter>,
  )
  return { container }
}

describe('PlannerPage', () => {
  beforeEach(() => window.localStorage.clear())

  it('shows an empty state pointing back to explore when nothing is saved', () => {
    renderPlanner()

    expect(
      screen.getByRole('heading', { name: /plan your neighborhood days/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /explore the neighborhood/i }),
    ).toBeInTheDocument()
  })

  it('lists every saved spot in the still-deciding tray', () => {
    seedFavorites(['nile-perch-grill', 'bombo-road-rolex'])
    renderPlanner()

    expect(screen.getByText(/nile perch grill/i)).toBeInTheDocument()
    expect(screen.getByText(/rolex & chapati corner/i)).toBeInTheDocument()
  })

  it('persists a today-assignment and moves the spot out of the deciding tray', async () => {
    const user = userEvent.setup()
    seedFavorites(['nile-perch-grill'])
    renderPlanner()

    const row = screen.getByText(/nile perch grill/i).closest('li') as HTMLElement
    await user.click(within(row).getByRole('button', { name: /^today$/i }))

    expect(JSON.parse(window.localStorage.getItem(PLAN_KEY) ?? '{}')).toEqual({
      'nile-perch-grill': 'today',
    })
    expect(
      screen.queryByRole('heading', { name: /still deciding/i }),
    ).not.toBeInTheDocument()
  })

  it('renders planned spots under their day column and returns them on remove', async () => {
    const user = userEvent.setup()
    seedFavorites(['nile-perch-grill'])
    seedPlan({ 'nile-perch-grill': 'today' })
    renderPlanner()

    const today = screen.getByRole('heading', { name: /^today$/i }).closest('section') as HTMLElement
    expect(within(today).getByRole('link', { name: /nile perch grill/i })).toBeInTheDocument()

    await user.click(
      within(today).getByRole('button', { name: /remove nile perch grill from today plan/i }),
    )
    expect(JSON.parse(window.localStorage.getItem(PLAN_KEY) ?? '{}')).toEqual({})
  })
})
