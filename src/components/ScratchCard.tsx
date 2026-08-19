import { useCallback, useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import { useReducedMotion } from '../hooks/useMediaQuery'

interface ScratchCardProps {
  children: React.ReactNode
  threshold?: number
  onComplete?: () => void
}

export default function ScratchCard({ children, threshold = 0.35, onComplete }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [done, setDone] = useState(false)
  const scratching = useRef(false)
  const coverLocked = useRef(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const paintCover = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const g = ctx.createLinearGradient(0, 0, width, height)
    g.addColorStop(0, '#f4c430')
    g.addColorStop(0.4, '#d4a017')
    g.addColorStop(1, '#b8860b')
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = g
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = 'rgba(255,255,255,0.18)'
    for (let i = 0; i < 180; i++) {
      ctx.beginPath()
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 3, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.fillStyle = 'rgba(92, 26, 26, 0.55)'
    ctx.font = '600 18px Outfit, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Slide your finger here', width / 2, height / 2)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const resize = () => {
      const rect = wrap.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(rect.width * dpr))
      canvas.height = Math.max(1, Math.floor(rect.height * dpr))
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (!coverLocked.current) paintCover()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [paintCover])

  const revealAll = () => {
    setDone(true)
    try {
      navigator.vibrate?.(20)
    } catch {
      /* ignore */
    }
    void confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.55 },
      colors: ['#f4c430', '#ffd700', '#fff8dc', '#c9a962'],
    })
    onCompleteRef.current?.()
  }

  const scratchAt = (clientX: number, clientY: number) => {
    if (done) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(x, y, 32, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = 'rgba(255, 236, 180, 0.85)'
    for (let i = 0; i < 5; i++) {
      ctx.beginPath()
      ctx.arc(x + (Math.random() - 0.5) * 36, y + (Math.random() - 0.5) * 36, Math.random() * 1.8, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const sampleProgress = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return
    const { width, height } = canvas
    const data = ctx.getImageData(0, 0, width, height).data
    let transparent = 0
    const step = 16
    for (let i = 3; i < data.length; i += 4 * step) {
      if (data[i] < 40) transparent++
    }
    const total = data.length / (4 * step)
    if (transparent / total >= threshold) revealAll()
  }

  const onPointerDown = (e: React.PointerEvent) => {
    coverLocked.current = true
    scratching.current = true
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    scratchAt(e.clientX, e.clientY)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!scratching.current) return
    scratchAt(e.clientX, e.clientY)
  }
  const onPointerUp = () => {
    scratching.current = false
    sampleProgress()
  }

  return (
    <div ref={wrapRef} className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-[2rem] shadow-[0_16px_40px_rgba(92,26,26,0.08)]">
      <div className="absolute inset-0">{children}</div>
      {!done && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-10 touch-none cursor-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        />
      )}
      {(reduced || !done) && (
        <button
          type="button"
          className="absolute bottom-4 right-4 z-20 rounded-full bg-white/90 px-4 py-2 text-[10px] tracking-[0.2em] uppercase text-maroon"
          onClick={revealAll}
        >
          Tap to reveal
        </button>
      )}
    </div>
  )
}
