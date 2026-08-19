import { useCallback, useEffect, useRef, useState } from 'react'
import IntroGate from './sections/IntroGate'
import OurStory from './sections/OurStory'
import InvitationVideo from './sections/InvitationVideo'
import Events from './sections/Events'
import WhenWhere from './sections/WhenWhere'
import Footer from './sections/Footer'
import CustomCursor from './components/CustomCursor'
import ProgressBar from './components/ProgressBar'
import GlassNav from './components/GlassNav'
import InviteDrawer from './components/InviteDrawer'
import Blessings from './components/Blessings'
import { useLenis } from './hooks/useLenis'
import { useScrollResponse } from './hooks/useScrollResponse'
import { useMusicPreference } from './hooks/useMusicPreference'
import { InviteProvider, useInvite } from './hooks/useInvite'
import { asset } from './utils/assets'

const THEME_SRC = asset('assets/audio/theme.mp3')

function Experience() {
  const { side } = useInvite()
  const [opened, setOpened] = useState(false)
  const { enabled: musicOn, toggle: toggleMusicPref, turnOn: turnMusicOn } = useMusicPreference()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const openedRef = useRef(false)
  useLenis(opened)
  useScrollResponse(opened)

  const playMusic = useCallback(() => {
    turnMusicOn()
    const el = audioRef.current
    if (!el) return
    el.muted = false
    el.volume = 0.35
    el.loop = true
    const start = () => {
      void el.play().catch(() => {
        window.setTimeout(() => {
          void el.play().catch(() => {})
        }, 80)
      })
    }
    if (el.readyState >= 2) start()
    else el.addEventListener('canplay', start, { once: true })
    start()
  }, [turnMusicOn])

  const openInvite = useCallback(() => {
    playMusic()
    if (openedRef.current) return
    openedRef.current = true
    setOpened(true)
  }, [playMusic])

  const toggleMusic = () => {
    const el = audioRef.current
    if (musicOn) {
      el?.pause()
      toggleMusicPref()
    } else {
      playMusic()
    }
  }

  useEffect(() => {
    document.body.style.overflow = opened ? '' : 'hidden'
  }, [opened])

  return (
    <div className="bg-[var(--paper)] text-[var(--ink)]">
      <audio ref={audioRef} src={THEME_SRC} loop playsInline preload="auto" className="hidden" />
      <CustomCursor />
      {opened && <ProgressBar />}
      <GlassNav visible={opened} />
      {opened && (
        <button
          type="button"
          onClick={toggleMusic}
          className="fixed left-4 top-4 z-40 rounded-full border border-gold/40 bg-white/80 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-maroon md:left-6"
        >
          Music {musicOn ? 'On' : 'Off'}
        </button>
      )}
      <IntroGate open={opened} onOpen={openInvite} musicOn={musicOn} onToggleMusic={toggleMusic} />
      <main key={side}>
        {opened && (
          <>
            <OurStory />
            <Events />
            <InvitationVideo canPlay={opened} />
            <WhenWhere />
            <Footer />
            <InviteDrawer />
            <Blessings />
          </>
        )}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <InviteProvider>
      <Experience />
    </InviteProvider>
  )
}
