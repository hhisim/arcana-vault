'use client';

import { useEffect, useMemo, useState } from 'react';

type GlitchCycleTextProps = {
  phrases: string[];
  className?: string;
  intervalMs?: number;
  glitchMs?: number;
  as?: keyof JSX.IntrinsicElements;
};

export default function GlitchCycleText({
  phrases,
  className = '',
  intervalMs = 5200,
  glitchMs = 180,
  as = 'span',
}: GlitchCycleTextProps) {
  const safePhrases = useMemo(() => phrases.filter(Boolean), [phrases]);
  const [index, setIndex] = useState(0);
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    if (safePhrases.length <= 1) return;

    const media = typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;

    if (media?.matches) return;

    const cycle = window.setInterval(() => {
      setGlitching(true);
      window.setTimeout(() => {
        setIndex((prev) => (prev + 1) % safePhrases.length);
        setGlitching(false);
      }, glitchMs);
    }, intervalMs);

    return () => window.clearInterval(cycle);
  }, [safePhrases.length, intervalMs, glitchMs]);

  const Tag = as as any;
  const text = safePhrases[index] ?? '';

  return (
    <>
      <Tag
        className={`voa-glitch ${glitching ? 'is-glitching' : ''} ${className}`}
        data-text={text}
        aria-live="polite"
      >
        {text}
      </Tag>

      <style jsx global>{`
        /* One DOM node only — decorative layers via CSS pseudo-elements */
        .voa-glitch {
          position: relative;
          display: inline-block;
          line-height: 1.08;
        }

        .voa-glitch::before,
        .voa-glitch::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          opacity: 0;
          pointer-events: none;
          z-index: 2;
          user-select: none;
        }

        .voa-glitch.is-glitching {
          animation: voa-glitch-main ${glitchMs}ms steps(2, end);
        }

        .voa-glitch.is-glitching::before {
          opacity: 0.22;
          color: var(--primary-gold, #C9A84C);
          animation: voa-glitch-a ${glitchMs}ms steps(2, end);
          z-index: 2;
        }

        .voa-glitch.is-glitching::after {
          opacity: 0.18;
          color: #a78bfa;
          animation: voa-glitch-b ${glitchMs}ms steps(2, end);
          z-index: 1;
        }

        @keyframes voa-glitch-main {
          0%   { transform: translate(0, 0); filter: blur(0); }
          20%  { transform: translate(-1px, 0); }
          40%  { transform: translate(1px, -1px); }
          60%  { transform: translate(0, 1px); filter: blur(0.2px); }
          100% { transform: translate(0, 0); filter: blur(0); }
        }

        @keyframes voa-glitch-a {
          0%   { transform: translate(0, 0); clip-path: inset(0 0 0 0); }
          25%  { transform: translate(-2px, 0); clip-path: inset(10% 0 55% 0); }
          50%  { transform: translate(1px, -1px); clip-path: inset(65% 0 5% 0); }
          100% { transform: translate(0, 0); clip-path: inset(0 0 0 0); }
        }

        @keyframes voa-glitch-b {
          0%   { transform: translate(0, 0); clip-path: inset(0 0 0 0); }
          25%  { transform: translate(2px, 1px); clip-path: inset(55% 0 15% 0); }
          50%  { transform: translate(-1px, 0); clip-path: inset(5% 0 70% 0); }
          100% { transform: translate(0, 0); clip-path: inset(0 0 0 0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .voa-glitch,
          .voa-glitch::before,
          .voa-glitch::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
}
