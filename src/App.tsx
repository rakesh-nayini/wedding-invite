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
import { useScrollResponse } from './hooks/useScrollResponse'
import { InviteProvider, useInvite } from './hooks/useInvite'

function startMusic() {
  window.__inviteMusicOff = false
  window.inviteMusicStart?.()
}

function Experience() {
  const { side } = useInvite()
  const [scrolled, setScrolled] = useState(false)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const musicOnRef = useRef(true)
  useScrollResponse(true)

  const markScrolled = useCallback(() => {
    startMusic()
    setScrolled(true)
  }, [])

  const toggleMusic = () => {
    const el = document.getElementById('invite-music') as HTMLAudioElement | null
    const playing = Boolean(el && !el.paused)
    if (playing) {
      musicOnRef.current = false
      window.inviteMusicStop?.()
      setMusicPlaying(false)
      return
    }
    musicOnRef.current = true
    startMusic()
  }

  useEffect(() => {
    const el = document.getElementById('invite-music') as HTMLAudioElement | null
    if (!el) return
    const sync = () => setMusicPlaying(!el.paused && musicOnRef.current)
    el.addEventListener('play', sync)
    el.addEventListener('playing', sync)
    el.addEventListener('pause', sync)
    startMusic()
    return () => {
      el.removeEventListener('play', sync)
      el.removeEventListener('playing', sync)
      el.removeEventListener('pause', sync)
    }
  }, [])

  useEffect(() => {
    const onScroll = () => {
      startMusic()
      if (window.scrollY > 20) setScrolled(true)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="bg-[var(--paper)] text-[var(--ink)]">
      <CustomCursor />
      {scrolled && <ProgressBar />}
      <GlassNav visible={scrolled} />
      {scrolled && (
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
        musicPlaying={musicPlaying}
        onToggleMusic={toggleMusic}
        onPrimeMusic={startMusic}
        onContinue={markScrolled}
      />
      <main key={side}>
        <OurStory />
        <Events />
        <InvitationVideo canPlay={scrolled} />
        <WhenWhere />
        <FamilyTogether />
        <Footer />
        {scrolled && (
          <>
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
