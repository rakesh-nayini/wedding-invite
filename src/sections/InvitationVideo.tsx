import { useRef, useState } from 'react'
import { asset } from '../utils/assets'
import { useInvite } from '../hooks/useInvite'

export default function InvitationVideo({ canPlay }: { canPlay: boolean }) {
  const { video } = useInvite()
  const [muted, setMuted] = useState(true)
  const [ratio, setRatio] = useState('9 / 16')
  const ref = useRef<HTMLVideoElement>(null)
  const src = asset(video.src)

  return (
    <section
      id="video"
      className="relative overflow-hidden bg-[var(--beige)]/40 px-5 py-10 md:py-14"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/20 blur-3xl" />
      <p className="relative text-[10px] uppercase tracking-[0.4em] text-gold">A little film</p>
      <h2 className="relative mt-2 max-w-sm text-center font-serif text-3xl text-[var(--ink)] md:text-4xl">
        A small glimpse, just for you
      </h2>
      <div
        className="relative mx-auto mt-8 w-full max-w-sm overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_60px_rgba(92,26,26,0.08)] md:max-w-md"
        style={{ aspectRatio: ratio, maxHeight: '72svh' }}
      >
        <video
          key={src}
          ref={ref}
          className="h-full w-full object-contain"
          src={src}
          muted={muted}
          autoPlay={canPlay}
          playsInline
          loop
          controls={false}
          onLoadedMetadata={(e) => {
            const el = e.currentTarget
            if (el.videoWidth && el.videoHeight) {
              setRatio(`${el.videoWidth} / ${el.videoHeight}`)
            }
          }}
        />
        <button
          type="button"
          className="absolute bottom-4 right-4 rounded-full bg-white/85 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-maroon"
          onClick={() => {
            setMuted((m) => !m)
            if (ref.current) ref.current.muted = !muted
          }}
        >
          {muted ? 'Unmute' : 'Mute'}
        </button>
      </div>
    </section>
  )
}
