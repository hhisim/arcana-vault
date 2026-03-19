'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AskResponse,
  ChatMessage,
  ORACLE_CONFIG,
  OracleMode,
  OraclePack,
  UI_COPY,
  UiLang,
  getModeConfig,
  nextFollowups,
  supportsVoiceReply,
  t,
} from '@/lib/oracle-ui'
import { getMenuScreen, MenuAction } from '@/lib/oracle-menu'

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function rootMenuFor(pack: OraclePack) {
  return `${pack}:root`
}

function SignalMorphText({
  phrases,
  className = '',
  intervalMs = 5200,
  glitchMs = 160,
}: {
  phrases: string[]
  className?: string
  intervalMs?: number
  glitchMs?: number
}) {
  const pool = useMemo(() => phrases.filter(Boolean), [phrases])
  const [index, setIndex] = useState(0)
  const [glitching, setGlitching] = useState(false)

  useEffect(() => {
    if (pool.length <= 1) return
    const timer = window.setInterval(() => {
      setGlitching(true)
      window.setTimeout(() => {
        setIndex((prev) => (prev + 1) % pool.length)
        setGlitching(false)
      }, glitchMs)
    }, intervalMs)
    return () => window.clearInterval(timer)
  }, [pool.length, intervalMs, glitchMs])

  const text = pool[index] ?? ''

  return (
    <span className={`voa-signal ${glitching ? 'is-glitching' : ''} ${className}`}>
      <span className="voa-signal__main">{text}</span>
      <span className="voa-signal__layer voa-signal__layer--a" aria-hidden="true">
        {text}
      </span>
      <span className="voa-signal__layer voa-signal__layer--b" aria-hidden="true">
        {text}
      </span>
    </span>
  )
}

function packSignalPhrases(pack: OraclePack, lang: UiLang, modeLabel: string, statusLabel: string) {
  const base = ORACLE_CONFIG[pack]
  const shared: Record<UiLang, string[]> = {
    en: [base.subtitle.en, `${modeLabel} · ${statusLabel}`, 'Living transmission. Curated response.'],
    tr: [base.subtitle.tr, `${modeLabel} · ${statusLabel}`, 'Canlı aktarım. Küratörlü yanıt.'],
    ru: [base.subtitle.ru, `${modeLabel} · ${statusLabel}`, 'Живая передача. Кураторский ответ.'],
  }
  return shared[lang]
}

export default function OraclePortal() {
  const [lang, setLang] = useState<UiLang>('en')
  const [pack, setPack] = useState<OraclePack>('tao')
  const [mode, setMode] = useState<OracleMode>(ORACLE_CONFIG.tao.defaultMode)
  const [voiceReply, setVoiceReply] = useState(true)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [busy, setBusy] = useState(false)
  const [recording, setRecording] = useState(false)
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null)
  const [systemNotice, setSystemNotice] = useState<string | null>(null)
  const [menuKey, setMenuKey] = useState<string>(rootMenuFor('tao'))
  const [currentCard, setCurrentCard] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(true)

  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const currentPack = ORACLE_CONFIG[pack]
  const currentMode = getModeConfig(pack, mode)
  const voiceEnabledForMode = supportsVoiceReply(pack, mode)
  const starterPrompts = currentPack.starterPrompts[lang]
  const followups = nextFollowups(pack, lang)
  const menu = useMemo(() => getMenuScreen(pack, menuKey, currentCard), [pack, menuKey, currentCard])
  useEffect(() => {
    if (typeof navigator === 'undefined') return
    const browserLang = (navigator.language || '').toLowerCase()
    if (browserLang.startsWith('tr')) setLang('tr')
    else if (browserLang.startsWith('ru')) setLang('ru')
  }, [])

  useEffect(() => {
    if (!voiceEnabledForMode && voiceReply) {
      setVoiceReply(false)
    }
  }, [voiceEnabledForMode, voiceReply])

  useEffect(() => {
    const nextDefault = ORACLE_CONFIG[pack].defaultMode
    const availableModes = ORACLE_CONFIG[pack].modes.map((entry) => entry.value)
    setMode((prev) => (availableModes.includes(prev) ? prev : nextDefault))
    setMenuKey(rootMenuFor(pack))
    setCurrentCard(null)
    setMenuOpen(false)
  }, [pack])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, busy])

  useEffect(() => {
    let alive = true
    const ping = async () => {
      try {
        const response = await fetch('/api/oracle/health', { cache: 'no-store' })
        if (!alive) return
        setBackendOnline(response.ok)
      } catch {
        if (!alive) return
        setBackendOnline(false)
      }
    }
    void ping()
    const timer = window.setInterval(ping, 30000)
    return () => {
      alive = false
      window.clearInterval(timer)
    }
  }, [])

  const statusLabel = useMemo(() => {
    if (backendOnline === null) return '…'
    return backendOnline ? t(lang, UI_COPY.online) : t(lang, UI_COPY.offline)
  }, [backendOnline, lang])

  const effectiveFollowups = messages.length ? followups : starterPrompts
  const packPhrases = packSignalPhrases(pack, lang, currentMode?.label[lang] ?? '', statusLabel)

  const sendPrompt = async (prompt: string, userText?: string, overrideMode?: OracleMode) => {
    const text = prompt.trim()
    if (pack === 'dreamwalker') {
      setMessages((prev) => [...prev, { id: uid(), role: 'system', text: lang === 'en' ? 'Dreamwalker is still populating. This tradition is a placeholder for now.' : lang === 'tr' ? 'Dreamwalker hâlâ hazırlanıyor. Şimdilik yer tutucu durumda.' : 'Dreamwalker всё ещё наполняется. Пока это режим-заглушка.' }])
      return
    }
    const visibleText = (userText ?? prompt).trim()
    const effectiveMode = overrideMode ?? mode
    if (!text || busy) return

    setSystemNotice(null)
    setBusy(true)

    const userMessage: ChatMessage = {
      id: uid(),
      role: 'user',
      text: visibleText,
      pack,
      mode: effectiveMode,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')

    try {
      const response = await fetch('/api/oracle/ask', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ q: text, pack, mode: effectiveMode, target_lang: lang }),
      })

      if (!response.ok) {
        const detail = await response.text()
        throw new Error(detail || t(lang, UI_COPY.failed))
      }

      const data = (await response.json()) as AskResponse
      let audioUrl: string | null = null

      if (voiceReply && supportsVoiceReply(pack, effectiveMode)) {
        try {
          const ttsResponse = await fetch('/api/oracle/tts', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ text: data.answer, lang }),
          })
          if (ttsResponse.ok) {
            const blob = await ttsResponse.blob()
            audioUrl = URL.createObjectURL(blob)
            void new Audio(audioUrl).play().catch(() => undefined)
          } else {
            setSystemNotice('Voice reply unavailable for this response.')
          }
        } catch {
          setSystemNotice('Voice reply unavailable for this response.')
        }
      }

      const oracleMessage: ChatMessage = {
        id: uid(),
        role: 'oracle',
        text: data.answer,
        audioUrl,
        pack,
        mode: effectiveMode,
      }

      setMessages((prev) => [...prev, oracleMessage])
    } catch (error) {
      const detail = error instanceof Error ? error.message : t(lang, UI_COPY.failed)
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: 'system',
          text: detail,
        },
      ])
    } finally {
      setBusy(false)
    }
  }

  const cycleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'tr' : prev === 'tr' ? 'ru' : 'en'))
  }

  const handleAction = async (button: MenuAction) => {
    if (busy) return

    switch (button.kind) {
      case 'submenu': {
        const next = button.nextMenu ?? rootMenuFor(pack)
        setMenuKey(next)
        if (next.startsWith('tarot:card:')) {
          setCurrentCard(next.replace('tarot:card:', ''))
        }
        setMenuOpen(true)
        return
      }
      case 'back': {
        const next = button.nextMenu ?? rootMenuFor(pack)
        setMenuKey(next)
        if (!next.startsWith('tarot:card:')) {
          setCurrentCard(null)
        }
        setMenuOpen(true)
        return
      }
      case 'voice': {
        if (!voiceEnabledForMode) {
          setSystemNotice(t(lang, UI_COPY.voiceUnavailable))
          return
        }
        setVoiceReply((prev) => !prev)
        setSystemNotice(voiceReply ? 'Voice reply disabled.' : 'Voice reply enabled.')
        return
      }
      case 'language': {
        cycleLanguage()
        return
      }
      case 'invite': {
        const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/chat` : '/chat'
        try {
          await navigator.clipboard.writeText(shareUrl)
          setSystemNotice('Chat link copied.')
        } catch {
          setSystemNotice(shareUrl)
        }
        return
      }
      case 'gift': {
        setSystemNotice(lang === 'en' ? 'Gift flow is still Telegram-native for now.' : lang === 'tr' ? 'Hediye akışı şimdilik yalnızca Telegram tarafında.' : 'Подарочный режим пока работает только в Telegram.')
        return
      }
      case 'plans': {
        setSystemNotice(lang === 'en' ? 'Plans are being moved to a website-native flow. Telegram billing still exists in the meantime.' : lang === 'tr' ? 'Planlar website tabanlı akışa taşınıyor. Bu sırada Telegram faturalaması hâlâ aktif.' : 'Планы переносятся в веб-интерфейс. Пока биллинг ещё работает через Telegram.')
        return
      }
      case 'switch': {
        setSystemNotice('Choose another oracle from the left panel.')
        return
      }
      case 'prompt': {
        const nextMode = button.mode ?? mode
        if (button.mode) {
          setMode(button.mode)
        }
        setMenuOpen(true)
        await sendPrompt(button.prompt ?? t(lang, button.label), t(lang, button.displayText ?? button.label), nextMode)
        return
      }
    }
  }

  const toggleRecording = async () => {
    if (recording) {
      recorderRef.current?.stop()
      setRecording(false)
      return
    }

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setSystemNotice(t(lang, UI_COPY.browserMicUnsupported))
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      chunksRef.current = []

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/ogg' })
        stream.getTracks().forEach((track) => track.stop())
        setSystemNotice(t(lang, UI_COPY.transcribing))

        try {
          const form = new FormData()
          form.set('file', new File([blob], 'voice.ogg', { type: 'audio/ogg' }))
          const response = await fetch('/api/oracle/stt', { method: 'POST', body: form })
          if (!response.ok) {
            throw new Error(await response.text())
          }
          const payload = (await response.json()) as { text?: string; lang?: string }
          const transcript = String(payload.text ?? '').trim()
          setSystemNotice(null)
          if (transcript) {
            setInput(transcript)
            await sendPrompt(transcript, transcript)
          }
        } catch (error) {
          setSystemNotice(error instanceof Error ? error.message : t(lang, UI_COPY.failed))
        }
      }

      recorderRef.current = recorder
      recorder.start()
      setRecording(true)
      setSystemNotice(null)
    } catch (error) {
      setSystemNotice(error instanceof Error ? error.message : t(lang, UI_COPY.browserMicUnsupported))
    }
  }

  return (
    <section className="min-h-[calc(100vh-5rem)] bg-deep px-3 py-6 md:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="order-2 glass-card h-fit p-4 lg:order-1 lg:sticky lg:top-24">
          <div className="mb-5">
            <h1 className="font-cinzel text-2xl text-[var(--primary-gold)]">{t(lang, UI_COPY.title)}</h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{t(lang, UI_COPY.subtitle)}</p>
          </div>

          <div className="mb-5 flex flex-wrap gap-2">
            {(['en', 'tr', 'ru'] as UiLang[]).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setLang(value)}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                  lang === value
                    ? 'border-[var(--primary-gold)] bg-[rgba(201,168,76,0.12)] text-[var(--text-primary)]'
                    : 'border-[rgba(255,255,255,0.08)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {value.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {(Object.keys(ORACLE_CONFIG) as OraclePack[]).map((item) => {
              const config = ORACLE_CONFIG[item]
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setPack(item)}
                  className={`voa-oracle-card w-full rounded-2xl border p-4 text-left transition ${
                    pack === item
                      ? 'is-active border-[var(--primary-purple)] bg-[rgba(123,94,167,0.14)] shadow-[0_0_30px_rgba(123,94,167,0.18)]'
                      : 'border-[rgba(255,255,255,0.06)] bg-[var(--bg-card)] hover:border-[rgba(201,168,76,0.35)]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-cinzel text-xl text-[var(--text-primary)]">
                        <span className="mr-2">{config.emoji}</span>
                        {config.title[lang]}
                      </div>
                      <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">{config.subtitle[lang]}</p>
                    </div>
                    <span className="rounded-full border border-[rgba(255,255,255,0.08)] px-2.5 py-1 text-xs text-[var(--text-secondary)]">
                      {config.onlineLabel[lang]}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="mt-6 border-t border-[rgba(255,255,255,0.06)] pt-5">
            <div className="mb-2 text-sm font-medium text-[var(--text-primary)]">{t(lang, UI_COPY.mode)}</div>
            <div className="flex flex-wrap gap-2">
              {currentPack.modes.map((entry) => (
                <button
                  key={entry.value}
                  type="button"
                  onClick={() => setMode(entry.value)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition ${
                    mode === entry.value
                      ? 'border-[var(--primary-gold)] bg-[rgba(201,168,76,0.12)] text-[var(--text-primary)]'
                      : 'border-[rgba(255,255,255,0.08)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {entry.label[lang]}
                </button>
              ))}
            </div>

            <div className="mt-5 grid gap-3 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[var(--bg-raised)] p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-[var(--text-primary)]">{t(lang, UI_COPY.answerLanguage)}</div>
                  <div className="text-xs text-[var(--text-secondary)]">{lang.toUpperCase()}</div>
                </div>
                <div className="text-sm text-[var(--text-secondary)]">{statusLabel}</div>
              </div>

              <label className={`flex items-center justify-between gap-4 rounded-xl border px-3 py-2 ${voiceEnabledForMode ? 'border-[rgba(255,255,255,0.08)]' : 'border-[rgba(255,255,255,0.04)] opacity-60'}`}>
                <div>
                  <div className="text-sm font-medium text-[var(--text-primary)]">{t(lang, UI_COPY.voiceReply)}</div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    {voiceEnabledForMode ? t(lang, UI_COPY.voiceAvailable) : t(lang, UI_COPY.voiceUnavailable)}
                  </div>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-[var(--primary-gold)]"
                  checked={voiceReply && voiceEnabledForMode}
                  disabled={!voiceEnabledForMode}
                  onChange={(event) => setVoiceReply(event.target.checked)}
                />
              </label>
            </div>
          </div>
        </aside>

        <div className="order-1 glass-card flex min-h-[76vh] flex-col overflow-hidden lg:order-2">
          <div className="border-b border-[rgba(255,255,255,0.06)] px-4 py-4 md:px-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-cinzel text-xl text-[var(--text-primary)] md:text-2xl">
                  <SignalMorphText phrases={[`${currentPack.emoji} ${currentPack.title[lang]}`]} />
                </div>
                <div className="mt-1 text-sm text-[var(--text-secondary)]">
                  <SignalMorphText phrases={packPhrases} className="max-w-[38rem]" />
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="rounded-full border border-[rgba(255,255,255,0.08)] px-4 py-2 text-sm text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
                >
                  {menuOpen ? (lang === 'en' ? 'Hide Buttons' : lang === 'tr' ? 'Butonları Gizle' : 'Скрыть кнопки') : (lang === 'en' ? 'Show Buttons' : lang === 'tr' ? 'Butonları Göster' : 'Показать кнопки')}
                </button>
                <button
                  type="button"
                  onClick={() => setMessages([])}
                  className="rounded-full border border-[rgba(255,255,255,0.08)] px-4 py-2 text-sm text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
                >
                  {t(lang, UI_COPY.clear)}
                </button>
              </div>
            </div>
          </div>

          <div className="sticky top-0 z-20 border-b border-[rgba(255,255,255,0.06)] bg-[linear-gradient(180deg,rgba(10,10,15,0.98),rgba(10,10,15,0.92))] px-4 py-4 backdrop-blur md:px-5">
            {systemNotice && <div className="mb-3 text-sm text-[var(--text-secondary)]">{systemNotice}</div>}

            <div className="rounded-3xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-3 shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={t(lang, UI_COPY.placeholder)}
                rows={2}
                className="min-h-[88px] w-full resize-none rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] px-4 py-4 text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] focus:border-[rgba(201,168,76,0.35)]"
              />
              <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap gap-2">
                  {effectiveFollowups.slice(0, 4).map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => void sendPrompt(prompt)}
                      className="rounded-full border border-[rgba(255,255,255,0.08)] px-3 py-2 text-sm text-[var(--text-secondary)] transition hover:border-[var(--primary-purple)] hover:text-[var(--text-primary)]"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 md:min-w-[250px] md:justify-end">
                  <button
                    type="button"
                    onClick={() => void toggleRecording()}
                    className={`rounded-2xl border px-4 py-3 text-sm transition md:min-w-[112px] ${
                      recording
                        ? 'border-[var(--primary-purple)] bg-[rgba(123,94,167,0.18)] text-[var(--text-primary)]'
                        : 'border-[rgba(255,255,255,0.08)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {recording ? (lang === 'en' ? 'Stop' : lang === 'tr' ? 'Durdur' : 'Стоп') : t(lang, UI_COPY.record)}
                  </button>
                  <button
                    type="button"
                    disabled={!input.trim() || busy}
                    onClick={() => void sendPrompt(input)}
                    className="rounded-2xl bg-[var(--primary-gold)] px-5 py-3 text-sm font-medium text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 md:min-w-[112px]"
                  >
                    {t(lang, UI_COPY.send)}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {menuOpen && (
            <div className="border-b border-[rgba(255,255,255,0.06)] px-4 py-4 md:px-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="text-sm font-medium text-[var(--text-primary)]">{t(lang, menu.title)}</div>
                <button
                  type="button"
                  onClick={() => {
                    setMenuKey(rootMenuFor(pack))
                    setCurrentCard(null)
                  }}
                  className="rounded-full border border-[rgba(255,255,255,0.08)] px-3 py-1.5 text-xs text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
                >
                  Reset
                </button>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {menu.buttons.flat().map((button) => (
                  <button
                    key={button.id}
                    type="button"
                    onClick={() => void handleAction(button)}
                    className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-left text-sm text-[var(--text-primary)] transition hover:border-[var(--primary-purple)] hover:bg-[rgba(123,94,167,0.08)]"
                  >
                    {t(lang, button.label)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-5 md:px-5">
            {!messages.length && (
              <div className="rounded-3xl border border-dashed border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-6 text-center">
                <p className="text-[var(--text-secondary)]">{t(lang, UI_COPY.emptyState)}</p>
                <div className="mt-5 text-sm text-[var(--text-secondary)]">
                  {lang === 'en' ? 'Begin above. The conversation space now opens first.' : lang === 'tr' ? 'Yukarıdan başlayın. Sohbet alanı artık önce açılıyor.' : 'Начните сверху. Пространство диалога теперь открывается первым.'}
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`voa-message voa-message--${message.role} max-w-3xl rounded-3xl border p-4 ${
                  message.role === 'user'
                    ? 'ml-auto border-[rgba(201,168,76,0.28)] bg-[rgba(201,168,76,0.08)]'
                    : message.role === 'oracle'
                      ? 'border-[rgba(123,94,167,0.28)] bg-[rgba(123,94,167,0.08)]'
                      : 'border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)]'
                }`}
                style={{ animationDelay: `${Math.min(index * 30, 180)}ms` }}
              >
                <div className="mb-2 text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                  {message.role === 'user' ? 'You' : message.role === 'oracle' ? currentPack.title[lang] : 'System'}
                </div>
                <div className="whitespace-pre-wrap text-[15px] leading-7 text-[var(--text-primary)]">{message.text}</div>
                {message.audioUrl && (
                  <audio controls playsInline preload="metadata" className="mt-3 w-full">
                    <source src={message.audioUrl} type="audio/ogg" />
                  </audio>
                )}
              </div>
            ))}

            {busy && (
              <div className="voa-message voa-message--busy max-w-xl rounded-3xl border border-[rgba(123,94,167,0.28)] bg-[rgba(123,94,167,0.08)] p-4 text-[var(--text-secondary)]">
                {t(lang, UI_COPY.thinking)}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .voa-oracle-card.is-active {
          position: relative;
          overflow: hidden;
        }
        .voa-oracle-card.is-active::after {
          content: '';
          position: absolute;
          inset: -30% auto auto -20%;
          width: 45%;
          height: 160%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          transform: rotate(18deg);
          animation: voaShimmer 5.8s linear infinite;
          pointer-events: none;
        }
        .voa-message {
          opacity: 0;
          transform: translateY(8px);
          animation: voaMessageIn 320ms ease forwards;
        }
        .voa-signal {
          position: relative;
          display: inline-block;
          line-height: 1.15;
        }
        .voa-signal__main {
          position: relative;
          z-index: 3;
          transition: opacity 180ms ease, filter 180ms ease;
        }
        .voa-signal__layer {
          position: absolute;
          inset: 0;
          opacity: 0;
          pointer-events: none;
          z-index: 2;
        }
        .voa-signal.is-glitching .voa-signal__main {
          animation: voaSignalMain 160ms steps(2, end);
        }
        .voa-signal.is-glitching .voa-signal__layer--a {
          opacity: 0.18;
          color: var(--primary-gold);
          animation: voaSignalA 160ms steps(2, end);
        }
        .voa-signal.is-glitching .voa-signal__layer--b {
          opacity: 0.14;
          color: #a78bfa;
          animation: voaSignalB 160ms steps(2, end);
        }
        @keyframes voaShimmer {
          from { transform: translateX(-180%) rotate(18deg); }
          to { transform: translateX(420%) rotate(18deg); }
        }
        @keyframes voaMessageIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes voaSignalMain {
          0% { transform: translate(0,0); filter: blur(0); opacity: 1; }
          35% { transform: translate(-1px,0); filter: blur(0.2px); }
          65% { transform: translate(1px,-1px); opacity: 0.7; }
          100% { transform: translate(0,0); filter: blur(0); opacity: 1; }
        }
        @keyframes voaSignalA {
          0% { transform: translate(0,0); clip-path: inset(0 0 0 0); }
          50% { transform: translate(-2px,0); clip-path: inset(12% 0 48% 0); }
          100% { transform: translate(0,0); clip-path: inset(0 0 0 0); }
        }
        @keyframes voaSignalB {
          0% { transform: translate(0,0); clip-path: inset(0 0 0 0); }
          50% { transform: translate(2px,1px); clip-path: inset(56% 0 10% 0); }
          100% { transform: translate(0,0); clip-path: inset(0 0 0 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .voa-oracle-card.is-active::after,
          .voa-message,
          .voa-signal.is-glitching .voa-signal__main,
          .voa-signal.is-glitching .voa-signal__layer--a,
          .voa-signal.is-glitching .voa-signal__layer--b {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  )
}
