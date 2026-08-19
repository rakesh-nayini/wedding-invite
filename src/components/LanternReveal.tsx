import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { WeddingEvent } from '../data/wedding'
import InviteNote from './InviteNote'

/** Bride Reception — hold to kindle a lamp; warmth fills the card. */
export default function LanternReveal({
  event,
  onComplete,
}: {
  event: WeddingEvent
  onComplete?: () => void
}) {
  const [lit, setLit] = useState(false)
  const [heat, setHeat] = useState(0)
  const hold = useRef<number | null>(null)
  const litRef = useRef(false)

  const lightNow = () => {
    if (litRef.current) return
    litRef.current = true
    setLit(true)
    setHeat(1)
    try {
      navigator.vibrate?.(18)
    } catch {
      /* ignore */
    }
    window.setTimeout(() => onComplete?.(), 400)
  }

  const start = () => {
    if (litRef.current) return
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 1100)
      setHeat(p)
      if (p >= 1) {
        lightNow()
        return
      }
      hold.current = requestAnimationFrame(tick)
    }
    hold.current = requestAnimationFrame(tick)
  }

  const stop = () => {
    if (hold.current) cancelAnimationFrame(hold.current)
    hold.current = null
    if (!lit) setHeat(0)
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <button
        type="button"
        onPointerDown={start}
        onPointerUp={stop}
        onPointerLeave={stop}
        onClick={() => {
          if (!lit) lightNow()
        }}
        className="relative flex h-64 w-full flex-col items-center justify-center overflow-hidden rounded-[2rem] bg-[#fff8f3]"
      >
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: lit ? 0.9 : heat * 0.7 }}
          style={{
            background: 'radial-gradient(circle at 50% 58%, rgba(255,210,140,0.95), rgba(255,248,243,0) 62%)',
          }}
        />
        <motion.div
          className="relative z-10 h-16 w-10 rounded-full bg-gradient-to-b from-[#ffe7b0] to-[#e8a84a]"
          animate={{ scale: lit ? 1.15 : 0.85 + heat * 0.3, opacity: 0.55 + heat * 0.45 }}
        />
        <p className="relative z-10 mt-8 text-[10px] uppercase tracking-[0.35em] text-maroon/50">
          {lit ? 'Lit' : event.whisper}
        </p>
      </button>
      <motion.div animate={lit ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }} className="mt-4 rounded-[2rem] bg-white/85">
        {lit && <InviteNote event={event} />}
      </motion.div>
    </div>
  )
}
