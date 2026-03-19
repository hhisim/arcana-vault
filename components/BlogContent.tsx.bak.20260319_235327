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
    <>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ node, ...props }) => <h2 className="font-serif text-2xl md:text-3xl text-primary-gold mt-12 mb-4" {...props} />,
          h3: ({ node, ...props }) => <h3 className="font-serif text-xl md:text-2xl text-text-primary mt-10 mb-3" {...props} />,
          p: ({ node, ...props }) => <p className="text-text-secondary leading-8 mb-6" {...props} />,
          em: ({ node, ...props }) => <em className="text-text-primary italic" {...props} />,
          strong: ({ node, ...props }) => <strong className="text-text-primary font-semibold" {...props} />,
          hr: () => (
            <div className="my-10 flex justify-center">
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary-gold to-transparent" />
            </div>
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-2 border-primary-purple/50 pl-6 italic text-text-primary my-8" {...props} />
          ),
          ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-6 my-6 space-y-3 text-text-secondary" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal list-outside ml-6 my-6 space-y-3 text-text-secondary" {...props} />,
          a: ({ node, ...props }) => <a className="text-primary-gold hover:text-primary-purple transition-colors underline underline-offset-4" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>

      <div className="glass-card mt-12 p-6 md:p-8 text-center">
        <h3 className="font-serif text-2xl text-text-primary mb-3">Consult the Oracle</h3>
        <p className="text-text-secondary mb-6">
          Have questions about this specific tradition or the symbols described in this scroll? Our repository of ancient knowledge is available for immediate retrieval.
        </p>
        <a
          href="/chat"
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary-gold to-primary-purple px-6 py-3 text-sm font-medium text-deep transition-transform hover:scale-[1.02]"
        >
          Open the Portal
        </a>
      </div>
    </>
  );
}
