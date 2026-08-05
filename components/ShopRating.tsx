import { starFill } from '@/lib/reviews'

/**
 * Renders a 5-star row with fractional fill (e.g. 4.6 -> 4 full + partial),
 * plus an optional "4.6 (5)" caption. Pure server-renderable.
 */
export default function ShopRating({
  rating,
  count,
  size = 15,
  showText = true,
  className = '',
}: {
  rating: number
  count?: number
  size?: number
  showText?: boolean
  className?: string
}) {
  const fill = starFill(rating)

  const star = (i: number) => {
    const width = Math.max(0, Math.min(1, fill - i)) // 0..1 for this star
    return (
      <span
        key={i}
        className="relative inline-block"
        style={{ width: size, height: size, marginRight: 2 }}
      >
        {/* base (empty) */}
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="text-[#3A3550]">
          <path
            d="M12 2l2.9 6.26 6.86.6-5.2 4.53 1.55 6.71L12 16.9 5.89 20.1l1.55-6.71-5.2-4.53 6.86-.6z"
            fill="currentColor"
          />
        </svg>
        {/* filled overlay clipped to fraction */}
        <span
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${width * 100}%` }}
        >
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="text-[#C9A84C]">
            <path
              d="M12 2l2.9 6.26 6.86.6-5.2 4.53 1.55 6.71L12 16.9 5.89 20.1l1.55-6.71-5.2-4.53 6.86-.6z"
              fill="currentColor"
            />
          </svg>
        </span>
      </span>
    )
  }

  return (
    <span className={`inline-flex items-center gap-2 ${className}`} title={`${rating} / 5`}>
      <span className="inline-flex items-center" aria-label={`${rating} out of 5 stars`}>
        {[0, 1, 2, 3, 4].map(star)}
      </span>
      {showText && (
        <span className="text-xs text-[#C9A84C] font-semibold whitespace-nowrap">
          {rating.toFixed(1)}
          {typeof count === 'number' && count > 0 && (
            <span className="text-[#9B93AB] font-normal"> ({count})</span>
          )}
        </span>
      )}
    </span>
  )
}
