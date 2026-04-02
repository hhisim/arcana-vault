'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSiteI18n } from '@/lib/site-i18n';

// FALLBACK_QUESTION and PRESET_QUESTIONS are now translated via messages/*.json
// Using empty strings as defaults — will be replaced by t() at render time
const PRESET_KEYS = [
  'home.demo.preset_0',
  'home.demo.preset_1',
  'home.demo.preset_2',
  'home.demo.preset_3',
  'home.demo.preset_4',
];

export default function DemoOracle() {
  const { t } = useSiteI18n();
  const [status, setStatus] = useState<'loading' | 'demo' | 'fallback'>('loading');
  const [answer, setAnswer] = useState('');
  const [question, setQuestion] = useState('');
  const [tradition, setTradition] = useState('Taoism');
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize translated fallback strings after mount
  useEffect(() => {
    setAnswer(t('home.demo.fallback_answer'));
    setQuestion(t('home.demo.fallback_question'));
    setTradition(t('home.demo.tradition_tao') || 'Taoism');
  }, [t]);

  useEffect(() => {
    fetch('/api/demo-oracle')
      .then(r => r.json())
      .then(d => {
        if (d.answer) {
          setAnswer(d.answer);
          setQuestion(d.question || t('home.demo.fallback_question'));
          setTradition(d.tradition || t('home.demo.tradition_tao') || 'Taoism');
          setStatus('demo');
        } else {
          setStatus('fallback');
        }
      })
      .catch(() => setStatus('fallback'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = inputValue.trim();
    if (!q || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/demo-oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setError(t('home.demo.error_limit'));
        } else {
          setError(data.error || t('home.demo.error_default'));
        }
        setIsSubmitting(false);
        return;
      }

      if (data.answer) {
        setQuestion(data.question || q);
        setAnswer(data.answer);
        setTradition(data.tradition || 'Oracle');
        setStatus('demo');
        setInputValue('');
        setShowInput(false);
        if (data.remaining !== undefined) setRemaining(data.remaining);
      }
    } catch {
      setError(t('home.demo.error_connection'));
    }

    setIsSubmitting(false);
  };

  const handlePreset = (preset: string) => {
    setInputValue(preset);
    setShowInput(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <section className="py-20 bg-deep">
      <div className="mx-auto max-w-[720px] px-6">
        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl md:text-4xl text-[#E8E0F0]">
            {t('home.demo.title')}
          </h2>
          <p className="mt-3 text-[#9B93AB] text-base">
            {t('home.demo.subtitle')}
          </p>
        </div>

        {/* Chat-style demo card */}
        <div className="rounded-3xl border border-[rgba(201,168,76,0.2)] bg-[#12121A] overflow-hidden shadow-2xl shadow-black/40">
          {/* Card header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[rgba(201,168,76,0.15)] border border-[rgba(201,168,76,0.3)] flex items-center justify-center">
                <svg className="w-4 h-4 text-[#C9A84C]" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="12" cy="12" r="1"/>
                  <path d="M12 5v2M12 17v2M5 12h2M17 12h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-[#E8E0F0]">{t('home.demo.oracle_label')}</p>
                <p className="text-xs text-[#9B93AB]">{t('home.demo.oracle_subtitle', '').replace('{tradition}', tradition)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {status === 'demo' && (
                <div className="flex items-center gap-1.5 mr-3">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs text-emerald-400 font-medium">{t('home.demo.status_demo')}</span>
                </div>
              )}
              {remaining !== null && remaining < 3 && (
                <span className="text-xs text-[#9B93AB] mr-2">{t('home.demo.remaining', '').replace('{remaining}', String(remaining))}</span>
              )}
              <span className="rounded-full bg-[rgba(123,94,167,0.2)] border border-[rgba(123,94,167,0.4)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#7B5EA7]">
                {t('home.demo.status_demo')}
              </span>
            </div>
          </div>

          {/* Preset questions */}
          <div className="px-6 pt-5 pb-0">
            <div className="flex flex-wrap gap-2">
              {PRESET_KEYS.map((key, i) => {
                const pq = t(key)
                return (
                  <button
                    key={i}
                    onClick={() => handlePreset(pq)}
                    className="text-left rounded-xl border border-[rgba(123,94,167,0.25)] bg-[rgba(123,94,167,0.08)] hover:bg-[rgba(123,94,167,0.18)] hover:border-[rgba(123,94,167,0.5)] px-3 py-2 text-xs text-[#C8C0D8] transition-all duration-200 cursor-pointer"
                  >
                    {pq.length > 50 ? pq.slice(0, 50) + '…' : pq}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Question bubble */}
          <div className="px-6 pt-5">
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-tr-md bg-[rgba(123,94,167,0.15)] border border-[rgba(123,94,167,0.25)] px-5 py-3">
                <p className="text-sm italic text-[#E8E0F0] leading-relaxed">
                  &ldquo;{question}&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Answer */}
          <div className="px-6 pt-4 pb-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[rgba(201,168,76,0.15)] border border-[rgba(201,168,76,0.3)] flex items-center justify-center mt-0.5">
                <svg className="w-3.5 h-3.5 text-[#C9A84C]" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="12" cy="12" r="1"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                {isSubmitting ? (
                  <div className="space-y-2">
                    <div className="h-3 w-3/4 rounded-full bg-white/10 animate-pulse"></div>
                    <div className="h-3 w-5/6 rounded-full bg-white/10 animate-pulse"></div>
                    <div className="h-3 w-2/3 rounded-full bg-white/10 animate-pulse"></div>
                  </div>
                ) : error ? (
                  <p className="text-sm text-red-400">{error}</p>
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

          {/* Ask your own */}
          {!showInput ? (
            <div className="px-6 pb-5">
              <button
                onClick={() => { setShowInput(true); setError(null); setTimeout(() => inputRef.current?.focus(), 50); }}
                className="w-full rounded-xl border border-[rgba(201,168,76,0.3)] bg-[rgba(201,168,76,0.05)] hover:bg-[rgba(201,168,76,0.12)] hover:border-[rgba(201,168,76,0.6)] py-3 text-sm text-[#C9A84C] transition-all duration-200 cursor-pointer"
              >
                {t('home.demo.ask_own')} →
              </button>
            </div>
          ) : (
            <div className="px-6 pb-5">
              <form onSubmit={handleSubmit} className="space-y-3">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder={t('home.demo.input_placeholder')}
                  rows={3}
                  className="w-full rounded-xl border border-[rgba(123,94,167,0.3)] bg-[rgba(18,18,26,0.8)] px-4 py-3 text-sm text-[#E8E0F0] placeholder-[#6B6180] resize-none focus:outline-none focus:border-[rgba(123,94,167,0.7)] transition-colors"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isSubmitting}
                    className="flex-1 rounded-xl bg-[rgba(123,94,167,0.3)] hover:bg-[rgba(123,94,167,0.5)] disabled:opacity-40 disabled:cursor-not-allowed border border-[rgba(123,94,167,0.5)] py-2.5 text-sm font-medium text-[#E8E0F0] transition-all duration-200 cursor-pointer"
                  >
                    {isSubmitting ? t('home.demo.submit_consulting') : t('home.demo.submit_consult')}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowInput(false); setError(null); setInputValue(''); }}
                    className="rounded-xl border border-white/10 hover:border-white/20 px-4 py-2.5 text-sm text-[#9B93AB] transition-all duration-200 cursor-pointer"
                  >
                    {t('home.demo.cancel')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] text-[#9B93AB]">
              <svg className="w-3 h-3 text-[#7B5EA7]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              <span>{t('home.demo.footer_note')}</span>
            </div>

            <Link
              href="/chat"
              className="rounded-xl border border-[rgba(201,168,76,0.5)] bg-[rgba(201,168,76,0.1)] hover:bg-[rgba(201,168,76,0.2)] hover:border-[#C9A84C] px-4 py-2 text-xs font-bold text-[#C9A84C] transition-all duration-200"
            >
              {t('home.demo.full_oracle')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
