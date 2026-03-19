
export type GlobalLang = 'en' | 'tr' | 'ru'
export type GlobalMessages = Record<string, string>

export function normalizeLang(value?: string | null): GlobalLang {
  const raw = String(value || '').toLowerCase()
  if (raw.startsWith('tr')) return 'tr' as GlobalLang
  if (raw.startsWith('ru')) return 'ru' as GlobalLang
  return 'en' as GlobalLang
}

export function detectBrowserLang(): GlobalLang {
  if (typeof navigator === 'undefined') return 'en'
  return normalizeLang(navigator.language)
}

export function tm(messages: Record<GlobalLang, GlobalMessages>, lang: GlobalLang, key: string, fallback?: string): string {
  return messages[lang]?.[key] ?? messages.en?.[key] ?? fallback ?? key
}
