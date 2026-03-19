
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

function uid() { return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}` }
const rootMenuFor = (pack: OraclePack) => `${pack}:root`
const randomPick = <T,>(arr: T[], count = 1) => [...arr].sort(() => Math.random()-0.5).slice(0, count)
function orient(card:string){ return Math.random() < 0.32 ? `${card} (reversed)` : `${card} (upright)` }

const SPREADS: Record<string,{label:string; positions:string[]}> = {
  single: { label:'Single Card', positions:['The Card'] },
  three: { label:'Past · Present · Future', positions:['Past influence','Present condition','Likely unfolding'] },
  shadow: { label:'Shadow & Light', positions:['The Light','The Shadow','Path of Integration'] },
  crossroads: { label:'Crossroads', positions:['Situation','Challenge','Hidden factor','Advice'] },
  horseshoe: { label:'Horseshoe', positions:['Past influence','Present circumstances','Hidden influences / obstacle','Querent attitude','External influences','Advice','Likely outcome'] },
  celtic: { label:'Celtic Cross', positions:['The present','The challenge','Foundation','Recent past','Conscious aim','Near future','Self','Environment','Hopes / fears','Outcome'] },
}

function buildTarotSpreadPrompt(key:string) {
  const spread = SPREADS[key] || SPREADS.single
  const drawn = randomPick(TAROT_ALL_CARDS as unknown as string[], spread.positions.length).map(orient)
  const lines = spread.positions.map((p, i) => `- ${p}: ${drawn[i]}`)
  const userVisible = `${spread.label}\n` + lines.join('\n')
  const prompt = `You are The Cartomancer. The querent drew a ${spread.label} spread.\n${lines.join('\n')}\n\nInterpret this as an actual Tarot spread reading. Speak position by position first, then synthesize the whole reading. Be intimate, personal, and concrete. Do NOT invent a generic archetype. Use the actual cards that were drawn, including upright/reversed orientation. End with one practical next step.`
  return { prompt, userVisible }
}

function buildDailyCardPrompt() {
  const card = orient((randomPick(TAROT_ALL_CARDS as unknown as string[], 1)[0]))
  return {
    prompt: `You are The Cartomancer. Today's card is ${card}. Give a daily card reading that is intimate, personal, and specific. Include: the core message of this actual card, how it may show up today, one shadow or caution, and one actionable step. Use the actual card, not a generic archetype dump.`,
    userVisible: `Daily card draw\n- ${card}`,
  }
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
  const [showOlder, setShowOlder] = useState(false)
  const [voiceStyle, setVoiceStyle] = useState<'female'|'male'>('female')
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const chatRef = useRef<HTMLDivElement | null>(null)

  const currentPack = ORACLE_CONFIG[pack]
  const currentMode = getModeConfig(pack, mode)
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
      try { const res = await fetch('/api/oracle/health', { cache:'no-store' }); if(alive) setBackendOnline(res.ok) }
      catch { if(alive) setBackendOnline(false) }
    }
    void ping(); const timer = window.setInterval(ping, 30000)
    return () => { alive = false; window.clearInterval(timer) }
  }, [])

  const statusLabel = useMemo(() => backendOnline === null ? '…' : backendOnline ? t(lang, UI_COPY.online) : t(lang, UI_COPY.offline), [backendOnline, lang])

  const sendPrompt = async (prompt: string, userText?: string, overrideMode?: OracleMode, afterMenu?: string) => {
    const text = prompt.trim(); const visibleText = (userText ?? prompt).trim(); const effectiveMode = overrideMode ?? mode
    if (!text || busy) return
    setBusy(true); setSystemNotice(null)
    setMessages(prev => [{ id: uid(), role: 'user', text: visibleText, pack, mode: effectiveMode }, ...prev])
    setInput('')
    if (afterMenu) setMenuKey(afterMenu)
    try {
      const response = await fetch('/api/oracle/ask', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ q:text, pack, mode:effectiveMode, target_lang: lang }) })
      if (!response.ok) throw new Error(await response.text())
      const data = await response.json() as AskResponse
      const oracleMessage: ChatMessage = { id: uid(), role:'oracle', text:data.answer, pack, mode:effectiveMode }
      let audioUrl: string | null = null
      if (voiceReply && voiceEnabledForMode) {
        try {
          const tts = await fetch('/api/oracle/tts', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ text:data.answer, lang, voice: voiceStyle }) })
          if (tts.ok) {
            const blob = await tts.blob(); audioUrl = URL.createObjectURL(blob); oracleMessage.audioUrl = audioUrl
          }
        } catch {}
      }
      setMessages(prev => [oracleMessage, ...prev])
    } catch (error:any) {
      setMessages(prev => [{ id: uid(), role:'system', text: error?.message || t(lang, UI_COPY.failed) }, ...prev])
    } finally { setBusy(false) }
  }

  const handleAction = async (button: MenuAction) => {
    if (busy) return
    if (button.kind === 'submenu' || button.kind === 'back') { setMenuKey(button.nextMenu ?? rootMenuFor(pack)); return }
    if (button.kind === 'invite') {
      const url = typeof window !== 'undefined' ? `${window.location.origin}/chat` : '/chat'
      await navigator.clipboard.writeText(url).catch(()=>{})
      setSystemNotice(lang==='tr' ? 'Davet bağlantısı kopyalandı.' : lang==='ru' ? 'Ссылка-приглашение скопирована.' : 'Invite link copied.')
      return
    }
    if (button.kind === 'gift') {
      const subject = encodeURIComponent('Vault of Arcana invitation')
      const body = encodeURIComponent('Enter the Vault: ' + (typeof window !== 'undefined' ? `${window.location.origin}/chat` : '/chat'))
      window.location.href = `mailto:?subject=${subject}&body=${body}`
      return
    }
    let prompt = button.prompt ?? t(lang, button.label)
    let userVisible = t(lang, button.displayText ?? button.label)
    if (prompt === '__SPECIAL_DAILY_CARD__') {
      const built = buildDailyCardPrompt(); prompt = built.prompt; userVisible = built.userVisible
    } else if (prompt.startsWith('__SPECIAL_SPREAD_')) {
      const key = prompt.replace('__SPECIAL_SPREAD_', '').replace('__','')
      const built = buildTarotSpreadPrompt(key)
      prompt = built.prompt; userVisible = built.userVisible
    } else if (prompt === '__SPECIAL_DHARANA_daily__') {
      const ids = Object.keys((await import('@/lib/tantra-data')).ALL_DHARANAS)
      const num = Number(ids[Math.floor(Math.random() * ids.length)])
      const mod = await import('@/lib/tantra-data')
      const d = (mod.ALL_DHARANAS as any)[num]
      prompt = `Transmit dharana ${num}: '${d.name}'. Seed: ${d.desc} Give the actual technique, practice steps, inner landscape, and one application for today.`
      userVisible = `Today's technique\n- Dharana ${num}: ${d.name}`
      button.afterMenu = `tantra:dharanafollow:${num}`
    }
    await sendPrompt(prompt, userVisible, button.mode, button.afterMenu)
  }

  const toggleRecording = async () => {
    if (recording) { recorderRef.current?.stop(); setRecording(false); return }
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) { setSystemNotice(t(lang, UI_COPY.browserMicUnsupported)); return }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio:true })
      const rec = new MediaRecorder(stream); chunksRef.current = []
      rec.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      rec.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type:'audio/ogg' }); stream.getTracks().forEach(t=>t.stop())
        try {
          const form = new FormData(); form.set('file', new File([blob], 'voice.ogg', { type:'audio/ogg' }))
          const res = await fetch('/api/oracle/stt', { method:'POST', body: form })
          const payload = await res.json() as { text?: string }
          const transcript = String(payload.text || '').trim(); if (transcript) await sendPrompt(transcript, transcript)
        } catch (e:any) { setSystemNotice(e?.message || t(lang, UI_COPY.failed)) }
      }
      recorderRef.current = rec; rec.start(); setRecording(true)
    } catch (e:any) { setSystemNotice(e?.message || t(lang, UI_COPY.browserMicUnsupported)) }
  }

  return (
    <section className="h-[calc(100vh-5rem)] overflow-hidden bg-deep px-3 py-6 md:px-6 lg:px-8">
      <div className="mx-auto grid h-full max-w-7xl gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="glass-card order-2 h-full overflow-y-auto p-4 lg:order-1 lg:sticky lg:top-24">
          <div className="mb-5">
            <h1 className="font-cinzel text-2xl text-[var(--primary-gold)]">{t(lang, UI_COPY.title)}</h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{t(lang, UI_COPY.subtitle)}</p>
          </div>
          <div className="mb-5 flex flex-wrap gap-2">
            {(['en','tr','ru'] as UiLang[]).map(v => <button key={v} type="button" onClick={()=>setLang(v)} className={`rounded-full border px-3 py-1.5 text-sm ${lang===v ? 'border-[var(--primary-gold)] bg-[rgba(201,168,76,0.12)] text-[var(--text-primary)]':'border-[rgba(255,255,255,0.08)] text-[var(--text-secondary)]'}`}>{v.toUpperCase()}</button>)}
          </div>
          <div className="space-y-3">
            {(Object.keys(ORACLE_CONFIG) as OraclePack[]).map(item => {
              const config = ORACLE_CONFIG[item]
              return <button key={item} type="button" onClick={()=>setPack(item)} className={`w-full rounded-2xl border p-4 text-left ${pack===item ? 'border-[var(--primary-purple)] bg-[rgba(123,94,167,0.14)]':'border-[rgba(255,255,255,0.06)] bg-[var(--bg-card)]'}`}>
                <div className="flex items-start justify-between gap-4"><div><div className="font-cinzel text-xl text-[var(--text-primary)]"><span className="mr-2">{config.emoji}</span>{config.title[lang]}</div><p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">{config.subtitle[lang]}</p></div><span className="rounded-full border border-[rgba(255,255,255,0.08)] px-2.5 py-1 text-xs text-[var(--text-secondary)]">{config.onlineLabel[lang]}</span></div>
              </button>
            })}
          </div>
          <div className="mt-6 border-t border-[rgba(255,255,255,0.06)] pt-5">
            <div className="mb-2 text-sm font-medium text-[var(--text-primary)]">{t(lang, UI_COPY.mode)}</div>
            <div className="flex flex-wrap gap-2">{currentPack.modes.map(entry => <button key={entry.value} type="button" onClick={()=>setMode(entry.value)} className={`rounded-full border px-3 py-1.5 text-xs ${mode===entry.value ? 'border-[var(--primary-gold)] bg-[rgba(201,168,76,0.12)] text-[var(--text-primary)]':'border-[rgba(255,255,255,0.08)] text-[var(--text-secondary)]'}`}>{entry.label[lang]}</button>)}</div>
            <div className="mt-5 grid gap-3 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[var(--bg-raised)] p-4">
              <div className="flex items-center justify-between gap-4"><div><div className="text-sm font-medium text-[var(--text-primary)]">{t(lang, UI_COPY.answerLanguage)}</div><div className="text-xs text-[var(--text-secondary)]">{lang.toUpperCase()}</div></div><div className="text-sm text-[var(--text-secondary)]">{statusLabel}</div></div>
              <div className="grid gap-3 md:grid-cols-2">
                <label className={`flex items-center justify-between gap-4 rounded-xl border px-3 py-2 ${voiceEnabledForMode ? 'border-[rgba(255,255,255,0.08)]':'border-[rgba(255,255,255,0.04)] opacity-60'}`}><div><div className="text-sm font-medium text-[var(--text-primary)]">{t(lang, UI_COPY.voiceReply)}</div><div className="text-xs text-[var(--text-secondary)]">{voiceEnabledForMode ? t(lang, UI_COPY.voiceAvailable): t(lang, UI_COPY.voiceUnavailable)}</div></div><input type="checkbox" className="h-4 w-4 accent-[var(--primary-gold)]" checked={voiceReply && voiceEnabledForMode} disabled={!voiceEnabledForMode} onChange={e=>setVoiceReply(e.target.checked)} /></label>
                <div className="rounded-xl border border-[rgba(255,255,255,0.08)] px-3 py-2"><div className="text-sm font-medium text-[var(--text-primary)]">Voice style</div><div className="mt-2 flex gap-2"><button type="button" onClick={()=>setVoiceStyle('female')} className={`rounded-full border px-3 py-1 text-xs ${voiceStyle==='female' ? 'border-[var(--primary-gold)] text-[var(--text-primary)]':'border-[rgba(255,255,255,0.08)] text-[var(--text-secondary)]'}`}>Female</button><button type="button" onClick={()=>setVoiceStyle('male')} className={`rounded-full border px-3 py-1 text-xs ${voiceStyle==='male' ? 'border-[var(--primary-gold)] text-[var(--text-primary)]':'border-[rgba(255,255,255,0.08)] text-[var(--text-secondary)]'}`}>Male</button></div></div>
              </div>
              <div className="flex gap-2"><button type="button" onClick={()=>handleAction({id:'invite',label:{en:'Invite a Friend',tr:'Arkadaş Davet Et',ru:'Пригласить друга'},kind:'invite'} as any)} className="rounded-xl border border-[rgba(255,255,255,0.08)] px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Invite</button><button type="button" onClick={()=>handleAction({id:'gift',label:{en:'Gift Access',tr:'Erişim Hediye Et',ru:'Подарить доступ'},kind:'gift'} as any)} className="rounded-xl border border-[rgba(255,255,255,0.08)] px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Gift</button></div>
            </div>
          </div>
        </aside>
        <div className="glass-card order-1 flex h-full min-h-0 flex-col overflow-hidden lg:order-2">
          <div className="border-b border-[rgba(255,255,255,0.06)] px-4 py-4 md:px-5"><div className="flex items-start justify-between gap-4"><div><div className="font-cinzel text-xl text-[var(--text-primary)] md:text-2xl">{currentPack.emoji} {currentPack.title[lang]}</div><div className="mt-1 text-sm text-[var(--text-secondary)]">{currentPack.subtitle[lang]}</div></div><button type="button" onClick={()=>setMessages([])} className="rounded-full border border-[rgba(255,255,255,0.08)] px-4 py-2 text-sm text-[var(--text-secondary)]">{t(lang, UI_COPY.clear)}</button></div></div>
          <div className="border-b border-[rgba(255,255,255,0.06)] bg-[linear-gradient(180deg,rgba(10,10,15,0.98),rgba(10,10,15,0.92))] px-4 py-4 md:px-5">
            {systemNotice && <div className="mb-3 text-sm text-[var(--text-secondary)]">{systemNotice}</div>}
            <div className="rounded-3xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-3 shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
              <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); void sendPrompt(input) }}} placeholder={t(lang, UI_COPY.placeholder)} rows={2} className="min-h-[88px] w-full resize-none rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] px-4 py-4 text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)]" />
              <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div className="flex flex-wrap gap-2">{currentPack.starterPrompts[lang].slice(0,4).map(prompt => <button key={prompt} type="button" onClick={()=>void sendPrompt(prompt)} className="rounded-full border border-[rgba(255,255,255,0.08)] px-3 py-2 text-sm text-[var(--text-secondary)]">{prompt}</button>)}</div><div className="flex gap-3 md:min-w-[250px] md:justify-end"><button type="button" onClick={()=>void toggleRecording()} className={`rounded-2xl border px-4 py-3 text-sm ${recording ? 'border-[var(--primary-purple)] bg-[rgba(123,94,167,0.18)] text-[var(--text-primary)]':'border-[rgba(255,255,255,0.08)] text-[var(--text-secondary)]'}`}>{recording ? (lang==='tr'?'Durdur':lang==='ru'?'Стоп':'Stop') : t(lang, UI_COPY.record)}</button><button type="button" disabled={!input.trim() || busy} onClick={()=>void sendPrompt(input)} className="rounded-2xl bg-[var(--primary-gold)] px-5 py-3 text-sm font-medium text-black disabled:opacity-50">{t(lang, UI_COPY.send)}</button></div></div>
            </div>
          </div>
          <div className="border-b border-[rgba(255,255,255,0.06)] px-4 py-4 md:px-5">
            <div className="mb-3 flex items-center justify-between gap-3"><div className="text-sm font-medium text-[var(--text-primary)]">{t(lang, menu.title)}</div><button type="button" onClick={()=>setMenuKey(rootMenuFor(pack))} className="rounded-full border border-[rgba(255,255,255,0.08)] px-3 py-1.5 text-xs text-[var(--text-secondary)]">Reset</button></div>
            <div className="grid gap-2 md:grid-cols-2">{menu.buttons.flat().map(button => <button key={button.id} type="button" onClick={()=>void handleAction(button)} className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-left text-sm text-[var(--text-primary)] hover:border-[var(--primary-purple)]">{t(lang, button.label)}</button>)}</div>
          </div>
          <div ref={chatRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-5 voa-scroll">
            {hiddenCount > 0 && <div className="mb-4 text-center"><button type="button" onClick={()=>setShowOlder(v=>!v)} className="rounded-full border border-[rgba(255,255,255,0.08)] px-3 py-1.5 text-xs text-[var(--text-secondary)]">{showOlder ? (lang==='tr'?'Öncekileri gizle':lang==='ru'?'Скрыть ранние':'Hide earlier') : (lang==='tr'?`${hiddenCount} eski yanıtı göster`:lang==='ru'?`Показать ещё ${hiddenCount}`:`Show ${hiddenCount} earlier`)}</button></div>}
            {!messages.length && <div className="rounded-3xl border border-dashed border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-6 text-center text-[var(--text-secondary)]">Choose a tradition and begin above.</div>}
            {visibleMessages.map((message, index) => <div key={message.id} className={`mb-4 max-w-3xl rounded-3xl border p-4 ${message.role==='user' ? 'ml-auto border-[rgba(201,168,76,0.28)] bg-[rgba(201,168,76,0.08)]' : message.role==='oracle' ? 'border-[rgba(123,94,167,0.28)] bg-[rgba(123,94,167,0.08)]' : 'border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)]'}`}><div className="mb-2 text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">{message.role==='user'?'You':message.role==='oracle'?currentPack.title[lang]:'System'}</div>{message.role==='user' ? <div className="whitespace-pre-wrap text-[15px] leading-7 text-[var(--text-primary)]">{message.text}</div> : <div className="prose prose-invert max-w-none prose-headings:text-[var(--text-primary)] prose-p:text-[var(--text-primary)] prose-strong:text-[var(--text-primary)] prose-li:text-[var(--text-primary)] prose-blockquote:text-[var(--text-primary)] prose-code:text-[var(--primary-gold)]"><ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown></div>}{message.audioUrl && <audio controls autoPlay playsInline preload="metadata" className="mt-3 w-full"><source src={message.audioUrl} type="audio/ogg" /></audio>}</div>)}
            {busy && <div className="max-w-xl rounded-3xl border border-[rgba(123,94,167,0.28)] bg-[rgba(123,94,167,0.08)] p-4 text-[var(--text-secondary)]">{t(lang, UI_COPY.thinking)}</div>}
          </div>
        </div>
      </div>
      <style jsx global>{`
        .voa-scroll{scrollbar-width:thin; scrollbar-color: rgba(255,255,255,0.12) transparent;}
        .voa-scroll::-webkit-scrollbar{width:10px}
        .voa-scroll::-webkit-scrollbar-track{background:transparent}
        .voa-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1); border-radius:999px; border:2px solid transparent; background-clip:padding-box}
      `}</style>
    </section>
  )
}
