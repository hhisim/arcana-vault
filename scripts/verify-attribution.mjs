import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import ts from 'typescript'

const root = resolve(import.meta.dirname, '..')
const required = [
  ['lib/attribution.ts', /FIRST_TOUCH_STORAGE_KEY/, 'first-touch attribution helper'],
  ['components/AttributionTracker.tsx', /captureFirstTouchAttribution/, 'site-wide first-touch capture'],
  ['components/EmailCapture.tsx', /includeFirstTouchAttribution/, 'bounded capture payload option'],
  ['app/initiation/page.tsx', /includeFirstTouchAttribution/, 'Initiation attribution capture'],
  ['app/initiation/page.tsx', /\/chat\?source=arcana-initiation/, 'post-capture Oracle path'],
  ['app/initiation/page.tsx', /\/signup\?plan=free&source=arcana-initiation/, 'post-capture free-account path'],
]

const failures = required.flatMap(([file, pattern, label]) => {
  const path = resolve(root, file)
  if (!existsSync(path)) return ['Missing ' + label + ': ' + file]
  return pattern.test(readFileSync(path, 'utf8')) ? [] : ['Missing ' + label + ': ' + file]
})

if (failures.length) {
  console.error('Attribution verification failed:')
  failures.forEach((failure) => console.error('- ' + failure))
  process.exit(1)
}

const attributionSource = readFileSync(resolve(root, 'lib/attribution.ts'), 'utf8')
const compiled = ts.transpileModule(attributionSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText
const attribution = await import('data:text/javascript;base64,' + Buffer.from(compiled).toString('base64'))

const captured = attribution.createFirstTouchAttribution(
  new URL('https://vault.example/initiation?utm_source=etsy&utm_medium=paid_social&utm_campaign=summer&email=nope%40example.com'),
  'https://www.etsy.com/listing/123?buyer=private'
)
const expected = {
  utm_source: 'etsy',
  utm_medium: 'paid_social',
  utm_campaign: 'summer',
  source: 'arcana-initiation',
  landing_path: '/initiation',
  referrer_origin: 'https://www.etsy.com',
}
if (Object.keys(captured).length !== Object.keys(expected).length || Object.entries(expected).some(([key, value]) => captured[key] !== value)) {
  console.error('Attribution verification failed: bounded attribution did not match expected output.')
  process.exit(1)
}

const etsy = attribution.createFirstTouchAttribution(new URL('https://vault.example/redeem/etsy?utm_term=gift'), '')
if (etsy.source !== 'etsy' || etsy.landing_path !== '/redeem/etsy') {
  console.error('Attribution verification failed: Etsy first touch was not retained.')
  process.exit(1)
}

console.log('Attribution verification passed.')
