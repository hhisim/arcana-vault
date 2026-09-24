export type AkashaTelegramConfig = {
  token: string
  chatId: string
}

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>

type TelegramResponse = {
  ok?: unknown
}

export function createAkashaTelegramSender(
  config: AkashaTelegramConfig,
  fetchImpl: FetchLike = fetch,
): (message: string) => Promise<void> {
  return async (message: string) => {
    const response = await fetchImpl(`https://api.telegram.org/bot${config.token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        chat_id: config.chatId,
        text: message,
        disable_web_page_preview: true,
      }),
    })

    if (!response.ok) {
      throw new Error(`AKASHA Telegram request failed with HTTP ${response.status}`)
    }

    const payload = await response.json().catch(() => null) as TelegramResponse | null
    if (!payload || payload.ok !== true) {
      throw new Error('AKASHA Telegram rejected the alert')
    }
  }
}

export function createAkashaTelegramSenderFromEnv(fetchImpl: FetchLike = fetch) {
  const token = process.env.AKASHA_TELEGRAM_BOT_TOKEN || process.env.INBOX_TG_TOKEN
  const chatId = process.env.AKASHA_TELEGRAM_CHAT_ID
  if (!token || !chatId) {
    throw new Error('AKASHA Telegram env vars are missing')
  }
  return createAkashaTelegramSender({ token, chatId }, fetchImpl)
}
