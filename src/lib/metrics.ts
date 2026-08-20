export type InviteSide = 'bride' | 'groom'

export const METRIC_KEYS = [
  'visit',
  'open',
  'story',
  'events',
  'scratch',
  'knot',
  'toast',
  'video',
  'when',
  'family',
  'end',
  'stuck_visit',
  'stuck_open',
  'stuck_events',
] as const

export type MetricKey = (typeof METRIC_KEYS)[number]

export const METRIC_LABELS: Record<MetricKey, string> = {
  visit: 'Opened the link',
  open: 'Tapped Open invitation',
  story: 'Reached our story',
  events: 'Reached celebrations',
  scratch: 'Scratched Haldi',
  knot: 'Tied the wedding knot',
  toast: 'Clinked the glasses',
  video: 'Reached the glimpse',
  when: 'Reached when & where',
  family: 'Reached family',
  end: 'Reached the end',
  stuck_visit: 'Stayed on intro, never opened',
  stuck_open: 'Opened, then did not move on',
  stuck_events: 'Saw events, did not try a card',
}

const NAMESPACE = 'asritha-rakesh-wi'
const ABACUS = 'https://abacus.jasoncameron.dev'
const LOCAL_KEY = 'wi-metrics-local-v1'
const SESSION_PREFIX = 'wi-metric-once:'

export function isMetricsInvite(search = window.location.search) {
  return new URLSearchParams(search).get('invite')?.toLowerCase() === 'metrics'
}

export function istYmd(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

export function compactDay(ymd: string) {
  return ymd.replace(/-/g, '')
}

export function counterName(side: InviteSide, metric: MetricKey, ymd: string) {
  return `${side}-${metric.replace(/_/g, '-')}-${compactDay(ymd)}`
}

function bumpLocal(side: InviteSide, metric: MetricKey, ymd: string) {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    const all = raw ? (JSON.parse(raw) as Record<string, number>) : {}
    const key = counterName(side, metric, ymd)
    all[key] = (all[key] ?? 0) + 1
    localStorage.setItem(LOCAL_KEY, JSON.stringify(all))
  } catch {
    /* private mode */
  }
}

export function readLocalCount(side: InviteSide, metric: MetricKey, ymd: string) {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    const all = raw ? (JSON.parse(raw) as Record<string, number>) : {}
    return all[counterName(side, metric, ymd)] ?? 0
  } catch {
    return 0
  }
}

const hitQueue: string[] = []
let pumping = false

async function pumpHits() {
  if (pumping) return
  pumping = true
  while (hitQueue.length) {
    const name = hitQueue.shift()
    if (!name) continue
    try {
      await fetch(`${ABACUS}/hit/${NAMESPACE}/${encodeURIComponent(name)}`)
    } catch {
      /* offline */
    }
    await new Promise((r) => window.setTimeout(r, 320))
  }
  pumping = false
}

export function track(side: InviteSide, metric: MetricKey) {
  if (typeof window === 'undefined') return
  if (isMetricsInvite()) return
  const onceKey = `${SESSION_PREFIX}${side}:${metric}`
  try {
    if (sessionStorage.getItem(onceKey)) return
    sessionStorage.setItem(onceKey, '1')
  } catch {
    /* continue */
  }
  const ymd = istYmd()
  bumpLocal(side, metric, ymd)
  hitQueue.push(counterName(side, metric, ymd))
  void pumpHits()
}

export async function fetchCount(side: InviteSide, metric: MetricKey, ymd: string) {
  const name = counterName(side, metric, ymd)
  try {
    const res = await fetch(`${ABACUS}/get/${NAMESPACE}/${encodeURIComponent(name)}`)
    if (!res.ok) return 0
    const data = (await res.json()) as { value?: number }
    return typeof data.value === 'number' ? data.value : 0
  } catch {
    return readLocalCount(side, metric, ymd)
  }
}

export async function fetchDay(ymd: string) {
  const out: Record<InviteSide, Record<MetricKey, number>> = {
    bride: {} as Record<MetricKey, number>,
    groom: {} as Record<MetricKey, number>,
  }
  const jobs: Array<() => Promise<void>> = []
  for (const side of ['bride', 'groom'] as const) {
    for (const metric of METRIC_KEYS) {
      jobs.push(async () => {
        out[side][metric] = await fetchCount(side, metric, ymd)
      })
    }
  }
  const workers = 4
  let i = 0
  await Promise.all(
    Array.from({ length: workers }, async () => {
      while (i < jobs.length) {
        const job = jobs[i]
        i += 1
        await job()
      }
    }),
  )
  return out
}

export function recentYmds(days: number) {
  const list: string[] = []
  const now = new Date()
  for (let i = 0; i < days; i++) {
    const d = new Date(now.getTime() - i * 86400000)
    list.push(istYmd(d))
  }
  return list
}
