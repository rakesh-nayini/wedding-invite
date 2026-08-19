import { useEffect, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from './reducedMotion'

gsap.registerPlugin(ScrollTrigger)

/** Subtle hue / overlay shift as the page scrolls. */
export function useScrollHue(target: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = target.current
    if (!el || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.to(el, {
        filter: 'hue-rotate(12deg) saturate(1.08)',
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
        },
      })
    })
    return () => ctx.revert()
  }, [target])
}
