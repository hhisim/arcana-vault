'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type BlogContentProps = { body: string; tradition: string; translations?: { tr?: string; ru?: string } }

export default function BlogContent({ body }: BlogContentProps) {
  return (
    <article className="mx-auto max-w-4xl">
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
        >{body}</ReactMarkdown>
      </div>
    </article>
  )
}
