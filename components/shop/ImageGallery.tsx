'use client'

import { useState } from 'react'

export default function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [idx, setIdx] = useState(0)
  const img = images[idx] ?? images[0]

  if (!img) {
    return (
      <div className="aspect-[4/3] w-full rounded-xl border border-white/10 bg-gradient-to-br from-indigo-900/40 via-[#141225] to-black" />
    )
  }

  return (
    <div>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/10 bg-[#0d0d15]">
        <img src={img} alt={title} className="h-full w-full object-cover" />
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-md border transition-colors ${
                i === idx ? 'border-amber-400/80' : 'border-white/10 hover:border-white/30'
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
