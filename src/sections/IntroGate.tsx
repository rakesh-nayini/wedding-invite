import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ResponsiveImage from '../components/ResponsiveImage'
import { COUPLE, introImagesFor } from '../data/wedding'
import { useInvite } from '../hooks/useInvite'
import { useReducedMotion } from '../hooks/useMediaQuery'

interface IntroGateProps {
  open: boolean
  onOpen: () => void
  musicOn: boolean
  onToggleMusic: () => void
}

const HOLD_MS = 2000
const PANS = [
  { initial: { scale: 1, x: 0, y: 0 }, animate: { scale: 1.045, x: 6, y: 0 } },
  { initial: { scale: 1, x: 0, y: 0 }, animate: { scale: 1.04, x: -8, y: 4 } },
  { initial: { scale: 1, x: 0, y: 0 }, animate: { scale: 1.05, x: 0, y: -6 } },
  { initial: { scale: 1, x: 0, y: 0 }, animate: { scale: 1.04, x: 8, y: 2 } },
  { initial: { scale: 1, x: 0, y: 0 }, animate: { scale: 1.045, x: -4, y: -4 } },
]

export default function IntroGate({ open, onOpen, musicOn, onToggleMusic }: IntroGateProps) {
  const { firstName, secondName, familyLine, side } = useInvite()
  const reduced = useReducedMotion()
  const slides = introImagesFor(side)
  const [index, setIndex] = useState(0)
  const touchY = useRef<number | null>(null)
  const openedOnce = useRef(false)

  const goNext = () => {
    if (openedOnce.current || open) return
    openedOnce.current = true
    onOpen()
  }

  useEffect(() => {
    setIndex(0)
    openedOnce.current = false
  }, [side])

  useEffect(() => {
    if (open) return
    let step = 0
    const id = window.setInterval(() => {
      step += 1
      if (step >= slides.length) {
        window.clearInterval(id)
        goNext()
        return
      }
      setIndex(step)
    }, HOLD_MS)
    return () => window.clearInterval(id)
  }, [open, slides.length, side])

  useEffect(() => {
    if (open) return
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 12) goNext()
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [open])

  const photo = slides[index]
  const pan = PANS[index % PANS.length]

  return (
    <AnimatePresence>
      {!open && (
        <motion.section
          className="fixed inset-0 z-[60] overflow-hidden bg-black"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          onTouchStart={(e) => {
            touchY.current = e.touches[0]?.clientY ?? null
          }}
          onTouchEnd={(e) => {
            const start = touchY.current
            const end = e.changedTouches[0]?.clientY
            touchY.current = null
            if (start != null && end != null && start - end > 40) goNext()
          }}
        >
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

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/75" />

          <button
            type="button"
            onClick={onToggleMusic}
            className="absolute right-4 top-4 z-20 rounded-full border border-white/50 bg-white/80 px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-maroon"
          >
            Music {musicOn ? 'On' : 'Off'}
          </button>

          <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-[max(1.4rem,env(safe-area-inset-bottom))] pt-24 text-center">
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
            <p className="mt-3 text-sm text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.7)]">
              Thank you for opening this. Your presence means everything to us.
            </p>
            <button type="button" onClick={goNext} className="mx-auto mt-5 flex flex-col items-center gap-1.5 text-white">
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
        </motion.section>
      )}
    </AnimatePresence>
  )
}
