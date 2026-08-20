import { FAMILY_PAGES } from '../data/wedding'
import { useInvite } from '../hooks/useInvite'

export default function FamilyTogether() {
  const { side } = useInvite()
  const page = FAMILY_PAGES[side]

  return (
    <section id="family" className="border-t border-gold/15 bg-[var(--paper)] px-5 py-8">
      <p className="text-center text-[10px] uppercase tracking-[0.4em] text-gold">{page.kicker}</p>
      <h2 className="mt-1 text-center font-serif text-2xl text-[var(--ink)]">{page.title}</h2>
      <p className="mt-1 text-center text-xs text-[var(--muted)]">{page.village}</p>

      <div className="mx-auto mt-5 max-w-md divide-y divide-gold/20 rounded-2xl border border-gold/20 bg-white/50 px-4">
        {page.groups.map((group) => (
          <div key={group.label} className="py-3">
            <p className="text-[10px] uppercase tracking-[0.28em] text-gold">{group.label}</p>
            {group.lines.map((line) => (
              <p key={line} className="mt-1 font-serif text-[15px] leading-snug text-[var(--ink)]">
                {line}
              </p>
            ))}
          </div>
        ))}
        {page.littleOnes && (
          <div className="py-3">
            <p className="text-[10px] uppercase tracking-[0.28em] text-gold">Our little ones</p>
            <p className="mt-1 font-serif text-lg tracking-wide text-maroon">{page.littleOnes.names}</p>
            <p className="mt-1 text-sm leading-relaxed text-[var(--ink)]/75">{page.littleOnes.note}</p>
          </div>
        )}
        {page.favourite && (
          <div className="py-3">
            <p className="text-[10px] uppercase tracking-[0.28em] text-gold">The bride's favourites</p>
            <p className="mt-1 font-serif text-[15px] leading-relaxed text-[var(--ink)]">{page.favourite}</p>
          </div>
        )}
        {page.thanks && (
          <div className="py-3">
            <p className="text-[10px] uppercase tracking-[0.28em] text-gold">Special thanks</p>
            <p className="mt-1 font-serif text-[15px] leading-relaxed text-[var(--ink)]">{page.thanks}</p>
          </div>
        )}
      </div>
    </section>
  )
}
