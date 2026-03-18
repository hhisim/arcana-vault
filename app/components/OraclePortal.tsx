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

  const sendPrompt = async (prompt: string, userText?: string, overrideMode?: OracleMode) => {
    const text = prompt.trim()
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
          }
        } catch {
          // keep text response even if TTS fails
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
        return
      }
      case 'back': {
        const next = button.nextMenu ?? rootMenuFor(pack)
        setMenuKey(next)
        if (!next.startsWith('tarot:card:')) {
          setCurrentCard(null)
        }
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
        setSystemNotice('Gift flow is still Telegram-native. Web gifting is the next patch.')
        return
      }
      case 'plans': {
        setSystemNotice('Plans are handled through the live subscription flow. Use the site CTA or Telegram for now.')
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
            await sendPrompt(transcript)
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
    <section className="min-h-[calc(100vh-5rem)] bg-deep px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="glass-card h-fit p-5">
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
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    pack === item
                      ? 'border-[var(--primary-purple)] bg-[rgba(123,94,167,0.14)] shadow-[0_0_30px_rgba(123,94,167,0.18)]'
                      : 'border-[rgba(255,255,255,0.06)] bg-[var(--bg-card)] hover:border-[rgba(201,168,76,0.35)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-cinzel text-lg text-[var(--text-primary)]">
                        <span className="mr-2">{config.emoji}</span>
                        {config.title[lang]}
                      </div>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">{config.subtitle[lang]}</p>
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

        <div className="glass-card flex min-h-[72vh] flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] px-5 py-4">
            <div>
              <div className="font-cinzel text-xl text-[var(--text-primary)]">
                {currentPack.emoji} {currentPack.title[lang]}
              </div>
              <div className="text-sm text-[var(--text-secondary)]">
                {currentMode?.label[lang]} · {statusLabel}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMessages([])}
              className="rounded-full border border-[rgba(255,255,255,0.08)] px-4 py-2 text-sm text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
            >
              {t(lang, UI_COPY.clear)}
            </button>
          </div>

          <div className="border-b border-[rgba(255,255,255,0.06)] px-5 py-4">
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
                Menu
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

          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            {!messages.length && (
              <div className="rounded-3xl border border-dashed border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-6 text-center">
                <p className="text-[var(--text-secondary)]">{t(lang, UI_COPY.emptyState)}</p>
                <div className="mt-6 text-left">
                  <div className="mb-2 text-sm font-medium text-[var(--text-primary)]">{t(lang, UI_COPY.starter)}</div>
                  <div className="flex flex-wrap gap-2">
                    {starterPrompts.map((prompt) => (
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
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-3xl rounded-3xl border p-4 ${
                  message.role === 'user'
                    ? 'ml-auto border-[rgba(201,168,76,0.28)] bg-[rgba(201,168,76,0.08)]'
                    : message.role === 'oracle'
                      ? 'border-[rgba(123,94,167,0.28)] bg-[rgba(123,94,167,0.08)]'
                      : 'border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)]'
                }`}
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
              <div className="max-w-xl rounded-3xl border border-[rgba(123,94,167,0.28)] bg-[rgba(123,94,167,0.08)] p-4 text-[var(--text-secondary)]">
                {t(lang, UI_COPY.thinking)}
              </div>
            )}
          </div>

          <div className="border-t border-[rgba(255,255,255,0.06)] px-5 py-4">
            {systemNotice && <div className="mb-3 text-sm text-[var(--text-secondary)]">{systemNotice}</div>}

            {!!messages.length && (
              <div className="mb-4">
                <div className="mb-2 text-sm font-medium text-[var(--text-primary)]">{t(lang, UI_COPY.followups)}</div>
                <div className="flex flex-wrap gap-2">
                  {followups.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => void sendPrompt(prompt)}
                      className="rounded-full border border-[rgba(255,255,255,0.08)] px-3 py-2 text-sm text-[var(--text-secondary)] transition hover:border-[var(--primary-gold)] hover:text-[var(--text-primary)]"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form
              className="flex flex-col gap-3 md:flex-row"
              onSubmit={(event) => {
                event.preventDefault()
                void sendPrompt(input)
              }}
            >
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                rows={3}
                placeholder={t(lang, UI_COPY.typeHere)}
                className="min-h-[96px] flex-1 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-[var(--primary-purple)]"
              />
              <div className="flex gap-3 md:w-[220px] md:flex-col">
                <button
                  type="button"
                  onClick={() => void toggleRecording()}
                  className={`flex-1 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    recording
                      ? 'bg-[rgba(123,94,167,0.22)] text-[var(--text-primary)]'
                      : 'border border-[rgba(255,255,255,0.08)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {recording ? t(lang, UI_COPY.stop) : t(lang, UI_COPY.record)}
                </button>
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  className="flex-1 rounded-2xl bg-[var(--primary-gold)] px-4 py-3 text-sm font-semibold text-[#0A0A0F] transition hover:shadow-[0_0_20px_rgba(201,168,76,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {t(lang, UI_COPY.send)}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
