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

// Enriched data (description + images from Etsy) merged over the base catalog.
function loadPacks(): ShopPack[] {
  const enriched = Array.isArray(packsJson) ? (packsJson as ShopPack[]) : []
  if (enriched.length > 0) {
    return enriched
  }
  // Fallback to base catalog (no images/description) if enrichment not present.
  return SHOP_PACKS.map((p) => ({ ...p }))
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
