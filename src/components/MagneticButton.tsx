import type { ReactNode } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useReducedMotion } from '../hooks/useMediaQuery'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit'
}

export default function MagneticButton({
  children,
  className = '',
  onClick,
  type = 'button',
}: MagneticButtonProps) {
  const reduced = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 180, damping: 14 })
  const springY = useSpring(y, { stiffness: 180, damping: 14 })

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={`relative isolate overflow-hidden min-h-11 px-8 py-3 rounded-full font-sans tracking-[0.22em] uppercase text-xs md:text-sm foil-shine ${
        className || 'border border-gold/60 bg-white/80 text-maroon'
      }`}
      style={reduced ? undefined : { x: springX, y: springY }}
      whileTap={{ scale: 0.97 }}
      onMouseMove={(e) => {
        if (reduced) return
        const rect = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - rect.left - rect.width / 2) * 0.28)
        y.set((e.clientY - rect.top - rect.height / 2) * 0.28)
      }}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}
