'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useSiteI18n } from '@/lib/site-i18n'

type FmI18n = {
  tr?: { title?: string; excerpt?: string }
  ru?: { title?: string; excerpt?: string }
}

type BlogContentProps = {
  body: string
  tradition: string
  translations?: { tr?: string; ru?: string }
  fmI18n?: FmI18n
  defaultTitle?: string
}

export default function BlogContent({ body, translations, fmI18n, defaultTitle = '' }: BlogContentProps) {
  const { lang } = useSiteI18n()

  // Select content based on language
  const rawBody = (lang === 'tr' && translations?.tr)
    ? translations.tr
    : (lang === 'ru' && translations?.ru)
    ? translations.ru
    : body

  // Get translated title/excerpt for SSR injected title
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

  return (
    <article className="mx-auto max-w-4xl">
      {/* Language switcher */}
      {translations && (
        <div className="mb-8 flex items-center gap-3 text-xs">
          <span className="text-text-secondary uppercase tracking-widest">Translate:</span>
          <div className="flex gap-2">
            <button
              onClick={() => switchLang('en')}
              className={`rounded-full border px-3 py-1 transition ${
                lang === 'en'
                  ? 'border-gold bg-gold/10 text-gold'
                  : 'border-white/20 text-text-secondary hover:border-white/40'
              }`}
            >
              {labelEN}
            </button>
            {translations.tr && (
              <button
                onClick={() => switchLang('tr')}
                className={`rounded-full border px-3 py-1 transition ${
                  lang === 'tr'
                    ? 'border-gold bg-gold/10 text-gold'
                    : 'border-white/20 text-text-secondary hover:border-white/40'
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
                    ? 'border-gold bg-gold/10 text-gold'
                    : 'border-white/20 text-text-secondary hover:border-white/40'
                }`}
              >
                {labelRU}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="prose prose-invert max-w-none prose-headings:font-cinzel prose-headings:text-[var(--text-primary)] prose-p:text-[var(--text-secondary)] prose-p:leading-8 prose-strong:text-[var(--text-primary)] prose-a:text-[var(--primary-gold)] prose-blockquote:border-[var(--primary-gold)]/40 prose-blockquote:text-[var(--text-primary)] prose-li:text-[var(--text-secondary)] prose-hr:border-[rgba(255,255,255,0.08)] prose-code:text-[var(--primary-gold)] prose-pre:bg-black/30 prose-pre:border prose-pre:border-white/8 prose-table:text-[var(--text-secondary)]">
        <ReactMarkdown remarkPlugins={[remarkGfm]}
          components={{
            h1: ({node,...props}) => <h1 className="font-cinzel text-4xl md:text-5xl mb-6" {...props} />,
            h2: ({node,...props}) => <h2 className="font-cinzel text-3xl md:text-4xl mt-14 mb-5" {...props} />,
            h3: ({node,...props}) => <h3 className="font-cinzel text-2xl md:text-3xl mt-10 mb-4" {...props} />,
            p: ({node,...props}) => <p className="mb-6 text-[17px] leading-8" {...props} />,
            table: ({node,...props}) => <div className="my-8 overflow-x-auto"><table className="w-full border-collapse" {...props} /></div>,
            th: ({node,...props}) => <th className="border-b border-white/10 px-3 py-2 text-left text-[var(--text-primary)]" {...props} />,
            td: ({node,...props}) => <td className="border-b border-white/5 px-3 py-2" {...props} />,
          }}
        >{rawBody}</ReactMarkdown>
      </div>
    </article>
  )
}
