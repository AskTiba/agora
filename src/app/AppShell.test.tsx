import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../App'

describe('App shell', () => {
  it('exposes a semantic page structure with the Agora brand', () => {
    render(<App />)

    const header = screen.getByRole('banner')
    expect(header).toHaveTextContent(/agora/i)

    expect(screen.getByRole('main')).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { level: 1 }),
    ).toBeInTheDocument()

    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})