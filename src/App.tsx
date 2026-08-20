import { useCallback, useEffect, useRef, useState } from 'react'
import IntroGate from './sections/IntroGate'
import OurStory from './sections/OurStory'
import InvitationVideo from './sections/InvitationVideo'
import Events from './sections/Events'
import WhenWhere from './sections/WhenWhere'
import FamilyTogether from './sections/FamilyTogether'
import Footer from './sections/Footer'
import CustomCursor from './components/CustomCursor'
import ProgressBar from './components/ProgressBar'
import GlassNav from './components/GlassNav'
import InviteDrawer from './components/InviteDrawer'
import Blessings from './components/Blessings'
import { useLenis } from './hooks/useLenis'
import { useScrollResponse } from './hooks/useScrollResponse'
import { InviteProvider, useInvite } from './hooks/useInvite'
import { asset } from './utils/assets'

const THEME_SRC = asset('assets/audio/theme.mp3')
const TARGET_VOLUME = 0.35
const FADE_MS = 2000

function Experience() {
  const { side } = useInvite()
  const [opened, setOpened] = useState(false)
  const [musicOn, setMusicOn] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const openedRef = useRef(false)
  const musicOnRef = useRef(true)
  const fadingRef = useRef(false)
  const fadeRef = useRef<number | null>(null)
  useLenis(opened)
  useScrollResponse(opened)

  const fadeUp = useCallback((el: HTMLAudioElement) => {
    if (el.muted) return
    if (fadingRef.current) return
    fadingRef.current = true
    if (fadeRef.current) cancelAnimationFrame(fadeRef.current)
    const from = el.volume
    const start = performance.now()
    const tick = (now: number) => {
      if (!musicOnRef.current) {
        fadingRef.current = false
        return
      }
      const t = Math.min(1, (now - start) / FADE_MS)
      el.volume = from + (TARGET_VOLUME - from) * t
      if (t < 1) fadeRef.current = requestAnimationFrame(tick)
      else fadingRef.current = false
    }
    fadeRef.current = requestAnimationFrame(tick)
  }, [])

  const ensurePlaying = useCallback(() => {
    if (!musicOnRef.current) return
    const el = audioRef.current
    if (!el) return
    el.loop = true
    const afterPlay = () => {
      el.muted = false
      fadeUp(el)
    }
    if (!el.paused) {
      afterPlay()
      return
    }
    el.volume = 0
    void el
      .play()
      .then(afterPlay)
      .catch(() => {
        el.muted = true
        void el
          .play()
          .then(() => {
            el.muted = false
            fadeUp(el)
          })
          .catch(() => {})
      })
  }, [fadeUp])

  const unlockAudio = useCallback(() => {
    if (!musicOnRef.current) return
    const el = audioRef.current
    if (!el) return
    el.muted = false
    if (el.volume < 0.02) el.volume = 0
    ensurePlaying()
  }, [ensurePlaying])

  const openInvite = useCallback(() => {
    unlockAudio()
    if (openedRef.current) return
    openedRef.current = true
    setOpened(true)
  }, [unlockAudio])

  const toggleMusic = () => {
    const el = audioRef.current
    if (musicOnRef.current) {
      musicOnRef.current = false
      if (fadeRef.current) cancelAnimationFrame(fadeRef.current)
      fadingRef.current = false
      el?.pause()
      setMusicOn(false)
    } else {
      musicOnRef.current = true
      setMusicOn(true)
      if (el) {
        el.muted = false
        if (el.volume < 0.05) el.volume = 0
      }
      ensurePlaying()
    }
  }

  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    el.volume = 0
    el.loop = true
    el.muted = false
    el.setAttribute('playsinline', 'true')
    el.setAttribute('webkit-playsinline', 'true')
    const kick = () => ensurePlaying()
    kick()
    el.addEventListener('canplay', kick)
    el.addEventListener('canplaythrough', kick)
    const events: Array<keyof WindowEventMap> = ['pointerdown', 'touchstart', 'keydown', 'click']
    events.forEach((name) => window.addEventListener(name, unlockAudio, { capture: true }))
    const poll = window.setInterval(() => {
      if (musicOnRef.current && el.paused) kick()
    }, 800)
    return () => {
      el.removeEventListener('canplay', kick)
      el.removeEventListener('canplaythrough', kick)
      events.forEach((name) => window.removeEventListener(name, unlockAudio, { capture: true } as EventListenerOptions))
      window.clearInterval(poll)
      if (fadeRef.current) cancelAnimationFrame(fadeRef.current)
    }
  }, [ensurePlaying, unlockAudio])

  useEffect(() => {
    document.body.style.overflow = opened ? '' : 'hidden'
  }, [opened])

  return (
    <div className="bg-[var(--paper)] text-[var(--ink)]">
      <audio
        ref={audioRef}
        src={THEME_SRC}
        loop
        autoPlay
        playsInline
        preload="auto"
        className="hidden"
      />
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
            <FamilyTogether />
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
