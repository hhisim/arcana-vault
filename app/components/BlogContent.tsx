'use client';

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLang } from '@/lib/lang-context';

interface BlogContentProps {
  body: string;
  tradition: string;
  translations?: {
    tr?: string;
    ru?: string;
  };
}

export default function BlogContent({ body, tradition, translations }: BlogContentProps) {
  const { lang } = useLang();
  const [content, setContent] = useState(body);

  useEffect(() => {
    if (lang === 'tr' && translations?.tr) {
      setContent(translations.tr);
    } else if (lang === 'ru' && translations?.ru) {
      setContent(translations.ru);
    } else {
      setContent(body);
    }
  }, [lang, body, translations]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="prose prose-invert prose-lg md:prose-xl max-w-none 
        prose-headings:font-cinzel prose-headings:text-[#E8E0F0] 
        prose-p:text-[#9B93AB] prose-p:leading-relaxed 
        prose-a:text-[#C9A84C] prose-a:no-underline hover:prose-a:underline
        prose-strong:text-[#C9A84C] prose-code:text-[#7B5EA7]
        prose-blockquote:border-l-[#7B5EA7] prose-blockquote:bg-[#12121A]/50 prose-blockquote:p-6 prose-blockquote:rounded-r-lg">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>

      <footer className="mt-32 pt-12 border-t border-white/5 text-center">
        <div className="inline-block p-12 rounded-2xl bg-gradient-to-b from-[#12121A] to-transparent border border-white/5 max-w-2xl">
          <h3 className="font-cinzel text-2xl text-[#E8E0F0] mb-6">Consult the Oracle</h3>
          <p className="text-[#9B93AB] mb-10 leading-relaxed italic">
            Have questions about this specific tradition or the symbols described in this scroll? Our repository of ancient knowledge is available for immediate retrieval.
          </p>
          <a href="/chat" className="px-10 py-4 bg-[#C9A84C] text-[#0A0A0F] rounded-lg font-bold tracking-widest uppercase text-xs hover:shadow-[0_0_30px_rgba(201,168,76,0.3)] transition-all">
            Open the Portal
          </a>
        </div>
      </footer>
    </div>
  );
}
