'use client';

import React from 'react';
import Link from 'next/link';
import { useSiteI18n } from '@/lib/site-i18n';

interface FeatureRowData {
  label: string;
  generic: string;
  basic: string;
  vault: string;
}

function Cell({ value, highlight = false }: { value: string; highlight?: boolean }) {
  return (
    <span className={`text-sm ${highlight ? 'text-[#E8E0F0]' : 'text-[#9B93AB]'}`}>
      {value}
    </span>
  );
}

export default function ComparisonBlock() {
  const { t } = useSiteI18n();

  const features: FeatureRowData[] = [
    {
      label: t('home.comparison.row_label') || 'Features',
      generic: t('home.comparison.row_training_generic'),
      basic: t('home.comparison.row_training_basic'),
      vault: t('home.comparison.row_training_vault'),
    },
    {
      label: t('home.comparison.row_label_memory') || 'Memory',
      generic: t('home.comparison.row_memory_generic'),
      basic: t('home.comparison.row_memory_basic'),
      vault: t('home.comparison.row_memory_vault'),
    },
    {
      label: t('home.comparison.row_label_sources') || 'Sources cited',
      generic: t('home.comparison.row_sources_generic'),
      basic: t('home.comparison.row_sources_basic'),
      vault: t('home.comparison.row_sources_vault'),
    },
    {
      label: t('home.comparison.row_label_depth') || 'Tradition depth',
      generic: t('home.comparison.row_depth_generic'),
      basic: t('home.comparison.row_depth_basic'),
      vault: t('home.comparison.row_depth_vault'),
    },
    {
      label: t('home.comparison.row_label_corr') || 'Correspondence system',
      generic: t('home.comparison.row_corr_generic'),
      basic: t('home.comparison.row_corr_basic'),
      vault: t('home.comparison.row_corr_vault'),
    },
    {
      label: t('home.comparison.row_label_privacy') || 'Privacy',
      generic: t('home.comparison.row_privacy_generic'),
      basic: t('home.comparison.row_privacy_basic'),
      vault: t('home.comparison.row_privacy_vault'),
    },
  ];

  return (
    <section className="py-20 bg-deep border-y border-white/5">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl text-[#E8E0F0]">
            {t('home.comparison.title')}
          </h2>
          <p className="mt-3 text-[#9B93AB] text-base max-w-2xl mx-auto">
            {t('home.comparison.subtitle')}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Generic AI */}
          <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 opacity-70">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[#9B93AB] mb-2">{t('home.comparison.col_competitor') || 'Competitor'}</p>
              <h3 className="font-serif text-xl text-[#E8E0F0]">{t('home.comparison.col_generic')}</h3>
              <p className="mt-2 text-sm text-[#9B93AB]">ChatGPT, Claude, Gemini</p>
            </div>

            <div className="space-y-4">
              {features.map((row) => (
                <div key={row.label} className="border-b border-white/5 pb-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#9B93AB] mb-1.5">{row.label}</p>
                  <Cell value={row.generic} />
                </div>
              ))}

              {/* Pricing row */}
              <div className="pt-2">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#9B93AB] mb-1.5">{t('home.comparison.row_label_pricing') || 'Pricing'}</p>
                <Cell value={t('home.comparison.row_pricing_generic')} />
              </div>
            </div>
          </div>

          {/* Basic Occult Bot */}
          <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 opacity-80">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[#9B93AB] mb-2">{t('home.comparison.col_competitor') || 'Competitor'}</p>
              <h3 className="font-serif text-xl text-[#E8E0F0]">{t('home.comparison.col_basic')}</h3>
              <p className="mt-2 text-sm text-[#9B93AB]">{t('home.comparison.col_basic_sub') || 'Generic spiritual chatbots'}</p>
            </div>

            <div className="space-y-4">
              {features.map((row) => (
                <div key={row.label} className="border-b border-white/5 pb-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#9B93AB] mb-1.5">{row.label}</p>
                  <Cell value={row.basic} />
                </div>
              ))}

              {/* Pricing row */}
              <div className="pt-2">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#9B93AB] mb-1.5">{t('home.comparison.row_label_pricing') || 'Pricing'}</p>
                <Cell value={t('home.comparison.row_pricing_basic')} />
              </div>
            </div>
          </div>

          {/* Vault of Arcana — highlighted */}
          <div className="rounded-3xl border-2 border-[rgba(201,168,76,0.4)] bg-[rgba(201,168,76,0.05)] p-6 shadow-[0_0_40px_rgba(201,168,76,0.08)] relative">
            {/* Glow accent */}
            <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_top,rgba(201,168,76,0.08),transparent_60%)] pointer-events-none" />

            <div className="relative mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-2 w-2 rounded-full bg-[#C9A84C] animate-pulse"></span>
                <p className="text-xs uppercase tracking-[0.3em] text-[#C9A84C] font-bold">Vault of Arcana</p>
              </div>
              <h3 className="font-serif text-xl text-[#E8E0F0]">{t('home.comparison.col_vault')}</h3>
              <p className="mt-2 text-sm text-[#9B93AB]">{t('home.comparison.col_vault_sub')}</p>
            </div>

            <div className="relative space-y-4">
              {features.map((row) => (
                <div key={row.label} className="border-b border-[rgba(201,168,76,0.15)] pb-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#9B93AB] mb-1.5">{row.label}</p>
                  <Cell value={row.vault} highlight />
                </div>
              ))}

              {/* Pricing row */}
              <div className="pt-2">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#9B93AB] mb-1.5">{t('home.comparison.row_label_pricing') || 'Pricing'}</p>
                <Cell value={t('home.comparison.row_pricing_vault')} highlight />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[rgba(201,168,76,0.15)]">
              <Link
                href="/chat"
                className="block w-full rounded-xl bg-[#C9A84C] hover:bg-[#B8963F] py-3 text-sm font-bold text-black text-center transition-all duration-200 hover:shadow-[0_0_25px_rgba(201,168,76,0.3)]"
              >
                {t('home.comparison.cta')} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
