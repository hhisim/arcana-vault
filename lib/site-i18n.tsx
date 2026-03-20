'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import en from '@/messages/en.json'
import tr from '@/messages/tr.json'
import ru from '@/messages/ru.json'

export type SiteLang = 'en' | 'tr' | 'ru'
const dictionaries = { en, tr, ru } as const

type Localized = string | { en: string; tr: string; ru: string; }

type I18nCtx = {
  lang: SiteLang
  setLang: (lang: SiteLang) => void
  t: (key: Localized, fallback?: string) => string
}

const Ctx = createContext<I18nCtx>({
  lang: 'en',
  setLang: () => {},
  t: (key, fallback) => {
    if (typeof key === 'string') return fallback ?? key
    return key.en ?? fallback ?? ''
  },
})

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
    t: (key, fallback) => {
      if (typeof key === 'object' && key !== null) {
        return (key as any)[lang] ?? (key as any).en ?? fallback ?? ''
      }
      return (dictionaries[lang] as Record<string, string>)[key] ?? fallback ?? key
    },
  }), [lang])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useSiteI18n() {
  return useContext(Ctx)
}
