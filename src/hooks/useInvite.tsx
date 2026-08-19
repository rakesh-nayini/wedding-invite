import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { COUPLE, FAMILIES, eventsFor, VIDEOS, type InviteSide, type WeddingEvent } from '../data/wedding'

interface InviteContextValue {
  side: InviteSide
  setSide: (side: InviteSide) => void
  firstName: string
  secondName: string
  familyLine: string
  otherFamilyLine: string
  events: WeddingEvent[]
  video: (typeof VIDEOS)[InviteSide]
}

const InviteContext = createContext<InviteContextValue | null>(null)

export function parseInviteParam(search = window.location.search): InviteSide | null {
  const value = new URLSearchParams(search).get('invite')?.toLowerCase()
  if (value === 'bride' || value === 'groom') return value
  return null
}

export function InviteProvider({ children }: { children: ReactNode }) {
  const [side, setSideState] = useState<InviteSide>(() => parseInviteParam() ?? 'bride')

  const setSide = (next: InviteSide) => {
    setSideState(next)
    const url = new URL(window.location.href)
    url.searchParams.set('invite', next)
    window.history.replaceState({}, '', url)
  }

  useEffect(() => {
    document.documentElement.dataset.invite = side
    const first = side === 'bride' ? COUPLE.bride : COUPLE.groom
    document.title = `${first} | Wedding Invitation`
  }, [side])

  useEffect(() => {
    const onPop = () => {
      const parsed = parseInviteParam()
      if (parsed) setSideState(parsed)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const value = useMemo<InviteContextValue>(() => {
    const firstName = side === 'bride' ? COUPLE.bride : COUPLE.groom
    const secondName = side === 'bride' ? COUPLE.groom : COUPLE.bride
    return {
      side,
      setSide,
      firstName,
      secondName,
      familyLine: FAMILIES[side].line,
      otherFamilyLine: FAMILIES[side === 'bride' ? 'groom' : 'bride'].line,
      events: eventsFor(side),
      video: VIDEOS[side],
    }
  }, [side])

  return <InviteContext.Provider value={value}>{children}</InviteContext.Provider>
}

export function useInvite() {
  const ctx = useContext(InviteContext)
  if (!ctx) throw new Error('useInvite must be used within InviteProvider')
  return ctx
}
