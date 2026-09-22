import type { MouseEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'

const NAV_LINKS = [
  { href: '#explore', label: 'Explore' },
  { href: '#features', label: 'Features' },
  { href: '#events', label: 'Events' },
  { href: '#community', label: 'Community' },
]

function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" className={className}>
      {/* Outer ring */}
      <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="1.5" opacity="0.15" />
      {/* Inner mark — stylized "A" as an agora gathering space */}
      <path
        d="M10 26L18 8L26 26"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 21H23.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Community dots */}
      <circle cx="18" cy="15" r="1.5" fill="currentColor" opacity="0.5" />
      <circle cx="14.5" cy="22" r="1" fill="currentColor" opacity="0.35" />
      <circle cx="21.5" cy="22" r="1" fill="currentColor" opacity="0.35" />
    </svg>
  )
}

export function Header() {
  const location = useLocation()

  const scrollToId = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSectionClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (location.pathname === '/' && location.hash === href) {
      event.preventDefault()
      scrollToId(href.slice(1))
    }
  }

  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === '/') {
      event.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line/50 bg-surface/80 backdrop-blur-xl supports-[backdrop-filter]:bg-surface/60">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
        <Link
          to="/"
          onClick={handleLogoClick}
          className="flex items-center gap-2.5 py-2 text-lg font-display font-bold text-ink transition-opacity hover:opacity-70"
        >
          <Logo className="h-8 w-8 text-accent" />
          Agora
        </Link>

        <nav aria-label="Main navigation" className="ml-auto hidden sm:block">
          <ul className="flex items-center gap-1 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  to={`/${link.href}`}
                  onClick={(event) => handleSectionClick(event, link.href)}
                  className="relative rounded-lg px-3.5 py-2 text-ink-muted transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/plan"
                className="relative rounded-lg px-3.5 py-2 text-ink-muted transition-colors hover:text-ink"
              >
                Plan
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}