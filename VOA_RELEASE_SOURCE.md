# VOA Release Source

The complete, reconciled source of truth for the live Vault of Arcana deployment.

## What this documents

`main` is the production branch. A deploy is only valid if the tree being built is a
superset of every commit below — anything less silently removes content that is
currently live.

### Reconciled history

The site previously ran from a stale `main` and lost three posts that had been live.
That gap is now closed. `main` contains both sides of the divergence:

| Line | Commits | Notes |
| --- | --- | --- |
| Baseline | `49d1bf1` (2026-09-25) | the common ancestor both lines forked from |
| Release/SEO line | `3a5d0822` → `8a9c67b4` → `71569540` → `34bf5014` → `d943790a` → `f886e6cd` | title & alias repair, release marker, free Tao pack offer, `/redeem/tao` metadata, updates commit reference, popup |
| Reconciled line | `bd4f557d` → `34e76304` → `79eb8131` | release guard, Article schema for every registered essay, Thelema + Red Book posts |
| Merge | `237134ec` | union of both lines; no content dropped from either side |

### Content that must always be present

- `content/blog/` — 104 `.mdx` files
- 67 blog pages built, including:
  - `/blog/red-book-active-imagination-ethics-image` → `The Red Book Is Not an Oracle`
  - `/blog/do-what-thou-wilt-thelema-liber-al`
  - `/blog/john-dee-enochian-angelic-diaries`
  - `/blog/necronomicon-myth-fiction-arabic-grimoire`
- `public/images/blog/red-book-active-imagination/` — `hero-wide.png`, `thumbnail.png`,
  `pinterest-square.png`

### Required by the release guard

```
VOA_RELEASE_SOURCE.md
app/updates/page.tsx
app/correspondence-engine/classic/page.tsx
components/correspondence/CorrespondenceCodexV2.tsx
```

### Live environment

- Brevo: list `10` ("Vault of Arcana") — `BREVO_LIST_ID=10` and
  `BREVO_ARCANA_INITIATION_LIST_ID=10`. Without the second variable, signups silently
  fall back to the shared "The Transmission" list.
- Free pack offer: `/redeem/tao`, promo `tao-pack`, plan `seeker`, 30 days, manual
  delivery. No Telegram entitlement integration — that bot is discontinued.

## Pre-deploy checklist

1. `git fetch --all --prune`
2. Confirm no branch holds content absent from `main`:
   `git log --oneline main..<branch>` for every local and remote branch
3. `npx tsc --noEmit` and `npm run build` must both exit 0
4. After the deploy is READY, verify on **both** `vaultofarcana.com` and
   `www.vaultofarcana.com`: the Red Book route + both images, `/updates`,
   `/redeem/tao`, and a sample of the other blog pages

Note: the local checkout on the Pi has previously carried a `main` that was weeks
behind `origin/main`. Always compare against a freshly fetched `origin/main`.
