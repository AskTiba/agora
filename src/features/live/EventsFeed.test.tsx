import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { EventsFeed } from './EventsFeed'

function renderEvents() {
  return render(
    <MemoryRouter>
      <EventsFeed />
    </MemoryRouter>,
  )
}

describe('EventsFeed', () => {
  it('renders the section heading and day tabs', () => {
    renderEvents()
    expect(screen.getByRole('heading', { name: /happening in your neighborhood/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /today/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /tomorrow/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /this weekend/i })).toBeInTheDocument()
  })

  it('shows at least one event with a venue link for today', () => {
    renderEvents()
    expect(screen.getByText(/\d+ events? scheduled/i)).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /^view /i }).length).toBeGreaterThan(0)
  })

  it('switches the list when a different day tab is selected', async () => {
    const user = userEvent.setup()
    renderEvents()

    await user.click(screen.getByRole('tab', { name: /this weekend/i }))

    const venueLinks = screen.getAllByRole('link', { name: /^view /i })
    expect(venueLinks.length).toBeGreaterThan(0)
    expect(venueLinks[0]).toHaveAttribute('href', expect.stringMatching(/^\/place\//) as unknown as string)
  })
})