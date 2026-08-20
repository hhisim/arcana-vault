import { Fragment } from 'react'

/**
 * Renders an Etsy-style listing description safely as JSX (no HTML injection).
 * Supports: **bold**, bullet lines (* - •), and paragraph breaks.
 */
function renderInline(text: string, keyBase: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={`${keyBase}-b-${i}`} className="text-[#EBE4F2] font-medium">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <Fragment key={`${keyBase}-t-${i}`}>{part}</Fragment>
    )
  )
}

export default function DescriptionText({ text }: { text?: string | null }) {
  if (!text) return <p className="text-zinc-400">No description provided for this pack.</p>

  const lines = text.split(/\r?\n/).map((l) => l.replace(/\s+$/, ''))
  const blocks: { type: 'p' | 'ul'; items: string[] }[] = []
  let buf: string[] = []
  const flush = () => {
    if (buf.length) {
      blocks.push({ type: 'p', items: [...buf] })
      buf = []
    }
  }
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      flush()
      continue
    }
    if (/^[*•\-–—]\s+/.test(trimmed) || /^\d+[.)]\s+/.test(trimmed)) {
      // bullet
      buf.push(trimmed.replace(/^[*•\-–—]\s+/, ''))
    } else {
      flush()
      blocks.push({ type: 'p', items: [line] })
    }
  }
  flush()

  return (
    <div className="space-y-4 text-[15px] leading-7 text-zinc-300">
      {blocks.map((b, i) =>
        b.type === 'ul' ? (
          <ul key={i} className="list-disc space-y-1.5 pl-5">
            {b.items.map((it, j) => (
              <li key={j}>
                {/* handle bold inside bullet */}
                <span>{renderInline(it, `li-${i}-${j}`)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p key={i}>{renderInline(b.items[0] ?? '', `p-${i}`)}</p>
        )
      )}
    </div>
  )
}
