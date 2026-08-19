const BASE = import.meta.env.BASE_URL

export function asset(path: string): string {
  const clean = path.startsWith('/') ? path.slice(1) : path
  return `${BASE}${clean}`
}

export function imageSrc(slug: string, width: 640 | 1080 | 1920 = 1080): string {
  return asset(`assets/images/${slug}-${width}.webp`)
}

export function imageSrcFallback(slug: string, width: 640 | 1080 | 1920 = 1080): string {
  return asset(`assets/images/${slug}-${width}.jpg`)
}

export function pictureSources(
  slug: string,
  widths: Array<640 | 1080 | 1920> = [640, 1080, 1920],
) {
  return widths.map((w) => ({
    width: w,
    webp: imageSrc(slug, w),
    jpeg: imageSrcFallback(slug, w),
  }))
}

export function responsiveImageProps(slug: string, width: 640 | 1080 | 1920 = 1080) {
  return {
    src: imageSrcFallback(slug, width),
    srcSet: `${imageSrcFallback(slug, 640)} 640w, ${imageSrcFallback(slug, 1080)} 1080w, ${imageSrcFallback(slug, 1920)} 1920w`,
    sizes: '(max-width: 640px) 100vw, (max-width: 1080px) 90vw, 1200px',
  }
}
