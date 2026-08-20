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

function startMusic() {
  window.__inviteMusicOff = false
  window.inviteMusicStart?.()
}

function Experience() {
  const { side } = useInvite()
  const [opened, setOpened] = useState(false)
  const [musicOn, setMusicOn] = useState(true)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const openedRef = useRef(false)
  const musicOnRef = useRef(true)
  useLenis(opened)
  useScrollResponse(opened)

  const openInvite = useCallback(() => {
    startMusic()
    if (openedRef.current) return
    openedRef.current = true
    setOpened(true)
  }, [])

  const toggleMusic = () => {
    const el = document.getElementById('invite-music') as HTMLAudioElement | null
    const playing = Boolean(el && !el.paused)
    if (playing) {
      musicOnRef.current = false
      window.inviteMusicStop?.()
      setMusicOn(false)
      setMusicPlaying(false)
      return
    }
    musicOnRef.current = true
    setMusicOn(true)
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
