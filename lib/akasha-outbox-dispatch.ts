import type { AkashaAlert } from './akasha-subscription-alerts'

export type AkashaOutboxRepository = {
  claim(dedupeKey: string): Promise<boolean>
  markSent(dedupeKey: string): Promise<void>
  markFailed(dedupeKey: string, message: string): Promise<void>
}

export type AkashaOutboxSender = (message: string, alert: AkashaAlert) => Promise<void> | void

export async function dispatchAkashaAlert(
  alert: AkashaAlert,
  repository: AkashaOutboxRepository,
  send: AkashaOutboxSender,
): Promise<{ claimed: boolean; sent: boolean }> {
  const claimed = await repository.claim(alert.dedupeKey)
  if (!claimed) return { claimed: false, sent: false }

  try {
    await send(alert.text, alert)
    await repository.markSent(alert.dedupeKey)
    return { claimed: true, sent: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Telegram delivery error'
    try {
      await repository.markFailed(alert.dedupeKey, message.slice(0, 500))
    } catch {
      throw new Error('AKASHA delivery failed and the outbox failure state could not be saved')
    }
    throw error
  }
}
