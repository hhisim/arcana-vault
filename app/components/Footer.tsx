'use client'
import { useSiteI18n } from '@/lib/site-i18n'
import { SITEDICT } from '@/lib/dictionary'
import EmailCapture from '@/components/EmailCapture'

export default function Footer() {
  const { t } = useSiteI18n()
  return (
    <footer className="border-t border-white/8 bg-deep/95">
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-10">
        <div className="grid gap-10 md:grid-cols-[1.4fr,1fr,1fr]">
          <div>
            <div className="text-sm uppercase tracking-[0.28em] text-[var(--primary-gold)]">
              {t('footer.vault_of_arcana', 'Vault of Arcana')}
            </div>
            <p className="mt-4 max-w-xl leading-8 text-text-secondary">
              {t('footer.tagline', 'A living mystery school built from rare archives, curated datasets, symbolic intelligence, and the evolving collaboration of Hakan Hisim + PRIME.')}
            </p>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-[0.2em] text-text-primary">{t('footer.explore', 'Explore')}</h3>
            <div className="mt-4 flex flex-col gap-3 text-text-secondary">
              <a href="/chat" className="hover:text-text-primary">{t('nav.chat', 'Portal')}</a>
              <a href="/daily" className="hover:text-text-primary">{t(SITEDICT.nav.daily)}</a>
              <a href="/library" className="hover:text-text-primary">{t('nav.library', 'Library')}</a>
              <a href="/journal" className="hover:text-text-primary">{t(SITEDICT.nav.journal)}</a>
              <a href="/inquiry" className="hover:text-text-primary">{t(SITEDICT.nav.inquiry)}</a>
              <a href="/blog" className="hover:text-text-primary">{t('nav.scroll', 'The Scroll')}</a>
              <a href="/agora" className="hover:text-text-primary">{t('nav.agora', 'Agora')}</a>
              <a href="/about" className="hover:text-text-primary">{t('nav.about', 'About')}</a>
              <a href="/faq" className="hover:text-text-primary">{t(SITEDICT.nav.faq)}</a>
            </div>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-[0.2em] text-text-primary">{t('footer.vision', 'Vision')}</h3>
            <p className="mt-4 leading-8 text-text-secondary">
              {t('footer.vision_text', 'Begin with four living gateways. Grow into a larger constellation of traditions, agents, correspondences, archives, and human–AI dialogue.')}
            </p>
          </div>
        </div>

        <div className="mt-10">
          <EmailCapture variant="full" />
        </div>

        <div className="mt-10 border-t border-white/8 pt-6 text-sm text-text-secondary">
          {t('footer.copyright', '© 2026 Vault of Arcana · Rare wisdom, living dialogue.')}
        </div>
      </div>
    </footer>
  )
}
