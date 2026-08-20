import type { ReactNode } from 'react'

function Flourish({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden>
      <path
        d="M4 32 C 6 18, 18 8, 32 4"
        stroke="#C9A962"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M10 32 C 12 24, 18 16, 28 12"
        stroke="#C9A962"
        strokeWidth="0.7"
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle cx="32" cy="4" r="1.3" fill="#C9A962" />
    </svg>
  )
}

export default function InviteFrame({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[1.85rem] bg-[#fffdf8] shadow-[0_18px_40px_rgba(92,26,26,0.08)] ${className}`}
    >
      <div className="pointer-events-none absolute inset-[10px] rounded-[1.45rem] border border-[#c9a962]/40" />
      <Flourish className="pointer-events-none absolute left-3 top-3 h-8 w-8" />
      <Flourish className="pointer-events-none absolute right-3 top-3 h-8 w-8 rotate-90" />
      <Flourish className="pointer-events-none absolute bottom-3 left-3 h-8 w-8 -rotate-90" />
      <Flourish className="pointer-events-none absolute bottom-3 right-3 h-8 w-8 rotate-180" />
      <div className="relative px-6 py-7 md:px-8 md:py-8">{children}</div>
    </div>
  )
}
