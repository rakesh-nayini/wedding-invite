import type { WeddingEvent } from '../data/wedding'
import EnvelopeReveal from '../components/EnvelopeReveal'
import ScratchCard from '../components/ScratchCard'
import KnotReveal from '../components/KnotReveal'
import LanternReveal from '../components/LanternReveal'
import ToastReveal from '../components/ToastReveal'
import InviteNote from '../components/InviteNote'
import { useInvite } from '../hooks/useInvite'
import { track, type MetricKey } from '../lib/metrics'

function Reveal({
  event,
  onPlayedEvent,
}: {
  event: WeddingEvent
  onPlayedEvent: () => void
}) {
  const { side } = useInvite()
  const done = (metric: MetricKey) => {
    track(side, metric)
    onPlayedEvent()
  }

  switch (event.revealType) {
    case 'scratch':
      return (
        <ScratchCard onComplete={() => done('scratch')}>
          <div className="h-full bg-gradient-to-b from-[#fff8e7] to-[#f6e2a8]">
            <InviteNote event={event} />
          </div>
        </ScratchCard>
      )
    case 'envelope':
      return <EnvelopeReveal event={event} />
    case 'knot':
      return <KnotReveal event={event} onComplete={() => done('knot')} />
    case 'lantern':
      return <LanternReveal event={event} />
    case 'toast':
      return <ToastReveal event={event} onComplete={() => done('toast')} />
    default:
      return null
  }
}

export default function Events({ onPlayedEvent }: { onPlayedEvent: () => void }) {
  const { events } = useInvite()

  return (
    <section id="events" className="bg-[var(--paper)] px-5 py-10">
      <p className="text-center text-[10px] uppercase tracking-[0.4em] text-gold">The celebrations</p>
      <h2 className="mt-2 text-center font-serif text-3xl text-[var(--ink)]">Haldi · Wedding · Reception</h2>
      <p className="mx-auto mt-3 max-w-sm text-center text-[15px] leading-relaxed text-[var(--ink)]/80">
        Three blessings, waiting to be opened.
      </p>

      <div className="mx-auto mt-8 max-w-md space-y-12">
        {events.map((event) => (
          <div key={event.id} id={`event-${event.title.toLowerCase()}`} className="scroll-mt-24">
            <Reveal event={event} onPlayedEvent={onPlayedEvent} />
          </div>
        ))}
      </div>
    </section>
  )
}
