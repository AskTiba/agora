import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useScrollReveal } from './hooks/useScrollReveal'
import { AppShell } from './app/AppShell'
import { LandingPage } from './features/landing/LandingPage'
import { PlacePage } from './features/place/PlacePage'
import { PlannerPage } from './features/plan/PlannerPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'place/:slug', element: <PlacePage /> },
      { path: 'plan', element: <PlannerPage /> },
      { path: '*', element: <LandingPage /> },
    ],
  },
])

function App() {
  useScrollReveal()
  return <RouterProvider router={router} />
}

export default App