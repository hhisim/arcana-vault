'use client';

import Link from 'next/link';
import { useSiteI18n } from '@/lib/site-i18n';

export default function BlogReturnButton() {
  const { lang } = useSiteI18n();
  const label = { en: 'Return to The Scroll', tr: 'Parşömene Dön', ru: 'Вернуться к Свитку' }[lang];
  return (
    <Link href="/blog" className="inline-flex items-center gap-2 text-gold hover:text-white transition-colors text-sm">
      ← {label}
    </Link>
  );
}
