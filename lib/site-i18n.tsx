'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import en from '@/messages/en.json'
import tr from '@/messages/tr.json'
import ru from '@/messages/ru.json'

export type SiteLang = 'en' | 'tr' | 'ru'
export type GlobalLang = SiteLang // for compatibility
export type GlobalMessages = Record<string, string>

const dictionaries = { en, tr, ru } as const

type I18nCtx = {
  lang: SiteLang
  setLang: (lang: SiteLang) => void
  t: (keyOrObj: any, fallback?: string, vars?: Record<string, string | number>) => string
  tArray: (key: string) => string[]
  tObj: (key: string) => Record<string, string>
}

const Ctx = createContext<I18nCtx>({
  lang: 'en',
  setLang: () => {},
  t: (key, fallback) => fallback ?? key,
  tArray: (key) => [],
  tObj: (key) => ({}),
})

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

export function SiteI18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<SiteLang>('en')

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? (localStorage.getItem('voa_lang') as SiteLang | null) : null
    const cookieMatch = typeof document !== 'undefined'
      ? document.cookie.split('; ').find((row) => row.startsWith('voa_lang='))?.split('=')[1]
      : undefined
    const next = stored || (cookieMatch as SiteLang | undefined) || 'en'
    if (next === 'en' || next === 'tr' || next === 'ru') setLangState(next)
  }, [])

  const setLang = (next: SiteLang) => {
    setLangState(next)
    if (typeof window !== 'undefined') localStorage.setItem('voa_lang', next)
    if (typeof document !== 'undefined') document.cookie = `voa_lang=${next}; path=/; max-age=31536000`
  }

  const value = useMemo<I18nCtx>(() => ({
    lang,
    setLang,
    t: (keyOrObj, fallback, vars?: Record<string, string | number>) => {
      if (typeof keyOrObj === 'object' && keyOrObj !== null) {
        const obj = keyOrObj as Record<string, string>
        let result = obj[lang] ?? obj.en ?? fallback ?? ''
        if (vars) result = result.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`))
        return result
      }
      const dict = dictionaries[lang] as Record<string, unknown>
      const val = dict[keyOrObj as string]
      let result: string
      if (typeof val === 'string') {
        result = val
      } else if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
        result = (val as Record<string, string>)[lang] ?? (val as Record<string, string>).en ?? fallback ?? keyOrObj as string
      } else {
        result = fallback ?? keyOrObj as string
      }
      if (vars) result = result.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`))
      return result
    },
    tArray: (key) => {
      const dict = dictionaries[lang] as Record<string, unknown>
      const val = dict[key]
      return Array.isArray(val) ? val as string[] : []
    },
    tObj: (key) => {
      const dict = dictionaries[lang] as Record<string, unknown>
      const val = dict[key]
      return typeof val === 'object' && val !== null && !Array.isArray(val) ? val as Record<string, string> : {}
    },
  }), [lang])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useSiteI18n() {
  return useContext(Ctx)
}
