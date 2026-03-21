'use client'

import React from 'react'
import { SiteI18nProvider } from '@/lib/site-i18n'
import { AuthProvider } from '@/components/auth/AuthProvider'
import TrialBanner from '@/components/subscription/TrialBanner'
import TestModeBadge from '@/components/subscription/TestModeBadge'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SiteI18nProvider>
      <AuthProvider>
        <TrialBanner />
        {children}
        <TestModeBadge />
      </AuthProvider>
    </SiteI18nProvider>
  )
}
