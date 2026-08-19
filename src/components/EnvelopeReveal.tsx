import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { WeddingEvent } from '../data/wedding'
import InviteNote from './InviteNote'

export default function EnvelopeReveal({
  event,
  onComplete,
}: {
  event: WeddingEvent
  onComplete?: () => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative mx-auto w-full max-w-md">
      <button
        type="button"
        data-magnetic
        onClick={() => {
          if (open) return
          setOpen(true)
          window.setTimeout(() => onComplete?.(), 650)
        }}
        className="relative block w-full text-left"
        aria-expanded={open}
      >
        <div className="relative h-52 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#f7ead4] to-[#e8d2a8] shadow-[0_16px_40px_rgba(92,26,26,0.08)]">
          <div className="absolute inset-x-0 top-0 h-24 origin-top bg-[#ead7b0] [clip-path:polygon(0_0,100%_0,50%_100%)]" />
          <div className="absolute left-1/2 top-[40%] z-10 -translate-x-1/2">
            <motion.div
              animate={open ? { scale: 0.7, rotate: -16, opacity: 0.35 } : { scale: 1 }}
              className="flex h-14 w-14 items-center justify-center rounded-full border border-gold bg-[#fff8e8] font-serif text-lg text-maroon"
            >
              A·R
            </motion.div>
          </div>
          <p className="absolute bottom-6 w-full text-center text-[10px] uppercase tracking-[0.35em] text-maroon/55">
            {open ? 'Opened' : event.whisper}
          </p>
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: 28, opacity: 0 }}
            animate={{ y: -8, opacity: 1 }}
            className="relative z-20 -mt-4 rounded-[2rem] bg-white/90"
          >
            <InviteNote event={event} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
