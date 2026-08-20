import { useEffect, useMemo, useState } from 'react'
import {
  fetchCount,
  fetchDay,
  istYmd,
  METRIC_KEYS,
  METRIC_LABELS,
  recentYmds,
  type InviteSide,
  type MetricKey,
} from '../lib/metrics'

type DayCounts = Record<InviteSide, Record<MetricKey, number>>

const emptySide = () =>
  Object.fromEntries(METRIC_KEYS.map((k) => [k, 0])) as Record<MetricKey, number>

function emptyDay(): DayCounts {
  return { bride: emptySide(), groom: emptySide() }
}

function pct(part: number, whole: number) {
  if (!whole) return '—'
  return `${Math.round((part / whole) * 100)}%`
}

function SideColumn({
  title,
  counts,
}: {
  title: string
  counts: Record<MetricKey, number>
}) {
  const visits = counts.visit
  return (
    <div className="rounded-[1.5rem] border border-gold/30 bg-white/80 p-5 shadow-sm">
      <h2 className="font-serif text-2xl text-[var(--ink)]">{title}</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">{visits} opened the link</p>
      <dl className="mt-5 space-y-3">
        {METRIC_KEYS.map((key) => (
          <div key={key} className="flex items-baseline justify-between gap-3 border-b border-gold/15 pb-2">
            <dt className="text-[13px] leading-snug text-[var(--ink)]/85">{METRIC_LABELS[key]}</dt>
            <dd className="font-serif text-xl text-maroon">{counts[key]}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-6 rounded-2xl bg-[#fff6e8] px-4 py-3 text-[13px] leading-relaxed text-maroon">
        <p>Moved on after open: {pct(counts.story, counts.open)}</p>
        <p className="mt-1">Finished the page: {pct(counts.end, counts.visit)}</p>
        <p className="mt-1">
          Looked stuck: {counts.stuck_visit + counts.stuck_open + counts.stuck_events}
        </p>
      </div>
    </div>
  )
}

export default function MetricsPage() {
  const today = istYmd()
  const [ymd, setYmd] = useState(today)
  const [data, setData] = useState<DayCounts>(emptyDay)
  const [week, setWeek] = useState<Array<{ ymd: string; bride: number; groom: number }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tick, setTick] = useState(0)

  useEffect(() => {
    document.title = 'Invite metrics'
    document.documentElement.dataset.invite = 'bride'
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const dayData = await fetchDay(ymd)
        if (cancelled) return
        setData(dayData)
        const rows = []
        for (const d of [...recentYmds(7)].reverse()) {
          if (d === ymd) {
            rows.push({ ymd: d, bride: dayData.bride.visit, groom: dayData.groom.visit })
            continue
          }
          const [bride, groom] = await Promise.all([
            fetchCount('bride', 'visit', d),
            fetchCount('groom', 'visit', d),
          ])
          if (cancelled) return
          rows.push({ ymd: d, bride, groom })
        }
        setWeek(rows)
      } catch {
        if (!cancelled) setError('Could not load counts. Try refresh.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [ymd, tick])

  const weekMax = useMemo(
    () => Math.max(1, ...week.flatMap((w) => [w.bride, w.groom])),
    [week],
  )

  return (
    <div className="min-h-dvh bg-[var(--paper)] px-4 py-8 text-[var(--ink)] md:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-[10px] uppercase tracking-[0.35em] text-gold">Private</p>
        <h1 className="mt-2 font-serif text-4xl">Daily invite metrics</h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[var(--muted)]">
          Bride and groom links are counted separately. Each guest is counted once per visit for each
          action. Dates follow India time.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <label className="text-sm">
            Day
            <input
              type="date"
              value={ymd}
              onChange={(e) => setYmd(e.target.value)}
              className="ml-2 rounded-full border border-gold/40 bg-white px-3 py-2"
            />
          </label>
          <button
            type="button"
            onClick={() => setTick((n) => n + 1)}
            className="rounded-full border border-gold/50 bg-white px-4 py-2 text-sm"
          >
            Refresh
          </button>
          {loading && <span className="text-sm text-[var(--muted)]">Loading…</span>}
        </div>
        {error && <p className="mt-3 text-sm text-maroon">{error}</p>}

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <SideColumn title="Bride side" counts={data.bride} />
          <SideColumn title="Groom side" counts={data.groom} />
        </div>

        <section className="mt-10 rounded-[1.5rem] border border-gold/30 bg-white/80 p-5">
          <h2 className="font-serif text-2xl">Link opens · last 7 days</h2>
          <div className="mt-5 grid grid-cols-7 gap-2">
            {week.map((w) => (
              <div key={w.ymd} className="text-center">
                <div className="flex h-28 items-end justify-center gap-1">
                  <div
                    className="w-3 rounded-t bg-[#7a3038]"
                    style={{ height: `${(w.bride / weekMax) * 100}%` }}
                    title={`Bride ${w.bride}`}
                  />
                  <div
                    className="w-3 rounded-t bg-[#c4a35a]"
                    style={{ height: `${(w.groom / weekMax) * 100}%` }}
                    title={`Groom ${w.groom}`}
                  />
                </div>
                <p className="mt-2 text-[10px] text-[var(--muted)]">{w.ymd.slice(5)}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-[var(--muted)]">Maroon = bride · Gold = groom</p>
        </section>
      </div>
    </div>
  )
}
