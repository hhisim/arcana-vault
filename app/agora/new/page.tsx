'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import ThreadForm from '@/components/forum/ThreadForm'

export default function NewThreadPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/agora/new')
    }
  }, [user, authLoading, router])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center">
        <div className="voa-dots text-3xl text-[#C9A84C] mb-4">●●●</div>
        <p className="text-sm text-[#9B93AB] uppercase tracking-widest">Preparing...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* Header */}
      <section className="relative overflow-hidden py-16 px-6 border-b border-[rgba(255,255,255,0.05)]">
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(201,168,76,0.04)] to-transparent" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <Link
            href="/agora"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#7B5EA7] hover:text-[#C9A84C] transition-colors mb-8"
          >
            ← The Agora
          </Link>
          <div className="text-center">
            <div className="text-4xl mb-3">✦</div>
            <h1 className="font-serif text-4xl md:text-5xl text-[#E8E0F0] mb-3">
              Open a Thread
            </h1>
            <p className="text-[#9B93AB] max-w-lg mx-auto leading-relaxed">
              Begin a new discussion in the Agora. Share an inquiry, a reflection,
              or a discovery from your practice.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="glass-card rounded-3xl p-8 md:p-10 border border-[rgba(201,168,76,0.12)] shadow-[0_0_80px_rgba(201,168,76,0.04)]">
          <ThreadForm
            onSuccess={(thread) => {
              router.push(`/agora/${thread.category_slug}/${thread.id}`)
            }}
            onCancel={() => router.back()}
          />
        </div>
      </section>
    </div>
  )
}
