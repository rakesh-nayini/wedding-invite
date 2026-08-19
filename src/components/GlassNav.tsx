import { NAV_SECTIONS } from '../data/wedding'

export default function GlassNav({ visible }: { visible: boolean }) {
  if (!visible) return null
  return (
    <nav className="fixed left-1/2 top-4 z-40 hidden -translate-x-1/2 md:block">
      <ul className="glass flex gap-1 rounded-full px-2 py-1.5">
        {NAV_SECTIONS.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className="block rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-maroon/80 hover:text-gold"
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
