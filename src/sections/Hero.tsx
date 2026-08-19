import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ParticleField from '../components/ParticleField'
import ResponsiveImage from '../components/ResponsiveImage'
import { COUPLE } from '../data/wedding'
import { prefersReducedMotion } from '../animations/reducedMotion'
import { useScrollHue } from '../animations/gsapScroll'
import { useInvite } from '../hooks/useInvite'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const { firstName, secondName } = useInvite()
  const imgRef = useRef<HTMLDivElement>(null)
  useScrollHue(imgRef)

  useEffect(() => {
    if (prefersReducedMotion() || !imgRef.current) return
    const ctx = gsap.context(() => {
      gsap.to(imgRef.current, {
        yPercent: 10,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section id="hero" data-snap className="snap-panel relative h-[100svh] min-h-[560px] overflow-hidden">
      <div ref={imgRef} className="absolute inset-[-8%]">
        <ResponsiveImage slug="hero" alt={`${COUPLE.bride} and ${COUPLE.groom}`} className="h-full w-full object-cover" eager />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--paper)]/30 via-transparent to-[var(--paper)]" />
      <ParticleField mode="petals" density={14} />
      <ParticleField mode="lights" density={12} />

      <div className="relative z-10 flex h-full flex-col items-start justify-end px-6 pb-20 md:px-16">
        <p className="max-w-xs text-[11px] uppercase tracking-[0.28em] text-gold">A lifetime celebration</p>
        <h2 className="mt-3 font-serif text-5xl leading-tight text-[var(--ink)] md:text-7xl">
          {firstName}
          <br />
          <span className="text-gold">&</span> {secondName}
        </h2>
        <p className="mt-4 text-sm text-[var(--muted)] md:text-base">
          {COUPLE.weddingDate} · {COUPLE.weddingTime}
        </p>
        <div className="mt-10 flex flex-col items-start gap-2 text-[10px] uppercase tracking-[0.4em] text-maroon/50">
          <span>Scroll</span>
          <span className="h-10 w-px bg-gold/70" />
        </div>
      </div>
    </section>
  )
}
