import { useSyncExternalStore } from 'react'
import { getEvents, getPlaces, getSnapshot, subscribe } from '../data/catalogue'

export function useCatalogue() {
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  return { places: getPlaces(), events: getEvents() }
}