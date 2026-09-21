import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../../App'

describe('Landing page', () => {
  it('renders all premium landing sections with correct semantics', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { level: 1, name: /find everything/i }),
    ).toBeInTheDocument()

    expect(
      screen.getAllByRole('link', { name: /start exploring/i }),
    ).toHaveLength(2)

    expect(
      screen.getByRole('heading', { level: 2, name: /places waiting/i }),
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
})