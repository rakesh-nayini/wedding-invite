import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import type { WeddingEvent } from '../data/wedding'
import InviteFrame from './InviteFrame'
import InviteNote from './InviteNote'

function Flute({ stroke }: { stroke: string }) {
  return (
    <>
      <path
        d="M18 10 H38 L34 52 C33 70, 24 80, 28 104"
        fill="none"
        stroke={stroke}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M20 10 H36" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" />
      <path d="M24 104 H32" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" />
      <path d="M21 24 L35 24 L33 50 C32.4 60, 27 66, 28 74" fill={`${stroke}28`} />
    </>
  )
}

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
      particleCount: 42,
      spread: 55,
      origin: { y: 0.48 },
      colors: ['#c9a962', '#ffffff', '#f5e6c8', '#b76e79'],
      scalar: 0.75,
    })
    window.setTimeout(() => onComplete?.(), 700)
  }

  return (
    <InviteFrame className="mx-auto w-full max-w-md">
      <button type="button" onClick={toast} className="w-full text-center">
        <p className="text-[10px] tracking-[0.38em] uppercase text-gold">Reception</p>
        <h3 className="mt-2 font-serif italic text-[1.85rem] leading-tight text-[#5c1c1c]">
          Clink the glasses
        </h3>
        <div className="relative mx-auto mt-4 h-28 w-48">
          <motion.svg
            viewBox="0 0 56 114"
            className="absolute left-4 top-0 h-[7.1rem] w-16"
            animate={cheers ? { x: 22, rotate: 12 } : { x: 0, rotate: -8 }}
            transition={{ type: 'spring', stiffness: 140, damping: 14 }}
            aria-hidden
          >
            <Flute stroke="#C9A962" />
          </motion.svg>
          <motion.svg
            viewBox="0 0 56 114"
            className="absolute right-4 top-0 h-[7.1rem] w-16"
            animate={cheers ? { x: -22, rotate: -12 } : { x: 0, rotate: 8 }}
            transition={{ type: 'spring', stiffness: 140, damping: 14 }}
            aria-hidden
          >
            <Flute stroke="#B76E79" />
          </motion.svg>
        </div>
        {!cheers && (
          <span className="mt-2 inline-block rounded-full bg-[#f3d48a] px-5 py-2.5 font-serif text-[15px] text-[#5c1c1c]">
            Tap here to clink the glasses
          </span>
        )}
      </button>

      <AnimatePresence>
        {cheers && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="mt-1 border-t border-gold/25 pt-5"
          >
            <p className="mb-3 text-center font-serif italic text-lg text-gold">To forever</p>
            <InviteNote event={event} />
          </motion.div>
        )}
      </AnimatePresence>
    </InviteFrame>
  )
}
