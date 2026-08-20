import { promises as fs } from 'fs';
import path from 'path';
import React from 'react';
import matter from 'gray-matter';
import { cookies } from 'next/headers';
import { posts } from '@/lib/posts';
import BlogContent from '@/components/BlogContent'
import BlogReturnButton from '@/components/BlogReturnButton'
import EmailCaptureWrapper from '@/components/EmailCaptureWrapper'
import BlogShopRecs from '@/components/BlogShopRecs'
import ArchiveSaleCta from '@/components/ArchiveSaleCta'

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
      images: [{ url: `/images/blog/${params.slug}/cover.png`, width: 1200, height: 630 }],
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
  'metatrons-cube-tree-of-life-kabbalah-geometry': {
    description: "Metatron's Cube and the Kabbalah Tree of Life described as one blueprint: how sacred geometry maps the descent of unity into form — every shape, node and path explained.",
    keywords: ["Metatron's Cube", "Tree of Life", "Kabbalah", "sacred geometry", "Platonic solids", "Sephiroth"],
  },
  'entheogenic-dream-dmt-rem-visionary-states': {
    description: "Dreams and the entheogenic state as two doors into one visionary architecture. DMT, REM, and the shared neuroscience of non-ordinary consciousness — an integration-first map.",
    keywords: ["DMT", "REM sleep", "dreaming", "entheogens", "altered states of consciousness", "psychedelic dreams"],
  },
  'as-above-so-below-secret-thread-western-mysteries': {
    description: "As above, so below: the one secret thread uniting Hermeticism, Kabbalah, Tarot, alchemy and Enochian — and how the human being mirrors the greater cosmos.",
    keywords: ["as above so below", "Hermeticism", "Western esotericism", "Kabbalah", "correspondence principle", "mystery school"],
  },
  'how-to-read-the-tarot-beginners-guide': {
    description: "How to read the tarot for beginners: the 78-card architecture, the Major Arcana, the Fool's Journey, card spreads, and reading a three-card layout as a map of the soul.",
    keywords: ["how to read tarot", "tarot for beginners", "Major Arcana", "Minor Arcana", "tarot card meanings", "three-card spread"],
  },
  'sacred-geometry-flower-of-life-explained': {
    description: "Sacred geometry explained: from one circle to the Flower of Life, Metatron's Cube, the Platonic solids and the golden ratio — the blueprint of creation decoded.",
    keywords: ["sacred geometry", "Flower of Life", "Metatron's Cube", "Platonic solids", "golden ratio", "Seed of Life"],
  },
  'kabbalah-tree-of-life-sefirot-explained': {
    description: "The Kabbalah Tree of Life mapped: each of the ten Sefirot, the three pillars, the 22 paths and the Four Worlds — one diagram claiming to map all of creation and mind.",
    keywords: ["Kabbalah Tree of Life", "Sefirot", "Sephiroth explained", "22 paths", "Four Worlds", "Ein Sof"],
  },
  'emerald-tablet-proto-quantum-physics': {
    description: "The Emerald Tablet as proto-quantum physics: mapping the Tabula Smaragdina's thirteen hermetic axioms onto quantum field theory and the modern worldview.",
    keywords: ["Emerald Tablet", "Tabula Smaragdina", "hermeticism", "alchemy", "quantum physics", "Hermes Trismegistus"],
  },
  'akashic-record-holographic-universe-bohm-vedic': {
    description: "The Akashic record as a holographic universe: how David Bohm's implicate order and Vedic Akasha both describe existence as a projection from an enfolded, information-complete reality.",
    keywords: ["Akashic record", "holographic universe", "David Bohm", "implicate order", "Vedanta", "Etheric record"],
  },
  'amplituhedron-flower-of-life-sacred-geometry': {
    description: "The amplituhedron and the Flower of Life: how physicist Nima Arkani-Hamed redrew reality in pure geometry — and why the oldest sacred diagrams said it first.",
    keywords: ["amplituhedron", "Flower of Life", "sacred geometry", "Nima Arkani-Hamed", "physics of geometry", "reality without spacetime"],
  },
  'cymatics-word-of-god-hans-jenny-logos': {
    description: "Cymatics and the Word of God: Hans Jenny's discovery that sound organizes matter into geometry — and what it reveals about the mystical Logos that shapes creation.",
    keywords: ["cymatics", "Hans Jenny", "sound and geometry", "Logos", "word of God", "cymatic patterns"],
  },
  'enochian-first-contact-protocol-john-dee-seti': {
    description: "Enochian as first-contact protocol: how John Dee and Edward Kelley received a complete angelic language in 1582 — and what SETI's search for non-human communication can learn.",
    keywords: ["Enochian", "John Dee", "Edward Kelley", "angelic language", "SETI", "Enochian Keys"],
  },
  'hyperbolic-geometry-dmt-space-non-euclidean': {
    description: "The hyperbolic geometry of DMT space: Qualia Research Institute's mathematical analysis showing the visionary realm is non-Euclidean, negatively curved — hyperspace with a proof.",
    keywords: ["DMT", "hyperbolic geometry", "non-Euclidean space", "hyperspace", "Qualia Research Institute", "DMT breakthrough"],
  },
  'it-from-bit-kybalion-wheeler-information-universe': {
    description: "It from bit: how John Wheeler's information-theoretic universe and the Kybalion's 'All is Mind' converge on one claim — reality emerges from information, not matter.",
    keywords: ["it from bit", "Kybalion", "John Wheeler", "participatory universe", "All is Mind", "information theory"],
  },
  'qliphoth-error-states-kabbalah-system-failure': {
    description: "The Qliphoth as error states: Kabbalah's shadow-tree taxonomy of broken minds — how the shattered vessels of the shevirah, and the Sitra Achra, explain systemic failure.",
    keywords: ["Qliphoth", "Sitra Achra", "Kabbalah", "shadow tree", "Shevirah", "Tree of Knowledge"],
  },
  'solve-et-coagula-quantum-decoherence-alchemy': {
    description: "Solve et Coagula as quantum decoherence: reading the alchemical Magnum Opus — nigredo, albedo, rubedo — as a physics textbook for the transformation of matter and mind.",
    keywords: ["solve et coagula", "alchemy", "quantum decoherence", "Magnum Opus", "nigredo albedo rubedo", "Great Work"],
  },
  'sophia-fall-gnostic-ai-machine-learning': {
    description: "Sophia's fall and the rise of AI: reading Gnostic cosmogony — Sophia overreaching, creating the Demiurge, trapping light — as a parable for machine learning and model alignment.",
    keywords: ["Sophia", "Gnosticism", "Demiurge", "gnostic cosmology", "artificial intelligence", "machine learning"],
  },
  'beelzebub-tales-gurdjieff-cosmology-decoded': {
    description: "Beelzebub's Tales decoded: Gurdjieff's 1,238-page disguised cosmology — the Fourth Way, the laws of three and seven, and a complete architecture of the human condition.",
    keywords: ["Gurdjieff", "Beelzebub's Tales to His Grandson", "Fourth Way", "law of three", "law of seven", "Gurdjieff cosmology"],
  },
  'temple-in-man-egypt-human-body-stone': {
    description: "The Temple in Man: how Schwaller de Lubicz measured the Temple of Luxor and found a diagram of the human nervous system rendered in stone at 1:100 scale.",
    keywords: ["Temple of Luxor", "Schwaller de Lubicz", "sacred architecture", "Egyptian temple", "human body temple", "Egyptian mysteries"],
  },
  'timewave-zero-eschaton-mckenna-compression': {
    description: "Timewave Zero and the Eschaton: Terence McKenna's novelty theory read as a compression algorithm — history accelerating toward a lossless singularity of infinite novelty.",
    keywords: ["Timewave Zero", "Terence McKenna", "novelty theory", "eschaton", "2012", "information compression"],
  },
  'dmt-bardo-tibetan-death-maps': {
    description: "The DMT bardo: how the Tibetan Book of the Dead's death maps — clear light, bardo visions, entity encounters — chart the same territory as a DMT breakthrough, a thousand years earlier.",
    keywords: ["DMT", "Bardo Thodol", "Tibetan Book of the Dead", "psychedelics", "death and dying", "bardo visions"],
  },
  'egregore-warfare-chaos-magic-viral-thoughtforms': {
    description: "Egregore warfare: how chaos magicians manufactured gods with sigils and belief — and why it wrote the operating manual for memes, viral thoughtforms and the attention economy.",
    keywords: ["egregore", "chaos magic", "thoughtforms", "Peter Carroll", "sigils", "memetics"],
  },
  'sefirot-neural-architecture-kabbalah': {
    description: "The Sefirot as neural architecture: how Kabbalah mapped God before we mapped intelligence — Ein Sof as latent space, ten sefirot as attention layers, Daath as dropout.",
    keywords: ["Sefirot", "Kabbalah", "tree of life", "neural networks", "artificial intelligence", "latent space"],
  },
  'sufism-hermeticism-as-above-so-below': {
    description: "As above, so below, in two dialects: the Sufi mirror of the Divine and the Hermetic principle of correspondence — one alchemy in which the false self dies so the true self is realized.",
    keywords: ["Sufism", "Hermeticism", "as above so below", "Ibn Arabi", "unity of being", "correspondence"],
  },
  'tantra-kabbalah-tree-of-life-and-the-body': {
    description: "Tantra and Kabbalah side by side: kundalini rising the spine and the lightning-flash descending the Tree of Life as the same ascent — Kashmir Shaivism meets the Sefirot.",
    keywords: ["Tantra", "Kabbalah", "Tree of Life", "kundalini", "Kashmir Shaivism", "body of light"],
  },
  'sefer-yetzirah-32-paths-of-wisdom': {
    description: "Sefer Yetzirah and the 32 Paths of Wisdom: how the oldest text of the Kabbalah spells creation out of ten sefirot and twenty-two Hebrew letters — the alphabet as the software of reality, from gematria to the Tree of Life.",
    keywords: ["Sefer Yetzirah", "32 paths of wisdom", "Kabbalah", "Hebrew alphabet", "gematria", "Tree of Life", "letters of creation"],
  },
  'picatrix-technology-of-correspondence-astrological-magic': {
    description: "The Picatrix decoded as a technology of correspondence: how medieval astral magic aligned time, matter, image, speech, and attention.",
    keywords: ["Picatrix", "astrological magic", "Ghāyat al-Hakīm", "astral magic", "magical images", "Hermeticism", "correspondence principle", "medieval magic"],
  },
  'conference-of-the-birds-simurgh-map-of-self-recognition': {
    description: "Attar's Conference of the Birds decoded: the Simurgh, the seven valleys, and why the poem's flock discovers self-recognition only after the identities that keep the seeker separate from the sought have been transformed.",
    keywords: ["Conference of the Birds", "Attar", "Simurgh", "seven valleys", "Sufism", "Persian poetry", "self-recognition", "si morgh"],
  },
  'corpus-hermeticum-poimandres-cosmic-human': {
    description: 'The Corpus Hermeticum, Poimandres, and the Secret Sermon on the Mountain: why Hermetic gnosis begins as a change in attention rather than the possession of secret information.',
    keywords: ['Corpus Hermeticum', 'Poimandres', 'Hermes Trismegistus', 'Hermeticism', 'Nous', 'gnosis', 'rebirth', 'cosmic human'],
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
    const inlineImages = (((frontmatter.images as Array<{src?: string; caption?: string; position?: string}>) || [])
      .filter((image): image is { src: string; caption?: string; position?: string } => Boolean(image?.src)));

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
      image: `https://www.vaultofarcana.com/images/blog/${slug}/cover.png`,
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

        <ArchiveSaleCta
          placement={`blog-${slug}-after-hero`}
          compact
          title="20% Archive Sale"
          body="Deepen this scroll with the primary-source archive packs behind the Vault: grimoires, oracle systems, alchemy, tarot, sacred geometry, and manifestation libraries."
        />

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

        {/* Shop the Archives — relevant packs for this Scroll */}
        <BlogShopRecs slug={slug} tradition={tradition} />

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
