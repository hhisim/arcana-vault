'use client'

import { useAuth } from '@/components/auth/AuthProvider'

export default function TestModeBadge() {
  useAuth()
  return null
}
