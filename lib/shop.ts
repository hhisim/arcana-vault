import { SHOP_PACKS, PACK_BY_SKU, ShopPack } from './shop-catalog'

export { SHOP_PACKS, PACK_BY_SKU }
export type { ShopPack }

export function packFromSku(sku?: string | null): ShopPack | undefined {
  if (!sku) return undefined
  return PACK_BY_SKU[sku]
}

export function formatUsdCents(cents: number | null | undefined): string {
  if (cents == null) return ''
  return `$${(cents / 100).toFixed(2)}`
}

export function formatUsd(dollars: number): string {
  return `$${dollars.toFixed(2)}`
}

export const ARCHIVE_PACK_DISCOUNT_PERCENT = 20

export function archivePackSaleUnitAmountCents(dollars: number): number {
  return Math.round(dollars * 100 * (100 - ARCHIVE_PACK_DISCOUNT_PERCENT) / 100)
}

export function archivePackSalePrice(dollars: number): number {
  return archivePackSaleUnitAmountCents(dollars) / 100
}

export function formatArchiveSalePrice(dollars: number): string {
  return formatUsd(archivePackSalePrice(dollars))
}

/**
 * The access file content handed to a buyer after purchase.
 * The GDrive link is included once an admin authorizes it; until then it
 * points at the buyer's access page and states admin will authorize within
 * a few hours at the most.
 */
export function buildAccessTxt(opts: {
  pack: ShopPack
  email?: string | null
  accessLink?: string | null
  siteUrl: string
  status?: string | null
}): string {
  const link =
    opts.accessLink && opts.accessLink.trim()
      ? opts.accessLink.trim()
      : `${opts.siteUrl.replace(/\/$/, '')}/account/access`
  const authorized = opts.status === 'authorized'

  const lines = [
    '================================================================',
    '  VAULT OF ARCANA — ARCHIVE ACCESS',
    '================================================================',
    '',
    `  Pack: ${opts.pack.title}`,
    `  Price: ${formatArchiveSalePrice(opts.pack.price)} (${ARCHIVE_PACK_DISCOUNT_PERCENT}% off; was ${formatUsd(opts.pack.price)})`,
    ...(opts.email ? [`  Purchased by: ${opts.email}`] : []),
    '',
    '--------------------------------------------------------------',
    '  YOUR ACCESS LINK',
    '--------------------------------------------------------------',
    `  ${link}`,
    '',
  ]

  if (authorized) {
    lines.push(
      '  Your Google Drive access has been authorized by an administrator.',
      '  Open the link above to access your archive.',
    )
  } else {
    lines.push(
      '  Your Google Drive access will be authorized by an administrator.',
      '  within a few hours at the most. If you cannot access the link yet,',
      '  your order is in the authorization queue.',
    )
  }

  lines.push(
    '',
    '  Questions? Contact us: https://www.vaultofarcana.com/contact',
    '================================================================',
  )
  return lines.join('\n')
}
