export type PlanId = 'guest' | 'free' | 'seeker' | 'full'
export type TraditionId = 'tao' | 'tarot' | 'tantra' | 'entheogen' | 'sufi' | 'dreamwalker' | 'spiritual_sovereign'

export type PlanConfig = {
  id: PlanId
  name: string
  description: string
  slots: number | 'all'
  dailyLimit: number | 'unlimited'
  guestTotalLimit?: number
  stripePriceId?: string
}

export const TRADITIONS: TraditionId[] = ['tao', 'tarot', 'tantra', 'entheogen', 'sufi', 'dreamwalker', 'spiritual_sovereign']

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
    description: 'Choose one tradition and receive a daily question allowance.',
    slots: 1,
    dailyLimit: 12,
  },
  seeker: {
    id: 'seeker',
    name: 'Seeker',
    description: 'Choose three traditions and unlock deeper practice.',
    slots: 3,
    dailyLimit: 60,
    stripePriceId: process.env.STRIPE_PRICE_SEEKER_MONTHLY,
  },
  full: {
    id: 'full',
    name: 'All Access',
    description: 'Unlock every tradition and the deepest daily flow.',
    slots: 'all',
    dailyLimit: 'unlimited',
    stripePriceId: process.env.STRIPE_PRICE_FULL_MONTHLY,
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
  if (priceId === process.env.STRIPE_PRICE_SEEKER_MONTHLY) return 'seeker'
  if (priceId === process.env.STRIPE_PRICE_FULL_MONTHLY) return 'full'
  return null
}
