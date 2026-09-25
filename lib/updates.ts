import updateData from './updates.json'

export type UpdateStatus = 'shipped' | 'in-verification'

export type PublicUpdate = {
  id: string
  publishedAt: string
  sourceCommit: string
  status: UpdateStatus
  label: string
  title: string
  summary: string
  details: string[]
  verification: string
}

export const UPDATES = updateData as PublicUpdate[]
export const PUBLIC_UPDATES_LAST_MODIFIED = UPDATES[0]?.publishedAt ?? '2026-09-24T20:05:43Z'
