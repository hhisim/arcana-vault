import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { isGuideTradition, verifyGuideToken, type GuideTradition } from '@/lib/guide-tokens'

/**
 * GET /guides/<tradition>?t=<token>
 *
 * Serves a compiled study guide as standalone, printable HTML.
 *
 * Rendered to HTML (rather than gated in-app) on purpose: a guide a reader can
 * save, print and cite is what earns a link. The token only decides whether we
 * hand the document over, it does not obfuscate it.
 */
export const dynamic = 'force-dynamic'

const TITLES: Record<GuideTradition, string> = {
  tarot: 'Tarot',
  kabbalah: 'Kabbalah',
  hermeticism: 'Hermeticism',
  alchemy: 'Alchemy',
  'sacred-geometry': 'Sacred Geometry',
  taoism: 'Taoism',
  sufism: 'Sufism',
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderMarkdown(md: string): string {
  const blocks: string[] = []
  const lines = md.split('\n')
  let inQuote = false
  let inList = false
  let para: string[] = []

  const flushPara = () => {
    if (para.length) {
      blocks.push(`<p>${para.join(' ')}</p>`)
      para = []
    }
  }
  const flushList = () => {
    if (inList) {
      blocks.push('</ul>')
      inList = false
    }
  }
  const flushQuote = () => {
    if (inQuote) {
      blocks.push('</blockquote>')
      inQuote = false
    }
  }

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, '')
    if (/^---\s*$/.test(line)) continue
    if (/^#{1,6}\s+/.test(line)) {
      flushPara(); flushList(); flushQuote()
      const level = (line.match(/^#+/) || ['#'])[0].length
      const text = line.replace(/^#+\s+/, '')
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      blocks.push(`<h${level} id="${escapeHtml(id)}">${escapeHtml(text)}</h${level}>`)
      continue
    }
    if (line.startsWith('> ')) {
      flushPara(); flushList()
      if (!inQuote) { blocks.push('<blockquote>'); inQuote = true }
      blocks.push(`<p>${escapeHtml(line.slice(2))}</p>`)
      continue
    }
    flushQuote()
    if (/^[-*]\s+/.test(line)) {
      flushPara()
      if (!inList) { blocks.push('<ul>'); inList = true }
      const text = line.replace(/^[-*]\s+/, '')
      const link = text.match(/^(.*?)\s*→?\s*`?(\/[^`\s]+)`?$/)
      if (link) {
        const label = escapeHtml(link[1].replace(/→$/, '').trim() || link[2])
        blocks.push(`<li><a href="${escapeHtml(link[2])}">${label}</a></li>`)
      } else {
        blocks.push(`<li>${escapeHtml(text)}</li>`)
      }
      continue
    }
    if (!line.trim()) { flushPara(); flushList(); continue }
    para.push(
      escapeHtml(line).replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, a, b) => `<a href="${b}">${a}</a>`)
    )
  }
  flushPara(); flushList(); flushQuote()
  return blocks.join('\n')
}

function page(title: string, canonical: string, body: string, desc: string) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(desc)}">
<link rel="canonical" href="${escapeHtml(canonical)}">
<style>
  body{font-family:Georgia,'Times New Roman',serif;line-height:1.7;color:#1a1a1a;background:#fff;max-width:720px;margin:0 auto;padding:48px 24px 96px}
  h1{font-size:2.2rem;line-height:1.2;margin:0 0 8px}
  h2{font-size:1.25rem;margin:36px 0 10px;border-bottom:1px solid #e6e0d4;padding-bottom:6px}
  h3{font-size:1.05rem;margin:24px 0 6px}
  p{margin:10px 0}
  blockquote{margin:14px 0;padding:10px 16px;border-left:3px solid #C9A84C;background:#faf7f0;color:#3a3a3a;font-style:italic}
  a{color:#8a6d1f}
  .masthead{border-bottom:2px solid #C9A84C;padding-bottom:16px;margin-bottom:8px}
  .kicker{font-family:system-ui,sans-serif;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:#8a6d1f;margin:0 0 4px}
  .meta{font-family:system-ui,sans-serif;font-size:.8rem;color:#666;margin:16px 0 32px}
  @media print{body{max-width:none;padding:0}a{color:#000}}
</style>
</head>
<body>
<div class="masthead"><p class="kicker">Vault of Arcana · Free Study Guide</p></div>
${body}
<div class="meta"><p>Compiled from the Vault of Arcana archive. This guide is free to read, print and share with attribution. It is not for sale and not a substitute for the primary sources it cites.</p></div>
</body>
</html>`
}

export async function GET(request: Request, ctx: { params: Promise<{ tradition: string }> }) {
  const { tradition: raw } = await ctx.params
  const url = new URL(request.url)
  const token = url.searchParams.get('t')

  if (!isGuideTradition(raw)) {
    const body = `<h1>Guide not found</h1><p>There is no study guide at this address. <a href="/free-grimoire">See all seven guides</a>.</p>`
    return new NextResponse(page('Guide not found', 'https://vaultofarcana.com/free-grimoire', body, 'Free tradition study guides from the Vault of Arcana archive.'),
      { status: 404, headers: { 'content-type': 'text/html; charset=utf-8' } })
  }

  const tradition = raw
  const title = TITLES[tradition]
  const canonical = `https://vaultofarcana.com/guides/${tradition}`
  const desc = `A free ${title} study guide compiled from the Vault of Arcana archive of original essays. Full citations and links to every source essay.`

  if (verifyGuideToken(token) !== tradition) {
    const body = `<h1>${escapeHtml(title)} — free study guide</h1>
<p>This guide is free. Enter your email to unlock the complete ${escapeHtml(title)} study guide, compiled from the Vault of Arcana archive.</p>
<p><a href="/free-grimoire?tradition=${encodeURIComponent(tradition)}" style="display:inline-block;background:#C9A84C;color:#0A0A10;padding:12px 22px;text-decoration:none;border-radius:2px">Unlock the guide</a></p>`
    return new NextResponse(page(`${title} Study Guide — Free Unlock | Vault of Arcana`, canonical, body, desc),
      { status: 402, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } })
  }

  let md = ''
  try {
    md = await readFile(path.join(process.cwd(), 'content', 'guides', `${tradition}.mdx`), 'utf8')
  } catch (err) {
    console.error('[guides] read failed', tradition, err)
    return new NextResponse('Guide unavailable.', { status: 500 })
  }

  const body = renderMarkdown(md.replace(/^---\n[\s\S]*?\n---\n/, ''))
  return new NextResponse(page(`${title} Study Guide — Free & Printable | Vault of Arcana`, canonical, body, desc),
    { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'private, max-age=0, must-revalidate' } })
}
