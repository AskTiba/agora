import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { Showcase } from './Showcase'

function renderShowcase() {
  return render(
    <MemoryRouter>
      <Showcase />
    </MemoryRouter>,
  )
}

const card = (name: RegExp) => ({ name: new RegExp(`view details for ${name.source}`, 'i') })

describe('Showcase section', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('renders the first batch of place cards on load', () => {
    renderShowcase()
    expect(screen.getByRole('button', card(/rolex & chapati corner/i))).toBeInTheDocument()
    expect(screen.getByRole('button', card(/mama o's luwombo house/i))).toBeInTheDocument()
    expect(screen.getByRole('button', card(/nile perch grill/i))).toBeInTheDocument()
    expect(screen.getByRole('button', card(/acacia brunch bistro/i))).toBeInTheDocument()
  })

  it('does not render all places at once until Load more is used', () => {
    renderShowcase()
    expect(screen.queryByRole('button', card(/the curry pot/i))).not.toBeInTheDocument()
    expect(screen.queryByRole('button', card(/kisementi gelato lab/i))).not.toBeInTheDocument()
    expect(screen.getByText(/showing 8 of \d+ places/i)).toBeInTheDocument()
  })

  it('reveals more places after clicking Load more', async () => {
    const user = userEvent.setup()
    renderShowcase()

    await user.click(screen.getByRole('button', { name: /load more places/i }))

    expect(screen.getByText(/showing 16 of \d+ places/i)).toBeInTheDocument()
    expect(screen.getByRole('button', card(/the curry pot/i))).toBeInTheDocument()
  })

  it('filters cards by selected category and resets the batch', async () => {
    const user = userEvent.setup()
    renderShowcase()

    await user.click(screen.getByRole('tab', { name: /sports & fitness/i }))

    expect(screen.getByRole('button', card(/kampala road runners/i))).toBeInTheDocument()
    expect(screen.getByRole('button', card(/lake victoria kayak club/i))).toBeInTheDocument()
    expect(screen.queryByRole('button', card(/rolex & chapati corner/i))).not.toBeInTheDocument()
    expect(screen.queryByRole('button', card(/the grand hotel/i))).not.toBeInTheDocument()
  })

  it('hides the Load more button when a category has few places', async () => {
    const user = userEvent.setup()
    renderShowcase()

    await user.click(screen.getByRole('tab', { name: /essential services/i }))

    expect(screen.getByRole('button', card(/better life pharmacy/i))).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /load more places/i })).not.toBeInTheDocument()
  })

  it('searches across names, categories, and tags', async () => {
    const user = userEvent.setup()
    renderShowcase()

    await user.type(screen.getByRole('searchbox'), 'chess')
    expect(screen.getByRole('button', card(/the rook & pawn chess club/i))).toBeInTheDocument()
    expect(screen.queryByRole('button', card(/rolex & chapati corner/i))).not.toBeInTheDocument()

    await user.clear(screen.getByRole('searchbox'))
    await user.type(screen.getByRole('searchbox'), 'silent disco')
    expect(screen.getByRole('button', card(/makindye rooftop silent disco/i))).toBeInTheDocument()
  })

  it('updates the result count while searching', async () => {
    const user = userEvent.setup()
    renderShowcase()

    expect(screen.getByText(/80 places found/i)).toBeInTheDocument()

    await user.type(screen.getByRole('searchbox'), 'marathon')
    expect(screen.getByText(/1 place found/i)).toBeInTheDocument()
    expect(screen.getByRole('button', card(/kampala road runners/i))).toBeInTheDocument()
  })

  it('shows an empty state when nothing matches and clears filters', async () => {
    const user = userEvent.setup()
    renderShowcase()

    await user.type(screen.getByRole('searchbox'), 'zzzz nonexistent')

    expect(screen.getByText(/no places match your current search and filters/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /clear all filters/i }))
    expect(screen.getByRole('button', card(/rolex & chapati corner/i))).toBeInTheDocument()
  })

  it('toggles favorites and filters to show only favorites', async () => {
    const user = userEvent.setup()
    renderShowcase()

    await user.click(screen.getByRole('button', { name: /add nile perch grill to favorites/i }))
    expect(
      screen.getByRole('button', { name: /remove nile perch grill from favorites/i }),
    ).toHaveAttribute('aria-pressed', 'true')

    await user.click(screen.getByRole('button', { name: /filter to favorites/i }))

    expect(screen.getByRole('button', card(/nile perch grill/i))).toBeInTheDocument()
    expect(screen.queryByRole('button', card(/rolex & chapati corner/i))).not.toBeInTheDocument()
    expect(screen.getByText(/1 place found/i)).toBeInTheDocument()
  })

  it('persists favorites across renders', async () => {
    const user = userEvent.setup()
    const first = render(
      <MemoryRouter>
        <Showcase />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /add nile perch grill to favorites/i }))
    first.unmount()

    renderShowcase()

    expect(
      screen.getByRole('button', { name: /remove nile perch grill from favorites/i }),
    ).toHaveAttribute('aria-pressed', 'true')
  })

  it('renders map pins for the visible places', () => {
    renderShowcase()
    expect(screen.getByRole('button', { name: /show rolex & chapati corner on map/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /show the grand hotel on map/i })).not.toBeInTheDocument()
  })

  it('opens the place dialog when a map pin is clicked', async () => {
    const user = userEvent.setup()
    renderShowcase()

    await user.click(screen.getByRole('button', { name: /show rolex & chapati corner on map/i }))

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(within(dialog).getByRole('heading', { name: /rolex & chapati corner/i })).toBeInTheDocument()
  })

  it('opens a place detail dialog when a card is clicked', async () => {
    const user = userEvent.setup()
    renderShowcase()

    await user.click(screen.getByRole('button', card(/rolex & chapati corner/i)))

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(within(dialog).getByRole('heading', { name: /rolex & chapati corner/i })).toBeInTheDocument()
    expect(within(dialog).getByText(/plot 8, kisementi, kololo/i)).toBeInTheDocument()
    expect(within(dialog).getByRole('link', { name: /open full page/i })).toHaveAttribute(
      'href',
      '/place/bombo-road-rolex',
    )
  })

  it('closes the dialog on Escape and via the close button', async () => {
    const user = userEvent.setup()
    renderShowcase()

    await user.click(screen.getByRole('button', card(/nile perch grill/i)))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', card(/nile perch grill/i)))
    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})