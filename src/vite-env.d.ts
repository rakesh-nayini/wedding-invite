/// <reference types="vite/client" />

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
