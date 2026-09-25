#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const SOURCE_FILENAME = 'supermatrix-v3.csv'
const SCHEMA_VERSION = 'correspondence-codex-v2'
const DEFAULT_SOURCE = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'data',
  'correspondence',
  SOURCE_FILENAME,
)
const DEFAULT_OUTPUT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'public',
  'data',
  'correspondence-v2',
)

const SYSTEM_KEY = 'SOURCE_SYSTEM'
const ENTRY_KEY = 'ENTRY'

/**
 * Parse RFC-4180 CSV without relying on an ad-hoc split(','). Newlines and
 * commas inside quoted cells are retained, and malformed quote boundaries
 * fail loudly instead of shifting every following column.
 */
export function parseCsvRecords(input) {
  const text = String(input).replace(/^\uFEFF/, '')
  const records = []
  let record = []
  let field = ''
  let quoted = false
  let closedQuote = false

  const pushField = () => {
    record.push(field)
    field = ''
    closedQuote = false
  }

  const pushRecord = () => {
    pushField()
    records.push(record)
    record = []
  }

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]

    if (quoted) {
      if (character === '"') {
        if (text[index + 1] === '"') {
          field += '"'
          index += 1
        } else {
          quoted = false
          closedQuote = true
        }
      } else {
        field += character
      }
      continue
    }

    if (closedQuote) {
      if (character === ',') {
        pushField()
      } else if (character === '\r' || character === '\n') {
        pushRecord()
        if (character === '\r' && text[index + 1] === '\n') index += 1
      } else if (character === ' ' || character === '\t') {
        // Permit RFC-compatible whitespace after a closing quote.
      } else {
        throw new Error(`Invalid CSV: unexpected character after closing quote at offset ${index}`)
      }
      continue
    }

    if (character === '"') {
      if (field.length !== 0) {
        throw new Error(`Invalid CSV: quote started inside an unquoted field at offset ${index}`)
      }
      quoted = true
    } else if (character === ',') {
      pushField()
    } else if (character === '\r' || character === '\n') {
      pushRecord()
      if (character === '\r' && text[index + 1] === '\n') index += 1
    } else {
      field += character
    }
  }

  if (quoted) throw new Error('Invalid CSV: unterminated quoted field')
  if (closedQuote || field.length > 0 || record.length > 0) pushRecord()

  return records
}

function normalizedHeader(value) {
  return String(value ?? '')
    .replace(/^\uFEFF/, '')
    .trim()
    .toUpperCase()
    .replace(/[ -]+/g, '_')
}

function displayText(value) {
  return String(value ?? '')
    .normalize('NFC')
    .replace(/[\t\r\n ]+/g, ' ')
    .trim()
}

export function normalizeSearchText(value) {
  return displayText(value)
    .normalize('NFKC')
    .toLocaleLowerCase('en-US')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
}

function splitTopLevel(value) {
  const parts = []
  let part = ''
  const stack = []
  let quoted = false

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index]
    if (character === '"') {
      quoted = !quoted
      part += character
      continue
    }
    if (!quoted && (character === '(' || character === '[' || character === '{')) {
      stack.push(character)
      part += character
      continue
    }
    if (!quoted && (character === ')' || character === ']' || character === '}')) {
      if (stack.length > 0) stack.pop()
      part += character
      continue
    }
    if (!quoted && character === ';' && stack.length === 0) {
      const trimmed = displayText(part)
      if (trimmed) parts.push(trimmed)
      part = ''
      continue
    }
    part += character
  }

  const trimmed = displayText(part)
  if (trimmed) parts.push(trimmed)
  return parts
}

function valueAnnotations(value) {
  return [...value.matchAll(/\[([^\]]+)\]/g)]
    .map((match) => displayText(match[1]))
    .filter(Boolean)
}

/** Keep the source cell, while adding conservative search/display helpers. */
export function normalizeCell(rawValue) {
  const raw = String(rawValue ?? '')
  const values = splitTopLevel(raw).map((value) => {
    const traditions = valueAnnotations(value)
    const label = displayText(value.replace(/\s*\[[^\]]+\]/g, ' '))
    return {
      raw: value,
      label,
      search: normalizeSearchText(label),
      traditions,
    }
  })

  return { raw, values }
}

function slugify(value) {
  const slug = normalizeSearchText(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || 'unnamed'
}

function labelForKey(key) {
  const special = {
    I_CHING: 'I Ching',
    LETTERS_HEBREW: 'Hebrew Letters',
    LETTERS_LATIN: 'Latin Letters',
    MAJOR_ARCANA: 'Major Arcana',
    MINOR_ARCANA: 'Minor Arcana',
    PLATONIC_SOLIDS: 'Platonic Solids',
  }
  if (special[key]) return special[key]
  return key
    .toLocaleLowerCase('en-US')
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

function mappingSignature(model) {
  return model.mappings.map((mapping) => `${mapping.key}=${mapping.raw}`).join('\u001f')
}

/** Locate the real header row and reject shifted/malformed records. */
export function parseSupermatrixCsv(input, options = {}) {
  const records = parseCsvRecords(input)
  const headerIndex = records.findIndex((record) => {
    const headers = record.map(normalizedHeader)
    return headers.includes(SYSTEM_KEY) && headers.includes(ENTRY_KEY)
  })
  if (headerIndex < 0) {
    throw new Error('Supermatrix CSV has no header containing SOURCE_SYSTEM and ENTRY')
  }

  const headers = records[headerIndex].map(normalizedHeader)
  if (headers.some((header) => !header)) throw new Error('Supermatrix CSV contains an empty header')
  if (new Set(headers).size !== headers.length) throw new Error('Supermatrix CSV contains duplicate headers')

  const rows = []
  for (let recordIndex = headerIndex + 1; recordIndex < records.length; recordIndex += 1) {
    const record = records[recordIndex]
    if (record.every((cell) => displayText(cell) === '')) continue
    if (record.length !== headers.length) {
      throw new Error(
        `Supermatrix row ${recordIndex + 1} has ${record.length} columns; expected ${headers.length}`,
      )
    }
    const values = Object.fromEntries(headers.map((header, column) => [header, record[column]]))
    if (!displayText(values[SYSTEM_KEY]) || !displayText(values[ENTRY_KEY])) {
      throw new Error(`Supermatrix row ${recordIndex + 1} is missing SOURCE_SYSTEM or ENTRY`)
    }
    rows.push({ sourceRow: recordIndex + 1, values })
  }

  if (rows.length === 0) throw new Error('Supermatrix CSV contains no data rows')

  return {
    headers,
    rows,
    headerRow: headerIndex + 1,
    decorativeRows: headerIndex,
    sourceFile: options.sourceFile ?? SOURCE_FILENAME,
  }
}

function makeSourceMeta(parsed, options) {
  return {
    file: options.sourceFile ?? parsed.sourceFile ?? SOURCE_FILENAME,
    sha256: options.sourceSha256 ?? 'not-recorded',
    headerRow: parsed.headerRow,
    decorativeRows: parsed.decorativeRows,
    importedRows: parsed.rows.length,
    method: 'RFC-4180 CSV parse; display normalization only; source cells retained verbatim',
    note: 'Mappings are source assertions, not verified historical, medical, or causal claims.',
  }
}

function buildModel(parsedRow, fieldKeys, sourceMeta) {
  const sourceSystem = displayText(parsedRow.values[SYSTEM_KEY])
  const entryRaw = parsedRow.values[ENTRY_KEY]
  const entryLabel = displayText(entryRaw)
  const entryKey = normalizeSearchText(entryLabel)
  const id = `${slugify(entryLabel)}--${slugify(sourceSystem)}--r${parsedRow.sourceRow}`
  const mappings = fieldKeys
    .map((key) => {
      const normalized = normalizeCell(parsedRow.values[key])
      if (!normalized.raw.trim() || normalized.values.length === 0) return null
      return {
        key,
        label: labelForKey(key),
        raw: normalized.raw,
        values: normalized.values,
      }
    })
    .filter(Boolean)
  const traditions = unique(mappings.flatMap((mapping) => mapping.values.flatMap((value) => value.traditions)))
  const fieldKeysForIndex = mappings.map((mapping) => mapping.key)
  const preview = mappings
    .slice(0, 3)
    .map((mapping) => `${mapping.label}: ${mapping.values.slice(0, 2).map((value) => value.label).join('; ')}`)
    .join(' · ')
    .slice(0, 280)

  return {
    id,
    label: entryLabel,
    entryKey,
    entryRaw,
    sourceSystem,
    sourceSystemLabel: labelForKey(sourceSystem),
    sourceRow: parsedRow.sourceRow,
    mappings,
    fieldKeys: fieldKeysForIndex,
    traditions,
    preview,
    signature: mappingSignature({ mappings }),
    source: {
      sourceFile: sourceMeta.file,
      sourceSha256: sourceMeta.sha256,
      headerRow: sourceMeta.headerRow,
      sourceRow: parsedRow.sourceRow,
      rawSourceSystem: parsedRow.values[SYSTEM_KEY],
      rawEntry: entryRaw,
    },
  }
}

function countFacet(models, getter) {
  const counts = new Map()
  for (const model of models) {
    for (const value of getter(model)) counts.set(value, (counts.get(value) ?? 0) + 1)
  }
  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([value, count]) => ({ value, label: labelForKey(value), count }))
}

function sourceSystemFacet(models) {
  const counts = new Map()
  for (const model of models) counts.set(model.sourceSystem, (counts.get(model.sourceSystem) ?? 0) + 1)
  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([value, count]) => ({ value, label: labelForKey(value), count }))
}

function buildRelatedModels(models) {
  const sameNameGroups = new Map()
  models.forEach((model, index) => {
    const group = sameNameGroups.get(model.entryKey) ?? []
    group.push(index)
    sameNameGroups.set(model.entryKey, group)
  })

  const candidates = models.map(() => new Map())
  const addCandidate = (left, right, field, value) => {
    if (left === right) return
    const current = candidates[left].get(right) ?? { fields: new Set(), values: new Set(), score: 0 }
    current.fields.add(field)
    if (value) current.values.add(value)
    current.score += 1
    candidates[left].set(right, current)
  }

  for (const group of sameNameGroups.values()) {
    if (group.length < 2) continue
    for (const left of group) {
      for (const right of group) {
        if (left !== right) addCandidate(left, right, 'ENTRY', models[left].label)
      }
    }
  }

  const tokenGroups = new Map()
  models.forEach((model, index) => {
    model.mappings.forEach((mapping) => {
      mapping.values.forEach((value) => {
        if (!value.search || value.search.length < 2) return
        const token = `${mapping.key}\u0000${value.search}`
        const group = tokenGroups.get(token) ?? { field: mapping.key, value: value.label, rows: new Set() }
        group.rows.add(index)
        tokenGroups.set(token, group)
      })
    })
  })

  for (const group of tokenGroups.values()) {
    // Generic values such as Fire or Gold should not turn every card into a
    // dense hairball. Specific shared values still produce useful traversal.
    if (group.rows.size < 2 || group.rows.size > 60) continue
    const rows = [...group.rows]
    for (const left of rows) {
      for (const right of rows) {
        if (left !== right) addCandidate(left, right, group.field, group.value)
      }
    }
  }

  return models.map((model, index) => {
    const sameName = (sameNameGroups.get(model.entryKey) ?? [])
      .filter((other) => other !== index)
      .map((other) => ({
        id: models[other].id,
        label: models[other].label,
        sourceSystem: models[other].sourceSystem,
        sourceSystemLabel: models[other].sourceSystemLabel,
        sourceRow: models[other].sourceRow,
        kind: models[other].signature === model.signature ? 'duplicate-assertion' : 'mapping-variant',
        sharedFields: models[other].signature === model.signature ? [] : ['ENTRY'],
        sharedValues: [],
      }))

    const shared = [...candidates[index].entries()]
      .filter(([other]) => !sameName.some((link) => link.id === models[other].id))
      .sort((left, right) => right[1].score - left[1].score || models[left[0]].label.localeCompare(models[right[0]].label))
      .slice(0, 8)
      .map(([other, candidate]) => ({
        id: models[other].id,
        label: models[other].label,
        sourceSystem: models[other].sourceSystem,
        sourceSystemLabel: models[other].sourceSystemLabel,
        sourceRow: models[other].sourceRow,
        kind: 'shared-mapping',
        sharedFields: [...candidate.fields].filter((field) => field !== 'ENTRY').slice(0, 4),
        sharedValues: [...candidate.values].slice(0, 4),
      }))

    return [...sameName, ...shared].slice(0, 12)
  })
}

export function buildCodexArtifacts(parsed, options = {}) {
  const source = makeSourceMeta(parsed, options)
  const fieldKeys = parsed.headers.filter((key) => key !== SYSTEM_KEY && key !== ENTRY_KEY)
  const models = parsed.rows.map((row) => buildModel(row, fieldKeys, source))
  const related = buildRelatedModels(models)
  const rawEntryGroups = new Map()
  for (const model of models) rawEntryGroups.set(model.entryRaw, (rawEntryGroups.get(model.entryRaw) ?? 0) + 1)
  const entryGroups = new Map()
  models.forEach((model, index) => {
    const group = entryGroups.get(model.entryKey) ?? []
    group.push(index)
    entryGroups.set(model.entryKey, group)
  })

  const details = models.map((model, index) => {
    const group = entryGroups.get(model.entryKey) ?? []
    const conflicts = group
      .filter((other) => other !== index)
      .map((other) => {
        const differingFields = fieldKeys.filter(
          (key) => (models[other].mappings.find((mapping) => mapping.key === key)?.raw ?? '') !==
            (model.mappings.find((mapping) => mapping.key === key)?.raw ?? ''),
        )
        return {
          id: models[other].id,
          label: models[other].label,
          sourceSystem: models[other].sourceSystem,
          sourceSystemLabel: models[other].sourceSystemLabel,
          sourceRow: models[other].sourceRow,
          kind: differingFields.length > 0 ? 'mapping-variant' : 'duplicate-assertion',
          differingFields,
        }
      })
      .sort((left, right) => left.sourceRow - right.sourceRow)

    return {
      schemaVersion: SCHEMA_VERSION,
      id: model.id,
      label: model.label,
      sourceSystem: model.sourceSystem,
      sourceSystemLabel: model.sourceSystemLabel,
      sourceRow: model.sourceRow,
      mappings: model.mappings.map((mapping) => ({
        key: mapping.key,
        label: mapping.label,
        raw: mapping.raw,
        values: mapping.values.map((value) => ({
          raw: value.raw,
          label: value.label,
          traditions: value.traditions,
        })),
      })),
      conflicts,
      related: related[index],
      source: {
        ...model.source,
        method: source.method,
        note: source.note,
      },
    }
  })

  const index = {
    schemaVersion: SCHEMA_VERSION,
    source: {
      ...source,
      file: path.basename(source.file),
    },
    fields: fieldKeys.map((key) => ({ value: key, label: labelForKey(key) })),
    facets: {
      sourceSystems: sourceSystemFacet(models),
      fields: countFacet(models, (model) => model.fieldKeys),
      traditions: countFacet(models, (model) => model.traditions),
    },
    stats: {
      entryCount: models.length,
      uniqueRawEntryLabelCount: rawEntryGroups.size,
      uniqueEntryLabelCount: entryGroups.size,
      ambiguousEntryLabelCount: [...entryGroups.values()].filter((group) => group.length > 1).length,
      sourceSystemCount: new Set(models.map((model) => model.sourceSystem)).size,
      fieldCount: fieldKeys.length,
      mappingCount: models.reduce((total, model) => total + model.mappings.length, 0),
      traditionAnnotationCount: new Set(models.flatMap((model) => model.traditions)).size,
    },
    entries: models.map((model, index) => ({
      id: model.id,
      label: model.label,
      sourceSystem: model.sourceSystem,
      sourceSystemLabel: model.sourceSystemLabel,
      sourceRow: model.sourceRow,
      fieldMask: model.fieldKeys.reduce((mask, key) => mask | (1 << fieldKeys.indexOf(key)), 0),
      traditions: model.traditions,
      searchHint: model.mappings.filter((mapping) => mapping.key !== model.sourceSystem)
        .slice(0, 8).flatMap((mapping) => mapping.values.slice(0, 1).map((value) => value.label))
        .join(' · ').slice(0, 105),
      ambiguous: (entryGroups.get(model.entryKey) ?? []).length > 1,
      parallelCount: (entryGroups.get(model.entryKey) ?? []).length - 1,
      relatedCount: related[index].length,
    })),
  }

  return { index, details }
}

function sha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex')
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, `${JSON.stringify(value)}\n`, 'utf8')
}

export function generateCodex({ inputPath = DEFAULT_SOURCE, outputPath = DEFAULT_OUTPUT } = {}) {
  const csvText = fs.readFileSync(inputPath, 'utf8')
  const parsed = parseSupermatrixCsv(csvText, { sourceFile: path.basename(inputPath) })
  const artifacts = buildCodexArtifacts(parsed, {
    sourceFile: path.basename(inputPath),
    sourceSha256: sha256(csvText),
  })

  fs.rmSync(outputPath, { recursive: true, force: true })
  fs.mkdirSync(path.join(outputPath, 'details'), { recursive: true })
  writeJson(path.join(outputPath, 'index.json'), artifacts.index)
  for (const detail of artifacts.details) {
    writeJson(path.join(outputPath, 'details', `${detail.id}.json`), detail)
  }
  return {
    ...artifacts.index.stats,
    outputPath,
    sourceSha256: artifacts.index.source.sha256,
  }
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isCli) {
  const [, , inputArg, outputArg] = process.argv
  const result = generateCodex({
    inputPath: inputArg ? path.resolve(inputArg) : DEFAULT_SOURCE,
    outputPath: outputArg ? path.resolve(outputArg) : DEFAULT_OUTPUT,
  })
  console.log(JSON.stringify(result))
}
