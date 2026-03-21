import Image from 'next/image';

interface AdinkraIconProps {
  /** Adinkra symbol name (without file extension) */
  name: string;
  /** Display size in pixels */
  size?: number;
  /** Additional CSS classes */
  className?: string;
  /** Alt text for accessibility */
  alt?: string;
  /** Color tint - gold (default) or purple */
  color?: 'gold' | 'purple';
}

/**
 * AdinkraIcon — renders a Ghanaian adinkra symbol as a small accent icon.
 * Symbols are stored in /public/adinkra/ as transparent PNGs.
 *
 * Usage:
 *   <AdinkraIcon name="adinkra-1" size={24} color="gold" />
 *   <AdinkraIcon name="adinkra-gye-nyame" size={20} />
 */
export default function AdinkraIcon({
  name,
  size = 24,
  className = '',
  alt = '',
  color = 'gold',
}: AdinkraIconProps) {
  const src = `/adinkra/${name}.png`;

  // Tint filter: gold = warm sepia, purple = purple hue
  const tintFilter =
    color === 'purple'
      ? 'brightness(0) saturate(100%) invert(27%) sepia(93%) saturate(2367%) hue-rotate(240deg) brightness(100%) contrast(97%)'
      : 'brightness(0) saturate(100%) sepia(92%) saturate(600%) hue-rotate(355deg) brightness(90%) contrast(95%)';

  return (
    <span
      className={`inline-flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-label={alt || `Adinkra symbol: ${name}`}
      title={alt || name}
    >
      <Image
        src={src}
        alt={alt || name}
        width={size}
        height={size}
        style={{ filter: tintFilter, pointerEvents: 'none' }}
        unoptimized
      />
    </span>
  );
}
