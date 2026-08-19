import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useIsDesktop } from '../hooks/useMediaQuery'

export default function CustomCursor() {
  const desktop = useIsDesktop()
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [hover, setHover] = useState(false)

  useEffect(() => {
    if (!desktop) return
    const move = (e: PointerEvent) => setPos({ x: e.clientX, y: e.clientY })
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement
      setHover(Boolean(t.closest('button, a, [data-magnetic]')))
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerover', over)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
    }
  }, [desktop])

  if (!desktop) return null

  return (
    <>
      <motion.div
        className="pointer-events-none fixed z-[90] h-2 w-2 rounded-full bg-gold mix-blend-difference"
        animate={{ x: pos.x - 4, y: pos.y - 4 }}
        transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.4 }}
      />
      <motion.div
        className="pointer-events-none fixed z-[90] rounded-full border border-gold/70"
        animate={{
          x: pos.x - (hover ? 22 : 16),
          y: pos.y - (hover ? 22 : 16),
          width: hover ? 44 : 32,
          height: hover ? 44 : 32,
        }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      />
    </>
  )
}
