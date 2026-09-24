export type PendingPlan = 'free' | 'seeker' | 'adept' | 'full'
export type ActivationState = 'pending' | 'active'

export function normalizePendingPlan(value: string | null | undefined): PendingPlan {
  const normalized = String(value ?? 'free').trim().toLowerCase()
  if (normalized === 'magister') return 'full'
  if (normalized === 'seeker' || normalized === 'adept' || normalized === 'full' || normalized === 'free') {
    return normalized
  }
  return 'free'
}

export function subscriptionActivationState(
  plan: string | null | undefined,
  subscriptionStatus: string | null | undefined,
): ActivationState {
  const normalizedPlan = normalizePendingPlan(plan)
  const normalizedStatus = String(subscriptionStatus ?? '').trim().toLowerCase()
  const isPaidPlan = normalizedPlan === 'seeker' || normalizedPlan === 'adept' || normalizedPlan === 'full'
  return isPaidPlan && (normalizedStatus === 'active' || normalizedStatus === 'trialing')
    ? 'active'
    : 'pending'
}
