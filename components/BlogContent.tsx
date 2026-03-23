'use client'

import React, { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useSiteI18n } from '@/lib/site-i18n'
import { posts } from '@/lib/posts'
import ScrollCTA from '@/components/ScrollCTA'

type FmI18n = {
  tr?: { title?: string; excerpt?: string }
  ru?: { title?: string; excerpt?: string }
}

type InlineImage = {
  src: string
  caption?: string
  position?: string
}

type BlogContentProps = {
  body: string
  tradition: string
  slug: string
  translations?: { tr?: string; ru?: string }
  fmI18n?: FmI18n
  defaultTitle?: string
  images?: InlineImage[]
}

// Build a lookup: title → slug and slug → title for interlinking
function buildSlugMap() {
  const titleToSlug: Record<string, string> = {}
  const slugToTitle: Record<string, string> = {}
  for (const p of posts) {
    titleToSlug[p.title.toLowerCase()] = p.slug
    slugToTitle[p.slug] = p.title
  }
  return { titleToSlug, slugToTitle }
}

// Check if a URL is an internal blog link (no protocol = relative path like /blog/slug)
function isInternalLink(href: string): boolean {
  return href && !href.startsWith('http') && !href.startsWith('mailto:')
}

// Convert heading text to kebab-case anchor key
function toKebabCase(text: string): string {
  return text
    .replace(/[^a-zA-Z0-9\s-]/g, '')  // remove special chars
    .replace(/\s+/g, '-')               // spaces to hyphens
    .replace(/-+/g, '-')               // collapse multiple hyphens
    .replace(/^-|-$/g, '')             // trim leading/trailing hyphens
    .toLowerCase()
}

// Inject inline images into body sections by matching anchor headings.
// Handles all heading levels (## and ###) — matches the nearest preceding
// heading at any level, not just H2.
function injectImages(body: string, images: InlineImage[] = []): string {
  if (!images || images.length === 0) return body

  // Group images by their anchor heading key (strip "after-" prefix)
  const byAnchor: Record<string, InlineImage[]> = {}
  for (const img of images) {
    if (!img.position?.startsWith('after-')) continue
    const anchor = toKebabCase(img.position.replace('after-', ''))
    if (!byAnchor[anchor]) byAnchor[anchor] = []
    byAnchor[anchor].push(img)
  }

  // Collect images that go at the end
  const endImages: InlineImage[] = images.filter(img => img.position === 'end')

  // Split body by any heading (## or ###)
  // We use a marker approach: find all headings and their positions
  const headingRegex = /^(#{1,3}) ([^\n]+)/gm
  type Section = { level: number; text: string; start: number; end: number }
  const sections: Section[] = []
  let lastEnd = 0
  let match

  while ((match = headingRegex.exec(body)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const start = match.index
    // Previous section ends before this heading
    if (sections.length > 0) {
      sections[sections.length - 1].end = start
    }
    sections.push({ level, text, start, end: body.length })
    lastEnd = start
  }

  // If no headings at all, just return body + end images
  if (sections.length === 0) {
    return endImages.length > 0
      ? body + '\n\n' + endImages.map(img => `![${img.caption || ''}](${img.src})`).join('\n\n')
      : body
  }

  // Build the output by walking through sections and injecting images
  const resultParts: string[] = []
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]
    const nextSection = sections[i + 1]
    const sectionBody = body.slice(section.start, nextSection ? nextSection.start : body.length)
    const headingKey = toKebabCase(section.text)

    resultParts.push(sectionBody)

    // Inject images keyed to this heading
    const imgs = byAnchor[headingKey]
    if (imgs && imgs.length > 0) {
      const imgMarkdown = '\n\n' + imgs.map(img => `![${img.caption || ''}](${img.src})`).join('\n\n') + '\n'
      resultParts.push(imgMarkdown)
    }
  }

  // Append end-position images at the very end
  if (endImages.length > 0) {
    const endMarkdown = '\n\n' + endImages.map(img => `![${img.caption || ''}](${img.src})`).join('\n\n') + '\n'
    resultParts.push(endMarkdown)
  }

  return resultParts.join('')
}

export default function BlogContent({ body, translations, fmI18n, defaultTitle = '', images = [], slug = '' }: BlogContentProps) {
  const { lang } = useSiteI18n()
  const { titleToSlug } = useMemo(() => buildSlugMap(), [])

  const langBody = (lang === 'tr' && translations?.tr)
    ? translations.tr
    : (lang === 'ru' && translations?.ru)
    ? translations.ru
    : body

  // Inject images at their correct positions in the body
  const rawBody = useMemo(() => injectImages(langBody, images), [langBody, images])

  const title = (lang === 'tr' && fmI18n?.tr?.title)
    ? fmI18n.tr.title
    : (lang === 'ru' && fmI18n?.ru?.title)
    ? fmI18n.ru.title
    : defaultTitle

  // Inject translated title into the DOM (blog post header reads it via useEffect)
  React.useEffect(() => {
    const el = document.getElementById('blog-post-title')
    if (el && title) el.textContent = title
  }, [lang, title])

  const labelTR = 'Türkçe'
  const labelRU = 'Русский'
  const labelEN = 'English'

  const switchLang = (targetLang: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set('lang', targetLang)
    window.location.href = url.toString()
  }

  // Custom link component: auto-interlinks text that matches another post title
  const LinkComponent = ({ node, href, children, ...props }: any) => {
    const childText = Array.isArray(children)
      ? children.map((c: any) => (typeof c === 'string' ? c : c?.props?.children || '')).join('')
      : typeof children === 'string' ? children : ''

    const normalizedText = childText.trim().toLowerCase()

    // Check if this text matches any post title → auto-interlink
    const matchedSlug = titleToSlug[normalizedText]

    if (matchedSlug) {
      return (
        <a
          href={`/blog/${matchedSlug}`}
          className="inline-flex items-center gap-1 text-[#c9a84c] hover:text-[#e8c56d] underline decoration-[#c9a84c]/30 hover:decoration-[#c9a84c]/60 underline-offset-2 transition-all duration-200 font-medium"
          {...props}
        >
          {children}
          <svg className="inline w-3 h-3 ml-0.5 opacity-70" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      )
    }

    // External link
    if (href && (href.startsWith('http') || href.startsWith('//'))) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[#9B93AB] hover:text-[#C9A84C] underline decoration-[#9B93AB]/30 hover:decoration-[#C9A84C]/60 underline-offset-2 transition-all duration-200"
          {...props}
        >
          {children}
          <svg className="inline w-2.5 h-2.5 opacity-60" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 2h6v6M10 2L5.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      )
    }

    // Default internal relative link (explicit /blog/ etc.)
    return (
      <a
        href={href}
        className="inline-flex items-center gap-1 text-[#7B5EA7] hover:text-[#9B7BC9] underline decoration-[#7B5EA7]/30 hover:decoration-[#9B7BC9]/60 underline-offset-2 transition-all duration-200 font-medium"
        {...props}
      >
        {children}
      </a>
    )
  }

  // Heading with colored accents
  const H1Component = ({ node, ...props }: any) => (
    <h1 className="font-cinzel text-4xl md:text-5xl mb-8 pb-4 border-b border-[rgba(201,168,76,0.2)] text-[#E8E0F0]" {...props} />
  )

  const H2Component = ({ node, ...props }: any) => (
    <h2
      className="font-cinzel text-3xl md:text-4xl mt-14 mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#9B7BC9] pb-3 border-b border-[rgba(201,168,76,0.1)]"
      {...props}
    />
  )

  const H3Component = ({ node, ...props }: any) => (
    <h3
      className="font-cinzel text-2xl md:text-3xl mt-10 mb-4 text-[#7B5EA7]"
      {...props}
    />
  )

  const H4Component = ({ node, ...props }: any) => (
    <h4 className="font-cinzel text-xl md:text-2xl mt-8 mb-3 text-[#4ECDC4] uppercase tracking-wider" {...props} />
  )

  const ParagraphComponent = ({ node, ...props }: any) => {
    // If inside a blockquote, render gold text
    const isInsideBlockquote = node?.parent?.tagName === 'BLOCKQUOTE'
    return (
      <p
        className={`mb-6 text-[17px] leading-8 group ${isInsideBlockquote ? 'text-[#C9A84C] italic' : 'text-[#B8B0CC]'}`}
        {...props}
      />
    )
  }

  const StrongComponent = ({ node, ...props }: any) => {
    const inBlockquote = node?.parent?.tagName === 'BLOCKQUOTE'
    return <strong className={`font-semibold ${inBlockquote ? 'text-[#C9A84C]' : 'text-[#E8E0F0] text-[18px]'}`} {...props} />
  }

  const EmComponent = ({ node, ...props }: any) => {
    const inBlockquote = node?.parent?.tagName === 'BLOCKQUOTE'
    return <em className={`italic ${inBlockquote ? 'text-[#C9A84C]' : 'text-[#9B7BC9]'}`} {...props} />
  }

  const BlockquoteComponent = ({ node, ...props }: any) => (
    <blockquote
      className="my-8 pl-6 border-l-4 border-gradient-to-b from-[#C9A84C] via-[#7B5EA7] to-[#4ECDC4] bg-gradient-to-r from-[rgba(201,168,76,0.06)] to-transparent py-4 pr-4 rounded-r-xl text-[#C9A84C]"
      {...props}
    />
  )

  const HrComponent = ({ node, ...props }: any) => (
    <hr className="my-12 border-0 h-px bg-gradient-to-r from-transparent via-[rgba(201,168,76,0.3)] to-transparent" {...props} />
  )

  const UlComponent = ({ node, ...props }: any) => (
    <ul className="mb-6 space-y-2 text-[#B8B0CC]" {...props} />
  )

  const OlComponent = ({ node, ...props }: any) => (
    <ol className="mb-6 space-y-2 text-[#B8B0CC] list-none counter-reset-[item]" {...props} />
  )

  const LiComponent = ({ node, children, ...props }: any) => (
    <li className="flex items-start gap-3 text-[17px] leading-8">
      <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#7B5EA7] flex-shrink-0" />
      <span>{children}</span>
    </li>
  )

  // Custom image component — renders images full-width with proper styling
  // Also overrides paragraph to skip wrapper when child is an image
  const ImageComponent = ({ src, alt, ...props }: any) => (
    <figure className="my-8 w-full">
      <img
        src={src}
        alt={alt || ''}
        className="w-full rounded-xl border border-white/8 object-cover"
        loading="lazy"
        {...props}
      />
      {alt && alt !== '' && (
        <figcaption className="mt-3 text-center text-[#9B93AB] text-sm italic">
          {alt}
        </figcaption>
      )}
    </figure>
  )

  const CodeComponent = ({ node, inline, className, children, ...props }: any) => {
    if (inline) {
      return (
        <code className="font-mono text-[#4ECDC4] bg-[rgba(78,205,196,0.08)] px-1.5 py-0.5 rounded text-[15px] border border-[rgba(78,205,196,0.15)]" {...props}>
          {children}
        </code>
      )
    }
    return (
      <code className="block font-mono text-[#4ECDC4] bg-[rgba(78,205,196,0.06)] px-5 py-4 rounded-xl border border-[rgba(78,205,196,0.15)] text-[14px] leading-7 overflow-x-auto mb-6" {...props}>
        {children}
      </code>
    )
  }

  return (
    <article className="mx-auto max-w-4xl px-6 py-12">
      {/* Language switcher */}
      {translations && (
        <div className="mb-12 flex items-center gap-3 text-xs">
          <span className="text-[#9B93AB] uppercase tracking-widest">Translate:</span>
          <div className="flex gap-2">
            <button
              onClick={() => switchLang('en')}
              className={`rounded-full border px-3 py-1 transition ${
                lang === 'en'
                  ? 'border-[#C9A84C] bg-[rgba(201,168,76,0.1)] text-[#C9A84C]'
                  : 'border-white/20 text-[#9B93AB] hover:border-white/40'
              }`}
            >
              {labelEN}
            </button>
            {translations.tr && (
              <button
                onClick={() => switchLang('tr')}
                className={`rounded-full border px-3 py-1 transition ${
                  lang === 'tr'
                    ? 'border-[#C9A84C] bg-[rgba(201,168,76,0.1)] text-[#C9A84C]'
                    : 'border-white/20 text-[#9B93AB] hover:border-white/40'
                }`}
              >
                {labelTR}
              </button>
            )}
            {translations.ru && (
              <button
                onClick={() => switchLang('ru')}
                className={`rounded-full border px-3 py-1 transition ${
                  lang === 'ru'
                    ? 'border-[#C9A84C] bg-[rgba(201,168,76,0.1)] text-[#C9A84C]'
                    : 'border-white/20 text-[#9B93AB] hover:border-white/40'
                }`}
              >
                {labelRU}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="prose prose-invert max-w-none
        prose-headings:font-cinzel
        prose-p:text-[#B8B0CC]
        prose-p:leading-8
        prose-strong:text-[#E8E0F0]
        prose-a:text-[#7B5EA7]
        prose-blockquote:border-[var(--primary-gold)]/40
        prose-blockquote:text-[#E8E0F0]
        prose-li:text-[#B8B0CC]
        prose-hr:border-[rgba(255,255,255,0.08)]
        prose-code:text-[#4ECDC4]
        prose-pre:bg-black/30
        prose-pre:border
        prose-pre:border-white/8
        prose-table:text-[#B8B0CC]
      ">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: H1Component,
            h2: H2Component,
            h3: H3Component,
            h4: H4Component,
            p: ParagraphComponent,
            a: LinkComponent,
            strong: StrongComponent,
            em: EmComponent,
            blockquote: BlockquoteComponent,
            hr: HrComponent,
            ul: UlComponent,
            ol: OlComponent,
            li: LiComponent,
            code: CodeComponent,
            img: ImageComponent,
            // Table wrappers
            table: ({ node, ...props }: any) => <div className="my-8 overflow-x-auto rounded-xl border border-white/8"><table className="w-full" {...props} /></div>,
            th: ({ node, ...props }: any) => <th className="px-4 py-3 text-left text-[#C9A84C] font-semibold text-sm uppercase tracking-wider border-b border-white/8 bg-[rgba(201,168,76,0.04)]" {...props} />,
            td: ({ node, ...props }: any) => <td className="px-4 py-3 border-b border-white/5 text-[#B8B0CC]" {...props} />,
          }}
        >
          {rawBody}
        </ReactMarkdown>
      </div>

      {/* Related posts footer */}
      <div className="mt-16 pt-10 border-t border-white/8">
        <p className="text-xs uppercase tracking-widest text-[#9B93AB] mb-6">Explore Related Scrolls</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {posts.slice(0, 4).map((p) => (
            <a
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group flex items-center gap-3 p-4 rounded-xl border border-white/8 bg-white/[0.02] hover:bg-[rgba(201,168,76,0.05)] hover:border-[rgba(201,168,76,0.25)] transition-all duration-200"
            >
              <span className="w-1.5 h-8 rounded-full bg-gradient-to-b from-[#C9A84C] to-[#7B5EA7] flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-[#E8E0F0] group-hover:text-[#C9A84C] transition-colors leading-snug">{p.title}</p>
                <p className="text-xs text-[#9B93AB] mt-0.5">{p.tradition}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Scroll CTA — end-of-essay bridge to Oracle, Codex, and email signup */}
      {slug && <ScrollCTA slug={slug} />}
    </article>
  )
}
