'use client'

import { useEffect, useMemo, useState } from 'react'
import type { ChatMessage } from '@/lib/oracle-ui'
import {
  buildCodexIndex,
  findCorrespondences,
  groupByFamily,
  extractFamilyMeta,
  type CodexIndex,
  type MatchedEntry,
  type CrossRefByFamily,
} from '@/lib/correspondence/engine'
import type { CorrespondenceIndex } from '@/lib/correspondence/types'

interface CrossRefPanelProps {
  messages: ChatMessage[]
  /** Set to true once the index has loaded */
  indexReady: boolean
}

interface FamilyMeta {
  key: string
  label: string
  icon: string
}

const FAMILY_ORDER: string[] = [
  'deity', 'tarot', 'letter', 'crystal', 'planet', 'zodiac',
  'colors', 'chakras', 'frequencies', 'kabbalah', 'i-ching', 'mayan',
  'elements', 'alchemical', 'emotional', 'plants', 'metals', 'geometry',
  'numbers', 'physiology', 'platonic-solids', 'other', 'all',
]

const MAX_ENTRIES_TOTAL = 12
const MAX_FAMILIES = 5

export default function CrossRefPanel({ messages, indexReady }: CrossRefPanelProps) {
  const [codexIndex, setCodexIndex] = useState<CodexIndex | null>(null)
  const [familyMeta, setFamilyMeta] = useState<Map<string, FamilyMeta>>(new Map())
  const [loading, setLoading] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  // ── Load the correspondence index once ─────────────────────────────────────
  useEffect(() => {
    if (!indexReady) return
    let cancelled = false

    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch('/data/correspondence/index.json')
        if (!res.ok) throw new Error('Failed to load correspondence index')
        const data: CorrespondenceIndex = await res.json()

        if (cancelled) return

        const index = buildCodexIndex(data.entries)
        // Build families map from index meta
        const meta = extractFamilyMeta(data.families || [])
        setFamilyMeta(meta)
        setCodexIndex(index)
      } catch (err) {
        console.error('[CrossRefPanel] Failed to load index:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => { cancelled = true }
  }, [indexReady])

  // ── Derive Q&A texts from messages ─────────────────────────────────────────
  const qAndATexts = useMemo<string[]>(() => {
    // Take the last 6 messages (user + oracle pairs), skip system messages
    return messages
      .filter(m => m.role === 'user' || m.role === 'oracle')
      .slice(0, 6)
      .map(m => m.text)
  }, [messages])

  // ── Run correspondence matching when texts or index changes ─────────────────
  const crossRefs = useMemo<CrossRefByFamily[]>(() => {
    if (!codexIndex || qAndATexts.length === 0) return []

    const matched = findCorrespondences(qAndATexts, codexIndex, MAX_ENTRIES_TOTAL)
    if (matched.length === 0) return []

    return groupByFamily(matched, familyMeta, MAX_FAMILIES)
  }, [qAndATexts, codexIndex, familyMeta])

  // ── Empty / loading / collapsed states ────────────────────────────────────
  if (!indexReady || loading) {
    return (
      <div className="cross-ref-panel">
        <div className="cross-ref-header">
          <span className="cross-ref-icon">✦</span>
          <span className="cross-ref-title">Cross References</span>
        </div>
        <div className="cross-ref-loading">
          <span className="cross-ref-dots">
            <span>·</span><span>·</span><span>·</span>
          </span>
        </div>
        <style>{crossRefStyles}</style>
      </div>
    )
  }

  if (collapsed || crossRefs.length === 0) {
    return (
      <div className="cross-ref-panel">
        <button
          type="button"
          className="cross-ref-header cross-ref-header-btn"
          onClick={() => setCollapsed(false)}
          title="Expand cross references"
        >
          <span className="cross-ref-icon">✦</span>
          <span className="cross-ref-title">Cross References</span>
          {crossRefs.length > 0 && (
            <span className="cross-ref-badge">{crossRefs.reduce((s, f) => s + f.entries.length, 0)}</span>
          )}
        </button>
        {collapsed && (
          <div className="cross-ref-empty">
            Click to reveal correspondences from your session
          </div>
        )}
        <style>{crossRefStyles}</style>
      </div>
    )
  }

  return (
    <div className="cross-ref-panel">
      <div className="cross-ref-header">
        <span className="cross-ref-icon">✦</span>
        <span className="cross-ref-title">Cross References</span>
        <button
          type="button"
          className="cross-ref-collapse-btn"
          onClick={() => setCollapsed(true)}
          title="Collapse panel"
        >
          −
        </button>
      </div>

      <div className="cross-ref-body">
        {crossRefs.map((group) => (
          <div key={group.family} className="cross-ref-family">
            <div className="cross-ref-family-header">
              <span className="cross-ref-family-icon">{group.familyIcon}</span>
              <span className="cross-ref-family-label">{group.familyLabel}</span>
              <span className="cross-ref-family-count">{group.entries.length}</span>
            </div>

            <div className="cross-ref-entries">
              {group.entries.map((entry) => (
                <CrossRefEntry key={entry.slug} entry={entry} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="cross-ref-footer">
        <a href="/correspondences" className="cross-ref-footer-link">
          Explore full Codex →
        </a>
      </div>

      <style>{crossRefStyles}</style>
    </div>
  )
}

function CrossRefEntry({ entry }: { entry: MatchedEntry }) {
  const score = Math.round(entry.relevanceScore * 10) / 10
  const scoreColor = score >= 5 ? 'var(--primary-gold)' : score >= 3 ? 'var(--primary-purple)' : 'var(--text-secondary)'

  return (
    <div className="cross-ref-entry">
      <div className="cross-ref-entry-top">
        <span className="cross-ref-entry-icon">{entry.icon || '◆'}</span>
        <span className="cross-ref-entry-name">{entry.name}</span>
        <span className="cross-ref-entry-score" style={{ color: scoreColor }} title={`Relevance: ${score}`}>
          {score}
        </span>
      </div>

      {entry.matchedOn.length > 0 && (
        <div className="cross-ref-matched-on">
          {entry.matchedOn.slice(0, 4).map((term) => (
            <span key={term} className="cross-ref-term-chip">{term}</span>
          ))}
        </div>
      )}

      {entry.kind && (
        <div className="cross-ref-entry-kind">{entry.kind}</div>
      )}
    </div>
  )
}

const crossRefStyles = `
.cross-ref-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 0;
}

.cross-ref-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
}

.cross-ref-header-btn {
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  border-radius: 0;
}

.cross-ref-header-btn:hover {
  background: rgba(255, 255, 255, 0.03);
}

.cross-ref-icon {
  font-size: 0.7rem;
  color: var(--primary-gold, #c9a84c);
  filter: drop-shadow(0 0 4px rgba(201, 168, 76, 0.5));
}

.cross-ref-title {
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-secondary, #9b93ab);
  flex: 1;
}

.cross-ref-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.1rem;
  height: 1.1rem;
  padding: 0 0.3rem;
  border-radius: 999px;
  font-size: 0.6rem;
  background: rgba(201, 168, 76, 0.15);
  color: var(--primary-gold, #c9a84c);
  border: 1px solid rgba(201, 168, 76, 0.3);
}

.cross-ref-collapse-btn {
  background: none;
  border: none;
  color: var(--text-secondary, #6b6580);
  cursor: pointer;
  font-size: 0.9rem;
  line-height: 1;
  padding: 0 0.25rem;
  border-radius: 4px;
  transition: color 0.15s;
}

.cross-ref-collapse-btn:hover {
  color: var(--text-primary, #e8e0f0);
}

.cross-ref-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.cross-ref-dots {
  display: inline-flex;
  gap: 0.35rem;
  color: var(--primary-gold, #c9a84c);
  font-size: 1.2rem;
}

.cross-ref-dots span {
  animation: voa-dot-pulse 1.4s ease-in-out infinite;
}

.cross-ref-dots span:nth-child(2) { animation-delay: 0.2s; }
.cross-ref-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes voa-dot-pulse {
  0%, 60%, 100% { opacity: 0.3; }
  30% { opacity: 1; }
}

.cross-ref-empty {
  padding: 1rem 0.75rem;
  font-size: 0.72rem;
  color: var(--text-secondary, #6b6580);
  text-align: center;
  line-height: 1.6;
}

.cross-ref-body {
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.cross-ref-family {
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  background: rgba(255, 255, 255, 0.02);
  overflow: hidden;
}

.cross-ref-family-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.cross-ref-family-icon {
  font-size: 0.85rem;
  filter: drop-shadow(0 0 3px rgba(201, 168, 76, 0.4));
}

.cross-ref-family-label {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-primary, #e8e0f0);
  flex: 1;
}

.cross-ref-family-count {
  font-size: 0.6rem;
  color: var(--text-secondary, #6b6580);
  background: rgba(255, 255, 255, 0.06);
  padding: 0.1rem 0.4rem;
  border-radius: 999px;
}

.cross-ref-entries {
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.cross-ref-entry {
  border-radius: 10px;
  padding: 0.55rem 0.65rem;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.015);
  transition: border-color 0.15s, background 0.15s;
}

.cross-ref-entry:hover {
  border-color: rgba(201, 168, 76, 0.25);
  background: rgba(201, 168, 76, 0.04);
}

.cross-ref-entry-top {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.cross-ref-entry-icon {
  font-size: 0.85rem;
  flex-shrink: 0;
  filter: drop-shadow(0 0 3px rgba(201, 168, 76, 0.4));
}

.cross-ref-entry-name {
  font-size: 0.78rem;
  color: var(--text-primary, #e8e0f0);
  flex: 1;
  font-family: var(--font-serif, 'Georgia', serif);
  line-height: 1.3;
}

.cross-ref-entry-score {
  font-size: 0.62rem;
  font-weight: 600;
  opacity: 0.8;
  flex-shrink: 0;
}

.cross-ref-matched-on {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: 0.35rem;
}

.cross-ref-term-chip {
  font-size: 0.6rem;
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
  background: rgba(123, 94, 167, 0.12);
  border: 1px solid rgba(123, 94, 167, 0.25);
  color: var(--text-secondary, #9b93ab);
  letter-spacing: 0.03em;
}

.cross-ref-entry-kind {
  font-size: 0.58rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-secondary, #6b6580);
  margin-top: 0.25rem;
}

.cross-ref-footer {
  padding: 0.6rem 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  text-align: center;
  flex-shrink: 0;
}

.cross-ref-footer-link {
  font-size: 0.65rem;
  color: var(--primary-gold, #c9a84c);
  text-decoration: none;
  letter-spacing: 0.05em;
  transition: opacity 0.15s;
}

.cross-ref-footer-link:hover {
  opacity: 0.75;
  text-decoration: underline;
}
`
