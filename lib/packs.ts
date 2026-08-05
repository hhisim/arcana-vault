import packsJson from './shop-packs-enriched.json'
import { SHOP_PACKS, packFromSku, formatUsd } from './shop'

export type ShopPack = {
  sku: string
  etsyListingId: number
  title: string
  price: number
  stripePriceId: string
  views: number
  favs: number
  description?: string
  images?: string[]
}

// Packs intentionally excluded from the Vault shop (kept out of the catalog,
// but images/data remain on disk so the exclusion is fully reversible).
const EXCLUDED_SKUS: string[] = [
  'etsy-634858175', // Sacred Geometry VJ Loop Pack — a VJ video-loops product, not an esoteric study pack
]

// Enriched data (description + images from Etsy) merged over the base catalog.
function loadPacks(): ShopPack[] {
  const enriched = Array.isArray(packsJson) ? (packsJson as ShopPack[]) : []
  const source = enriched.length > 0 ? enriched : SHOP_PACKS.map((p) => ({ ...p }))
  return source.filter((p) => !EXCLUDED_SKUS.includes(p.sku))
}

export const PACKS: ShopPack[] = loadPacks()

const BY_SKU = new Map(PACKS.map((p) => [p.sku, p]))

export function getPack(sku?: string | null): ShopPack | undefined {
  if (!sku) return undefined
  return BY_SKU.get(sku)
}

export function heroImage(p: ShopPack): string | undefined {
  return p.images && p.images.length > 0 ? p.images[0] : undefined
}

export { formatUsd, packFromSku }
