import type { WeddingEvent } from '../data/wedding'
import EnvelopeReveal from '../components/EnvelopeReveal'
import ScratchCard from '../components/ScratchCard'
import KnotReveal from '../components/KnotReveal'
import LanternReveal from '../components/LanternReveal'
import ToastReveal from '../components/ToastReveal'
import InviteNote from '../components/InviteNote'
import { useInvite } from '../hooks/useInvite'

function Reveal({ event }: { event: WeddingEvent }) {
  switch (event.revealType) {
    case 'scratch':
      return (
        <ScratchCard>
          <div className="h-full bg-gradient-to-b from-[#fff8e7] to-[#f6e2a8]">
            <InviteNote event={event} />
          </div>
        </ScratchCard>
      )
    case 'envelope':
      return <EnvelopeReveal event={event} />
    case 'knot':
      return <KnotReveal event={event} />
    case 'lantern':
      return <LanternReveal event={event} />
    case 'toast':
      return <ToastReveal event={event} />
  }
}

export default function Events() {
  const { events } = useInvite()

  return (
    <section id="events" className="bg-[var(--paper)] px-5 py-10">
      <p className="text-center text-[10px] uppercase tracking-[0.4em] text-gold">The celebrations</p>
      <h2 className="mt-2 text-center font-serif text-3xl text-[var(--ink)]">Haldi · Wedding · Reception</h2>
      <p className="mx-auto mt-2 max-w-sm text-center text-sm text-[var(--muted)]">
        Each card has a small surprise. Follow the line under the title — or tap the button if you prefer.
      </p>

      <div className="mx-auto mt-8 max-w-md space-y-12">
        {events.map((event) => (
          <div key={event.id}>
            <p className="mb-1 text-center text-[10px] uppercase tracking-[0.3em] text-gold">{event.whisper}</p>
            <h3 className="mb-4 text-center font-serif text-2xl text-[var(--ink)]">{event.title}</h3>
            <Reveal event={event} />
          </div>
        ))}
      </div>
    </section>
  )
}
