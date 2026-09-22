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
    expect(screen.getByRole('button', card(/the green leaf café/i))).toBeInTheDocument()
    expect(screen.getByRole('button', card(/casa manos/i))).toBeInTheDocument()
    expect(screen.getByRole('button', card(/golden crust bakery/i))).toBeInTheDocument()
    expect(screen.getByRole('button', card(/orbit juice bar/i))).toBeInTheDocument()
  })

  it('does not render all places at once until Load more is used', () => {
    renderShowcase()
    expect(screen.queryByRole('button', card(/riverside park/i))).not.toBeInTheDocument()
    expect(screen.queryByRole('button', card(/nightowl jazz bar/i))).not.toBeInTheDocument()
    expect(screen.getByText(/showing 8 of \d+ places/i)).toBeInTheDocument()
  })

  it('reveals more places after clicking Load more', async () => {
    const user = userEvent.setup()
    renderShowcase()

    await user.click(screen.getByRole('button', { name: /load more places/i }))

    expect(screen.getByText(/showing 16 of \d+ places/i)).toBeInTheDocument()
    expect(screen.getByRole('button', card(/dos malts brewery taproom/i))).toBeInTheDocument()
  })

  it('filters cards by selected category and resets the batch', async () => {
    const user = userEvent.setup()
    renderShowcase()

    await user.click(screen.getByRole('tab', { name: /sports & fitness/i }))

    expect(screen.getByRole('button', card(/riverside park/i))).toBeInTheDocument()
    expect(screen.getByRole('button', card(/sunrise striders run collective/i))).toBeInTheDocument()
    expect(screen.queryByRole('button', card(/the green leaf café/i))).not.toBeInTheDocument()
    expect(screen.queryByRole('button', card(/the grand hotel/i))).not.toBeInTheDocument()
  })

  it('hides the Load more button when a category has few places', async () => {
    const user = userEvent.setup()
    renderShowcase()

    await user.click(screen.getByRole('tab', { name: /arts & culture/i }))

    expect(screen.getByRole('button', card(/the rook & pawn chess club/i))).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /load more places/i })).not.toBeInTheDocument()
  })

  it('searches across names, categories, and tags', async () => {
    const user = userEvent.setup()
    renderShowcase()

    await user.type(screen.getByRole('searchbox'), 'chess')
    expect(screen.getByRole('button', card(/the rook & pawn chess club/i))).toBeInTheDocument()
    expect(screen.queryByRole('button', card(/the green leaf café/i))).not.toBeInTheDocument()

    await user.clear(screen.getByRole('searchbox'))
    await user.type(screen.getByRole('searchbox'), 'silent disco')
    expect(screen.getByRole('button', card(/the frequency silent disco/i))).toBeInTheDocument()
  })

  it('updates the result count while searching', async () => {
    const user = userEvent.setup()
    renderShowcase()

    expect(screen.getByText(/48 places found/i)).toBeInTheDocument()

    await user.type(screen.getByRole('searchbox'), 'marathon')
    expect(screen.getByText(/1 place found/i)).toBeInTheDocument()
    expect(screen.getByRole('button', card(/sunrise striders run collective/i))).toBeInTheDocument()
  })

  it('shows an empty state when nothing matches and clears filters', async () => {
    const user = userEvent.setup()
    renderShowcase()

    await user.type(screen.getByRole('searchbox'), 'zzzz nonexistent')

    expect(screen.getByText(/no places match your current search and filters/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /clear all filters/i }))
    expect(screen.getByRole('button', card(/the green leaf café/i))).toBeInTheDocument()
  })

  it('toggles favorites and filters to show only favorites', async () => {
    const user = userEvent.setup()
    renderShowcase()

    await user.click(screen.getByRole('button', { name: /add casa manos to favorites/i }))
    expect(
      screen.getByRole('button', { name: /remove casa manos from favorites/i }),
    ).toHaveAttribute('aria-pressed', 'true')

    await user.click(screen.getByRole('button', { name: /filter to favorites/i }))

    expect(screen.getByRole('button', card(/casa manos/i))).toBeInTheDocument()
    expect(screen.queryByRole('button', card(/the green leaf café/i))).not.toBeInTheDocument()
    expect(screen.getByText(/1 place found/i)).toBeInTheDocument()
  })

  it('persists favorites across renders', async () => {
    const user = userEvent.setup()
    const first = render(
      <MemoryRouter>
        <Showcase />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /add casa manos to favorites/i }))
    first.unmount()

    renderShowcase()

    expect(
      screen.getByRole('button', { name: /remove casa manos from favorites/i }),
    ).toHaveAttribute('aria-pressed', 'true')
  })

  it('renders map pins for the visible places', () => {
    renderShowcase()
    expect(screen.getByRole('button', { name: /show the green leaf café on map/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /show nightowl jazz bar on map/i })).not.toBeInTheDocument()
  })

  it('opens the place dialog when a map pin is clicked', async () => {
    const user = userEvent.setup()
    renderShowcase()

    await user.click(screen.getByRole('button', { name: /show the green leaf café on map/i }))

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(within(dialog).getByRole('heading', { name: /the green leaf café/i })).toBeInTheDocument()
  })

  it('opens a place detail dialog when a card is clicked', async () => {
    const user = userEvent.setup()
    renderShowcase()

    await user.click(screen.getByRole('button', card(/the green leaf café/i)))

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(within(dialog).getByRole('heading', { name: /the green leaf café/i })).toBeInTheDocument()
    expect(within(dialog).getByText(/214 elm street/i)).toBeInTheDocument()
    expect(within(dialog).getByRole('link', { name: /open full page/i })).toHaveAttribute(
      'href',
      '/place/the-green-leaf-cafe',
    )
  })

  it('closes the dialog on Escape and via the close button', async () => {
    const user = userEvent.setup()
    renderShowcase()

    await user.click(screen.getByRole('button', card(/casa manos/i)))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', card(/casa manos/i)))
    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})