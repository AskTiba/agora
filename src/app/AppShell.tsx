import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { LandingPage } from '../features/landing/LandingPage'

export function AppShell() {
  return (
    <div id="top" className="flex min-h-dvh flex-col bg-surface text-ink">
      <Header />
      <main className="flex-1">
        <LandingPage />
      </main>
      <Footer />
    </div>
  )
}