import { useEffect } from 'react'

/** Light haptic when a snap-section enters view (mobile). */
export function useScrollResponse(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-snap]'))
    if (!sections.length) return

    const seen = new WeakSet<Element>()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.55) return
          if (seen.has(entry.target)) return
          seen.add(entry.target)
          try {
            navigator.vibrate?.(8)
          } catch {
            /* ignore */
          }
          entry.target.classList.add('snap-in')
        })
      },
      { threshold: 0.55 },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [enabled])
}
