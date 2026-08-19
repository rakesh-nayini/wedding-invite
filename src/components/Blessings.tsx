import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { BLESSINGS } from '../data/wedding'

export default function Blessings() {
  const [text, setText] = useState<string | null>(null)

  const bloom = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next = BLESSINGS[Math.floor(Math.random() * BLESSINGS.length)]
    setText(next)
    const btn = e.currentTarget
    btn.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }],
      { duration: 420 },
    )
    window.setTimeout(() => setText(null), 2200)
  }

  return (
    <>
      <button
        type="button"
        onClick={bloom}
        className="fixed bottom-24 right-6 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-ivory/90 text-lg shadow-lg"
        aria-label="Receive a Telugu blessing"
        title="Tap for a blessing"
      >
        ✿
      </button>
      <AnimatePresence>
        {text && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="font-serif text-4xl text-gold drop-shadow-lg md:text-6xl">{text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
