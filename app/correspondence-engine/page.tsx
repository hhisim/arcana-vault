import { promises as fs } from 'fs'
import path from 'path'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import CorrespondenceCodexV2 from '@/components/correspondence/CorrespondenceCodexV2'

export const dynamic = 'force-static'

/**
 * Why this file exists (2026-09-30).
 *
 * /correspondence-engine was a client-only shell: the 27-system matrix, its
 * 22,171 mappings and the 824 source rows existed solely in
 * public/data/correspondence-v2/index.json, fetched by JavaScript after paint.
 * A crawler received the header, the nav and a "loading" state — none of the
 * substance the page is supposed to attract links with. Verified before this
 * change: none of DEITIES / PLANTS / I_CHING / MINOR_ARCANA appeared in the
 * served HTML.
 *
 * So the indexable substance is now read at BUILD time and rendered into
 * server HTML below the interactive codex. The React component is untouched and
 * still handles all browsing; this block is what a crawler, a reader without JS,
 * and an LLM answer-engine can actually see.
 *
 * Every figure below is read from the shipped index.json — nothing is
 * hand-typed, so the prose cannot drift from the data. The source's own
 * disclaimer is reproduced verbatim, because the data is a set of traditional
 * assertions and must not read as verified historical or causal claim.
 */

type CodexFacet = { value: string; label: string; count: number }
type CodexIndex = {
  source: { file: string; sha256: string; importedRows: number; method: string; note: string }
  stats: {
    entryCount: number
    uniqueEntryLabelCount: number
    ambiguousEntryLabelCount: number
    sourceSystemCount: number
    fieldCount: number
    mappingCount: number
    traditionAnnotationCount: number
  }
  facets: { sourceSystems: CodexFacet[]; fields: CodexFacet[]; traditions: CodexFacet[] }
  entries: Array<{
    label: string
    sourceSystemLabel: string
    traditions: string[]
    parallelCount: number
    relatedCount: number
  }>
}

async function loadIndex(): Promise<CodexIndex | null> {
  try {
    const file = path.join(process.cwd(), 'public', 'data', 'correspondence-v2', 'index.json')
    const raw = await fs.readFile(file, 'utf8')
    return JSON.parse(raw) as CodexIndex
  } catch (err) {
    // Never fail the deploy over the SEO block — the interactive codex still works.
    console.error('[correspondence-engine] index read failed', err)
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const index = await loadIndex()
  const systems = index?.stats.sourceSystemCount
  const mappings = index?.stats.mappingCount
  const description =
    systems && mappings
      ? `A navigable matrix of ${systems} symbolic systems — deities, plants, the I Ching, arcana, crystals, letters, geometry and more — tracing ${mappings.toLocaleString('en-US')} recorded correspondences between them.`
      : 'Navigate the correspondence matrix across symbolic systems, tracing recorded correspondences between them.'

  return buildMetadata('Correspondence Codex · 27 Systems', description, '/correspondence-engine', {
    type: 'website',
  })
}

/** The most cross-referenced entries — the genuinely interesting rows. */
function topConnected(index: CodexIndex) {
  return [...index.entries]
    .sort((a, b) => b.relatedCount - a.relatedCount || b.parallelCount - a.parallelCount)
    .slice(0, 12)
}

function Schema({ index }: { index: CodexIndex }) {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Dataset',
        '@id': 'https://www.vaultofarcana.com/correspondence-engine#dataset',
        name: 'Correspondence Codex — cross-system correspondence matrix',
        description: `Assertions linking ${index.stats.entryCount} source entries across ${index.stats.sourceSystemCount} symbolic systems, with ${index.stats.mappingCount} recorded mappings.`,
        url: 'https://www.vaultofarcana.com/correspondence-engine',
        creator: { '@type': 'Organization', name: 'Vault of Arcana' },
        isAccessibleForFree: true,
        variableMeasured: index.facets.sourceSystems.map((s) => ({
          '@type': 'PropertyValue',
          name: s.label,
          value: s.count,
        })),
        distribution: {
          '@type': 'DataDownload',
          encodingFormat: 'application/json',
          contentUrl: 'https://www.vaultofarcana.com/data/correspondence-v2/index.json',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://www.vaultofarcana.com/correspondence-engine#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is the Correspondence Codex?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `It is a navigable index of ${index.stats.entryCount} source entries drawn from ${index.stats.sourceSystemCount} symbolic systems, connected by ${index.stats.mappingCount.toLocaleString('en-US')} recorded correspondences — from deities and plants to the I Ching, arcana, crystals, letters and geometry.`,
            },
          },
          {
            '@type': 'Question',
            name: 'Are these mappings historically verified?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: index.source.note,
            },
          },
          {
            '@type': 'Question',
            name: 'Which systems are included?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${index.facets.sourceSystems.length} systems: ${index.facets.sourceSystems.map((s) => s.label).join(', ')}.`,
            },
          },
          {
            '@type': 'Question',
            name: 'How many traditions are annotated?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${index.facets.traditions.length} tradition annotations — ${index.facets.traditions.map((t) => `${t.label} (${t.count})`).join(', ')}.`,
            },
          },
        ],
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export default async function Page() {
  const index = await loadIndex()

  return (
    <>
      <CorrespondenceCodexV2 />

      {index && (
        <section className="mx-auto max-w-6xl px-4 pb-20 pt-2" id="about-the-codex">
          <h2 className="font-serif text-2xl text-[var(--text-primary)] md:text-3xl">
            About the Correspondence Codex
          </h2>
          <p className="mt-4 max-w-3xl leading-7 text-[var(--text-secondary)]">
            The Codex sets {index.stats.sourceSystemCount} symbolic systems beside one
            another and records where a traditional source asserts a link. A single
            row in the I Ching may be annotated with a deity, a plant, a colour, a
            crystal and a frequency; the Codex holds {index.stats.mappingCount.toLocaleString('en-US')}{' '}
            such links across {index.stats.entryCount} source entries, so you can read
            one tradition's row and see immediately which others speak to it.
          </p>
          <p className="mt-4 max-w-3xl leading-7 text-[var(--text-secondary)]">
            Entries are drawn from a single source file ({index.source.file}), parsed
            without altering the source cells, and annotated with{' '}
            {index.facets.traditions.length} traditions. Of the{' '}
            {index.stats.entryCount} rows, {index.stats.uniqueEntryLabelCount} carry a
            distinct label and {index.stats.ambiguousEntryLabelCount} are ambiguous —
            marked as such rather than silently merged.
          </p>

          <p className="mt-5 rounded-lg border border-amber-300/20 bg-amber-300/[0.05] p-4 text-sm leading-6 text-[var(--text-secondary)]">
            {index.source.note}
          </p>

          <h3 className="mt-10 font-serif text-xl text-[var(--text-primary)]">
            The {index.stats.sourceSystemCount} systems
          </h3>
          <p className="mt-2 max-w-3xl text-[var(--text-secondary)]">
            Each system below is a browsable facet of the matrix. Row counts are the
            source entries each contributes.
          </p>
          <ul className="mt-5 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
            {index.facets.sourceSystems.map((s) => (
              <li key={s.value} className="flex items-baseline justify-between gap-4 border-b border-white/5 py-1.5">
                <span className="text-[var(--text-primary)]">{s.label}</span>
                <span className="text-sm tabular-nums text-[var(--text-secondary)]">{s.count}</span>
              </li>
            ))}
          </ul>

          <h3 className="mt-10 font-serif text-xl text-[var(--text-primary)]">
            Most cross-referenced entries
          </h3>
          <p className="mt-2 max-w-3xl text-[var(--text-secondary)]">
            These rows carry the widest set of recorded links, making them the most
            useful places to enter the matrix.
          </p>
          <ul className="mt-5 grid gap-x-8 gap-y-2 sm:grid-cols-2">
            {topConnected(index).map((e, i) => (
              <li key={`${e.label}-${e.sourceSystemLabel}-${i}`} className="border-b border-white/5 py-1.5">
                <span className="text-[var(--text-primary)]">{e.label}</span>{' '}
                <span className="text-sm text-[var(--text-secondary)]">
                  — {e.sourceSystemLabel}
                  {e.traditions.length > 0 && ` (${e.traditions.join(', ')})`}
                </span>
              </li>
            ))}
          </ul>

          <h3 className="mt-10 font-serif text-xl text-[var(--text-primary)]">
            Frequently asked
          </h3>
          <dl className="mt-5 space-y-6">
            <div>
              <dt className="text-[var(--text-primary)]">What is the Correspondence Codex?</dt>
              <dd className="mt-1 leading-7 text-[var(--text-secondary)]">
                A navigable index of {index.stats.entryCount} source entries drawn from{' '}
                {index.stats.sourceSystemCount} symbolic systems, connected by{' '}
                {index.stats.mappingCount.toLocaleString('en-US')} recorded correspondences —
                from deities and plants to the I Ching, arcana, crystals, letters and
                geometry.
              </dd>
            </div>
            <div>
              <dt className="text-[var(--text-primary)]">Are these mappings historically verified?</dt>
              <dd className="mt-1 leading-7 text-[var(--text-secondary)]">{index.source.note}</dd>
            </div>
            <div>
              <dt className="text-[var(--text-primary)]">Which systems are included?</dt>
              <dd className="mt-1 leading-7 text-[var(--text-secondary)]">
                {index.facets.sourceSystems.length} systems:{' '}
                {index.facets.sourceSystems.map((s) => s.label).join(', ')}.
              </dd>
            </div>
            <div>
              <dt className="text-[var(--text-primary)]">How many traditions are annotated?</dt>
              <dd className="mt-1 leading-7 text-[var(--text-secondary)]">
                {index.facets.traditions.length} tradition annotations —{' '}
                {index.facets.traditions.map((t) => `${t.label} (${t.count})`).join(', ')}.
              </dd>
            </div>
          </dl>

          <p className="mt-10 text-sm text-[var(--text-secondary)]">
            The full index is also available as open data:{' '}
            <a
              href="/data/correspondence-v2/index.json"
              className="text-[var(--primary-gold)] underline underline-offset-2"
            >
              correspondence-v2/index.json
            </a>
          </p>

          <Schema index={index} />
        </section>
      )}
    </>
  )
}
