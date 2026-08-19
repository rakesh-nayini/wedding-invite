import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { asset } from '../utils/assets'
import Monogram from './Monogram'
import { useInvite } from '../hooks/useInvite'

export default function InviteDrawer() {
  const [open, setOpen] = useState(false)
  const { events, video, firstName, secondName } = useInvite()

  return (
    <>
      <button
        type="button"
        data-magnetic
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-gold/60 bg-white shadow-xl"
        aria-label="Open invitation details"
      >
        <Monogram size={44} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-maroon/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed inset-x-0 bottom-0 z-50 max-h-[82vh] overflow-y-auto rounded-t-3xl bg-[var(--paper)] p-6 text-[var(--ink)]"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            >
              <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-gold/50" />
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl">
                  {firstName} & {secondName}
                </h2>
                <button type="button" className="text-sm text-gold" onClick={() => setOpen(false)}>
                  Close
                </button>
              </div>
              <ul className="mt-6 space-y-3">
                {events.map((e) => (
                  <li key={e.id} className="glass rounded-2xl p-4">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-gold">{e.date}</p>
                    <p className="mt-1 font-serif text-xl">{e.title}</p>
                    <p className="text-sm text-[var(--muted)]">
                      {e.time} · {e.venue}
                    </p>
                  </li>
                ))}
              </ul>
              <a href={asset(video.src)} className="mt-6 block text-sm underline decoration-gold/50">
                Watch our quick glimpse
              </a>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
