'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  AskResponse,
  ChatMessage,
  ORACLE_CONFIG,
  OracleMode,
  OraclePack,
  UI_COPY,
  UiLang,
  getModeConfig,
  supportsVoiceReply,
  t,
} from '@/lib/oracle-ui'
import { getMenuScreen, MenuAction, TAROT_ALL_CARDS } from '@/lib/oracle-menu'

type VoiceStyle = 'female' | 'male'
type ContextState = { userVisible: string; prompt: string; answer: string }

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
const rootMenuFor = (pack: OraclePack) => `${pack}:root`
const randomPick = <T,>(arr: T[], count = 1) => [...arr].sort(() => Math.random() - 0.5).slice(0, count)
const orient = (card: string) => (Math.random() < 0.32 ? `${card} (reversed)` : `${card} (upright)`)
const FOLLOWUP_LIMIT = 1850

const SPREADS: Record<string, { label: string; positions: string[] }> = {
  single: { label: 'Single Card', positions: ['The Card'] },
  three: { label: 'Past · Present · Future', positions: ['Past influence', 'Present condition', 'Likely unfolding'] },
  shadow: { label: 'Shadow & Light', positions: ['The Light', 'The Shadow', 'Path of Integration'] },
  crossroads: { label: 'Crossroads', positions: ['Situation', 'Challenge', 'Hidden factor', 'Advice'] },
  horseshoe: { label: 'Horseshoe', positions: ['Past influence', 'Present circumstances', 'Hidden influences / obstacle', 'Querent attitude', 'External influences', 'Advice', 'Likely outcome'] },
  celtic: { label: 'Celtic Cross', positions: ['The present', 'The challenge', 'Foundation', 'Recent past', 'Conscious aim', 'Near future', 'Self', 'Environment', 'Hopes / fears', 'Outcome'] },
}

function buildTarotSpreadPrompt(key: string) {
  const spread = SPREADS[key] || SPREADS.single
  const drawn = randomPick(TAROT_ALL_CARDS as unknown as string[], spread.positions.length).map(orient)
  const lines = spread.positions.map((p, i) => `- ${p}: ${drawn[i]}`)
  const userVisible = `${spread.label}\n${lines.join('\n')}`
  const prompt = `You are The Cartomancer. The querent drew a ${spread.label} spread.\n${lines.join('\n')}\n\nInterpret this as an actual Tarot spread reading. Name the spread first. Read position by position using the exact drawn cards and their orientations. Then synthesize the whole reading. Be intimate, clear, and useful. Avoid generic archetypal filler. End with one practical next step.`
  return { prompt, userVisible }
}

function buildDailyCardPrompt() {
  const card = orient(randomPick(TAROT_ALL_CARDS as unknown as string[], 1)[0])
  return {
    prompt: `You are The Cartomancer. Today's card is ${card}. Give a daily card reading that names the actual card clearly, explains upright or reversed meaning, how it may show up today, one caution, and one concrete step. Avoid generic archetype monologues.`,
    userVisible: `Daily card draw\n- ${card}`,
  }
}

function compactContext(ctx?: ContextState | null) {
  if (!ctx) return ''
  const q = ctx.userVisible.replace(/\s+/g, ' ').trim().slice(0, 220)
  const a = ctx.answer.replace(/\s+/g, ' ').trim().slice(0, 760)
  return `Previous ${q ? `question: ${q}. ` : ''}Previous oracle answer: ${a}`.trim()
}

function normalizeError(input?: string | null) {
  const raw = String(input || '').trim()
  if (!raw) return 'The oracle is in meditation. Return shortly.'

  try {
    const parsed = JSON.parse(raw)
    const detail = parsed?.detail
    if (typeof detail === 'string') {
      if (/string_too_long/i.test(detail) || /at most 2000 characters/i.test(detail)) return 'That follow-up carried too much context. Choose a narrower next step.'
      if (/oracle unavailable|fetch failed|could not be reached/i.test(detail)) return 'The oracle is in meditation. Return shortly.'
      return detail
    }
    if (Array.isArray(detail) && detail[0]?.msg) {
      const msg = String(detail[0].msg)
      if (/at most 2000 characters/i.test(msg) || /string_too_long/i.test(detail[0]?.type || '')) return 'That follow-up carried too much context. Choose a narrower next step.'
      return msg
    }
  } catch {}

  if (/string_too_long|at most 2000 characters/i.test(raw)) return 'That follow-up carried too much context. Choose a narrower next step.'
  if (/oracle unavailable|fetch failed|could not be reached/i.test(raw)) return 'The oracle is in meditation. Return shortly.'
  return raw
}

function AudioBubble({ src }: { src: string }) {
  const ref = useRef<HTMLAudioElement | null>(null)
  const lastAutoPlayedRef = useRef<string | null>(null)

  useEffect(() => {
    if (!src || lastAutoPlayedRef.current === src) return
    lastAutoPlayedRef.current = src
    const el = ref.current
    if (!el) return
    const attempt = async () => {
      try {
        el.pause()
        el.currentTime = 0
        await el.play()
      } catch {}
    }
    void attempt()
  }, [src])

  return (
    <audio ref={ref} controls playsInline preload="metadata" className="mt-4 w-full rounded-full bg-[rgba(255,255,255,0.04)]">
      <source src={src} type="audio/ogg" />
    </audio>
  )
}

function OracleMarkdown({ text }: { text: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ ...props }) => <h1 className="mb-3 font-cinzel text-2xl text-text-primary" {...props} />,
        h2: ({ ...props }) => <h2 className="mb-3 mt-5 font-cinzel text-xl text-text-primary" {...props} />,
        h3: ({ ...props }) => <h3 className="mb-2 mt-4 font-cinzel text-lg text-text-primary" {...props} />,
        p: ({ ...props }) => <p className="mb-3 leading-7 text-[var(--text-primary)]/92" {...props} />,
        ul: ({ ...props }) => <ul className="mb-3 list-disc space-y-1 pl-5 text-[var(--text-primary)]/92" {...props} />,
        ol: ({ ...props }) => <ol className="mb-3 list-decimal space-y-1 pl-5 text-[var(--text-primary)]/92" {...props} />,
        li: ({ ...props }) => <li className="leading-7" {...props} />,
        strong: ({ ...props }) => <strong className="font-semibold text-text-primary" {...props} />,
        em: ({ ...props }) => <em className="italic text-[var(--primary-gold)]" {...props} />,
        hr: () => <div className="my-4 h-px bg-white/10" />,
        blockquote: ({ ...props }) => <blockquote className="my-4 border-l-2 border-[var(--primary-purple)]/60 pl-4 italic text-[var(--text-secondary)]" {...props} />,
      }}
    >
      {text}
    </ReactMarkdown>
  )
}

export default function OraclePortal() {
  const [lang, setLang] = useState<UiLang>('en')
  const [pack, setPack] = useState<OraclePack>('tao')
  const [mode, setMode] = useState<OracleMode>(ORACLE_CONFIG.tao.defaultMode)
  const [voiceReply, setVoiceReply] = useState(true)
  const [voiceStyle, setVoiceStyle] = useState<VoiceStyle>('female')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [busy, setBusy] = useState(false)
  const [recording, setRecording] = useState(false)
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null)
  const [systemNotice, setSystemNotice] = useState<string | null>(null)
  const [menuKey, setMenuKey] = useState<string>(rootMenuFor('tao'))
  const [showOlder, setShowOlder] = useState(false)
  const [lastContext, setLastContext] = useState<Partial<Record<OraclePack, ContextState>>>({})
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])

  const currentPack = ORACLE_CONFIG[pack]
  const voiceEnabledForMode = supportsVoiceReply(pack, mode)
  const menu = useMemo(() => getMenuScreen(pack, menuKey), [pack, menuKey])
  const visibleMessages = showOlder ? messages : messages.slice(0, 3)
  const hiddenCount = Math.max(messages.length - visibleMessages.length, 0)

  useEffect(() => {
    if (typeof navigator === 'undefined') return
    const browserLang = (navigator.language || '').toLowerCase()
    if (browserLang.startsWith('tr')) setLang('tr')
    else if (browserLang.startsWith('ru')) setLang('ru')
  }, [])

  useEffect(() => {
    const nextDefault = ORACLE_CONFIG[pack].defaultMode
    const availableModes = ORACLE_CONFIG[pack].modes.map((entry) => entry.value)
    setMode((prev) => (availableModes.includes(prev) ? prev : nextDefault))
    setMenuKey(rootMenuFor(pack))
  }, [pack])

  useEffect(() => {
    let alive = true
    const ping = async () => {
      try {
        const res = await fetch('/api/oracle/health', { cache: 'no-store' })
        if (alive) setBackendOnline(res.ok)
      } catch {
        if (alive) setBackendOnline(false)
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

  const contextualizePrompt = (rawPrompt: string) => {
    const ctx = lastContext[pack]
    const needsContext = /clarify|follow-up|follow up|go deeper|translate|re-read|decode|practical next step|compare|read it|lens|continue/i.test(rawPrompt) || menuKey.includes('follow') || menuKey.includes('study:') || menuKey.includes('card:')
    if (!needsContext || !ctx) return rawPrompt

    const compact = compactContext(ctx)
    const base = `Use this prior ${pack} context only as grounding, not as something to repeat verbatim. ${compact}\n\nFollow-up request: ${rawPrompt}`
    return base.length > FOLLOWUP_LIMIT ? base.slice(0, FOLLOWUP_LIMIT) : base
  }

  const sendPrompt = async (prompt: string, userText?: string, overrideMode?: OracleMode, afterMenu?: string) => {
    let trimmed = prompt.trim()
    const visibleText = (userText ?? prompt).trim()
    const effectiveMode = overrideMode ?? mode
    if (!trimmed || busy) return
    if (trimmed.length > FOLLOWUP_LIMIT) trimmed = trimmed.slice(0, FOLLOWUP_LIMIT)

    setBusy(true)
    setSystemNotice(null)
    setMessages((prev) => [{ id: uid(), role: 'user', text: visibleText, pack, mode: effectiveMode }, ...prev])
    setInput('')
    if (afterMenu) setMenuKey(afterMenu)

    try {
      const response = await fetch('/api/oracle/ask', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ q: trimmed, pack, mode: effectiveMode, target_lang: lang }),
      })
      const rawText = await response.text()
      if (!response.ok) throw new Error(rawText)
      const data = JSON.parse(rawText) as AskResponse
      const oracleMessage: ChatMessage = { id: uid(), role: 'oracle', text: data.answer, pack, mode: effectiveMode }
      if (voiceReply && voiceEnabledForMode) {
        try {
          const tts = await fetch('/api/oracle/tts', {
            method: 'POST', headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ text: data.answer, lang, voice: voiceStyle }),
          })
          if (tts.ok) {
            const blob = await tts.blob()
            oracleMessage.audioUrl = URL.createObjectURL(blob)
          }
        } catch {}
      }
      setMessages((prev) => [oracleMessage, ...prev])
      setLastContext((prev) => ({ ...prev, [pack]: { userVisible: visibleText, prompt: trimmed, answer: data.answer } }))
    } catch (error: any) {
      setMessages((prev) => [{ id: uid(), role: 'system', text: normalizeError(error?.message || '') }, ...prev])
    } finally {
      setBusy(false)
    }
  }

  const handleAction = async (button: MenuAction) => {
    if (busy) return
    if (button.kind === 'submenu' || button.kind === 'back') {
      setMenuKey(button.nextMenu ?? rootMenuFor(pack))
      return
    }
    if (button.kind === 'invite') {
      const url = typeof window !== 'undefined' ? `${window.location.origin}/chat` : '/chat'
      await navigator.clipboard.writeText(url).catch(() => {})
      setSystemNotice(lang === 'tr' ? 'Davet bağlantısı kopyalandı.' : lang === 'ru' ? 'Ссылка-приглашение скопирована.' : 'Invite link copied.')
      return
    }
    if (button.kind === 'gift') {
      const subject = encodeURIComponent('Vault of Arcana invitation')
      const body = encodeURIComponent(`Enter the Vault: ${typeof window !== 'undefined' ? `${window.location.origin}/chat` : '/chat'}`)
      window.location.href = `mailto:?subject=${subject}&body=${body}`
      return
    }

    let prompt = button.prompt ?? t(lang, button.label)
    let userVisible = t(lang, button.displayText ?? button.label)
    let nextMenu = button.afterMenu

    if (prompt === '__SPECIAL_DAILY_CARD__') {
      const built = buildDailyCardPrompt()
      prompt = built.prompt
      userVisible = built.userVisible
    } else if (prompt.startsWith('__SPECIAL_SPREAD_')) {
      const key = prompt.replace('__SPECIAL_SPREAD_', '').replace('__', '')
      const built = buildTarotSpreadPrompt(key)
      prompt = built.prompt
      userVisible = built.userVisible
    } else if (prompt === '__SPECIAL_DHARANA_daily__') {
      const tantra = await import('@/lib/tantra-data')
      const ids = Object.keys(tantra.ALL_DHARANAS)
      const num = Number(ids[Math.floor(Math.random() * ids.length)])
      const d = (tantra.ALL_DHARANAS as any)[num]
      prompt = `Transmit dharana ${num}: '${d.name}'. Seed: ${d.desc}. Give the actual technique, practice steps, inner landscape, likely obstacles, and one application for today.`
      userVisible = `Today's technique\n- Dharana ${num}: ${d.name}`
      nextMenu = `tantra:dharanafollow:${num}`
    } else {
      prompt = contextualizePrompt(prompt)
    }

    await sendPrompt(prompt, userVisible, button.mode, nextMenu)
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
      const rec = new MediaRecorder(stream)
      chunksRef.current = []
      rec.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      rec.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/ogg' })
        stream.getTracks().forEach((track) => track.stop())
        try {
          const form = new FormData()
          form.set('file', new File([blob], 'voice.ogg', { type: 'audio/ogg' }))
          const res = await fetch('/api/oracle/stt', { method: 'POST', body: form })
          const payload = await res.json() as { text?: string }
          const transcript = String(payload.text || '').trim()
          if (transcript) await sendPrompt(transcript, transcript)
        } catch (e: any) {
          setSystemNotice(normalizeError(e?.message))
        }
      }
      recorderRef.current = rec
      rec.start()
      setRecording(true)
    } catch (e: any) {
      setSystemNotice(normalizeError(e?.message || t(lang, UI_COPY.browserMicUnsupported)))
    }
  }

  return (
    <section className="h-[calc(100vh-4.5rem)] overflow-hidden bg-deep px-3 py-5 md:px-5 lg:px-8">
      <div className="mx-auto grid h-full max-w-[1600px] gap-6 lg:grid-cols-[260px_minmax(0,1fr)_300px]">
        {/* LEFT: Oracle pack selector */}
        <aside className="glass-card voa-scrollbar order-1 hidden h-full overflow-y-auto p-4 lg:block">
          <div className="mb-5">
            <h1 className="font-cinzel text-xl text-[var(--primary-gold)]">{t(lang, UI_COPY.title)}</h1>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{t(lang, UI_COPY.subtitle)}</p>
          </div>
          <div className="mb-4 flex flex-wrap gap-2">
            {(['en', 'tr', 'ru'] as UiLang[]).map((v) => (
              <button key={v} type="button" onClick={() => setLang(v)} className={`rounded-full border px-2 py-1 text-xs transition ${lang === v ? 'border-[var(--primary-gold)] bg-[rgba(201,168,76,0.12)] text-text-primary' : 'border-white/10 text-[var(--text-secondary)] hover:border-[var(--primary-purple)]/30 hover:text-text-primary'}`}>{v.toUpperCase()}</button>
            ))}
          </div>
          {/* Voice Controls */}
          <div className="mb-4 rounded-xl border border-white/8 bg-[rgba(255,255,255,0.02)] p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-text-primary">🎙️ Voice</span>
              <button
                type="button"
                onClick={() => setVoiceReply(!voiceReply)}
                className={`rounded-full border px-2 py-0.5 text-[10px] transition ${voiceReply ? 'border-[var(--primary-gold)] bg-[rgba(201,168,76,0.12)] text-text-primary' : 'border-white/8 text-[var(--text-secondary)]'}`}
              >
                {voiceReply ? 'ON' : 'OFF'}
              </button>
            </div>
            {voiceReply && (
              <div className="mt-2 flex gap-1">
                {(['female', 'male'] as VoiceStyle[]).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVoiceStyle(v)}
                    className={`flex-1 rounded-lg border px-2 py-1 text-xs capitalize transition ${voiceStyle === v ? 'border-[var(--primary-purple)] bg-[rgba(123,94,167,0.14)] text-text-primary' : 'border-white/8 text-[var(--text-secondary)] hover:border-[var(--primary-purple)]/30'}`}
                  >
                    {v === 'female' ? '♀ Female' : '♂ Male'}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-2">
            {(Object.keys(ORACLE_CONFIG) as OraclePack[]).map((item) => {
              const config = ORACLE_CONFIG[item]
              const active = pack === item
              const badgeClass = item === 'dreamwalker' ? 'oracle-badge-archive' : 'oracle-badge-live'
              return (
                <button key={item} type="button" onClick={() => setPack(item)} className={`oracle-card relative w-full rounded-xl border p-3 text-left ${active ? 'is-active animate-sheen border-[var(--primary-purple)]' : 'border-[var(--border-subtle)]'}`}>
                  <span className={`${badgeClass} text-[10px]`}>{config.onlineLabel[lang]}</span>
                  <div className="pr-12">
                    <div className="font-cinzel text-[1.4rem] leading-none text-text-primary"><span className="mr-1 text-sm">{config.emoji}</span>{config.title[lang]}</div>
                    <div className="mt-1.5 text-[10px] leading-tight text-[var(--text-secondary)] line-clamp-2">{config.subtitle[lang]}</div>
                  </div>
                </button>
              )
            })}
          </div>
          <div className="mt-5 border-t border-white/6 pt-4">
            <div className="mb-2 text-xs font-medium text-text-primary">{t(lang, UI_COPY.mode)}</div>
            <div className="flex flex-col gap-1">
              {currentPack.modes.map((entry) => (
                <button key={entry.value} type="button" onClick={() => setMode(entry.value)} className={`rounded-lg border px-3 py-1.5 text-xs text-left transition ${mode === entry.value ? 'border-[var(--primary-gold)] bg-[rgba(201,168,76,0.12)] text-text-primary' : 'border-white/8 text-[var(--text-secondary)] hover:border-[var(--primary-purple)]/30 hover:text-text-primary'}`}>{entry.label[lang]}</button>
              ))}
            </div>
          </div>
        </aside>

        {/* MIDDLE: Chat area */}
        <div className="glass-card order-2 flex h-full min-h-0 flex-col overflow-hidden">
          <div className="border-b border-white/6 px-4 py-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-cinzel text-2xl text-text-primary"><span className="mr-2 text-lg">{currentPack.emoji}</span>{currentPack.title[lang]}</div>
                <div className="mt-0.5 text-xs text-[var(--text-secondary)]">{currentPack.subtitle[lang]}</div>
              </div>
              <button type="button" onClick={() => { setMessages([]); setLastContext({}); }} className="rounded-full border border-white/8 px-3 py-1.5 text-xs text-[var(--text-secondary)] transition hover:border-[var(--primary-purple)]/30 hover:text-text-primary">{t(lang, UI_COPY.clear)}</button>
            </div>
          </div>

          <div className="border-b border-white/6 px-4 py-3">
            <div className="glass-card rounded-2xl border border-white/6 p-3">
              <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void sendPrompt(input) } }} placeholder={t(lang, UI_COPY.placeholder)} rows={2} className="min-h-[72px] w-full resize-none rounded-[16px] border border-white/8 bg-[rgba(255,255,255,0.02)] px-4 py-3 text-sm text-text-primary outline-none placeholder:text-[var(--text-secondary)]" />
              <div className="mt-3 flex flex-wrap gap-1.5">
                {currentPack.starterPrompts[lang].map((prompt) => (<button key={prompt} type="button" onClick={() => sendPrompt(prompt, prompt)} className="rounded-full border border-white/8 px-2 py-1 text-xs text-[var(--text-secondary)] transition hover:border-[var(--primary-purple)]/30 hover:text-text-primary">{prompt}</button>))}
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="min-h-[20px] text-xs text-[var(--text-secondary)]">{busy ? <span className="inline-flex items-center gap-1.5"><span className="voa-dots text-[var(--primary-gold)]"><span>•</span><span>•</span><span>•</span></span><span>Oracle is reading…</span></span> : systemNotice ? <span className="italic text-[var(--primary-gold)]/85">{systemNotice}</span> : null}</div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={toggleRecording} className={`rounded-xl border px-4 py-2 text-xs transition ${recording ? 'border-[var(--primary-purple)] bg-[rgba(123,94,167,0.14)] text-text-primary' : 'border-white/8 text-[var(--text-secondary)] hover:border-[var(--primary-purple)]/30 hover:text-text-primary'}`}>{recording ? 'Stop' : t(lang, UI_COPY.record)}</button>
                  <button type="button" disabled={busy || !input.trim()} onClick={() => sendPrompt(input)} className="rounded-xl bg-[var(--primary-gold)] px-6 py-2 text-sm text-black transition hover:brightness-105 disabled:opacity-50">{t(lang, UI_COPY.send)}</button>
                </div>
              </div>
            </div>
          </div>

          <div className="voa-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-4">
            {visibleMessages.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="glass-card rounded-2xl border border-dashed border-white/10 px-8 py-12 text-center text-[var(--text-secondary)]">
                  <div className="text-lg text-text-primary">{t(lang, UI_COPY.emptyState)}</div>
                  <div className="mt-2 text-sm">Begin above. The conversation space now opens first.</div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {visibleMessages.map((message) => message.role === 'user' ? (
                  <div key={message.id} className="user-bubble ml-auto max-w-[85%] p-4"><div className="mb-1.5 text-[10px] uppercase tracking-[0.2em] text-[var(--primary-gold)]">You</div><div className="whitespace-pre-wrap text-sm text-text-primary">{message.text}</div></div>
                ) : message.role === 'system' ? (
                  <div key={message.id} className="oracle-bubble max-w-[85%] p-4"><div className="mb-1.5 text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)]">System</div><div className="italic text-sm text-[#E05C5C]">{normalizeError(message.text)}</div></div>
                ) : (
                  <div key={message.id} className="oracle-bubble max-w-[90%] p-4"><div className="mb-1.5 text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)]">{currentPack.title[lang]}</div><OracleMarkdown text={message.text} />{message.audioUrl ? <AudioBubble src={message.audioUrl} /> : null}</div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Menu panel */}
        <aside className="glass-card order-3 voa-scrollbar hidden h-full overflow-y-auto p-4 lg:block">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">{t(lang, menu.title)}</div>
            {messages.length > 3 && (
              <button type="button" onClick={() => setShowOlder((v) => !v)} className="rounded-full border border-white/8 px-2 py-0.5 text-[10px] text-[var(--text-secondary)] transition hover:border-[var(--primary-purple)]/30 hover:text-text-primary">{showOlder ? 'Collapse' : `History (${hiddenCount})`}</button>
            )}
          </div>
          <div className="space-y-2">
            {menu.buttons.flat().map((button) => (
              <button key={button.id} type="button" onClick={() => handleAction(button)} className={`group flex w-full items-start gap-2 rounded-xl border px-3 py-3 text-left transition ${button.kind === 'submenu' || button.kind === 'back' ? 'border-[var(--primary-purple)]/30 bg-[rgba(123,94,167,0.06)] hover:border-[var(--primary-purple)]/60 hover:bg-[rgba(123,94,167,0.12)]' : 'border-white/8 bg-[rgba(255,255,255,0.015)] hover:border-[var(--primary-purple)]/35 hover:bg-[rgba(123,94,167,0.08)] hover:shadow-[0_0_12px_rgba(123,94,167,0.12)]'}`}>
                <div className="mt-0.5 flex-shrink-0 text-xs text-[var(--primary-gold)]">{button.kind === 'submenu' ? '▶' : button.kind === 'back' ? '◀' : '◆'}</div>
                <div>
                  <div className="text-xs font-medium leading-snug text-text-primary">{t(lang, button.label).replace(/^\//, '')}</div>
                  {button.description ? <div className="mt-0.5 text-[10px] leading-relaxed text-[var(--text-secondary)]">{t(lang, button.description)}</div> : null}
                </div>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}
