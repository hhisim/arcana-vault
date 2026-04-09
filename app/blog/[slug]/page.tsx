import { promises as fs } from 'fs';
import path from 'path';
import React from 'react';
import matter from 'gray-matter';
import { cookies } from 'next/headers';
import { posts } from '@/lib/posts';
import BlogContent from '@/components/BlogContent';
import BlogReturnButton from '@/components/BlogReturnButton';
import EmailCaptureWrapper from '@/components/EmailCaptureWrapper';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) return {};
  const meta = essayMeta[params.slug] || {};
  const title = post.title || params.slug.replace(/-/g, ' ');
  return {
    title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `https://www.vaultofarcana.com/blog/${params.slug}`,
    },
    openGraph: {
      title: `${title} | Vault of Arcana`,
      description: meta.description,
      url: `https://www.vaultofarcana.com/blog/${params.slug}`,
      type: 'article',
      images: [{ url: `/images/blog/${params.slug}/cover.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Vault of Arcana`,
      description: meta.description,
    },
  };
}

const essayMeta: Record<string, { description: string; keywords: string[] }> = {
  'dmt-hyperbolic-mind': {
    description: 'Explore the geometry of DMT hyperspace — hyperbolic manifolds, entity encounters, and the mathematics of visionary states. A treatise from Vault of Arcana.',
    keywords: ['DMT', 'hyperbolic geometry', 'altered states of consciousness', 'Terence McKenna', 'entheogens'],
  },
  'alchemy-of-soul-magnum-opus': {
    description: 'From nigredo to rubedo — the 12 stages of the alchemical Magnum Opus mapped as a path of inner transformation.',
    keywords: ['alchemy', 'Magnum Opus', 'nigredo', 'rubedo', 'solve et coagula', 'Great Work'],
  },
  'dreamwalker-lucid-dreaming-astral-projection': {
    description: "Techniques for lucid dreaming and astral projection — from LaBerge's modern research to Monroe's out-of-body methods.",
    keywords: ['lucid dreaming', 'astral projection', 'Robert Monroe', 'Stephen LaBerge', 'out-of-body experience'],
  },
  'enochian-angelic-language-modern-occultism': {
    description: "John Dee and Edward Kelley's angelic language — the 48 Enochian Calls, elemental tablets, and their influence on the Golden Dawn.",
    keywords: ['Enochian', 'John Dee', 'Edward Kelley', 'angelic language', 'Golden Dawn', 'Enochian Calls'],
  },
  'five-tibetans-ancient-rites-of-rejuvenation': {
    description: 'Are the Five Tibetan Rites ancient yoga or Western invention? Separating genuine practice from Orientalist mythology.',
    keywords: ['Five Tibetans', 'Tibetan yoga', 'rejuvenation', 'Peter Kelder', 'Orientalist mythology'],
  },
  'gnosticism-archive-of-light-architecture-divine-spark': {
    description: 'The Pleroma, the Demiurge, Archons, and the divine spark — Gnostic cosmology as a technical map for consciousness.',
    keywords: ['Gnosticism', 'Pleroma', 'Demiurge', 'Archons', 'divine spark', 'Gnostic cosmology'],
  },
  'i-ching-ancient-oracle-of-change': {
    description: '3,000 years of oracular wisdom — 8 trigrams, 64 hexagrams, and the oldest divination system on Earth.',
    keywords: ['I Ching', 'Yijing', 'hexagrams', 'trigrams', 'Taoist divination', 'ancient oracle'],
  },
  'kundalini-shakti-serpent-power-western-science': {
    description: 'Seven chakras, seven seals, seven levels of consciousness — the kundalini tradition maps human awakening.',
    keywords: ['kundalini', 'shakti', 'chakras', 'serpent power', 'tantra', 'subtle body'],
  },
  'sufism-the-path-of-divine-love': {
    description: "From Rumi's whirling dervishes to Ibn Arabi's Unity of Being — Sufism as the mystical heart of Islam.",
    keywords: ['Sufism', 'Rumi', 'Ibn Arabi', 'whirling dervishes', 'divine love', 'Unity of Being'],
  },
  'tarot-symbolic-machine-for-fate': {
    description: 'From 15th-century playing cards to a 78-card alphabet of archetypal initiation — how the Tarot maps the human journey.',
    keywords: ['Tarot', 'archetypes', 'Major Arcana', 'Minor Arcana', 'Jungian psychology', 'symbolic system'],
  },
  'the-kybalion-7-principles-hermetic-philosophy': {
    description: 'Mentalism, Correspondence, Vibration, Polarity, Rhythm, Causation, Gender — the seven Hermetic axioms.',
    keywords: ['Kybalion', 'Hermetic Philosophy', 'seven principles', 'mentalism', 'correspondence', 'vibration', 'polarity'],
  },
  'sexual-alchemy-taoist-tradition-nei-dan': {
    description: 'Jing, Qi, Shen — the three treasures of Taoist inner alchemy. Sexual energy as the fuel of spiritual transformation.',
    keywords: ['Taoist sexual alchemy', 'Nei Dan', 'Jing Qi Shen', 'three treasures', 'sexual energy', 'Internal Elixir'],
  },
  'taoism-quantum-physics-real-parallels': {
    description: 'Separating meaningful metaphysical resonance from pop-spirituality — where Tao and quantum mechanics genuinely converge.',
    keywords: ['Taoism', 'quantum physics', 'Fritjof Capra', 'Tao of physics', 'metaphysics', 'pop-spirituality'],
  },
  'what-tao-te-ching-says-about-uncertainty': {
    description: 'The ancient Taoist concept of non-action applied to modern decision fatigue. A radical strategy for navigating uncertainty.',
    keywords: ['Wu Wei', 'Tao Te Ching', 'non-action', 'decision fatigue', 'Taoist philosophy', 'Laozi'],
  },
  'seven-hermetic-principles-silicon-valley': {
    description: 'The Seven Hermetic Principles as a framework for systems thinking, recursion, and emergence.',
    keywords: ['Hermeticism', 'As Above So Below', 'systems thinking', 'recursion', 'Silicon Valley', 'emergence'],
  },
  'chaos-magick-not-what-you-think': {
    description: 'Sigils, paradigm shifting, and belief as a technology — Chaos Magick as the postmodern operating system.',
    keywords: ['Chaos Magick', 'Austin Osman Spare', 'sigil magick', 'paradigm shifting', 'belief technology'],
  },
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  try {
    const slug = params.slug;
    const baseDir = path.join(process.cwd(), 'content', 'blog');

    // Load main content (English default)
    const filePath = path.join(baseDir, `${slug}.mdx`);
    const fileSource = await fs.readFile(filePath, 'utf8');
    const { data: frontmatter, content: body } = matter(fileSource);

    // Load translations if they exist
    const translations: { tr?: string; ru?: string } = {};
    const fmI18n: { tr?: { title?: string; excerpt?: string }; ru?: { title?: string; excerpt?: string } } = {};

    try {
      const trPath = path.join(baseDir, `${slug}.tr.mdx`);
      const trSource = await fs.readFile(trPath, 'utf8');
      const { data: trFm, content: trBody } = matter(trSource);
      translations.tr = trBody;
      fmI18n.tr = { title: trFm.title as string, excerpt: trFm.excerpt as string };
    } catch (e) {}

    try {
      const ruPath = path.join(baseDir, `${slug}.ru.mdx`);
      const ruSource = await fs.readFile(ruPath, 'utf8');
      const { data: ruFm, content: ruBody } = matter(ruSource);
      translations.ru = ruBody;
      fmI18n.ru = { title: ruFm.title as string, excerpt: ruFm.excerpt as string };
    } catch (e) {}

    // Determine language server-side from cookies — prevents hydration mismatch
    const cookieStore = await cookies();
    const lang = cookieStore.get('NEXT_LOCALE')?.value || cookieStore.get('lang')?.value || 'en';

    // Resolve the correct i18n title (server-side, no client patching needed)
    const defaultTitle = (frontmatter.title as string) || 'Untitled Scroll';
    const resolvedTitle =
      lang === 'tr' && fmI18n.tr?.title
        ? fmI18n.tr.title
        : lang === 'ru' && fmI18n.ru?.title
        ? fmI18n.ru.title
        : defaultTitle;

    const tradition = (frontmatter.tradition as string) || 'Ancient';
    const heroImage = frontmatter.hero as string | undefined;
    const inlineImages = (frontmatter.images as Array<{src?: string; caption?: string; position?: string}>) || [];

    // Look up post and meta for JSON-LD
    const post = posts.find((p) => p.slug === slug);
    const meta = essayMeta[slug];
    const jsonLd = post && meta ? {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: meta.description,
      datePublished: post.publishedAt,
      dateModified: post.publishedAt,
      author: {
        '@type': 'Organization',
        name: 'Hakan Hisim + PRIME',
        url: 'https://www.vaultofarcana.com/about',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Vault of Arcana',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.vaultofarcana.com/logo.svg',
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://www.vaultofarcana.com/blog/${slug}`,
      },
      articleSection: post.tradition,
      keywords: meta.keywords.join(', '),
    } : null;

    return (
      <article className="min-h-screen bg-[#0A0A0F]">
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
        <header className="relative py-32 px-6 border-b border-white/5 bg-gradient-to-b from-[#12121A] to-[#0A0A0F]">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1 rounded-full bg-[#7B5EA7]/20 text-[#C9A84C] text-[10px] uppercase font-bold tracking-[0.3em] mb-8 border border-[#7B5EA7]/30">
              {tradition} tradition
            </span>
            {/* Title rendered server-side with correct i18n language */}
            <h1 className="font-cinzel text-5xl md:text-7xl text-[#E8E0F0] mb-10 leading-tight" id="blog-post-title">
              {resolvedTitle}
            </h1>
            <div className="flex items-center justify-center gap-6 text-[#9B93AB] text-xs uppercase tracking-[0.2em] opacity-60">
              <span>{(frontmatter.author as string) || 'The Oracle'}</span>
              <span className="w-1 h-1 bg-[#C9A84C] rounded-full" />
              <span>{(frontmatter.publishedAt as string) || 'Unknown Date'}</span>
              <span className="w-1 h-1 bg-[#C9A84C] rounded-full" />
              <span>{(frontmatter.readTime as string) || '8 min'} read</span>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        {heroImage && (
          <div className="w-full h-[520px] overflow-hidden border-b border-white/8 relative bg-[#0A0A0F]">
            <img
              src={heroImage}
              alt={resolvedTitle}
              className="w-full h-full object-contain"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent opacity-30 pointer-events-none" />
          </div>
        )}

        {/* i18n data injected for client component */}
        <BlogContent
          body={body}
          tradition={tradition}
          slug={slug}
          translations={translations}
          fmI18n={fmI18n}
          defaultTitle={resolvedTitle}
          images={inlineImages}
        />

        {/* Email signup — compact variant */}
        <div className="max-w-4xl mx-auto px-6 pb-16">
          <div className="border-t border-white/8 pt-12 mt-12">
            <EmailCaptureWrapper variant="compact" />
          </div>
        </div>
      </article>
    );
  } catch (error) {
    console.error('Error loading blog post:', error);
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <h1 className="font-cinzel text-4xl text-[#E8E0F0] mb-6">Scroll Not Found</h1>
          <p className="text-[#9B93AB] text-lg mb-10 italic">
            This specific archive of knowledge is currently being transcribed or has been moved to a deeper vault.
          </p>
          <BlogReturnButton />
        </div>
      </div>
    );
  }
}
