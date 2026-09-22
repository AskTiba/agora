import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppShell } from '../../app/AppShell'
import { LandingPage } from './LandingPage'
import { PlacePage } from '../place/PlacePage'

function renderAt(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<LandingPage />} />
          <Route path="place/:slug" element={<PlacePage />} />
          <Route path="*" element={<LandingPage />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('Landing page', () => {
  it('renders all premium landing sections with correct semantics', () => {
    renderAt()

    expect(
      screen.getByRole('heading', { level: 1, name: /find everything/i }),
    ).toBeInTheDocument()

    expect(
      screen.getAllByRole('link', { name: /start exploring/i }),
    ).toHaveLength(2)

    expect(
      screen.getByRole('heading', { level: 2, name: /your neighborhood, one search away/i }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { level: 2, name: /everything you need/i }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { level: 2, name: /built for people/i }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { level: 2, name: /three steps/i }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { level: 2, name: /loved by/i }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { level: 2, name: /neighborhood is waiting/i }),
    ).toBeInTheDocument()

    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('renders the place detail page at a nested route', () => {
    renderAt('/place/riverside-park')

    expect(
      screen.getByRole('heading', { level: 1, name: /riverside park/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /you might also like/i }),
    ).toBeInTheDocument()
  })
})