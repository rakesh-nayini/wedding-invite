import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks/useMediaQuery'

type Mode = 'lights' | 'petals' | 'sparkles'

export default function ParticleField({
  mode = 'lights',
  className = '',
  density = 24,
}: {
  mode?: Mode
  className?: string
  density?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    const particles = Array.from({ length: density }, () => spawn(mode, canvas))

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.y += p.vy
        p.x += p.vx
        p.rot += p.vr
        if (p.y > canvas.height + 20) Object.assign(p, spawn(mode, canvas, true))
        draw(ctx, p, mode)
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [density, mode, reduced])

  if (reduced) return null
  return <canvas ref={canvasRef} className={`pointer-events-none absolute inset-0 ${className}`} />
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  a: number
  rot: number
  vr: number
}

function spawn(mode: Mode, canvas: HTMLCanvasElement, fromTop = false): Particle {
  return {
    x: Math.random() * (canvas.width || 400),
    y: fromTop ? -20 : Math.random() * (canvas.height || 400),
    vx: mode === 'petals' ? (Math.random() - 0.5) * 0.6 : (Math.random() - 0.5) * 0.2,
    vy: mode === 'lights' ? -0.15 - Math.random() * 0.25 : 0.4 + Math.random() * 0.8,
    r: mode === 'petals' ? 4 + Math.random() * 6 : 1 + Math.random() * 2.2,
    a: 0.25 + Math.random() * 0.45,
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.04,
  }
}

function draw(ctx: CanvasRenderingContext2D, p: Particle, mode: Mode) {
  ctx.save()
  ctx.globalAlpha = p.a
  ctx.translate(p.x, p.y)
  ctx.rotate(p.rot)
  if (mode === 'petals') {
    ctx.fillStyle = '#f7f1e4'
    ctx.beginPath()
    ctx.ellipse(0, 0, p.r, p.r * 0.45, 0, 0, Math.PI * 2)
    ctx.fill()
  } else {
    ctx.fillStyle = mode === 'sparkles' ? '#f5e6c8' : '#ffe9a8'
    ctx.beginPath()
    ctx.arc(0, 0, p.r, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}
