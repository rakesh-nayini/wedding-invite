import { useState } from 'react'
import { motion } from 'framer-motion'
import type { WeddingEvent } from '../data/wedding'
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
    window.setTimeout(() => onComplete?.(), 800)
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <button
        type="button"
        onClick={tie}
        className={`relative flex min-h-64 w-full flex-col items-center justify-center overflow-hidden rounded-[2rem] border-2 px-4 pb-5 pt-6 ${
          tied ? 'border-gold/30 bg-[#fffaf4]' : 'tap-glow border-[#c9a962] bg-[#fff6e8]'
        }`}
      >
        <svg viewBox="0 0 320 140" className="h-28 w-full px-8" aria-hidden>
          <motion.path
            d="M10 70 C 80 70, 90 70, 140 70"
            fill="none"
            stroke="#C9A962"
            strokeWidth="3"
            strokeLinecap="round"
            animate={tied ? { d: 'M10 70 C 90 70, 110 38, 160 70' } : undefined}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.path
            d="M310 70 C 240 70, 230 70, 180 70"
            fill="none"
            stroke="#7A3038"
            strokeWidth="3"
            strokeLinecap="round"
            animate={tied ? { d: 'M310 70 C 230 70, 210 102, 160 70' } : undefined}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.circle
            cx="160"
            cy="70"
            r="9"
            fill="#C9A962"
            animate={tied ? { scale: [1, 1.35, 1] } : { scale: 0.85, opacity: 0.5 }}
          />
        </svg>
        {!tied && (
          <span className="mt-2 inline-flex min-h-12 items-center rounded-full bg-[#f3d48a] px-6 py-3 font-serif text-lg text-[#5c1c1c] shadow-[0_8px_20px_rgba(0,0,0,0.12)]">
            Tap to tie the knot
          </span>
        )}
      </button>
      <motion.div
        initial={false}
        animate={tied ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        className="mt-4 overflow-hidden rounded-[2rem] bg-white/80 shadow-sm"
      >
        {tied && <InviteNote event={event} />}
      </motion.div>
    </div>
  )
}
