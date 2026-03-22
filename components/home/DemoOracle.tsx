'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const FALLBACK_ANSWER = "The Tao Te Ching opens with what may be the most profound single line ever written: 'The Tao that can be told is not the eternal Tao.' But the second verse cuts deeper still — 'Yield and survive. Bend and remain straight. Emptiness holds everything. Stillness returns to its nature. The soft overcomes the hard. The yielding overcomes the 坚硬.' Wu wei — not by pushing, but by learning the shape of what already wants to move. The river does not force its path. It finds it. This is the first teaching: not action, but alignment.";

const QUESTION = "What is the first teaching of the Tao Te Ching about yielding?";

export default function DemoOracle() {
  const [status, setStatus] = useState<'loading' | 'live' | 'fallback'>('loading');
  const [answer, setAnswer] = useState<string>(FALLBACK_ANSWER);

  useEffect(() => {
    fetch('/api/demo-oracle')
      .then(r => r.json())
      .then(d => {
        if (d.answer) {
          setAnswer(d.answer);
          setStatus('live');
        } else {
          setStatus('fallback');
        }
      })
      .catch(() => setStatus('fallback'));
  }, []);

  return (
    <section className="py-20 bg-deep">
      <div className="mx-auto max-w-[720px] px-6">
        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl md:text-4xl text-[#E8E0F0]">
            Experience the Oracle
          </h2>
          <p className="mt-3 text-[#9B93AB] text-base">
            A glimpse into the living intelligence of the Vault
          </p>
        </div>

        {/* Chat-style demo card */}
        <div className="rounded-3xl border border-[rgba(201,168,76,0.2)] bg-[#12121A] overflow-hidden shadow-2xl shadow-black/40">
          {/* Card header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              {/* Oracle icon */}
              <div className="w-8 h-8 rounded-full bg-[rgba(201,168,76,0.15)] border border-[rgba(201,168,76,0.3)] flex items-center justify-center">
                <svg className="w-4 h-4 text-[#C9A84C]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                  <circle cx="12" cy="12" r="3" fill="none" stroke="#C9A84C" strokeWidth="1.5"/>
                  <path d="M12 5v2M12 17v2M5 12h2M17 12h2" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-[#E8E0F0]">Tao Oracle</p>
                <p className="text-xs text-[#9B93AB]">Vault of Arcana</p>
              </div>
            </div>

            {/* DEMO badge */}
            <div className="flex items-center gap-2">
              {status === 'live' && (
                <div className="flex items-center gap-1.5 mr-3">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs text-emerald-400 font-medium">Live</span>
                </div>
              )}
              <span className="rounded-full bg-[rgba(123,94,167,0.2)] border border-[rgba(123,94,167,0.4)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#7B5EA7]">
                Demo
              </span>
            </div>
          </div>

          {/* Question bubble (right-aligned, user style) */}
          <div className="px-6 pt-6">
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-tr-md bg-[rgba(123,94,167,0.15)] border border-[rgba(123,94,167,0.25)] px-5 py-3">
                <p className="text-sm italic text-[#E8E0F0] leading-relaxed">
                  &ldquo;{QUESTION}&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Answer (left-aligned, oracle style) */}
          <div className="px-6 pt-4 pb-6">
            <div className="flex items-start gap-3">
              {/* Oracle avatar */}
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[rgba(201,168,76,0.15)] border border-[rgba(201,168,76,0.3)] flex items-center justify-center mt-0.5">
                <svg className="w-3.5 h-3.5 text-[#C9A84C]" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="12" cy="12" r="1"/>
                </svg>
              </div>

              {/* Answer text */}
              <div className="flex-1 min-w-0">
                {status === 'loading' ? (
                  <div className="space-y-2">
                    <div className="h-3 w-3/4 rounded-full bg-white/10 animate-pulse"></div>
                    <div className="h-3 w-5/6 rounded-full bg-white/10 animate-pulse"></div>
                    <div className="h-3 w-2/3 rounded-full bg-white/10 animate-pulse"></div>
                  </div>
                ) : (
                  <blockquote className="border-l-2 border-[#7B5EA7] pl-4">
                    <p className="text-sm leading-relaxed text-[#C8C0D8]">
                      {answer}
                    </p>
                  </blockquote>
                )}
              </div>
            </div>
          </div>

          {/* Card footer */}
          <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
            {status === 'live' ? (
              <div className="flex items-center gap-1.5 text-[10px] text-[#9B93AB]">
                <svg className="w-3 h-3 text-[#C9A84C]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>
                </svg>
                <span>Powered by the Archive</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[10px] text-[#9B93AB]">
                <svg className="w-3 h-3 text-[#7B5EA7]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                <span>Preview answer shown</span>
              </div>
            )}

            <Link
              href="/chat"
              className="rounded-xl border border-[rgba(201,168,76,0.5)] bg-[rgba(201,168,76,0.1)] hover:bg-[rgba(201,168,76,0.2)] hover:border-[#C9A84C] px-4 py-2 text-xs font-bold text-[#C9A84C] transition-all duration-200"
            >
              Ask Your Own Question →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
