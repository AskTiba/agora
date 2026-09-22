import { render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { PlacePage } from './PlacePage'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/place/:slug" element={<PlacePage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('PlacePage', () => {
  it('renders full details for a known slug', () => {
    renderAt('/place/the-green-leaf-cafe')

    expect(screen.getByRole('heading', { level: 1, name: /the green leaf café/i })).toBeInTheDocument()
    expect(screen.getByText(/214 elm street/i)).toBeInTheDocument()
    expect(screen.getByText(/mon–fri: 7am–10pm/i)).toBeInTheDocument()
    expect(screen.getByText(/\(555\) 014-2234/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /get directions/i })).toHaveAttribute(
      'href',
      expect.stringContaining('maps.google.com') as unknown as string,
    )
    expect(screen.getByRole('heading', { name: /you might also like/i })).toBeInTheDocument()
  })

  it('shows related places for the same category', () => {
    renderAt('/place/the-green-leaf-cafe')

    const relatedHeading = screen.getByRole('heading', { name: /you might also like/i })
    const section = relatedHeading.closest('div')
    expect(section).not.toBeNull()
    expect(within(section!).getByRole('link', { name: /casa manos/i })).toBeInTheDocument()
  })

  it('renders a not-found state for an unknown slug', () => {
    renderAt('/place/no-such-place')

    expect(screen.getByRole('heading', { name: /place not found/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /back to explore/i })).toHaveAttribute('href', '/')
  })
})