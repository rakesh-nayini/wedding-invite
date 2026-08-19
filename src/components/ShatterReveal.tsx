import { useState } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import type { WeddingEvent } from '../data/wedding'
import InviteNote from './InviteNote'

/** Groom Haldi — three taps crack a clay pot, then gold light spills out. */
export default function ShatterReveal({
  event,
  onComplete,
}: {
  event: WeddingEvent
  onComplete?: () => void
}) {
  const [hits, setHits] = useState(0)
  const open = hits >= 3

  const tap = () => {
    if (open) return
    const next = hits + 1
    setHits(next)
    try {
      navigator.vibrate?.(next === 3 ? [12, 40, 18] : 12)
    } catch {
      /* ignore */
    }
    if (next === 3) {
      void confetti({
        particleCount: 70,
        spread: 62,
        origin: { y: 0.55 },
        colors: ['#f4c430', '#fff6c8', '#c9a962'],
      })
      onComplete?.()
    }
  }

  return (
    <button
      type="button"
      onClick={tap}
      className="relative mx-auto block aspect-[3/4] w-full max-w-md overflow-hidden rounded-[2rem] bg-[#fff6e8] shadow-[0_20px_50px_rgba(92,26,26,0.08)]"
    >
      <div className="absolute inset-0">
        <InviteNote event={event} />
      </div>
      {!open && (
        <motion.div
          className="absolute inset-0 z-10"
          animate={{ scale: 1 - hits * 0.015 }}
          style={{
            background:
              'radial-gradient(circle at 50% 42%, #f6d36a 0%, #e0a325 45%, #c48412 100%)',
          }}
        >
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {hits >= 1 && <path d="M48 8 L52 38 L44 70" fill="none" stroke="#6b3a00" strokeWidth="0.6" opacity="0.55" />}
            {hits >= 2 && <path d="M20 40 L50 48 L82 36" fill="none" stroke="#6b3a00" strokeWidth="0.55" opacity="0.5" />}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-maroon">
            <span className="font-serif text-5xl">◌</span>
            <p className="mt-6 text-[10px] uppercase tracking-[0.35em]">{event.whisper}</p>
            <p className="mt-2 text-xs text-maroon/60">{hits}/3</p>
          </div>
        </motion.div>
      )}
    </button>
  )
}
