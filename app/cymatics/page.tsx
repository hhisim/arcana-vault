'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import Link from 'next/link'

// ── Usage Tracking ──────────────────────────────────────────────
async function trackUsage(tool: string, action: string, meta?: Record<string, unknown>) {
  try {
    await fetch('/api/usage/track', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ tool, action, meta, timestamp: Date.now() }),
    })
  } catch {}
}

// ── Chladni Pattern Generator ───────────────────────────────────
function drawChladni(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  freq1: number,
  freq2: number,
  phase: number,
  color1: string,
  color2: string,
) {
  const cx = w / 2
  const cy = h / 2
  const minDim = Math.min(w, h)
  const scale = minDim * 0.42
  const n = 80 // resolution
  const points: { x: number; y: number; val: number }[] = []

  for (let i = 0; i <= n; i++) {
    for (let j = 0; j <= n; j++) {
      const px = (i / n) * 2 - 1
      const py = (j / n) * 2 - 1
      const nx = px * cx
      const ny = py * cy
      const r = Math.sqrt(nx * nx + ny * ny)
      const theta = Math.atan2(ny, nx)
      const value =
        Math.sin(freq1 * theta + phase) * Math.cos(freq2 * r / scale * Math.PI)
      points.push({ x: nx + cx, y: ny + cy, val: value })
    }
  }

  // Draw field
  const cellW = w / n
  const cellH = h / n

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const p = points[i * (n + 1) + j]
      const t = (p.val + 1) / 2 // 0..1
      const alpha = Math.abs(p.val) * 0.9
      // Color interpolation between color1 and color2
      ctx.fillStyle =
        t > 0.5
          ? color1.replace('1)', `${alpha})`).replace('rgba', 'rgba')
          : color2.replace('1)', `${alpha})`).replace('rgba', 'rgba')
      ctx.fillRect(p.x, p.y, cellW + 1, cellH + 1)
    }
  }

  // Draw bright node lines
  ctx.globalAlpha = 0.6
  ctx.strokeStyle = 'rgba(201,168,76,0.4)'
  ctx.lineWidth = 0.5
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const p = points[i * (n + 1) + j]
      const pR = points[(i + 1) * (n + 1) + j]
      const pB = points[i * (n + 1) + (j + 1)]
      if (Math.abs(p.val) < 0.08) {
        if (Math.abs(pR?.val ?? 1) < 0.08) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(pR.x, pR.y); ctx.stroke()
        }
        if (Math.abs(pB?.val ?? 1) < 0.08) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(pB.x, pB.y); ctx.stroke()
        }
      }
    }
  }
  ctx.globalAlpha = 1
}

const PRESETS = [
  { name: 'Sacred Circle', freq1: 3, freq2: 4, color1: 'rgba(201,168,76,1)', color2: 'rgba(123,94,167,1)' },
  { name: 'Flower of Life', freq1: 6, freq2: 6, color1: 'rgba(201,168,76,1)', color2: 'rgba(100,180,255,1)' },
  { name: 'Star Tetra', freq1: 4, freq2: 5, color1: 'rgba(123,94,167,1)', color2: 'rgba(201,168,76,1)' },
  { name: 'Wave Harmonic', freq1: 2, freq2: 8, color1: 'rgba(100,180,255,1)', color2: 'rgba(201,168,76,1)' },
  { name: 'Quantum Lattice', freq1: 7, freq2: 3, color1: 'rgba(180,100,255,1)', color2: 'rgba(100,200,180,1)' },
  { name: 'Merkaba Field', freq1: 5, freq2: 5, color1: 'rgba(201,168,76,1)', color2: 'rgba(255,255,255,1)' },
]

export default function CymaticsPage() {
  const auth = useAuth()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const [freq1, setFreq1] = useState(3)
  const [freq2, setFreq2] = useState(4)
  const [phase, setPhase] = useState(0)
  const [autoRotate, setAutoRotate] = useState(true)
  const [activePreset, setActivePreset] = useState(0)
  const [colorMode, setColorMode] = useState<'gold' | 'purple' | 'ocean' | 'fire'>('gold')
  const [generations, setGenerations] = useState(0)

  const colorPairs = {
    gold: { c1: 'rgba(201,168,76,1)', c2: 'rgba(123,94,167,1)', bg: '#0D0D1A' },
    purple: { c1: 'rgba(123,94,167,1)', c2: 'rgba(201,168,76,1)', bg: '#0D0D1A' },
    ocean: { c1: 'rgba(100,180,255,1)', c2: 'rgba(80,220,200,1)', bg: '#0A1020' },
    fire: { c1: 'rgba(255,120,50,1)', c2: 'rgba(255,200,50,1)', bg: '#1A0A0A' },
  }

  const currentColors = colorPairs[colorMode]

  const draw = useCallback(
    (animatedPhase: number) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const w = canvas.width
      const h = canvas.height
      ctx.fillStyle = currentColors.bg
      ctx.fillRect(0, 0, w, h)
      drawChladni(ctx, w, h, freq1, freq2, animatedPhase, currentColors.c1, currentColors.c2)
    },
    [freq1, freq2, currentColors],
  )

  // Track on mount
  useEffect(() => {
    void trackUsage('cymatics-generator', 'page_view', { user: auth.user?.id })
  }, [auth.user?.id])

  // Animation loop
  useEffect(() => {
    let currentPhase = 0
    const animate = () => {
      if (autoRotate) {
        currentPhase += 0.012
        setPhase(currentPhase)
      }
      draw(currentPhase)
      animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [draw, autoRotate])

  // Canvas resize
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * (window.devicePixelRatio || 1)
      canvas.height = rect.height * (window.devicePixelRatio || 1)
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1)
      }
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [])

  // Update canvas on manual phase change
  useEffect(() => {
    if (!autoRotate) {
      draw(phase)
    }
  }, [phase, autoRotate, draw])

  const handlePreset = (idx: number) => {
    setActivePreset(idx)
    const p = PRESETS[idx]
    setFreq1(p.freq1)
    setFreq2(p.freq2)
    void trackUsage('cymatics-generator', 'preset_used', { preset: p.name })
  }

  const handleGenerate = () => {
    const newFreq1 = Math.floor(Math.random() * 8) + 2
    const newFreq2 = Math.floor(Math.random() * 8) + 2
    setFreq1(newFreq1)
    setFreq2(newFreq2)
    setActivePreset(-1)
    setGenerations((g) => g + 1)
    void trackUsage('cymatics-generator', 'randomize', { freq1: newFreq1, freq2: newFreq2 })
  }

  if (!auth.isAuthenticated) {
    return (
      <section className="min-h-screen bg-deep pt-24 px-6">
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="text-6xl mb-6">🌀</div>
          <h1 className="font-cinzel text-4xl text-[var(--text-primary)] mb-4">Cymatics Generator</h1>
          <p className="text-[var(--text-secondary)] text-lg mb-8">
            This tool is reserved for members of the Vault.
          </p>
          <Link href="/login" className="inline-block rounded-full bg-[var(--primary-gold)] px-8 py-3 text-black font-bold text-lg hover:shadow-[0_0_24px_rgba(201,168,76,0.3)] transition-all">
            Enter
          </Link>
        </div>
      </section>
    )
  }

  return (
    <main className="min-h-screen bg-deep pt-24">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 pb-8">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/sanctum/member/research" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm">
            ← Research Lab
          </Link>
        </div>
        <div className="text-xs uppercase tracking-[0.3em] text-[var(--primary-gold)] mb-2">
          Interactive Tool
        </div>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="font-cinzel text-4xl md:text-5xl text-[var(--text-primary)]">
            Cymatics Generator
          </h1>
          <div className="text-sm text-[var(--text-secondary)]">
            {generations > 0 && <span>Generations: {generations} ·</span>}
            <span className="ml-1">UID: {auth.user?.id?.slice(0, 8) ?? 'anon'}</span>
          </div>
        </div>
        <p className="mt-3 text-[var(--text-secondary)] max-w-xl">
          Draw sacred geometry from sound. Adjust the frequencies and watch Chladni patterns emerge in real time.
        </p>
      </section>

      {/* Canvas */}
      <section className="max-w-7xl mx-auto px-6 pb-8">
        <div className="glass-card overflow-hidden border border-[var(--primary-gold)]/20">
          <canvas
            ref={canvasRef}
            className="w-full h-[480px] md:h-[560px] block"
            style={{ background: currentColors.bg }}
          />
        </div>
      </section>

      {/* Controls */}
      <section className="max-w-7xl mx-auto px-6 pb-8">
        <div className="glass-card p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Presets */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-[var(--primary-gold)] mb-4">Presets</h3>
            <div className="flex flex-col gap-2">
              {PRESETS.map((p, i) => (
                <button
                  key={p.name}
                  onClick={() => handlePreset(i)}
                  className={`rounded-lg border px-4 py-2.5 text-left text-sm transition-all ${
                    activePreset === i
                      ? 'border-[var(--primary-gold)]/50 bg-[var(--primary-gold)]/10 text-[var(--text-primary)]'
                      : 'border-white/8 text-[var(--text-secondary)] hover:border-[#7B5EA7]/30 hover:text-[var(--text-primary)]'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Frequency Controls */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-[var(--primary-gold)] mb-4">Frequency Controls</h3>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[var(--text-secondary)]">Radial Nodes: {freq1}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={12}
                  value={freq1}
                  onChange={(e) => { setFreq1(Number(e.target.value)); setActivePreset(-1) }}
                  className="w-full accent-[#C9A84C]"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[var(--text-secondary)]">Angular Nodes: {freq2}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={12}
                  value={freq2}
                  onChange={(e) => { setFreq2(Number(e.target.value)); setActivePreset(-1) }}
                  className="w-full accent-[#C9A84C]"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[var(--text-secondary)]">Phase: {(phase * 180 / Math.PI).toFixed(1)}°</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={628}
                  value={phase * 100}
                  onChange={(e) => { setPhase(Number(e.target.value) / 100); setAutoRotate(false) }}
                  className="w-full accent-[#C9A84C]"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`rounded-lg border px-4 py-2 text-sm transition-all ${
                    autoRotate
                      ? 'border-[var(--primary-gold)]/50 bg-[var(--primary-gold)]/10 text-[var(--primary-gold)]'
                      : 'border-white/8 text-[var(--text-secondary)] hover:border-[#7B5EA7]/30'
                  }`}
                >
                  {autoRotate ? '⏸ Auto: On' : '▶ Auto: Off'}
                </button>
                <button
                  onClick={handleGenerate}
                  className="flex-1 rounded-lg border border-[var(--primary-gold)]/40 bg-[var(--primary-gold)]/10 px-4 py-2 text-sm text-[var(--primary-gold)] hover:bg-[var(--primary-gold)]/20 transition-all"
                >
                  Randomize
                </button>
              </div>
            </div>
          </div>

          {/* Color Modes */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-[var(--primary-gold)] mb-4">Color Palette</h3>
            <div className="grid grid-cols-2 gap-3">
              {([
                { key: 'gold', label: 'Gold & Violet', bg: '#0D0D1A' },
                { key: 'purple', label: 'Violet & Gold', bg: '#0D0D1A' },
                { key: 'ocean', label: 'Ocean Depths', bg: '#0A1020' },
                { key: 'fire', label: 'Sacred Fire', bg: '#1A0A0A' },
              ] as const).map((mode) => (
                <button
                  key={mode.key}
                  onClick={() => setColorMode(mode.key as typeof colorMode)}
                  className={`rounded-lg border px-4 py-3 text-sm text-left transition-all ${
                    colorMode === mode.key
                      ? 'border-[var(--primary-gold)]/50 bg-[var(--primary-gold)]/10'
                      : 'border-white/8 hover:border-[#7B5EA7]/30'
                  }`}
                  style={{ background: mode.bg }}
                >
                  <div className="font-medium text-[var(--text-primary)]">{mode.label}</div>
                </button>
              ))}
            </div>
            <div className="mt-4 text-xs text-[var(--text-secondary)] leading-relaxed">
              <p>Generated patterns: {generations + 1}</p>
              <p className="mt-1">Current: r={freq1}, a={freq2}, {(phase * 180 / Math.PI).toFixed(0)}°</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
