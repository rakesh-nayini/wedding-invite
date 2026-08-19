import { useCallback, useEffect, useState } from 'react'

const KEY = 'wedding-music-on'

export function useMusicPreference() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    setEnabled(localStorage.getItem(KEY) === '1')
  }, [])

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev
      localStorage.setItem(KEY, next ? '1' : '0')
      return next
    })
  }, [])

  const turnOn = useCallback(() => {
    localStorage.setItem(KEY, '1')
    setEnabled(true)
  }, [])

  return { enabled, toggle, setEnabled, turnOn }
}
