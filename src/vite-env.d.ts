/// <reference types="vite/client" />

interface Window {
  __inviteMusicOff?: boolean
  inviteMusicStart?: () => boolean
  inviteMusicStop?: () => void
  webkitAudioContext?: typeof AudioContext
}

declare module 'canvas-confetti' {
  interface Options {
    particleCount?: number
    spread?: number
    origin?: { x?: number; y?: number }
    colors?: string[]
    ticks?: number
    gravity?: number
    scalar?: number
  }
  export default function confetti(options?: Options): Promise<null>
}
