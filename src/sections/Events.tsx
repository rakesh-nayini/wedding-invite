import { useState } from 'react'
import type { WeddingEvent } from '../data/wedding'
import EnvelopeReveal from '../components/EnvelopeReveal'
import ScratchCard from '../components/ScratchCard'
import KnotReveal from '../components/KnotReveal'
import LanternReveal from '../components/LanternReveal'
import ToastReveal from '../components/ToastReveal'
import InviteNote from '../components/InviteNote'
import { useInvite } from '../hooks/useInvite'
import { track, type MetricKey } from '../lib/metrics'
import { jumpToEvent } from '../utils/jumpToEvent'

function eventAnchor(event: WeddingEvent) {
  if (event.revealType === 'scratch') return 'event-haldi'
  if (event.revealType === 'knot') return 'event-wedding'
  if (event.revealType === 'toast') return 'event-reception'
  return `event-${event.id}`
}

function NextLink({ to, label }: { to: string; label: string }) {
  return (
    <button
      type="button"
      onClick={() => jumpToEvent(to)}
      className="mx-auto mt-5 flex min-h-12 w-full max-w-md items-center justify-center rounded-full border-2 border-[#c9a962] bg-[#fff6e8] px-5 py-3 text-center font-serif text-lg text-[#5c1c1c] tap-glow"
    >
      {label}
    </button>
  )
}

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

function EventCard({
  event,
  onPlayedEvent,
}: {
  event: WeddingEvent
  onPlayedEvent: () => void
}) {
  const [opened, setOpened] = useState(false)

  return (
    <div id={eventAnchor(event)} className="scroll-mt-24">
      <h3 className="mb-1 text-center font-serif text-2xl text-[var(--ink)]">{event.title}</h3>
      <p className="mb-4 text-center text-[16px] font-medium leading-snug text-maroon">{event.whisper}</p>
      <Reveal
        event={event}
        onPlayedEvent={() => {
          setOpened(true)
          onPlayedEvent()
        }}
      />
      {opened && event.revealType === 'scratch' && (
        <NextLink to="event-wedding" label="Next — tap to tie the knot" />
      )}
      {opened && event.revealType === 'knot' && (
        <NextLink to="event-reception" label="Next — tap to clink the glasses" />
      )}
    </div>
  )
}

export default function Events({ onPlayedEvent }: { onPlayedEvent: () => void }) {
  const { events } = useInvite()

  return (
    <section id="events" className="bg-[var(--paper)] px-5 py-10">
      <p className="text-center text-[10px] uppercase tracking-[0.4em] text-gold">The celebrations</p>
      <h2 className="mt-2 text-center font-serif text-3xl text-[var(--ink)]">Haldi · Wedding · Reception</h2>
      <p className="mx-auto mt-3 max-w-sm text-center text-[15px] leading-relaxed text-[var(--ink)]/80">
        Three invites. Please tap each gold button so the date can open.
      </p>

      <div className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => jumpToEvent('event-wedding')}
          className="min-h-12 flex-1 rounded-full bg-[#f3d48a] px-4 py-3 font-serif text-base text-[#5c1c1c] tap-glow"
        >
          Tie the knot
        </button>
        <button
          type="button"
          onClick={() => jumpToEvent('event-reception')}
          className="min-h-12 flex-1 rounded-full bg-[#f3d48a] px-4 py-3 font-serif text-base text-[#5c1c1c] tap-glow"
        >
          Clink the glasses
        </button>
      </div>

      <div className="mx-auto mt-8 max-w-md space-y-12">
        {events.map((event) => (
          <EventCard key={event.id} event={event} onPlayedEvent={onPlayedEvent} />
        ))}
      </div>
    </section>
  )
}
