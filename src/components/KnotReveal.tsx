import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { WeddingEvent } from '../data/wedding'
import InviteFrame from './InviteFrame'
import InviteNote from './InviteNote'

const GOLD_OPEN = 'M 12 80 C 58 80, 88 80, 112 80 C 140 80, 142 80, 160 80 C 180 80, 198 80, 180 80 C 164 80, 148 80, 160 80 C 176 80, 198 80, 204 80 C 230 80, 260 80, 308 80'
const GOLD_TIED = 'M 12 80 C 58 80, 88 80, 112 66 C 140 46, 138 24, 160 26 C 186 28, 204 54, 182 72 C 164 88, 142 108, 160 122 C 180 138, 208 120, 204 96 C 230 80, 260 80, 308 80'

const ROSE_OPEN = 'M 308 80 C 262 80, 232 80, 208 80 C 180 80, 178 80, 160 80 C 140 80, 122 80, 140 80 C 156 80, 172 80, 160 80 C 144 80, 122 80, 116 80 C 90 80, 60 80, 12 80'
const ROSE_TIED = 'M 308 80 C 262 80, 232 80, 208 94 C 180 114, 182 136, 160 134 C 134 132, 116 106, 138 88 C 156 72, 178 52, 160 38 C 140 22, 112 40, 116 64 C 90 80, 60 80, 12 80'

export default function KnotReveal({
  event,
  onComplete,
}: {
  event: WeddingEvent
  onComplete?: () => void
}) {
  const [tied, setTied] = useState(false)

  const tie = () => {
    if (tied) return
    setTied(true)
    window.setTimeout(() => onComplete?.(), 1100)
  }

  return (
    <InviteFrame className="mx-auto w-full max-w-md">
      <button type="button" onClick={tie} className="w-full text-center">
        <p className="text-[10px] tracking-[0.38em] uppercase text-gold">Wedding</p>
        <h3 className="mt-2 font-serif italic text-[1.85rem] leading-tight text-[#5c1c1c]">Tie the knot</h3>
        <svg viewBox="0 0 320 160" className="mx-auto mt-3 h-36 w-full max-w-[20rem]" aria-hidden>
          <motion.path
            fill="none"
            stroke="#C9A962"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ d: tied ? GOLD_TIED : GOLD_OPEN }}
            transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.path
            fill="none"
            stroke="#7A3038"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ d: tied ? ROSE_TIED : ROSE_OPEN }}
            transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1], delay: 0.06 }}
          />
          <motion.circle
            cx="160"
            cy="80"
            r="5.5"
            fill="#C9A962"
            animate={tied ? { scale: [1, 1.35, 1], opacity: 1 } : { scale: 0.85, opacity: 0.55 }}
            transition={{ duration: 0.8, delay: tied ? 0.55 : 0 }}
          />
        </svg>
        {!tied && (
          <span className="mt-1 inline-block rounded-full bg-[#f3d48a] px-5 py-2.5 font-serif text-[15px] text-[#5c1c1c]">
            Tap here to tie the knot
          </span>
        )}
      </button>

      <AnimatePresence>
        {tied && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.35 }}
            className="mt-2 border-t border-gold/25 pt-5"
          >
            <InviteNote event={event} />
          </motion.div>
        )}
      </AnimatePresence>
    </InviteFrame>
  )
}
