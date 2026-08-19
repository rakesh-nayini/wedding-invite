import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import MagneticButton from '../components/MagneticButton'
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

const HOLD_MS = 3800
const PANS = [
  { initial: { scale: 1.08, x: 0, y: 0 }, animate: { scale: 1.2, x: -28, y: 8 } },
  { initial: { scale: 1.14, x: 12, y: 0 }, animate: { scale: 1.06, x: -8, y: -16 } },
  { initial: { scale: 1.06, x: 0, y: 10 }, animate: { scale: 1.18, x: 22, y: 0 } },
  { initial: { scale: 1.1, x: -10, y: 4 }, animate: { scale: 1.18, x: 16, y: -10 } },
  { initial: { scale: 1.12, x: 8, y: -6 }, animate: { scale: 1.06, x: -14, y: 8 } },
]

export default function IntroGate({ open, onOpen, musicOn, onToggleMusic }: IntroGateProps) {
  const { firstName, secondName, familyLine, side } = useInvite()
  const reduced = useReducedMotion()
  const slides = introImagesFor(side)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setIndex(0)
  }, [side])

  useEffect(() => {
    if (open || reduced) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, HOLD_MS)
    return () => window.clearInterval(id)
  }, [open, reduced, slides.length])

  const photo = slides[index]
  const pan = PANS[index % PANS.length]

  return (
    <AnimatePresence>
      {!open && (
        <motion.section
          className="fixed inset-0 z-[60] overflow-hidden bg-[var(--paper)]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="sync">
            <motion.div
              key={photo.slug}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
            >
              <motion.div
                className="absolute inset-[-12%]"
                initial={reduced ? { scale: 1.08 } : pan.initial}
                animate={reduced ? { scale: 1.08 } : pan.animate}
                transition={reduced ? { duration: 0 } : { duration: HOLD_MS / 1000, ease: 'linear' }}
              >
                <ResponsiveImage
                  slug={photo.slug}
                  alt=""
                  width={1920}
                  className="h-full w-full object-cover"
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

          <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-[max(1.4rem,env(safe-area-inset-bottom))] pt-28 text-center">
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
            <div className="mt-5">
              <MagneticButton
                className="border border-[#f3d48a] bg-transparent px-10 py-3.5 text-sm tracking-[0.18em] text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.55)]"
                onPointerDown={onOpen}
                onClick={onOpen}
              >
                Open the invite
              </MagneticButton>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}
