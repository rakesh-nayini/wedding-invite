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
const TARGET_VOLUME = 0.35
const FADE_MS = 2500

function inviteAudio() {
  return (document.getElementById('invite-music') as HTMLAudioElement | null) ?? null
}

function Experience() {
  const { side } = useInvite()
  const [opened, setOpened] = useState(false)
  const [musicOn, setMusicOn] = useState(true)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const openedRef = useRef(false)
  const musicOnRef = useRef(true)
  const fadingRef = useRef(false)
  const fadeRef = useRef<number | null>(null)
  useLenis(opened)
  useScrollResponse(opened)

  const fadeUp = useCallback((el: HTMLAudioElement) => {
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

  const startMusic = useCallback(() => {
    if (!musicOnRef.current) return
    const el = inviteAudio()
    if (!el) return
    window.__inviteMusicOff = false
    el.loop = true
    el.muted = false
    if (el.paused) {
      if (el.volume > 0.04) el.volume = 0
      const play = el.play()
      if (play) void play.then(() => fadeUp(el)).catch(() => {})
      return
    }
    if (el.volume < TARGET_VOLUME * 0.9) fadeUp(el)
  }, [fadeUp])

  const openInvite = useCallback(() => {
    startMusic()
    if (openedRef.current) return
    openedRef.current = true
    setOpened(true)
  }, [startMusic])

  const toggleMusic = () => {
    const el = inviteAudio()
    const playing = Boolean(el && !el.paused)
    if (playing) {
      musicOnRef.current = false
      window.__inviteMusicOff = true
      if (fadeRef.current) cancelAnimationFrame(fadeRef.current)
      fadingRef.current = false
      el?.pause()
      setMusicOn(false)
      setMusicPlaying(false)
      return
    }
    musicOnRef.current = true
    window.__inviteMusicOff = false
    setMusicOn(true)
    if (el && el.volume > 0.04) el.volume = 0
    startMusic()
  }

  useEffect(() => {
    const el = inviteAudio()
    if (!el) return
    el.loop = true
    el.muted = false
    const sync = () => setMusicPlaying(!el.paused && musicOnRef.current)
    el.addEventListener('play', sync)
    el.addEventListener('pause', sync)
    startMusic()
    return () => {
      el.removeEventListener('play', sync)
      el.removeEventListener('pause', sync)
      if (fadeRef.current) cancelAnimationFrame(fadeRef.current)
    }
  }, [startMusic])

  useEffect(() => {
    document.body.style.overflow = opened ? '' : 'hidden'
  }, [opened])

  return (
    <div className="bg-[var(--paper)] text-[var(--ink)]">
      <CustomCursor />
      {opened && <ProgressBar />}
      <GlassNav visible={opened} />
      {opened && (
        <button
          type="button"
          data-music-toggle
          onClick={toggleMusic}
          className="fixed left-4 top-4 z-40 rounded-full border border-gold/40 bg-white/80 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-maroon md:left-6"
        >
          {musicPlaying ? 'Music On' : 'Music Off'}
        </button>
      )}
      <IntroGate
        open={opened}
        onOpen={openInvite}
        musicPlaying={musicPlaying}
        musicOn={musicOn}
        onToggleMusic={toggleMusic}
        onPrimeMusic={startMusic}
      />
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
