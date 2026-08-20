import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { WeddingEvent } from '../data/wedding'
import InviteFrame from './InviteFrame'
import InviteNote from './InviteNote'

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
    window.setTimeout(() => onComplete?.(), 850)
  }

  return (
    <InviteFrame className="mx-auto w-full max-w-md">
      <button type="button" onClick={tie} className="w-full text-center">
        <p className="text-[10px] tracking-[0.38em] uppercase text-gold">Wedding</p>
        <h3 className="mt-2 font-serif italic text-[1.85rem] leading-tight text-[#5c1c1c]">Tie the knot</h3>
        <svg viewBox="0 0 280 100" className="mx-auto mt-5 h-24 w-full max-w-[17rem]" aria-hidden>
          <motion.path
            d="M8 50 H 118"
            fill="none"
            stroke="#C9A962"
            strokeWidth="2.2"
            strokeLinecap="round"
            animate={tied ? { d: 'M8 50 C 52 50, 78 22, 118 50' } : { d: 'M8 50 H 118' }}
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.path
            d="M272 50 H 162"
            fill="none"
            stroke="#7A3038"
            strokeWidth="2.2"
            strokeLinecap="round"
            animate={tied ? { d: 'M272 50 C 228 50, 202 78, 162 50' } : { d: 'M272 50 H 162' }}
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.circle
            cx="140"
            cy="50"
            r="6.5"
            fill="#C9A962"
            animate={tied ? { scale: [1, 1.25, 1] } : { scale: 0.9, opacity: 0.7 }}
            transition={{ duration: 0.7 }}
          />
        </svg>
        {!tied && (
          <span className="mt-4 inline-block rounded-full bg-[#f3d48a] px-5 py-2.5 font-serif text-[15px] text-[#5c1c1c]">
            Tap here to tie the knot
          </span>
        )}
      </button>

      <AnimatePresence>
        {tied && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="mt-3 border-t border-gold/25 pt-5"
          >
            <InviteNote event={event} />
          </motion.div>
        )}
      </AnimatePresence>
    </InviteFrame>
  )
}
