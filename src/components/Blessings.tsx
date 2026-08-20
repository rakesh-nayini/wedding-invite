import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import confetti from 'canvas-confetti'
import { BLESSINGS } from '../data/wedding'

const FLOWERS = ['❀', '✿', '❁', '✾', '✦']

export default function Blessings() {
  const [text, setText] = useState<string | null>(null)
  const [burstKey, setBurstKey] = useState(0)
  const [hinted, setHinted] = useState(false)

  const bloom = () => {
    setHinted(true)
    const next = BLESSINGS[Math.floor(Math.random() * BLESSINGS.length)]
    setText(next)
    setBurstKey((n) => n + 1)
    void confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.72, x: 0.86 },
      colors: ['#c9a962', '#fff8f0', '#c47a84', '#f4e4b3', '#ffffff'],
      scalar: 0.9,
    })
    window.setTimeout(() => setText(null), 3200)
  }

  return (
    <>
      <button
        type="button"
        onClick={bloom}
        className={`fixed bottom-24 right-4 z-30 flex items-center gap-2 rounded-full border border-gold/50 bg-white px-3 py-2 shadow-lg ${hinted ? '' : 'animate-pulse'}`}
        aria-label="Tap for a blessing"
      >
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#fff6e8] text-lg text-maroon">
          <span className="absolute inset-0 animate-ping rounded-full bg-gold/25" />
          <span className="relative">✿</span>
        </span>
        <span className="pr-1 text-left text-[11px] leading-tight text-maroon">
          Tap for
          <br />
          a blessing
        </span>
      </button>

      <AnimatePresence>
        {text && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-[#3d1c1c]/45" />
            {Array.from({ length: 14 }).map((_, i) => (
              <motion.span
                key={`${burstKey}-${i}`}
                className="absolute text-2xl text-[#f3d48a] md:text-3xl"
                initial={{
                  x: 0,
                  y: 40,
                  opacity: 0,
                  scale: 0.4,
                  rotate: -20,
                }}
                animate={{
                  x: (i % 2 === 0 ? -1 : 1) * (40 + (i % 7) * 28),
                  y: -80 - (i % 5) * 36,
                  opacity: [0, 1, 1, 0],
                  scale: 1,
                  rotate: 25,
                }}
                transition={{ duration: 2.6, ease: 'easeOut', delay: i * 0.04 }}
              >
                {FLOWERS[i % FLOWERS.length]}
              </motion.span>
            ))}
            {Array.from({ length: 18 }).map((_, i) => (
              <motion.span
                key={`spark-${burstKey}-${i}`}
                className="absolute h-1.5 w-1.5 rounded-full bg-[#f3d48a]"
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.4, 0.4],
                  x: Math.cos((i / 18) * Math.PI * 2) * (90 + (i % 4) * 18),
                  y: Math.sin((i / 18) * Math.PI * 2) * (70 + (i % 3) * 16),
                }}
                transition={{ duration: 2.2, delay: i * 0.03, ease: 'easeOut' }}
              />
            ))}
            <motion.p
              className="relative z-10 max-w-[90vw] rounded-[1.5rem] border border-[#f3d48a]/70 bg-[#fffaf4] px-8 py-6 text-center font-serif text-3xl text-[#6b2424] shadow-[0_20px_50px_rgba(61,28,28,0.25)] md:text-5xl"
              initial={{ scale: 0.86, y: 16 }}
              animate={{ scale: [0.86, 1.04, 1], y: 0 }}
              transition={{ duration: 0.55 }}
            >
              {text}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
