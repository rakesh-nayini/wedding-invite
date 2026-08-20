import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ResponsiveImage from '../components/ResponsiveImage'
import { COUPLE, introImagesFor } from '../data/wedding'
import { useInvite } from '../hooks/useInvite'
import { useReducedMotion } from '../hooks/useMediaQuery'

interface IntroGateProps {
  onPrimeMusic: () => void
  onContinue: () => void
}

const HOLD_MS = 2000
const PANS = [
  { initial: { scale: 1, x: 0, y: 0 }, animate: { scale: 1.045, x: 6, y: 0 } },
  { initial: { scale: 1, x: 0, y: 0 }, animate: { scale: 1.04, x: -8, y: 4 } },
  { initial: { scale: 1, x: 0, y: 0 }, animate: { scale: 1.05, x: 0, y: -6 } },
  { initial: { scale: 1, x: 0, y: 0 }, animate: { scale: 1.04, x: 8, y: 2 } },
  { initial: { scale: 1, x: 0, y: 0 }, animate: { scale: 1.045, x: -4, y: -4 } },
  { initial: { scale: 1, x: 0, y: 0 }, animate: { scale: 1.038, x: 4, y: 6 } },
  { initial: { scale: 1, x: 0, y: 0 }, animate: { scale: 1.042, x: -6, y: 0 } },
]

export default function IntroGate({ onPrimeMusic, onContinue }: IntroGateProps) {
  const { firstName, secondName, familyLine, side } = useInvite()
  const reduced = useReducedMotion()
  const slides = introImagesFor(side)
  const [index, setIndex] = useState(0)
  const [begun, setBegun] = useState(false)
  const begunRef = useRef(false)

  useEffect(() => {
    setIndex(0)
  }, [side])

  useEffect(() => {
    if (slides.length < 2) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, HOLD_MS)
    return () => window.clearInterval(id)
  }, [slides.length, side])

  const photo = slides[index]
  const pan = PANS[index % PANS.length]

  const begin = () => {
    onPrimeMusic()
    if (begunRef.current) {
      document.getElementById('story')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    begunRef.current = true
    onContinue()
    setBegun(true)
    window.setTimeout(() => {
      document.getElementById('story')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 60)
  }

  const continueDown = () => {
    onPrimeMusic()
    onContinue()
    document.getElementById('story')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section id="intro" className="relative h-[100dvh] min-h-[100dvh] w-full overflow-hidden bg-black">
      <AnimatePresence mode="sync">
        <motion.div
          key={photo.slug}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: 'easeInOut' }}
        >
          <motion.div
            className="absolute inset-0"
            initial={reduced ? { scale: 1 } : pan.initial}
            animate={reduced ? { scale: 1 } : pan.animate}
            transition={reduced ? { duration: 0 } : { duration: HOLD_MS / 1000, ease: 'easeOut' }}
          >
            <ResponsiveImage
              slug={photo.slug}
              alt=""
              width={1920}
              className="h-full w-full object-cover object-center"
              eager
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/80" />

      <AnimatePresence>
        {!begun && (
          <motion.div
            className="absolute inset-0 z-30 flex flex-col items-center justify-end px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="font-serif italic text-[16px] text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.65)]">
              {COUPLE.tagline}
            </p>
            <h1 className="mt-2 font-serif text-5xl leading-tight text-white [text-shadow:0_3px_16px_rgba(0,0,0,0.7)] md:text-6xl">
              {firstName}
              <span className="mx-2 text-[#f3d48a]">&</span>
              {secondName}
            </h1>
            <p className="mt-2 text-base text-white/95 [text-shadow:0_2px_10px_rgba(0,0,0,0.65)]">{familyLine}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.28em] text-[#f3d48a]">27 August 2026</p>
            <button
              type="button"
              onClick={begin}
              className="mt-8 min-h-12 min-w-[16rem] rounded-full bg-[#f3d48a] px-8 py-3.5 font-serif text-lg text-[#5c1c1c] shadow-[0_12px_30px_rgba(0,0,0,0.35)]"
            >
              Open invitation
            </button>
            <p className="mt-3 text-sm text-white/90 [text-shadow:0_2px_8px_rgba(0,0,0,0.6)]">
              Tap once — music will play
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {begun && (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-5 pb-[max(1.4rem,env(safe-area-inset-bottom))] pt-24 text-center">
            <p className="font-serif italic text-[16px] leading-snug text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.65)]">
              {COUPLE.tagline}
            </p>
            <h1 className="mt-2 font-serif text-5xl leading-tight text-white [text-shadow:0_3px_16px_rgba(0,0,0,0.7)] md:text-6xl">
              {firstName}
              <span className="mx-2 text-[#f3d48a]">&</span>
              {secondName}
            </h1>
            <p className="mt-2 text-base text-white/95 [text-shadow:0_2px_10px_rgba(0,0,0,0.65)]">{familyLine}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.28em] text-[#f3d48a] [text-shadow:0_2px_8px_rgba(0,0,0,0.6)]">
              27 August 2026
            </p>
            <button
              type="button"
              onClick={continueDown}
              className="pointer-events-auto mx-auto mt-5 flex flex-col items-center gap-1.5 text-white"
            >
              <span className="text-xs tracking-[0.22em] uppercase [text-shadow:0_2px_8px_rgba(0,0,0,0.65)]">
                Scroll down
              </span>
              <span className="scroll-hint text-[#f3d48a]" aria-hidden>
                <svg viewBox="0 0 32 32" className="h-11 w-11" fill="none">
                  <path
                    d="M6 11 L16 22 L26 11"
                    stroke="currentColor"
                    strokeWidth="3.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
          </div>
        </>
      )}
    </section>
  )
}
