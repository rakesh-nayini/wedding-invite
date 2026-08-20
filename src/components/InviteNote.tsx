import { MUHURTHAM } from '../data/wedding'
import { useInvite } from '../hooks/useInvite'
import type { WeddingEvent } from '../data/wedding'

export default function InviteNote({ event }: { event: WeddingEvent }) {
  const { firstName, secondName, familyLine, side } = useInvite()
  const individual = event.title === 'Haldi'
  const isWedding = event.title === 'Wedding'

  return (
    <div className="flex h-full flex-col items-center justify-center px-2 text-center text-maroon">
      <p className="text-[10px] tracking-[0.42em] uppercase text-gold">{event.title}</p>
      {individual ? (
        <>
          <h3 className="mt-3 font-serif text-4xl leading-tight">{firstName}</h3>
          <p className="mt-2 font-serif italic text-[15px] text-maroon/70">{familyLine}</p>
        </>
      ) : (
        <>
          <h3 className="mt-3 font-serif text-[2.35rem] leading-tight">
            {firstName}
            <span className="mx-2 font-serif italic text-gold">&</span>
            {secondName}
          </h3>
          <p className="mt-2 font-serif italic text-[14px] text-maroon/65">
            {side === 'groom' ? "Nayini's & Hanumandlakadi's Families" : "Hanumandlakadi's & Nayini's Families"}
          </p>
        </>
      )}
      <svg viewBox="0 0 80 12" className="my-4 h-3 w-20" aria-hidden>
        <path d="M2 6 H30" stroke="#C9A962" strokeWidth="0.8" />
        <circle cx="40" cy="6" r="1.6" fill="#C9A962" />
        <path d="M50 6 H78" stroke="#C9A962" strokeWidth="0.8" />
      </svg>
      <p className="font-serif text-xl leading-snug">{event.date}</p>
      <p className="mt-1 font-serif italic text-[15px] text-maroon/75">
        {isWedding ? MUHURTHAM.line : event.time}
      </p>
      <p className="mt-3 text-[14px] leading-relaxed text-maroon/70">{event.venue}</p>
      <p className="mt-4 max-w-xs font-serif italic text-[15px] leading-relaxed text-maroon/60">
        {event.description}
      </p>
    </div>
  )
}
