'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface BlogContentProps {
  body: string;
  tradition: string;
}

export default function BlogContent({ body, tradition }: BlogContentProps) {
  return (
    <>
      <div className="max-w-3xl mx-auto px-6 py-24">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]} 
          components={{
            h2: ({node, ...props}) => <h2 className="text-3xl font-cinzel text-[#E8E0F0] mt-16 mb-8 border-b border-white/5 pb-2" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-2xl font-cinzel text-[#C9A84C] mt-10 mb-6" {...props} />,
            p: ({node, ...props}) => <p className="text-lg text-[#9B93AB] leading-relaxed mb-8" {...props} />,
            em: ({node, ...props}) => <em className="italic text-[#E8E0F0]" {...props} />,
            strong: ({node, ...props}) => <strong className="text-[#E8E0F0] font-semibold" {...props} />,
            hr: () => <hr className="border-white/10 my-16 opacity-30" />,
            blockquote: ({node, ...props}) => (
              <blockquote className="border-l-4 border-[#C9A84C] bg-[#12121A]/50 p-8 my-10 italic text-[#E8E0F0] rounded-r-2xl shadow-xl shadow-black/20" {...props} />
            ),
            ul: ({node, ...props}) => <ul className="text-[#9B93AB] space-y-4 my-8 list-disc pl-8 marker:text-[#7B5EA7]" {...props} />,
            ol: ({node, ...props}) => <ol className="text-[#9B93AB] space-y-4 my-8 list-decimal pl-8 marker:text-[#C9A84C]" {...props} />,
            a: ({node, ...props}) => <a className="text-[#C9A84C] hover:text-white underline transition-colors" {...props} />,
          }}
        >
          {body}
        </ReactMarkdown>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-40">
        <div className="glass-card p-16 text-center rounded-[2rem] border border-[#7B5EA7]/20 bg-gradient-to-br from-[#12121A] to-[#0A0A0F] shadow-[0_0_50px_rgba(123,94,167,0.15)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C9A84C]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <h3 className="font-cinzel text-3xl text-[#E8E0F0] mb-6">Continue the Inquiry</h3>
          <p className="text-[#9B93AB] mb-12 text-lg italic max-w-md mx-auto">
            Deepen your understanding with the AI manifestations of the {tradition} Oracle.
          </p>
          <a 
            href={`/chat?bot=${tradition.toLowerCase()}`} 
            className="inline-flex items-center justify-center px-12 py-5 bg-[#C9A84C] text-[#0A0A0F] font-bold rounded-2xl hover:scale-105 hover:bg-white transition-all duration-300 uppercase tracking-[0.2em] text-sm shadow-xl shadow-[#C9A84C]/10"
          >
            Consult the Oracle
          </a>
        </div>
      </div>
      
      <style jsx global>{`
        .font-cinzel { font-family: 'Cinzel', serif; }
        .glass-card { background: rgba(18, 18, 26, 0.6); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1); }
      `}</style>
    </>
  );
}
