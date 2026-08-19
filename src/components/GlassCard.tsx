import type { ReactNode } from 'react'

export default function GlassCard({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`glass rounded-3xl p-6 md:p-8 ${className}`}>{children}</div>
}
