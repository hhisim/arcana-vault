'use client'

import React from 'react'
import { SiteI18nProvider } from '@/lib/site-i18n'
import { AuthProvider } from '@/components/auth/AuthProvider'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SiteI18nProvider>
      <AuthProvider>{children}</AuthProvider>
    </SiteI18nProvider>
  )
}
