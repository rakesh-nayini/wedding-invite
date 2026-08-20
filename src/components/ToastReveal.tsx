import { useState } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import type { WeddingEvent } from '../data/wedding'
import InviteNote from './InviteNote'

export default function ToastReveal({
  event,
  onComplete,
}: {
  event: WeddingEvent
  onComplete?: () => void
}) {
  const [cheers, setCheers] = useState(false)

  const toast = () => {
    if (cheers) return
    setCheers(true)
    void confetti({
      particleCount: 45,
      spread: 50,
      origin: { y: 0.45 },
      colors: ['#c9a962', '#ffffff', '#f5e6c8'],
      scalar: 0.8,
    })
    window.setTimeout(() => onComplete?.(), 700)
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <button
        type="button"
        onClick={toast}
        className={`relative flex min-h-64 w-full flex-col items-center justify-center overflow-hidden rounded-[2rem] border-2 px-4 pb-5 pt-8 ${
          cheers ? 'border-gold/30 bg-[#fffaf4]' : 'tap-glow border-[#c9a962] bg-[#fff6e8]'
        }`}
      >
        <motion.span
          className="absolute top-10 h-24 w-14 rounded-b-[2rem] rounded-t-lg border-2 border-gold/70 bg-white/40"
          animate={cheers ? { x: 18, rotate: 12 } : { x: -36, rotate: -8 }}
          transition={{ type: 'spring', stiffness: 160, damping: 14 }}
        />
        <motion.span
          className="absolute top-10 h-24 w-14 rounded-b-[2rem] rounded-t-lg border-2 border-roseGold/70 bg-white/40"
          animate={cheers ? { x: -18, rotate: -12 } : { x: 36, rotate: 8 }}
          transition={{ type: 'spring', stiffness: 160, damping: 14 }}
        />
        {cheers && (
          <motion.span
            className="absolute h-24 w-24 rounded-full border border-gold/40"
            initial={{ scale: 0.4, opacity: 0.8 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 0.9 }}
          />
        )}
        <span className="relative mt-28">
          {cheers ? (
            <span className="font-serif text-lg text-maroon">To forever</span>
          ) : (
            <span className="inline-flex min-h-12 items-center rounded-full bg-[#f3d48a] px-6 py-3 font-serif text-lg text-[#5c1c1c] shadow-[0_8px_20px_rgba(0,0,0,0.12)]">
              Tap to clink the glasses
            </span>
          )}
        </span>
      </button>
      <motion.div animate={cheers ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }} className="mt-4 rounded-[2rem] bg-white/85">
        {cheers && <InviteNote event={event} />}
      </motion.div>
    </div>
  )
}
