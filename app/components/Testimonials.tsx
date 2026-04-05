'use client';

import { useSiteI18n } from '@/lib/site-i18n';

export default function Testimonials() {
  const { t } = useSiteI18n();

  const testimonials = [
    { quote: t('testimonials.1.quote'), author: t('testimonials.1.author'), role: t('testimonials.1.role') },
    { quote: t('testimonials.2.quote'), author: t('testimonials.2.author'), role: t('testimonials.2.role') },
    { quote: t('testimonials.3.quote'), author: t('testimonials.3.author'), role: t('testimonials.3.role') },
    { quote: t('testimonials.4.quote'), author: t('testimonials.4.author'), role: t('testimonials.4.role') },
    { quote: t('testimonials.5.quote'), author: t('testimonials.5.author'), role: t('testimonials.5.role') },
    { quote: t('testimonials.6.quote'), author: t('testimonials.6.author'), role: t('testimonials.6.role') },
  ];

  return (
    <section className="py-24 px-6 bg-[#12121A]/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-cinzel text-3xl md:text-4xl text-center text-[#E8E0F0] mb-16 animate-fade-in-up">
          {t('testimonials.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t_data, i) => (
            <div
              key={i}
              className="glass-card p-8 flex flex-col transition-all duration-300 hover:shadow-[0_0_20px_rgba(147,112,219,0.2)] animate-fade-in-up"
              style={{ animationDelay: `${(i + 1) * 0.1}s` }}
            >
              <p className="text-[#E8E0F0] italic leading-relaxed mb-6 flex-1">
                &ldquo;{t_data.quote}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#7B5EA7] flex items-center justify-center text-[#E8E0F0] font-cinzel font-bold shrink-0">
                  {t_data.author}
                </div>
                <div>
                  <div className="text-[#E8E0F0] font-medium leading-tight">{t_data.author}</div>
                  <div className="text-[#9B93AB] text-sm mt-1">{t_data.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
