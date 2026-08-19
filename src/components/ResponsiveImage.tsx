import { imageSrcFallback } from '../utils/assets'

interface ResponsiveImageProps {
  slug: string
  alt: string
  className?: string
  width?: 640 | 1080 | 1920
  eager?: boolean
}

export default function ResponsiveImage({
  slug,
  alt,
  className = '',
  width = 1080,
  eager = false,
}: ResponsiveImageProps) {
  return (
    <img
      src={imageSrcFallback(slug, width)}
      srcSet={`${imageSrcFallback(slug, 640)} 640w, ${imageSrcFallback(slug, 1080)} 1080w, ${imageSrcFallback(slug, 1920)} 1920w`}
      sizes="(max-width: 640px) 100vw, (max-width: 1080px) 90vw, 1200px"
      alt={alt}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  )
}
