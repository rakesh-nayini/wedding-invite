import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion, isCoarsePointer } from '../animations/reducedMotion'

gsap.registerPlugin(ScrollTrigger)

/** Smooth wheel on desktop only — native touch scroll feels snappier on phones. */
export function useLenis(enabled: boolean) {
  useEffect(() => {
    if (!enabled || prefersReducedMotion() || isCoarsePointer()) return

    const lenis = new Lenis({
      duration: 0.9,
      smoothWheel: true,
      touchMultiplier: 1,
    })

    lenis.on('scroll', ScrollTrigger.update)
    const ticker = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(ticker)
      lenis.destroy()
    }
  }, [enabled])
}
