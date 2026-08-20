import FlipCountdown from '../components/FlipCountdown'
import { VENUES } from '../data/wedding'
import { useInvite } from '../hooks/useInvite'

function PinIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
      <path
        fill="currentColor"
        d="M16 2.5c-4.6 0-8.3 3.6-8.3 8.1 0 6.2 8.3 18.4 8.3 18.4s8.3-12.2 8.3-18.4c0-4.5-3.7-8.1-8.3-8.1zm0 11a2.9 2.9 0 1 1 0-5.8 2.9 2.9 0 0 1 0 5.8z"
      />
    </svg>
  )
}

function DirectionsIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden>
      <path
        fill="currentColor"
        d="M16.9 4.2 27.8 15a1.3 1.3 0 0 1 0 1.9L16.9 27.8a1.3 1.3 0 0 1-1.8 0L4.2 16.9a1.3 1.3 0 0 1 0-1.8L15.1 4.2a1.3 1.3 0 0 1 1.8 0Zm-1.6 6.3v4.2H10v3h5.3v4.3L21.2 16l-5.9-5.5Z"
      />
    </svg>
  )
}

export default function WhenWhere() {
  const { side } = useInvite()
  const cards = [side === 'bride' ? VENUES.haldiBride : VENUES.gajwel, VENUES.siddipet, VENUES.reception]

  return (
    <section id="when" className="bg-[var(--beige)]/35 px-5 py-10 md:py-14">
      <p className="text-center text-[10px] uppercase tracking-[0.4em] text-gold">Until the vows</p>
      <h2 className="mt-2 text-center font-serif text-2xl text-[var(--ink)]">Counting heartbeats</h2>
      <div className="mx-auto mt-5 w-full max-w-md">
        <FlipCountdown compact />
      </div>

      <p className="mt-10 text-center text-[10px] uppercase tracking-[0.4em] text-gold">When & where</p>
      <p className="mx-auto mt-3 max-w-sm text-center text-sm text-[var(--muted)]">
        If you can come, even for a little while, it will mean so much. Tap for directions.
      </p>
      <div className="mx-auto mt-4 w-full max-w-md space-y-3">
        {cards.map((v) => (
          <a
            key={v.label}
            href={v.mapsUrl ?? '#'}
            target="_blank"
            rel="noreferrer"
            className="glass group flex items-center gap-3 rounded-2xl px-4 py-3.5 transition active:scale-[0.98]"
          >
            <span className="relative flex h-12 w-12 shrink-0 items-center justify-center text-gold">
              <span className="absolute inset-0 animate-ping rounded-full bg-gold/20" />
              <PinIcon />
            </span>
            <span className="min-w-0 flex-1 text-left">
              <span className="block text-[10px] uppercase tracking-[0.28em] text-gold">{v.label}</span>
              <span className="mt-0.5 block font-serif text-lg text-[var(--ink)]">{v.name}</span>
              <span className="block text-xs text-[var(--muted)]">{v.when}</span>
              <span className="mt-0.5 block text-[11px] text-[var(--muted)]">{v.address}</span>
            </span>
            <span className="flex shrink-0 flex-col items-center gap-0.5 text-gold">
              <DirectionsIcon />
              <span className="text-[9px] uppercase tracking-[0.12em] text-maroon/70">Go</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
