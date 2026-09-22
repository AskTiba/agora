import { useCallback, useEffect, useState } from 'react'

export type PlanDay = 'today' | 'tomorrow' | 'weekend'

export const PLAN_DAYS: PlanDay[] = ['today', 'tomorrow', 'weekend']

export const PLAN_DAY_LABELS: Record<PlanDay, string> = {
  today: 'Today',
  tomorrow: 'Tomorrow',
  weekend: 'This Weekend',
}

const STORAGE_KEY = 'agora:plan'

function readStored(): Partial<Record<string, PlanDay>> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (parsed && typeof parsed === 'object') {
      const out: Partial<Record<string, PlanDay>> = {}
      for (const [slug, day] of Object.entries(parsed as Record<string, unknown>)) {
        if (PLAN_DAYS.includes(day as PlanDay)) out[slug] = day as PlanDay
      }
      return out
    }
    return {}
  } catch {
    return {}
  }
}

export function usePlan() {
  const [plan, setPlan] = useState<Partial<Record<string, PlanDay>>>(readStored)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plan))
    } catch {
      // storage unavailable — plan just won't persist
    }
  }, [plan])

  const setDay = useCallback((slug: string, day: PlanDay) => {
    setPlan((prev) => ({ ...prev, [slug]: day }))
  }, [])

  const clearDay = useCallback((slug: string) => {
    setPlan((prev) => {
      const next = { ...prev }
      delete next[slug]
      return next
    })
  }, [])

  return { plan, setDay, clearDay }
}
