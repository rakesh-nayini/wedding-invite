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
const TARGET_VOLUME = 0.35

function Experience() {
  const { side } = useInvite()
  const [opened, setOpened] = useState(false)
  const { enabled: musicOn, toggle: toggleMusicPref, turnOn: turnMusicOn } = useMusicPreference()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const openedRef = useRef(false)
  const fadeRef = useRef<number | null>(null)
  useLenis(opened)
  useScrollResponse(opened)

  const fadeIn = useCallback((el: HTMLAudioElement) => {
    if (fadeRef.current) cancelAnimationFrame(fadeRef.current)
    turnMusicOn()
    el.muted = false
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 4200)
      el.volume = TARGET_VOLUME * t
      if (t < 1) fadeRef.current = requestAnimationFrame(tick)
    }
    fadeRef.current = requestAnimationFrame(tick)
  }, [turnMusicOn])

  const playMusic = useCallback(
    (soft = false) => {
      const el = audioRef.current
      if (!el) return
      el.loop = true
      if (!soft) {
        el.volume = TARGET_VOLUME
        turnMusicOn()
      }
      const start = () => {
        void el.play().then(() => {
          if (soft) fadeIn(el)
        }).catch(() => {})
      }
      start()
    },
    [fadeIn, turnMusicOn],
  )

  const openInvite = useCallback(() => {
    if (openedRef.current) return
    openedRef.current = true
    setOpened(true)
  }, [])

  const toggleMusic = () => {
    const el = audioRef.current
    if (musicOn) {
      if (fadeRef.current) cancelAnimationFrame(fadeRef.current)
      el?.pause()
      toggleMusicPref()
    } else {
      if (el) el.volume = TARGET_VOLUME
      playMusic(false)
    }
  }

  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    el.volume = 0
    const unlock = () => {
      playMusic(true)
    }
    void el
      .play()
      .then(() => fadeIn(el))
      .catch(() => {
        window.addEventListener('pointerdown', unlock, { once: true })
        window.addEventListener('touchstart', unlock, { once: true })
        window.addEventListener('wheel', unlock, { once: true })
      })
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('touchstart', unlock)
      window.removeEventListener('wheel', unlock)
      if (fadeRef.current) cancelAnimationFrame(fadeRef.current)
    }
  }, [fadeIn, playMusic])

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
