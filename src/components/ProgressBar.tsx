import { useEffect, useState } from 'react'

export default function ProgressBar() {
  const [p, setP] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      setP(h > 0 ? window.scrollY / h : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed left-0 right-0 top-0 z-50 h-[3px] bg-transparent">
      <div className="h-full bg-gold origin-left" style={{ transform: `scaleX(${p})` }} />
    </div>
  )
}
