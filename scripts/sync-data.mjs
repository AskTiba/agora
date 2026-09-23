import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PLACES } from '../src/data/places.ts'
import { EVENTS } from '../src/data/events.ts'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const outDir = join(root, 'public', 'data')

mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, 'places.json'), `${JSON.stringify(PLACES, null, 2)}\n`)
writeFileSync(join(outDir, 'events.json'), `${JSON.stringify(EVENTS, null, 2)}\n`)

console.log(`Synced ${PLACES.length} places and ${EVENTS.length} events to public/data/`)