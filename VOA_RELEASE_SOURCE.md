# VOA production source baseline (updated 2026-09-29)

## What is live right now

The accepted live baseline is GitHub `main` at `49d1bf118eff09ee6fa5e847dedda355ae013cfb`,
served by Vercel deployment `dpl_B3eTD8xeScAcxTrJAHNyqfRBy81L` on
`vaultofarcana.com` and `www.vaultofarcana.com`.

Verified against the live site on 2026-09-29: all 60 blog pages return 200, are
indexable, and carry no `noindex`. The Metatron essay still rendered the
60-character truncated title "Metatron's Cube and the Tree of Life: When Kabbalah
and", confirming this baseline is the pre-SEO-fix build.

## What this revision adds

One commit on top of that baseline: `3a5d0822` — `fix(seo): repair blog titles
and legacy alias metadata`. It touches four files only:

- `lib/seo.ts` — `seoTitle()` no longer hard-truncates at 60 characters. It cuts
  on a clause boundary at a 72-character budget and never lands on a connective.
  Measured 17 dangling titles -> 0.
- `lib/essay-seo.ts` (new) — 44 curated titles for essays whose distinctive term
  sat past the budget.
- `app/blog/[slug]/page.tsx` — resolves `SLUG_ALIASES` before building metadata,
  so aliased URLs no longer emit an "Article Not Found" title or `noindex`, and
  the canonical points at the real post. Also registers two previously orphaned
  essays in the page's `essayMeta` map.
- `lib/posts.ts` — registers two orphaned essays that were written but
  unreachable: `john-dee-enochian-angelic-diaries` and
  `necronomicon-myth-fiction-arabic-grimoire`.

Verified on the exact candidate tree: `npx tsc --noEmit` exit 0, `npm run build`
exit 0, 64 blog pages built with 0 "Article Not Found", 0 dangling endings, and
0 titles over 72 characters.

This revision also activates the Vercel production env fix that routes VOA email
captures to the dedicated Brevo list "Vault of Arcana" (id 10) instead of the
shared UT list. Those env vars were set earlier and only take effect once a build
ships, so the Brevo correction is not live until this deploy completes.

## Before any future production promotion

1. Start from this shared committed revision, not an older checkout, a dirty
   working tree, or an arbitrary source snapshot.
2. Run `npx tsc --noEmit` and `npm run build` on the exact candidate tree.
3. Build a preview without changing production aliases. Compare the required
   routes and media against live production, then promote only if the intended
   new content works and existing `/updates`, both Codex routes, the Red Book
   article and images, metadata, sitemap, and shop paths remain intact.
4. Read back both custom domains and Vercel's alias mapping afterwards. Stop and
   roll back to `dpl_B3eTD8xeScAcxTrJAHNyqfRBy81L` on any regression. Do not call
   a CLI `Aliased` message a successful release.

## Note on the build gate

This project sets a Vercel Ignore Build Step that only permits a build when
`VOA_RELEASE_SOURCE.md`, `app/updates/page.tsx`,
`app/correspondence-engine/classic/page.tsx`, and
`components/correspondence/CorrespondenceCodexV2.tsx` all exist. A missing marker
file silently cancels the build rather than failing it, so a canceled deployment
with `Ignored Build Step command returned exit code 0` means the gate did not
pass — the code was never compiled or promoted. Check this before assuming a
pushed commit went live.
