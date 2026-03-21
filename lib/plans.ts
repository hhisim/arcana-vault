export type PlanId = 'guest' | 'free' | 'seeker' | 'adept' | 'full'
export type TraditionId = 'tao' | 'tarot' | 'tantra' | 'entheogen' | 'sufi' | 'dreamwalker'

export type PlanConfig = {
  id: PlanId
  name: string
  description: string
  slots: number | 'all'
  dailyLimit: number | 'unlimited'
  guestTotalLimit?: number
  stripePriceId?: string
  priceMonthly?: number
}

export const TRADITIONS: TraditionId[] = ['tao', 'tarot', 'tantra', 'entheogen', 'sufi', 'dreamwalker']

export const PLAN_CONFIG: Record<PlanId, PlanConfig> = {
  guest: {
    id: 'guest',
    name: 'Guest',
    description: 'Three total questions across any tradition.',
    slots: 'all',
    dailyLimit: 3,
    guestTotalLimit: 3,
  },
  free: {
    id: 'free',
    name: 'Free',
    description: 'Study one tradition with a daily question allowance.',
    slots: 1,
    dailyLimit: 12,
  },
  seeker: {
    id: 'seeker',
    name: 'Seeker',
    description: 'Study three traditions and unlock deeper practice.',
    slots: 3,
    dailyLimit: 60,
    priceMonthly: 8,
    // Primary: env var. Fallback: hardcoded new price ID ($8/mo created in Stripe)
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_SEEKER_MONTHLY ?? 'price_1TDTmxD1VUXAFjstn6XPIrDF',
  },
  adept: {
    id: 'adept',
    name: 'Adept',
    description: 'Study four traditions with unlimited daily questions.',
    slots: 4,
    dailyLimit: 'unlimited',
    priceMonthly: 19,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ADEPT_MONTHLY ?? 'price_1TD7A7D1VUXAFjstg9k5UVsC',
  },
  full: {
    id: 'full',
    name: 'Magister',
    description: 'Study all traditions with unlimited daily flow.',
    slots: 'all',
    dailyLimit: 'unlimited',
    priceMonthly: 29,
    // Primary: env var. Fallback: hardcoded new price ID ($29/mo created in Stripe)
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_MAGISTER_MONTHLY ?? 'price_1TDTnND1VUXAFjstnXm6tYCN',
  },
}

export function getPlanLimits(plan: PlanId) {
  return PLAN_CONFIG[plan] ?? PLAN_CONFIG.guest
}

export function getDailyLimit(plan: PlanId) {
  return getPlanLimits(plan).dailyLimit
}

export function getSlots(plan: PlanId) {
  return getPlanLimits(plan).slots
}

export function normalizeSelectedTraditions(plan: PlanId, selected: TraditionId[]) {
  if (plan === 'full' || plan === 'guest') return [...TRADITIONS]
  const slots = getSlots(plan)
  if (slots === 'all') return [...TRADITIONS]
  return selected.filter((t) => TRADITIONS.includes(t)).slice(0, slots)
}

export function canAccessTradition(plan: PlanId, selected: TraditionId[], tradition: TraditionId) {
  if (plan === 'guest' || plan === 'full') return true
  return normalizeSelectedTraditions(plan, selected).includes(tradition)
}

export function planFromPriceId(priceId?: string | null): PlanId | null {
  if (!priceId) return null
  // New price IDs (authoritative)
  if (priceId === 'price_1TDTmxD1VUXAFjstn6XPIrDF') return 'seeker'
  if (priceId === 'price_1TD7A7D1VUXAFjstg9k5UVsC') return 'adept'
  if (priceId === 'price_1TDTnND1VUXAFjstnXm6tYCN') return 'full'
  // Legacy price IDs (for existing subscriptions)
  if (priceId === 'price_1T8LZgD1VUXAFjstbnN0UuZL') return 'seeker'
  if (priceId === 'price_1TD79pD1VUXAFjstVPfDqYjr') return 'full'
  // Server-side env vars fallback
  if (priceId === process.env.STRIPE_PRICE_SEEKER_MONTHLY) return 'seeker'
  if (priceId === process.env.STRIPE_PRICE_ADEPT_MONTHLY) return 'adept'
  if (priceId === process.env.STRIPE_PRICE_MAGISTER_MONTHLY) return 'full'
  return null
}
