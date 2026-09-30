// === Vault of Arcana — /videos ============================================
// The YouTube loop's missing half. Until now the 5 channel videos were only
// reachable from inside an essay; anyone arriving from YouTube search, the
// channel page, or an embed had nowhere on-site to land.
//
// This is the hub: every video, each linking to the essay it belongs to (deep
// link into the Scroll) plus a route onward into the Oracle / free grimoire.
// That closes YouTube -> VOA instead of YouTube -> dead end.
//
// Source of truth stays lib/blog-video-embed.ts so the hub can never drift
// from what the essays actually embed. Verified 2026-09-30: all 5 video IDs
// return 200 on youtube-nocookie, and all 5 slugs are live essays.

import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { posts } from '@/lib/posts';
import { getBlogVideoEmbed, buildYouTubeEmbedUrl } from '@/lib/blog-video-embed';

export const dynamic = 'force-static';

const CHANNEL_URL = 'https://www.youtube.com/@thevaultofarcana';
const CHANNEL_ID = 'UCxb3eR_l0_S2lYGUIaQ_9mg';

type VideoEntry = {
  slug: string;
  videoId: string;
  title: string;
  embedUrl: string;
  essayTitle: string;
  tradition?: string;
};

function collectVideos(): VideoEntry[] {
  const out: VideoEntry[] = [];
  for (const post of posts as Array<{ slug: string; title: string; tradition?: string }>) {
    const v = getBlogVideoEmbed(post.slug);
    if (!v) continue;
    const embedUrl = buildYouTubeEmbedUrl(v.videoId);
    if (!embedUrl) continue; // id failed validation — never render a broken iframe
    out.push({
      slug: post.slug,
      videoId: v.videoId,
      title: v.title,
      embedUrl,
      essayTitle: post.title,
      tradition: post.tradition,
    });
  }
  return out;
}

export function generateMetadata(): Metadata {
  return buildMetadata(
    'Videos',
    'Short companion films for the essays in the Scroll — the Emerald Tablet, the Ten Sefirot, Enochian, lucid dreaming and the Tarot, from Vault of Arcana.',
    '/videos',
    { image: undefined },
  );
}

export default function VideosPage() {
  const videos = collectVideos();

  return (
    <main className="mx-auto max-w-6xl px-4 py-14">
      <header className="max-w-3xl mb-10">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--primary-gold)] mb-3">
          The Vault on film
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-[var(--text-primary)] mb-4">
          Companion videos
        </h1>
        <p className="text-[var(--text-secondary)] leading-7">
          Every film here sits beside an essay in the Scroll. Watch the short
          version, then read the long one — the video is an entrance, not the
          whole building.
        </p>
        <a
          href={CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block rounded-full border border-[var(--primary-gold)]/40 px-5 py-2 text-sm text-[var(--primary-gold)] transition-colors hover:bg-[var(--primary-gold)]/10"
        >
          Subscribe on YouTube ↗
        </a>
      </header>

      {videos.length === 0 ? (
        <p className="text-[var(--text-secondary)]">
          No companion videos are published yet.
        </p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {videos.map((v) => (
            <article
              key={v.videoId}
              className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden"
            >
              <div className="relative aspect-video w-full bg-black/30">
                <iframe
                  src={v.embedUrl}
                  title={v.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="absolute inset-0 h-full w-full"
                />
              </div>
              <div className="p-5">
                {v.tradition && (
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--primary-gold)]">
                    {v.tradition}
                  </div>
                )}
                <h2 className="mt-1 font-serif text-lg leading-snug text-[var(--text-primary)]">
                  {v.title}
                </h2>
                <p className="mt-2 text-sm text-[var(--text-secondary)] leading-6">
                  Go deeper with the full essay:{' '}
                  <Link
                    href={`/blog/${v.slug}`}
                    className="text-[var(--primary-gold)] underline underline-offset-2"
                  >
                    {v.essayTitle}
                  </Link>
                </p>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Close the loop: the whole point is a route back into the product. */}
      <section className="mt-16 grid gap-4 sm:grid-cols-3">
        <Link
          href="/free-grimoire"
          className="rounded-xl border border-amber-300/25 bg-amber-300/[0.04] p-5 transition-colors hover:border-amber-300/50"
        >
          <div className="font-serif text-[var(--primary-gold)] mb-1">Free grimoire</div>
          <p className="text-sm text-[var(--text-secondary)] leading-6">
            Seven tradition study guides, free.
          </p>
        </Link>
        <Link
          href="/oracle"
          className="rounded-xl border border-amber-300/25 bg-amber-300/[0.04] p-5 transition-colors hover:border-amber-300/50"
        >
          <div className="font-serif text-[var(--primary-gold)] mb-1">Ask the Oracle</div>
          <p className="text-sm text-[var(--text-secondary)] leading-6">
            Put the tradition to work on your own question.
          </p>
        </Link>
        <Link
          href="/initiation"
          className="rounded-xl border border-amber-300/25 bg-amber-300/[0.04] p-5 transition-colors hover:border-amber-300/50"
        >
          <div className="font-serif text-[var(--primary-gold)] mb-1">7-day initiation</div>
          <p className="text-sm text-[var(--text-secondary)] leading-6">
            Begin a structured path through the archives.
          </p>
        </Link>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Vault of Arcana — companion videos',
            itemListElement: videos.map((v, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: `https://www.vaultofarcana.com/videos#${v.videoId}`,
              name: v.title,
            })),
          }),
        }}
      />
    </main>
  );
}
