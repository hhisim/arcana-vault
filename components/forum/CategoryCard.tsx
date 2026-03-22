'use client'

import React from 'react'
import Link from 'next/link'

interface CategoryCardProps {
  slug: string
  icon: string
  name: string
  description: string
  postCount?: number
  lang?: string
}

export default function CategoryCard({
  slug,
  icon,
  name,
  description,
  postCount = 0,
  lang = 'en',
}: CategoryCardProps) {
  return (
    <Link
      href={`/agora/${slug}`}
      className="group relative flex flex-col p-8 rounded-3xl overflow-hidden transition-all duration-500
        bg-gradient-to-br from-[rgba(18,18,26,0.95)] to-[rgba(12,12,20,0.9)]
        border border-[rgba(255,255,255,0.06)]
        hover:border-[rgba(201,168,76,0.3)]
        hover:shadow-[0_0_50px_rgba(201,168,76,0.08),0_0_100px_rgba(123,94,167,0.05)]
        hover:-translate-y-0.5"
    >
      {/* Icon */}
      <div className="mb-6 text-5xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-2xl text-[#E8E0F0] group-hover:text-[#C9A84C] transition-colors duration-300">
            {name}
          </h3>
        </div>
        <p className="text-sm text-[#9B93AB] leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-5 border-t border-[rgba(255,255,255,0.05)] flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-[#9B93AB]">
          {postCount} {postCount === 1 ? 'thread' : 'threads'}
        </span>
        <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84C] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Enter →
        </span>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none
        bg-gradient-to-t from-[rgba(201,168,76,0.03)] to-transparent" />
    </Link>
  )
}
