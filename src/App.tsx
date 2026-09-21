import { AppShell } from './app/AppShell'
import { useScrollReveal } from './hooks/useScrollReveal'

function App() {
  useScrollReveal()
  return <AppShell />
}

export default App