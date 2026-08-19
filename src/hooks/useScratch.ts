import { useCallback, useState } from 'react'

/** Tracks scratch-card completion for Haldi (and reduced-motion skip). */
export function useScratch(threshold = 0.6) {
  const [progress, setProgress] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const report = useCallback(
    (ratio: number) => {
      setProgress(ratio)
      if (ratio >= threshold) setRevealed(true)
    },
    [threshold],
  )

  const reveal = useCallback(() => {
    setProgress(1)
    setRevealed(true)
  }, [])

  return { progress, revealed, report, reveal }
}
