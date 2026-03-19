'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type BlogContentProps = {
  body: string
  tradition: string
  translations?: {
    tr?: string
    ru?: string
  }
}

export default function BlogContent({ body }: BlogContentProps) {
  return (
    <div className="prose prose-invert max-w-none prose-headings:font-serif prose-headings:text-[var(--text-primary)] prose-p:text-[var(--text-secondary)] prose-p:leading-8 prose-strong:text-[var(--text-primary)] prose-a:text-[var(--primary-gold)] prose-blockquote:border-[var(--primary-gold)]/40 prose-blockquote:text-[var(--text-primary)] prose-li:text-[var(--text-secondary)] prose-hr:border-[rgba(255,255,255,0.08)]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({node, ...props}) => <h1 className="font-cinzel text-4xl md:text-5xl mb-6 text-[var(--text-primary)]" {...props} />,
          h2: ({node, ...props}) => <h2 className="font-cinzel text-3xl md:text-4xl mt-14 mb-5 text-[var(--text-primary)]" {...props} />,
          h3: ({node, ...props}) => <h3 className="font-cinzel text-2xl md:text-3xl mt-10 mb-4 text-[var(--text-primary)]" {...props} />,
          p: ({node, ...props}) => <p className="mb-6 text-[17px] leading-8 text-[var(--text-secondary)]" {...props} />,
          ul: ({node, ...props}) => <ul className="mb-6 list-disc pl-6 space-y-2" {...props} />,
          ol: ({node, ...props}) => <ol className="mb-6 list-decimal pl-6 space-y-2" {...props} />,
          blockquote: ({node, ...props}) => <blockquote className="my-8 border-l-2 pl-5 italic text-[var(--text-primary)]" {...props} />,
          code: ({inline, className, children, ...props}: any) =>
            inline ? (
              <code className="rounded bg-white/5 px-1.5 py-0.5 text-[var(--primary-gold)]" {...props}>{children}</code>
            ) : (
              <code className="block overflow-x-auto rounded-2xl border border-white/8 bg-black/30 p-4 text-sm" {...props}>{children}</code>
            ),
          table: ({node, ...props}) => <div className="my-8 overflow-x-auto"><table className="w-full border-collapse" {...props} /></div>,
          th: ({node, ...props}) => <th className="border-b border-white/10 px-3 py-2 text-left text-[var(--text-primary)]" {...props} />,
          td: ({node, ...props}) => <td className="border-b border-white/5 px-3 py-2 text-[var(--text-secondary)]" {...props} />,
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  )
}
