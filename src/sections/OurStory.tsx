import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ResponsiveImage from '../components/ResponsiveImage'
import { STORY_CHAPTERS, storyImageSlug } from '../data/wedding'
import { prefersReducedMotion } from '../animations/reducedMotion'
import { useInvite } from '../hooks/useInvite'

gsap.registerPlugin(ScrollTrigger)

export default function OurStory() {
  const root = useRef<HTMLElement>(null)
  const { side } = useInvite()

  useEffect(() => {
    if (prefersReducedMotion() || !root.current) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.story-chapter').forEach((el) => {
        const img = el.querySelector('.story-img')
        const text = el.querySelector('.story-copy')
        gsap.fromTo(
          img,
          { y: 24, opacity: 0.7 },
          {
            y: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 80%', end: 'top 30%', scrub: true },
          },
        )
        gsap.fromTo(
          text,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            scrollTrigger: { trigger: el, start: 'top 78%' },
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="story" ref={root} className="bg-[var(--paper)] pb-8">
      {STORY_CHAPTERS.map((c) => {
        const slug = storyImageSlug(c.image, side)
        return (
        <article key={c.id} className="story-chapter mx-auto max-w-3xl px-5 py-10 md:py-16">
          <div className="story-copy mx-auto max-w-md text-center">
            <p className="text-[10px] uppercase tracking-[0.4em] text-gold">{c.kicker}</p>
            <h3 className="mt-3 font-serif text-3xl text-[var(--ink)] md:text-4xl">{c.title}</h3>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">{c.text}</p>
          </div>
          <div className="relative mx-auto mt-8 w-full max-w-md overflow-hidden rounded-[1.75rem]">
            <div className={`relative ${c.frame === '3/2' ? 'aspect-[3/2]' : 'aspect-[3/4]'}`}>
              <ResponsiveImage
                key={slug}
                slug={slug}
                alt={c.title}
                className={`story-img absolute inset-0 h-full w-full object-cover ${c.frame === '3/2' ? 'object-center' : 'object-[center_42%]'}`}
              />
            </div>
          </div>
        </article>
        )
      })}
    </section>
  )
}
