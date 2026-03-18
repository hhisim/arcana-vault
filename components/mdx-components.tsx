import React from 'react';

export const MDXComponents = {
  h2: (props: any) => <h2 className="text-3xl font-cinzel text-[#E8E0F0] mt-12 mb-6" {...props} />,
  h3: (props: any) => <h3 className="text-2xl font-cinzel text-[#C9A84C] mt-8 mb-4" {...props} />,
  p: (props: any) => <p className="text-lg text-[#9B93AB] leading-relaxed mb-6" {...props} />,
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-[#C9A84C] bg-[#12121A]/50 p-6 my-8 italic text-[#E8E0F0] rounded-r-lg" {...props}>
      {props.children}
    </blockquote>
  ),
  ul: (props: any) => <ul className="text-[#9B93AB] space-y-3 my-6 list-disc pl-6 marker:text-[#7B5EA7]" {...props} />,
  ol: (props: any) => <ol className="text-[#9B93AB] space-y-3 my-6 list-decimal pl-6 marker:text-[#C9A84C]" {...props} />,
  a: (props: any) => <a className="text-[#C9A84C] hover:underline transition-colors" {...props} />,
  hr: (props: any) => <hr className="border-[rgba(255,255,255,0.06)] my-12" {...props} />,
  strong: (props: any) => <strong className="text-[#E8E0F0] font-semibold" {...props} />,
  img: (props: any) => (
    <div className="my-8 rounded-lg overflow-hidden ring-1 ring-[#7B5EA7]/20 shadow-[0_0_20px_rgba(123,94,167,0.15)]">
      <img {...props} className="w-full h-auto" />
    </div>
  ),
};
