const BREVO_API_KEY = process.env.BREVO_API_KEY || process.env.BREVO_KEY
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || 'no-reply@vaultofarcana.com'
const SENDER_NAME = process.env.BREVO_SENDER_NAME || 'Vault of Arcana'

/**
 * Send the buyer a transactional email with the access .txt attached.
 * Best-effort: if Brevo is unconfigured or the sender is unverified this
 * fails quietly — the guaranteed delivery path is the download on the
 * thanks / access page.
 */
export async function sendAccessEmail(opts: {
  to: string
  packTitle: string
  txt: string
  txtFilename?: string
}): Promise<boolean> {
  if (!BREVO_API_KEY) {
    console.warn('[brevo] no API key configured — skipping access email')
    return false
  }
  try {
    const content = Buffer.from(opts.txt, 'utf-8').toString('base64')
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { email: SENDER_EMAIL, name: SENDER_NAME },
        to: [{ email: opts.to }],
        subject: `Your Vault of Arcana archive: ${opts.packTitle}`,
        htmlContent:
          `<p>Thank you for your purchase of <strong>${opts.packTitle}</strong>.</p>` +
          `<p>Your Google Drive access will be authorized by an administrator within a few hours at the most.</p>` +
          `<p>Your access file is attached — it contains your link.</p>`,
        attachment: [{ name: opts.txtFilename || 'vault-of-arcana-access.txt', content }],
      }),
    })
    if (!res.ok) {
      console.warn('[brevo] send access email failed:', res.status, (await res.text()).slice(0, 300))
      return false
    }
    return true
  } catch (err) {
    console.error('[brevo] send access email exception:', err instanceof Error ? err.message : String(err))
    return false
  }
}
