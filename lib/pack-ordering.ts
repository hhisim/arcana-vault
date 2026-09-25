export const OSHO_PACK_SKU = 'etsy-4330541166'

export function shufflePacks<T>(packs: readonly T[], random: () => number = Math.random): T[] {
  const shuffled = [...packs]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function orderArchivePacks<T extends { sku: string }>(packs: readonly T[], random: () => number = Math.random): T[] {
  return [...shufflePacks(packs.filter(pack => pack.sku !== OSHO_PACK_SKU), random), ...packs.filter(pack => pack.sku === OSHO_PACK_SKU)]
}

export function pickHomePacks<T>(packs: readonly T[], count: number, random: () => number = Math.random): T[] {
  return shufflePacks(packs, random).slice(0, count)
}
