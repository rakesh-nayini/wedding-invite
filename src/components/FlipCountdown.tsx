import { useEffect, useState } from 'react'
import { COUPLE } from '../data/wedding'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function remaining() {
  const target = new Date(COUPLE.countdownTarget).getTime()
  const diff = Math.max(0, target - Date.now())
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

export default function FlipCountdown({ compact = false }: { compact?: boolean }) {
  const [t, setT] = useState(remaining)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const vis = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', vis)
    return () => document.removeEventListener('visibilitychange', vis)
  }, [])

  useEffect(() => {
    if (!visible) return
    const id = window.setInterval(() => setT(remaining()), 1000)
    return () => window.clearInterval(id)
  }, [visible])

  const units = [
    { label: 'Days', value: pad(t.days) },
    { label: 'Hrs', value: pad(t.hours) },
    { label: 'Min', value: pad(t.minutes) },
    { label: 'Sec', value: pad(t.seconds) },
  ]

  return (
    <div className="grid grid-cols-4 gap-1.5">
      {units.map((u) => (
        <div key={u.label} className="rounded-xl bg-white/80 px-1 py-2 text-center shadow-sm">
          <span className={`block font-serif text-maroon ${compact ? 'text-xl' : 'text-3xl'}`}>{u.value}</span>
          <p className="mt-0.5 text-[8px] uppercase tracking-[0.18em] text-[var(--muted)]">{u.label}</p>
        </div>
      ))}
    </div>
  )
}
