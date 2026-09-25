/** Removed from the VOA study archive only; source catalog and media stay intact. */
const EXCLUDED_SHOP_SKUS = new Set([
  'etsy-634858175', // VJ video-loops product
  'etsy-4543166138', // 91 Psychedelic 3D Geometry PNG Assets — owner-requested removal
])

export function isExcludedShopSku(sku: string): boolean {
  return EXCLUDED_SHOP_SKUS.has(sku)
}
