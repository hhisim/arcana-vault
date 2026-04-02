'use client';

import React from 'react';
import Link from 'next/link';
import { useSiteI18n } from '@/lib/site-i18n';
import CodexConstellation from './CodexConstellation';

const DIMENSIONS = [
  'home.correspondence.dim_planets',
  'home.correspondence.dim_chakras',
  'home.correspondence.dim_frequencies',
  'home.correspondence.dim_kabbalah',
  'home.correspondence.dim_i_ching',
  'home.correspondence.dim_colors',
  'home.correspondence.dim_elements',
  'home.correspondence.dim_geometry',
  'home.correspondence.dim_tarot',
  'home.correspondence.dim_metals',
  'home.correspondence.dim_plants',
  'home.correspondence.dim_physiology',
];

export default function CodexShowcase() {
  const { t } = useSiteI18n();

  return (
    <section className="border-b border-white/5 bg-[#0a0a10]">
      <div className="mx-auto max-w-5xl px-6 py-20 md:px-8">
        {/* Section label */}
        <div className="mb-6 text-center">
          <p className="inline-block text-xs uppercase tracking-[0.45em] text-[#C9A84C]">
            {t('home.correspondence.eyebrow')}
          </p>
        </div>

        {/* Heading */}
        <div className="mb-6 text-center">
          <h2 className="font-serif text-4xl text-[#E8E0F0] md:text-5xl">
            {t('home.correspondence.title')}
          </h2>
        </div>

        {/* Subtitle */}
        <div className="mb-12 text-center">
          <p className="mx-auto max-w-2xl text-lg leading-8 text-[#9B93AB]">
            {t('home.correspondence.subtitle')}
          </p>
        </div>

        {/* Animated constellation */}
        <div className="mb-14">
          <CodexConstellation className="rounded-2xl" />
        </div>

        {/* Dimension badges */}
        <div className="mb-10 flex flex-wrap justify-center gap-2.5">
          {DIMENSIONS.map((key) => (
            <span
              key={key}
              className="rounded-full border border-[#7B5EA7]/30 bg-[#7B5EA7]/10 px-3.5 py-1.5 text-xs text-[#9B93AB] transition-all duration-200 hover:border-[#7B5EA7]/60 hover:bg-[#7B5EA7]/20 hover:text-[#E8E0F0]"
            >
              {t(key)}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="mb-4 text-center">
          <Link
            href="/correspondence-engine"
            className="inline-flex items-center gap-2 rounded-xl bg-[#C9A84C] px-8 py-3.5 text-sm font-semibold text-black transition-all duration-200 hover:bg-[#B8963F] hover:shadow-[0_0_30px_rgba(201,168,76,0.25)]"
          >
            {t('home.correspondence.cta')}
          </Link>
        </div>

        {/* Secondary text */}
        <div className="mb-8 text-center">
          <p className="text-sm text-[#9B93AB]">
            {t('home.correspondence.free_note')}
          </p>
        </div>

        {/* Cross-sell note */}
        <div className="mx-auto max-w-xl rounded-2xl border border-[#7B5EA7]/20 bg-[#7B5EA7]/5 px-5 py-4 text-center">
          <p className="text-xs leading-6 text-[#9B93AB]">
            <span className="text-[#7B5EA7] font-medium">{t('home.correspondence.cross_sell_bold') || 'Every correspondence in the Codex is known to the Oracle.'}</span>{' '}
            {t('home.correspondence.cross_sell')}
          </p>
        </div>
      </div>
    </section>
  );
}
