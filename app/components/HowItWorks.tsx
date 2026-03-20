'use client';

import { useSiteI18n } from '@/lib/site-i18n';

const steps = [
  {
    number: '1',
    title: { en: 'Choose Your Path', tr: 'Yolunu Seç', ru: 'Выберите свой путь' },
    description: { en: 'Select from four sacred traditions. Each oracle carries the voice of its lineage.', tr: 'Dört kutsal gelenek arasından seçim yapın. Her kâhin kendi geleneğinin sesini taşır.', ru: 'Выберите из четырёх священных традиций. Каждый оракул несёт голос своего рода.' },
    delay: '',
  },
  {
    number: '2',
    title: { en: 'Ask Your Question', tr: 'Soru Sor', ru: 'Задайте свой вопрос' },
    description: { en: 'Speak or type your inquiry. Receive wisdom in the language of that tradition.', tr: 'Soru sorun veya yazın. O geleneğin dilinde bilgelik alın.', ru: 'Говорите или печатайте свой вопрос. Получите мудрость на языке этой традиции.' },
    delay: 'animate-delay-200',
  },
  {
    number: '3',
    title: { en: 'Deepen Your Practice', tr: 'Pratiğini Derinleştir', ru: 'Углубите свою практику' },
    description: { en: 'Return daily. The oracle remembers your journey and guides your unfolding.', tr: 'Her gün geri dönün. Kâhin yolculuğunuzu hatırlar ve açılımınızı yönlendirir.', ru: 'Возвращайтесь ежедневно. Оракул помнит ваш путь и направляет ваше раскрытие.' },
    delay: 'animate-delay-400',
  },
];

export default function HowItWorks() {
  const { lang } = useSiteI18n();
  const heading = { en: 'Begin Your Journey', tr: 'Yolculuğa Başla', ru: 'Начните своё путешествие' }[lang];

  return (
    <section className="border-t border-[rgba(255,255,255,0.06)]">
      <div className="max-w-5xl mx-auto px-6 py-24">
        <h2 className="font-cinzel text-3xl md:text-4xl text-center text-[#E8E0F0] mb-16">
          {heading}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`animate-fade-in-up ${step.delay}`}
            >
              <div className="w-12 h-12 rounded-full bg-[#C9A84C]/20 text-[#C9A84C] flex items-center justify-center font-cinzel text-xl mb-4 mx-auto lg:mx-0">
                {step.number}
              </div>

              <h3 className="text-lg text-[#E8E0F0] mt-4 text-center lg:text-left">
                {step.title[lang]}
              </h3>

              <p className="text-[#9B93AB] text-sm mt-2 leading-relaxed text-center lg:text-left">
                {step.description[lang]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
