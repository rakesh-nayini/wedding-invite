import Monogram from '../components/Monogram'
import { COUPLE, PHOTO_CREDIT } from '../data/wedding'
import { useInvite } from '../hooks/useInvite'

export default function Footer() {
  const { firstName, secondName } = useInvite()
  return (
    <footer className="border-t border-gold/20 bg-[var(--paper)] px-6 py-16 text-center">
      <Monogram className="mx-auto" size={80} />
      <p className="mt-5 font-serif text-2xl text-[var(--ink)]">
        {firstName} <span className="text-gold">&</span> {secondName}
      </p>
      <p className="mt-2 text-sm tracking-[0.2em] text-gold uppercase">{COUPLE.weddingDate}</p>
      <p className="mt-8 text-sm text-[var(--ink)]/75">Photography · {PHOTO_CREDIT}</p>
      <p className="mx-auto mt-6 max-w-sm text-[15px] leading-relaxed text-[var(--ink)]/80">
        Thank you for staying till the end. Your presence with us is the blessing we are hoping for.
      </p>
      <div className="mx-auto mt-8 max-w-md border-t border-gold/35 pt-6">
        <p className="font-serif text-lg leading-snug text-[var(--ink)] md:text-xl">
          Made with the self-interest of the groom,
          <br />
          and the ideas of the bride
        </p>
        <p className="mt-2 text-sm tracking-wide text-maroon md:text-base">to keep their moments forever.</p>
      </div>
    </footer>
  )
}
