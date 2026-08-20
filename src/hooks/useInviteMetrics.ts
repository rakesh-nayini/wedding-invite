import { useEffect, useRef } from 'react'
import { track, type InviteSide, type MetricKey } from '../lib/metrics'

const SECTIONS: Array<{ id: string; metric: MetricKey }> = [
  { id: 'story', metric: 'story' },
  { id: 'events', metric: 'events' },
  { id: 'video', metric: 'video' },
  { id: 'when', metric: 'when' },
  { id: 'family', metric: 'family' },
  { id: 'end', metric: 'end' },
]

export function useInviteMetrics(side: InviteSide, begun: boolean, playedEvent: boolean) {
  const seen = useRef(new Set<string>())
  const begunRef = useRef(begun)
  const playedRef = useRef(playedEvent)
  begunRef.current = begun
  playedRef.current = playedEvent

  useEffect(() => {
    track(side, 'visit')
    const id = window.setTimeout(() => {
      if (!begunRef.current) track(side, 'stuck_visit')
    }, 25000)
    return () => window.clearTimeout(id)
  }, [side])

  useEffect(() => {
    if (!begun) return
    const id = window.setTimeout(() => {
      if (!seen.current.has('story')) track(side, 'stuck_open')
    }, 20000)
    return () => window.clearTimeout(id)
  }, [begun, side])

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    let stuckEventsTimer = 0
    SECTIONS.forEach(({ id, metric }) => {
      const el = document.getElementById(id)
      if (!el) return
      const io = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting && e.intersectionRatio >= 0.18)) return
          if (seen.current.has(id)) return
          seen.current.add(id)
          track(side, metric)
          if (id === 'events') {
            stuckEventsTimer = window.setTimeout(() => {
              if (!playedRef.current) track(side, 'stuck_events')
            }, 45000)
          }
          io.disconnect()
        },
        { threshold: [0.18, 0.35] },
      )
      io.observe(el)
      observers.push(io)
    })
    return () => {
      window.clearTimeout(stuckEventsTimer)
      observers.forEach((o) => o.disconnect())
    }
  }, [side])
}
