import { useInvite } from '../hooks/useInvite'
import type { WeddingEvent } from '../data/wedding'

export default function InviteNote({ event }: { event: WeddingEvent }) {
  const { firstName, secondName, familyLine, side } = useInvite()
  const individual = event.title === 'Haldi'

  return (
    <div className="flex h-full flex-col items-center justify-center px-7 py-8 text-center text-maroon">
      <p className="text-[10px] tracking-[0.45em] uppercase text-gold">{event.title}</p>
      {individual ? (
        <>
          <h3 className="mt-3 font-serif text-3xl md:text-4xl">{firstName}</h3>
          <p className="mt-2 text-sm text-maroon/70">{familyLine}</p>
        </>
      ) : (
        <>
          <h3 className="mt-3 font-serif text-3xl leading-snug md:text-4xl">
            {firstName}
            <span className="mx-2 text-gold">&</span>
            {secondName}
          </h3>
          <p className="mt-2 text-xs text-maroon/65">
            {side === 'groom' ? "Nayini's & Hanumandlakadi Families" : 'Hanumandlakadi & Nayini Families'}
          </p>
        </>
      )}
      <div className="my-4 h-px w-10 bg-gold/50" />
      <p className="font-serif text-lg">{event.date}</p>
      <p className="mt-1 text-sm text-maroon/70">{event.time}</p>
      <p className="mt-3 text-sm text-maroon/70">{event.venue}</p>
      <p className="mt-4 max-w-xs text-sm leading-relaxed text-maroon/60">{event.description}</p>
    </div>
  )
}
