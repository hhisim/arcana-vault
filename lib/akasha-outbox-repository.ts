import { createAkashaTelegramSenderFromEnv } from './akasha-telegram'
import { dispatchAkashaAlert } from './akasha-outbox-dispatch'
import { AKASHA_ALERT_OUTBOX_TABLE, type AkashaAlert } from './akasha-subscription-alerts'
import type { getAdminSupabase } from './supabase/admin'

type AdminClient = ReturnType<typeof getAdminSupabase>

export function createAkashaOutboxRepository(admin: AdminClient) {
  return {
    async claim(dedupeKey: string): Promise<boolean> {
      const { data, error } = await admin
        .from(AKASHA_ALERT_OUTBOX_TABLE)
        .update({ status: 'sending', updated_at: new Date().toISOString() })
        .eq('dedupe_key', dedupeKey)
        .eq('status', 'pending')
        .select('id')
        .maybeSingle()
      if (error) throw error
      return Boolean(data)
    },

    async markSent(dedupeKey: string): Promise<void> {
      const now = new Date().toISOString()
      const { error } = await admin
        .from(AKASHA_ALERT_OUTBOX_TABLE)
        .update({ status: 'sent', sent_at: now, updated_at: now, last_error: null })
        .eq('dedupe_key', dedupeKey)
        .eq('status', 'sending')
      if (error) throw error
    },

    async markFailed(dedupeKey: string, message: string): Promise<void> {
      const now = new Date()
      const { error } = await admin
        .from(AKASHA_ALERT_OUTBOX_TABLE)
        .update({
          status: 'failed',
          last_error: message.slice(0, 500),
          next_attempt_at: new Date(now.getTime() + 60_000).toISOString(),
          updated_at: now.toISOString(),
        })
        .eq('dedupe_key', dedupeKey)
        .eq('status', 'sending')
      if (error) throw error
    },
  }
}

export async function sendAkashaAlertWithOutbox(admin: AdminClient, alert: AkashaAlert) {
  const repository = createAkashaOutboxRepository(admin)
  const sender = createAkashaTelegramSenderFromEnv()
  return dispatchAkashaAlert(alert, repository, sender)
}
